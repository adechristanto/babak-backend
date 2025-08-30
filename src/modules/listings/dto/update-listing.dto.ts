import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ListingStatus } from '@prisma/client';

export class UpdateListingDto {
  @ApiProperty({ example: 'iPhone 14 Pro Max', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Brand new iPhone 14 Pro Max, 256GB, Space Black', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99, required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 40.7128, description: 'Latitude coordinate', required: false })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  latitude?: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude coordinate', required: false })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  longitude?: number;

  @ApiProperty({ enum: ListingStatus, required: false })
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;
}
