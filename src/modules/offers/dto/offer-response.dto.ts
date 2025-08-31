import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ListingResponseDto } from '../../listings/dto/listing-response.dto';

export class OfferResponseDto {
  @ApiProperty({ description: 'Offer ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Listing ID', example: 1 })
  listingId: number;

  @ApiProperty({ description: 'Buyer ID', example: 1 })
  buyerId: number;

  @ApiProperty({ description: 'Offer amount', example: 150.00 })
  amount: number;

  @ApiProperty({ description: 'Message from buyer', example: 'Hi, I\'m interested in this item.' })
  message: string;

  @ApiProperty({ 
    description: 'Offer status', 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'WITHDRAWN', 'EXPIRED'],
    example: 'PENDING' 
  })
  status: string;

  @ApiProperty({ description: 'Counter offer amount', example: 175.00, required: false })
  counterAmount?: number;

  @ApiProperty({ description: 'Response message from seller', required: false })
  responseMessage?: string;

  @ApiProperty({ description: 'Offer expiration date' })
  expiresAt: Date;

  @ApiProperty({ description: 'Offer creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Offer last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Buyer information', type: UserResponseDto })
  buyer: UserResponseDto;

  @ApiProperty({ description: 'Listing information', type: ListingResponseDto })
  listing: ListingResponseDto;

  constructor(partial: Partial<OfferResponseDto>) {
    Object.assign(this, partial);
  }
}
