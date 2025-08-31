import { ListingStatus, ListingCondition, NegotiableStatus } from '@prisma/client';
import { CreateListingAttributeDto } from './listing-attribute.dto';
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    categoryId?: number;
    city?: string;
    latitude?: number;
    longitude?: number;
    locationAddress?: string;
    locationCity?: string;
    locationCountry?: string;
    locationPlaceId?: string;
    status?: ListingStatus;
    condition?: ListingCondition;
    negotiable?: NegotiableStatus;
    attributes?: CreateListingAttributeDto[];
}
