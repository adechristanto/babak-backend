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
exports.OffersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const offers_service_1 = require("./offers.service");
const create_offer_dto_1 = require("./dto/create-offer.dto");
const update_offer_dto_1 = require("./dto/update-offer.dto");
const offer_response_dto_1 = require("./dto/offer-response.dto");
const paginated_offers_dto_1 = require("./dto/paginated-offers.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const email_verified_guard_1 = require("../auth/guards/email-verified.guard");
let OffersController = class OffersController {
    offersService;
    constructor(offersService) {
        this.offersService = offersService;
    }
    async create(createOfferDto, req) {
        return this.offersService.create(createOfferDto, req.user.id);
    }
    async getReceivedOffers(page = 1, limit = 10, req) {
        return this.offersService.getReceivedOffers(req.user.id, page, limit);
    }
    async getSentOffers(page = 1, limit = 10, req) {
        return this.offersService.getSentOffers(req.user.id, page, limit);
    }
    async findOne(id, req) {
        return this.offersService.findOne(id, req.user.id);
    }
    async update(id, updateOfferDto, req) {
        return this.offersService.update(id, updateOfferDto, req.user.id);
    }
    async remove(id, req) {
        await this.offersService.remove(id, req.user.id);
        return { message: 'Offer deleted successfully' };
    }
};
exports.OffersController = OffersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new offer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Offer created successfully', type: offer_response_dto_1.OfferResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid offer data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_offer_dto_1.CreateOfferDto, Object]),
    __metadata("design:returntype", Promise)
], OffersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('received'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offers received by current user (as seller)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Offers retrieved successfully', type: paginated_offers_dto_1.PaginatedOffersDto }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], OffersController.prototype, "getReceivedOffers", null);
__decorate([
    (0, common_1.Get)('sent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offers sent by current user (as buyer)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Offers retrieved successfully', type: paginated_offers_dto_1.PaginatedOffersDto }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], OffersController.prototype, "getSentOffers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offer by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Offer retrieved successfully', type: offer_response_dto_1.OfferResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Offer not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Offer ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OffersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update offer status (accept/reject/counter)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Offer updated successfully', type: offer_response_dto_1.OfferResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Offer not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only update offers for your listings' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Offer ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_offer_dto_1.UpdateOfferDto, Object]),
    __metadata("design:returntype", Promise)
], OffersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete/withdraw offer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Offer deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Offer not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only delete your own offers' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Offer ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OffersController.prototype, "remove", null);
exports.OffersController = OffersController = __decorate([
    (0, swagger_1.ApiTags)('Offers'),
    (0, common_1.Controller)('offers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [offers_service_1.OffersService])
], OffersController);
//# sourceMappingURL=offers.controller.js.map