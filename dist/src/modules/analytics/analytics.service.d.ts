import { PrismaService } from '../../prisma/prisma.service';
import { DashboardOverviewDto, DashboardStatsDto, TopListingDto, RecentActivityDto } from './dto/dashboard-stats.dto';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardOverview(userId: number): Promise<DashboardOverviewDto>;
    getDashboardStats(userId: number): Promise<DashboardStatsDto>;
    getTopListings(userId: number, limit?: number): Promise<TopListingDto[]>;
    getRecentActivity(userId: number, limit?: number): Promise<RecentActivityDto[]>;
    private formatTimeAgo;
}
