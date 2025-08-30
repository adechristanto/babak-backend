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
exports.ListingUpgradesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const listing_response_dto_1 = require("./dto/listing-response.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const category_response_dto_1 = require("../categories/dto/category-response.dto");
let ListingUpgradesService = class ListingUpgradesService {
    prisma;
    pricing = {
        vipPrice: 9.99,
        featuredPrice: 19.99,
        extensionPricePerDay: 0.99,
    };
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upgradeListing(listingId, upgradeDto, userId) {
        const { isVip, isFeatured, extendDays } = upgradeDto;
        const existingListing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        if (!existingListing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (existingListing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only upgrade your own listings');
        }
        if (existingListing.status !== client_1.ListingStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active listings can be upgraded');
        }
        let totalCost = 0;
        const updateData = {};
        if (isVip !== undefined && isVip !== existingListing.isVip) {
            if (isVip) {
                totalCost += this.pricing.vipPrice;
                updateData.isVip = true;
            }
            else {
                updateData.isVip = false;
            }
        }
        if (isFeatured !== undefined && isFeatured !== existingListing.isFeatured) {
            if (isFeatured) {
                totalCost += this.pricing.featuredPrice;
                updateData.isFeatured = true;
            }
            else {
                updateData.isFeatured = false;
            }
        }
        if (extendDays && extendDays > 0) {
            totalCost += extendDays * this.pricing.extensionPricePerDay;
            const currentExpiration = existingListing.expiresAt || new Date();
            const newExpiration = new Date(currentExpiration);
            newExpiration.setDate(newExpiration.getDate() + extendDays);
            updateData.expiresAt = newExpiration;
        }
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('No upgrades specified');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id: listingId },
            data: updateData,
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        const listingDto = this.mapToResponseDto(updatedListing);
        return {
            listing: listingDto,
            totalCost,
        };
    }
    async getUpgradePricing() {
        return this.pricing;
    }
    async calculateUpgradeCost(upgradeDto) {
        const { isVip, isFeatured, extendDays } = upgradeDto;
        const breakdown = {};
        let totalCost = 0;
        if (isVip) {
            breakdown.vip = this.pricing.vipPrice;
            totalCost += this.pricing.vipPrice;
        }
        if (isFeatured) {
            breakdown.featured = this.pricing.featuredPrice;
            totalCost += this.pricing.featuredPrice;
        }
        if (extendDays && extendDays > 0) {
            const extensionCost = extendDays * this.pricing.extensionPricePerDay;
            breakdown.extension = {
                days: extendDays,
                pricePerDay: this.pricing.extensionPricePerDay,
                totalCost: extensionCost,
            };
            totalCost += extensionCost;
        }
        return { breakdown, totalCost };
    }
    async removeUpgrade(listingId, upgradeType, userId) {
        const existingListing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        if (!existingListing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (existingListing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only modify your own listings');
        }
        const updateData = {};
        if (upgradeType === 'vip') {
            updateData.isVip = false;
        }
        else if (upgradeType === 'featured') {
            updateData.isFeatured = false;
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id: listingId },
            data: updateData,
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return this.mapToResponseDto(updatedListing);
    }
    async getExpiredListings() {
        const expiredListings = await this.prisma.listing.findMany({
            where: {
                status: client_1.ListingStatus.ACTIVE,
                expiresAt: {
                    lt: new Date(),
                },
            },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return expiredListings.map(listing => this.mapToResponseDto(listing));
    }
    async archiveExpiredListings() {
        const result = await this.prisma.listing.updateMany({
            where: {
                status: client_1.ListingStatus.ACTIVE,
                expiresAt: {
                    lt: new Date(),
                },
            },
            data: {
                status: client_1.ListingStatus.ARCHIVED,
            },
        });
        return { archivedCount: result.count };
    }
    async getVipListings(limit = 10) {
        const vipListings = await this.prisma.listing.findMany({
            where: {
                status: client_1.ListingStatus.ACTIVE,
                isVip: true,
            },
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return vipListings.map(listing => this.mapToResponseDto(listing));
    }
    async getFeaturedListings(limit = 10) {
        const featuredListings = await this.prisma.listing.findMany({
            where: {
                status: client_1.ListingStatus.ACTIVE,
                isFeatured: true,
            },
            orderBy: [
                { isVip: 'desc' },
                { createdAt: 'desc' },
            ],
            take: limit,
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return featuredListings.map(listing => this.mapToResponseDto(listing));
    }
    mapToResponseDto(listing) {
        return new listing_response_dto_1.ListingResponseDto({
            ...listing,
            seller: new user_response_dto_1.UserResponseDto(listing.seller),
            category: listing.category ? new category_response_dto_1.CategoryResponseDto(listing.category) : null,
        });
    }
};
exports.ListingUpgradesService = ListingUpgradesService;
exports.ListingUpgradesService = ListingUpgradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingUpgradesService);
//# sourceMappingURL=listing-upgrades.service.js.map