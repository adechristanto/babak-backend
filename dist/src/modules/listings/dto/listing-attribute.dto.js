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
exports.EnhancedSearchListingsDto = exports.AttributeFilterDto = exports.ValidateAttributeValueDto = exports.BulkListingAttributesDto = exports.ListingAttributeResponseDto = exports.UpdateListingAttributeDto = exports.CreateListingAttributeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateListingAttributeDto {
    attributeId;
    value;
    numericValue;
    booleanValue;
    dateValue;
    jsonValue;
}
exports.CreateListingAttributeDto = CreateListingAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateListingAttributeDto.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateListingAttributeDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.5, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], CreateListingAttributeDto.prototype, "numericValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateListingAttributeDto.prototype, "booleanValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateListingAttributeDto.prototype, "dateValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['option1', 'option2'],
        required: false,
        description: 'JSON value for complex data types'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    __metadata("design:type", Object)
], CreateListingAttributeDto.prototype, "jsonValue", void 0);
class UpdateListingAttributeDto {
    value;
    numericValue;
    booleanValue;
    dateValue;
    jsonValue;
}
exports.UpdateListingAttributeDto = UpdateListingAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingAttributeDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.5, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], UpdateListingAttributeDto.prototype, "numericValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateListingAttributeDto.prototype, "booleanValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z', required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateListingAttributeDto.prototype, "dateValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    __metadata("design:type", Object)
], UpdateListingAttributeDto.prototype, "jsonValue", void 0);
class ListingAttributeResponseDto {
    id;
    listingId;
    attributeId;
    value;
    numericValue;
    booleanValue;
    dateValue;
    jsonValue;
    createdAt;
    updatedAt;
    attribute;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ListingAttributeResponseDto = ListingAttributeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ListingAttributeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ListingAttributeResponseDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ListingAttributeResponseDto.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3', nullable: true }),
    __metadata("design:type", Object)
], ListingAttributeResponseDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.5, nullable: true }),
    __metadata("design:type", Object)
], ListingAttributeResponseDto.prototype, "numericValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, nullable: true }),
    __metadata("design:type", Object)
], ListingAttributeResponseDto.prototype, "booleanValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z', nullable: true }),
    __metadata("design:type", Object)
], ListingAttributeResponseDto.prototype, "dateValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['option1', 'option2'], nullable: true }),
    __metadata("design:type", Object)
], ListingAttributeResponseDto.prototype, "jsonValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ListingAttributeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ListingAttributeResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], ListingAttributeResponseDto.prototype, "attribute", void 0);
class BulkListingAttributesDto {
    attributes;
}
exports.BulkListingAttributesDto = BulkListingAttributesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CreateListingAttributeDto],
        description: 'Array of attributes to create/update'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateListingAttributeDto),
    __metadata("design:type", Array)
], BulkListingAttributesDto.prototype, "attributes", void 0);
class ValidateAttributeValueDto {
    attributeId;
    value;
}
exports.ValidateAttributeValueDto = ValidateAttributeValueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ValidateAttributeValueDto.prototype, "attributeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateAttributeValueDto.prototype, "value", void 0);
class AttributeFilterDto {
    key;
    value;
    minValue;
    maxValue;
    booleanValue;
    values;
}
exports.AttributeFilterDto = AttributeFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bedrooms', description: 'Attribute key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttributeFilterDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3', required: false, description: 'Exact value match' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AttributeFilterDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false, description: 'Minimum numeric value' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], AttributeFilterDto.prototype, "minValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, required: false, description: 'Maximum numeric value' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], AttributeFilterDto.prototype, "maxValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false, description: 'Boolean value' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AttributeFilterDto.prototype, "booleanValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['option1', 'option2'],
        required: false,
        description: 'Array of values for multiselect'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AttributeFilterDto.prototype, "values", void 0);
class EnhancedSearchListingsDto {
    q;
    categoryId;
    minPrice;
    maxPrice;
    city;
    latitude;
    longitude;
    radiusKm;
    attributeFilters;
    page = 1;
    limit = 20;
}
exports.EnhancedSearchListingsDto = EnhancedSearchListingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iPhone', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedSearchListingsDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New York', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnhancedSearchListingsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 40.7128, required: false, description: 'Latitude for radius search' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -74.0060, required: false, description: 'Longitude for radius search' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, required: false, description: 'Search radius in kilometers' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : undefined),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "radiusKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [AttributeFilterDto],
        required: false,
        description: 'Category-specific attribute filters'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AttributeFilterDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], EnhancedSearchListingsDto.prototype, "attributeFilters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false, minimum: 1, default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20, required: false, minimum: 1, maximum: 100, default: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], EnhancedSearchListingsDto.prototype, "limit", void 0);
//# sourceMappingURL=listing-attribute.dto.js.map