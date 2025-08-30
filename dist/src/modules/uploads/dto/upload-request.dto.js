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
exports.UploadRequestDto = exports.UploadFolder = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var UploadFolder;
(function (UploadFolder) {
    UploadFolder["LISTINGS"] = "listings";
    UploadFolder["AVATARS"] = "avatars";
    UploadFolder["DOCUMENTS"] = "documents";
})(UploadFolder || (exports.UploadFolder = UploadFolder = {}));
class UploadRequestDto {
    fileName;
    contentType;
    folder = UploadFolder.LISTINGS;
}
exports.UploadRequestDto = UploadRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: UploadFolder, default: UploadFolder.LISTINGS }),
    (0, class_validator_1.IsEnum)(UploadFolder),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UploadRequestDto.prototype, "folder", void 0);
//# sourceMappingURL=upload-request.dto.js.map