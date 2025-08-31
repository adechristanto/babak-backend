import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { PaginatedListingsDto } from './dto/paginated-listings.dto';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    create(createListingDto: CreateListingDto, req: any): Promise<ListingResponseDto>;
    findAll(searchDto: SearchListingsDto): Promise<PaginatedListingsDto>;
    findMyListings(searchDto: SearchListingsDto, req: any): Promise<PaginatedListingsDto>;
    findOne(id: number, req: any): Promise<ListingResponseDto>;
    update(id: number, updateListingDto: UpdateListingDto, req: any): Promise<ListingResponseDto>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
    publish(id: number, req: any): Promise<ListingResponseDto>;
    extendExpiration(id: number, days: number | undefined, req: any): Promise<ListingResponseDto>;
    getViewCount(id: number): Promise<{
        viewCount: number;
    }>;
    getRelatedListings(id: number, limit?: number): Promise<ListingResponseDto[]>;
}
