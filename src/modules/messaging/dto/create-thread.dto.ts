import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty({ example: 1, description: 'Listing ID to create thread for' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  listingId: number;

  @ApiProperty({ 
    example: 'Hi! Is this item still available?', 
    description: 'Optional initial message to send',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
