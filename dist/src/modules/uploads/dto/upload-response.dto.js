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
exports.UploadResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadResponseDto {
    uploadUrl;
    fileUrl;
    key;
    expiresIn;
    constructor(data) {
        this.uploadUrl = data.uploadUrl;
        this.fileUrl = data.fileUrl;
        this.key = data.key;
        this.expiresIn = data.expiresIn;
    }
}
exports.UploadResponseDto = UploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.example.com/upload-url?signature=...' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://storage.example.com/bucket/listings/uuid.jpg' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'listings/uuid.jpg' }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600 }),
    __metadata("design:type", Number)
], UploadResponseDto.prototype, "expiresIn", void 0);
//# sourceMappingURL=upload-response.dto.js.map