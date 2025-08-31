import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { PaginatedReviewsDto, PaginationMetaDto } from './dto/paginated-reviews.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, reviewerId: number): Promise<ReviewResponseDto> {
    const { listingId, rating, comment } = createReviewDto;

    // Validate listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check if user has already reviewed this listing
    const existingReview = await this.prisma.review.findFirst({
      where: {
        listingId,
        reviewerId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this listing');
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.prisma.review.create({
      data: {
        listingId,
        reviewerId,
        rating,
        comment,
      },
      include: {
        reviewer: true,
      },
    });

    return this.mapToResponseDto(review);
  }

  async getListingReviews(
    listingId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedReviewsDto> {
    // Validate listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { listingId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          reviewer: true,
        },
      }),
      this.prisma.review.count({
        where: { listingId },
      }),
    ]);

    const reviewDtos = reviews.map(review => this.mapToResponseDto(review));
    const meta = new PaginationMetaDto(page, limit, total);

    return new PaginatedReviewsDto(reviewDtos, meta);
  }

  async getListingReviewSummary(listingId: number) {
    // Validate listing exists
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const reviews = await this.prisma.review.findMany({
      where: { listingId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        },
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  async getSellerReviewSummary(sellerId: number) {
    // Validate seller exists
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Get all reviews for listings by this seller
    const reviews = await this.prisma.review.findMany({
      where: {
        listing: {
          sellerId,
        },
      },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
        },
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  private mapToResponseDto(review: any): ReviewResponseDto {
    return new ReviewResponseDto({
      ...review,
      reviewer: new UserResponseDto(review.reviewer),
    });
  }
}
