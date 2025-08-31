"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardOverview(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        });
        const stats = await this.getDashboardStats(userId);
        const topListings = await this.getTopListings(userId);
        const recentActivity = await this.getRecentActivity(userId);
        return {
            stats,
            topListings,
            recentActivity,
            userName: user?.name || 'User'
        };
    }
    async getDashboardStats(userId) {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        const previousMonth = new Date(currentMonth);
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        const currentWeek = new Date();
        currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
        currentWeek.setHours(0, 0, 0, 0);
        const previousWeek = new Date(currentWeek);
        previousWeek.setDate(previousWeek.getDate() - 7);
        const totalListings = await this.prisma.listing.count({
            where: { sellerId: userId }
        });
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
        const totalViews = await this.prisma.listingView.count({
            where: {
                listing: { sellerId: userId }
            }
        });
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
        const unreadMessages = await this.prisma.threadParticipant.count({
            where: {
                userId: userId,
            }
        });
        const actualUnreadMessages = 0;
        const totalSales = 0;
        const salesChange = '+$0 this month';
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
    async getTopListings(userId, limit = 3) {
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
            messages: 0,
            price: Number(listing.price),
            image: listing.images[0]?.url || 'https://via.placeholder.com/150'
        }));
    }
    async getRecentActivity(userId, limit = 4) {
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
        const recentListings = await this.prisma.listing.findMany({
            where: { sellerId: userId },
            orderBy: { createdAt: 'desc' },
            take: Math.floor(limit / 2)
        });
        const activities = [];
        recentViews.forEach((view, index) => {
            activities.push({
                id: view.id,
                type: 'listing_viewed',
                title: `${view.listing.title} viewed`,
                description: 'Your listing received a new view',
                time: this.formatTimeAgo(view.createdAt)
            });
        });
        recentListings.forEach(listing => {
            activities.push({
                id: listing.id,
                type: 'listing_created',
                title: 'New listing published',
                description: `${listing.title} is now live`,
                time: this.formatTimeAgo(listing.createdAt)
            });
        });
        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, limit);
    }
    formatTimeAgo(date) {
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        if (diffInHours < 1) {
            return 'Just now';
        }
        else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        }
        else if (diffInHours < 168) {
            return `${Math.floor(diffInHours / 24)} days ago`;
        }
        else {
            return date.toLocaleDateString();
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map