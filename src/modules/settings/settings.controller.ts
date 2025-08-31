import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './dto/user-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user settings' })
  @ApiResponse({ 
    status: 200, 
    description: 'User settings retrieved successfully', 
    type: UserSettingsResponseDto 
  })
  async getUserSettings(@Request() req: any): Promise<UserSettingsResponseDto> {
    return this.settingsService.getUserSettings(req.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({ 
    status: 200, 
    description: 'User settings updated successfully', 
    type: UserSettingsResponseDto 
  })
  async updateUserSettings(
    @Request() req: any,
    @Body() updateDto: UpdateUserSettingsDto,
  ): Promise<UserSettingsResponseDto> {
    return this.settingsService.updateUserSettings(req.user.id, updateDto);
  }
}
