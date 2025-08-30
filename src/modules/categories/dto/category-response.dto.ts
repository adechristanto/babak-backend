import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Electronics' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'electronics' })
  @Expose()
  slug: string;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  parentId: number | null;

  @ApiProperty({ example: 0 })
  @Expose()
  depth: number;

  @ApiProperty({ example: 'electronics' })
  @Expose()
  path: string | null;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: [CategoryResponseDto], required: false })
  @Expose()
  children?: CategoryResponseDto[];

  @ApiProperty({ type: CategoryResponseDto, required: false })
  @Expose()
  parent?: CategoryResponseDto;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
