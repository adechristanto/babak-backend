import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Listing ID', example: 1 })
  listingId: number;

  @ApiProperty({ description: 'Reviewer ID', example: 1 })
  reviewerId: number;

  @ApiProperty({ description: 'Rating (1-5)', example: 5 })
  rating: number;

  @ApiProperty({ description: 'Review comment', example: 'Great product!' })
  comment?: string;

  @ApiProperty({ description: 'Review creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Reviewer information', type: UserResponseDto })
  reviewer: UserResponseDto;

  constructor(partial: Partial<ReviewResponseDto>) {
    Object.assign(this, partial);
  }
}
