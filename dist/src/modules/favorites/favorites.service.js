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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const favorite_response_dto_1 = require("./dto/favorite-response.dto");
const listing_response_dto_1 = require("../listings/dto/listing-response.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const category_response_dto_1 = require("../categories/dto/category-response.dto");
let FavoritesService = class FavoritesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addToFavorites(listingId, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: {
                seller: true,
                category: true,
                images: { orderBy: { position: 'asc' } },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const existingFavorite = await this.prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        if (existingFavorite) {
            throw new common_1.ConflictException('Listing already in favorites');
        }
        const favorite = await this.prisma.favorite.create({
            data: {
                userId,
                listingId,
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: { orderBy: { position: 'asc' } },
                    },
                },
            },
        });
        return this.mapToResponseDto(favorite);
    }
    async removeFromFavorites(listingId, userId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Favorite not found');
        }
        await this.prisma.favorite.delete({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
    }
    async getFavorites(userId) {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: { orderBy: { position: 'asc' } },
                    },
                },
            },
            orderBy: { addedAt: 'desc' },
        });
        return favorites.map(favorite => this.mapToResponseDto(favorite));
    }
    async isFavorited(listingId, userId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        return !!favorite;
    }
    async getFavoriteStats(userId) {
        const [totalFavorites, activeFavorites] = await Promise.all([
            this.prisma.favorite.count({
                where: { userId },
            }),
            this.prisma.favorite.count({
                where: {
                    userId,
                    listing: {
                        status: client_1.ListingStatus.ACTIVE,
                    },
                },
            }),
        ]);
        return { totalFavorites, activeFavorites };
    }
    mapToResponseDto(favorite) {
        return new favorite_response_dto_1.FavoriteResponseDto({
            ...favorite,
            listing: new listing_response_dto_1.ListingResponseDto({
                ...favorite.listing,
                seller: new user_response_dto_1.UserResponseDto(favorite.listing.seller),
                category: favorite.listing.category ? new category_response_dto_1.CategoryResponseDto(favorite.listing.category) : null,
            }),
        });
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map