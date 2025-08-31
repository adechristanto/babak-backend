import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsIn } from 'class-validator';

export class NotificationSettingsDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  messageAlerts?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  listingUpdates?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  marketingEmails?: boolean;
}

export class PrivacySettingsDto {
  @ApiProperty({ example: 'public', enum: ['public', 'private', 'buyers-only'] })
  @IsString()
  @IsOptional()
  @IsIn(['public', 'private', 'buyers-only'])
  profileVisibility?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  showContactInfo?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  showLastSeen?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  allowDirectMessages?: boolean;
}

export class PreferencesDto {
  @ApiProperty({ example: 'system', enum: ['light', 'dark', 'system'] })
  @IsString()
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  theme?: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @IsOptional()
  language?: string;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ type: NotificationSettingsDto, required: false })
  @IsOptional()
  notifications?: NotificationSettingsDto;

  @ApiProperty({ type: PrivacySettingsDto, required: false })
  @IsOptional()
  privacy?: PrivacySettingsDto;

  @ApiProperty({ type: PreferencesDto, required: false })
  @IsOptional()
  preferences?: PreferencesDto;
}

export class UserSettingsResponseDto {
  @ApiProperty({ type: NotificationSettingsDto })
  notifications: NotificationSettingsDto;

  @ApiProperty({ type: PrivacySettingsDto })
  privacy: PrivacySettingsDto;

  @ApiProperty({ type: PreferencesDto })
  preferences: PreferencesDto;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
