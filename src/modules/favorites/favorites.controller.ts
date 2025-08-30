import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('listings/:id')
  @ApiOperation({ summary: 'Add listing to favorites' })
  @ApiResponse({ status: 201, description: 'Listing added to favorites successfully', type: FavoriteResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 409, description: 'Listing already in favorites' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async addToFavorites(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<FavoriteResponseDto> {
    return this.favoritesService.addToFavorites(id, req.user.id);
  }

  @Delete('listings/:id')
  @ApiOperation({ summary: 'Remove listing from favorites' })
  @ApiResponse({ status: 200, description: 'Listing removed from favorites successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async removeFromFavorites(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.favoritesService.removeFromFavorites(id, req.user.id);
    return { message: 'Listing removed from favorites' };
  }

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiResponse({ status: 200, description: 'Favorites retrieved successfully', type: [FavoriteResponseDto] })
  async getFavorites(@Request() req: any): Promise<FavoriteResponseDto[]> {
    return this.favoritesService.getFavorites(req.user.id);
  }

  @Get('listings/:id/check')
  @ApiOperation({ summary: 'Check if listing is favorited' })
  @ApiResponse({ 
    status: 200, 
    description: 'Favorite status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        isFavorited: { type: 'boolean', example: true }
      }
    }
  })
  @ApiParam({ name: 'id', description: 'Listing ID' })
  async isFavorited(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ isFavorited: boolean }> {
    const isFavorited = await this.favoritesService.isFavorited(id, req.user.id);
    return { isFavorited };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user favorite statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Favorite statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalFavorites: { type: 'number', example: 15 },
        activeFavorites: { type: 'number', example: 12 }
      }
    }
  })
  async getFavoriteStats(@Request() req: any): Promise<{ totalFavorites: number; activeFavorites: number }> {
    return this.favoritesService.getFavoriteStats(req.user.id);
  }
}
