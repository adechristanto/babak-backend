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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryAttributesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const category_attributes_service_1 = require("./category-attributes.service");
const category_attribute_dto_1 = require("./dto/category-attribute.dto");
let CategoryAttributesController = class CategoryAttributesController {
    categoryAttributesService;
    constructor(categoryAttributesService) {
        this.categoryAttributesService = categoryAttributesService;
    }
    async create(categoryId, createDto) {
        createDto.categoryId = categoryId;
        return this.categoryAttributesService.create(createDto);
    }
    async bulkCreate(categoryId, createDtos) {
        return this.categoryAttributesService.bulkCreate(categoryId, createDtos);
    }
    async findAll() {
        return this.categoryAttributesService.findAll();
    }
    async findByCategory(categoryId) {
        return this.categoryAttributesService.findByCategory(categoryId);
    }
    async findByCategoryAndParents(categoryId) {
        return this.categoryAttributesService.findByCategoryAndParents(categoryId);
    }
    async findOne(id) {
        return this.categoryAttributesService.findOne(id);
    }
    async update(id, updateDto) {
        return this.categoryAttributesService.update(id, updateDto);
    }
    async remove(id) {
        return this.categoryAttributesService.remove(id);
    }
    async reorderAttributes(categoryId, attributeOrders) {
        return this.categoryAttributesService.reorderAttributes(categoryId, attributeOrders);
    }
};
exports.CategoryAttributesController = CategoryAttributesController;
__decorate([
    (0, common_1.Post)(':categoryId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERUSER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category attribute' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Category attribute created successfully',
        type: category_attribute_dto_1.CategoryAttributeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Attribute key already exists' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, category_attribute_dto_1.CreateCategoryAttributeDto]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':categoryId/bulk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERUSER),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple category attributes' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Category attributes created successfully',
        type: [category_attribute_dto_1.CategoryAttributeResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Some attribute keys already exist',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all category attributes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category attributes retrieved successfully',
        type: [category_attribute_dto_1.CategoryAttributeResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attributes for a specific category' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category attributes retrieved successfully',
        type: [category_attribute_dto_1.CategoryAttributeResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('category/:categoryId/inherited'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attributes for a category including inherited from parents',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category attributes retrieved successfully',
        type: [category_attribute_dto_1.CategoryAttributeResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "findByCategoryAndParents", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific category attribute' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category attribute retrieved successfully',
        type: category_attribute_dto_1.CategoryAttributeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category attribute not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERUSER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category attribute' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Category attribute updated successfully',
        type: category_attribute_dto_1.CategoryAttributeResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category attribute not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Attribute key already exists' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, category_attribute_dto_1.UpdateCategoryAttributeDto]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERUSER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category attribute' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Category attribute deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category attribute not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':categoryId/reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPERUSER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder category attributes' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Attributes reordered successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], CategoryAttributesController.prototype, "reorderAttributes", null);
exports.CategoryAttributesController = CategoryAttributesController = __decorate([
    (0, swagger_1.ApiTags)('Category Attributes'),
    (0, common_1.Controller)('category-attributes'),
    __metadata("design:paramtypes", [category_attributes_service_1.CategoryAttributesService])
], CategoryAttributesController);
//# sourceMappingURL=category-attributes.controller.js.map