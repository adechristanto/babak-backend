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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const review_response_dto_1 = require("./dto/review-response.dto");
const paginated_reviews_dto_1 = require("./dto/paginated-reviews.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createReviewDto, reviewerId) {
        const { listingId, rating, comment } = createReviewDto;
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: {
                listingId,
                reviewerId,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this listing');
        }
        if (rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        const review = await this.prisma.review.create({
            data: {
                listingId,
                reviewerId,
                rating,
                comment,
            },
            include: {
                reviewer: true,
            },
        });
        return this.mapToResponseDto(review);
    }
    async getListingReviews(listingId, page = 1, limit = 10) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { listingId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    reviewer: true,
                },
            }),
            this.prisma.review.count({
                where: { listingId },
            }),
        ]);
        const reviewDtos = reviews.map(review => this.mapToResponseDto(review));
        const meta = new paginated_reviews_dto_1.PaginationMetaDto(page, limit, total);
        return new paginated_reviews_dto_1.PaginatedReviewsDto(reviewDtos, meta);
    }
    async getListingReviewSummary(listingId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const reviews = await this.prisma.review.findMany({
            where: { listingId },
            select: { rating: true },
        });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
                },
            };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        };
        reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });
        return {
            averageRating,
            totalReviews: reviews.length,
            ratingDistribution,
        };
    }
    async getSellerReviewSummary(sellerId) {
        const seller = await this.prisma.user.findUnique({
            where: { id: sellerId },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        const reviews = await this.prisma.review.findMany({
            where: {
                listing: {
                    sellerId,
                },
            },
            select: { rating: true },
        });
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: {
                    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
                },
            };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        };
        reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });
        return {
            averageRating,
            totalReviews: reviews.length,
            ratingDistribution,
        };
    }
    mapToResponseDto(review) {
        return new review_response_dto_1.ReviewResponseDto({
            ...review,
            reviewer: new user_response_dto_1.UserResponseDto(review.reviewer),
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map