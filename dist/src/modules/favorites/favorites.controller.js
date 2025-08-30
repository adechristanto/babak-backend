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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const favorites_service_1 = require("./favorites.service");
const favorite_response_dto_1 = require("./dto/favorite-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const email_verified_guard_1 = require("../auth/guards/email-verified.guard");
let FavoritesController = class FavoritesController {
    favoritesService;
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
    }
    async addToFavorites(id, req) {
        return this.favoritesService.addToFavorites(id, req.user.id);
    }
    async removeFromFavorites(id, req) {
        await this.favoritesService.removeFromFavorites(id, req.user.id);
        return { message: 'Listing removed from favorites' };
    }
    async getFavorites(req) {
        return this.favoritesService.getFavorites(req.user.id);
    }
    async isFavorited(id, req) {
        const isFavorited = await this.favoritesService.isFavorited(id, req.user.id);
        return { isFavorited };
    }
    async getFavoriteStats(req) {
        return this.favoritesService.getFavoriteStats(req.user.id);
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Post)('listings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Add listing to favorites' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Listing added to favorites successfully', type: favorite_response_dto_1.FavoriteResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Listing already in favorites' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "addToFavorites", null);
__decorate([
    (0, common_1.Delete)('listings/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove listing from favorites' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing removed from favorites successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Favorite not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "removeFromFavorites", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user favorites' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Favorites retrieved successfully', type: [favorite_response_dto_1.FavoriteResponseDto] }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getFavorites", null);
__decorate([
    (0, common_1.Get)('listings/:id/check'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if listing is favorited' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Favorite status retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                isFavorited: { type: 'boolean', example: true }
            }
        }
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "isFavorited", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user favorite statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Favorite statistics retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                totalFavorites: { type: 'number', example: 15 },
                activeFavorites: { type: 'number', example: 12 }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getFavoriteStats", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, swagger_1.ApiTags)('Favorites'),
    (0, common_1.Controller)('favorites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
//# sourceMappingURL=favorites.controller.js.map