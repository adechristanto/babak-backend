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
exports.CreateOfferDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateOfferDto {
    listingId;
    amount;
    message;
}
exports.CreateOfferDto = CreateOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the listing to make an offer on',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "listingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Offer amount in dollars',
        example: 150.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message to the seller explaining the offer',
        example: 'Hi, I\'m very interested in this item. Would you consider this offer?',
        minLength: 10,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "message", void 0);
//# sourceMappingURL=create-offer.dto.js.map