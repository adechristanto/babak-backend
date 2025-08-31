import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { PaginatedReviewsDto } from './dto/paginated-reviews.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 400, description: 'Invalid review data' })
  @ApiBearerAuth()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req: any,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get reviews for a listing' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully', type: PaginatedReviewsDto })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'Items per page', required: false, example: 10 })
  async getListingReviews(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedReviewsDto> {
    return this.reviewsService.getListingReviews(listingId, page, limit);
  }

  @Get('listing/:listingId/summary')
  @ApiOperation({ summary: 'Get review summary for a listing' })
  @ApiResponse({ status: 200, description: 'Review summary retrieved successfully' })
  @ApiParam({ name: 'listingId', description: 'Listing ID' })
  async getListingReviewSummary(
    @Param('listingId', ParseIntPipe) listingId: number,
  ) {
    return this.reviewsService.getListingReviewSummary(listingId);
  }

  @Get('seller/:sellerId/summary')
  @ApiOperation({ summary: 'Get review summary for a seller' })
  @ApiResponse({ status: 200, description: 'Seller review summary retrieved successfully' })
  @ApiParam({ name: 'sellerId', description: 'Seller ID' })
  async getSellerReviewSummary(
    @Param('sellerId', ParseIntPipe) sellerId: number,
  ) {
    return this.reviewsService.getSellerReviewSummary(sellerId);
  }
}
