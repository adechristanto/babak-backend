import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ example: 'https://storage.example.com/upload-url?signature=...' })
  uploadUrl: string;

  @ApiProperty({ example: 'https://storage.example.com/bucket/listings/uuid.jpg' })
  fileUrl: string;

  @ApiProperty({ example: 'listings/uuid.jpg' })
  key: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;

  constructor(data: {
    uploadUrl: string;
    fileUrl: string;
    key: string;
    expiresIn: number;
  }) {
    this.uploadUrl = data.uploadUrl;
    this.fileUrl = data.fileUrl;
    this.key = data.key;
    this.expiresIn = data.expiresIn;
  }
}
