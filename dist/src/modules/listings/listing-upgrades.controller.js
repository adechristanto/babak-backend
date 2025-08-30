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
exports.ListingUpgradesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const listing_upgrades_service_1 = require("./listing-upgrades.service");
const upgrade_listing_dto_1 = require("./dto/upgrade-listing.dto");
const listing_response_dto_1 = require("./dto/listing-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ListingUpgradesController = class ListingUpgradesController {
    listingUpgradesService;
    constructor(listingUpgradesService) {
        this.listingUpgradesService = listingUpgradesService;
    }
    async upgradeListing(id, upgradeDto, req) {
        return this.listingUpgradesService.upgradeListing(id, upgradeDto, req.user.id);
    }
    async calculateUpgradeCost(upgradeDto) {
        return this.listingUpgradesService.calculateUpgradeCost(upgradeDto);
    }
    async getUpgradePricing() {
        return this.listingUpgradesService.getUpgradePricing();
    }
    async removeUpgrade(id, type, req) {
        return this.listingUpgradesService.removeUpgrade(id, type, req.user.id);
    }
    async getVipListings(limit = 10) {
        return this.listingUpgradesService.getVipListings(limit);
    }
    async getFeaturedListings(limit = 10) {
        return this.listingUpgradesService.getFeaturedListings(limit);
    }
    async getExpiredListings() {
        return this.listingUpgradesService.getExpiredListings();
    }
    async archiveExpiredListings() {
        return this.listingUpgradesService.archiveExpiredListings();
    }
};
exports.ListingUpgradesController = ListingUpgradesController;
__decorate([
    (0, common_1.Post)(':id/upgrade'),
    (0, swagger_1.ApiOperation)({ summary: 'Upgrade listing (VIP, Featured, Extend)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Listing upgraded successfully',
        schema: {
            type: 'object',
            properties: {
                listing: { $ref: '#/components/schemas/ListingResponseDto' },
                totalCost: { type: 'number', example: 29.98 }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only upgrade your own listings' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Only active listings can be upgraded' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, upgrade_listing_dto_1.UpgradeListingDto, Object]),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "upgradeListing", null);
__decorate([
    (0, common_1.Post)('upgrade/calculate-cost'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate upgrade cost without applying' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Upgrade cost calculated successfully',
        schema: {
            type: 'object',
            properties: {
                breakdown: { type: 'object' },
                totalCost: { type: 'number', example: 29.98 }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upgrade_listing_dto_1.UpgradeListingDto]),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "calculateUpgradeCost", null);
__decorate([
    (0, common_1.Get)('upgrade/pricing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upgrade pricing information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pricing information retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                vipPrice: { type: 'number', example: 9.99 },
                featuredPrice: { type: 'number', example: 19.99 },
                extensionPricePerDay: { type: 'number', example: 0.99 }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "getUpgradePricing", null);
__decorate([
    (0, common_1.Delete)(':id/upgrade/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove upgrade from listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upgrade removed successfully', type: listing_response_dto_1.ListingResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only modify your own listings' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Upgrade type', enum: ['vip', 'featured'] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "removeUpgrade", null);
__decorate([
    (0, common_1.Get)('vip'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VIP listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VIP listings retrieved successfully', type: [listing_response_dto_1.ListingResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of listings to return', required: false, example: 10 }),
    __param(0, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "getVipListings", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Featured listings retrieved successfully', type: [listing_response_dto_1.ListingResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Number of listings to return', required: false, example: 10 }),
    __param(0, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "getFeaturedListings", null);
__decorate([
    (0, common_1.Get)('expired'),
    (0, swagger_1.ApiOperation)({ summary: 'Get expired listings (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expired listings retrieved successfully', type: [listing_response_dto_1.ListingResponseDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "getExpiredListings", null);
__decorate([
    (0, common_1.Post)('expired/archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Archive all expired listings (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Expired listings archived successfully',
        schema: {
            type: 'object',
            properties: {
                archivedCount: { type: 'number', example: 15 }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListingUpgradesController.prototype, "archiveExpiredListings", null);
exports.ListingUpgradesController = ListingUpgradesController = __decorate([
    (0, swagger_1.ApiTags)('Listing Upgrades'),
    (0, common_1.Controller)('listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [listing_upgrades_service_1.ListingUpgradesService])
], ListingUpgradesController);
//# sourceMappingURL=listing-upgrades.controller.js.map