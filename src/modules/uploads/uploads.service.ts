import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, DeleteObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
export class UploadsService implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('storage.bucket') || 'babak-uploads';
    this.region = this.configService.get<string>('storage.region') || 'us-east-1';
    this.endpoint = this.configService.get<string>('storage.endpoint') || 'http://localhost:9000';
    
    const accessKey = this.configService.get<string>('storage.accessKey') || 'minioadmin';
    const secretKey = this.configService.get<string>('storage.secretKey') || 'minioadmin';

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      console.log(`✅ Bucket '${this.bucket}' already exists`);
    } catch (error) {
      // Bucket doesn't exist, create it
      try {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        console.log(`✅ Created bucket '${this.bucket}'`);
      } catch (_createError) {
        console.error(`❌ Failed to create bucket '${this.bucket}':`, _createError);
        throw _createError;
      }
    }
  }

  async generatePresignedUploadUrl(
    fileName: string,
    contentType: string,
    folder: string = 'uploads',
    options: FileValidationOptions = {},
  ): Promise<PresignedUrlResponse> {
    
    this.validateFile(fileName, contentType, options);

    // Generate unique key
    const fileExtension = this.getFileExtension(fileName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    // Create presigned URL for upload
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, putObjectCommand, {
      expiresIn: 3600, // 1 hour
    });

    const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;

    return {
      uploadUrl,
      fileUrl,
      key,
      expiresIn: 3600,
    };
  }

  async generatePresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const getObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, getObjectCommand, {
      expiresIn,
    });
  }

  async deleteFile(key: string): Promise<void> {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(deleteObjectCommand);
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<PresignedUrlResponse> {
    // Validate file
    this.validateImageFile(file.originalname, file.mimetype);
    
    // Generate unique filename
    const fileExtension = this.getFileExtension(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;
    
    // Upload file to S3/MinIO
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(putObjectCommand);
    
    // Generate file URL
    const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;
    
    return {
      uploadUrl: '', // Not needed for direct upload
      fileUrl,
      key,
      expiresIn: 0, // Not needed for direct upload
    };
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
    _maxWidth: number = 2048,
    _maxHeight: number = 2048,
  ): void {
    this.validateFile(fileName, contentType, {
      maxSize: 5 * 1024 * 1024, // 5MB for images
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    });

    // Additional image-specific validations would go here
  }
}
