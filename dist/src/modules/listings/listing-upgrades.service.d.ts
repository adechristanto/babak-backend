import { PrismaService } from '../../prisma/prisma.service';
import { UpgradeListingDto } from './dto/upgrade-listing.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
export interface UpgradePricing {
    vipPrice: number;
    featuredPrice: number;
    extensionPricePerDay: number;
}
export declare class ListingUpgradesService {
    private readonly prisma;
    private readonly pricing;
    constructor(prisma: PrismaService);
    upgradeListing(listingId: number, upgradeDto: UpgradeListingDto, userId: number): Promise<{
        listing: ListingResponseDto;
        totalCost: number;
    }>;
    getUpgradePricing(): Promise<UpgradePricing>;
    calculateUpgradeCost(upgradeDto: UpgradeListingDto): Promise<{
        breakdown: any;
        totalCost: number;
    }>;
    removeUpgrade(listingId: number, upgradeType: 'vip' | 'featured', userId: number): Promise<ListingResponseDto>;
    getExpiredListings(): Promise<ListingResponseDto[]>;
    archiveExpiredListings(): Promise<{
        archivedCount: number;
    }>;
    getVipListings(limit?: number): Promise<ListingResponseDto[]>;
    getFeaturedListings(limit?: number): Promise<ListingResponseDto[]>;
    private mapToResponseDto;
}
