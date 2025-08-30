import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ListingStatus } from '@prisma/client';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class ListingImageResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @Expose()
  url: string;

  @ApiProperty({ example: 0 })
  @Expose()
  position: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  constructor(partial: Partial<ListingImageResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ListingResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'iPhone 14 Pro Max' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Brand new iPhone 14 Pro Max, 256GB, Space Black' })
  @Expose()
  description: string | null;

  @ApiProperty({ example: 999.99 })
  @Expose()
  price: number;

  @ApiProperty({ example: 'USD' })
  @Expose()
  currency: string;

  @ApiProperty({ example: 'New York' })
  @Expose()
  city: string | null;

  @ApiProperty({ example: 40.7128 })
  @Expose()
  latitude: number | null;

  @ApiProperty({ example: -74.0060 })
  @Expose()
  longitude: number | null;

  @ApiProperty({ enum: ListingStatus })
  @Expose()
  status: ListingStatus;

  @ApiProperty({ example: false })
  @Expose()
  isVip: boolean;

  @ApiProperty({ example: false })
  @Expose()
  isFeatured: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: '2023-12-31T23:59:59.000Z', nullable: true })
  @Expose()
  expiresAt: Date | null;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  seller: UserResponseDto;

  @ApiProperty({ type: CategoryResponseDto, nullable: true })
  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto | null;

  @ApiProperty({ type: [ListingImageResponseDto] })
  @Expose()
  @Type(() => ListingImageResponseDto)
  images: ListingImageResponseDto[];

  constructor(partial: Partial<ListingResponseDto>) {
    Object.assign(this, partial);
  }
}
