import { FavoritesService } from './favorites.service';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    addToFavorites(id: number, req: any): Promise<FavoriteResponseDto>;
    removeFromFavorites(id: number, req: any): Promise<{
        message: string;
    }>;
    getFavorites(req: any): Promise<FavoriteResponseDto[]>;
    isFavorited(id: number, req: any): Promise<{
        isFavorited: boolean;
    }>;
    getFavoriteStats(req: any): Promise<{
        totalFavorites: number;
        activeFavorites: number;
    }>;
}
