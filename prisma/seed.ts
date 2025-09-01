import {
  PrismaClient,
  UserRole,
  ListingStatus,
  ListingCondition,
  NegotiableStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Category and subcategory data
const categoriesData = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Properties for sale and rent',
    icon: '🏠',
    subcategories: [
      {
        id: 'apartments',
        name: 'Apartments',
        description: 'Apartment units for sale or rent',
      },
      { id: 'houses', name: 'Houses', description: 'Houses and villas' },
      { id: 'land', name: 'Land', description: 'Land plots and lots' },
      {
        id: 'shops-offices',
        name: 'Shops and Offices',
        description: 'Commercial properties',
      },
      {
        id: 'factory-workshops',
        name: 'Factory and Workshops',
        description: 'Industrial properties',
      },
      {
        id: 'tourist-properties',
        name: 'Tourist Properties',
        description: 'Hotels, resorts, and vacation rentals',
      },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    description: 'Cars, motorcycles, and automotive',
    icon: '🚗',
    subcategories: [
      {
        id: 'cars',
        name: 'Cars',
        description: 'Automobiles and passenger vehicles',
      },
      {
        id: 'motorcycles',
        name: 'Motorcycles',
        description: 'Motorcycles and scooters',
      },
      {
        id: 'trucks-commercial',
        name: 'Trucks and Commercial Vehicles',
        description: 'Commercial and heavy-duty vehicles',
      },
      {
        id: 'agricultural-industrial',
        name: 'Agricultural and Industrial Vehicles',
        description: 'Farm and industrial machinery',
      },
      {
        id: 'marine-vehicles',
        name: 'Marine Vehicles',
        description: 'Boats, yachts, and water vehicles',
      },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and home appliances',
    icon: '📱',
    subcategories: [
      {
        id: 'televisions',
        name: 'Televisions',
        description: 'Smart TVs, LED, OLED displays',
      },
      {
        id: 'refrigerators-freezers',
        name: 'Refrigerators and Freezers',
        description: 'Kitchen cooling appliances',
      },
      {
        id: 'washing-machines-dryers',
        name: 'Washing Machines & Dryers',
        description: 'Laundry appliances',
      },
      {
        id: 'ovens-microwaves',
        name: 'Ovens and Microwaves',
        description: 'Cooking appliances',
      },
      {
        id: 'vacuum-cleaners',
        name: 'Vacuum Cleaners',
        description: 'Cleaning appliances',
      },
      {
        id: 'cameras',
        name: 'Cameras',
        description: 'Digital cameras and equipment',
      },
      {
        id: 'video-games',
        name: 'Video Games',
        description: 'Gaming consoles and games',
      },
      {
        id: 'air-conditioners',
        name: 'Air Conditioners',
        description: 'Climate control systems',
      },
      {
        id: 'water-heaters',
        name: 'Water Heaters',
        description: 'Water heating systems',
      },
      {
        id: 'audio-equipment',
        name: 'Audio Equipment',
        description: 'Speakers, sound systems',
      },
      {
        id: 'e-books',
        name: 'E-Books',
        description: 'Electronic reading devices',
      },
      {
        id: 'security-surveillance',
        name: 'Security and Surveillance Systems',
        description: 'Security cameras and systems',
      },
      {
        id: 'home-kitchen-appliances',
        name: 'Home and Kitchen Appliances',
        description: 'Small home appliances',
      },
      {
        id: 'uncategorized-appliances',
        name: 'Uncategorized Appliances',
        description: 'Other electronic appliances',
      },
    ],
  },
];

// Product templates for each subcategory
const productTemplates: Record<
  string,
  Array<{
    title: string;
    description: string;
    price: number;
    condition: ListingCondition;
  }>
> = {
  // Real Estate
  apartments: [
    {
      title: 'Modern 2BR Apartment in Damascus',
      description:
        'Beautiful apartment in city center with modern amenities, balcony, and parking.',
      price: 85000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Cozy 1BR Studio in Aleppo',
      description:
        'Fully furnished studio apartment in residential area, perfect for students or young professionals.',
      price: 45000,
      condition: ListingCondition.GOOD,
    },
  ],
  houses: [
    {
      title: 'Traditional Syrian House in Damascus',
      description:
        'Beautiful traditional house with courtyard, 3 bedrooms, and garden.',
      price: 180000,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Modern Villa in Aleppo Suburbs',
      description:
        'Contemporary villa with 4 bedrooms, swimming pool, and large garden.',
      price: 250000,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  land: [
    {
      title: 'Agricultural Land in Homs',
      description:
        'Fertile agricultural land, 5 acres, suitable for farming or development.',
      price: 75000,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Residential Plot in Damascus',
      description:
        'Prime residential plot in upscale neighborhood, ready for construction.',
      price: 120000,
      condition: ListingCondition.NEW,
    },
  ],
  'shops-offices': [
    {
      title: 'Retail Shop in Damascus Market',
      description:
        'Prime location retail shop in busy market area, high foot traffic.',
      price: 95000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Office Space in Aleppo Business District',
      description:
        'Modern office space with meeting rooms and parking facilities.',
      price: 85000,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'factory-workshops': [
    {
      title: 'Textile Factory in Aleppo',
      description:
        'Large textile factory with modern equipment and storage facilities.',
      price: 350000,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Food Processing Workshop in Homs',
      description:
        'Food processing facility with industrial kitchen and storage.',
      price: 180000,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  'tourist-properties': [
    {
      title: 'Boutique Hotel in Damascus Old City',
      description: 'Charming boutique hotel in historic district with 8 rooms.',
      price: 280000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Beach Resort in Tartus',
      description: 'Small beach resort with 12 rooms and restaurant.',
      price: 450000,
      condition: ListingCondition.LIKE_NEW,
    },
  ],

  // Vehicles
  cars: [
    {
      title: 'Toyota Camry 2018',
      description:
        'Well-maintained sedan with low mileage, excellent fuel efficiency.',
      price: 18000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Hyundai Tucson 2019',
      description: 'SUV in great condition, perfect for family use.',
      price: 22000,
      condition: ListingCondition.GOOD,
    },
  ],
  motorcycles: [
    {
      title: 'Honda CG 125',
      description: 'Reliable motorcycle perfect for city commuting.',
      price: 2500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Yamaha YBR 125',
      description: 'Fuel-efficient motorcycle with low maintenance costs.',
      price: 2800,
      condition: ListingCondition.GOOD,
    },
  ],
  'trucks-commercial': [
    {
      title: 'Isuzu NPR Truck',
      description:
        'Commercial truck perfect for delivery and transport business.',
      price: 35000,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Mitsubishi Fuso Canter',
      description: 'Light commercial truck with good fuel economy.',
      price: 28000,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  'agricultural-industrial': [
    {
      title: 'John Deere Tractor',
      description:
        'Agricultural tractor in excellent condition, perfect for farming.',
      price: 45000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Industrial Forklift',
      description: 'Heavy-duty forklift for warehouse and industrial use.',
      price: 32000,
      condition: ListingCondition.GOOD,
    },
  ],
  'marine-vehicles': [
    {
      title: 'Fishing Boat',
      description:
        'Well-maintained fishing boat with engine and fishing equipment.',
      price: 28000,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Yacht for Sale',
      description: 'Luxury yacht with sleeping quarters and modern amenities.',
      price: 180000,
      condition: ListingCondition.EXCELLENT,
    },
  ],

  // Electronics
  televisions: [
    {
      title: 'Samsung 55" Smart TV',
      description:
        '4K Ultra HD Smart Television with excellent picture quality.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'LG 65" OLED TV',
      description:
        'Premium OLED television with perfect blacks and vibrant colors.',
      price: 1200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'refrigerators-freezers': [
    {
      title: 'Samsung Side-by-Side Refrigerator',
      description:
        'Large capacity refrigerator with ice maker and water dispenser.',
      price: 900,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'LG French Door Refrigerator',
      description:
        'Modern refrigerator with bottom freezer and smart features.',
      price: 1100,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'washing-machines-dryers': [
    {
      title: 'Samsung Front Load Washer',
      description:
        'Energy-efficient front load washing machine with steam function.',
      price: 700,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'LG Washer-Dryer Combo',
      description: 'Space-saving washer-dryer combination unit.',
      price: 900,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'ovens-microwaves': [
    {
      title: 'Bosch Electric Oven',
      description: 'Professional electric oven with convection cooking.',
      price: 600,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Samsung Microwave',
      description:
        'Countertop microwave with smart features and sensor cooking.',
      price: 200,
      condition: ListingCondition.GOOD,
    },
  ],
  'vacuum-cleaners': [
    {
      title: 'Dyson V11 Cordless Vacuum',
      description: 'High-performance cordless vacuum with long battery life.',
      price: 400,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Shark Navigator Vacuum',
      description: 'Powerful upright vacuum with excellent suction.',
      price: 250,
      condition: ListingCondition.GOOD,
    },
  ],
  cameras: [
    {
      title: 'Canon EOS R5',
      description: 'Professional mirrorless camera with 45MP sensor.',
      price: 3500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Sony A7 III',
      description:
        'Full-frame mirrorless camera with excellent low-light performance.',
      price: 2200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'video-games': [
    {
      title: 'PlayStation 5 Console',
      description: 'Latest gaming console with DualSense controller.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Nintendo Switch OLED',
      description: 'Portable gaming console with beautiful OLED screen.',
      price: 400,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'air-conditioners': [
    {
      title: 'LG Split AC Unit',
      description: 'Energy-efficient split air conditioner for home use.',
      price: 600,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Daikin Inverter AC',
      description: 'Advanced inverter air conditioner with smart features.',
      price: 800,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'water-heaters': [
    {
      title: 'Rheem Electric Water Heater',
      description: '50-gallon electric water heater with energy efficiency.',
      price: 350,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'A.O. Smith Gas Water Heater',
      description: 'Natural gas water heater with quick recovery.',
      price: 450,
      condition: ListingCondition.GOOD,
    },
  ],
  'audio-equipment': [
    {
      title: 'Bose Soundbar 700',
      description:
        'Premium soundbar with built-in Alexa and excellent sound quality.',
      price: 500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Sony Home Theater System',
      description: '5.1 channel home theater system with subwoofer.',
      price: 600,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'e-books': [
    {
      title: 'Amazon Kindle Paperwhite',
      description:
        'Waterproof e-reader with built-in light and long battery life.',
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Kobo Libra H2O',
      description: 'Premium e-reader with physical page turn buttons.',
      price: 200,
      condition: ListingCondition.GOOD,
    },
  ],
  'security-surveillance': [
    {
      title: 'Arlo Pro 3 Security Camera',
      description: 'Wireless security camera with 2K video and night vision.',
      price: 300,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Ring Video Doorbell Pro',
      description:
        'Smart video doorbell with motion detection and two-way talk.',
      price: 250,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'home-kitchen-appliances': [
    {
      title: 'KitchenAid Stand Mixer',
      description: 'Professional stand mixer with multiple attachments.',
      price: 350,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Ninja Food Processor',
      description:
        'Versatile food processor with multiple blades and functions.',
      price: 120,
      condition: ListingCondition.GOOD,
    },
  ],
  'uncategorized-appliances': [
    {
      title: 'DeLonghi Coffee Maker',
      description: 'Automatic coffee maker with programmable settings.',
      price: 180,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Breville Toaster Oven',
      description: 'Convection toaster oven with multiple cooking functions.',
      price: 220,
      condition: ListingCondition.GOOD,
    },
  ],
};

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data
  await prisma.listingAttribute.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.categoryAttribute.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const passwordHash = await bcrypt.hash('Superuser123', 10);
  const adminPasswordHash = await bcrypt.hash('Adminuser123', 10);
  const userPasswordHash = await bcrypt.hash('Testuser123', 10);

  const superUser = await prisma.user.create({
    data: {
      email: 'pratomoadhe+20@gmail.com',
      passwordHash,
      name: 'Super User',
      role: UserRole.SUPERUSER,
      emailVerified: true,
      locationCountry: 'Syria',
      locationCity: 'Damascus',
      locationAddress: 'Damascus, Syria',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'pratomoadhe+21@gmail.com',
      passwordHash: adminPasswordHash,
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
      locationCountry: 'Syria',
      locationCity: 'Aleppo',
      locationAddress: 'Aleppo, Syria',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'pratomoadhe+22@gmail.com',
      passwordHash: userPasswordHash,
      name: 'Test User 1',
      role: UserRole.USER,
      emailVerified: true,
      locationCountry: 'Syria',
      locationCity: 'Homs',
      locationAddress: 'Homs, Syria',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'pratomoadhe+23@gmail.com',
      passwordHash: userPasswordHash,
      name: 'Test User 2',
      role: UserRole.USER,
      emailVerified: true,
      locationCountry: 'Syria',
      locationCity: 'Latakia',
      locationAddress: 'Latakia, Syria',
    },
  });

  console.log('✅ Users created successfully');

  // Create categories and subcategories
  for (const categoryData of categoriesData) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        slug: categoryData.id,
        depth: 0,
      },
    });

    for (const subcategoryData of categoryData.subcategories) {
      await prisma.category.create({
        data: {
          name: subcategoryData.name,
          slug: subcategoryData.id,
          parentId: category.id,
          depth: 1,
          path: `${category.id}/${subcategoryData.id}`,
        },
      });
    }
  }

  console.log('✅ Categories and subcategories created successfully');

  // Create products for User 1 and User 2
  const testUsers = [user1, user2];
  let productCount = 0;

  for (const user of testUsers) {
    console.log(`📦 Creating products for ${user.name}...`);

    for (const categoryData of categoriesData) {
      for (const subcategoryData of categoryData.subcategories) {
        const subcategory = await prisma.category.findFirst({
          where: { slug: subcategoryData.id },
        });

        if (subcategory && productTemplates[subcategoryData.id]) {
          const templates = productTemplates[subcategoryData.id];
          if (templates && templates.length > 0) {
            const template = templates[productCount % templates.length]; // Safe access

            const listing = await prisma.listing.create({
              data: {
                sellerId: user.id,
                title: template.title,
                description: template.description,
                price: template.price,
                currency: 'SYP',
                categoryId: subcategory.id,
                city: user.locationCity,
                locationCountry: 'Syria',
                locationCity: user.locationCity,
                locationAddress: user.locationAddress,
                status: ListingStatus.ACTIVE,
                condition: template.condition,
                negotiable: NegotiableStatus.NEGOTIABLE,
              },
            });

            // Add a sample image
            await prisma.listingImage.create({
              data: {
                listingId: listing.id,
                url: `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(subcategoryData.name)}`,
                position: 0,
              },
            });

            productCount++;
          }
        }
      }
    }
  }

  console.log('✅ Products created successfully');
  console.log(`📦 Total products created: ${productCount}`);

  console.log('🌱 Database seeding completed!');
  console.log('👤 Super User:', superUser.email, '/ Superuser123');
  console.log('👤 Admin User:', adminUser.email, '/ Adminuser123');
  console.log('👤 User 1:', user1.email, '/ Testuser123');
  console.log('👤 User 2:', user2.email, '/ Testuser123');
  console.log(`📦 Total products created: ${productCount}`);
  console.log(
    `📁 Categories created: ${categoriesData.length} main categories with subcategories`,
  );
}

// Execute main function
void main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
