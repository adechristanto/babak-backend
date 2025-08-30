import { UploadsService } from './uploads.service';
import { UploadRequestDto } from './dto/upload-request.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    generatePresignedUrl(uploadRequestDto: UploadRequestDto): Promise<UploadResponseDto>;
    generateImagePresignedUrl(uploadRequestDto: UploadRequestDto): Promise<UploadResponseDto>;
    generateDownloadUrl(path: string): Promise<{
        downloadUrl: string;
    }>;
    deleteFile(path: string): Promise<{
        message: string;
    }>;
}
