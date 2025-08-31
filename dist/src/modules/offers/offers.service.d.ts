import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare enum OfferStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    COUNTERED = "COUNTERED",
    WITHDRAWN = "WITHDRAWN",
    EXPIRED = "EXPIRED"
}
export declare class OffersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOfferDto: CreateOfferDto, buyerId: number): Promise<any>;
    getReceivedOffers(sellerId: number, page?: number, limit?: number): Promise<any>;
    getSentOffers(buyerId: number, page?: number, limit?: number): Promise<any>;
    findOne(id: number, userId: number): Promise<any>;
    update(id: number, updateOfferDto: UpdateOfferDto, userId: number): Promise<any>;
    remove(id: number, userId: number): Promise<void>;
}
