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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_response_dto_1 = require("./dto/notification-response.dto");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNotification(userId, type, title, body, actionUrl) {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                body,
                actionUrl,
            },
        });
        return new notification_response_dto_1.NotificationResponseDto(notification);
    }
    async getNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
        return notifications.map(notification => new notification_response_dto_1.NotificationResponseDto(notification));
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        const updatedNotification = await this.prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return new notification_response_dto_1.NotificationResponseDto(updatedNotification);
    }
    async markAllAsRead(userId) {
        const result = await this.prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: { read: true },
        });
        return { updatedCount: result.count };
    }
    async deleteNotification(notificationId, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        await this.prisma.notification.delete({
            where: { id: notificationId },
        });
    }
    async notifyNewMessage(recipientId, senderName, listingTitle, threadId) {
        await this.createNotification(recipientId, 'NEW_MESSAGE', 'New Message', `${senderName} sent you a message about "${listingTitle}"`, `/messages/${threadId}`);
    }
    async notifyListingExpiring(userId, listingTitle, daysLeft, listingId) {
        await this.createNotification(userId, 'LISTING_EXPIRING', 'Listing Expiring Soon', `Your listing "${listingTitle}" will expire in ${daysLeft} day(s)`, `/my-ads/${listingId}`);
    }
    async notifyListingExpired(userId, listingTitle, listingId) {
        await this.createNotification(userId, 'LISTING_EXPIRED', 'Listing Expired', `Your listing "${listingTitle}" has expired`, `/my-ads/${listingId}`);
    }
    async notifyFavoriteListingUpdated(userId, listingTitle, listingId) {
        await this.createNotification(userId, 'FAVORITE_UPDATED', 'Favorite Listing Updated', `A listing you favorited "${listingTitle}" has been updated`, `/listings/${listingId}`);
    }
    async notifyAccountVerified(userId) {
        await this.createNotification(userId, 'ACCOUNT_VERIFIED', 'Account Verification Complete', 'Congratulations! Your seller account has been verified. You now have a verified badge.', '/profile');
    }
    async notifyListingAttention(userId, listingTitle, viewCount, listingId) {
        await this.createNotification(userId, 'LISTING_ATTENTION', 'Your listing is getting attention!', `Your "${listingTitle}" listing has received ${viewCount}+ views in the last 24 hours`, `/my-ads/${listingId}`);
    }
    async notifyVipListingActivated(userId, listingTitle, listingId) {
        await this.createNotification(userId, 'VIP_ACTIVATED', 'VIP listing activated', `Your "${listingTitle}" listing is now featured with VIP status for 30 days`, `/my-ads/${listingId}`);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map