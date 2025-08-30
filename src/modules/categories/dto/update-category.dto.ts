import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Electronics', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'electronics', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 1, required: false, description: 'Parent category ID' })
  @IsInt()
  @Min(1)
  @IsOptional()
  parentId?: number;
}
