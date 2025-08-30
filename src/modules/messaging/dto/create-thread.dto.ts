import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty({ example: 1, description: 'Listing ID to create thread for' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  listingId: number;
}
