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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let UploadsService = class UploadsService {
    configService;
    s3Client;
    bucket;
    region;
    endpoint;
    constructor(configService) {
        this.configService = configService;
        this.bucket = this.configService.get('storage.bucket') || 'babak-uploads';
        this.region = this.configService.get('storage.region') || 'us-east-1';
        this.endpoint = this.configService.get('storage.endpoint') || 'http://localhost:9000';
        const accessKey = this.configService.get('storage.accessKey') || 'minioadmin';
        const secretKey = this.configService.get('storage.secretKey') || 'minioadmin';
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
            forcePathStyle: true,
        });
    }
    async onModuleInit() {
        await this.ensureBucketExists();
    }
    async ensureBucketExists() {
        try {
            await this.s3Client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucket }));
            console.log(`✅ Bucket '${this.bucket}' already exists`);
        }
        catch (error) {
            try {
                await this.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucket }));
                console.log(`✅ Created bucket '${this.bucket}'`);
            }
            catch (createError) {
                console.error(`❌ Failed to create bucket '${this.bucket}':`, createError);
                throw createError;
            }
        }
    }
    async generatePresignedUploadUrl(fileName, contentType, folder = 'uploads', options = {}) {
        this.validateFile(fileName, contentType, options);
        const fileExtension = this.getFileExtension(fileName);
        const uniqueFileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const key = `${folder}/${uniqueFileName}`;
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, putObjectCommand, {
            expiresIn: 3600,
        });
        const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;
        return {
            uploadUrl,
            fileUrl,
            key,
            expiresIn: 3600,
        };
    }
    async generatePresignedDownloadUrl(key, expiresIn = 3600) {
        const getObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getObjectCommand, {
            expiresIn,
        });
    }
    async deleteFile(key) {
        const deleteObjectCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        await this.s3Client.send(deleteObjectCommand);
    }
    async uploadFile(file, folder = 'uploads') {
        this.validateImageFile(file.originalname, file.mimetype);
        const fileExtension = this.getFileExtension(file.originalname);
        const uniqueFileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const key = `${folder}/${uniqueFileName}`;
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(putObjectCommand);
        const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;
        return {
            uploadUrl: '',
            fileUrl,
            key,
            expiresIn: 0,
        };
    }
    validateFile(fileName, contentType, options) {
        const { maxSize = 10 * 1024 * 1024, allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
        ], allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'], } = options;
        if (!allowedMimeTypes.includes(contentType)) {
            throw new common_1.BadRequestException(`File type ${contentType} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`);
        }
        const fileExtension = this.getFileExtension(fileName).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            throw new common_1.BadRequestException(`File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
        }
    }
    getFileExtension(fileName) {
        const lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
    }
    getOptimizedImageUrl(key, width, height, quality) {
        let url = `${this.endpoint}/${this.bucket}/${key}`;
        const params = new URLSearchParams();
        if (width)
            params.append('w', width.toString());
        if (height)
            params.append('h', height.toString());
        if (quality)
            params.append('q', quality.toString());
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        return url;
    }
    validateImageFile(fileName, contentType, maxWidth = 2048, maxHeight = 2048) {
        this.validateFile(fileName, contentType, {
            maxSize: 5 * 1024 * 1024,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        });
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map