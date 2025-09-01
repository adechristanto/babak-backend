import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/recent-activity')
  @ApiOperation({ summary: 'Get recent admin activity' })
  @ApiResponse({ status: 200, description: 'Recent activity retrieved successfully' })
  async getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getUsers(page, limit, search, status);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details (Admin only)' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserDetails(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'active' | 'suspended' | 'banned'; reason?: string },
  ) {
    return this.adminService.updateUserStatus(id, body.status, body.reason);
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get analytics overview (Admin only)' })
  @ApiResponse({ status: 200, description: 'Analytics overview retrieved successfully' })
  async getAnalyticsOverview() {
    return this.adminService.getAnalyticsOverview();
  }

  @Get('analytics/listings')
  @ApiOperation({ summary: 'Get listing analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Listing analytics retrieved successfully' })
  @ApiQuery({ name: 'period', required: false, type: String })
  async getListingAnalytics(@Query('period') period: string = '30d') {
    return this.adminService.getListingAnalytics(period);
  }

  @Get('analytics/users')
  @ApiOperation({ summary: 'Get user analytics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User analytics retrieved successfully' })
  @ApiQuery({ name: 'period', required: false, type: String })
  async getUserAnalytics(@Query('period') period: string = '30d') {
    return this.adminService.getUserAnalytics(period);
  }

  @Get('reports/listings')
  @ApiOperation({ summary: 'Get listing reports (Admin only)' })
  @ApiResponse({ status: 200, description: 'Listing reports retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getListingReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getListingReports(page, limit);
  }

  @Get('reports/users')
  @ApiOperation({ summary: 'Get user reports (Admin only)' })
  @ApiResponse({ status: 200, description: 'User reports retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getUserReports(page, limit);
  }
}
