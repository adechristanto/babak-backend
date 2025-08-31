import { ListingCondition, NegotiableStatus } from '@prisma/client';
export declare class CreateListingDto {
    title: string;
    description?: string;
    price: number;
    currency?: string;
    categoryId?: number;
    city?: string;
    latitude?: number;
    longitude?: number;
    locationAddress?: string;
    locationCity?: string;
    locationCountry?: string;
    locationPlaceId?: string;
    condition?: ListingCondition;
    negotiable?: NegotiableStatus;
}
