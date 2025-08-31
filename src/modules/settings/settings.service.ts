import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { 
  UpdateUserSettingsDto, 
  UserSettingsResponseDto,
  NotificationSettingsDto,
  PrivacySettingsDto,
  PreferencesDto
} from './dto/user-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSettings(userId: number): Promise<UserSettingsResponseDto> {
    // Get or create user settings
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Create default settings if they don't exist
      settings = await this.prisma.userSettings.create({
        data: { userId }
      });
    }

    return this.mapToResponseDto(settings);
  }

  async updateUserSettings(
    userId: number, 
    updateDto: UpdateUserSettingsDto
  ): Promise<UserSettingsResponseDto> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get or create settings
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: { userId }
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (updateDto.notifications) {
      Object.assign(updateData, {
        emailNotifications: updateDto.notifications.emailNotifications,
        pushNotifications: updateDto.notifications.pushNotifications,
        messageAlerts: updateDto.notifications.messageAlerts,
        listingUpdates: updateDto.notifications.listingUpdates,
        marketingEmails: updateDto.notifications.marketingEmails,
      });
    }

    if (updateDto.privacy) {
      Object.assign(updateData, {
        profileVisibility: updateDto.privacy.profileVisibility,
        showContactInfo: updateDto.privacy.showContactInfo,
        showLastSeen: updateDto.privacy.showLastSeen,
        allowDirectMessages: updateDto.privacy.allowDirectMessages,
      });
    }

    if (updateDto.preferences) {
      Object.assign(updateData, {
        theme: updateDto.preferences.theme,
        language: updateDto.preferences.language,
      });
    }

    // Update settings
    const updatedSettings = await this.prisma.userSettings.update({
      where: { userId },
      data: updateData
    });

    return this.mapToResponseDto(updatedSettings);
  }

  private mapToResponseDto(settings: any): UserSettingsResponseDto {
    return {
      notifications: {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        messageAlerts: settings.messageAlerts,
        listingUpdates: settings.listingUpdates,
        marketingEmails: settings.marketingEmails,
      },
      privacy: {
        profileVisibility: settings.profileVisibility,
        showContactInfo: settings.showContactInfo,
        showLastSeen: settings.showLastSeen,
        allowDirectMessages: settings.allowDirectMessages,
      },
      preferences: {
        theme: settings.theme,
        language: settings.language,
      },
      updatedAt: settings.updatedAt,
    };
  }
}
