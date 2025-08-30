import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Hello, is this item still available?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
