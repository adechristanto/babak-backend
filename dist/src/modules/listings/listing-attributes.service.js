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
exports.ListingAttributesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const listing_attribute_dto_1 = require("./dto/listing-attribute.dto");
const attribute_validator_1 = require("./utils/attribute-validator");
let ListingAttributesService = class ListingAttributesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(listingId, createDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { category: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const attributeDef = await this.prisma.categoryAttribute.findUnique({
            where: { id: createDto.attributeId },
        });
        if (!attributeDef) {
            throw new common_1.NotFoundException('Category attribute not found');
        }
        if (listing.categoryId) {
            const isValidAttribute = await this.validateAttributeForCategory(createDto.attributeId, listing.categoryId);
            if (!isValidAttribute) {
                throw new common_1.BadRequestException('Attribute does not belong to the listing category');
            }
        }
        const validation = attribute_validator_1.AttributeValidator.validateAttribute(attributeDef, createDto);
        if (!validation.isValid) {
            throw new common_1.BadRequestException(`Validation failed: ${validation.errors.join(', ')}`);
        }
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
    async findByListing(listingId) {
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
    async findOne(id) {
        const attribute = await this.prisma.listingAttribute.findUnique({
            where: { id },
            include: {
                attribute: true,
            },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Listing attribute not found');
        }
        return this.mapToResponseDto(attribute);
    }
    async update(id, updateDto) {
        const existingAttribute = await this.prisma.listingAttribute.findUnique({
            where: { id },
            include: {
                attribute: true,
            },
        });
        if (!existingAttribute) {
            throw new common_1.NotFoundException('Listing attribute not found');
        }
        if (this.hasValue(updateDto)) {
            const validation = attribute_validator_1.AttributeValidator.validateAttribute(existingAttribute.attribute, { attributeId: existingAttribute.attributeId, ...updateDto });
            if (!validation.isValid) {
                throw new common_1.BadRequestException(`Validation failed: ${validation.errors.join(', ')}`);
            }
        }
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
    async remove(id) {
        const attribute = await this.prisma.listingAttribute.findUnique({
            where: { id },
        });
        if (!attribute) {
            throw new common_1.NotFoundException('Listing attribute not found');
        }
        await this.prisma.listingAttribute.delete({
            where: { id },
        });
    }
    async bulkUpsert(listingId, bulkDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { category: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const attributeIds = bulkDto.attributes.map(attr => attr.attributeId);
        const attributeDefs = await this.prisma.categoryAttribute.findMany({
            where: { id: { in: attributeIds } },
        });
        if (attributeDefs.length !== attributeIds.length) {
            throw new common_1.BadRequestException('Some category attributes not found');
        }
        if (listing.categoryId) {
            for (const attributeId of attributeIds) {
                const isValid = await this.validateAttributeForCategory(attributeId, listing.categoryId);
                if (!isValid) {
                    throw new common_1.BadRequestException(`Attribute ${attributeId} does not belong to the listing category`);
                }
            }
        }
        const validation = attribute_validator_1.AttributeValidator.validateAttributes(attributeDefs, bulkDto.attributes);
        if (!validation.isValid) {
            const errorMessages = Object.entries(validation.errors)
                .map(([key, errors]) => `${key}: ${errors.join(', ')}`)
                .join('; ');
            throw new common_1.BadRequestException(`Validation failed: ${errorMessages}`);
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const upsertedAttributes = [];
            for (const attrDto of bulkDto.attributes) {
                const attributeDef = attributeDefs.find(def => def.id === attrDto.attributeId);
                if (!attributeDef) {
                    throw new common_1.BadRequestException(`Attribute definition not found for ID ${attrDto.attributeId}`);
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
    async removeByListing(listingId) {
        await this.prisma.listingAttribute.deleteMany({
            where: { listingId },
        });
    }
    async getAttributesByCategory(categoryId) {
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
        }));
    }
    async validateAttributeForCategory(attributeId, categoryId) {
        const attribute = await this.prisma.categoryAttribute.findFirst({
            where: {
                id: attributeId,
                category: {
                    OR: [
                        { id: categoryId },
                    ],
                },
            },
        });
        return !!attribute;
    }
    prepareAttributeData(dto, dataType) {
        const data = {};
        data.value = null;
        data.numericValue = null;
        data.booleanValue = null;
        data.dateValue = null;
        data.jsonValue = null;
        switch (dataType) {
            case client_1.AttributeDataType.STRING:
                data.value = dto.value || null;
                break;
            case client_1.AttributeDataType.INTEGER:
            case client_1.AttributeDataType.DECIMAL:
                data.numericValue = dto.numericValue !== undefined ? dto.numericValue : null;
                data.value = dto.numericValue !== undefined ? dto.numericValue.toString() : null;
                break;
            case client_1.AttributeDataType.BOOLEAN:
                data.booleanValue = dto.booleanValue !== undefined ? dto.booleanValue : null;
                data.value = dto.booleanValue !== undefined ? dto.booleanValue.toString() : null;
                break;
            case client_1.AttributeDataType.DATE:
                data.dateValue = dto.dateValue ? new Date(dto.dateValue) : null;
                data.value = dto.dateValue || null;
                break;
            case client_1.AttributeDataType.JSON:
                data.jsonValue = dto.jsonValue || null;
                data.value = dto.jsonValue ? JSON.stringify(dto.jsonValue) : null;
                break;
        }
        return data;
    }
    hasValue(dto) {
        return !!(dto.value ||
            dto.numericValue !== undefined ||
            dto.booleanValue !== undefined ||
            dto.dateValue ||
            dto.jsonValue);
    }
    mapToResponseDto(attribute) {
        return new listing_attribute_dto_1.ListingAttributeResponseDto({
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
};
exports.ListingAttributesService = ListingAttributesService;
exports.ListingAttributesService = ListingAttributesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingAttributesService);
//# sourceMappingURL=listing-attributes.service.js.map