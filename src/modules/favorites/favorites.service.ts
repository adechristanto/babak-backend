import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ListingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { ListingResponseDto } from '../listings/dto/listing-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addToFavorites(listingId: number, userId: number): Promise<FavoriteResponseDto> {
    // Check if listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: true,
        category: true,
        images: { orderBy: { position: 'asc' } },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check if already favorited
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Listing already in favorites');
    }

    // Create favorite
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

  async removeFromFavorites(listingId: number, userId: number): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
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

  async getFavorites(userId: number): Promise<FavoriteResponseDto[]> {
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

  async isFavorited(listingId: number, userId: number): Promise<boolean> {
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

  async getFavoriteStats(userId: number): Promise<{ totalFavorites: number; activeFavorites: number }> {
    const [totalFavorites, activeFavorites] = await Promise.all([
      this.prisma.favorite.count({
        where: { userId },
      }),
      this.prisma.favorite.count({
        where: {
          userId,
          listing: {
            status: ListingStatus.ACTIVE,
          },
        },
      }),
    ]);

    return { totalFavorites, activeFavorites };
  }

  private mapToResponseDto(favorite: any): FavoriteResponseDto {
    return new FavoriteResponseDto({
      ...favorite,
      listing: new ListingResponseDto({
        ...favorite.listing,
        seller: new UserResponseDto(favorite.listing.seller),
        category: favorite.listing.category ? new CategoryResponseDto(favorite.listing.category) : null,
      }),
    });
  }
}
