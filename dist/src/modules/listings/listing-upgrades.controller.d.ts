import { ListingUpgradesService } from './listing-upgrades.service';
import { UpgradeListingDto } from './dto/upgrade-listing.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
export declare class ListingUpgradesController {
    private readonly listingUpgradesService;
    constructor(listingUpgradesService: ListingUpgradesService);
    upgradeListing(id: number, upgradeDto: UpgradeListingDto, req: any): Promise<{
        listing: ListingResponseDto;
        totalCost: number;
    }>;
    calculateUpgradeCost(upgradeDto: UpgradeListingDto): Promise<{
        breakdown: any;
        totalCost: number;
    }>;
    getUpgradePricing(): Promise<import("./listing-upgrades.service").UpgradePricing>;
    removeUpgrade(id: number, type: 'vip' | 'featured', req: any): Promise<ListingResponseDto>;
    getVipListings(limit?: number): Promise<ListingResponseDto[]>;
    getFeaturedListings(limit?: number): Promise<ListingResponseDto[]>;
    getExpiredListings(): Promise<ListingResponseDto[]>;
    archiveExpiredListings(): Promise<{
        archivedCount: number;
    }>;
}
