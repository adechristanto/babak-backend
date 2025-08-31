import { AnalyticsService } from './analytics.service';
import { DashboardOverviewDto, DashboardStatsDto, TopListingDto } from './dto/dashboard-stats.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardOverview(req: any): Promise<DashboardOverviewDto>;
    getDashboardStats(req: any): Promise<DashboardStatsDto>;
    getTopListings(req: any, limit?: number): Promise<TopListingDto[]>;
}
