export declare class CategoryResponseDto {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    depth: number;
    path: string | null;
    createdAt: Date;
    children?: CategoryResponseDto[];
    parent?: CategoryResponseDto;
    constructor(partial: Partial<CategoryResponseDto>);
}
