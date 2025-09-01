import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface PresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    key: string;
    expiresIn: number;
}
export interface FileValidationOptions {
    maxSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
}
export declare class UploadsService implements OnModuleInit {
    private readonly configService;
    private readonly s3Client;
    private readonly bucket;
    private readonly region;
    private readonly endpoint;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private ensureBucketExists;
    generatePresignedUploadUrl(fileName: string, contentType: string, folder?: string, options?: FileValidationOptions): Promise<PresignedUrlResponse>;
    generatePresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<PresignedUrlResponse>;
    private validateFile;
    private getFileExtension;
    getOptimizedImageUrl(key: string, width?: number, height?: number, quality?: number): string;
    validateImageFile(fileName: string, contentType: string, maxWidth?: number, maxHeight?: number): void;
}
