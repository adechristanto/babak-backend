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
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messaging_service_1 = require("./messaging.service");
const create_thread_dto_1 = require("./dto/create-thread.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const thread_response_dto_1 = require("./dto/thread-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const email_verified_guard_1 = require("../auth/guards/email-verified.guard");
let MessagingController = class MessagingController {
    messagingService;
    constructor(messagingService) {
        this.messagingService = messagingService;
    }
    async createThread(createThreadDto, req) {
        return this.messagingService.createThread(createThreadDto, req.user.id);
    }
    async getThreads(req) {
        return this.messagingService.getThreads(req.user.id);
    }
    async getThread(id, req) {
        return this.messagingService.getThread(id, req.user.id);
    }
    async sendMessage(id, sendMessageDto, req) {
        return this.messagingService.sendMessage(id, sendMessageDto, req.user.id);
    }
    async markAsRead(id, req) {
        await this.messagingService.markAsRead(id, req.user.id);
        return { message: 'Thread marked as read' };
    }
    async getMessages(id, page = 1, limit = 50, req) {
        return this.messagingService.getMessages(id, req.user.id, page, limit);
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Post)('threads'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or get existing thread for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Thread created or retrieved successfully', type: thread_response_dto_1.ThreadResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot message about inactive listings or yourself' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_thread_dto_1.CreateThreadDto, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createThread", null);
__decorate([
    (0, common_1.Get)('threads'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all threads for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Threads retrieved successfully', type: [thread_response_dto_1.ThreadResponseDto] }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getThreads", null);
__decorate([
    (0, common_1.Get)('threads/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific thread with all messages' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thread retrieved successfully', type: thread_response_dto_1.ThreadResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thread not found or access denied' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Thread ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getThread", null);
__decorate([
    (0, common_1.Post)('threads/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send message in thread' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully', type: thread_response_dto_1.MessageResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thread not found or access denied' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Thread ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('threads/:id/mark-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark thread as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Thread marked as read successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thread not found or access denied' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Thread ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('threads/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages in thread with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved successfully', type: [thread_response_dto_1.MessageResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Thread not found or access denied' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Thread ID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', description: 'Page number', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Messages per page', required: false, example: 50 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getMessages", null);
exports.MessagingController = MessagingController = __decorate([
    (0, swagger_1.ApiTags)('Messaging'),
    (0, common_1.Controller)('messaging'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, email_verified_guard_1.EmailVerifiedGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map