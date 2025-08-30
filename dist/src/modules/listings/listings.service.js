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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const search_listings_dto_1 = require("./dto/search-listings.dto");
const listing_response_dto_1 = require("./dto/listing-response.dto");
const paginated_listings_dto_1 = require("./dto/paginated-listings.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const category_response_dto_1 = require("../categories/dto/category-response.dto");
let ListingsService = class ListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createListingDto, sellerId) {
        const { categoryId, ...listingData } = createListingDto;
        if (categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const listing = await this.prisma.listing.create({
            data: {
                ...listingData,
                sellerId,
                categoryId,
                status: client_1.ListingStatus.DRAFT,
                expiresAt,
            },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return this.mapToResponseDto(listing);
    }
    async findAll(searchDto) {
        const { q, categoryId, minPrice, maxPrice, city, status, isVip, isFeatured, sellerId, sortBy, sortOrder, page, limit, } = searchDto;
        const where = {
            status: status || client_1.ListingStatus.ACTIVE,
        };
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                where.price.lte = maxPrice;
            }
        }
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }
        if (isVip !== undefined) {
            where.isVip = isVip;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (sellerId) {
            where.sellerId = sellerId;
        }
        const orderBy = {};
        switch (sortBy) {
            case search_listings_dto_1.SortBy.PRICE:
                orderBy.price = sortOrder;
                break;
            case search_listings_dto_1.SortBy.TITLE:
                orderBy.title = sortOrder;
                break;
            case search_listings_dto_1.SortBy.UPDATED_AT:
                orderBy.updatedAt = sortOrder;
                break;
            default:
                orderBy.createdAt = sortOrder;
        }
        if (sortBy !== search_listings_dto_1.SortBy.CREATED_AT) {
            orderBy.createdAt = 'desc';
        }
        const skip = ((page || 1) - 1) * (limit || 20);
        const [listings, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                orderBy,
                skip,
                take: limit || 20,
                include: {
                    seller: true,
                    category: true,
                    images: {
                        orderBy: { position: 'asc' },
                    },
                },
            }),
            this.prisma.listing.count({ where }),
        ]);
        const listingDtos = listings.map(listing => this.mapToResponseDto(listing));
        const meta = new paginated_listings_dto_1.PaginationMetaDto(page || 1, limit || 20, total);
        return new paginated_listings_dto_1.PaginatedListingsDto(listingDtos, meta);
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        return this.mapToResponseDto(listing);
    }
    async findMyListings(sellerId, searchDto) {
        return this.findAll({ ...searchDto, sellerId });
    }
    async update(id, updateListingDto, userId) {
        const { categoryId, ...updateData } = updateListingDto;
        const existingListing = await this.prisma.listing.findUnique({
            where: { id },
            include: { seller: true },
        });
        if (!existingListing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (existingListing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        if (categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const listing = await this.prisma.listing.update({
            where: { id },
            data: {
                ...updateData,
                categoryId,
            },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return this.mapToResponseDto(listing);
    }
    async remove(id, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own listings');
        }
        await this.prisma.listing.delete({
            where: { id },
        });
    }
    async publish(id, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only publish your own listings');
        }
        if (listing.status !== client_1.ListingStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft listings can be published');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: { status: client_1.ListingStatus.ACTIVE },
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
    async extendExpiration(id, userId, days = 30) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only extend your own listings');
        }
        const newExpirationDate = new Date(listing.expiresAt || new Date());
        newExpirationDate.setDate(newExpirationDate.getDate() + days);
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: { expiresAt: newExpirationDate },
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
    mapToResponseDto(listing) {
        return new listing_response_dto_1.ListingResponseDto({
            ...listing,
            seller: new user_response_dto_1.UserResponseDto(listing.seller),
            category: listing.category ? new category_response_dto_1.CategoryResponseDto(listing.category) : null,
        });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map