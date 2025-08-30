import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListingResponseDto } from '../../listings/dto/listing-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class MessageResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Hello, is this item still available?' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  sender: UserResponseDto;

  constructor(partial: Partial<MessageResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ThreadParticipantResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  lastReadAt: Date;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<ThreadParticipantResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ThreadResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  lastMessageAt: Date;

  @ApiProperty({ type: ListingResponseDto })
  @Expose()
  @Type(() => ListingResponseDto)
  listing: ListingResponseDto;

  @ApiProperty({ type: [ThreadParticipantResponseDto] })
  @Expose()
  @Type(() => ThreadParticipantResponseDto)
  participants: ThreadParticipantResponseDto[];

  @ApiProperty({ type: [MessageResponseDto] })
  @Expose()
  @Type(() => MessageResponseDto)
  messages: MessageResponseDto[];

  @ApiProperty({ example: 5, description: 'Number of unread messages for current user' })
  @Expose()
  unreadCount?: number;

  constructor(partial: Partial<ThreadResponseDto>) {
    Object.assign(this, partial);
  }
}
