import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardOverviewDto, DashboardStatsDto, TopListingDto, RecentActivityDto } from './dto/dashboard-stats.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardOverview(userId: number): Promise<DashboardOverviewDto> {
    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    // Get dashboard stats
    const stats = await this.getDashboardStats(userId);
    
    // Get top performing listings
    const topListings = await this.getTopListings(userId);
    
    // Get recent activity
    const recentActivity = await this.getRecentActivity(userId);

    return {
      stats,
      topListings,
      recentActivity,
      userName: user?.name || 'User'
    };
  }

  async getDashboardStats(userId: number): Promise<DashboardStatsDto> {
    // Get current month start
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get previous month start
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    // Get current week start
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    currentWeek.setHours(0, 0, 0, 0);

    // Get previous week start
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(previousWeek.getDate() - 7);

    // Total listings
    const totalListings = await this.prisma.listing.count({
      where: { sellerId: userId }
    });

    // Listings this month vs previous month
    const listingsThisMonth = await this.prisma.listing.count({
      where: {
        sellerId: userId,
        createdAt: { gte: currentMonth }
      }
    });

    const listingsPreviousMonth = await this.prisma.listing.count({
      where: {
        sellerId: userId,
        createdAt: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    });

    // Total views (from listing views)
    const totalViews = await this.prisma.listingView.count({
      where: {
        listing: { sellerId: userId }
      }
    });

    // Views this week vs previous week
    const viewsThisWeek = await this.prisma.listingView.count({
      where: {
        listing: { sellerId: userId },
        createdAt: { gte: currentWeek }
      }
    });

    const viewsPreviousWeek = await this.prisma.listingView.count({
      where: {
        listing: { sellerId: userId },
        createdAt: {
          gte: previousWeek,
          lt: currentWeek
        }
      }
    });

    // Unread messages - simplified approach
    const unreadMessages = await this.prisma.threadParticipant.count({
      where: {
        userId: userId,
        // Note: We'll need to implement proper unread message tracking
        // For now, return 0 as placeholder
      }
    });
    // Set to 0 for now since we need to implement proper unread tracking
    const actualUnreadMessages = 0;

    // Calculate sales (this is a placeholder - you might want to implement actual sales tracking)
    const totalSales = 0; // Placeholder
    const salesChange = '+$0 this month'; // Placeholder

    // Calculate changes
    const listingsChange = listingsThisMonth - listingsPreviousMonth;
    const viewsChangePercent = viewsPreviousWeek > 0
      ? Math.round(((viewsThisWeek - viewsPreviousWeek) / viewsPreviousWeek) * 100)
      : 0;

    return {
      totalListings,
      totalViews,
      unreadMessages: actualUnreadMessages,
      totalSales,
      listingsChange: listingsChange >= 0 ? `+${listingsChange} this month` : `${listingsChange} this month`,
      viewsChange: `${viewsChangePercent >= 0 ? '+' : ''}${viewsChangePercent}% this week`,
      messagesChange: `${actualUnreadMessages} unread`,
      salesChange
    };
  }

  async getTopListings(userId: number, limit: number = 3): Promise<TopListingDto[]> {
    const listings = await this.prisma.listing.findMany({
      where: { sellerId: userId },
      include: {
        images: true,
        _count: {
          select: {
            views: true
          }
        }
      },
      orderBy: {
        views: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      views: listing._count.views,
      messages: 0, // Placeholder - would need to count messages per listing
      price: Number(listing.price),
      image: listing.images[0]?.url || 'https://via.placeholder.com/150'
    }));
  }

  async getRecentActivity(userId: number, limit: number = 4): Promise<RecentActivityDto[]> {
    // Get recent views on user's listings
    const recentViews = await this.prisma.listingView.findMany({
      where: {
        listing: { sellerId: userId }
      },
      include: {
        listing: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(limit / 2)
    });

    // Get recent listings created
    const recentListings = await this.prisma.listing.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(limit / 2)
    });

    const activities: RecentActivityDto[] = [];

    // Add view activities
    recentViews.forEach((view, index) => {
      activities.push({
        id: view.id,
        type: 'listing_viewed',
        title: `${view.listing.title} viewed`,
        description: 'Your listing received a new view',
        time: this.formatTimeAgo(view.createdAt)
      });
    });

    // Add listing creation activities
    recentListings.forEach(listing => {
      activities.push({
        id: listing.id,
        type: 'listing_created',
        title: 'New listing published',
        description: `${listing.title} is now live`,
        time: this.formatTimeAgo(listing.createdAt)
      });
    });

    // Sort by most recent and limit
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
