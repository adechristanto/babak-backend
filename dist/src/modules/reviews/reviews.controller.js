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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reviews_service_1 = require("./reviews.service");
const create_review_dto_1 = require("./dto/create-review.dto");
const review_response_dto_1 = require("./dto/review-response.dto");
const paginated_reviews_dto_1 = require("./dto/paginated-reviews.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const email_verified_guard_1 = require("../auth/guards/email-verified.guard");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async create(createReviewDto, req) {
        return this.reviewsService.create(createReviewDto, req.user.id);
    }
    async getListingReviews(listingId, page = 1, limit = 10) {
        return this.reviewsService.getListingReviews(listingId, page, limit);
    }
    async getListingReviewSummary(listingId) {
        return this.reviewsService.getListingReviewSummary(listingId);
    }
    async getSellerReviewSummary(sellerId) {
        return this.reviewsService.getSellerReviewSummary(sellerId);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created successfully', type: review_response_dto_1.ReviewResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid review data' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('listing/:listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reviews for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reviews retrieved successfully', type: paginated_reviews_dto_1.PaginatedReviewsDto }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', description: 'Page number', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Items per page', required: false, example: 10 }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getListingReviews", null);
__decorate([
    (0, common_1.Get)('listing/:listingId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get review summary for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review summary retrieved successfully' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getListingReviewSummary", null);
__decorate([
    (0, common_1.Get)('seller/:sellerId/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get review summary for a seller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller review summary retrieved successfully' }),
    (0, swagger_1.ApiParam)({ name: 'sellerId', description: 'Seller ID' }),
    __param(0, (0, common_1.Param)('sellerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getSellerReviewSummary", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map