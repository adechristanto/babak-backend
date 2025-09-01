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
import { ListingAttributesService } from './listing-attributes.service';
import { EmailService } from '../email/email.service';

// Utility function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingAttributesService: ListingAttributesService,
    private readonly emailService: EmailService
  ) {}

  async create(createListingDto: CreateListingDto, sellerId: number): Promise<ListingResponseDto> {
    const { categoryId, attributes, ...listingData } = createListingDto;

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

    // Create listing and attributes in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the listing
      const listing = await tx.listing.create({
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

      // Create attributes if provided
      if (attributes && attributes.length > 0) {
        await this.listingAttributesService.bulkUpsert(listing.id, { attributes });
      }

      return listing;
    });

    return await this.mapToResponseDto(result);
  }

  async findAll(searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      city,
      latitude,
      longitude,
      radiusKm,
      status,
      isVip,
      isFeatured,
      sellerId,
      sortBy,
      sortOrder,
      page,
      limit,
      attributeFilters,
    } = searchDto;

    // Build where clause
    const where: Prisma.ListingWhereInput = {};
    
    // Only filter by status if explicitly provided, otherwise show all statuses
    if (status !== undefined) {
      where.status = status;
    } else {
      // For user's own listings, show DRAFT, PENDING, ACTIVE, and REJECTED
      where.status = { in: [ListingStatus.DRAFT, ListingStatus.PENDING, ListingStatus.ACTIVE, ListingStatus.REJECTED] };
    }

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

    // Geo radius filter with proper distance calculation
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      radiusKm !== undefined &&
      radiusKm > 0
    ) {
      // First, apply a bounding box filter for performance (pre-filter)
      const latDelta = radiusKm / 111; // Approximate: 1 degree lat ≈ 111km
      const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180) || 1);

      where.AND = where.AND || [];
      (where.AND as any[]).push({
        latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
      });
      (where.AND as any[]).push({
        longitude: { gte: longitude - lonDelta, lte: longitude + lonDelta },
      });
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

    // Attribute filters
    if (attributeFilters && attributeFilters.length > 0) {
      where.attributes = {
        some: {
          OR: attributeFilters.map(filter => {
            const attributeWhere: any = {
              attribute: { key: filter.key }
            };

            // Handle different filter types
            if (filter.value !== undefined) {
              // Exact value match
              attributeWhere.value = { contains: filter.value, mode: 'insensitive' };
            } else if (filter.minValue !== undefined || filter.maxValue !== undefined) {
              // Numeric range filter
              attributeWhere.numericValue = {};
              if (filter.minValue !== undefined) {
                attributeWhere.numericValue.gte = filter.minValue;
              }
              if (filter.maxValue !== undefined) {
                attributeWhere.numericValue.lte = filter.maxValue;
              }
            } else if (filter.booleanValue !== undefined) {
              // Boolean filter
              attributeWhere.booleanValue = filter.booleanValue;
            } else if (filter.values && filter.values.length > 0) {
              // Multiple values filter (for multiselect)
              attributeWhere.OR = filter.values.map(value => ({
                jsonValue: { path: '$', array_contains: value }
              }));
            }

            return attributeWhere;
          })
        }
      };
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
          attributes: {
            include: {
              attribute: true,
            },
            orderBy: {
              attribute: {
                displayOrder: 'asc',
              },
            },
          },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    // Apply precise distance filtering if radius search is enabled
    let filteredListings = listings;
    let adjustedTotal = total;

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      radiusKm !== undefined &&
      radiusKm > 0
    ) {
      filteredListings = listings.filter(listing => {
        if (listing.latitude === null || listing.longitude === null) {
          return false; // Exclude listings without coordinates
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          Number(listing.latitude),
          Number(listing.longitude)
        );

        return distance <= radiusKm;
      });

      // For radius searches, we need to recalculate the total count
      // This is a simplified approach - in production, you might want to optimize this
      if (filteredListings.length !== listings.length) {
        // Get all listings matching other criteria for accurate count
        const allMatchingListings = await this.prisma.listing.findMany({
          where,
          select: { id: true, latitude: true, longitude: true },
        });

        const filteredCount = allMatchingListings.filter(listing => {
          if (listing.latitude === null || listing.longitude === null) {
            return false;
          }

          const distance = calculateDistance(
            latitude,
            longitude,
            Number(listing.latitude),
            Number(listing.longitude)
          );

          return distance <= radiusKm;
        }).length;

        adjustedTotal = filteredCount;
      }
    }

    const listingDtos = await Promise.all(filteredListings.map(listing => this.mapToResponseDto(listing)));
    const meta = new PaginationMetaDto(page || 1, limit || 20, adjustedTotal);

    return new PaginatedListingsDto(listingDtos, meta);
  }

  async findOne(id: number, viewerId?: number, ipAddress?: string, userAgent?: string): Promise<ListingResponseDto> {
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

    // Track view (non-blocking)
    this.trackView(id, viewerId, ipAddress, userAgent).catch(err => {
      console.error('Failed to track view:', err);
    });

    return await this.mapToResponseDto(listing);
  }

  private async trackView(listingId: number, viewerId?: number, ipAddress?: string, userAgent?: string) {
    try {
      await this.prisma.listingView.create({
        data: {
          listingId,
          viewerId,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      // Silently fail view tracking to not affect main functionality
      console.error('View tracking failed:', error);
    }
  }

  async getViewCount(listingId: number): Promise<number> {
    const count = await this.prisma.listingView.count({
      where: { listingId },
    });
    return count;
  }

  async getRelatedListings(listingId: number, limit: number = 4): Promise<ListingResponseDto[]> {
    // First get the current listing to find related ones
    const currentListing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { category: true },
    });

    if (!currentListing) {
      throw new NotFoundException('Listing not found');
    }

    // Find related listings based on category, price range, and location
    const price = Number(currentListing.price);
    const priceRange = price * 0.3; // 30% price range
    const minPrice = Math.max(0, price - priceRange);
    const maxPrice = price + priceRange;

    const relatedListings = await this.prisma.listing.findMany({
      where: {
        AND: [
          { id: { not: listingId } }, // Exclude current listing
          { status: ListingStatus.ACTIVE },
          {
            OR: [
              { categoryId: currentListing.categoryId }, // Same category
              {
                AND: [
                  { price: { gte: minPrice } },
                  { price: { lte: maxPrice } }
                ]
              }, // Similar price range
              { city: currentListing.city }, // Same city
            ],
          },
        ],
      },
      orderBy: [
        { categoryId: currentListing.categoryId ? 'desc' : 'asc' }, // Prioritize same category
        { isFeatured: 'desc' },
        { isVip: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return await Promise.all(relatedListings.map(listing => this.mapToResponseDto(listing)));
  }

  async findMyListings(sellerId: number, searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    // For user's own listings, show both DRAFT and ACTIVE statuses
    return this.findAll({ ...searchDto, sellerId, status: undefined });
  }

  async findListingsByUser(userId: number, searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    // First check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.findAll({ ...searchDto, sellerId: userId });
  }

  async update(id: number, updateListingDto: UpdateListingDto, userId: number): Promise<ListingResponseDto> {
    const { categoryId, attributes, ...updateData } = updateListingDto;

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

    // Update listing and attributes in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update the listing
      const listing = await tx.listing.update({
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

      // Update attributes if provided
      if (attributes && attributes.length > 0) {
        await this.listingAttributesService.bulkUpsert(listing.id, { attributes });
      }

      return listing;
    });

    return await this.mapToResponseDto(result);
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

  async submitForApproval(id: number, userId: number): Promise<ListingResponseDto> {
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

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You can only submit your own listings');
    }

    if (listing.status !== ListingStatus.DRAFT) {
      throw new BadRequestException('Only draft listings can be submitted for approval');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.PENDING },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    // Send email notifications to all admins
    await this.notifyAdminsForApproval(updatedListing);

    return await this.mapToResponseDto(updatedListing);
  }

  async approve(id: number, _adminId: number): Promise<ListingResponseDto> {
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

    if (listing.status !== ListingStatus.PENDING) {
      throw new BadRequestException('Only pending listings can be approved');
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

    // Send email notification to seller
    await this.notifySellerOfApproval(updatedListing);

    return await this.mapToResponseDto(updatedListing);
  }

  async reject(id: number, _adminId: number, reason?: string): Promise<ListingResponseDto> {
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

    if (listing.status !== ListingStatus.PENDING) {
      throw new BadRequestException('Only pending listings can be rejected');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.REJECTED },
      include: {
        seller: true,
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    // Send email notification to seller
    await this.notifySellerOfRejection(updatedListing, reason);

    return await this.mapToResponseDto(updatedListing);
  }

  async findPendingApproval(searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    return this.findAll({ ...searchDto, status: ListingStatus.PENDING });
  }

  private async notifyAdminsForApproval(listing: any): Promise<void> {
    try {
      // Get all admin users
      const admins = await this.prisma.user.findMany({
        where: {
          role: { in: ['ADMIN', 'SUPERUSER'] },
          emailVerified: true,
        },
      });

      // Send email to each admin
      for (const admin of admins) {
        await this.emailService.sendEmail({
          to: admin.email,
          subject: 'New Listing Pending Approval',
          html: `
            <h2>New Listing Pending Approval</h2>
            <p>A new listing has been submitted and requires your approval.</p>
            <h3>Listing Details:</h3>
            <ul>
              <li><strong>Title:</strong> ${listing.title}</li>
              <li><strong>Seller:</strong> ${listing.seller.name || listing.seller.email}</li>
              <li><strong>Category:</strong> ${listing.category?.name || 'Uncategorized'}</li>
              <li><strong>Price:</strong> ${listing.price} ${listing.currency}</li>
              <li><strong>Submitted:</strong> ${new Date(listing.updatedAt).toLocaleString()}</li>
            </ul>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/listings/${listing.id}/review" 
                 style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Review Listing
              </a>
            </p>
            <p>Please review this listing and approve or reject it.</p>
          `,
        });
      }
    } catch (error) {
      console.error('Failed to notify admins:', error);
    }
  }

  private async notifySellerOfApproval(listing: any): Promise<void> {
    try {
      await this.emailService.sendEmail({
        to: listing.seller.email,
        subject: 'Your Listing Has Been Approved!',
        html: `
          <h2>Congratulations! Your Listing Has Been Approved</h2>
          <p>Your listing "${listing.title}" has been approved and is now live on our platform.</p>
          <h3>Listing Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${listing.title}</li>
            <li><strong>Category:</strong> ${listing.category?.name || 'Uncategorized'}</li>
            <li><strong>Price:</strong> ${listing.price} ${listing.currency}</li>
            <li><strong>Approved:</strong> ${new Date(listing.updatedAt).toLocaleString()}</li>
          </ul>
          <p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/p/${listing.id}" 
               style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Your Listing
            </a>
          </p>
          <p>Your listing is now visible to potential buyers. Good luck with your sale!</p>
        `,
      });
    } catch (error) {
      console.error('Failed to notify seller of approval:', error);
    }
  }

  private async notifySellerOfRejection(listing: any, reason?: string): Promise<void> {
    try {
      await this.emailService.sendEmail({
        to: listing.seller.email,
        subject: 'Your Listing Has Been Rejected',
        html: `
          <h2>Your Listing Has Been Rejected</h2>
          <p>We're sorry, but your listing "${listing.title}" has been rejected and will not be published.</p>
          <h3>Listing Details:</h3>
          <ul>
            <li><strong>Title:</strong> ${listing.title}</li>
            <li><strong>Category:</strong> ${listing.category?.name || 'Uncategorized'}</li>
            <li><strong>Price:</strong> ${listing.price} ${listing.currency}</li>
            <li><strong>Rejected:</strong> ${new Date(listing.updatedAt).toLocaleString()}</li>
          </ul>
          ${reason ? `<h3>Reason for Rejection:</h3><p>${reason}</p>` : ''}
          <p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-ads" 
               style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View My Listings
            </a>
          </p>
          <p>You can edit your listing and submit it again for approval, or contact support if you have any questions.</p>
        `,
      });
    } catch (error) {
      console.error('Failed to notify seller of rejection:', error);
    }
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

    return await this.mapToResponseDto(updatedListing);
  }

  private async mapToResponseDto(listing: any): Promise<ListingResponseDto> {
    // Map attributes if they're included in the query, otherwise fetch them
    let attributes: any[] = [];
    if (listing.attributes) {
      attributes = listing.attributes.map((attr: any) => ({
        id: attr.id,
        listingId: attr.listingId,
        attributeId: attr.attributeId,
        value: attr.value,
        numericValue: attr.numericValue ? parseFloat(attr.numericValue) : null,
        booleanValue: attr.booleanValue,
        dateValue: attr.dateValue,
        jsonValue: attr.jsonValue,
        createdAt: attr.createdAt,
        updatedAt: attr.updatedAt,
        attribute: attr.attribute ? {
          id: attr.attribute.id,
          name: attr.attribute.name,
          key: attr.attribute.key,
          type: attr.attribute.type,
          dataType: attr.attribute.dataType,
          unit: attr.attribute.unit,
          options: attr.attribute.options,
        } : undefined,
      }));
    } else {
      // Fallback to fetching attributes separately
      attributes = await this.listingAttributesService.findByListing(listing.id);
    }

    return new ListingResponseDto({
      ...listing,
      seller: new UserResponseDto(listing.seller),
      category: listing.category ? new CategoryResponseDto(listing.category) : null,
      attributes,
    });
  }
}
