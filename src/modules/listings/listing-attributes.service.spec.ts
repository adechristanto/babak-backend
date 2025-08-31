import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ListingAttributesService } from './listing-attributes.service';
import { AttributeType, AttributeDataType } from '@prisma/client';
import { CreateListingAttributeDto } from './dto/listing-attribute.dto';

describe('ListingAttributesService', () => {
  let service: ListingAttributesService;
  let prisma: PrismaService;

  const mockPrisma = {
    listing: {
      findUnique: jest.fn(),
    },
    categoryAttribute: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    listingAttribute: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingAttributesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ListingAttributesService>(ListingAttributesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a listing attribute', async () => {
      const listingId = 1;
      const createDto: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 3,
      };

      const mockListing = {
        id: listingId,
        categoryId: 1,
        category: { id: 1, name: 'Real Estate' },
      };

      const mockAttribute = {
        id: 1,
        name: 'Bedrooms',
        key: 'bedrooms',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: true,
        validation: { min: 1, max: 10 },
      };

      const mockCreatedAttribute = {
        id: 1,
        listingId,
        attributeId: 1,
        value: '3',
        numericValue: 3,
        booleanValue: null,
        dateValue: null,
        jsonValue: null,
        attribute: mockAttribute,
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockListing);
      mockPrisma.categoryAttribute.findUnique.mockResolvedValue(mockAttribute);
      mockPrisma.categoryAttribute.findFirst.mockResolvedValue(mockAttribute);
      mockPrisma.listingAttribute.create.mockResolvedValue(mockCreatedAttribute);

      const result = await service.create(listingId, createDto);

      expect(result.numericValue).toBe(3);
      expect(result.attribute?.name).toBe('Bedrooms');
      expect(mockPrisma.listingAttribute.create).toHaveBeenCalledWith({
        data: {
          listingId,
          attributeId: 1,
          value: '3',
          numericValue: 3,
          booleanValue: null,
          dateValue: null,
          jsonValue: null,
        },
        include: {
          attribute: true,
        },
      });
    });

    it('should throw NotFoundException if listing not found', async () => {
      const listingId = 999;
      const createDto: CreateListingAttributeDto = {
        attributeId: 1,
        value: 'test',
      };

      mockPrisma.listing.findUnique.mockResolvedValue(null);

      await expect(service.create(listingId, createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if attribute not found', async () => {
      const listingId = 1;
      const createDto: CreateListingAttributeDto = {
        attributeId: 999,
        value: 'test',
      };

      const mockListing = {
        id: listingId,
        categoryId: 1,
        category: { id: 1, name: 'Real Estate' },
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockListing);
      mockPrisma.categoryAttribute.findUnique.mockResolvedValue(null);

      await expect(service.create(listingId, createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for validation errors', async () => {
      const listingId = 1;
      const createDto: CreateListingAttributeDto = {
        attributeId: 1,
        numericValue: 15, // Exceeds max value
      };

      const mockListing = {
        id: listingId,
        categoryId: 1,
        category: { id: 1, name: 'Real Estate' },
      };

      const mockAttribute = {
        id: 1,
        name: 'Bedrooms',
        key: 'bedrooms',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: true,
        validation: { min: 1, max: 10 },
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockListing);
      mockPrisma.categoryAttribute.findUnique.mockResolvedValue(mockAttribute);
      mockPrisma.categoryAttribute.findFirst.mockResolvedValue(mockAttribute);

      await expect(service.create(listingId, createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByListing', () => {
    it('should return attributes for a listing', async () => {
      const listingId = 1;
      const mockAttributes = [
        {
          id: 1,
          listingId,
          attributeId: 1,
          value: '3',
          numericValue: 3,
          attribute: {
            id: 1,
            name: 'Bedrooms',
            key: 'bedrooms',
            displayOrder: 1,
          },
        },
        {
          id: 2,
          listingId,
          attributeId: 2,
          value: '2',
          numericValue: 2,
          attribute: {
            id: 2,
            name: 'Bathrooms',
            key: 'bathrooms',
            displayOrder: 2,
          },
        },
      ];

      mockPrisma.listingAttribute.findMany.mockResolvedValue(mockAttributes);

      const result = await service.findByListing(listingId);

      expect(result).toHaveLength(2);
      expect(result[0].attribute?.name).toBe('Bedrooms');
      expect(result[1].attribute?.name).toBe('Bathrooms');
      expect(mockPrisma.listingAttribute.findMany).toHaveBeenCalledWith({
        where: { listingId },
        include: { attribute: true },
        orderBy: { attribute: { displayOrder: 'asc' } },
      });
    });
  });

  describe('bulkUpsert', () => {
    it('should create/update multiple attributes', async () => {
      const listingId = 1;
      const bulkDto = {
        attributes: [
          { attributeId: 1, numericValue: 3 },
          { attributeId: 2, numericValue: 2 },
        ],
      };

      const mockListing = {
        id: listingId,
        categoryId: 1,
        category: { id: 1, name: 'Real Estate' },
      };

      const mockAttributes = [
        {
          id: 1,
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
        },
        {
          id: 2,
          name: 'Bathrooms',
          key: 'bathrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
        },
      ];

      const mockUpsertedAttributes = [
        {
          id: 1,
          listingId,
          attributeId: 1,
          numericValue: 3,
          attribute: mockAttributes[0],
        },
        {
          id: 2,
          listingId,
          attributeId: 2,
          numericValue: 2,
          attribute: mockAttributes[1],
        },
      ];

      mockPrisma.listing.findUnique.mockResolvedValue(mockListing);
      mockPrisma.categoryAttribute.findMany.mockResolvedValue(mockAttributes);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          listingAttribute: {
            upsert: jest.fn()
              .mockResolvedValueOnce(mockUpsertedAttributes[0])
              .mockResolvedValueOnce(mockUpsertedAttributes[1]),
          },
        });
      });

      const result = await service.bulkUpsert(listingId, bulkDto);

      expect(result).toHaveLength(2);
      expect(result[0].numericValue).toBe(3);
      expect(result[1].numericValue).toBe(2);
    });

    it('should throw NotFoundException if listing not found', async () => {
      const listingId = 999;
      const bulkDto = {
        attributes: [{ attributeId: 1, value: 'test' }],
      };

      mockPrisma.listing.findUnique.mockResolvedValue(null);

      await expect(service.bulkUpsert(listingId, bulkDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if some attributes not found', async () => {
      const listingId = 1;
      const bulkDto = {
        attributes: [
          { attributeId: 1, value: 'test' },
          { attributeId: 999, value: 'test' }, // Non-existent attribute
        ],
      };

      const mockListing = {
        id: listingId,
        categoryId: 1,
        category: { id: 1, name: 'Real Estate' },
      };

      mockPrisma.listing.findUnique.mockResolvedValue(mockListing);
      mockPrisma.categoryAttribute.findMany.mockResolvedValue([
        { id: 1, name: 'Test', key: 'test' }, // Only one attribute found
      ]);

      await expect(service.bulkUpsert(listingId, bulkDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a listing attribute', async () => {
      const attributeId = 1;
      const updateDto = { numericValue: 4 };

      const existingAttribute = {
        id: attributeId,
        attributeId: 1,
        attribute: {
          id: 1,
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          validation: { min: 1, max: 10 },
        },
      };

      const updatedAttribute = {
        ...existingAttribute,
        numericValue: 4,
        value: '4',
      };

      mockPrisma.listingAttribute.findUnique.mockResolvedValue(existingAttribute);
      mockPrisma.listingAttribute.update.mockResolvedValue(updatedAttribute);

      const result = await service.update(attributeId, updateDto);

      expect(result.numericValue).toBe(4);
      expect(mockPrisma.listingAttribute.update).toHaveBeenCalledWith({
        where: { id: attributeId },
        data: {
          value: '4',
          numericValue: 4,
          booleanValue: null,
          dateValue: null,
          jsonValue: null,
        },
        include: { attribute: true },
      });
    });

    it('should throw NotFoundException if attribute not found', async () => {
      const attributeId = 999;
      const updateDto = { value: 'test' };

      mockPrisma.listingAttribute.findUnique.mockResolvedValue(null);

      await expect(service.update(attributeId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a listing attribute', async () => {
      const attributeId = 1;
      const existingAttribute = { id: attributeId };

      mockPrisma.listingAttribute.findUnique.mockResolvedValue(existingAttribute);
      mockPrisma.listingAttribute.delete.mockResolvedValue(existingAttribute);

      await service.remove(attributeId);

      expect(mockPrisma.listingAttribute.delete).toHaveBeenCalledWith({
        where: { id: attributeId },
      });
    });

    it('should throw NotFoundException if attribute not found', async () => {
      const attributeId = 999;

      mockPrisma.listingAttribute.findUnique.mockResolvedValue(null);

      await expect(service.remove(attributeId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeByListing', () => {
    it('should delete all attributes for a listing', async () => {
      const listingId = 1;

      mockPrisma.listingAttribute.deleteMany.mockResolvedValue({ count: 3 });

      await service.removeByListing(listingId);

      expect(mockPrisma.listingAttribute.deleteMany).toHaveBeenCalledWith({
        where: { listingId },
      });
    });
  });
});
