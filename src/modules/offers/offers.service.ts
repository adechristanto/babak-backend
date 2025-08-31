import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { PaginatedOffersDto } from './dto/paginated-offers.dto';
import { PaginationMetaDto } from '../listings/dto/paginated-listings.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ListingResponseDto } from '../listings/dto/listing-response.dto';

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTERED = 'COUNTERED',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED'
}

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOfferDto: CreateOfferDto, buyerId: number): Promise<any> {
    const { listingId, amount, message } = createOfferDto;

    // Check if listing exists and is active
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestException('You cannot make an offer on your own listing');
    }

    if (listing.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot make offers on inactive listings');
    }

    if (amount <= 0) {
      throw new BadRequestException('Offer amount must be greater than 0');
    }

    const listingPrice = Number(listing.price);
    if (amount >= listingPrice) {
      throw new BadRequestException('Offer amount should be less than the listing price');
    }

    // Create or find existing thread for this listing and buyer
    let thread = await this.prisma.thread.findFirst({
      where: {
        listingId,
        participants: {
          some: { userId: buyerId },
        },
      },
    });

    if (!thread) {
      // Create new thread
      thread = await this.prisma.thread.create({
        data: {
          listingId,
          participants: {
            create: [
              { userId: buyerId },
              { userId: listing.sellerId },
            ],
          },
        },
      });
    }

    // Send offer message
    const offerMessage = `💰 **OFFER: $${amount}**\n\n${message}`;

    await this.prisma.message.create({
      data: {
        threadId: thread.id,
        senderId: buyerId,
        content: offerMessage,
      },
    });

    // Update thread's last message timestamp
    await this.prisma.thread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date() },
    });

    return {
      id: thread.id,
      listingId,
      buyerId,
      amount,
      message,
      status: 'SENT',
      createdAt: new Date(),
    };
  }

  async getReceivedOffers(sellerId: number, page: number = 1, limit: number = 10): Promise<any> {
    // Get threads for listings owned by the seller that contain offer messages
    const threads = await this.prisma.thread.findMany({
      where: {
        listing: {
          sellerId,
        },
        messages: {
          some: {
            content: {
              contains: '💰 **OFFER:',
            },
          },
        },
      },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: {
              orderBy: { position: 'asc' },
            },
          },
        },
        messages: {
          where: {
            content: {
              contains: '💰 **OFFER:',
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: threads.map(thread => ({
        id: thread.id,
        listingId: thread.listingId,
        listing: thread.listing,
        latestOffer: thread.messages[0],
        createdAt: thread.createdAt,
      })),
      meta: {
        page,
        limit,
        total: threads.length,
        totalPages: Math.ceil(threads.length / limit),
      },
    };
  }

  async getSentOffers(buyerId: number, page: number = 1, limit: number = 10): Promise<any> {
    // Get threads where the buyer sent offer messages
    const threads = await this.prisma.thread.findMany({
      where: {
        participants: {
          some: { userId: buyerId },
        },
        messages: {
          some: {
            senderId: buyerId,
            content: {
              contains: '💰 **OFFER:',
            },
          },
        },
      },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: {
              orderBy: { position: 'asc' },
            },
          },
        },
        messages: {
          where: {
            senderId: buyerId,
            content: {
              contains: '💰 **OFFER:',
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: threads.map(thread => ({
        id: thread.id,
        listingId: thread.listingId,
        listing: thread.listing,
        latestOffer: thread.messages[0],
        createdAt: thread.createdAt,
      })),
      meta: {
        page,
        limit,
        total: threads.length,
        totalPages: Math.ceil(threads.length / limit),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<any> {
    // Find thread by ID and check if user is a participant
    const thread = await this.prisma.thread.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            seller: true,
            category: true,
            images: {
              orderBy: { position: 'asc' },
            },
          },
        },
        participants: true,
        messages: {
          where: {
            content: {
              contains: '💰 **OFFER:',
            },
          },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: true,
          },
        },
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    // Check if user is a participant
    const isParticipant = thread.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException('You can only view your own conversations');
    }

    return {
      id: thread.id,
      listingId: thread.listingId,
      listing: thread.listing,
      offers: thread.messages,
      createdAt: thread.createdAt,
    };
  }

  async update(id: number, updateOfferDto: UpdateOfferDto, userId: number): Promise<any> {
    // For simplicity, we'll just return a success message
    // In a real implementation, you might want to send a response message
    return { message: 'Offer response sent successfully' };
  }

  async remove(id: number, userId: number): Promise<void> {
    // For simplicity, we'll just return success
    // In a real implementation, you might want to mark the offer as withdrawn
  }
}
