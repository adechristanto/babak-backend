import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min, IsNumber, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AttributeType, AttributeDataType } from '@prisma/client';

export class CreateListingAttributeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  attributeId: number;

  @ApiProperty({ example: '3', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ example: 3.5, required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  numericValue?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  booleanValue?: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  dateValue?: string;

  @ApiProperty({ 
    example: ['option1', 'option2'], 
    required: false,
    description: 'JSON value for complex data types'
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  jsonValue?: any;
}

export class UpdateListingAttributeDto {
  @ApiProperty({ example: '3', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ example: 3.5, required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  numericValue?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  booleanValue?: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  dateValue?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  jsonValue?: any;
}

export class ListingAttributeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  listingId: number;

  @ApiProperty({ example: 1 })
  attributeId: number;

  @ApiProperty({ example: '3', nullable: true })
  value: string | null;

  @ApiProperty({ example: 3.5, nullable: true })
  numericValue: number | null;

  @ApiProperty({ example: true, nullable: true })
  booleanValue: boolean | null;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', nullable: true })
  dateValue: Date | null;

  @ApiProperty({ example: ['option1', 'option2'], nullable: true })
  jsonValue: any;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  // Include attribute definition for convenience
  @ApiProperty({ required: false })
  attribute?: {
    id: number;
    name: string;
    key: string;
    type: AttributeType;
    dataType: AttributeDataType;
    unit: string | null;
    options: any;
  };

  constructor(partial: Partial<ListingAttributeResponseDto>) {
    Object.assign(this, partial);
  }
}

// DTO for bulk attribute operations
export class BulkListingAttributesDto {
  @ApiProperty({ 
    type: [CreateListingAttributeDto],
    description: 'Array of attributes to create/update'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateListingAttributeDto)
  attributes: CreateListingAttributeDto[];
}

// DTO for attribute validation
export class ValidateAttributeValueDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  attributeId: number;

  @ApiProperty({ example: '3' })
  @IsString()
  value: string;
}

// DTO for attribute search filters
export class AttributeFilterDto {
  @ApiProperty({ example: 'bedrooms', description: 'Attribute key' })
  @IsString()
  key: string;

  @ApiProperty({ example: '3', required: false, description: 'Exact value match' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ example: 1, required: false, description: 'Minimum numeric value' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  minValue?: number;

  @ApiProperty({ example: 5, required: false, description: 'Maximum numeric value' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  maxValue?: number;

  @ApiProperty({ example: true, required: false, description: 'Boolean value' })
  @IsBoolean()
  @IsOptional()
  booleanValue?: boolean;

  @ApiProperty({ 
    example: ['option1', 'option2'], 
    required: false,
    description: 'Array of values for multiselect'
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  values?: string[];
}

// Enhanced search DTO that includes attribute filters
export class EnhancedSearchListingsDto {
  @ApiProperty({ example: 'iPhone', required: false })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiProperty({ example: 1000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 40.7128, required: false, description: 'Latitude for radius search' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  latitude?: number;

  @ApiProperty({ example: -74.0060, required: false, description: 'Longitude for radius search' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  longitude?: number;

  @ApiProperty({ example: 25, required: false, description: 'Search radius in kilometers' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  radiusKm?: number;

  @ApiProperty({ 
    type: [AttributeFilterDto],
    required: false,
    description: 'Category-specific attribute filters'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeFilterDto)
  @IsOptional()
  attributeFilters?: AttributeFilterDto[];

  @ApiProperty({ example: 1, required: false, minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, minimum: 1, maximum: 100, default: 20 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
