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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const search_listings_dto_1 = require("./dto/search-listings.dto");
const listing_response_dto_1 = require("./dto/listing-response.dto");
const paginated_listings_dto_1 = require("./dto/paginated-listings.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const category_response_dto_1 = require("../categories/dto/category-response.dto");
const listing_attributes_service_1 = require("./listing-attributes.service");
const email_service_1 = require("../email/email.service");
let ListingsService = class ListingsService {
    prisma;
    listingAttributesService;
    emailService;
    constructor(prisma, listingAttributesService, emailService) {
        this.prisma = prisma;
        this.listingAttributesService = listingAttributesService;
        this.emailService = emailService;
    }
    async create(createListingDto, sellerId) {
        const { categoryId, attributes, ...listingData } = createListingDto;
        if (categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        const result = await this.prisma.$transaction(async (tx) => {
            const listing = await tx.listing.create({
                data: {
                    ...listingData,
                    sellerId,
                    categoryId,
                    status: client_1.ListingStatus.DRAFT,
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
            if (attributes && attributes.length > 0) {
                await this.listingAttributesService.bulkUpsert(listing.id, { attributes });
            }
            return listing;
        });
        return await this.mapToResponseDto(result);
    }
    async findAll(searchDto) {
        const { q, categoryId, minPrice, maxPrice, city, latitude, longitude, radiusKm, status, isVip, isFeatured, sellerId, sortBy, sortOrder, page, limit, attributeFilters, } = searchDto;
        const where = {};
        if (status !== undefined) {
            where.status = status;
        }
        else {
            where.status = { in: [client_1.ListingStatus.DRAFT, client_1.ListingStatus.PENDING, client_1.ListingStatus.ACTIVE, client_1.ListingStatus.REJECTED] };
        }
        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = minPrice;
            }
            if (maxPrice !== undefined) {
                where.price.lte = maxPrice;
            }
        }
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }
        if (latitude !== undefined &&
            longitude !== undefined &&
            radiusKm !== undefined &&
            radiusKm > 0) {
            const latDelta = radiusKm / 111;
            const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180) || 1);
            where.AND = where.AND || [];
            where.AND.push({
                latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
            });
            where.AND.push({
                longitude: { gte: longitude - lonDelta, lte: longitude + lonDelta },
            });
        }
        if (isVip !== undefined) {
            where.isVip = isVip;
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (sellerId) {
            where.sellerId = sellerId;
        }
        if (attributeFilters && attributeFilters.length > 0) {
            where.attributes = {
                some: {
                    OR: attributeFilters.map(filter => {
                        const attributeWhere = {
                            attribute: { key: filter.key }
                        };
                        if (filter.value !== undefined) {
                            attributeWhere.value = { contains: filter.value, mode: 'insensitive' };
                        }
                        else if (filter.minValue !== undefined || filter.maxValue !== undefined) {
                            attributeWhere.numericValue = {};
                            if (filter.minValue !== undefined) {
                                attributeWhere.numericValue.gte = filter.minValue;
                            }
                            if (filter.maxValue !== undefined) {
                                attributeWhere.numericValue.lte = filter.maxValue;
                            }
                        }
                        else if (filter.booleanValue !== undefined) {
                            attributeWhere.booleanValue = filter.booleanValue;
                        }
                        else if (filter.values && filter.values.length > 0) {
                            attributeWhere.OR = filter.values.map(value => ({
                                jsonValue: { path: '$', array_contains: value }
                            }));
                        }
                        return attributeWhere;
                    })
                }
            };
        }
        const orderBy = {};
        switch (sortBy) {
            case search_listings_dto_1.SortBy.PRICE:
                orderBy.price = sortOrder;
                break;
            case search_listings_dto_1.SortBy.TITLE:
                orderBy.title = sortOrder;
                break;
            case search_listings_dto_1.SortBy.UPDATED_AT:
                orderBy.updatedAt = sortOrder;
                break;
            default:
                orderBy.createdAt = sortOrder;
        }
        if (sortBy !== search_listings_dto_1.SortBy.CREATED_AT) {
            orderBy.createdAt = 'desc';
        }
        const skip = ((page || 1) - 1) * (limit || 20);
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
        const listingDtos = await Promise.all(listings.map(listing => this.mapToResponseDto(listing)));
        const meta = new paginated_listings_dto_1.PaginationMetaDto(page || 1, limit || 20, total);
        return new paginated_listings_dto_1.PaginatedListingsDto(listingDtos, meta);
    }
    async findOne(id, viewerId, ipAddress, userAgent) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        this.trackView(id, viewerId, ipAddress, userAgent).catch(err => {
            console.error('Failed to track view:', err);
        });
        return await this.mapToResponseDto(listing);
    }
    async trackView(listingId, viewerId, ipAddress, userAgent) {
        try {
            await this.prisma.listingView.create({
                data: {
                    listingId,
                    viewerId,
                    ipAddress,
                    userAgent,
                },
            });
        }
        catch (error) {
            console.error('View tracking failed:', error);
        }
    }
    async getViewCount(listingId) {
        const count = await this.prisma.listingView.count({
            where: { listingId },
        });
        return count;
    }
    async getRelatedListings(listingId, limit = 4) {
        const currentListing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { category: true },
        });
        if (!currentListing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const price = Number(currentListing.price);
        const priceRange = price * 0.3;
        const minPrice = Math.max(0, price - priceRange);
        const maxPrice = price + priceRange;
        const relatedListings = await this.prisma.listing.findMany({
            where: {
                AND: [
                    { id: { not: listingId } },
                    { status: client_1.ListingStatus.ACTIVE },
                    {
                        OR: [
                            { categoryId: currentListing.categoryId },
                            {
                                AND: [
                                    { price: { gte: minPrice } },
                                    { price: { lte: maxPrice } }
                                ]
                            },
                            { city: currentListing.city },
                        ],
                    },
                ],
            },
            orderBy: [
                { categoryId: currentListing.categoryId ? 'desc' : 'asc' },
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
    async findMyListings(sellerId, searchDto) {
        return this.findAll({ ...searchDto, sellerId, status: undefined });
    }
    async findListingsByUser(userId, searchDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.findAll({ ...searchDto, sellerId: userId });
    }
    async update(id, updateListingDto, userId) {
        const { categoryId, attributes, ...updateData } = updateListingDto;
        const existingListing = await this.prisma.listing.findUnique({
            where: { id },
            include: { seller: true },
        });
        if (!existingListing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (existingListing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        if (categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const result = await this.prisma.$transaction(async (tx) => {
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
            if (attributes && attributes.length > 0) {
                await this.listingAttributesService.bulkUpsert(listing.id, { attributes });
            }
            return listing;
        });
        return await this.mapToResponseDto(result);
    }
    async remove(id, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own listings');
        }
        await this.prisma.listing.delete({
            where: { id },
        });
    }
    async submitForApproval(id, userId) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only submit your own listings');
        }
        if (listing.status !== client_1.ListingStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft listings can be submitted for approval');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: { status: client_1.ListingStatus.PENDING },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        await this.notifyAdminsForApproval(updatedListing);
        return await this.mapToResponseDto(updatedListing);
    }
    async approve(id, adminId) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.status !== client_1.ListingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending listings can be approved');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: { status: client_1.ListingStatus.ACTIVE },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        await this.notifySellerOfApproval(updatedListing);
        return await this.mapToResponseDto(updatedListing);
    }
    async reject(id, adminId, reason) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.status !== client_1.ListingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending listings can be rejected');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: { status: client_1.ListingStatus.REJECTED },
            include: {
                seller: true,
                category: true,
                images: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        await this.notifySellerOfRejection(updatedListing, reason);
        return await this.mapToResponseDto(updatedListing);
    }
    async findPendingApproval(searchDto) {
        return this.findAll({ ...searchDto, status: client_1.ListingStatus.PENDING });
    }
    async notifyAdminsForApproval(listing) {
        try {
            const admins = await this.prisma.user.findMany({
                where: {
                    role: { in: ['ADMIN', 'SUPERUSER'] },
                    emailVerified: true,
                },
            });
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
        }
        catch (error) {
            console.error('Failed to notify admins:', error);
        }
    }
    async notifySellerOfApproval(listing) {
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
        }
        catch (error) {
            console.error('Failed to notify seller of approval:', error);
        }
    }
    async notifySellerOfRejection(listing, reason) {
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
        }
        catch (error) {
            console.error('Failed to notify seller of rejection:', error);
        }
    }
    async extendExpiration(id, userId, days = 30) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only extend your own listings');
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
    async mapToResponseDto(listing) {
        let attributes = [];
        if (listing.attributes) {
            attributes = listing.attributes.map((attr) => ({
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
        }
        else {
            attributes = await this.listingAttributesService.findByListing(listing.id);
        }
        return new listing_response_dto_1.ListingResponseDto({
            ...listing,
            seller: new user_response_dto_1.UserResponseDto(listing.seller),
            category: listing.category ? new category_response_dto_1.CategoryResponseDto(listing.category) : null,
            attributes,
        });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        listing_attributes_service_1.ListingAttributesService,
        email_service_1.EmailService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map