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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const thread_response_dto_1 = require("./dto/thread-response.dto");
const listing_response_dto_1 = require("../listings/dto/listing-response.dto");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const category_response_dto_1 = require("../categories/dto/category-response.dto");
let MessagingService = class MessagingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createThread(createThreadDto, userId) {
        const { listingId, message } = createThreadDto;
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: {
                seller: true,
                category: true,
                images: { orderBy: { position: 'asc' } },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.status !== client_1.ListingStatus.ACTIVE) {
            throw new common_1.BadRequestException('Cannot message about inactive listings');
        }
        if (listing.sellerId === userId) {
            throw new common_1.BadRequestException('Cannot create thread with yourself');
        }
        const existingThread = await this.prisma.thread.findFirst({
            where: {
                listingId,
                participants: {
                    every: {
                        userId: { in: [userId, listing.sellerId] },
                    },
                },
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: { orderBy: { position: 'asc' } },
                    },
                },
                participants: { include: { user: true } },
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
        if (existingThread) {
            if (message) {
                await this.prisma.message.create({
                    data: {
                        threadId: existingThread.id,
                        senderId: userId,
                        content: message,
                    },
                });
                await this.prisma.thread.update({
                    where: { id: existingThread.id },
                    data: { lastMessageAt: new Date() },
                });
                const updatedThread = await this.prisma.thread.findUnique({
                    where: { id: existingThread.id },
                    include: {
                        listing: {
                            include: {
                                seller: true,
                                category: true,
                                images: { orderBy: { position: 'asc' } },
                            },
                        },
                        participants: { include: { user: true } },
                        messages: {
                            include: { sender: true },
                            orderBy: { createdAt: 'desc' },
                            take: 20,
                        },
                    },
                });
                return this.mapToThreadResponseDto(updatedThread, userId);
            }
            return this.mapToThreadResponseDto(existingThread, userId);
        }
        const thread = await this.prisma.thread.create({
            data: {
                listingId,
                participants: {
                    create: [
                        { userId },
                        { userId: listing.sellerId },
                    ],
                },
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: { orderBy: { position: 'asc' } },
                    },
                },
                participants: { include: { user: true } },
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (message) {
            await this.prisma.message.create({
                data: {
                    threadId: thread.id,
                    senderId: userId,
                    content: message,
                },
            });
            await this.prisma.thread.update({
                where: { id: thread.id },
                data: { lastMessageAt: new Date() },
            });
            const updatedThread = await this.prisma.thread.findUnique({
                where: { id: thread.id },
                include: {
                    listing: {
                        include: {
                            seller: true,
                            category: true,
                            images: { orderBy: { position: 'asc' } },
                        },
                    },
                    participants: { include: { user: true } },
                    messages: {
                        include: { sender: true },
                        orderBy: { createdAt: 'desc' },
                        take: 20,
                    },
                },
            });
            return this.mapToThreadResponseDto(updatedThread, userId);
        }
        return this.mapToThreadResponseDto(thread, userId);
    }
    async sendMessage(threadId, sendMessageDto, userId) {
        const { content } = sendMessageDto;
        const thread = await this.prisma.thread.findFirst({
            where: {
                id: threadId,
                participants: {
                    some: { userId },
                },
            },
            include: {
                participants: true,
            },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found or access denied');
        }
        const message = await this.prisma.message.create({
            data: {
                threadId,
                senderId: userId,
                content,
            },
            include: {
                sender: true,
            },
        });
        await this.prisma.thread.update({
            where: { id: threadId },
            data: { lastMessageAt: new Date() },
        });
        await this.prisma.threadParticipant.updateMany({
            where: {
                threadId,
                userId,
            },
            data: {
                lastReadAt: new Date(),
            },
        });
        return new thread_response_dto_1.MessageResponseDto({
            ...message,
            sender: new user_response_dto_1.UserResponseDto(message.sender),
        });
    }
    async getThreads(userId) {
        const threads = await this.prisma.thread.findMany({
            where: {
                participants: {
                    some: { userId },
                },
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: { orderBy: { position: 'asc' } },
                    },
                },
                participants: { include: { user: true } },
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { lastMessageAt: 'desc' },
        });
        return threads.map(thread => this.mapToThreadResponseDto(thread, userId));
    }
    async getThread(threadId, userId) {
        const thread = await this.prisma.thread.findFirst({
            where: {
                id: threadId,
                participants: {
                    some: { userId },
                },
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: { orderBy: { position: 'asc' } },
                    },
                },
                participants: { include: { user: true } },
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found or access denied');
        }
        return this.mapToThreadResponseDto(thread, userId);
    }
    async markAsRead(threadId, userId) {
        const participant = await this.prisma.threadParticipant.findFirst({
            where: {
                threadId,
                userId,
            },
        });
        if (!participant) {
            throw new common_1.NotFoundException('Thread not found or access denied');
        }
        await this.prisma.threadParticipant.update({
            where: { id: participant.id },
            data: { lastReadAt: new Date() },
        });
    }
    async getMessages(threadId, userId, page = 1, limit = 50) {
        const thread = await this.prisma.thread.findFirst({
            where: {
                id: threadId,
                participants: {
                    some: { userId },
                },
            },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found or access denied');
        }
        const skip = (page - 1) * limit;
        const messages = await this.prisma.message.findMany({
            where: { threadId },
            include: { sender: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });
        return messages.map(message => new thread_response_dto_1.MessageResponseDto({
            ...message,
            sender: new user_response_dto_1.UserResponseDto(message.sender),
        }));
    }
    mapToThreadResponseDto(thread, currentUserId) {
        const participant = thread.participants.find((p) => p.userId === currentUserId);
        const unreadCount = thread.messages.filter((message) => message.createdAt > participant?.lastReadAt && message.senderId !== currentUserId).length;
        return new thread_response_dto_1.ThreadResponseDto({
            ...thread,
            listing: new listing_response_dto_1.ListingResponseDto({
                ...thread.listing,
                seller: new user_response_dto_1.UserResponseDto(thread.listing.seller),
                category: thread.listing.category ? new category_response_dto_1.CategoryResponseDto(thread.listing.category) : null,
            }),
            participants: thread.participants.map((p) => new thread_response_dto_1.ThreadParticipantResponseDto({
                ...p,
                user: new user_response_dto_1.UserResponseDto(p.user),
            })),
            messages: thread.messages.map((message) => new thread_response_dto_1.MessageResponseDto({
                ...message,
                sender: new user_response_dto_1.UserResponseDto(message.sender),
            })),
            unreadCount,
        });
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map