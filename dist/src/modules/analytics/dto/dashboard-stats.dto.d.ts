export declare class DashboardStatsDto {
    totalListings: number;
    totalViews: number;
    unreadMessages: number;
    totalSales: number;
    listingsChange: string;
    viewsChange: string;
    messagesChange: string;
    salesChange: string;
}
export declare class TopListingDto {
    id: number;
    title: string;
    views: number;
    messages: number;
    price: number;
    image: string;
}
export declare class RecentActivityDto {
    id: number;
    type: string;
    title: string;
    description: string;
    time: string;
}
export declare class DashboardOverviewDto {
    stats: DashboardStatsDto;
    topListings: TopListingDto[];
    recentActivity: RecentActivityDto[];
    userName: string;
}
