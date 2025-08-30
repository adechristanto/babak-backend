import { ListingResponseDto } from '../../listings/dto/listing-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
export declare class MessageResponseDto {
    id: number;
    content: string;
    createdAt: Date;
    sender: UserResponseDto;
    constructor(partial: Partial<MessageResponseDto>);
}
export declare class ThreadParticipantResponseDto {
    id: number;
    lastReadAt: Date;
    user: UserResponseDto;
    constructor(partial: Partial<ThreadParticipantResponseDto>);
}
export declare class ThreadResponseDto {
    id: number;
    createdAt: Date;
    lastMessageAt: Date;
    listing: ListingResponseDto;
    participants: ThreadParticipantResponseDto[];
    messages: MessageResponseDto[];
    unreadCount?: number;
    constructor(partial: Partial<ThreadResponseDto>);
}
