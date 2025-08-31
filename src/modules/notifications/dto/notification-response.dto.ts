import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NotificationResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'NEW_MESSAGE' })
  @Expose()
  type: string;

  @ApiProperty({ example: 'You have a new message' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'John Doe sent you a message about iPhone 14' })
  @Expose()
  body: string | null;

  @ApiProperty({ example: '/messages/123', required: false })
  @Expose()
  actionUrl: string | null;

  @ApiProperty({ example: false })
  @Expose()
  read: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  constructor(partial: Partial<NotificationResponseDto>) {
    Object.assign(this, partial);
  }
}
