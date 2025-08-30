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
exports.CategoryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CategoryResponseDto {
    id;
    name;
    slug;
    parentId;
    depth;
    path;
    createdAt;
    children;
    parent;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.CategoryResponseDto = CategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'electronics' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], CategoryResponseDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'electronics' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], CategoryResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryResponseDto], required: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CategoryResponseDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CategoryResponseDto, required: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", CategoryResponseDto)
], CategoryResponseDto.prototype, "parent", void 0);
//# sourceMappingURL=category-response.dto.js.map