import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { DashboardOverviewDto, DashboardStatsDto, TopListingDto } from './dto/dashboard-stats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard overview retrieved successfully', 
    type: DashboardOverviewDto 
  })
  async getDashboardOverview(@Request() req: any): Promise<DashboardOverviewDto> {
    return this.analyticsService.getDashboardOverview(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dashboard stats retrieved successfully', 
    type: DashboardStatsDto 
  })
  async getDashboardStats(@Request() req: any): Promise<DashboardStatsDto> {
    return this.analyticsService.getDashboardStats(req.user.id);
  }

  @Get('top-listings')
  @ApiOperation({ summary: 'Get top performing listings' })
  @ApiResponse({ 
    status: 200, 
    description: 'Top listings retrieved successfully', 
    type: [TopListingDto] 
  })
  @ApiQuery({ name: 'limit', description: 'Number of listings to return', required: false, example: 5 })
  async getTopListings(
    @Request() req: any,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ): Promise<TopListingDto[]> {
    return this.analyticsService.getTopListings(req.user.id, limit);
  }
}
