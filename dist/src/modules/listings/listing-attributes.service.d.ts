import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingAttributeDto, UpdateListingAttributeDto, ListingAttributeResponseDto, BulkListingAttributesDto } from './dto/listing-attribute.dto';
import { CategoryAttributeDefinition } from './utils/attribute-validator';
export declare class ListingAttributesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(listingId: number, createDto: CreateListingAttributeDto): Promise<ListingAttributeResponseDto>;
    findByListing(listingId: number): Promise<ListingAttributeResponseDto[]>;
    findOne(id: number): Promise<ListingAttributeResponseDto>;
    update(id: number, updateDto: UpdateListingAttributeDto): Promise<ListingAttributeResponseDto>;
    remove(id: number): Promise<void>;
    bulkUpsert(listingId: number, bulkDto: BulkListingAttributesDto): Promise<ListingAttributeResponseDto[]>;
    removeByListing(listingId: number): Promise<void>;
    getAttributesByCategory(categoryId: number): Promise<CategoryAttributeDefinition[]>;
    private validateAttributeForCategory;
    private prepareAttributeData;
    private hasValue;
    private mapToResponseDto;
}
