import { NotificationsService } from './notifications.service';
import { NotificationResponseDto } from './dto/notification-response.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(page: number | undefined, limit: number | undefined, req: any): Promise<NotificationResponseDto[]>;
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: number, req: any): Promise<NotificationResponseDto>;
    markAllAsRead(req: any): Promise<{
        updatedCount: number;
    }>;
    deleteNotification(id: number, req: any): Promise<{
        message: string;
    }>;
}
