import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { PaginatedListingsDto } from './dto/paginated-listings.dto';
import { ListingAttributesService } from './listing-attributes.service';
export declare class ListingsService {
    private readonly prisma;
    private readonly listingAttributesService;
    constructor(prisma: PrismaService, listingAttributesService: ListingAttributesService);
    create(createListingDto: CreateListingDto, sellerId: number): Promise<ListingResponseDto>;
    findAll(searchDto: SearchListingsDto): Promise<PaginatedListingsDto>;
    findOne(id: number, viewerId?: number, ipAddress?: string, userAgent?: string): Promise<ListingResponseDto>;
    private trackView;
    getViewCount(listingId: number): Promise<number>;
    getRelatedListings(listingId: number, limit?: number): Promise<ListingResponseDto[]>;
    findMyListings(sellerId: number, searchDto: SearchListingsDto): Promise<PaginatedListingsDto>;
    findListingsByUser(userId: number, searchDto: SearchListingsDto): Promise<PaginatedListingsDto>;
    update(id: number, updateListingDto: UpdateListingDto, userId: number): Promise<ListingResponseDto>;
    remove(id: number, userId: number): Promise<void>;
    publish(id: number, userId: number): Promise<ListingResponseDto>;
    extendExpiration(id: number, userId: number, days?: number): Promise<ListingResponseDto>;
    private mapToResponseDto;
}
