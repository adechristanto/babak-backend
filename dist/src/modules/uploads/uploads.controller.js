"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const uploads_service_1 = require("./uploads.service");
const upload_request_dto_1 = require("./dto/upload-request.dto");
const upload_response_dto_1 = require("./dto/upload-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const email_verified_guard_1 = require("../auth/guards/email-verified.guard");
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async generatePresignedUrl(uploadRequestDto) {
        const { fileName, contentType, folder } = uploadRequestDto;
        const result = await this.uploadsService.generatePresignedUploadUrl(fileName, contentType, folder);
        return new upload_response_dto_1.UploadResponseDto(result);
    }
    async generateImagePresignedUrl(uploadRequestDto) {
        const { fileName, contentType, folder } = uploadRequestDto;
        this.uploadsService.validateImageFile(fileName, contentType);
        const result = await this.uploadsService.generatePresignedUploadUrl(fileName, contentType, folder, {
            maxSize: 5 * 1024 * 1024,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        });
        return new upload_response_dto_1.UploadResponseDto(result);
    }
    async generateDownloadUrl(path) {
        const downloadUrl = await this.uploadsService.generatePresignedDownloadUrl(path);
        return { downloadUrl };
    }
    async deleteFile(path) {
        await this.uploadsService.deleteFile(path);
        return { message: 'File deleted successfully' };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('presigned-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate presigned URL for file upload' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Presigned URL generated successfully',
        type: upload_response_dto_1.UploadResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file type or parameters' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_request_dto_1.UploadRequestDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "generatePresignedUrl", null);
__decorate([
    (0, common_1.Post)('presigned-url/image'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate presigned URL for image upload with validation' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Presigned URL for image generated successfully',
        type: upload_response_dto_1.UploadResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid image file or parameters' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_request_dto_1.UploadRequestDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "generateImagePresignedUrl", null);
__decorate([
    (0, common_1.Get)('download/*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate presigned URL for file download' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Download URL generated successfully' }),
    (0, swagger_1.ApiParam)({ name: 'path', description: 'File path in storage' }),
    __param(0, (0, common_1.Param)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "generateDownloadUrl", null);
__decorate([
    (0, common_1.Delete)('*path'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete file from storage' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File deleted successfully' }),
    (0, swagger_1.ApiParam)({ name: 'path', description: 'File path in storage' }),
    __param(0, (0, common_1.Param)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "deleteFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('Uploads'),
    (0, common_1.Controller)('uploads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map