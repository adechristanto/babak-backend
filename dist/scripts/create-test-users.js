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
async function createTestUsers() {
    console.log('🔧 Creating test users with all attributes...');
    const testUsers = [
        {
            email: 'pratomoadhe+20@gmail.com',
            password: 'Superuser123',
            name: 'Super User',
            role: client_1.UserRole.SUPERUSER,
            phone: '+6281234567890',
            location: 'Jakarta, Indonesia',
            bio: 'Super user account for testing purposes with full system access.',
            avatarUrl: 'https://picsum.photos/200/200?random=20'
        },
        {
            email: 'pratomoadhe+21@gmail.com',
            password: 'Superuser123',
            name: 'Admin User',
            role: client_1.UserRole.ADMIN,
            phone: '+6281234567891',
            location: 'Bandung, Indonesia',
            bio: 'Admin user account for testing moderation and administrative features.',
            avatarUrl: 'https://picsum.photos/200/200?random=21'
        },
        {
            email: 'pratomoadhe+22@gmail.com',
            password: 'Superuser123',
            name: 'Test User 1',
            role: client_1.UserRole.USER,
            phone: '+6281234567892',
            location: 'Surabaya, Indonesia',
            bio: 'Regular user account for testing marketplace features.',
            avatarUrl: 'https://picsum.photos/200/200?random=22'
        },
        {
            email: 'pratomoadhe+23@gmail.com',
            password: 'Superuser123',
            name: 'Test User 2',
            role: client_1.UserRole.USER,
            phone: '+6281234567893',
            location: 'Medan, Indonesia',
            bio: 'Another regular user account for testing interactions.',
            avatarUrl: 'https://picsum.photos/200/200?random=23'
        }
    ];
    const createdUsers = [];
    for (const userData of testUsers) {
        console.log(`Creating user: ${userData.name} (${userData.email})`);
        const passwordHash = await argon2.hash(userData.password);
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                passwordHash,
                name: userData.name,
                role: userData.role,
                phone: userData.phone,
                location: userData.location,
                bio: userData.bio,
                avatarUrl: userData.avatarUrl,
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
                updatedAt: new Date()
            },
            create: {
                email: userData.email,
                passwordHash,
                name: userData.name,
                role: userData.role,
                phone: userData.phone,
                location: userData.location,
                bio: userData.bio,
                avatarUrl: userData.avatarUrl,
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null
            },
        });
        await prisma.userSettings.upsert({
            where: { userId: user.id },
            update: {
                emailNotifications: true,
                pushNotifications: true,
                messageAlerts: true,
                listingUpdates: true,
                marketingEmails: false,
                profileVisibility: 'public',
                showContactInfo: true,
                showLastSeen: true,
                allowDirectMessages: true,
                theme: 'system',
                language: 'en',
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                emailNotifications: true,
                pushNotifications: true,
                messageAlerts: true,
                listingUpdates: true,
                marketingEmails: false,
                profileVisibility: 'public',
                showContactInfo: true,
                showLastSeen: true,
                allowDirectMessages: true,
                theme: 'system',
                language: 'en'
            },
        });
        createdUsers.push({
            ...user,
            password: userData.password
        });
        console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('=====================================');
    createdUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Location: ${user.location}`);
        console.log(`   Email Verified: ${user.emailVerified ? '✅ Yes' : '❌ No'}`);
        console.log('   ---');
    });
    console.log('\n🔐 All users have been created with:');
    console.log('   ✅ Email verification completed');
    console.log('   ✅ User settings configured');
    console.log('   ✅ All required attributes set');
    console.log('   ✅ Ready for testing');
    return createdUsers;
}
createTestUsers()
    .catch((e) => {
    console.error('❌ Error creating test users:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create-test-users.js.map