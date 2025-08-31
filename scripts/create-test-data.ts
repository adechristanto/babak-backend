import { PrismaClient, ListingStatus, ListingCondition, NegotiableStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Sample product data for different categories
const sampleProducts = [
  {
    title: 'iPhone 15 Pro Max - 256GB',
    description: 'Latest iPhone in excellent condition. Includes original box and accessories.',
    price: 1200,
    category: 'phones-accessories',
    condition: ListingCondition.EXCELLENT,
    negotiable: NegotiableStatus.NEGOTIABLE
  },
  {
    title: 'MacBook Pro 16" M2 Chip',
    description: 'Powerful laptop for professionals. Perfect for development and design work.',
    price: 2500,
    category: 'computers-accessories',
    condition: ListingCondition.LIKE_NEW,
    negotiable: NegotiableStatus.FIXED_PRICE
  },
  {
    title: 'Toyota Camry 2020',
    description: 'Well-maintained sedan with low mileage. Great fuel efficiency.',
    price: 25000,
    category: 'vehicles',
    condition: ListingCondition.GOOD,
    negotiable: NegotiableStatus.MAKE_OFFER
  },
  {
    title: 'Modern 2BR Apartment',
    description: 'Beautiful apartment in city center with modern amenities.',
    price: 250000,
    category: 'real-estate',
    condition: ListingCondition.NEW,
    negotiable: NegotiableStatus.NEGOTIABLE
  },
  {
    title: 'Samsung 65" Smart TV',
    description: '4K Ultra HD Smart Television with excellent picture quality.',
    price: 1200,
    category: 'electronics',
    condition: ListingCondition.EXCELLENT,
    negotiable: NegotiableStatus.FIXED_PRICE
  },
  {
    title: 'Leather Living Room Set',
    description: '3-seater sofa with matching chairs. High-quality leather.',
    price: 1200,
    category: 'furniture',
    condition: ListingCondition.GOOD,
    negotiable: NegotiableStatus.NEGOTIABLE
  }
];

async function createTestData() {
  console.log('🔧 Creating test data for existing users...');

  // Get existing test users
  const testUsers = await prisma.user.findMany({
    where: {
      email: {
        in: [
          'pratomoadhe+20@gmail.com',
          'pratomoadhe+21@gmail.com',
          'pratomoadhe+22@gmail.com',
          'pratomoadhe+23@gmail.com'
        ]
      }
    }
  });

  if (testUsers.length === 0) {
    console.log('❌ No test users found. Please run the create-test-users script first.');
    return;
  }

  console.log(`Found ${testUsers.length} test users`);

  // Get categories for listings
  const categories = await prisma.category.findMany({
    where: {
      slug: {
        in: ['phones-accessories', 'computers-accessories', 'vehicles', 'real-estate', 'electronics', 'furniture']
      }
    }
  });

  const categoryMap = new Map(categories.map(cat => [cat.slug, cat]));

  // Create sample listings for regular users (User 1 and User 2)
  const regularUsers = testUsers.filter(user => user.role === 'USER');
  const createdListings: any[] = [];

  for (const user of regularUsers) {
    console.log(`📦 Creating listings for ${user.name}...`);
    
    // Create 3 listings per user
    for (let i = 0; i < 3; i++) {
      const product = sampleProducts[i];
      const category = categoryMap.get(product.category);
      
      if (!category) {
        console.log(`⚠️ Category ${product.category} not found, skipping...`);
        continue;
      }

      const listing = await prisma.listing.create({
        data: {
          sellerId: user.id,
          title: product.title,
          description: product.description,
          price: product.price,
          currency: 'USD',
          categoryId: category.id,
          city: user.location?.split(',')[0] || 'Jakarta',
          latitude: -6.2088,
          longitude: 106.8456,
          status: ListingStatus.ACTIVE,
          condition: product.condition,
          negotiable: product.negotiable,
          isVip: Math.random() > 0.7,
          isFeatured: Math.random() > 0.8,
        },
      });

      // Add sample images
      await prisma.listingImage.createMany({
        data: [
          {
            listingId: listing.id,
            url: `https://picsum.photos/800/600?random=${listing.id}`,
            position: 0,
          },
          {
            listingId: listing.id,
            url: `https://picsum.photos/800/600?random=${listing.id + 1}`,
            position: 1,
          },
        ],
      });

      createdListings.push(listing);
      console.log(`✅ Created listing: ${listing.title}`);
    }
  }

  // Create sample reviews between users
  console.log('⭐ Creating sample reviews...');
  for (const listing of createdListings) {
    // Get a different user to review
    const reviewer = regularUsers.find(user => user.id !== listing.sellerId);
    if (!reviewer) continue;

    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    const comments = [
      'Great product, exactly as described!',
      'Fast delivery and excellent condition.',
      'Very satisfied with this purchase.',
      'Good quality for the price.',
      'Would recommend to others.',
      'Seller was very responsive.',
      'Item arrived on time and in perfect condition.',
      'Excellent service and product quality.',
      'Highly recommended seller!',
      'Great communication throughout the process.'
    ];

    await prisma.review.create({
      data: {
        listingId: listing.id,
        reviewerId: reviewer.id,
        rating: rating,
        comment: comments[Math.floor(Math.random() * comments.length)],
      },
    });
  }

  // Create sample favorites
  console.log('❤️ Creating sample favorites...');
  for (const listing of createdListings) {
    const favoriter = regularUsers.find(user => user.id !== listing.sellerId);
    if (!favoriter) continue;

    await prisma.favorite.create({
      data: {
        userId: favoriter.id,
        listingId: listing.id,
      },
    });
  }

  // Create sample view tracking
  console.log('👁️ Creating sample view tracking...');
  for (const listing of createdListings) {
    const numViews = Math.floor(Math.random() * 20) + 5; // 5-25 views
    
    for (let i = 0; i < numViews; i++) {
      const viewerId = Math.random() > 0.3 ? regularUsers[i % regularUsers.length].id : null;
      
      await prisma.listingView.create({
        data: {
          listingId: listing.id,
          viewerId: viewerId,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
    }
  }

  // Create sample notifications
  console.log('🔔 Creating sample notifications...');
  for (const user of regularUsers) {
    const notifications = [
      {
        type: 'LISTING_VIEW',
        title: 'Your listing received a new view',
        message: 'Someone viewed your listing "iPhone 15 Pro Max"',
        data: { listingId: 1 }
      },
      {
        type: 'NEW_MESSAGE',
        title: 'New message received',
        message: 'You have a new message about your listing',
        data: { threadId: 1 }
      },
      {
        type: 'FAVORITE_ADDED',
        title: 'Your listing was favorited',
        message: 'Someone added your listing to their favorites',
        data: { listingId: 1 }
      }
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: notification.type,
          title: notification.title,
          body: notification.message,
          read: Math.random() > 0.5, // Randomly mark some as read
        },
      });
    }
  }

  console.log('\n🎉 Test data created successfully!');
  console.log('\n📊 Created Data Summary:');
  console.log(`   👤 Users: ${testUsers.length}`);
  console.log(`   📦 Listings: ${createdListings.length}`);
  console.log(`   ⭐ Reviews: ${createdListings.length}`);
  console.log(`   ❤️ Favorites: ${createdListings.length}`);
  console.log(`   👁️ Views: ~${createdListings.length * 15}`);
  console.log(`   🔔 Notifications: ${regularUsers.length * 3}`);

  console.log('\n🔐 Test data includes:');
  console.log('   ✅ Sample listings with images');
  console.log('   ✅ Reviews and ratings');
  console.log('   ✅ Favorites and interactions');
  console.log('   ✅ View tracking data');
  console.log('   ✅ Sample notifications');
  console.log('   ✅ Ready for comprehensive testing');

  return { users: testUsers, listings: createdListings };
}

// Run the script
createTestData()
  .catch((e) => {
    console.error('❌ Error creating test data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
