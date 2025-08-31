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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserSettings(userId) {
        let settings = await this.prisma.userSettings.findUnique({
            where: { userId }
        });
        if (!settings) {
            settings = await this.prisma.userSettings.create({
                data: { userId }
            });
        }
        return this.mapToResponseDto(settings);
    }
    async updateUserSettings(userId, updateDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let settings = await this.prisma.userSettings.findUnique({
            where: { userId }
        });
        if (!settings) {
            settings = await this.prisma.userSettings.create({
                data: { userId }
            });
        }
        const updateData = {};
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
        const updatedSettings = await this.prisma.userSettings.update({
            where: { userId },
            data: updateData
        });
        return this.mapToResponseDto(updatedSettings);
    }
    mapToResponseDto(settings) {
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
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map