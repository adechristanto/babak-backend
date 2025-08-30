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
exports.ListingImagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const listing_images_service_1 = require("./listing-images.service");
const add_image_dto_1 = require("./dto/add-image.dto");
const update_image_dto_1 = require("./dto/update-image.dto");
const listing_response_dto_1 = require("../dto/listing-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let ListingImagesController = class ListingImagesController {
    listingImagesService;
    constructor(listingImagesService) {
        this.listingImagesService = listingImagesService;
    }
    async addImage(listingId, addImageDto, req) {
        return this.listingImagesService.addImage(listingId, addImageDto, req.user.id);
    }
    async getImages(listingId) {
        return this.listingImagesService.getImages(listingId);
    }
    async updateImage(listingId, imageId, updateImageDto, req) {
        return this.listingImagesService.updateImage(listingId, imageId, updateImageDto, req.user.id);
    }
    async removeImage(listingId, imageId, req) {
        await this.listingImagesService.removeImage(listingId, imageId, req.user.id);
        return { message: 'Image removed successfully' };
    }
    async bulkReorder(listingId, body, req) {
        return this.listingImagesService.bulkReorder(listingId, body.imageIds, req.user.id);
    }
};
exports.ListingImagesController = ListingImagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add image to listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image added successfully', type: listing_response_dto_1.ListingImageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only add images to your own listings' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Maximum 10 images allowed per listing' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_image_dto_1.AddImageDto, Object]),
    __metadata("design:returntype", Promise)
], ListingImagesController.prototype, "addImage", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all images for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images retrieved successfully', type: [listing_response_dto_1.ListingImageResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListingImagesController.prototype, "getImages", null);
__decorate([
    (0, common_1.Patch)(':imageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update image (e.g., change position)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image updated successfully', type: listing_response_dto_1.ListingImageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing or image not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only update images of your own listings' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    (0, swagger_1.ApiParam)({ name: 'imageId', description: 'Image ID' }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('imageId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, update_image_dto_1.UpdateImageDto, Object]),
    __metadata("design:returntype", Promise)
], ListingImagesController.prototype, "updateImage", null);
__decorate([
    (0, common_1.Delete)(':imageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove image from listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing or image not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only remove images from your own listings' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    (0, swagger_1.ApiParam)({ name: 'imageId', description: 'Image ID' }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('imageId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ListingImagesController.prototype, "removeImage", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk reorder images' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Images reordered successfully', type: [listing_response_dto_1.ListingImageResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'You can only reorder images of your own listings' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid image IDs provided' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Param)('listingId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ListingImagesController.prototype, "bulkReorder", null);
exports.ListingImagesController = ListingImagesController = __decorate([
    (0, swagger_1.ApiTags)('Listing Images'),
    (0, common_1.Controller)('listings/:listingId/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [listing_images_service_1.ListingImagesService])
], ListingImagesController);
//# sourceMappingURL=listing-images.controller.js.map