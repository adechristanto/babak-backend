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
exports.UpdateListingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class UpdateListingDto {
    title;
    description;
    price;
    currency;
    categoryId;
    city;
    latitude;
    longitude;
    locationAddress;
    locationCity;
    locationCountry;
    locationPlaceId;
    status;
    condition;
    negotiable;
}
exports.UpdateListingDto = UpdateListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iPhone 14 Pro Max', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Brand new iPhone 14 Pro Max, 256GB, Space Black', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 999.99, required: false }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40.7128, description: 'Latitude coordinate', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -74.0060, description: 'Longitude coordinate', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateListingDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main St, New York, NY 10001, USA', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "locationAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "locationCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'United States', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "locationCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ChIJOwg_06VPwokRYv534QaPC8g', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "locationPlaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ListingStatus, required: false }),
    (0, class_validator_1.IsEnum)(client_1.ListingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ListingCondition,
        example: client_1.ListingCondition.GOOD,
        description: 'Condition of the item',
        required: false
    }),
    (0, class_validator_1.IsEnum)(client_1.ListingCondition),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.NegotiableStatus,
        example: client_1.NegotiableStatus.FIXED_PRICE,
        description: 'Price negotiation status',
        required: false
    }),
    (0, class_validator_1.IsEnum)(client_1.NegotiableStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingDto.prototype, "negotiable", void 0);
//# sourceMappingURL=update-listing.dto.js.map