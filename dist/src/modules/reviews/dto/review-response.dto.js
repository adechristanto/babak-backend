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
exports.ReviewResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_response_dto_1 = require("../../users/dto/user-response.dto");
class ReviewResponseDto {
    id;
    listingId;
    reviewerId;
    rating;
    comment;
    createdAt;
    reviewer;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ReviewResponseDto = ReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review ID', example: 1 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Listing ID', example: 1 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reviewer ID', example: 1 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "reviewerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rating (1-5)', example: 5 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review comment', example: 'Great product!' }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Review creation date' }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reviewer information', type: user_response_dto_1.UserResponseDto }),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], ReviewResponseDto.prototype, "reviewer", void 0);
//# sourceMappingURL=review-response.dto.js.map