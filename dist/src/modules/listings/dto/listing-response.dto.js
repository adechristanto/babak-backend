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
exports.ListingResponseDto = exports.ListingImageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const user_response_dto_1 = require("../../users/dto/user-response.dto");
const category_response_dto_1 = require("../../categories/dto/category-response.dto");
const listing_attribute_dto_1 = require("./listing-attribute.dto");
class ListingImageResponseDto {
    id;
    url;
    position;
    createdAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ListingImageResponseDto = ListingImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ListingImageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/image.jpg' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ListingImageResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ListingImageResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ListingImageResponseDto.prototype, "createdAt", void 0);
class ListingResponseDto {
    id;
    title;
    description;
    price;
    currency;
    city;
    latitude;
    longitude;
    locationAddress;
    locationCity;
    locationCountry;
    locationPlaceId;
    status;
    isVip;
    isFeatured;
    createdAt;
    updatedAt;
    expiresAt;
    seller;
    category;
    images;
    attributes;
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.price !== null && partial.price !== undefined) {
            this.price = typeof partial.price === 'object'
                ? Number(partial.price.toString())
                : partial.price;
        }
        if (partial.latitude !== null && partial.latitude !== undefined) {
            this.latitude = typeof partial.latitude === 'object'
                ? Number(partial.latitude.toString())
                : partial.latitude;
        }
        if (partial.longitude !== null && partial.longitude !== undefined) {
            this.longitude = typeof partial.longitude === 'object'
                ? Number(partial.longitude.toString())
                : partial.longitude;
        }
    }
}
exports.ListingResponseDto = ListingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iPhone 14 Pro Max' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Brand new iPhone 14 Pro Max, 256GB, Space Black' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 999.99 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40.7128 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -74.0060 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main St, New York, NY 10001, USA' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "locationAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "locationCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United States' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "locationCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ChIJOwg_06VPwokRYv534QaPC8g' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "locationPlaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ListingStatus }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ListingResponseDto.prototype, "isVip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ListingResponseDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ListingResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ListingResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-12-31T23:59:59.000Z', nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: user_response_dto_1.UserResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => user_response_dto_1.UserResponseDto),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], ListingResponseDto.prototype, "seller", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: category_response_dto_1.CategoryResponseDto, nullable: true }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => category_response_dto_1.CategoryResponseDto),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ListingImageResponseDto] }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ListingImageResponseDto),
    __metadata("design:type", Array)
], ListingResponseDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [listing_attribute_dto_1.ListingAttributeResponseDto], required: false }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => listing_attribute_dto_1.ListingAttributeResponseDto),
    __metadata("design:type", Array)
], ListingResponseDto.prototype, "attributes", void 0);
//# sourceMappingURL=listing-response.dto.js.map