import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, IsEnum, IsJSON, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { AttributeType, AttributeDataType } from '@prisma/client';

export class CreateCategoryAttributeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  categoryId: number;

  @ApiProperty({ example: 'Bedrooms' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'bedrooms' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ enum: AttributeType, example: AttributeType.NUMBER })
  @IsEnum(AttributeType)
  type: AttributeType;

  @ApiProperty({ enum: AttributeDataType, example: AttributeDataType.INTEGER })
  @IsEnum(AttributeDataType)
  dataType: AttributeDataType;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  required?: boolean = false;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  searchable?: boolean = true;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  sortable?: boolean = false;

  @ApiProperty({ 
    example: ['Option 1', 'Option 2'], 
    required: false,
    description: 'Options for SELECT/MULTISELECT types'
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  options?: any;

  @ApiProperty({ 
    example: { min: 1, max: 10 }, 
    required: false,
    description: 'Validation rules'
  })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  validation?: any;

  @ApiProperty({ example: 'm²', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ example: 'Enter number of bedrooms', required: false })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ example: 'Number of bedrooms in the property', required: false })
  @IsString()
  @IsOptional()
  helpText?: string;

  @ApiProperty({ example: 1, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number = 0;
}

export class UpdateCategoryAttributeDto {
  @ApiProperty({ example: 'Bedrooms', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'bedrooms', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  key?: string;

  @ApiProperty({ enum: AttributeType, required: false })
  @IsEnum(AttributeType)
  @IsOptional()
  type?: AttributeType;

  @ApiProperty({ enum: AttributeDataType, required: false })
  @IsEnum(AttributeDataType)
  @IsOptional()
  dataType?: AttributeDataType;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  searchable?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  sortable?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  options?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  validation?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  helpText?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}

export class CategoryAttributeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ example: 'Bedrooms' })
  name: string;

  @ApiProperty({ example: 'bedrooms' })
  key: string;

  @ApiProperty({ enum: AttributeType })
  type: AttributeType;

  @ApiProperty({ enum: AttributeDataType })
  dataType: AttributeDataType;

  @ApiProperty({ example: false })
  required: boolean;

  @ApiProperty({ example: true })
  searchable: boolean;

  @ApiProperty({ example: false })
  sortable: boolean;

  @ApiProperty({ example: ['Option 1', 'Option 2'], nullable: true })
  options: any;

  @ApiProperty({ example: { min: 1, max: 10 }, nullable: true })
  validation: any;

  @ApiProperty({ example: 'm²', nullable: true })
  unit: string | null;

  @ApiProperty({ example: 'Enter number of bedrooms', nullable: true })
  placeholder: string | null;

  @ApiProperty({ example: 'Number of bedrooms in the property', nullable: true })
  helpText: string | null;

  @ApiProperty({ example: 1 })
  displayOrder: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<CategoryAttributeResponseDto>) {
    Object.assign(this, partial);
  }
}
