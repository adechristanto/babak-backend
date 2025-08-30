import { ListingImagesService } from './listing-images.service';
import { AddImageDto } from './dto/add-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ListingImageResponseDto } from '../dto/listing-response.dto';
export declare class ListingImagesController {
    private readonly listingImagesService;
    constructor(listingImagesService: ListingImagesService);
    addImage(listingId: number, addImageDto: AddImageDto, req: any): Promise<ListingImageResponseDto>;
    getImages(listingId: number): Promise<ListingImageResponseDto[]>;
    updateImage(listingId: number, imageId: number, updateImageDto: UpdateImageDto, req: any): Promise<ListingImageResponseDto>;
    removeImage(listingId: number, imageId: number, req: any): Promise<{
        message: string;
    }>;
    bulkReorder(listingId: number, body: {
        imageIds: number[];
    }, req: any): Promise<ListingImageResponseDto[]>;
}
