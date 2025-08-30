import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string | undefined;
        database: string;
        version: string;
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string | undefined;
        database: string;
        error: any;
        version?: undefined;
    }>;
}
