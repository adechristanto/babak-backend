import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEmail, IsPhoneNumber, IsNumber, IsDecimal } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Damascus, Syria', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'Damascus, Syria', required: false })
  @IsString()
  @IsOptional()
  locationAddress?: string;

  @ApiProperty({ example: 'Damascus', required: false })
  @IsString()
  @IsOptional()
  locationCity?: string;

  @ApiProperty({ example: 'Syria', required: false })
  @IsString()
  @IsOptional()
  locationCountry?: string;

  @ApiProperty({ example: 33.5138, required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  locationLatitude?: number;

  @ApiProperty({ example: 36.2765, required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  locationLongitude?: number;

  @ApiProperty({ example: 'ChIJi8mnMiKyGhURuiw1EyBCa2o', required: false })
  @IsString()
  @IsOptional()
  locationPlaceId?: string;

  @ApiProperty({ example: 'Bio description', required: false })
  @IsString()
  @IsOptional()
  bio?: string;
}
