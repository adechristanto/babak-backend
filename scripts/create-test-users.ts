import { PrismaClient, UserRole, User } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('🔧 Creating test users with all attributes...');

  const testUsers = [
    {
      email: 'pratomoadhe+20@gmail.com',
      password: 'Superuser123',
      name: 'Super User',
      role: UserRole.SUPERUSER,
      phone: '+6281234567890',
      location: 'Jakarta, Indonesia',
      bio: 'Super user account for testing purposes with full system access.',
      avatarUrl: 'https://picsum.photos/200/200?random=20'
    },
    {
      email: 'pratomoadhe+21@gmail.com',
      password: 'Superuser123',
      name: 'Admin User',
      role: UserRole.ADMIN,
      phone: '+6281234567891',
      location: 'Bandung, Indonesia',
      bio: 'Admin user account for testing moderation and administrative features.',
      avatarUrl: 'https://picsum.photos/200/200?random=21'
    },
    {
      email: 'pratomoadhe+22@gmail.com',
      password: 'Superuser123',
      name: 'Test User 1',
      role: UserRole.USER,
      phone: '+963123456789',
      location: 'Damascus, Syria',
      bio: 'Regular user account for testing marketplace features.',
      avatarUrl: 'https://picsum.photos/200/200?random=22'
    },
    {
      email: 'pratomoadhe+23@gmail.com',
      password: 'Superuser123',
      name: 'Test User 2',
      role: UserRole.USER,
      phone: '+963123456790',
      location: 'Aleppo, Syria',
      bio: 'Another regular user account for testing interactions.',
      avatarUrl: 'https://picsum.photos/200/200?random=23'
    }
  ];

  const createdUsers: (User & { password: string })[] = [];

  for (const userData of testUsers) {
    console.log(`Creating user: ${userData.name} (${userData.email})`);
    
    // Hash the password
    const passwordHash = await argon2.hash(userData.password);
    
    // Create user with all attributes
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        // Update all fields to ensure they're set correctly
        passwordHash,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio,
        avatarUrl: userData.avatarUrl,
        emailVerified: true, // Directly validate email
        emailVerificationToken: null, // Clear any pending verification
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
        emailVerified: true, // Directly validate email
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });

    // Create user settings for each user
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        // Update settings to ensure they're set
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
      password: userData.password // Include password for display
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

// Run the script
createTestUsers()
  .catch((e) => {
    console.error('❌ Error creating test users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
