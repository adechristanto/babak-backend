"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const adminPassword = await argon2.hash('admin123');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@babak.com' },
        update: {},
        create: {
            email: 'admin@babak.com',
            passwordHash: adminPassword,
            name: 'Admin User',
            role: client_1.UserRole.ADMIN,
        },
    });
    const userPassword = await argon2.hash('user123');
    const user = await prisma.user.upsert({
        where: { email: 'user@babak.com' },
        update: {},
        create: {
            email: 'user@babak.com',
            passwordHash: userPassword,
            name: 'Test User',
            role: client_1.UserRole.USER,
        },
    });
    const electronics = await prisma.category.upsert({
        where: { slug: 'electronics' },
        update: {},
        create: {
            name: 'Electronics',
            slug: 'electronics',
            path: 'electronics',
            depth: 0,
        },
    });
    const phones = await prisma.category.upsert({
        where: { slug: 'phones' },
        update: {},
        create: {
            name: 'Phones',
            slug: 'phones',
            parentId: electronics.id,
            path: 'electronics/phones',
            depth: 1,
        },
    });
    const vehicles = await prisma.category.upsert({
        where: { slug: 'vehicles' },
        update: {},
        create: {
            name: 'Vehicles',
            slug: 'vehicles',
            path: 'vehicles',
            depth: 0,
        },
    });
    const cars = await prisma.category.upsert({
        where: { slug: 'cars' },
        update: {},
        create: {
            name: 'Cars',
            slug: 'cars',
            parentId: vehicles.id,
            path: 'vehicles/cars',
            depth: 1,
        },
    });
    console.log('✅ Database seeding completed!');
    console.log(`👤 Admin user: admin@babak.com / admin123`);
    console.log(`👤 Test user: user@babak.com / user123`);
    console.log(`📁 Categories created: ${electronics.name}, ${phones.name}, ${vehicles.name}, ${cars.name}`);
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map