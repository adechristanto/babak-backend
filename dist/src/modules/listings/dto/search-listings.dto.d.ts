import { ListingStatus } from '@prisma/client';
import { AttributeFilterDto } from './listing-attribute.dto';
export declare enum SortBy {
    CREATED_AT = "createdAt",
    PRICE = "price",
    TITLE = "title",
    UPDATED_AT = "updatedAt"
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class SearchListingsDto {
    q?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    status?: ListingStatus;
    isVip?: boolean;
    isFeatured?: boolean;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
    sellerId?: number;
    attributeFilters?: AttributeFilterDto[];
}
