import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ListingImagesService } from './listing-images.service';
import { AddImageDto } from './dto/add-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ListingImageResponseDto } from '../dto/listing-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Listing Images')
@Controller('listings/:listingId/images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListingImagesController {
  constructor(private readonly listingImagesService: ListingImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Add image to listing' })
  @ApiResponse({ status: 201, description: 'Image added successfully', type: ListingImageResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only add images to your own listings' })
  @ApiResponse({ status: 400, description: 'Maximum 10 images allowed per listing' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  async addImage(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() addImageDto: AddImageDto,
    @Request() req: any,
  ): Promise<ListingImageResponseDto> {
    return this.listingImagesService.addImage(listingId, addImageDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images for a listing' })
  @ApiResponse({ status: 200, description: 'Images retrieved successfully', type: [ListingImageResponseDto] })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  async getImages(
    @Param('listingId', ParseIntPipe) listingId: number,
  ): Promise<ListingImageResponseDto[]> {
    return this.listingImagesService.getImages(listingId);
  }

  @Patch(':imageId')
  @ApiOperation({ summary: 'Update image (e.g., change position)' })
  @ApiResponse({ status: 200, description: 'Image updated successfully', type: ListingImageResponseDto })
  @ApiResponse({ status: 404, description: 'Listing or image not found' })
  @ApiResponse({ status: 403, description: 'You can only update images of your own listings' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  async updateImage(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() updateImageDto: UpdateImageDto,
    @Request() req: any,
  ): Promise<ListingImageResponseDto> {
    return this.listingImagesService.updateImage(listingId, imageId, updateImageDto, req.user.id);
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Remove image from listing' })
  @ApiResponse({ status: 200, description: 'Image removed successfully' })
  @ApiResponse({ status: 404, description: 'Listing or image not found' })
  @ApiResponse({ status: 403, description: 'You can only remove images from your own listings' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  @ApiParam({ name: 'imageId', description: 'Image ID' })
  async removeImage(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.listingImagesService.removeImage(listingId, imageId, req.user.id);
    return { message: 'Image removed successfully' };
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Bulk reorder images' })
  @ApiResponse({ status: 200, description: 'Images reordered successfully', type: [ListingImageResponseDto] })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only reorder images of your own listings' })
  @ApiResponse({ status: 400, description: 'Invalid image IDs provided' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  async bulkReorder(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() body: { imageIds: number[] },
    @Request() req: any,
  ): Promise<ListingImageResponseDto[]> {
    return this.listingImagesService.bulkReorder(listingId, body.imageIds, req.user.id);
  }
}
