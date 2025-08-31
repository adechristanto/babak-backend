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
    condition?: ListingCondition;
    negotiable?: NegotiableStatus;
}
