import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@babak.com' },
    update: {},
    create: {
      email: 'admin@babak.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  // Create test user
  const userPassword = await argon2.hash('user123');
  const user = await prisma.user.upsert({
    where: { email: 'user@babak.com' },
    update: {},
    create: {
      email: 'user@babak.com',
      passwordHash: userPassword,
      name: 'Test User',
      role: UserRole.USER,
    },
  });

  // Create categories
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
