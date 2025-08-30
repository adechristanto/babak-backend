import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ListingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ThreadResponseDto, MessageResponseDto, ThreadParticipantResponseDto } from './dto/thread-response.dto';
import { ListingResponseDto } from '../listings/dto/listing-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';

@Injectable()
export class MessagingService {
  constructor(private readonly prisma: PrismaService) {}

  async createThread(createThreadDto: CreateThreadDto, userId: number): Promise<ThreadResponseDto> {
    const { listingId } = createThreadDto;

    // Check if listing exists and is active
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: true,
        category: true,
        images: { orderBy: { position: 'asc' } },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException('Cannot message about inactive listings');
    }

    if (listing.sellerId === userId) {
      throw new BadRequestException('Cannot create thread with yourself');
    }

    // Check if thread already exists between these users for this listing
    const existingThread = await this.prisma.thread.findFirst({
      where: {
        listingId,
        participants: {
          every: {
            userId: { in: [userId, listing.sellerId] },
          },
        },
      },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: { orderBy: { position: 'asc' } },
          },
        },
        participants: { include: { user: true } },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (existingThread) {
      return this.mapToThreadResponseDto(existingThread, userId);
    }

    // Create new thread
    const thread = await this.prisma.thread.create({
      data: {
        listingId,
        participants: {
          create: [
            { userId },
            { userId: listing.sellerId },
          ],
        },
      },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: { orderBy: { position: 'asc' } },
          },
        },
        participants: { include: { user: true } },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return this.mapToThreadResponseDto(thread, userId);
  }

  async sendMessage(threadId: number, sendMessageDto: SendMessageDto, userId: number): Promise<MessageResponseDto> {
    const { content } = sendMessageDto;

    // Check if thread exists and user is participant
    const thread = await this.prisma.thread.findFirst({
      where: {
        id: threadId,
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: true,
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found or access denied');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        threadId,
        senderId: userId,
        content,
      },
      include: {
        sender: true,
      },
    });

    // Update thread's last message timestamp
    await this.prisma.thread.update({
      where: { id: threadId },
      data: { lastMessageAt: new Date() },
    });

    // Update last read timestamp for sender
    await this.prisma.threadParticipant.updateMany({
      where: {
        threadId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return new MessageResponseDto({
      ...message,
      sender: new UserResponseDto(message.sender),
    });
  }

  async getThreads(userId: number): Promise<ThreadResponseDto[]> {
    const threads = await this.prisma.thread.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: { orderBy: { position: 'asc' } },
          },
        },
        participants: { include: { user: true } },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
          take: 1, // Only get the last message for thread list
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return threads.map(thread => this.mapToThreadResponseDto(thread, userId));
  }

  async getThread(threadId: number, userId: number): Promise<ThreadResponseDto> {
    const thread = await this.prisma.thread.findFirst({
      where: {
        id: threadId,
        participants: {
          some: { userId },
        },
      },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: { orderBy: { position: 'asc' } },
          },
        },
        participants: { include: { user: true } },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found or access denied');
    }

    return this.mapToThreadResponseDto(thread, userId);
  }

  async markAsRead(threadId: number, userId: number): Promise<void> {
    // Check if user is participant
    const participant = await this.prisma.threadParticipant.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (!participant) {
      throw new NotFoundException('Thread not found or access denied');
    }

    // Update last read timestamp
    await this.prisma.threadParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    });
  }

  async getMessages(threadId: number, userId: number, page: number = 1, limit: number = 50): Promise<MessageResponseDto[]> {
    // Check if user is participant
    const thread = await this.prisma.thread.findFirst({
      where: {
        id: threadId,
        participants: {
          some: { userId },
        },
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found or access denied');
    }

    const skip = (page - 1) * limit;

    const messages = await this.prisma.message.findMany({
      where: { threadId },
      include: { sender: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return messages.map(message => new MessageResponseDto({
      ...message,
      sender: new UserResponseDto(message.sender),
    }));
  }

  private mapToThreadResponseDto(thread: any, currentUserId: number): ThreadResponseDto {
    // Calculate unread count
    const participant = thread.participants.find((p: any) => p.userId === currentUserId);
    const unreadCount = thread.messages.filter((message: any) => 
      message.createdAt > participant?.lastReadAt && message.senderId !== currentUserId
    ).length;

    return new ThreadResponseDto({
      ...thread,
      listing: new ListingResponseDto({
        ...thread.listing,
        seller: new UserResponseDto(thread.listing.seller),
        category: thread.listing.category ? new CategoryResponseDto(thread.listing.category) : null,
      }),
      participants: thread.participants.map((p: any) => new ThreadParticipantResponseDto({
        ...p,
        user: new UserResponseDto(p.user),
      })),
      messages: thread.messages.map((message: any) => new MessageResponseDto({
        ...message,
        sender: new UserResponseDto(message.sender),
      })),
      unreadCount,
    });
  }
}
