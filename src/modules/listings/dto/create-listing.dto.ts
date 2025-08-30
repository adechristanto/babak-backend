import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsInt, Min, Max, IsDecimal } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateListingDto {
  @ApiProperty({ example: 'iPhone 14 Pro Max' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Brand new iPhone 14 Pro Max, 256GB, Space Black' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 40.7128, description: 'Latitude coordinate' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  latitude?: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude coordinate' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  longitude?: number;
}
