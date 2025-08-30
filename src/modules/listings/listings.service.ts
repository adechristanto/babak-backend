import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto, SortBy } from './dto/search-listings.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { PaginatedListingsDto, PaginationMetaDto } from './dto/paginated-listings.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createListingDto: CreateListingDto, sellerId: number): Promise<ListingResponseDto> {
    const { categoryId, ...listingData } = createListingDto;

    // Validate category if provided
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const listing = await this.prisma.listing.create({
      data: {
        ...listingData,
        sellerId,
        categoryId,
        status: ListingStatus.DRAFT,
        expiresAt,
      },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return this.mapToResponseDto(listing);
  }

  async findAll(searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      city,
      status,
      isVip,
      isFeatured,
      sellerId,
      sortBy,
      sortOrder,
      page,
      limit,
    } = searchDto;

    // Build where clause
    const where: Prisma.ListingWhereInput = {
      status: status || ListingStatus.ACTIVE,
    };

    // Text search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Location filter
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    // VIP filter
    if (isVip !== undefined) {
      where.isVip = isVip;
    }

    // Featured filter
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Seller filter
    if (sellerId) {
      where.sellerId = sellerId;
    }

    // Build order by clause
    const orderBy: Prisma.ListingOrderByWithRelationInput = {};
    
    switch (sortBy) {
      case SortBy.PRICE:
        orderBy.price = sortOrder;
        break;
      case SortBy.TITLE:
        orderBy.title = sortOrder;
        break;
      case SortBy.UPDATED_AT:
        orderBy.updatedAt = sortOrder;
        break;
      default:
        orderBy.createdAt = sortOrder;
    }

    // Add secondary sort for consistency
    if (sortBy !== SortBy.CREATED_AT) {
      orderBy.createdAt = 'desc';
    }

    // Calculate pagination
    const skip = ((page || 1) - 1) * (limit || 20);

    // Execute queries
    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit || 20,
        include: {
          seller: true,
          category: true,
          images: {
            orderBy: { position: 'asc' },
          },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    const listingDtos = listings.map(listing => this.mapToResponseDto(listing));
    const meta = new PaginationMetaDto(page || 1, limit || 20, total);

    return new PaginatedListingsDto(listingDtos, meta);
  }

  async findOne(id: number): Promise<ListingResponseDto> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return this.mapToResponseDto(listing);
  }

  async findMyListings(sellerId: number, searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    return this.findAll({ ...searchDto, sellerId });
  }

  async update(id: number, updateListingDto: UpdateListingDto, userId: number): Promise<ListingResponseDto> {
    const { categoryId, ...updateData } = updateListingDto;

    // Check if listing exists and user owns it
    const existingListing = await this.prisma.listing.findUnique({
      where: { id },
      include: { seller: true },
    });

    if (!existingListing) {
      throw new NotFoundException('Listing not found');
    }

    if (existingListing.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    // Validate category if provided
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const listing = await this.prisma.listing.update({
      where: { id },
      data: {
        ...updateData,
        categoryId,
      },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return this.mapToResponseDto(listing);
  }

  async remove(id: number, userId: number): Promise<void> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.listing.delete({
      where: { id },
    });
  }

  async publish(id: number, userId: number): Promise<ListingResponseDto> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only publish your own listings');
    }

    if (listing.status !== ListingStatus.DRAFT) {
      throw new BadRequestException('Only draft listings can be published');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.ACTIVE },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return this.mapToResponseDto(updatedListing);
  }

  async extendExpiration(id: number, userId: number, days: number = 30): Promise<ListingResponseDto> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only extend your own listings');
    }

    const newExpirationDate = new Date(listing.expiresAt || new Date());
    newExpirationDate.setDate(newExpirationDate.getDate() + days);

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: { expiresAt: newExpirationDate },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return this.mapToResponseDto(updatedListing);
  }

  private mapToResponseDto(listing: any): ListingResponseDto {
    return new ListingResponseDto({
      ...listing,
      seller: new UserResponseDto(listing.seller),
      category: listing.category ? new CategoryResponseDto(listing.category) : null,
    });
  }
}
