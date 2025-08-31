import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  CreateCategoryAttributeDto, 
  UpdateCategoryAttributeDto, 
  CategoryAttributeResponseDto 
} from './dto/category-attribute.dto';

@Injectable()
export class CategoryAttributesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCategoryAttributeDto): Promise<CategoryAttributeResponseDto> {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if attribute key already exists for this category
    const existingAttribute = await this.prisma.categoryAttribute.findUnique({
      where: {
        categoryId_key: {
          categoryId: createDto.categoryId,
          key: createDto.key,
        },
      },
    });

    if (existingAttribute) {
      throw new ConflictException('Attribute key already exists for this category');
    }

    const attribute = await this.prisma.categoryAttribute.create({
      data: createDto,
    });

    return this.mapToResponseDto(attribute);
  }

  async findAll(): Promise<CategoryAttributeResponseDto[]> {
    const attributes = await this.prisma.categoryAttribute.findMany({
      orderBy: [
        { categoryId: 'asc' },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return attributes.map(attr => this.mapToResponseDto(attr));
  }

  async findByCategory(categoryId: number): Promise<CategoryAttributeResponseDto[]> {
    // Validate category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
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

  async findByCategoryPath(categoryPath: string): Promise<CategoryAttributeResponseDto[]> {
    // Find category by path
    const category = await this.prisma.category.findFirst({
      where: { path: categoryPath },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.findByCategory(category.id);
  }

  async findByCategoryAndParents(categoryId: number): Promise<CategoryAttributeResponseDto[]> {
    // Get the category and its parent hierarchy
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Get all parent category IDs from the path
    const categoryIds: number[] = [categoryId];
    
    if (category.parentId) {
      // Get all parent categories
      const parentCategories = await this.prisma.category.findMany({
        where: {
          OR: [
            { id: category.parentId },
            // Add logic to get all ancestors if needed
          ],
        },
      });
      
      categoryIds.push(...parentCategories.map(cat => cat.id));
    }

    // Get attributes from current category and all parent categories
    const attributes = await this.prisma.categoryAttribute.findMany({
      where: {
        categoryId: {
          in: categoryIds,
        },
      },
      orderBy: [
        { categoryId: 'desc' }, // Current category first
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    // Remove duplicates (child category attributes override parent ones)
    const uniqueAttributes = new Map<string, any>();
    attributes.forEach(attr => {
      if (!uniqueAttributes.has(attr.key)) {
        uniqueAttributes.set(attr.key, attr);
      }
    });

    return Array.from(uniqueAttributes.values()).map(attr => this.mapToResponseDto(attr));
  }

  async findOne(id: number): Promise<CategoryAttributeResponseDto> {
    const attribute = await this.prisma.categoryAttribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Category attribute not found');
    }

    return this.mapToResponseDto(attribute);
  }

  async update(id: number, updateDto: UpdateCategoryAttributeDto): Promise<CategoryAttributeResponseDto> {
    const existingAttribute = await this.prisma.categoryAttribute.findUnique({
      where: { id },
    });

    if (!existingAttribute) {
      throw new NotFoundException('Category attribute not found');
    }

    // Check if key is being updated and if it conflicts
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
        throw new ConflictException('Attribute key already exists for this category');
      }
    }

    const updatedAttribute = await this.prisma.categoryAttribute.update({
      where: { id },
      data: updateDto,
    });

    return this.mapToResponseDto(updatedAttribute);
  }

  async remove(id: number): Promise<void> {
    const attribute = await this.prisma.categoryAttribute.findUnique({
      where: { id },
      include: {
        listingAttributes: true,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Category attribute not found');
    }

    // Check if attribute is being used by any listings
    if (attribute.listingAttributes.length > 0) {
      throw new BadRequestException(
        'Cannot delete attribute that is being used by listings. ' +
        `Found ${attribute.listingAttributes.length} listings using this attribute.`
      );
    }

    await this.prisma.categoryAttribute.delete({
      where: { id },
    });
  }

  async bulkCreate(categoryId: number, attributes: CreateCategoryAttributeDto[]): Promise<CategoryAttributeResponseDto[]> {
    // Validate category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check for duplicate keys within the batch
    const keys = attributes.map(attr => attr.key);
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
    if (duplicateKeys.length > 0) {
      throw new BadRequestException(`Duplicate keys in batch: ${duplicateKeys.join(', ')}`);
    }

    // Check for existing keys in database
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
      throw new ConflictException(`Attribute keys already exist: ${existingKeys.join(', ')}`);
    }

    // Create all attributes
    const createdAttributes = await this.prisma.$transaction(
      attributes.map(attr => 
        this.prisma.categoryAttribute.create({
          data: { ...attr, categoryId },
        })
      )
    );

    return createdAttributes.map(attr => this.mapToResponseDto(attr));
  }

  async reorderAttributes(categoryId: number, attributeOrders: { id: number; displayOrder: number }[]): Promise<void> {
    // Validate category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Validate all attributes belong to the category
    const attributeIds = attributeOrders.map(order => order.id);
    const attributes = await this.prisma.categoryAttribute.findMany({
      where: {
        id: { in: attributeIds },
        categoryId,
      },
    });

    if (attributes.length !== attributeIds.length) {
      throw new BadRequestException('Some attributes do not belong to this category');
    }

    // Update display orders
    await this.prisma.$transaction(
      attributeOrders.map(order =>
        this.prisma.categoryAttribute.update({
          where: { id: order.id },
          data: { displayOrder: order.displayOrder },
        })
      )
    );
  }

  private mapToResponseDto(attribute: any): CategoryAttributeResponseDto {
    return new CategoryAttributeResponseDto({
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
}
