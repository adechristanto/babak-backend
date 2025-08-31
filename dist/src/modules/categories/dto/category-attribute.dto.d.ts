import { AttributeType, AttributeDataType } from '@prisma/client';
export declare class CreateCategoryAttributeDto {
    categoryId: number;
    name: string;
    key: string;
    type: AttributeType;
    dataType: AttributeDataType;
    required?: boolean;
    searchable?: boolean;
    sortable?: boolean;
    options?: any;
    validation?: any;
    unit?: string;
    placeholder?: string;
    helpText?: string;
    displayOrder?: number;
}
export declare class UpdateCategoryAttributeDto {
    name?: string;
    key?: string;
    type?: AttributeType;
    dataType?: AttributeDataType;
    required?: boolean;
    searchable?: boolean;
    sortable?: boolean;
    options?: any;
    validation?: any;
    unit?: string;
    placeholder?: string;
    helpText?: string;
    displayOrder?: number;
}
export declare class CategoryAttributeResponseDto {
    id: number;
    categoryId: number;
    name: string;
    key: string;
    type: AttributeType;
    dataType: AttributeDataType;
    required: boolean;
    searchable: boolean;
    sortable: boolean;
    options: any;
    validation: any;
    unit: string | null;
    placeholder: string | null;
    helpText: string | null;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<CategoryAttributeResponseDto>);
}
