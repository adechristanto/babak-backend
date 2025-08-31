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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_response_dto_1 = require("../../users/dto/user-response.dto");
const listing_response_dto_1 = require("../../listings/dto/listing-response.dto");
class OfferResponseDto {
    id;
    listingId;
    buyerId;
    amount;
    message;
    status;
    counterAmount;
    responseMessage;
    expiresAt;
    createdAt;
    updatedAt;
    buyer;
    listing;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.OfferResponseDto = OfferResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Offer ID', example: 1 }),
    __metadata("design:type", Number)
], OfferResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Listing ID', example: 1 }),
    __metadata("design:type", Number)
], OfferResponseDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Buyer ID', example: 1 }),
    __metadata("design:type", Number)
], OfferResponseDto.prototype, "buyerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Offer amount', example: 150.00 }),
    __metadata("design:type", Number)
], OfferResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Message from buyer', example: 'Hi, I\'m interested in this item.' }),
    __metadata("design:type", String)
], OfferResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer status',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'WITHDRAWN', 'EXPIRED'],
        example: 'PENDING'
    }),
    __metadata("design:type", String)
], OfferResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Counter offer amount', example: 175.00, required: false }),
    __metadata("design:type", Number)
], OfferResponseDto.prototype, "counterAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response message from seller', required: false }),
    __metadata("design:type", String)
], OfferResponseDto.prototype, "responseMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Offer expiration date' }),
    __metadata("design:type", Date)
], OfferResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Offer creation date' }),
    __metadata("design:type", Date)
], OfferResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Offer last update date' }),
    __metadata("design:type", Date)
], OfferResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Buyer information', type: user_response_dto_1.UserResponseDto }),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], OfferResponseDto.prototype, "buyer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Listing information', type: listing_response_dto_1.ListingResponseDto }),
    __metadata("design:type", listing_response_dto_1.ListingResponseDto)
], OfferResponseDto.prototype, "listing", void 0);
//# sourceMappingURL=offer-response.dto.js.map