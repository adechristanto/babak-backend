import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>;
    findAll(): Promise<CategoryResponseDto[]>;
    findTree(): Promise<CategoryResponseDto[]>;
    findBySlug(slug: string): Promise<CategoryResponseDto>;
    findOne(id: number): Promise<CategoryResponseDto>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
