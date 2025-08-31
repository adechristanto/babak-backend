export declare class NotificationSettingsDto {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    messageAlerts?: boolean;
    listingUpdates?: boolean;
    marketingEmails?: boolean;
}
export declare class PrivacySettingsDto {
    profileVisibility?: string;
    showContactInfo?: boolean;
    showLastSeen?: boolean;
    allowDirectMessages?: boolean;
}
export declare class PreferencesDto {
    theme?: string;
    language?: string;
}
export declare class UpdateUserSettingsDto {
    notifications?: NotificationSettingsDto;
    privacy?: PrivacySettingsDto;
    preferences?: PreferencesDto;
}
export declare class UserSettingsResponseDto {
    notifications: NotificationSettingsDto;
    privacy: PrivacySettingsDto;
    preferences: PreferencesDto;
    updatedAt: Date;
}
