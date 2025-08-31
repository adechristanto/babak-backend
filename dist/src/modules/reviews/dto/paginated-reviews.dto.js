"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedReviewsDto = exports.PaginationMetaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const review_response_dto_1 = require("./review-response.dto");
class PaginationMetaDto {
    page;
    limit;
    total;
    totalPages;
    constructor(page, limit, total) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current page number', example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Items per page', example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of items', example: 100 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of pages', example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
class PaginatedReviewsDto {
    data;
    pagination;
    constructor(data, pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}
exports.PaginatedReviewsDto = PaginatedReviewsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of reviews', type: [review_response_dto_1.ReviewResponseDto] }),
    __metadata("design:type", Array)
], PaginatedReviewsDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pagination metadata', type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedReviewsDto.prototype, "pagination", void 0);
//# sourceMappingURL=paginated-reviews.dto.js.map