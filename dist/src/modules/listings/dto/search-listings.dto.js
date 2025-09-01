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
exports.SearchListingsDto = exports.SortOrder = exports.SortBy = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
const listing_attribute_dto_1 = require("./listing-attribute.dto");
var SortBy;
(function (SortBy) {
    SortBy["CREATED_AT"] = "createdAt";
    SortBy["PRICE"] = "price";
    SortBy["TITLE"] = "title";
    SortBy["UPDATED_AT"] = "updatedAt";
})(SortBy || (exports.SortBy = SortBy = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
class SearchListingsDto {
    q;
    categoryId;
    minPrice;
    maxPrice;
    city;
    latitude;
    longitude;
    radiusKm;
    status = client_1.ListingStatus.ACTIVE;
    isVip;
    isFeatured;
    sortBy = SortBy.CREATED_AT;
    sortOrder = SortOrder.DESC;
    page = 1;
    limit = 20;
    sellerId;
    attributeFilters;
}
exports.SearchListingsDto = SearchListingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'iPhone',
        required: false,
        description: 'Search query for title and description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchListingsDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: false,
        description: 'Category ID to filter by',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, required: false, description: 'Minimum price' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, required: false, description: 'Maximum price' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'New York',
        required: false,
        description: 'City to filter by',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchListingsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 40.7128,
        required: false,
        description: 'Latitude coordinate',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: -74.006,
        required: false,
        description: 'Longitude coordinate',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        required: false,
        description: 'Search radius in kilometers',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ListingStatus,
        required: false,
        default: client_1.ListingStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(client_1.ListingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchListingsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        required: false,
        description: 'Filter VIP listings only',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], SearchListingsDto.prototype, "isVip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        required: false,
        description: 'Filter featured listings only',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], SearchListingsDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SortBy, required: false, default: SortBy.CREATED_AT }),
    (0, class_validator_1.IsEnum)(SortBy),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchListingsDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SortOrder, required: false, default: SortOrder.DESC }),
    (0, class_validator_1.IsEnum)(SortOrder),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchListingsDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false, minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 20,
        required: false,
        minimum: 1,
        maximum: 100,
        default: 20,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        required: false,
        description: 'Seller ID to filter by',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SearchListingsDto.prototype, "sellerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [listing_attribute_dto_1.AttributeFilterDto],
        required: false,
        description: 'Category-specific attribute filters',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => listing_attribute_dto_1.AttributeFilterDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchListingsDto.prototype, "attributeFilters", void 0);
//# sourceMappingURL=search-listings.dto.js.map