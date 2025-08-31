import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString, IsPositive, MaxLength } from 'class-validator';

export enum OfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COUNTERED = 'COUNTERED',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED'
}

export class UpdateOfferDto {
  @ApiProperty({
    description: 'New status for the offer',
    enum: OfferStatus,
    example: OfferStatus.ACCEPTED,
  })
  @IsEnum(OfferStatus)
  status: OfferStatus;

  @ApiProperty({
    description: 'Counter offer amount (only when status is COUNTERED)',
    example: 175.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  counterAmount?: number;

  @ApiProperty({
    description: 'Response message from seller',
    example: 'Thanks for your offer! I can accept $175.',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  responseMessage?: string;
}
