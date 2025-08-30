import { PrismaService } from '../../prisma/prisma.service';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addToFavorites(listingId: number, userId: number): Promise<FavoriteResponseDto>;
    removeFromFavorites(listingId: number, userId: number): Promise<void>;
    getFavorites(userId: number): Promise<FavoriteResponseDto[]>;
    isFavorited(listingId: number, userId: number): Promise<boolean>;
    getFavoriteStats(userId: number): Promise<{
        totalFavorites: number;
        activeFavorites: number;
    }>;
    private mapToResponseDto;
}
