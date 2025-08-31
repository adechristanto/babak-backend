import { SettingsService } from './settings.service';
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './dto/user-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getUserSettings(req: any): Promise<UserSettingsResponseDto>;
    updateUserSettings(req: any, updateDto: UpdateUserSettingsDto): Promise<UserSettingsResponseDto>;
}
