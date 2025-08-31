import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsInt, Min, Max, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ListingCondition, NegotiableStatus } from '@prisma/client';
import { CreateListingAttributeDto } from './listing-attribute.dto';

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
  @Transform(({ value }) => parseFloat(value as string))
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
  @Transform(({ value }) => parseFloat(value as string))
  latitude?: number;

  @ApiProperty({ example: -74.0060, description: 'Longitude coordinate' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value as string))
  longitude?: number;

  @ApiProperty({ example: '123 Main St, New York, NY 10001, USA' })
  @IsString()
  @IsOptional()
  locationAddress?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsOptional()
  locationCity?: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsOptional()
  locationCountry?: string;

  @ApiProperty({ example: 'ChIJOwg_06VPwokRYv534QaPC8g' })
  @IsString()
  @IsOptional()
  locationPlaceId?: string;

  @ApiProperty({ 
    enum: ListingCondition, 
    example: ListingCondition.GOOD,
    description: 'Condition of the item',
    default: ListingCondition.GOOD
  })
  @IsEnum(ListingCondition)
  @IsOptional()
  condition?: ListingCondition = ListingCondition.GOOD;

  @ApiProperty({
    enum: NegotiableStatus,
    example: NegotiableStatus.FIXED_PRICE,
    description: 'Price negotiation status',
    default: NegotiableStatus.FIXED_PRICE
  })
  @IsEnum(NegotiableStatus)
  @IsOptional()
  negotiable?: NegotiableStatus = NegotiableStatus.FIXED_PRICE;

  @ApiProperty({
    type: [CreateListingAttributeDto],
    description: 'Category-specific attributes for the listing',
    required: false
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateListingAttributeDto)
  @IsOptional()
  attributes?: CreateListingAttributeDto[];
}
