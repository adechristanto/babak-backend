import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
import { ListingUpgradesService } from './listing-upgrades.service';
import { UpgradeListingDto } from './dto/upgrade-listing.dto';
import { ListingResponseDto } from './dto/listing-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Listing Upgrades')
@Controller('listings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListingUpgradesController {
  constructor(private readonly listingUpgradesService: ListingUpgradesService) {}

  @Post(':id/upgrade')
  @ApiOperation({ summary: 'Upgrade listing (VIP, Featured, Extend)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Listing upgraded successfully',
    schema: {
      type: 'object',
      properties: {
        listing: { $ref: '#/components/schemas/ListingResponseDto' },
        totalCost: { type: 'number', example: 29.98 }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only upgrade your own listings' })
  @ApiResponse({ status: 400, description: 'Only active listings can be upgraded' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async upgradeListing(
    @Param('id', ParseIntPipe) id: number,
    @Body() upgradeDto: UpgradeListingDto,
    @Request() req: any,
  ): Promise<{ listing: ListingResponseDto; totalCost: number }> {
    return this.listingUpgradesService.upgradeListing(id, upgradeDto, req.user.id);
  }

  @Post('upgrade/calculate-cost')
  @ApiOperation({ summary: 'Calculate upgrade cost without applying' })
  @ApiResponse({ 
    status: 200, 
    description: 'Upgrade cost calculated successfully',
    schema: {
      type: 'object',
      properties: {
        breakdown: { type: 'object' },
        totalCost: { type: 'number', example: 29.98 }
      }
    }
  })
  async calculateUpgradeCost(
    @Body() upgradeDto: UpgradeListingDto,
  ): Promise<{ breakdown: any; totalCost: number }> {
    return this.listingUpgradesService.calculateUpgradeCost(upgradeDto);
  }

  @Get('upgrade/pricing')
  @ApiOperation({ summary: 'Get upgrade pricing information' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pricing information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        vipPrice: { type: 'number', example: 9.99 },
        featuredPrice: { type: 'number', example: 19.99 },
        extensionPricePerDay: { type: 'number', example: 0.99 }
      }
    }
  })
  async getUpgradePricing() {
    return this.listingUpgradesService.getUpgradePricing();
  }

  @Delete(':id/upgrade/:type')
  @ApiOperation({ summary: 'Remove upgrade from listing' })
  @ApiResponse({ status: 200, description: 'Upgrade removed successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'You can only modify your own listings' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  @ApiParam({ name: 'type', description: 'Upgrade type', enum: ['vip', 'featured'] })
  async removeUpgrade(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: 'vip' | 'featured',
    @Request() req: any,
  ): Promise<ListingResponseDto> {
    return this.listingUpgradesService.removeUpgrade(id, type, req.user.id);
  }

  @Get('vip')
  @ApiOperation({ summary: 'Get VIP listings' })
  @ApiResponse({ status: 200, description: 'VIP listings retrieved successfully', type: [ListingResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of listings to return', required: false, example: 10 })
  async getVipListings(
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<ListingResponseDto[]> {
    return this.listingUpgradesService.getVipListings(limit);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured listings' })
  @ApiResponse({ status: 200, description: 'Featured listings retrieved successfully', type: [ListingResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of listings to return', required: false, example: 10 })
  async getFeaturedListings(
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<ListingResponseDto[]> {
    return this.listingUpgradesService.getFeaturedListings(limit);
  }

  @Get('expired')
  @ApiOperation({ summary: 'Get expired listings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Expired listings retrieved successfully', type: [ListingResponseDto] })
  async getExpiredListings(): Promise<ListingResponseDto[]> {
    return this.listingUpgradesService.getExpiredListings();
  }

  @Post('expired/archive')
  @ApiOperation({ summary: 'Archive all expired listings (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Expired listings archived successfully',
    schema: {
      type: 'object',
      properties: {
        archivedCount: { type: 'number', example: 15 }
      }
    }
  })
  async archiveExpiredListings(): Promise<{ archivedCount: number }> {
    return this.listingUpgradesService.archiveExpiredListings();
  }
}
