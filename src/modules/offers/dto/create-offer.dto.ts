import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsPositive, MinLength, MaxLength } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({
    description: 'ID of the listing to make an offer on',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  listingId: number;

  @ApiProperty({
    description: 'Offer amount in dollars',
    example: 150.00,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Message to the seller explaining the offer',
    example: 'Hi, I\'m very interested in this item. Would you consider this offer?',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  message: string;
}
