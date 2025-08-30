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
export declare class UploadsService {
    private readonly configService;
    private readonly bucket;
    private readonly region;
    private readonly accessKey;
    private readonly secretKey;
    private readonly endpoint;
    constructor(configService: ConfigService);
    generatePresignedUploadUrl(fileName: string, contentType: string, folder?: string, options?: FileValidationOptions): Promise<PresignedUrlResponse>;
    generatePresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
    deleteFile(key: string): Promise<void>;
    private validateFile;
    private getFileExtension;
    private generateMockPresignedUrl;
    getOptimizedImageUrl(key: string, width?: number, height?: number, quality?: number): string;
    validateImageFile(fileName: string, contentType: string, maxWidth?: number, maxHeight?: number): void;
}
