import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ThreadResponseDto, MessageResponseDto } from './dto/thread-response.dto';
export declare class MessagingService {
    private readonly prisma;
    private readonly notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createThread(createThreadDto: CreateThreadDto, userId: number): Promise<ThreadResponseDto>;
    sendMessage(threadId: number, sendMessageDto: SendMessageDto, userId: number): Promise<MessageResponseDto>;
    getThreads(userId: number): Promise<ThreadResponseDto[]>;
    getThread(threadId: number, userId: number): Promise<ThreadResponseDto>;
    markAsRead(threadId: number, userId: number): Promise<void>;
    getMessages(threadId: number, userId: number, page?: number, limit?: number): Promise<MessageResponseDto[]>;
    deleteThread(threadId: number, userId: number): Promise<void>;
    deleteMessage(threadId: number, messageId: number, userId: number): Promise<void>;
    private mapToThreadResponseDto;
}
