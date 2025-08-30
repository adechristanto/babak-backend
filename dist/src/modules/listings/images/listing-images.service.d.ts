import { PrismaService } from '../../../prisma/prisma.service';
import { UploadsService } from '../../uploads/uploads.service';
import { AddImageDto } from './dto/add-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ListingImageResponseDto } from '../dto/listing-response.dto';
export declare class ListingImagesService {
    private readonly prisma;
    private readonly uploadsService;
    constructor(prisma: PrismaService, uploadsService: UploadsService);
    addImage(listingId: number, addImageDto: AddImageDto, userId: number): Promise<ListingImageResponseDto>;
    getImages(listingId: number): Promise<ListingImageResponseDto[]>;
    updateImage(listingId: number, imageId: number, updateImageDto: UpdateImageDto, userId: number): Promise<ListingImageResponseDto>;
    removeImage(listingId: number, imageId: number, userId: number): Promise<void>;
    reorderImages(listingId: number, fromPosition: number, toPosition: number): Promise<void>;
    bulkReorder(listingId: number, imageIds: number[], userId: number): Promise<ListingImageResponseDto[]>;
    private extractKeyFromUrl;
}
