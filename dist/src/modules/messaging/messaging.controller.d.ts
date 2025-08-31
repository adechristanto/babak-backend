import { MessagingService } from './messaging.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ThreadResponseDto, MessageResponseDto } from './dto/thread-response.dto';
export declare class MessagingController {
    private readonly messagingService;
    constructor(messagingService: MessagingService);
    createThread(createThreadDto: CreateThreadDto, req: any): Promise<ThreadResponseDto>;
    getThreads(req: any): Promise<ThreadResponseDto[]>;
    getThread(id: number, req: any): Promise<ThreadResponseDto>;
    sendMessage(id: number, sendMessageDto: SendMessageDto, req: any): Promise<MessageResponseDto>;
    markAsRead(id: number, req: any): Promise<{
        message: string;
    }>;
    getMessages(id: number, page: number | undefined, limit: number | undefined, req: any): Promise<MessageResponseDto[]>;
    deleteThread(id: number, req: any): Promise<{
        message: string;
    }>;
    deleteMessage(threadId: number, messageId: number, req: any): Promise<{
        message: string;
    }>;
}
