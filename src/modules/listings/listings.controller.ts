import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { EnhancedSearchListingsDto } from './dto/listing-attribute.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { PaginatedListingsDto } from './dto/paginated-listings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({ status: 201, description: 'Listing created successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiBearerAuth()
  async create(
    @Body() createListingDto: CreateListingDto,
    @Request() req: any,
  ): Promise<ListingResponseDto> {
    return this.listingsService.create(createListingDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter listings' })
  @ApiResponse({ status: 200, description: 'Listings retrieved successfully', type: PaginatedListingsDto })
  async findAll(@Query() searchDto: SearchListingsDto): Promise<PaginatedListingsDto> {
    return this.listingsService.findAll(searchDto);
  }

  @Post('search')
  @ApiOperation({ summary: 'Advanced search and filter listings (POST body supports complex filters)' })
  @ApiResponse({ status: 200, description: 'Listings retrieved successfully', type: PaginatedListingsDto })
  async searchAdvanced(@Body() searchDto: EnhancedSearchListingsDto): Promise<PaginatedListingsDto> {
    // Reuse existing service method which already supports attributeFilters
    return this.listingsService.findAll(searchDto as unknown as SearchListingsDto);
  }

  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user listings' })
  @ApiResponse({ status: 200, description: 'User listings retrieved successfully', type: PaginatedListingsDto })
  @ApiBearerAuth()
  async findMyListings(
    @Query() searchDto: SearchListingsDto,
    @Request() req: any,
  ): Promise<PaginatedListingsDto> {
    return this.listingsService.findMyListings(req.user.id, searchDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get listings by user ID (public)' })
  @ApiResponse({ status: 200, description: 'User listings retrieved successfully', type: PaginatedListingsDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findListingsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() searchDto: SearchListingsDto,
  ): Promise<PaginatedListingsDto> {
    return this.listingsService.findListingsByUser(userId, searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing retrieved successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<ListingResponseDto> {
    const viewerId = req.user?.id;
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return this.listingsService.findOne(id, viewerId, ipAddress, userAgent);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Update listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing updated successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only update your own listings' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateListingDto: UpdateListingDto,
    @Request() req: any,
  ): Promise<ListingResponseDto> {
    return this.listingsService.update(id, updateListingDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Delete listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing deleted successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only delete your own listings' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiBearerAuth()
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.listingsService.remove(id, req.user.id);
    return { message: 'Listing deleted successfully' };
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Publish a draft listing' })
  @ApiResponse({ status: 200, description: 'Listing published successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only publish your own listings' })
  @ApiResponse({ status: 400, description: 'Only draft listings can be published' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiBearerAuth()
  async publish(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<ListingResponseDto> {
    return this.listingsService.publish(id, req.user.id);
  }

  @Post(':id/extend')
  @UseGuards(JwtAuthGuard, EmailVerifiedGuard)
  @ApiOperation({ summary: 'Extend listing expiration' })
  @ApiResponse({ status: 200, description: 'Listing expiration extended successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only extend your own listings' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiQuery({ name: 'days', description: 'Number of days to extend', required: false, example: 30 })
  @ApiBearerAuth()
  async extendExpiration(
    @Param('id', ParseIntPipe) id: number,
    @Query('days', ParseIntPipe) days: number = 30,
    @Request() req: any,
  ): Promise<ListingResponseDto> {
    return this.listingsService.extendExpiration(id, req.user.id, days);
  }

  @Get(':id/views')
  @ApiOperation({ summary: 'Get listing view count' })
  @ApiResponse({ status: 200, description: 'View count retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async getViewCount(@Param('id', ParseIntPipe) id: number): Promise<{ viewCount: number }> {
    const viewCount = await this.listingsService.getViewCount(id);
    return { viewCount };
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related listings' })
  @ApiResponse({ status: 200, description: 'Related listings retrieved successfully', type: [ListingResponseDto] })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiQuery({ name: 'limit', description: 'Number of related listings to return', required: false, example: 4 })
  async getRelatedListings(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', ParseIntPipe) limit: number = 4,
  ): Promise<ListingResponseDto[]> {
    return this.listingsService.getRelatedListings(id, limit);
  }
}
