import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresIn: number;
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

@Injectable()
export class UploadsService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('storage.bucket') || 'babak-uploads';
    this.region = this.configService.get<string>('storage.region') || 'us-east-1';
    this.accessKey = this.configService.get<string>('storage.accessKey') || '';
    this.secretKey = this.configService.get<string>('storage.secretKey') || '';
    this.endpoint = this.configService.get<string>('storage.endpoint') || '';
  }

  async generatePresignedUploadUrl(
    fileName: string,
    contentType: string,
    folder: string = 'uploads',
    options: FileValidationOptions = {},
  ): Promise<PresignedUrlResponse> {
    // Validate file
    this.validateFile(fileName, contentType, options);

    // Generate unique key
    const fileExtension = this.getFileExtension(fileName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    // For development, we'll create a mock presigned URL
    // In production, you would integrate with AWS S3 or MinIO
    const uploadUrl = this.generateMockPresignedUrl(key, contentType);
    const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;

    return {
      uploadUrl,
      fileUrl,
      key,
      expiresIn: 3600, // 1 hour
    };
  }

  async generatePresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // For development, return direct URL
    // In production, generate actual presigned URL
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    // In production, implement actual S3/MinIO deletion
    console.log(`Would delete file: ${key}`);
  }

  private validateFile(
    fileName: string,
    contentType: string,
    options: FileValidationOptions,
  ): void {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
      ],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],
    } = options;

    // Check MIME type
    if (!allowedMimeTypes.includes(contentType)) {
      throw new BadRequestException(
        `File type ${contentType} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Check file extension
    const fileExtension = this.getFileExtension(fileName).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
      );
    }

    // Note: File size validation would typically be done on the client side
    // or during the actual upload process
  }

  private getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
  }

  private generateMockPresignedUrl(key: string, contentType: string): string {
    // This is a mock implementation for development
    // In production, you would use AWS SDK or MinIO client to generate actual presigned URLs
    const timestamp = Date.now();
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(`${key}${timestamp}`)
      .digest('hex');

    return `${this.endpoint}/${this.bucket}/${key}?timestamp=${timestamp}&signature=${signature}&content-type=${encodeURIComponent(contentType)}`;
  }

  // Helper method to get optimized image URLs (for future CDN integration)
  getOptimizedImageUrl(
    key: string,
    width?: number,
    height?: number,
    quality?: number,
  ): string {
    let url = `${this.endpoint}/${this.bucket}/${key}`;
    
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return url;
  }

  // Validate image dimensions and file size
  validateImageFile(
    fileName: string,
    contentType: string,
    maxWidth: number = 2048,
    maxHeight: number = 2048,
  ): void {
    this.validateFile(fileName, contentType, {
      maxSize: 5 * 1024 * 1024, // 5MB for images
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    });

    // Additional image-specific validations would go here
    // In a real implementation, you might check actual image dimensions
  }
}
