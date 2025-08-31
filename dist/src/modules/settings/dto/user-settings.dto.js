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
exports.UserSettingsResponseDto = exports.UpdateUserSettingsDto = exports.PreferencesDto = exports.PrivacySettingsDto = exports.NotificationSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class NotificationSettingsDto {
    emailNotifications;
    pushNotifications;
    messageAlerts;
    listingUpdates;
    marketingEmails;
}
exports.NotificationSettingsDto = NotificationSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "emailNotifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "pushNotifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "messageAlerts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "listingUpdates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], NotificationSettingsDto.prototype, "marketingEmails", void 0);
class PrivacySettingsDto {
    profileVisibility;
    showContactInfo;
    showLastSeen;
    allowDirectMessages;
}
exports.PrivacySettingsDto = PrivacySettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'public', enum: ['public', 'private', 'buyers-only'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['public', 'private', 'buyers-only']),
    __metadata("design:type", String)
], PrivacySettingsDto.prototype, "profileVisibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PrivacySettingsDto.prototype, "showContactInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PrivacySettingsDto.prototype, "showLastSeen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PrivacySettingsDto.prototype, "allowDirectMessages", void 0);
class PreferencesDto {
    theme;
    language;
}
exports.PreferencesDto = PreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'system', enum: ['light', 'dark', 'system'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['light', 'dark', 'system']),
    __metadata("design:type", String)
], PreferencesDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'en' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PreferencesDto.prototype, "language", void 0);
class UpdateUserSettingsDto {
    notifications;
    privacy;
    preferences;
}
exports.UpdateUserSettingsDto = UpdateUserSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: NotificationSettingsDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", NotificationSettingsDto)
], UpdateUserSettingsDto.prototype, "notifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PrivacySettingsDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PrivacySettingsDto)
], UpdateUserSettingsDto.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PreferencesDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PreferencesDto)
], UpdateUserSettingsDto.prototype, "preferences", void 0);
class UserSettingsResponseDto {
    notifications;
    privacy;
    preferences;
    updatedAt;
}
exports.UserSettingsResponseDto = UserSettingsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: NotificationSettingsDto }),
    __metadata("design:type", NotificationSettingsDto)
], UserSettingsResponseDto.prototype, "notifications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PrivacySettingsDto }),
    __metadata("design:type", PrivacySettingsDto)
], UserSettingsResponseDto.prototype, "privacy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PreferencesDto }),
    __metadata("design:type", PreferencesDto)
], UserSettingsResponseDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserSettingsResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=user-settings.dto.js.map