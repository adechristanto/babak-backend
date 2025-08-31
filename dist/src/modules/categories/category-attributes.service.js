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
exports.CategoryAttributesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const category_attribute_dto_1 = require("./dto/category-attribute.dto");
let CategoryAttributesService = class CategoryAttributesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const category = await this.prisma.category.findUnique({
            where: { id: createDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const existingAttribute = await this.prisma.categoryAttribute.findUnique({
            where: {
                categoryId_key: {
                    categoryId: createDto.categoryId,
                    key: createDto.key,
                },
            },
        });
        if (existingAttribute) {
            throw new common_1.ConflictException('Attribute key already exists for this category');
        }
        const attribute = await this.prisma.categoryAttribute.create({
            data: createDto,
        });
        return this.mapToResponseDto(attribute);
    }
    async findAll() {
        const attributes = await this.prisma.categoryAttribute.findMany({
            orderBy: [
                { categoryId: 'asc' },
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
        });
        return attributes.map(attr => this.mapToResponseDto(attr));
    }
    async findByCategory(categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const attributes = await this.prisma.categoryAttribute.findMany({
            where: { categoryId },
            orderBy: [
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
        });
        return attributes.map(attr => this.mapToResponseDto(attr));
    }
    async findByCategoryPath(categoryPath) {
        const category = await this.prisma.category.findFirst({
            where: { path: categoryPath },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.findByCategory(category.id);
    }
    async findByCategoryAndParents(categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const categoryIds = [categoryId];
        if (category.parentId) {
            const parentCategories = await this.prisma.category.findMany({
                where: {
                    OR: [
                        { id: category.parentId },
                    ],
                },
            });
            categoryIds.push(...parentCategories.map(cat => cat.id));
        }
        const attributes = await this.prisma.categoryAttribute.findMany({
            where: {
                categoryId: {
                    in: categoryIds,
                },
            },
            orderBy: [
                { categoryId: 'desc' },
                { displayOrder: 'asc' },
                { name: 'asc' },
            ],
        });
        const uniqueAttributes = new Map();
        attributes.forEach(attr => {
            if (!uniqueAttributes.has(attr.key)) {
                uniqueAttributes.set(attr.key, attr);
            }
        });
        return Array.from(uniqueAttributes.values()).map(attr => this.mapToResponseDto(attr));
    }
    async findOne(id) {
        const attribute = await this.prisma.categoryAttribute.findUnique({
            where: { id },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Category attribute not found');
        }
        return this.mapToResponseDto(attribute);
    }
    async update(id, updateDto) {
        const existingAttribute = await this.prisma.categoryAttribute.findUnique({
            where: { id },
        });
        if (!existingAttribute) {
            throw new common_1.NotFoundException('Category attribute not found');
        }
        if (updateDto.key && updateDto.key !== existingAttribute.key) {
            const conflictingAttribute = await this.prisma.categoryAttribute.findUnique({
                where: {
                    categoryId_key: {
                        categoryId: existingAttribute.categoryId,
                        key: updateDto.key,
                    },
                },
            });
            if (conflictingAttribute) {
                throw new common_1.ConflictException('Attribute key already exists for this category');
            }
        }
        const updatedAttribute = await this.prisma.categoryAttribute.update({
            where: { id },
            data: updateDto,
        });
        return this.mapToResponseDto(updatedAttribute);
    }
    async remove(id) {
        const attribute = await this.prisma.categoryAttribute.findUnique({
            where: { id },
            include: {
                listingAttributes: true,
            },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Category attribute not found');
        }
        if (attribute.listingAttributes.length > 0) {
            throw new common_1.BadRequestException('Cannot delete attribute that is being used by listings. ' +
                `Found ${attribute.listingAttributes.length} listings using this attribute.`);
        }
        await this.prisma.categoryAttribute.delete({
            where: { id },
        });
    }
    async bulkCreate(categoryId, attributes) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const keys = attributes.map(attr => attr.key);
        const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
        if (duplicateKeys.length > 0) {
            throw new common_1.BadRequestException(`Duplicate keys in batch: ${duplicateKeys.join(', ')}`);
        }
        const existingAttributes = await this.prisma.categoryAttribute.findMany({
            where: {
                categoryId,
                key: {
                    in: keys,
                },
            },
        });
        if (existingAttributes.length > 0) {
            const existingKeys = existingAttributes.map(attr => attr.key);
            throw new common_1.ConflictException(`Attribute keys already exist: ${existingKeys.join(', ')}`);
        }
        const createdAttributes = await this.prisma.$transaction(attributes.map(attr => this.prisma.categoryAttribute.create({
            data: { ...attr, categoryId },
        })));
        return createdAttributes.map(attr => this.mapToResponseDto(attr));
    }
    async reorderAttributes(categoryId, attributeOrders) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const attributeIds = attributeOrders.map(order => order.id);
        const attributes = await this.prisma.categoryAttribute.findMany({
            where: {
                id: { in: attributeIds },
                categoryId,
            },
        });
        if (attributes.length !== attributeIds.length) {
            throw new common_1.BadRequestException('Some attributes do not belong to this category');
        }
        await this.prisma.$transaction(attributeOrders.map(order => this.prisma.categoryAttribute.update({
            where: { id: order.id },
            data: { displayOrder: order.displayOrder },
        })));
    }
    mapToResponseDto(attribute) {
        return new category_attribute_dto_1.CategoryAttributeResponseDto({
            id: attribute.id,
            categoryId: attribute.categoryId,
            name: attribute.name,
            key: attribute.key,
            type: attribute.type,
            dataType: attribute.dataType,
            required: attribute.required,
            searchable: attribute.searchable,
            sortable: attribute.sortable,
            options: attribute.options,
            validation: attribute.validation,
            unit: attribute.unit,
            placeholder: attribute.placeholder,
            helpText: attribute.helpText,
            displayOrder: attribute.displayOrder,
            createdAt: attribute.createdAt,
            updatedAt: attribute.updatedAt,
        });
    }
};
exports.CategoryAttributesService = CategoryAttributesService;
exports.CategoryAttributesService = CategoryAttributesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryAttributesService);
//# sourceMappingURL=category-attributes.service.js.map