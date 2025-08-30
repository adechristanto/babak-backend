"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const crypto = __importStar(require("crypto"));
let UploadsService = class UploadsService {
    configService;
    bucket;
    region;
    accessKey;
    secretKey;
    endpoint;
    constructor(configService) {
        this.configService = configService;
        this.bucket = this.configService.get('storage.bucket') || 'babak-uploads';
        this.region = this.configService.get('storage.region') || 'us-east-1';
        this.accessKey = this.configService.get('storage.accessKey') || '';
        this.secretKey = this.configService.get('storage.secretKey') || '';
        this.endpoint = this.configService.get('storage.endpoint') || '';
    }
    async generatePresignedUploadUrl(fileName, contentType, folder = 'uploads', options = {}) {
        this.validateFile(fileName, contentType, options);
        const fileExtension = this.getFileExtension(fileName);
        const uniqueFileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const key = `${folder}/${uniqueFileName}`;
        const uploadUrl = this.generateMockPresignedUrl(key, contentType);
        const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;
        return {
            uploadUrl,
            fileUrl,
            key,
            expiresIn: 3600,
        };
    }
    async generatePresignedDownloadUrl(key, expiresIn = 3600) {
        return `${this.endpoint}/${this.bucket}/${key}`;
    }
    async deleteFile(key) {
        console.log(`Would delete file: ${key}`);
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
    generateMockPresignedUrl(key, contentType) {
        const timestamp = Date.now();
        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(`${key}${timestamp}`)
            .digest('hex');
        return `${this.endpoint}/${this.bucket}/${key}?timestamp=${timestamp}&signature=${signature}&content-type=${encodeURIComponent(contentType)}`;
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