import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttributeDataType } from '@prisma/client';
import { 
  CreateListingAttributeDto, 
  UpdateListingAttributeDto, 
  ListingAttributeResponseDto,
  BulkListingAttributesDto 
} from './dto/listing-attribute.dto';
import { AttributeValidator, CategoryAttributeDefinition } from './utils/attribute-validator';

@Injectable()
export class ListingAttributesService {
  constructor(private prisma: PrismaService) {}

  async create(listingId: number, createDto: CreateListingAttributeDto): Promise<ListingAttributeResponseDto> {
    // Validate listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { category: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Get attribute definition
    const attributeDef = await this.prisma.categoryAttribute.findUnique({
      where: { id: createDto.attributeId },
    });

    if (!attributeDef) {
      throw new NotFoundException('Category attribute not found');
    }

    // Validate that the attribute belongs to the listing's category or its parents
    if (listing.categoryId) {
      const isValidAttribute = await this.validateAttributeForCategory(
        createDto.attributeId, 
        listing.categoryId
      );
      
      if (!isValidAttribute) {
        throw new BadRequestException('Attribute does not belong to the listing category');
      }
    }

    // Validate attribute value
    const validation = AttributeValidator.validateAttribute(attributeDef, createDto);
    if (!validation.isValid) {
      throw new BadRequestException(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Prepare data based on attribute data type
    const attributeData = this.prepareAttributeData(createDto, attributeDef.dataType);

    const attribute = await this.prisma.listingAttribute.create({
      data: {
        listingId,
        attributeId: createDto.attributeId,
        ...attributeData,
      },
      include: {
        attribute: true,
      },
    });

    return this.mapToResponseDto(attribute);
  }

  async findByListing(listingId: number): Promise<ListingAttributeResponseDto[]> {
    const attributes = await this.prisma.listingAttribute.findMany({
      where: { listingId },
      include: {
        attribute: true,
      },
      orderBy: {
        attribute: {
          displayOrder: 'asc',
        },
      },
    });

    return attributes.map(attr => this.mapToResponseDto(attr));
  }

  async findOne(id: number): Promise<ListingAttributeResponseDto> {
    const attribute = await this.prisma.listingAttribute.findUnique({
      where: { id },
      include: {
        attribute: true,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Listing attribute not found');
    }

    return this.mapToResponseDto(attribute);
  }

  async update(id: number, updateDto: UpdateListingAttributeDto): Promise<ListingAttributeResponseDto> {
    const existingAttribute = await this.prisma.listingAttribute.findUnique({
      where: { id },
      include: {
        attribute: true,
      },
    });

    if (!existingAttribute) {
      throw new NotFoundException('Listing attribute not found');
    }

    // Validate new value if provided
    if (this.hasValue(updateDto)) {
      const validation = AttributeValidator.validateAttribute(
        existingAttribute.attribute, 
        { attributeId: existingAttribute.attributeId, ...updateDto }
      );
      
      if (!validation.isValid) {
        throw new BadRequestException(`Validation failed: ${validation.errors.join(', ')}`);
      }
    }

    // Prepare data based on attribute data type
    const attributeData = this.prepareAttributeData(updateDto, existingAttribute.attribute.dataType);

    const updatedAttribute = await this.prisma.listingAttribute.update({
      where: { id },
      data: attributeData,
      include: {
        attribute: true,
      },
    });

    return this.mapToResponseDto(updatedAttribute);
  }

  async remove(id: number): Promise<void> {
    const attribute = await this.prisma.listingAttribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Listing attribute not found');
    }

    await this.prisma.listingAttribute.delete({
      where: { id },
    });
  }

  async bulkUpsert(listingId: number, bulkDto: BulkListingAttributesDto): Promise<ListingAttributeResponseDto[]> {
    // Validate listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { category: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Get all attribute definitions for validation
    const attributeIds = bulkDto.attributes.map(attr => attr.attributeId);
    const attributeDefs = await this.prisma.categoryAttribute.findMany({
      where: { id: { in: attributeIds } },
    });

    if (attributeDefs.length !== attributeIds.length) {
      throw new BadRequestException('Some category attributes not found');
    }

    // Validate all attributes belong to the category
    if (listing.categoryId) {
      for (const attributeId of attributeIds) {
        const isValid = await this.validateAttributeForCategory(attributeId, listing.categoryId);
        if (!isValid) {
          throw new BadRequestException(`Attribute ${attributeId} does not belong to the listing category`);
        }
      }
    }

    // Validate all attribute values
    const validation = AttributeValidator.validateAttributes(attributeDefs, bulkDto.attributes);
    if (!validation.isValid) {
      const errorMessages = Object.entries(validation.errors)
        .map(([key, errors]) => `${key}: ${errors.join(', ')}`)
        .join('; ');
      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }

    // Perform bulk upsert in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const upsertedAttributes: any[] = [];

      for (const attrDto of bulkDto.attributes) {
        const attributeDef = attributeDefs.find(def => def.id === attrDto.attributeId);
        if (!attributeDef) {
          throw new BadRequestException(`Attribute definition not found for ID ${attrDto.attributeId}`);
        }
        const attributeData = this.prepareAttributeData(attrDto, attributeDef.dataType);

        const upserted = await tx.listingAttribute.upsert({
          where: {
            listingId_attributeId: {
              listingId,
              attributeId: attrDto.attributeId,
            },
          },
          update: attributeData,
          create: {
            listingId,
            attributeId: attrDto.attributeId,
            ...attributeData,
          },
          include: {
            attribute: true,
          },
        });

        upsertedAttributes.push(upserted);
      }

      return upsertedAttributes;
    });

    return result.map(attr => this.mapToResponseDto(attr));
  }

  async removeByListing(listingId: number): Promise<void> {
    await this.prisma.listingAttribute.deleteMany({
      where: { listingId },
    });
  }

  async getAttributesByCategory(categoryId: number): Promise<CategoryAttributeDefinition[]> {
    const attributes = await this.prisma.categoryAttribute.findMany({
      where: { categoryId },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return attributes.map(attr => ({
      id: attr.id,
      name: attr.name,
      key: attr.key,
      type: attr.type,
      dataType: attr.dataType,
      required: attr.required,
      options: attr.options,
      validation: attr.validation,
      unit: attr.unit,
    } as CategoryAttributeDefinition));
  }

  private async validateAttributeForCategory(attributeId: number, categoryId: number): Promise<boolean> {
    // Check if attribute belongs to the category or any of its parent categories
    const attribute = await this.prisma.categoryAttribute.findFirst({
      where: {
        id: attributeId,
        category: {
          OR: [
            { id: categoryId },
            // Add logic to check parent categories if needed
            // This would require traversing the category hierarchy
          ],
        },
      },
    });

    return !!attribute;
  }

  private prepareAttributeData(dto: CreateListingAttributeDto | UpdateListingAttributeDto, dataType: AttributeDataType) {
    const data: any = {};

    // Clear all value fields first
    data.value = null;
    data.numericValue = null;
    data.booleanValue = null;
    data.dateValue = null;
    data.jsonValue = null;

    // Set the appropriate field based on data type
    switch (dataType) {
      case AttributeDataType.STRING:
        data.value = dto.value || null;
        break;
      case AttributeDataType.INTEGER:
      case AttributeDataType.DECIMAL:
        data.numericValue = dto.numericValue !== undefined ? dto.numericValue : null;
        data.value = dto.numericValue !== undefined ? dto.numericValue.toString() : null;
        break;
      case AttributeDataType.BOOLEAN:
        data.booleanValue = dto.booleanValue !== undefined ? dto.booleanValue : null;
        data.value = dto.booleanValue !== undefined ? dto.booleanValue.toString() : null;
        break;
      case AttributeDataType.DATE:
        data.dateValue = dto.dateValue ? new Date(dto.dateValue) : null;
        data.value = dto.dateValue || null;
        break;
      case AttributeDataType.JSON:
        data.jsonValue = dto.jsonValue || null;
        data.value = dto.jsonValue ? JSON.stringify(dto.jsonValue) : null;
        break;
    }

    return data;
  }

  private hasValue(dto: CreateListingAttributeDto | UpdateListingAttributeDto): boolean {
    return !!(dto.value || 
             dto.numericValue !== undefined || 
             dto.booleanValue !== undefined || 
             dto.dateValue || 
             dto.jsonValue);
  }

  private mapToResponseDto(attribute: any): ListingAttributeResponseDto {
    return new ListingAttributeResponseDto({
      id: attribute.id,
      listingId: attribute.listingId,
      attributeId: attribute.attributeId,
      value: attribute.value,
      numericValue: attribute.numericValue ? parseFloat(attribute.numericValue) : null,
      booleanValue: attribute.booleanValue,
      dateValue: attribute.dateValue,
      jsonValue: attribute.jsonValue,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt,
      attribute: attribute.attribute ? {
        id: attribute.attribute.id,
        name: attribute.attribute.name,
        key: attribute.attribute.key,
        type: attribute.attribute.type,
        dataType: attribute.attribute.dataType,
        unit: attribute.attribute.unit,
        options: attribute.attribute.options,
      } : undefined,
    });
  }
}
