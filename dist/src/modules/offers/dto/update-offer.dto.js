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
exports.UpdateOfferDto = exports.OfferStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "PENDING";
    OfferStatus["ACCEPTED"] = "ACCEPTED";
    OfferStatus["REJECTED"] = "REJECTED";
    OfferStatus["COUNTERED"] = "COUNTERED";
    OfferStatus["WITHDRAWN"] = "WITHDRAWN";
    OfferStatus["EXPIRED"] = "EXPIRED";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
class UpdateOfferDto {
    status;
    counterAmount;
    responseMessage;
}
exports.UpdateOfferDto = UpdateOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the offer',
        enum: OfferStatus,
        example: OfferStatus.ACCEPTED,
    }),
    (0, class_validator_1.IsEnum)(OfferStatus),
    __metadata("design:type", String)
], UpdateOfferDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Counter offer amount (only when status is COUNTERED)',
        example: 175.00,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateOfferDto.prototype, "counterAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response message from seller',
        example: 'Thanks for your offer! I can accept $175.',
        required: false,
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateOfferDto.prototype, "responseMessage", void 0);
//# sourceMappingURL=update-offer.dto.js.map