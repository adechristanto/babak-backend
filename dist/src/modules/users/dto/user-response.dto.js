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
exports.UserResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class UserResponseDto {
    id;
    email;
    name;
    avatarUrl;
    phone;
    location;
    locationAddress;
    locationCity;
    locationCountry;
    locationLatitude;
    locationLongitude;
    locationPlaceId;
    bio;
    role;
    emailVerified;
    createdAt;
    updatedAt;
    passwordHash;
    emailVerificationToken;
    emailVerificationExpires;
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.locationLatitude !== null && partial.locationLatitude !== undefined) {
            this.locationLatitude = typeof partial.locationLatitude === 'object'
                ? Number(partial.locationLatitude.toString())
                : partial.locationLatitude;
        }
        if (partial.locationLongitude !== null && partial.locationLongitude !== undefined) {
            this.locationLongitude = typeof partial.locationLongitude === 'object'
                ? Number(partial.locationLongitude.toString())
                : partial.locationLongitude;
        }
    }
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/avatar.jpg' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1234567890' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Damascus, Syria' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Damascus, Syria' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "locationAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Damascus' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "locationCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Syria' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "locationCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 33.5138 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "locationLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 36.2765 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "locationLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ChIJi8mnMiKyGhURuiw1EyBCa2o' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "locationPlaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bio description' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.UserRole, example: client_1.UserRole.USER }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "emailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "passwordHash", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "emailVerificationExpires", void 0);
//# sourceMappingURL=user-response.dto.js.map