import { ListingStatus, ListingCondition, NegotiableStatus } from '@prisma/client';
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    categoryId?: number;
    city?: string;
    latitude?: number;
    longitude?: number;
    status?: ListingStatus;
    condition?: ListingCondition;
    negotiable?: NegotiableStatus;
}
