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
exports.OffersService = exports.OfferStatus = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "PENDING";
    OfferStatus["ACCEPTED"] = "ACCEPTED";
    OfferStatus["REJECTED"] = "REJECTED";
    OfferStatus["COUNTERED"] = "COUNTERED";
    OfferStatus["WITHDRAWN"] = "WITHDRAWN";
    OfferStatus["EXPIRED"] = "EXPIRED";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
let OffersService = class OffersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOfferDto, buyerId) {
        const { listingId, amount, message } = createOfferDto;
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            include: { seller: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.sellerId === buyerId) {
            throw new common_1.BadRequestException('You cannot make an offer on your own listing');
        }
        if (listing.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Cannot make offers on inactive listings');
        }
        if (amount <= 0) {
            throw new common_1.BadRequestException('Offer amount must be greater than 0');
        }
        const listingPrice = Number(listing.price);
        if (amount >= listingPrice) {
            throw new common_1.BadRequestException('Offer amount should be less than the listing price');
        }
        let thread = await this.prisma.thread.findFirst({
            where: {
                listingId,
                participants: {
                    some: { userId: buyerId },
                },
            },
        });
        if (!thread) {
            thread = await this.prisma.thread.create({
                data: {
                    listingId,
                    participants: {
                        create: [
                            { userId: buyerId },
                            { userId: listing.sellerId },
                        ],
                    },
                },
            });
        }
        const offerMessage = `💰 **OFFER: $${amount}**\n\n${message}`;
        await this.prisma.message.create({
            data: {
                threadId: thread.id,
                senderId: buyerId,
                content: offerMessage,
            },
        });
        await this.prisma.thread.update({
            where: { id: thread.id },
            data: { lastMessageAt: new Date() },
        });
        return {
            id: thread.id,
            listingId,
            buyerId,
            amount,
            message,
            status: 'SENT',
            createdAt: new Date(),
        };
    }
    async getReceivedOffers(sellerId, page = 1, limit = 10) {
        const threads = await this.prisma.thread.findMany({
            where: {
                listing: {
                    sellerId,
                },
                messages: {
                    some: {
                        content: {
                            contains: '💰 **OFFER:',
                        },
                    },
                },
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
                messages: {
                    where: {
                        content: {
                            contains: '💰 **OFFER:',
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    include: {
                        sender: true,
                    },
                },
            },
            orderBy: { lastMessageAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: threads.map(thread => ({
                id: thread.id,
                listingId: thread.listingId,
                listing: thread.listing,
                latestOffer: thread.messages[0],
                createdAt: thread.createdAt,
            })),
            meta: {
                page,
                limit,
                total: threads.length,
                totalPages: Math.ceil(threads.length / limit),
            },
        };
    }
    async getSentOffers(buyerId, page = 1, limit = 10) {
        const threads = await this.prisma.thread.findMany({
            where: {
                participants: {
                    some: { userId: buyerId },
                },
                messages: {
                    some: {
                        senderId: buyerId,
                        content: {
                            contains: '💰 **OFFER:',
                        },
                    },
                },
            },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
                messages: {
                    where: {
                        senderId: buyerId,
                        content: {
                            contains: '💰 **OFFER:',
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { lastMessageAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: threads.map(thread => ({
                id: thread.id,
                listingId: thread.listingId,
                listing: thread.listing,
                latestOffer: thread.messages[0],
                createdAt: thread.createdAt,
            })),
            meta: {
                page,
                limit,
                total: threads.length,
                totalPages: Math.ceil(threads.length / limit),
            },
        };
    }
    async findOne(id, userId) {
        const thread = await this.prisma.thread.findUnique({
            where: { id },
            include: {
                listing: {
                    include: {
                        seller: true,
                        category: true,
                        images: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
                participants: true,
                messages: {
                    where: {
                        content: {
                            contains: '💰 **OFFER:',
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        sender: true,
                    },
                },
            },
        });
        if (!thread) {
            throw new common_1.NotFoundException('Thread not found');
        }
        const isParticipant = thread.participants.some(p => p.userId === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You can only view your own conversations');
        }
        return {
            id: thread.id,
            listingId: thread.listingId,
            listing: thread.listing,
            offers: thread.messages,
            createdAt: thread.createdAt,
        };
    }
    async update(id, updateOfferDto, userId) {
        return { message: 'Offer response sent successfully' };
    }
    async remove(id, userId) {
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OffersService);
//# sourceMappingURL=offers.service.js.map