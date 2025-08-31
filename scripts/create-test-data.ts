import { PrismaClient, ListingStatus, ListingCondition, NegotiableStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Syria cities and coordinates
const syriaCities = [
  { name: 'Damascus', lat: 33.5138, lng: 36.2765 },
  { name: 'Aleppo', lat: 36.2021, lng: 37.1343 },
  { name: 'Homs', lat: 34.7324, lng: 36.7137 },
  { name: 'Latakia', lat: 35.5407, lng: 35.7828 },
  { name: 'Hama', lat: 35.1318, lng: 36.7578 },
  { name: 'Tartus', lat: 34.8950, lng: 35.8867 },
  { name: 'Deir ez-Zor', lat: 35.3333, lng: 40.1500 },
  { name: 'Al-Hasakah', lat: 36.5119, lng: 40.7422 },
  { name: 'Idlib', lat: 35.9306, lng: 36.6339 },
  { name: 'Daraa', lat: 32.6189, lng: 36.1025 }
];

// Comprehensive product data for all subcategories
const productTemplates = {
  // Real Estate
  'apartments': [
    { title: 'Modern 2BR Apartment in Damascus', description: 'Beautiful apartment in city center with modern amenities, balcony, and parking.', price: 85000, condition: ListingCondition.EXCELLENT },
    { title: 'Cozy 1BR Studio in Aleppo', description: 'Fully furnished studio apartment in residential area, perfect for students or young professionals.', price: 45000, condition: ListingCondition.GOOD },
    { title: 'Luxury 3BR Penthouse in Homs', description: 'Spacious penthouse with panoramic city views, modern kitchen, and private terrace.', price: 120000, condition: ListingCondition.LIKE_NEW },
    { title: 'Family 4BR Apartment in Latakia', description: 'Large family apartment near the sea, with garden and children\'s play area.', price: 95000, condition: ListingCondition.EXCELLENT }
  ],
  'houses': [
    { title: 'Traditional Syrian House in Damascus', description: 'Beautiful traditional house with courtyard, 3 bedrooms, and garden.', price: 180000, condition: ListingCondition.GOOD },
    { title: 'Modern Villa in Aleppo Suburbs', description: 'Contemporary villa with 4 bedrooms, swimming pool, and large garden.', price: 250000, condition: ListingCondition.LIKE_NEW },
    { title: 'Family House in Hama', description: 'Spacious family house with 5 bedrooms, garage, and fruit trees.', price: 150000, condition: ListingCondition.EXCELLENT },
    { title: 'Beach House in Tartus', description: 'Charming beach house with sea views, 3 bedrooms, and private beach access.', price: 200000, condition: ListingCondition.GOOD }
  ],
  'land': [
    { title: 'Agricultural Land in Homs', description: 'Fertile agricultural land, 5 acres, suitable for farming or development.', price: 75000, condition: ListingCondition.NEW },
    { title: 'Residential Plot in Damascus', description: 'Prime residential plot in upscale neighborhood, ready for construction.', price: 120000, condition: ListingCondition.NEW },
    { title: 'Commercial Land in Aleppo', description: 'Commercial plot in business district, high foot traffic area.', price: 180000, condition: ListingCondition.NEW },
    { title: 'Mixed-Use Land in Latakia', description: 'Large plot suitable for mixed residential and commercial development.', price: 150000, condition: ListingCondition.NEW }
  ],
  'shops-offices': [
    { title: 'Retail Shop in Damascus Market', description: 'Prime location retail shop in busy market area, high foot traffic.', price: 95000, condition: ListingCondition.EXCELLENT },
    { title: 'Office Space in Aleppo Business District', description: 'Modern office space with meeting rooms and parking facilities.', price: 85000, condition: ListingCondition.LIKE_NEW },
    { title: 'Restaurant Space in Homs', description: 'Fully equipped restaurant space with kitchen and dining area.', price: 110000, condition: ListingCondition.GOOD },
    { title: 'Medical Clinic in Latakia', description: 'Medical clinic space with examination rooms and waiting area.', price: 130000, condition: ListingCondition.EXCELLENT }
  ],
  'factory-workshops': [
    { title: 'Textile Factory in Aleppo', description: 'Large textile factory with modern equipment and storage facilities.', price: 350000, condition: ListingCondition.GOOD },
    { title: 'Food Processing Workshop in Homs', description: 'Food processing facility with industrial kitchen and storage.', price: 180000, condition: ListingCondition.EXCELLENT },
    { title: 'Metal Workshop in Damascus', description: 'Metal fabrication workshop with tools and equipment included.', price: 120000, condition: ListingCondition.GOOD },
    { title: 'Carpentry Workshop in Latakia', description: 'Woodworking workshop with tools and machinery.', price: 95000, condition: ListingCondition.EXCELLENT }
  ],
  'tourist-properties': [
    { title: 'Boutique Hotel in Damascus Old City', description: 'Charming boutique hotel in historic district with 8 rooms.', price: 280000, condition: ListingCondition.EXCELLENT },
    { title: 'Beach Resort in Tartus', description: 'Small beach resort with 12 rooms and restaurant.', price: 450000, condition: ListingCondition.LIKE_NEW },
    { title: 'Mountain Lodge in Latakia', description: 'Cozy mountain lodge with stunning views and hiking trails.', price: 180000, condition: ListingCondition.GOOD },
    { title: 'Desert Camp in Deir ez-Zor', description: 'Traditional desert camp with 6 tents and cultural activities.', price: 120000, condition: ListingCondition.EXCELLENT }
  ],

  // Vehicles
  'cars': [
    { title: 'Toyota Camry 2018', description: 'Well-maintained sedan with low mileage, excellent fuel efficiency.', price: 18000, condition: ListingCondition.EXCELLENT },
    { title: 'Hyundai Tucson 2019', description: 'SUV in great condition, perfect for family use.', price: 22000, condition: ListingCondition.GOOD },
    { title: 'Nissan Sunny 2017', description: 'Reliable compact car, economical and easy to maintain.', price: 12000, condition: ListingCondition.GOOD },
    { title: 'Kia Sportage 2020', description: 'Modern SUV with advanced features and safety systems.', price: 25000, condition: ListingCondition.LIKE_NEW }
  ],
  'motorcycles': [
    { title: 'Honda CG 125', description: 'Reliable motorcycle perfect for city commuting.', price: 2500, condition: ListingCondition.EXCELLENT },
    { title: 'Yamaha YBR 125', description: 'Fuel-efficient motorcycle with low maintenance costs.', price: 2800, condition: ListingCondition.GOOD },
    { title: 'Suzuki GN 125', description: 'Classic motorcycle design, very reliable engine.', price: 2200, condition: ListingCondition.GOOD },
    { title: 'Kawasaki KLX 150', description: 'Off-road motorcycle suitable for adventure riding.', price: 3500, condition: ListingCondition.EXCELLENT }
  ],
  'trucks-commercial': [
    { title: 'Isuzu NPR Truck', description: 'Commercial truck perfect for delivery and transport business.', price: 35000, condition: ListingCondition.GOOD },
    { title: 'Mitsubishi Fuso Canter', description: 'Light commercial truck with good fuel economy.', price: 28000, condition: ListingCondition.EXCELLENT },
    { title: 'Toyota Dyna', description: 'Reliable commercial vehicle for various business needs.', price: 32000, condition: ListingCondition.GOOD },
    { title: 'Nissan Atlas', description: 'Heavy-duty truck suitable for construction and transport.', price: 45000, condition: ListingCondition.EXCELLENT }
  ],

  // Electronics
  'televisions': [
    { title: 'Samsung 55" Smart TV', description: '4K Ultra HD Smart Television with excellent picture quality.', price: 800, condition: ListingCondition.EXCELLENT },
    { title: 'LG 65" OLED TV', description: 'Premium OLED television with perfect blacks and vibrant colors.', price: 1200, condition: ListingCondition.LIKE_NEW },
    { title: 'Sony 43" LED TV', description: 'Reliable LED television with good sound quality.', price: 500, condition: ListingCondition.GOOD },
    { title: 'TCL 50" 4K TV', description: 'Affordable 4K television with smart features.', price: 400, condition: ListingCondition.EXCELLENT }
  ],
  'refrigerators-freezers': [
    { title: 'Samsung Side-by-Side Refrigerator', description: 'Large capacity refrigerator with ice maker and water dispenser.', price: 900, condition: ListingCondition.EXCELLENT },
    { title: 'LG French Door Refrigerator', description: 'Modern refrigerator with bottom freezer and smart features.', price: 1100, condition: ListingCondition.LIKE_NEW },
    { title: 'Whirlpool Top Freezer', description: 'Reliable refrigerator with good energy efficiency.', price: 600, condition: ListingCondition.GOOD },
    { title: 'Bosch Built-in Refrigerator', description: 'Premium built-in refrigerator for modern kitchens.', price: 1500, condition: ListingCondition.EXCELLENT }
  ],
  'washing-machines-dryers': [
    { title: 'Samsung Front Load Washer', description: 'Energy-efficient front load washing machine with steam function.', price: 700, condition: ListingCondition.EXCELLENT },
    { title: 'LG Washer-Dryer Combo', description: 'Space-saving washer-dryer combination unit.', price: 900, condition: ListingCondition.LIKE_NEW },
    { title: 'Whirlpool Top Load Washer', description: 'Reliable top load washing machine with large capacity.', price: 500, condition: ListingCondition.GOOD },
    { title: 'Bosch Washing Machine', description: 'Premium washing machine with advanced features.', price: 800, condition: ListingCondition.EXCELLENT }
  ],

  // Furniture
  'bedrooms': [
    { title: 'Queen Size Bed Set', description: 'Complete bedroom set with bed, wardrobe, and bedside tables.', price: 800, condition: ListingCondition.EXCELLENT },
    { title: 'King Size Bed Frame', description: 'Elegant king size bed frame with upholstered headboard.', price: 600, condition: ListingCondition.LIKE_NEW },
    { title: 'Children\'s Bedroom Set', description: 'Complete children\'s bedroom furniture with bed and storage.', price: 500, condition: ListingCondition.GOOD },
    { title: 'Master Bedroom Suite', description: 'Luxury master bedroom set with king bed and matching furniture.', price: 1200, condition: ListingCondition.EXCELLENT }
  ],
  'living-rooms': [
    { title: 'Leather Living Room Set', description: '3-seater sofa with matching chairs, high-quality leather.', price: 1200, condition: ListingCondition.EXCELLENT },
    { title: 'Modern Sectional Sofa', description: 'Contemporary sectional sofa perfect for family gatherings.', price: 1000, condition: ListingCondition.LIKE_NEW },
    { title: 'Traditional Syrian Sofa', description: 'Beautiful traditional Syrian sofa with intricate details.', price: 800, condition: ListingCondition.GOOD },
    { title: 'Recliner Living Room Set', description: 'Comfortable recliner sofa set with footrests.', price: 900, condition: ListingCondition.EXCELLENT }
  ],
  'dining-rooms': [
    { title: '6-Seater Dining Table Set', description: 'Elegant dining table with 6 chairs and buffet.', price: 700, condition: ListingCondition.EXCELLENT },
    { title: '8-Seater Extendable Table', description: 'Large extendable dining table perfect for family meals.', price: 900, condition: ListingCondition.LIKE_NEW },
    { title: 'Traditional Syrian Dining Set', description: 'Beautiful traditional Syrian dining furniture.', price: 600, condition: ListingCondition.GOOD },
    { title: 'Modern Glass Dining Table', description: 'Contemporary glass dining table with chrome legs.', price: 500, condition: ListingCondition.EXCELLENT }
  ],

  // Phones and Accessories
  'mobile-phones': [
    { title: 'iPhone 14 Pro 128GB', description: 'Latest iPhone in excellent condition with original accessories.', price: 900, condition: ListingCondition.EXCELLENT },
    { title: 'Samsung Galaxy S23', description: 'Premium Android phone with excellent camera and performance.', price: 700, condition: ListingCondition.LIKE_NEW },
    { title: 'Xiaomi Redmi Note 12', description: 'Great value smartphone with good performance.', price: 300, condition: ListingCondition.GOOD },
    { title: 'Huawei P30 Pro', description: 'High-end smartphone with excellent camera system.', price: 500, condition: ListingCondition.EXCELLENT }
  ],
  'ipads': [
    { title: 'iPad Pro 12.9" 2022', description: 'Professional iPad with M2 chip and Apple Pencil.', price: 800, condition: ListingCondition.EXCELLENT },
    { title: 'iPad Air 5th Generation', description: 'Lightweight iPad perfect for work and entertainment.', price: 600, condition: ListingCondition.LIKE_NEW },
    { title: 'iPad 10th Generation', description: 'Affordable iPad with great performance.', price: 400, condition: ListingCondition.GOOD },
    { title: 'iPad Mini 6th Generation', description: 'Compact iPad perfect for reading and gaming.', price: 350, condition: ListingCondition.EXCELLENT }
  ],
  'smart-watches': [
    { title: 'Apple Watch Series 8', description: 'Latest Apple Watch with health monitoring features.', price: 400, condition: ListingCondition.EXCELLENT },
    { title: 'Samsung Galaxy Watch 5', description: 'Premium Android smartwatch with fitness tracking.', price: 300, condition: ListingCondition.LIKE_NEW },
    { title: 'Xiaomi Mi Band 7', description: 'Affordable fitness tracker with long battery life.', price: 50, condition: ListingCondition.GOOD },
    { title: 'Garmin Fenix 7', description: 'Professional sports watch with advanced features.', price: 600, condition: ListingCondition.EXCELLENT }
  ],

  // Computers and Accessories
  'laptops': [
    { title: 'MacBook Pro 16" M2', description: 'Powerful laptop for professionals with M2 chip.', price: 2500, condition: ListingCondition.EXCELLENT },
    { title: 'Dell XPS 15', description: 'Premium Windows laptop with excellent performance.', price: 1800, condition: ListingCondition.LIKE_NEW },
    { title: 'Lenovo ThinkPad X1', description: 'Business laptop with great keyboard and durability.', price: 1200, condition: ListingCondition.GOOD },
    { title: 'HP Envy 13', description: 'Slim and lightweight laptop perfect for productivity.', price: 900, condition: ListingCondition.EXCELLENT }
  ],
  'desktop-computers': [
    { title: 'Gaming Desktop PC', description: 'High-performance gaming computer with RTX graphics.', price: 1500, condition: ListingCondition.EXCELLENT },
    { title: 'Apple iMac 27"', description: 'All-in-one desktop with stunning display.', price: 2000, condition: ListingCondition.LIKE_NEW },
    { title: 'Dell OptiPlex', description: 'Reliable business desktop computer.', price: 600, condition: ListingCondition.GOOD },
    { title: 'Custom Built PC', description: 'Custom built computer for work and gaming.', price: 1200, condition: ListingCondition.EXCELLENT }
  ],
  'monitors': [
    { title: 'Samsung 32" 4K Monitor', description: 'Ultra-high resolution monitor for professional work.', price: 400, condition: ListingCondition.EXCELLENT },
    { title: 'LG 27" Gaming Monitor', description: 'High refresh rate gaming monitor with G-Sync.', price: 350, condition: ListingCondition.LIKE_NEW },
    { title: 'Dell 24" Business Monitor', description: 'Reliable monitor perfect for office work.', price: 200, condition: ListingCondition.GOOD },
    { title: 'ASUS ProArt Monitor', description: 'Color-accurate monitor for design work.', price: 500, condition: ListingCondition.EXCELLENT }
  ],

  // Solar Energy
  'solar-panels': [
    { title: '300W Solar Panel Set', description: 'High-efficiency solar panels with mounting brackets.', price: 800, condition: ListingCondition.EXCELLENT },
    { title: '500W Solar Panel System', description: 'Complete solar panel system for home use.', price: 1200, condition: ListingCondition.LIKE_NEW },
    { title: '200W Portable Solar Panel', description: 'Portable solar panel for camping and outdoor use.', price: 400, condition: ListingCondition.GOOD },
    { title: '1KW Solar Panel Array', description: 'Large solar panel array for commercial use.', price: 2000, condition: ListingCondition.EXCELLENT }
  ],
  'inverters': [
    { title: '2000W Pure Sine Wave Inverter', description: 'High-quality inverter for solar power systems.', price: 300, condition: ListingCondition.EXCELLENT },
    { title: '5000W Hybrid Inverter', description: 'Hybrid inverter with battery backup capability.', price: 800, condition: ListingCondition.LIKE_NEW },
    { title: '1000W Modified Sine Wave Inverter', description: 'Affordable inverter for basic solar systems.', price: 150, condition: ListingCondition.GOOD },
    { title: '10KW Commercial Inverter', description: 'Large commercial inverter for solar farms.', price: 2500, condition: ListingCondition.EXCELLENT }
  ],
  'batteries': [
    { title: '100Ah Deep Cycle Battery', description: 'Deep cycle battery for solar energy storage.', price: 200, condition: ListingCondition.EXCELLENT },
    { title: '200Ah Lithium Battery', description: 'High-capacity lithium battery for solar systems.', price: 600, condition: ListingCondition.LIKE_NEW },
    { title: '50Ah AGM Battery', description: 'Reliable AGM battery for backup power.', price: 120, condition: ListingCondition.GOOD },
    { title: '500Ah Battery Bank', description: 'Large battery bank for off-grid systems.', price: 1500, condition: ListingCondition.EXCELLENT }
  ],

  // Services and Businesses
  'home-services': [
    { title: 'House Cleaning Service', description: 'Professional house cleaning service in Damascus area.', price: 50, condition: ListingCondition.NEW },
    { title: 'Plumbing Repair Service', description: 'Experienced plumber for all types of repairs.', price: 40, condition: ListingCondition.NEW },
    { title: 'Electrical Installation', description: 'Licensed electrician for installations and repairs.', price: 60, condition: ListingCondition.NEW },
    { title: 'Garden Maintenance', description: 'Professional garden maintenance and landscaping.', price: 45, condition: ListingCondition.NEW }
  ],
  'car-services': [
    { title: 'Car Repair Workshop', description: 'Professional car repair and maintenance service.', price: 35, condition: ListingCondition.NEW },
    { title: 'Car Wash and Detailing', description: 'Premium car wash and interior detailing service.', price: 25, condition: ListingCondition.NEW },
    { title: 'Tire and Battery Service', description: 'Tire replacement and battery service center.', price: 30, condition: ListingCondition.NEW },
    { title: 'Auto Parts Store', description: 'Wide selection of auto parts and accessories.', price: 20, condition: ListingCondition.NEW }
  ],
  'education-courses': [
    { title: 'English Language Course', description: 'Professional English language courses for all levels.', price: 200, condition: ListingCondition.NEW },
    { title: 'Computer Programming Course', description: 'Learn web development and programming skills.', price: 300, condition: ListingCondition.NEW },
    { title: 'Cooking Classes', description: 'Traditional Syrian cooking classes and workshops.', price: 150, condition: ListingCondition.NEW },
    { title: 'Music Lessons', description: 'Private music lessons for various instruments.', price: 100, condition: ListingCondition.NEW }
  ],

  // Building Materials
  'cement-concrete': [
    { title: 'Portland Cement 50kg Bags', description: 'High-quality Portland cement for construction projects.', price: 15, condition: ListingCondition.NEW },
    { title: 'Ready Mix Concrete', description: 'Ready mix concrete delivered to your construction site.', price: 80, condition: ListingCondition.NEW },
    { title: 'Concrete Blocks', description: 'Standard concrete blocks for building construction.', price: 2, condition: ListingCondition.NEW },
    { title: 'Concrete Mixer', description: 'Electric concrete mixer for small construction projects.', price: 300, condition: ListingCondition.EXCELLENT }
  ],
  'steel-metals': [
    { title: 'Steel Rebar 12mm', description: 'High-quality steel rebar for reinforced concrete.', price: 800, condition: ListingCondition.NEW },
    { title: 'Steel Beams', description: 'Structural steel beams for construction projects.', price: 1200, condition: ListingCondition.NEW },
    { title: 'Aluminum Sheets', description: 'Aluminum sheets for roofing and cladding.', price: 25, condition: ListingCondition.NEW },
    { title: 'Metal Pipes', description: 'Various sizes of metal pipes for plumbing and construction.', price: 15, condition: ListingCondition.NEW }
  ],
  'bricks-blocks': [
    { title: 'Red Clay Bricks', description: 'Traditional red clay bricks for construction.', price: 0.5, condition: ListingCondition.NEW },
    { title: 'Concrete Hollow Blocks', description: 'Hollow concrete blocks for wall construction.', price: 1.5, condition: ListingCondition.NEW },
    { title: 'Interlocking Bricks', description: 'Modern interlocking brick system for walls.', price: 2, condition: ListingCondition.NEW },
    { title: 'Decorative Bricks', description: 'Decorative bricks for architectural features.', price: 3, condition: ListingCondition.NEW }
  ],

  // Foodstuffs
  'fresh-produce': [
    { title: 'Fresh Vegetables Basket', description: 'Fresh local vegetables including tomatoes, cucumbers, and lettuce.', price: 15, condition: ListingCondition.NEW },
    { title: 'Organic Fruits Box', description: 'Organic fruits including apples, oranges, and bananas.', price: 20, condition: ListingCondition.NEW },
    { title: 'Fresh Herbs Bundle', description: 'Fresh herbs including mint, parsley, and basil.', price: 5, condition: ListingCondition.NEW },
    { title: 'Seasonal Fruits', description: 'Seasonal fruits from local farms.', price: 12, condition: ListingCondition.NEW }
  ],
  'meat-seafood': [
    { title: 'Fresh Lamb Meat', description: 'Fresh halal lamb meat from local farms.', price: 25, condition: ListingCondition.NEW },
    { title: 'Fresh Chicken', description: 'Fresh chicken meat from local poultry farms.', price: 8, condition: ListingCondition.NEW },
    { title: 'Fresh Fish', description: 'Fresh fish from Mediterranean Sea.', price: 18, condition: ListingCondition.NEW },
    { title: 'Beef Cuts', description: 'Premium beef cuts for grilling and cooking.', price: 30, condition: ListingCondition.NEW }
  ],
  'dairy-products': [
    { title: 'Fresh Milk', description: 'Fresh cow milk from local dairy farms.', price: 3, condition: ListingCondition.NEW },
    { title: 'Local Cheese', description: 'Traditional Syrian cheese varieties.', price: 12, condition: ListingCondition.NEW },
    { title: 'Yogurt', description: 'Fresh homemade yogurt.', price: 4, condition: ListingCondition.NEW },
    { title: 'Butter', description: 'Fresh butter made from local cream.', price: 8, condition: ListingCondition.NEW }
  ]
};

// Default product template for unknown subcategories
const defaultProductTemplate = [
  { title: 'Quality Product', description: 'High-quality product in excellent condition.', price: 100, condition: ListingCondition.GOOD },
  { title: 'Premium Item', description: 'Premium item with great features and durability.', price: 200, condition: ListingCondition.EXCELLENT }
];

async function clearAllData() {
  console.log('🧹 Clearing all existing data...');
  
  // Clear in order to avoid foreign key constraints
  await prisma.notification.deleteMany({});
  await prisma.listingView.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.threadParticipant.deleteMany({});
  await prisma.thread.deleteMany({});
  await prisma.listingImage.deleteMany({});
  await prisma.listingAttribute.deleteMany({});
  await prisma.listing.deleteMany({});
  
  console.log('✅ All data cleared successfully');
}

async function createTestData() {
  console.log('🔧 Creating comprehensive test data for User 1 and User 2...');

  // Clear all existing data first
  await clearAllData();

  // Get User 1 and User 2 (regular users)
  const testUsers = await prisma.user.findMany({
    where: {
      email: {
        in: [
          'pratomoadhe+22@gmail.com', // User 1
          'pratomoadhe+23@gmail.com'  // User 2
        ]
      }
    }
  });

  if (testUsers.length === 0) {
    console.log('❌ No test users found. Please run the create-test-users script first.');
    return;
  }

  console.log(`Found ${testUsers.length} test users`);

  // Get all categories and subcategories
  const categories = await prisma.category.findMany({
    include: {
      children: true
    }
  });

  console.log(`Found ${categories.length} main categories`);

  const createdListings: any[] = [];
  const createdThreads: any[] = [];

  // Create listings for each user
  for (const user of testUsers) {
    console.log(`📦 Creating listings for ${user.name}...`);
    
    // Get all subcategories (children of main categories)
    const subcategories = categories.flatMap(cat => cat.children);
    
    for (const subcategory of subcategories) {
      // Get product template for this subcategory
      const products = productTemplates[subcategory.slug as keyof typeof productTemplates] || defaultProductTemplate;
      
      // Create 2 listings per subcategory for this user
      for (let i = 0; i < 2; i++) {
        const product = products[i % products.length];
        const city = syriaCities[Math.floor(Math.random() * syriaCities.length)];
        
        const listing = await prisma.listing.create({
          data: {
            sellerId: user.id,
            title: product.title,
            description: product.description,
            price: product.price,
            currency: 'USD',
            categoryId: subcategory.id,
            city: city.name,
            latitude: city.lat,
            longitude: city.lng,
            locationAddress: `${city.name}, Syria`,
            locationCity: city.name,
            locationCountry: 'Syria',
            status: ListingStatus.ACTIVE,
            condition: product.condition,
            negotiable: Math.random() > 0.5 ? NegotiableStatus.NEGOTIABLE : NegotiableStatus.FIXED_PRICE,
            isVip: Math.random() > 0.8,
            isFeatured: Math.random() > 0.9,
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
        console.log(`✅ Created listing: ${listing.title} in ${city.name}`);
      }
    }
  }

  // Create messaging threads between users
  console.log('💬 Creating messaging threads...');
  for (let i = 0; i < Math.min(createdListings.length, 10); i++) {
    const listing = createdListings[i];
    const buyer = testUsers.find(user => user.id !== listing.sellerId);
    if (!buyer) continue;

    const thread = await prisma.thread.create({
      data: {
        listingId: listing.id,
      },
    });

    // Add participants
    await prisma.threadParticipant.createMany({
      data: [
        { threadId: thread.id, userId: listing.sellerId },
        { threadId: thread.id, userId: buyer.id },
      ],
    });

    // Create sample messages
    const messages = [
      { content: 'Hi, is this item still available?', senderId: buyer.id },
      { content: 'Yes, it\'s still available. Are you interested?', senderId: listing.sellerId },
      { content: 'Yes, I would like to see it. Can we meet?', senderId: buyer.id },
      { content: 'Sure! When would be convenient for you?', senderId: listing.sellerId },
      { content: 'How about tomorrow at 2 PM?', senderId: buyer.id },
      { content: 'Perfect! I\'ll send you the location details.', senderId: listing.sellerId },
    ];

    for (const messageData of messages) {
      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderId: messageData.senderId,
          content: messageData.content,
        },
      });
    }

    createdThreads.push(thread);
  }

  // Create sample reviews
  console.log('⭐ Creating sample reviews...');
  for (const listing of createdListings.slice(0, 20)) { // Limit to first 20 listings
    const reviewer = testUsers.find(user => user.id !== listing.sellerId);
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
  for (const listing of createdListings.slice(0, 30)) { // Limit to first 30 listings
    const favoriter = testUsers.find(user => user.id !== listing.sellerId);
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
    const numViews = Math.floor(Math.random() * 30) + 10; // 10-40 views
    
    for (let i = 0; i < numViews; i++) {
      const viewerId = Math.random() > 0.4 ? testUsers[i % testUsers.length].id : null;
      
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
  for (const user of testUsers) {
    const notifications = [
      {
        type: 'LISTING_VIEW',
        title: 'Your listing received a new view',
        message: 'Someone viewed your listing',
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
      },
      {
        type: 'NEW_REVIEW',
        title: 'New review received',
        message: 'Someone left a review for your listing',
        data: { listingId: 1 }
      },
      {
        type: 'LISTING_EXPIRING',
        title: 'Listing expiring soon',
        message: 'Your listing will expire in 3 days',
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
          read: Math.random() > 0.6, // Randomly mark some as read
        },
      });
    }
  }

  console.log('\n🎉 Comprehensive test data created successfully!');
  console.log('\n📊 Created Data Summary:');
  console.log(`   👤 Users: ${testUsers.length}`);
  console.log(`   📦 Listings: ${createdListings.length}`);
  console.log(`   💬 Threads: ${createdThreads.length}`);
  console.log(`   ⭐ Reviews: ${Math.min(createdListings.length, 20)}`);
  console.log(`   ❤️ Favorites: ${Math.min(createdListings.length, 30)}`);
  console.log(`   👁️ Views: ~${createdListings.length * 25}`);
  console.log(`   🔔 Notifications: ${testUsers.length * 5}`);

  console.log('\n🌍 All listings are located in Syria:');
  syriaCities.forEach(city => {
    console.log(`   📍 ${city.name}`);
  });

  console.log('\n🔐 Test data includes:');
  console.log('   ✅ At least 2 items per subcategory per user');
  console.log('   ✅ Syria locations only');
  console.log('   ✅ Sample listings with images');
  console.log('   ✅ Reviews and ratings');
  console.log('   ✅ Favorites and interactions');
  console.log('   ✅ View tracking data');
  console.log('   ✅ Messaging threads');
  console.log('   ✅ Sample notifications');
  console.log('   ✅ Ready for comprehensive testing');

  return { users: testUsers, listings: createdListings, threads: createdThreads };
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
