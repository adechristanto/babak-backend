import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEmail, IsPhoneNumber } from 'class-validator';

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

  @ApiProperty({ example: 'Bio description', required: false })
  @IsString()
  @IsOptional()
  bio?: string;
}
