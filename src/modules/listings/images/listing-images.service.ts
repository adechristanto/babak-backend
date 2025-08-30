import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UploadsService } from '../../uploads/uploads.service';
import { AddImageDto } from './dto/add-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ListingImageResponseDto } from '../dto/listing-response.dto';

@Injectable()
export class ListingImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  async addImage(listingId: number, addImageDto: AddImageDto, userId: number): Promise<ListingImageResponseDto> {
    const { key, url, position } = addImageDto;

    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only add images to your own listings');
    }

    // Check image limit (max 10 images per listing)
    if (listing.images.length >= 10) {
      throw new BadRequestException('Maximum 10 images allowed per listing');
    }

    // If position not provided, add at the end
    const finalPosition = position !== undefined ? position : listing.images.length;

    // Adjust positions of existing images if necessary
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

    return new ListingImageResponseDto(image);
  }

  async getImages(listingId: number): Promise<ListingImageResponseDto[]> {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const images = await this.prisma.listingImage.findMany({
      where: { listingId },
      orderBy: { position: 'asc' },
    });

    return images.map(image => new ListingImageResponseDto(image));
  }

  async updateImage(
    listingId: number,
    imageId: number,
    updateImageDto: UpdateImageDto,
    userId: number,
  ): Promise<ListingImageResponseDto> {
    const { position } = updateImageDto;

    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only update images of your own listings');
    }

    // Check if image exists and belongs to the listing
    const existingImage = await this.prisma.listingImage.findFirst({
      where: { id: imageId, listingId },
    });

    if (!existingImage) {
      throw new NotFoundException('Image not found');
    }

    // If position is being updated, handle reordering
    if (position !== undefined && position !== existingImage.position) {
      await this.reorderImages(listingId, existingImage.position, position);
    }

    const updatedImage = await this.prisma.listingImage.update({
      where: { id: imageId },
      data: { position },
    });

    return new ListingImageResponseDto(updatedImage);
  }

  async removeImage(listingId: number, imageId: number, userId: number): Promise<void> {
    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only remove images from your own listings');
    }

    // Check if image exists and belongs to the listing
    const existingImage = await this.prisma.listingImage.findFirst({
      where: { id: imageId, listingId },
    });

    if (!existingImage) {
      throw new NotFoundException('Image not found');
    }

    // Delete from database
    await this.prisma.listingImage.delete({
      where: { id: imageId },
    });

    // Adjust positions of remaining images
    await this.prisma.listingImage.updateMany({
      where: {
        listingId,
        position: { gt: existingImage.position },
      },
      data: {
        position: { decrement: 1 },
      },
    });

    // Delete from storage (extract key from URL)
    try {
      const key = this.extractKeyFromUrl(existingImage.url);
      if (key) {
        await this.uploadsService.deleteFile(key);
      }
    } catch (error) {
      console.error('Failed to delete image from storage:', error);
      // Don't throw error as the database deletion was successful
    }
  }

  async reorderImages(listingId: number, fromPosition: number, toPosition: number): Promise<void> {
    if (fromPosition === toPosition) return;

    if (fromPosition < toPosition) {
      // Moving down: shift images up
      await this.prisma.listingImage.updateMany({
        where: {
          listingId,
          position: { gt: fromPosition, lte: toPosition },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    } else {
      // Moving up: shift images down
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

  async bulkReorder(
    listingId: number,
    imageIds: number[],
    userId: number,
  ): Promise<ListingImageResponseDto[]> {
    // Check if listing exists and user owns it
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only reorder images of your own listings');
    }

    // Validate that all image IDs belong to the listing
    const existingImageIds = listing.images.map(img => img.id);
    const invalidIds = imageIds.filter(id => !existingImageIds.includes(id));
    
    if (invalidIds.length > 0) {
      throw new BadRequestException(`Invalid image IDs: ${invalidIds.join(', ')}`);
    }

    if (imageIds.length !== listing.images.length) {
      throw new BadRequestException('Must provide all image IDs for reordering');
    }

    // Update positions
    const updatePromises = imageIds.map((imageId, index) =>
      this.prisma.listingImage.update({
        where: { id: imageId },
        data: { position: index },
      }),
    );

    await Promise.all(updatePromises);

    // Return updated images
    const updatedImages = await this.prisma.listingImage.findMany({
      where: { listingId },
      orderBy: { position: 'asc' },
    });

    return updatedImages.map(image => new ListingImageResponseDto(image));
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      // Extract key from URL (assuming format: https://domain/bucket/key)
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part.includes('babak'));
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        return urlParts.slice(bucketIndex + 1).join('/');
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
