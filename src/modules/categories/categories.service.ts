import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const { name, slug, parentId } = createCategoryDto;

    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    // If parentId is provided, validate parent exists
    let depth = 0;
    let path = slug;

    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
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

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ depth: 'asc' }, { name: 'asc' }],
      include: {
        parent: true,
        children: true,
      },
    });

    return categories.map(category => this.mapToResponseDto(category));
  }

  async findTree(): Promise<CategoryResponseDto[]> {
    // Get root categories (depth 0) with their children
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

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.mapToResponseDto(category);
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.mapToResponseDto(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const { name, slug, parentId } = updateCategoryDto;

    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check if new slug conflicts with existing categories (excluding current)
    if (slug && slug !== existingCategory.slug) {
      const slugConflict = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (slugConflict) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Validate parent if changing
    let updateData: any = { name, slug };
    
    if (parentId !== undefined) {
      if (parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (parentId) {
        const parent = await this.prisma.category.findUnique({
          where: { id: parentId },
        });

        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }

        // Check for circular reference
        if (await this.wouldCreateCircularReference(id, parentId)) {
          throw new BadRequestException('This would create a circular reference');
        }

        updateData.parentId = parentId;
        updateData.depth = parent.depth + 1;
        updateData.path = parent.path ? `${parent.path}/${slug || existingCategory.slug}` : (slug || existingCategory.slug);
      } else {
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

    // Update paths of all descendants if path changed
    if (updateData.path) {
      await this.updateDescendantPaths(id);
    }

    return this.mapToResponseDto(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }

  private async wouldCreateCircularReference(categoryId: number, newParentId: number): Promise<boolean> {
    let currentParentId: number | null = newParentId;

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

  private async updateDescendantPaths(categoryId: number): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { children: true },
    });

    if (!category) return;

    for (const child of category.children) {
      const newPath = `${category.path}/${child.slug}`;
      await this.prisma.category.update({
        where: { id: child.id },
        data: { 
          path: newPath,
          depth: category.depth + 1,
        },
      });

      // Recursively update descendants
      await this.updateDescendantPaths(child.id);
    }
  }

  private mapToResponseDto(category: any): CategoryResponseDto {
    return new CategoryResponseDto({
      ...category,
      parent: category.parent ? new CategoryResponseDto(category.parent) : undefined,
      children: category.children ? category.children.map((child: any) => new CategoryResponseDto(child)) : undefined,
    });
  }
}
