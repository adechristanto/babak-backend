import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ListingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpgradeListingDto } from './dto/upgrade-listing.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';

export interface UpgradePricing {
  vipPrice: number;
  featuredPrice: number;
  extensionPricePerDay: number;
}

@Injectable()
export class ListingUpgradesService {
  private readonly pricing: UpgradePricing = {
    vipPrice: 9.99,
    featuredPrice: 19.99,
    extensionPricePerDay: 0.99,
  };

  constructor(private readonly prisma: PrismaService) {}

  async upgradeListing(
    listingId: number,
    upgradeDto: UpgradeListingDto,
    userId: number,
  ): Promise<{ listing: ListingResponseDto; totalCost: number }> {
    const { isVip, isFeatured, extendDays } = upgradeDto;

    // Check if listing exists and user owns it
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
      throw new NotFoundException('Listing not found');
    }

    if (existingListing.sellerId !== userId) {
      throw new ForbiddenException('You can only upgrade your own listings');
    }

    if (existingListing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException('Only active listings can be upgraded');
    }

    // Calculate total cost
    let totalCost = 0;
    const updateData: any = {};

    if (isVip !== undefined && isVip !== existingListing.isVip) {
      if (isVip) {
        totalCost += this.pricing.vipPrice;
        updateData.isVip = true;
      } else {
        updateData.isVip = false;
      }
    }

    if (isFeatured !== undefined && isFeatured !== existingListing.isFeatured) {
      if (isFeatured) {
        totalCost += this.pricing.featuredPrice;
        updateData.isFeatured = true;
      } else {
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
      throw new BadRequestException('No upgrades specified');
    }

    // Update the listing
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

  async getUpgradePricing(): Promise<UpgradePricing> {
    return this.pricing;
  }

  async calculateUpgradeCost(upgradeDto: UpgradeListingDto): Promise<{ breakdown: any; totalCost: number }> {
    const { isVip, isFeatured, extendDays } = upgradeDto;
    
    const breakdown: any = {};
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

  async removeUpgrade(
    listingId: number,
    upgradeType: 'vip' | 'featured',
    userId: number,
  ): Promise<ListingResponseDto> {
    // Check if listing exists and user owns it
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
      throw new NotFoundException('Listing not found');
    }

    if (existingListing.sellerId !== userId) {
      throw new ForbiddenException('You can only modify your own listings');
    }

    const updateData: any = {};
    
    if (upgradeType === 'vip') {
      updateData.isVip = false;
    } else if (upgradeType === 'featured') {
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

  async getExpiredListings(): Promise<ListingResponseDto[]> {
    const expiredListings = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
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

  async archiveExpiredListings(): Promise<{ archivedCount: number }> {
    const result = await this.prisma.listing.updateMany({
      where: {
        status: ListingStatus.ACTIVE,
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: ListingStatus.ARCHIVED,
      },
    });

    return { archivedCount: result.count };
  }

  async getVipListings(limit: number = 10): Promise<ListingResponseDto[]> {
    const vipListings = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
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

  async getFeaturedListings(limit: number = 10): Promise<ListingResponseDto[]> {
    const featuredListings = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
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

  private mapToResponseDto(listing: any): ListingResponseDto {
    return new ListingResponseDto({
      ...listing,
      seller: new UserResponseDto(listing.seller),
      category: listing.category ? new CategoryResponseDto(listing.category) : null,
    });
  }
}
