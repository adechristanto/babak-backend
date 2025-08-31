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
exports.DashboardOverviewDto = exports.RecentActivityDto = exports.TopListingDto = exports.DashboardStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardStatsDto {
    totalListings;
    totalViews;
    unreadMessages;
    totalSales;
    listingsChange;
    viewsChange;
    messagesChange;
    salesChange;
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalListings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1247 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalViews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "unreadMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3450 }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalSales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+3 this month' }),
    __metadata("design:type", String)
], DashboardStatsDto.prototype, "listingsChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+12% this week' }),
    __metadata("design:type", String)
], DashboardStatsDto.prototype, "viewsChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5 unread' }),
    __metadata("design:type", String)
], DashboardStatsDto.prototype, "messagesChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+$450 this month' }),
    __metadata("design:type", String)
], DashboardStatsDto.prototype, "salesChange", void 0);
class TopListingDto {
    id;
    title;
    views;
    messages;
    price;
    image;
}
exports.TopListingDto = TopListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], TopListingDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iPhone 14 Pro Max - 256GB' }),
    __metadata("design:type", String)
], TopListingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 234 }),
    __metadata("design:type", Number)
], TopListingDto.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], TopListingDto.prototype, "messages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 899 }),
    __metadata("design:type", Number)
], TopListingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/image.jpg' }),
    __metadata("design:type", String)
], TopListingDto.prototype, "image", void 0);
class RecentActivityDto {
    id;
    type;
    title;
    description;
    time;
}
exports.RecentActivityDto = RecentActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], RecentActivityDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'listing_viewed' }),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'iPhone 14 Pro Max viewed' }),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Your listing received 5 new views' }),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2 hours ago' }),
    __metadata("design:type", String)
], RecentActivityDto.prototype, "time", void 0);
class DashboardOverviewDto {
    stats;
    topListings;
    recentActivity;
    userName;
}
exports.DashboardOverviewDto = DashboardOverviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: DashboardStatsDto }),
    __metadata("design:type", DashboardStatsDto)
], DashboardOverviewDto.prototype, "stats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TopListingDto] }),
    __metadata("design:type", Array)
], DashboardOverviewDto.prototype, "topListings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [RecentActivityDto] }),
    __metadata("design:type", Array)
], DashboardOverviewDto.prototype, "recentActivity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], DashboardOverviewDto.prototype, "userName", void 0);
//# sourceMappingURL=dashboard-stats.dto.js.map