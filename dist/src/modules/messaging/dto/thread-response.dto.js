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
exports.ThreadResponseDto = exports.ThreadParticipantResponseDto = exports.MessageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const listing_response_dto_1 = require("../../listings/dto/listing-response.dto");
const user_response_dto_1 = require("../../users/dto/user-response.dto");
class MessageResponseDto {
    id;
    content;
    createdAt;
    sender;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MessageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Hello, is this item still available?' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MessageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: user_response_dto_1.UserResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => user_response_dto_1.UserResponseDto),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], MessageResponseDto.prototype, "sender", void 0);
class ThreadParticipantResponseDto {
    id;
    lastReadAt;
    user;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ThreadParticipantResponseDto = ThreadParticipantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ThreadParticipantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ThreadParticipantResponseDto.prototype, "lastReadAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: user_response_dto_1.UserResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => user_response_dto_1.UserResponseDto),
    __metadata("design:type", user_response_dto_1.UserResponseDto)
], ThreadParticipantResponseDto.prototype, "user", void 0);
class ThreadResponseDto {
    id;
    createdAt;
    lastMessageAt;
    listing;
    participants;
    messages;
    unreadCount;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.ThreadResponseDto = ThreadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ThreadResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ThreadResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ThreadResponseDto.prototype, "lastMessageAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: listing_response_dto_1.ListingResponseDto }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => listing_response_dto_1.ListingResponseDto),
    __metadata("design:type", listing_response_dto_1.ListingResponseDto)
], ThreadResponseDto.prototype, "listing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ThreadParticipantResponseDto] }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => ThreadParticipantResponseDto),
    __metadata("design:type", Array)
], ThreadResponseDto.prototype, "participants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MessageResponseDto] }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => MessageResponseDto),
    __metadata("design:type", Array)
], ThreadResponseDto.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Number of unread messages for current user' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ThreadResponseDto.prototype, "unreadCount", void 0);
//# sourceMappingURL=thread-response.dto.js.map