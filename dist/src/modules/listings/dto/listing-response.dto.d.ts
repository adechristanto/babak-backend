import { ListingStatus } from '@prisma/client';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
export declare class ListingImageResponseDto {
    id: number;
    url: string;
    position: number;
    createdAt: Date;
    constructor(partial: Partial<ListingImageResponseDto>);
}
export declare class ListingResponseDto {
    id: number;
    title: string;
    description: string | null;
    price: number;
    currency: string;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
    locationAddress: string | null;
    locationCity: string | null;
    locationCountry: string | null;
    locationPlaceId: string | null;
    status: ListingStatus;
    isVip: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
    seller: UserResponseDto;
    category: CategoryResponseDto | null;
    images: ListingImageResponseDto[];
    constructor(partial: any);
}
