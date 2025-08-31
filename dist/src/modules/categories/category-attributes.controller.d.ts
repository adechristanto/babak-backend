import { CategoryAttributesService } from './category-attributes.service';
import { CreateCategoryAttributeDto, UpdateCategoryAttributeDto, CategoryAttributeResponseDto } from './dto/category-attribute.dto';
export declare class CategoryAttributesController {
    private readonly categoryAttributesService;
    constructor(categoryAttributesService: CategoryAttributesService);
    create(categoryId: number, createDto: CreateCategoryAttributeDto): Promise<CategoryAttributeResponseDto>;
    bulkCreate(categoryId: number, createDtos: CreateCategoryAttributeDto[]): Promise<CategoryAttributeResponseDto[]>;
    findAll(): Promise<CategoryAttributeResponseDto[]>;
    findByCategory(categoryId: number): Promise<CategoryAttributeResponseDto[]>;
    findByCategoryAndParents(categoryId: number): Promise<CategoryAttributeResponseDto[]>;
    findOne(id: number): Promise<CategoryAttributeResponseDto>;
    update(id: number, updateDto: UpdateCategoryAttributeDto): Promise<CategoryAttributeResponseDto>;
    remove(id: number): Promise<void>;
    reorderAttributes(categoryId: number, attributeOrders: {
        id: number;
        displayOrder: number;
    }[]): Promise<void>;
}
