import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: any;
        activeListings: any;
        pendingListings: any;
        totalRevenue: any;
        newUsersThisMonth: any;
        newListingsToday: any;
        urgentReviews: any;
        revenueThisMonth: any;
    }>;
    getRecentActivity(): Promise<{
        recentUsers: any;
        recentListings: any;
        recentPayments: any;
        recentReports: any;
    }>;
    getUsers(page?: number, limit?: number, search?: string, _status?: string): Promise<{
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            joinDate: Date;
            lastActivity: Date;
            status: string;
            listingsCount: number;
            rating: number;
            verified: boolean;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        };
    }>;
    getUserDetails(id: number): Promise<{
        listings: ({
            category: {
                id: number;
                name: string;
                createdAt: Date;
                slug: string;
                parentId: number | null;
                depth: number;
                path: string | null;
            } | null;
            images: {
                id: number;
                createdAt: Date;
                listingId: number;
                url: string;
                position: number;
            }[];
        } & {
            status: import("@prisma/client").$Enums.ListingStatus;
            id: number;
            locationAddress: string | null;
            locationCity: string | null;
            locationCountry: string | null;
            locationPlaceId: string | null;
            createdAt: Date;
            updatedAt: Date;
            sellerId: number;
            title: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            categoryId: number | null;
            city: string | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            condition: import("@prisma/client").$Enums.ListingCondition | null;
            negotiable: import("@prisma/client").$Enums.NegotiableStatus;
            isVip: boolean;
            isFeatured: boolean;
            expiresAt: Date | null;
        })[];
        reviews: ({
            reviewer: {
                id: number;
                email: string;
                name: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            listingId: number;
            rating: number;
            reviewerId: number;
            comment: string | null;
        })[];
        _count: {
            listings: number;
            favorites: number;
            reviews: number;
        };
    } & {
        id: number;
        email: string;
        passwordHash: string;
        name: string | null;
        avatarUrl: string | null;
        phone: string | null;
        location: string | null;
        locationAddress: string | null;
        locationCity: string | null;
        locationCountry: string | null;
        locationLatitude: import("@prisma/client/runtime/library").Decimal | null;
        locationLongitude: import("@prisma/client/runtime/library").Decimal | null;
        locationPlaceId: string | null;
        bio: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        emailVerified: boolean;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus(id: number, status: 'active' | 'suspended' | 'banned', _reason?: string): Promise<{
        status: string;
        id: number;
        email: string;
        name: string | null;
        emailVerified: boolean;
    }>;
    getAnalyticsOverview(): Promise<{
        users: {
            total: number;
            new30d: number;
            new7d: number;
            growth30d: string;
        };
        listings: {
            total: number;
            new30d: number;
            new7d: number;
            growth30d: string;
        };
        views: {
            total: number;
            last30d: number;
            last7d: number;
            avgPerListing: string;
        };
    }>;
    getListingAnalytics(period?: string): Promise<{
        period: string;
        statusBreakdown: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.ListingGroupByOutputType, "status"[]> & {
            _count: {
                id: number;
            };
        })[];
        totalViews: number;
        totalListings: number;
    }>;
    getUserAnalytics(period?: string): Promise<{
        period: string;
        newUsers: number;
        verifiedUsers: number;
        totalUsers: number;
        verificationRate: string;
    }>;
    getListingReports(page?: number, limit?: number): Promise<{
        data: ({
            listing: {
                id: number;
                title: string;
                seller: {
                    id: number;
                    email: string;
                    name: string | null;
                };
            };
            reporter: {
                id: number;
                email: string;
                name: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            category: string;
            listingId: number;
            reporterId: number;
            reason: string;
            details: string | null;
        })[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        };
    }>;
    getUserReports(page?: number, limit?: number): Promise<{
        data: never[];
        meta: {
            total: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        };
    }>;
    private getTimeAgo;
}
