import { ReviewResponseDto } from './review-response.dto';
export declare class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    constructor(page: number, limit: number, total: number);
}
export declare class PaginatedReviewsDto {
    data: ReviewResponseDto[];
    pagination: PaginationMetaDto;
    constructor(data: ReviewResponseDto[], pagination: PaginationMetaDto);
}
