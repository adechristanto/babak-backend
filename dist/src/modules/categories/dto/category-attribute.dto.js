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
exports.CategoryAttributeResponseDto = exports.UpdateCategoryAttributeDto = exports.CreateCategoryAttributeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateCategoryAttributeDto {
    categoryId;
    name;
    key;
    type;
    dataType;
    required = false;
    searchable = true;
    sortable = false;
    options;
    validation;
    unit;
    placeholder;
    helpText;
    displayOrder = 0;
}
exports.CreateCategoryAttributeDto = CreateCategoryAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateCategoryAttributeDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bedrooms' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bedrooms' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttributeType, example: client_1.AttributeType.NUMBER }),
    (0, class_validator_1.IsEnum)(client_1.AttributeType),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttributeDataType, example: client_1.AttributeDataType.INTEGER }),
    (0, class_validator_1.IsEnum)(client_1.AttributeDataType),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCategoryAttributeDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCategoryAttributeDto.prototype, "searchable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCategoryAttributeDto.prototype, "sortable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Option 1', 'Option 2'],
        required: false,
        description: 'Options for SELECT/MULTISELECT types'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    __metadata("design:type", Object)
], CreateCategoryAttributeDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { min: 1, max: 10 },
        required: false,
        description: 'Validation rules'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    __metadata("design:type", Object)
], CreateCategoryAttributeDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'm²', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Enter number of bedrooms', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "placeholder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Number of bedrooms in the property', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCategoryAttributeDto.prototype, "helpText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCategoryAttributeDto.prototype, "displayOrder", void 0);
class UpdateCategoryAttributeDto {
    name;
    key;
    type;
    dataType;
    required;
    searchable;
    sortable;
    options;
    validation;
    unit;
    placeholder;
    helpText;
    displayOrder;
}
exports.UpdateCategoryAttributeDto = UpdateCategoryAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bedrooms', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bedrooms', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttributeType, required: false }),
    (0, class_validator_1.IsEnum)(client_1.AttributeType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttributeDataType, required: false }),
    (0, class_validator_1.IsEnum)(client_1.AttributeDataType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCategoryAttributeDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCategoryAttributeDto.prototype, "searchable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCategoryAttributeDto.prototype, "sortable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    __metadata("design:type", Object)
], UpdateCategoryAttributeDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? JSON.parse(value) : value),
    __metadata("design:type", Object)
], UpdateCategoryAttributeDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "placeholder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCategoryAttributeDto.prototype, "helpText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCategoryAttributeDto.prototype, "displayOrder", void 0);
class CategoryAttributeResponseDto {
    id;
    categoryId;
    name;
    key;
    type;
    dataType;
    required;
    searchable;
    sortable;
    options;
    validation;
    unit;
    placeholder;
    helpText;
    displayOrder;
    createdAt;
    updatedAt;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.CategoryAttributeResponseDto = CategoryAttributeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CategoryAttributeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CategoryAttributeResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bedrooms' }),
    __metadata("design:type", String)
], CategoryAttributeResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bedrooms' }),
    __metadata("design:type", String)
], CategoryAttributeResponseDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttributeType }),
    __metadata("design:type", String)
], CategoryAttributeResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AttributeDataType }),
    __metadata("design:type", String)
], CategoryAttributeResponseDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], CategoryAttributeResponseDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CategoryAttributeResponseDto.prototype, "searchable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], CategoryAttributeResponseDto.prototype, "sortable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Option 1', 'Option 2'], nullable: true }),
    __metadata("design:type", Object)
], CategoryAttributeResponseDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { min: 1, max: 10 }, nullable: true }),
    __metadata("design:type", Object)
], CategoryAttributeResponseDto.prototype, "validation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'm²', nullable: true }),
    __metadata("design:type", Object)
], CategoryAttributeResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Enter number of bedrooms', nullable: true }),
    __metadata("design:type", Object)
], CategoryAttributeResponseDto.prototype, "placeholder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Number of bedrooms in the property', nullable: true }),
    __metadata("design:type", Object)
], CategoryAttributeResponseDto.prototype, "helpText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CategoryAttributeResponseDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryAttributeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryAttributeResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=category-attribute.dto.js.map