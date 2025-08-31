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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const notification_response_dto_1 = require("./dto/notification-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async getNotifications(page = 1, limit = 20, req) {
        return this.notificationsService.getNotifications(req.user.id, page, limit);
    }
    async getUnreadCount(req) {
        const unreadCount = await this.notificationsService.getUnreadCount(req.user.id);
        return { unreadCount };
    }
    async markAsRead(id, req) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }
    async markAllAsRead(req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }
    async deleteNotification(id, req) {
        await this.notificationsService.deleteNotification(id, req.user.id);
        return { message: 'Notification deleted successfully' };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notifications retrieved successfully', type: [notification_response_dto_1.NotificationResponseDto] }),
    (0, swagger_1.ApiQuery)({ name: 'page', description: 'Page number', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Notifications per page', required: false, example: 20 }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notifications count' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unread count retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                unreadCount: { type: 'number', example: 5 }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)(':id/mark-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read successfully', type: notification_response_dto_1.NotificationResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All notifications marked as read successfully',
        schema: {
            type: 'object',
            properties: {
                updatedCount: { type: 'number', example: 10 }
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification not found' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Notification ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map