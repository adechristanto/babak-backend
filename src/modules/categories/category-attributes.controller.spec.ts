import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryAttributesController } from './category-attributes.controller';
import { CategoryAttributesService } from './category-attributes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AttributeType, AttributeDataType, UserRole } from '@prisma/client';

describe('CategoryAttributesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let categoryId: number;
  let attributeId: number;

  const mockUser = {
    id: 1,
    email: 'admin@test.com',
    role: UserRole.ADMIN,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CategoryAttributesController],
      providers: [
        CategoryAttributesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            categoryAttribute: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              upsert: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    // Mock request user
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });

    await app.init();

    // Setup test data
    categoryId = 1;
    attributeId = 1;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /categories/:categoryId/attributes', () => {
    it('should create a category attribute', async () => {
      const createDto = {
        categoryId,
        name: 'Bedrooms',
        key: 'bedrooms',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: true,
        searchable: true,
        validation: { min: 1, max: 10 },
        displayOrder: 1,
      };

      const mockCategory = { id: categoryId, name: 'Real Estate' };
      const mockAttribute = { id: attributeId, ...createDto };

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.categoryAttribute.create as jest.Mock).mockResolvedValue(mockAttribute);

      const response = await request(app.getHttpServer())
        .post(`/categories/${categoryId}/attributes`)
        .send(createDto)
        .expect(201);

      expect(response.body.name).toBe('Bedrooms');
      expect(response.body.key).toBe('bedrooms');
      expect(response.body.type).toBe(AttributeType.NUMBER);
      expect(prisma.categoryAttribute.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          categoryId,
          name: 'Bedrooms',
          key: 'bedrooms',
        }),
      });
    });

    it('should return 404 if category not found', async () => {
      const createDto = {
        categoryId: 999,
        name: 'Test Attribute',
        key: 'test_attribute',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
      };

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .post('/categories/999/attributes')
        .send(createDto)
        .expect(404);
    });

    it('should return 409 if attribute key already exists', async () => {
      const createDto = {
        categoryId,
        name: 'Duplicate',
        key: 'duplicate_key',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
      };

      const mockCategory = { id: categoryId, name: 'Real Estate' };
      const existingAttribute = { id: 2, key: 'duplicate_key' };

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(existingAttribute);

      await request(app.getHttpServer())
        .post(`/categories/${categoryId}/attributes`)
        .send(createDto)
        .expect(409);
    });
  });

  describe('GET /categories/:categoryId/attributes', () => {
    it('should return attributes for a category', async () => {
      const mockCategory = { id: categoryId, name: 'Real Estate' };
      const mockAttributes = [
        {
          id: 1,
          categoryId,
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          displayOrder: 1,
        },
        {
          id: 2,
          categoryId,
          name: 'Bathrooms',
          key: 'bathrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          displayOrder: 2,
        },
      ];

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.categoryAttribute.findMany as jest.Mock).mockResolvedValue(mockAttributes);

      const response = await request(app.getHttpServer())
        .get(`/categories/${categoryId}/attributes`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Bedrooms');
      expect(response.body[1].name).toBe('Bathrooms');
      expect(prisma.categoryAttribute.findMany).toHaveBeenCalledWith({
        where: { categoryId },
        orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      });
    });

    it('should return 404 if category not found', async () => {
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/categories/999/attributes')
        .expect(404);
    });
  });

  describe('GET /categories/:categoryId/attributes/inherited', () => {
    it('should return attributes including inherited from parents', async () => {
      const mockCategory = { id: categoryId, parentId: null };
      const mockAttributes = [
        {
          id: 1,
          categoryId,
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
        },
      ];

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.categoryAttribute.findMany as jest.Mock).mockResolvedValue(mockAttributes);

      const response = await request(app.getHttpServer())
        .get(`/categories/${categoryId}/attributes/inherited`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Bedrooms');
    });
  });

  describe('PATCH /categories/attributes/:id', () => {
    it('should update a category attribute', async () => {
      const updateDto = {
        name: 'Updated Bedrooms',
        displayOrder: 5,
      };

      const existingAttribute = {
        id: attributeId,
        categoryId,
        name: 'Bedrooms',
        key: 'bedrooms',
      };

      const updatedAttribute = {
        ...existingAttribute,
        ...updateDto,
      };

      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(existingAttribute);
      (prisma.categoryAttribute.update as jest.Mock).mockResolvedValue(updatedAttribute);

      const response = await request(app.getHttpServer())
        .patch(`/categories/attributes/${attributeId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.name).toBe('Updated Bedrooms');
      expect(response.body.displayOrder).toBe(5);
      expect(prisma.categoryAttribute.update).toHaveBeenCalledWith({
        where: { id: attributeId },
        data: updateDto,
      });
    });

    it('should return 404 if attribute not found', async () => {
      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .patch('/categories/attributes/999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /categories/attributes/:id', () => {
    it('should delete a category attribute', async () => {
      const existingAttribute = {
        id: attributeId,
        categoryId,
        listingAttributes: [], // No listings using this attribute
      };

      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(existingAttribute);
      (prisma.categoryAttribute.delete as jest.Mock).mockResolvedValue(existingAttribute);

      await request(app.getHttpServer())
        .delete(`/categories/attributes/${attributeId}`)
        .expect(204);

      expect(prisma.categoryAttribute.delete).toHaveBeenCalledWith({
        where: { id: attributeId },
      });
    });

    it('should return 400 if attribute is in use', async () => {
      const existingAttribute = {
        id: attributeId,
        categoryId,
        listingAttributes: [{ id: 1 }], // Has listings using this attribute
      };

      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(existingAttribute);

      await request(app.getHttpServer())
        .delete(`/categories/attributes/${attributeId}`)
        .expect(400);
    });

    it('should return 404 if attribute not found', async () => {
      (prisma.categoryAttribute.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/categories/attributes/999')
        .expect(404);
    });
  });

  describe('POST /categories/:categoryId/attributes/bulk', () => {
    it('should create multiple attributes', async () => {
      const createDtos = [
        {
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
        },
        {
          name: 'Bathrooms',
          key: 'bathrooms',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
        },
      ];

      const mockCategory = { id: categoryId, name: 'Real Estate' };
      const mockCreatedAttributes = createDtos.map((dto, index) => ({
        id: index + 1,
        categoryId,
        ...dto,
      }));

      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);
      (prisma.categoryAttribute.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.$transaction as jest.Mock).mockResolvedValue(mockCreatedAttributes);

      const response = await request(app.getHttpServer())
        .post(`/categories/${categoryId}/attributes/bulk`)
        .send(createDtos)
        .expect(201);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Bedrooms');
      expect(response.body[1].name).toBe('Bathrooms');
    });
  });
});
