import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferResponseDto } from './dto/offer-response.dto';
import { PaginatedOffersDto } from './dto/paginated-offers.dto';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    create(createOfferDto: CreateOfferDto, req: any): Promise<OfferResponseDto>;
    getReceivedOffers(page: number | undefined, limit: number | undefined, req: any): Promise<PaginatedOffersDto>;
    getSentOffers(page: number | undefined, limit: number | undefined, req: any): Promise<PaginatedOffersDto>;
    findOne(id: number, req: any): Promise<OfferResponseDto>;
    update(id: number, updateOfferDto: UpdateOfferDto, req: any): Promise<OfferResponseDto>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
