import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsInt, Min, Max, IsEnum, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ListingStatus } from '@prisma/client';

export enum SortBy {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
  TITLE = 'title',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchListingsDto {
  @ApiProperty({ example: 'iPhone', required: false, description: 'Search query for title and description' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ example: 1, required: false, description: 'Category ID to filter by' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ example: 100, required: false, description: 'Minimum price' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiProperty({ example: 1000, required: false, description: 'Maximum price' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @ApiProperty({ example: 'New York', required: false, description: 'City to filter by' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ enum: ListingStatus, required: false, default: ListingStatus.ACTIVE })
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus = ListingStatus.ACTIVE;

  @ApiProperty({ example: true, required: false, description: 'Filter VIP listings only' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isVip?: boolean;

  @ApiProperty({ example: true, required: false, description: 'Filter featured listings only' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

  @ApiProperty({ enum: SortBy, required: false, default: SortBy.CREATED_AT })
  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy = SortBy.CREATED_AT;

  @ApiProperty({ enum: SortOrder, required: false, default: SortOrder.DESC })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiProperty({ example: 1, required: false, minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiProperty({ example: 1, required: false, description: 'Seller ID to filter by' })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  sellerId?: number;
}
