import { ListingResponseDto } from './listing-response.dto';
export declare class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    constructor(page: number, limit: number, total: number);
}
export declare class PaginatedListingsDto {
    data: ListingResponseDto[];
    meta: PaginationMetaDto;
    constructor(data: ListingResponseDto[], meta: PaginationMetaDto);
}
