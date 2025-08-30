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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const category_response_dto_1 = require("./dto/category-response.dto");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const { name, slug, parentId } = createCategoryDto;
        const existingCategory = await this.prisma.category.findUnique({
            where: { slug },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this slug already exists');
        }
        let depth = 0;
        let path = slug;
        if (parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
            depth = parent.depth + 1;
            path = parent.path ? `${parent.path}/${slug}` : slug;
        }
        const category = await this.prisma.category.create({
            data: {
                name,
                slug,
                parentId,
                depth,
                path,
            },
            include: {
                parent: true,
                children: true,
            },
        });
        return this.mapToResponseDto(category);
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: [{ depth: 'asc' }, { name: 'asc' }],
            include: {
                parent: true,
                children: true,
            },
        });
        return categories.map(category => this.mapToResponseDto(category));
    }
    async findTree() {
        const rootCategories = await this.prisma.category.findMany({
            where: { parentId: null },
            orderBy: { name: 'asc' },
            include: {
                children: {
                    orderBy: { name: 'asc' },
                    include: {
                        children: {
                            orderBy: { name: 'asc' },
                        },
                    },
                },
            },
        });
        return rootCategories.map(category => this.mapToResponseDto(category));
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.mapToResponseDto(category);
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.mapToResponseDto(category);
    }
    async update(id, updateCategoryDto) {
        const { name, slug, parentId } = updateCategoryDto;
        const existingCategory = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (slug && slug !== existingCategory.slug) {
            const slugConflict = await this.prisma.category.findUnique({
                where: { slug },
            });
            if (slugConflict) {
                throw new common_1.ConflictException('Category with this slug already exists');
            }
        }
        let updateData = { name, slug };
        if (parentId !== undefined) {
            if (parentId === id) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
            }
            if (parentId) {
                const parent = await this.prisma.category.findUnique({
                    where: { id: parentId },
                });
                if (!parent) {
                    throw new common_1.NotFoundException('Parent category not found');
                }
                if (await this.wouldCreateCircularReference(id, parentId)) {
                    throw new common_1.BadRequestException('This would create a circular reference');
                }
                updateData.parentId = parentId;
                updateData.depth = parent.depth + 1;
                updateData.path = parent.path ? `${parent.path}/${slug || existingCategory.slug}` : (slug || existingCategory.slug);
            }
            else {
                updateData.parentId = null;
                updateData.depth = 0;
                updateData.path = slug || existingCategory.slug;
            }
        }
        const category = await this.prisma.category.update({
            where: { id },
            data: updateData,
            include: {
                parent: true,
                children: true,
            },
        });
        if (updateData.path) {
            await this.updateDescendantPaths(id);
        }
        return this.mapToResponseDto(category);
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with subcategories');
        }
        await this.prisma.category.delete({
            where: { id },
        });
    }
    async wouldCreateCircularReference(categoryId, newParentId) {
        let currentParentId = newParentId;
        while (currentParentId) {
            if (currentParentId === categoryId) {
                return true;
            }
            const parent = await this.prisma.category.findUnique({
                where: { id: currentParentId },
                select: { parentId: true },
            });
            currentParentId = parent?.parentId || null;
        }
        return false;
    }
    async updateDescendantPaths(categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: { children: true },
        });
        if (!category)
            return;
        for (const child of category.children) {
            const newPath = `${category.path}/${child.slug}`;
            await this.prisma.category.update({
                where: { id: child.id },
                data: {
                    path: newPath,
                    depth: category.depth + 1,
                },
            });
            await this.updateDescendantPaths(child.id);
        }
    }
    mapToResponseDto(category) {
        return new category_response_dto_1.CategoryResponseDto({
            ...category,
            parent: category.parent ? new category_response_dto_1.CategoryResponseDto(category.parent) : undefined,
            children: category.children ? category.children.map((child) => new category_response_dto_1.CategoryResponseDto(child)) : undefined,
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map