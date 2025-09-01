import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        activeListings: number;
        pendingListings: number;
        totalRevenue: number;
        newUsersThisMonth: number;
        newListingsToday: number;
        urgentReviews: number;
        revenueThisMonth: number;
    }>;
    getRecentActivity(): Promise<{
        recentUsers: {
            id: number;
            type: string;
            title: string;
            description: string;
            time: string;
            icon: string;
            color: string;
        }[];
        recentListings: {
            id: number;
            type: string;
            title: string;
            description: string;
            time: string;
            icon: string;
            color: string;
        }[];
        recentPayments: never[];
        recentReports: {
            id: number;
            type: string;
            title: string;
            description: string;
            time: string;
            icon: string;
            color: string;
        }[];
    }>;
    getUsers(page?: number, limit?: number, search?: string, status?: string): Promise<{
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
            id: number;
            categoryId: number | null;
            createdAt: Date;
            updatedAt: Date;
            locationAddress: string | null;
            locationCity: string | null;
            locationCountry: string | null;
            locationPlaceId: string | null;
            title: string;
            description: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            city: string | null;
            latitude: import("@prisma/client/runtime/library").Decimal | null;
            longitude: import("@prisma/client/runtime/library").Decimal | null;
            status: import("@prisma/client").$Enums.ListingStatus;
            condition: import("@prisma/client").$Enums.ListingCondition | null;
            negotiable: import("@prisma/client").$Enums.NegotiableStatus;
            isVip: boolean;
            isFeatured: boolean;
            expiresAt: Date | null;
            sellerId: number;
        })[];
        reviews: ({
            reviewer: {
                id: number;
                name: string | null;
                email: string;
            };
        } & {
            id: number;
            createdAt: Date;
            rating: number;
            comment: string | null;
            listingId: number;
            reviewerId: number;
        })[];
        _count: {
            listings: number;
            favorites: number;
            reviews: number;
        };
    } & {
        id: number;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerificationToken: string | null;
        passwordHash: string;
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
        emailVerificationExpires: Date | null;
    }>;
    updateUserStatus(id: number, body: {
        status: 'active' | 'suspended' | 'banned';
        reason?: string;
    }): Promise<{
        status: string;
        id: number;
        name: string | null;
        email: string;
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
                    name: string | null;
                    email: string;
                };
            };
            reporter: {
                id: number;
                name: string | null;
                email: string;
            };
        } & {
            id: number;
            createdAt: Date;
            category: string;
            listingId: number;
            details: string | null;
            reporterId: number;
            reason: string;
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
}
