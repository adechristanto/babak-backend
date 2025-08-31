import { IsInt, IsString, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Listing ID', example: 1 })
  @IsInt()
  @IsNotEmpty()
  listingId: number;

  @ApiProperty({ description: 'Rating (1-5)', example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review comment', example: 'Great product, highly recommended!' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;
}
