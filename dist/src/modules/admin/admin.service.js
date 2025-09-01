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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, activeListings, pendingListings, totalRevenue, newUsersThisMonth, newListingsToday, urgentReviews, revenueThisMonth] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.listing.count({
                where: { status: client_1.ListingStatus.ACTIVE }
            }),
            this.prisma.listing.count({
                where: { status: client_1.ListingStatus.PENDING }
            }),
            this.prisma.listingUpgrade.aggregate({
                _sum: { amount: true }
            }),
            this.prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            this.prisma.listing.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            this.prisma.listing.count({
                where: {
                    status: client_1.ListingStatus.PENDING,
                    updatedAt: {
                        lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            }),
            this.prisma.listingUpgrade.aggregate({
                _sum: { amount: true },
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            })
        ]);
        return {
            totalUsers,
            activeListings,
            pendingListings,
            totalRevenue: totalRevenue._sum.amount || 0,
            newUsersThisMonth,
            newListingsToday,
            urgentReviews,
            revenueThisMonth: revenueThisMonth._sum.amount || 0
        };
    }
    async getRecentActivity() {
        const activities = await this.prisma.$transaction([
            this.prisma.user.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            }),
            this.prisma.listing.findMany({
                take: 3,
                where: { status: client_1.ListingStatus.PENDING },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    createdAt: true
                }
            }),
            this.prisma.listingUpgrade.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    amount: true,
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            seller: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    },
                    createdAt: true
                }
            }),
            this.prisma.report.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    reason: true,
                    reporter: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    createdAt: true
                }
            })
        ]);
        const [recentUsers, recentListings, recentPayments, recentReports] = activities;
        return {
            recentUsers: recentUsers.map(user => ({
                id: user.id,
                type: 'user_registered',
                title: 'New user registration',
                description: `${user.name || user.email} joined the platform`,
                time: this.getTimeAgo(user.createdAt),
                icon: 'Users',
                color: 'blue'
            })),
            recentListings: recentListings.map(listing => ({
                id: listing.id,
                type: 'ad_submitted',
                title: 'Ad submitted for review',
                description: `${listing.title} needs approval`,
                time: this.getTimeAgo(listing.createdAt),
                icon: 'FileText',
                color: 'yellow'
            })),
            recentPayments: recentPayments.map(payment => ({
                id: payment.id,
                type: 'payment_received',
                title: 'Payment received',
                description: `$${payment.amount} for ${payment.listing.title}`,
                time: this.getTimeAgo(payment.createdAt),
                icon: 'DollarSign',
                color: 'green'
            })),
            recentReports: recentReports.map(report => ({
                id: report.id,
                type: 'user_reported',
                title: 'User reported',
                description: `Suspicious activity reported`,
                time: this.getTimeAgo(report.createdAt),
                icon: 'AlertCircle',
                color: 'red'
            }))
        };
    }
    async getUsers(page = 1, limit = 10, search, _status) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                    role: true,
                    _count: {
                        select: {
                            listings: true,
                            reviews: true
                        }
                    }
                }
            }),
            this.prisma.user.count({ where })
        ]);
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const [listingsCount, avgRating] = await Promise.all([
                this.prisma.listing.count({
                    where: { sellerId: user.id }
                }),
                this.prisma.review.aggregate({
                    where: { sellerId: user.id },
                    _avg: { rating: true }
                })
            ]);
            return {
                id: user.id,
                name: user.name || 'Unknown',
                email: user.email,
                phone: user.phone || 'N/A',
                joinDate: user.createdAt,
                lastActivity: user.updatedAt,
                status: user.emailVerified ? 'active' : 'pending',
                listingsCount,
                rating: avgRating._avg.rating || 0,
                verified: user.emailVerified,
                role: user.role
            };
        }));
        return {
            data: usersWithStats,
            meta: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    }
    async getUserDetails(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                listings: {
                    include: {
                        category: true,
                        images: true
                    }
                },
                reviews: {
                    include: {
                        reviewer: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        listings: true,
                        reviews: true,
                        favorites: true
                    }
                }
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async updateUserStatus(id, status, _reason) {
        const emailVerified = status === 'active';
        const user = await this.prisma.user.update({
            where: { id },
            data: { emailVerified },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true
            }
        });
        return {
            ...user,
            status: user.emailVerified ? 'active' : 'suspended'
        };
    }
    async getAnalyticsOverview() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [totalUsers, newUsers30d, newUsers7d, totalListings, newListings30d, newListings7d, totalViews, views30d, views7d] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            this.prisma.user.count({
                where: { createdAt: { gte: sevenDaysAgo } }
            }),
            this.prisma.listing.count(),
            this.prisma.listing.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            this.prisma.listing.count({
                where: { createdAt: { gte: sevenDaysAgo } }
            }),
            this.prisma.listingView.count(),
            this.prisma.listingView.count({
                where: { createdAt: { gte: thirtyDaysAgo } }
            }),
            this.prisma.listingView.count({
                where: { createdAt: { gte: sevenDaysAgo } }
            })
        ]);
        return {
            users: {
                total: totalUsers,
                new30d: newUsers30d,
                new7d: newUsers7d,
                growth30d: totalUsers > 0 ? ((newUsers30d / totalUsers) * 100).toFixed(1) : '0'
            },
            listings: {
                total: totalListings,
                new30d: newListings30d,
                new7d: newListings7d,
                growth30d: totalListings > 0 ? ((newListings30d / totalListings) * 100).toFixed(1) : '0'
            },
            views: {
                total: totalViews,
                last30d: views30d,
                last7d: views7d,
                avgPerListing: totalListings > 0 ? (totalViews / totalListings).toFixed(1) : '0'
            }
        };
    }
    async getListingAnalytics(period = '30d') {
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const analytics = await this.prisma.listing.groupBy({
            by: ['status'],
            where: {
                createdAt: { gte: startDate }
            },
            _count: {
                id: true
            }
        });
        const views = await this.prisma.listingView.count({
            where: {
                createdAt: { gte: startDate }
            }
        });
        return {
            period,
            statusBreakdown: analytics,
            totalViews: views,
            totalListings: analytics.reduce((sum, item) => sum + item._count.id, 0)
        };
    }
    async getUserAnalytics(period = '30d') {
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const [newUsers, verifiedUsers, totalUsers] = await Promise.all([
            this.prisma.user.count({
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            this.prisma.user.count({
                where: {
                    emailVerified: true,
                    createdAt: { gte: startDate }
                }
            }),
            this.prisma.user.count()
        ]);
        return {
            period,
            newUsers,
            verifiedUsers,
            totalUsers,
            verificationRate: newUsers > 0 ? ((verifiedUsers / newUsers) * 100).toFixed(1) : '0'
        };
    }
    async getListingReports(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [reports, total] = await Promise.all([
            this.prisma.report.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reporter: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            seller: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }),
            this.prisma.report.count()
        ]);
        return {
            data: reports,
            meta: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        };
    }
    async getUserReports(page = 1, limit = 10) {
        return {
            data: [],
            meta: {
                total: 0,
                totalPages: 0,
                currentPage: page,
                limit
            }
        };
    }
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60)
            return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return date.toLocaleDateString();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map