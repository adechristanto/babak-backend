import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({ example: 1, required: false, description: 'New position in image gallery' })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}
