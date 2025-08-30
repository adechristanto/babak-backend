import { HealthCheckService, PrismaHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';
export declare class HealthController {
    private readonly health;
    private readonly prismaHealth;
    private readonly memoryHealth;
    private readonly diskHealth;
    private readonly prisma;
    constructor(health: HealthCheckService, prismaHealth: PrismaHealthIndicator, memoryHealth: MemoryHealthIndicator, diskHealth: DiskHealthIndicator, prisma: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    readiness(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    liveness(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
