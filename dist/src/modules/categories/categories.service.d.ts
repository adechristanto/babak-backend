import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>;
    findAll(): Promise<CategoryResponseDto[]>;
    findTree(): Promise<CategoryResponseDto[]>;
    findOne(id: number): Promise<CategoryResponseDto>;
    findBySlug(slug: string): Promise<CategoryResponseDto>;
    update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    remove(id: number): Promise<void>;
    private wouldCreateCircularReference;
    private updateDescendantPaths;
    private mapToResponseDto;
}
