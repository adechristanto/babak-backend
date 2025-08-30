import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class AddImageDto {
  @ApiProperty({ example: 'listings/uuid.jpg' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'https://storage.example.com/bucket/listings/uuid.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 0, required: false, description: 'Position in image gallery' })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;
}
