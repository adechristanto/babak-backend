import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListingResponseDto } from '../../listings/dto/listing-response.dto';

export class FavoriteResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  listingId: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  addedAt: Date;

  @ApiProperty({ type: ListingResponseDto })
  @Expose()
  @Type(() => ListingResponseDto)
  listing: ListingResponseDto;

  constructor(partial: Partial<FavoriteResponseDto>) {
    Object.assign(this, partial);
  }
}
