import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationResponseDto } from './dto/notification-response.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(
    userId: number,
    type: string,
    title: string,
    body: string,
    actionUrl?: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        actionUrl,
      },
    });

    return new NotificationResponseDto(notification);
  }

  async getNotifications(userId: number, page: number = 1, limit: number = 20): Promise<NotificationResponseDto[]> {
    const skip = (page - 1) * limit;

    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return notifications.map(notification => new NotificationResponseDto(notification));
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  async markAsRead(notificationId: number, userId: number): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return new NotificationResponseDto(updatedNotification);
  }

  async markAllAsRead(userId: number): Promise<{ updatedCount: number }> {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    return { updatedCount: result.count };
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  // Helper methods for creating specific notification types
  async notifyNewMessage(recipientId: number, senderName: string, listingTitle: string, threadId: number): Promise<void> {
    await this.createNotification(
      recipientId,
      'NEW_MESSAGE',
      'New Message',
      `${senderName} sent you a message about "${listingTitle}"`,
      `/messages/${threadId}`,
    );
  }

  async notifyListingExpiring(userId: number, listingTitle: string, daysLeft: number, listingId: number): Promise<void> {
    await this.createNotification(
      userId,
      'LISTING_EXPIRING',
      'Listing Expiring Soon',
      `Your listing "${listingTitle}" will expire in ${daysLeft} day(s)`,
      `/my-ads/${listingId}`,
    );
  }

  async notifyListingExpired(userId: number, listingTitle: string, listingId: number): Promise<void> {
    await this.createNotification(
      userId,
      'LISTING_EXPIRED',
      'Listing Expired',
      `Your listing "${listingTitle}" has expired`,
      `/my-ads/${listingId}`,
    );
  }

  async notifyFavoriteListingUpdated(userId: number, listingTitle: string, listingId: number): Promise<void> {
    await this.createNotification(
      userId,
      'FAVORITE_UPDATED',
      'Favorite Listing Updated',
      `A listing you favorited "${listingTitle}" has been updated`,
      `/listings/${listingId}`,
    );
  }

  async notifyAccountVerified(userId: number): Promise<void> {
    await this.createNotification(
      userId,
      'ACCOUNT_VERIFIED',
      'Account Verification Complete',
      'Congratulations! Your seller account has been verified. You now have a verified badge.',
      '/profile',
    );
  }

  async notifyListingAttention(userId: number, listingTitle: string, viewCount: number, listingId: number): Promise<void> {
    await this.createNotification(
      userId,
      'LISTING_ATTENTION',
      'Your listing is getting attention!',
      `Your "${listingTitle}" listing has received ${viewCount}+ views in the last 24 hours`,
      `/my-ads/${listingId}`,
    );
  }

  async notifyVipListingActivated(userId: number, listingTitle: string, listingId: number): Promise<void> {
    await this.createNotification(
      userId,
      'VIP_ACTIVATED',
      'VIP listing activated',
      `Your "${listingTitle}" listing is now featured with VIP status for 30 days`,
      `/my-ads/${listingId}`,
    );
  }
}
