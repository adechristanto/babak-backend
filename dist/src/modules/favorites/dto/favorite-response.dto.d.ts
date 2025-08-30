import { ListingResponseDto } from '../../listings/dto/listing-response.dto';
export declare class FavoriteResponseDto {
    userId: number;
    listingId: number;
    addedAt: Date;
    listing: ListingResponseDto;
    constructor(partial: Partial<FavoriteResponseDto>);
}
