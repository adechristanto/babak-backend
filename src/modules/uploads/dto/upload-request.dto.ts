import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum UploadFolder {
  LISTINGS = 'listings',
  AVATARS = 'avatars',
  DOCUMENTS = 'documents',
}

export class UploadRequestDto {
  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ enum: UploadFolder, default: UploadFolder.LISTINGS })
  @IsEnum(UploadFolder)
  @IsOptional()
  folder?: UploadFolder = UploadFolder.LISTINGS;
}
