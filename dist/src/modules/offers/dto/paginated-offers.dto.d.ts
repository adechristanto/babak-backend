import { OfferResponseDto } from './offer-response.dto';
import { PaginationMetaDto } from '../../listings/dto/paginated-listings.dto';
export declare class PaginatedOffersDto {
    data: OfferResponseDto[];
    meta: PaginationMetaDto;
    constructor(data: OfferResponseDto[], meta: PaginationMetaDto);
}
