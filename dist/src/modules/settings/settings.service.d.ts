import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './dto/user-settings.dto';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserSettings(userId: number): Promise<UserSettingsResponseDto>;
    updateUserSettings(userId: number, updateDto: UpdateUserSettingsDto): Promise<UserSettingsResponseDto>;
    private mapToResponseDto;
}
