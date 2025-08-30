import { PrismaService } from '../../prisma/prisma.service';
import { NotificationResponseDto } from './dto/notification-response.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createNotification(userId: number, type: string, title: string, body: string): Promise<NotificationResponseDto>;
    getNotifications(userId: number, page?: number, limit?: number): Promise<NotificationResponseDto[]>;
    getUnreadCount(userId: number): Promise<number>;
    markAsRead(notificationId: number, userId: number): Promise<NotificationResponseDto>;
    markAllAsRead(userId: number): Promise<{
        updatedCount: number;
    }>;
    deleteNotification(notificationId: number, userId: number): Promise<void>;
    notifyNewMessage(recipientId: number, senderName: string, listingTitle: string): Promise<void>;
    notifyListingExpiring(userId: number, listingTitle: string, daysLeft: number): Promise<void>;
    notifyListingExpired(userId: number, listingTitle: string): Promise<void>;
    notifyFavoriteListingUpdated(userId: number, listingTitle: string): Promise<void>;
}
