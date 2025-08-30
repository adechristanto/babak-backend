import { ListingStatus } from '@prisma/client';
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
}
