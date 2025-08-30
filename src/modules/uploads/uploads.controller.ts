import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { UploadRequestDto } from './dto/upload-request.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-url')
  @ApiOperation({ summary: 'Generate presigned URL for file upload' })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL generated successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or parameters' })
  async generatePresignedUrl(
    @Body() uploadRequestDto: UploadRequestDto,
  ): Promise<UploadResponseDto> {
    const { fileName, contentType, folder } = uploadRequestDto;
    
    const result = await this.uploadsService.generatePresignedUploadUrl(
      fileName,
      contentType,
      folder,
    );

    return new UploadResponseDto(result);
  }

  @Post('presigned-url/image')
  @ApiOperation({ summary: 'Generate presigned URL for image upload with validation' })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL for image generated successfully',
    type: UploadResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid image file or parameters' })
  async generateImagePresignedUrl(
    @Body() uploadRequestDto: UploadRequestDto,
  ): Promise<UploadResponseDto> {
    const { fileName, contentType, folder } = uploadRequestDto;
    
    // Validate as image file
    this.uploadsService.validateImageFile(fileName, contentType);
    
    const result = await this.uploadsService.generatePresignedUploadUrl(
      fileName,
      contentType,
      folder,
      {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      },
    );

    return new UploadResponseDto(result);
  }

  @Get('download/*path')
  @ApiOperation({ summary: 'Generate presigned URL for file download' })
  @ApiResponse({ status: 200, description: 'Download URL generated successfully' })
  @ApiParam({ name: 'path', description: 'File path in storage' })
  async generateDownloadUrl(@Param('path') path: string): Promise<{ downloadUrl: string }> {
    const downloadUrl = await this.uploadsService.generatePresignedDownloadUrl(path);
    return { downloadUrl };
  }

  @Delete('*path')
  @ApiOperation({ summary: 'Delete file from storage' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiParam({ name: 'path', description: 'File path in storage' })
  async deleteFile(@Param('path') path: string): Promise<{ message: string }> {
    await this.uploadsService.deleteFile(path);
    return { message: 'File deleted successfully' };
  }
}
