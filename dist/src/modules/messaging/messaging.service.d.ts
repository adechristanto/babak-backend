import { PrismaService } from '../../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ThreadResponseDto, MessageResponseDto } from './dto/thread-response.dto';
export declare class MessagingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createThread(createThreadDto: CreateThreadDto, userId: number): Promise<ThreadResponseDto>;
    sendMessage(threadId: number, sendMessageDto: SendMessageDto, userId: number): Promise<MessageResponseDto>;
    getThreads(userId: number): Promise<ThreadResponseDto[]>;
    getThread(threadId: number, userId: number): Promise<ThreadResponseDto>;
    markAsRead(threadId: number, userId: number): Promise<void>;
    getMessages(threadId: number, userId: number, page?: number, limit?: number): Promise<MessageResponseDto[]>;
    private mapToThreadResponseDto;
}
