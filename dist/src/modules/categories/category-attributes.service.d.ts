import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryAttributeDto, UpdateCategoryAttributeDto, CategoryAttributeResponseDto } from './dto/category-attribute.dto';
export declare class CategoryAttributesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateCategoryAttributeDto): Promise<CategoryAttributeResponseDto>;
    findAll(): Promise<CategoryAttributeResponseDto[]>;
    findByCategory(categoryId: number): Promise<CategoryAttributeResponseDto[]>;
    findByCategoryPath(categoryPath: string): Promise<CategoryAttributeResponseDto[]>;
    findByCategoryAndParents(categoryId: number): Promise<CategoryAttributeResponseDto[]>;
    findOne(id: number): Promise<CategoryAttributeResponseDto>;
    update(id: number, updateDto: UpdateCategoryAttributeDto): Promise<CategoryAttributeResponseDto>;
    remove(id: number): Promise<void>;
    bulkCreate(categoryId: number, attributes: CreateCategoryAttributeDto[]): Promise<CategoryAttributeResponseDto[]>;
    reorderAttributes(categoryId: number, attributeOrders: {
        id: number;
        displayOrder: number;
    }[]): Promise<void>;
    private mapToResponseDto;
}
