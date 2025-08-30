"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingImagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const uploads_service_1 = require("../../uploads/uploads.service");
const listing_response_dto_1 = require("../dto/listing-response.dto");
let ListingImagesService = class ListingImagesService {
    prisma;
    uploadsService;
    constructor(prisma, uploadsService) {
        this.prisma = prisma;
        this.uploadsService = uploadsService;
    }
    async addImage(listingId, addImageDto, userId) {
        const { key, url, position } = addImageDto;
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { images: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only add images to your own listings');
        }
        if (listing.images.length >= 10) {
            throw new common_1.BadRequestException('Maximum 10 images allowed per listing');
        }
        const finalPosition = position !== undefined ? position : listing.images.length;
        if (finalPosition < listing.images.length) {
            await this.prisma.listingImage.updateMany({
                where: {
                    listingId,
                    position: { gte: finalPosition },
                },
                data: {
                    position: { increment: 1 },
                },
            });
        }
        const image = await this.prisma.listingImage.create({
            data: {
                listingId,
                url,
                position: finalPosition,
            },
        });
        return new listing_response_dto_1.ListingImageResponseDto(image);
    }
    async getImages(listingId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const images = await this.prisma.listingImage.findMany({
            where: { listingId },
            orderBy: { position: 'asc' },
        });
        return images.map(image => new listing_response_dto_1.ListingImageResponseDto(image));
    }
    async updateImage(listingId, imageId, updateImageDto, userId) {
        const { position } = updateImageDto;
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { images: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only update images of your own listings');
        }
        const existingImage = await this.prisma.listingImage.findFirst({
            where: { id: imageId, listingId },
        });
        if (!existingImage) {
            throw new common_1.NotFoundException('Image not found');
        }
        if (position !== undefined && position !== existingImage.position) {
            await this.reorderImages(listingId, existingImage.position, position);
        }
        const updatedImage = await this.prisma.listingImage.update({
            where: { id: imageId },
            data: { position },
        });
        return new listing_response_dto_1.ListingImageResponseDto(updatedImage);
    }
    async removeImage(listingId, imageId, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only remove images from your own listings');
        }
        const existingImage = await this.prisma.listingImage.findFirst({
            where: { id: imageId, listingId },
        });
        if (!existingImage) {
            throw new common_1.NotFoundException('Image not found');
        }
        await this.prisma.listingImage.delete({
            where: { id: imageId },
        });
        await this.prisma.listingImage.updateMany({
            where: {
                listingId,
                position: { gt: existingImage.position },
            },
            data: {
                position: { decrement: 1 },
            },
        });
        try {
            const key = this.extractKeyFromUrl(existingImage.url);
            if (key) {
                await this.uploadsService.deleteFile(key);
            }
        }
        catch (error) {
            console.error('Failed to delete image from storage:', error);
        }
    }
    async reorderImages(listingId, fromPosition, toPosition) {
        if (fromPosition === toPosition)
            return;
        if (fromPosition < toPosition) {
            await this.prisma.listingImage.updateMany({
                where: {
                    listingId,
                    position: { gt: fromPosition, lte: toPosition },
                },
                data: {
                    position: { decrement: 1 },
                },
            });
        }
        else {
            await this.prisma.listingImage.updateMany({
                where: {
                    listingId,
                    position: { gte: toPosition, lt: fromPosition },
                },
                data: {
                    position: { increment: 1 },
                },
            });
        }
    }
    async bulkReorder(listingId, imageIds, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { images: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only reorder images of your own listings');
        }
        const existingImageIds = listing.images.map(img => img.id);
        const invalidIds = imageIds.filter(id => !existingImageIds.includes(id));
        if (invalidIds.length > 0) {
            throw new common_1.BadRequestException(`Invalid image IDs: ${invalidIds.join(', ')}`);
        }
        if (imageIds.length !== listing.images.length) {
            throw new common_1.BadRequestException('Must provide all image IDs for reordering');
        }
        const updatePromises = imageIds.map((imageId, index) => this.prisma.listingImage.update({
            where: { id: imageId },
            data: { position: index },
        }));
        await Promise.all(updatePromises);
        const updatedImages = await this.prisma.listingImage.findMany({
            where: { listingId },
            orderBy: { position: 'asc' },
        });
        return updatedImages.map(image => new listing_response_dto_1.ListingImageResponseDto(image));
    }
    extractKeyFromUrl(url) {
        try {
            const urlParts = url.split('/');
            const bucketIndex = urlParts.findIndex(part => part.includes('babak'));
            if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
                return urlParts.slice(bucketIndex + 1).join('/');
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
};
exports.ListingImagesService = ListingImagesService;
exports.ListingImagesService = ListingImagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService])
], ListingImagesService);
//# sourceMappingURL=listing-images.service.js.map