import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { PaginatedReviewsDto } from './dto/paginated-reviews.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createReviewDto: CreateReviewDto, reviewerId: number): Promise<ReviewResponseDto>;
    getListingReviews(listingId: number, page?: number, limit?: number): Promise<PaginatedReviewsDto>;
    getListingReviewSummary(listingId: number): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    getSellerReviewSummary(sellerId: number): Promise<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    private mapToResponseDto;
}
