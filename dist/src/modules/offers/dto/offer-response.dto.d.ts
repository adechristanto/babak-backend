import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ListingResponseDto } from '../../listings/dto/listing-response.dto';
export declare class OfferResponseDto {
    id: number;
    listingId: number;
    buyerId: number;
    amount: number;
    message: string;
    status: string;
    counterAmount?: number;
    responseMessage?: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    buyer: UserResponseDto;
    listing: ListingResponseDto;
    constructor(partial: Partial<OfferResponseDto>);
}
