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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const listings_service_1 = require("./listings.service");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const update_listing_dto_1 = require("./dto/update-listing.dto");
const search_listings_dto_1 = require("./dto/search-listings.dto");
const listing_attribute_dto_1 = require("./dto/listing-attribute.dto");
const listing_response_dto_1 = require("./dto/listing-response.dto");
const paginated_listings_dto_1 = require("./dto/paginated-listings.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const email_verified_guard_1 = require("../auth/guards/email-verified.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
let ListingsController = class ListingsController {
    listingsService;
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    async create(createListingDto, req) {
        return this.listingsService.create(createListingDto, req.user.id);
    }
    async findAll(searchDto) {
        return this.listingsService.findAll(searchDto);
    }
    async searchAdvanced(searchDto) {
        return this.listingsService.findAll(searchDto);
    }
    async findMyListings(searchDto, req) {
        return this.listingsService.findMyListings(req.user.id, searchDto);
    }
    async findListingsByUser(userId, searchDto) {
        return this.listingsService.findListingsByUser(userId, searchDto);
    }
    async findOne(id, req) {
        const viewerId = req.user?.id;
        const ipAddress = req.ip || req.connection?.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.listingsService.findOne(id, viewerId, ipAddress, userAgent);
    }
    async update(id, updateListingDto, req) {
        return this.listingsService.update(id, updateListingDto, req.user.id);
    }
    async remove(id, req) {
        await this.listingsService.remove(id, req.user.id);
        return { message: 'Listing deleted successfully' };
    }
    async publish(id, req) {
        return this.listingsService.submitForApproval(id, req.user.id);
    }
    async approve(id, req) {
        return this.listingsService.approve(id, req.user.id);
    }
    async reject(id, body, req) {
        return this.listingsService.reject(id, req.user.id, body.reason);
    }
    async getPendingApproval(searchDto) {
        return this.listingsService.findPendingApproval(searchDto);
    }
    async extendExpiration(id, days = 30, req) {
        return this.listingsService.extendExpiration(id, req.user.id, days);
    }
    async getViewCount(id) {
        const viewCount = await this.listingsService.getViewCount(id);
        return { viewCount };
    }
    async getRelatedListings(id, limit = 4) {
        return this.listingsService.getRelatedListings(id, limit);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Listing created successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_listing_dto_1.CreateListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search and filter listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listings retrieved successfully', type: paginated_listings_dto_1.PaginatedListingsDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_listings_dto_1.SearchListingsDto]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Advanced search and filter listings (POST body supports complex filters)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listings retrieved successfully', type: paginated_listings_dto_1.PaginatedListingsDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_attribute_dto_1.EnhancedSearchListingsDto]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "searchAdvanced", null);
__decorate([
    (0, common_1.Get)('my-listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User listings retrieved successfully', type: paginated_listings_dto_1.PaginatedListingsDto }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_listings_dto_1.SearchListingsDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findMyListings", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get listings by user ID (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User listings retrieved successfully', type: paginated_listings_dto_1.PaginatedListingsDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, search_listings_dto_1.SearchListingsDto]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findListingsByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get listing by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing retrieved successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update listing by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing updated successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only update your own listings' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_listing_dto_1.UpdateListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete listing by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only delete your own listings' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a draft listing for admin approval' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing submitted for approval successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only submit your own listings' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only draft listings can be submitted' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pending listing (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing approved successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admins can approve listings' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only pending listings can be approved' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a pending listing (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing rejected successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admins can reject listings' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only pending listings can be rejected' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)('pending-approval'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pending approval listings (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending listings retrieved successfully', type: paginated_listings_dto_1.PaginatedListingsDto }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_listings_dto_1.SearchListingsDto]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getPendingApproval", null);
__decorate([
    (0, common_1.Post)(':id/extend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Extend listing expiration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing expiration extended successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only extend your own listings' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiQuery)({ name: 'days', description: 'Number of days to extend', required: false, example: 30 }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('days', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "extendExpiration", null);
__decorate([
    (0, common_1.Get)(':id/views'),
    (0, swagger_1.ApiOperation)({ summary: 'Get listing view count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'View count retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getViewCount", null);
__decorate([
    (0, common_1.Get)(':id/related'),
    (0, swagger_1.ApiOperation)({ summary: 'Get related listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Related listings retrieved successfully', type: [listing_response_dto_1.ListingResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of related listings to return', required: false, example: 4 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getRelatedListings", null);
exports.ListingsController = ListingsController = __decorate([
    (0, swagger_1.ApiTags)('Listings'),
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map