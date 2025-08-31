import { PrismaClient, UserRole, ListingStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// Sample product data for different categories
const productData = {
  'real-estate': [
    { title: 'Modern 2BR Apartment in City Center', price: 250000, description: 'Beautiful modern apartment with city views' },
    { title: 'Luxury Villa with Pool', price: 850000, description: 'Spacious villa with private pool and garden' },
    { title: 'Commercial Office Space', price: 450000, description: 'Prime office space in business district' },
    { title: 'Residential Land Plot', price: 180000, description: 'Ready to build residential land' },
    { title: 'Retail Shop Space', price: 320000, description: 'High-traffic retail location' },
    { title: 'Industrial Warehouse', price: 680000, description: 'Large warehouse with loading dock' },
    { title: 'Beachfront Vacation Rental', price: 420000, description: 'Tourist property with ocean views' },
    { title: 'Studio Apartment', price: 120000, description: 'Cozy studio perfect for singles' },
    { title: 'Family House with Garden', price: 380000, description: '3BR house with large backyard' },
    { title: 'Penthouse Suite', price: 750000, description: 'Luxury penthouse with rooftop terrace' }
  ],
  'vehicles': [
    { title: 'Toyota Camry 2020', price: 25000, description: 'Well-maintained sedan with low mileage' },
    { title: 'Honda Motorcycle 2021', price: 8500, description: 'Sport motorcycle in excellent condition' },
    { title: 'Ford F-150 Pickup Truck', price: 35000, description: 'Reliable work truck with towing capacity' },
    { title: 'John Deere Tractor', price: 45000, description: 'Agricultural tractor for farming' },
    { title: 'Luxury Yacht 40ft', price: 250000, description: 'Beautiful yacht for marine adventures' },
    { title: 'BMW X5 SUV', price: 42000, description: 'Luxury SUV with premium features' },
    { title: 'Harley Davidson Motorcycle', price: 18000, description: 'Classic Harley in mint condition' },
    { title: 'Commercial Delivery Van', price: 28000, description: 'Perfect for business delivery' },
    { title: 'Electric Scooter', price: 1200, description: 'Eco-friendly urban transportation' },
    { title: 'Boat Trailer', price: 3500, description: 'Heavy-duty trailer for boats' }
  ],
  'electronics': [
    { title: 'Samsung 65" Smart TV', price: 1200, description: '4K Ultra HD Smart Television' },
    { title: 'LG Refrigerator', price: 800, description: 'French door refrigerator with ice maker' },
    { title: 'Samsung Washing Machine', price: 650, description: 'Front-load washer with steam function' },
    { title: 'Bosch Microwave Oven', price: 200, description: 'Built-in microwave with convection' },
    { title: 'Dyson Vacuum Cleaner', price: 400, description: 'Cordless stick vacuum with HEPA filter' },
    { title: 'Canon EOS Camera', price: 1200, description: 'Professional DSLR camera with lens' },
    { title: 'PlayStation 5 Console', price: 500, description: 'Latest gaming console with controller' },
    { title: 'LG Air Conditioner', price: 350, description: 'Split AC unit with remote control' },
    { title: 'Water Heater Tank', price: 280, description: '50-gallon electric water heater' },
    { title: 'Bose Sound System', price: 600, description: 'Premium audio system with subwoofer' }
  ],
  'furniture': [
    { title: 'Queen Size Bed Frame', price: 450, description: 'Modern wooden bed frame with headboard' },
    { title: 'Leather Living Room Set', price: 1200, description: '3-seater sofa with matching chairs' },
    { title: 'Dining Table Set', price: 800, description: '6-person dining table with chairs' },
    { title: 'Kids Bunk Bed', price: 350, description: 'Twin over twin bunk bed for children' },
    { title: 'Office Desk Chair', price: 200, description: 'Ergonomic office chair with lumbar support' },
    { title: 'Garden Patio Set', price: 600, description: 'Outdoor furniture set with umbrella' },
    { title: 'Chandelier Light Fixture', price: 300, description: 'Crystal chandelier for dining room' },
    { title: 'Bookshelf Unit', price: 180, description: '5-shelf bookcase in dark wood' },
    { title: 'Coffee Table', price: 250, description: 'Glass top coffee table with metal legs' },
    { title: 'Wardrobe Cabinet', price: 400, description: 'Large wardrobe with mirror doors' }
  ],
  'phones-accessories': [
    { title: 'iPhone 15 Pro', price: 1200, description: 'Latest iPhone with 256GB storage' },
    { title: 'iPad Pro 12.9"', price: 1100, description: 'Apple iPad Pro with M2 chip' },
    { title: 'Apple Watch Series 9', price: 400, description: 'Smartwatch with health monitoring' },
    { title: 'Anker Power Bank', price: 50, description: '20000mAh portable charger' },
    { title: 'iPhone Case Collection', price: 30, description: 'Premium protective phone cases' },
    { title: 'AirPods Pro', price: 250, description: 'Wireless earbuds with noise cancellation' },
    { title: 'Fast Charging Cable Set', price: 25, description: 'USB-C and Lightning cables' },
    { title: 'Premium Phone Number', price: 500, description: 'Memorable phone number for business' }
  ],
  'computers-accessories': [
    { title: 'MacBook Pro 16"', price: 2500, description: 'Apple MacBook Pro with M2 chip' },
    { title: 'Dell Desktop Computer', price: 1200, description: 'Gaming desktop with RTX graphics' },
    { title: 'Samsung 27" Monitor', price: 300, description: '4K monitor for professional use' },
    { title: 'Logitech Gaming Mouse', price: 80, description: 'High-precision gaming mouse' },
    { title: 'Logitech Webcam', price: 120, description: '4K webcam for video conferencing' },
    { title: 'Mechanical Keyboard', price: 150, description: 'RGB mechanical gaming keyboard' },
    { title: 'HP Laser Printer', price: 200, description: 'All-in-one printer with scanner' },
    { title: 'Computer Speakers', price: 100, description: '2.1 speaker system with subwoofer' },
    { title: 'WiFi Router', price: 80, description: 'High-speed wireless router' },
    { title: 'Adobe Creative Suite', price: 600, description: 'Software license for design work' }
  ],
  'childrens-world': [
    { title: 'Kids Winter Jacket', price: 45, description: 'Warm winter jacket for children' },
    { title: 'Baby Stroller', price: 200, description: 'Lightweight stroller with canopy' },
    { title: 'Car Seat for Toddler', price: 150, description: 'Safety car seat with 5-point harness' },
    { title: 'Educational Toy Set', price: 35, description: 'Learning toys for early development' },
    { title: 'Children\'s Book Collection', price: 25, description: 'Set of classic children\'s books' },
    { title: 'Baby Care Kit', price: 40, description: 'Complete baby care essentials' },
    { title: 'Organic Baby Food', price: 30, description: 'Natural baby food variety pack' }
  ],
  'clothing': [
    { title: 'Men\'s Business Suit', price: 300, description: 'Professional business suit set' },
    { title: 'Women\'s Designer Dress', price: 180, description: 'Elegant evening dress' },
    { title: 'Kids School Uniform', price: 60, description: 'Complete school uniform set' },
    { title: 'Leather Handbag', price: 120, description: 'Genuine leather designer handbag' },
    { title: 'Luxury Watch', price: 800, description: 'Swiss-made luxury timepiece' },
    { title: 'Designer Sunglasses', price: 200, description: 'Premium brand sunglasses' }
  ],
  'jobs': [
    { title: 'Software Developer Position', price: 0, description: 'Full-stack developer job opportunity' },
    { title: 'Marketing Manager Role', price: 0, description: 'Senior marketing position available' },
    { title: 'Graphic Designer Portfolio', price: 0, description: 'Creative designer seeking projects' }
  ],
  'solar-energy': [
    { title: 'Solar Panel Kit 5kW', price: 8000, description: 'Complete solar panel system' },
    { title: 'Solar Inverter', price: 1200, description: 'High-efficiency solar inverter' },
    { title: 'Solar Battery Bank', price: 2500, description: 'Deep cycle solar batteries' },
    { title: 'Solar Charge Controller', price: 300, description: 'MPPT charge controller' },
    { title: 'Solar Installation Service', price: 1500, description: 'Professional installation service' }
  ],
  'services-businesses': [
    { title: 'House Cleaning Service', price: 100, description: 'Professional house cleaning' },
    { title: 'Car Repair Service', price: 200, description: 'Complete automotive repair' },
    { title: 'Business Consulting', price: 500, description: 'Professional business consulting' },
    { title: 'IT Support Service', price: 150, description: '24/7 IT technical support' },
    { title: 'Online Tutoring', price: 50, description: 'Personalized online tutoring' }
  ],
  'handicrafts': [
    { title: 'Handmade Jewelry Set', price: 80, description: 'Unique handmade jewelry' },
    { title: 'Wooden Craft Box', price: 45, description: 'Hand-carved wooden box' },
    { title: 'Ceramic Vase', price: 35, description: 'Handcrafted ceramic vase' },
    { title: 'Leather Wallet', price: 60, description: 'Handmade leather wallet' },
    { title: 'Natural Soap Set', price: 25, description: 'Organic handmade soaps' }
  ],
  'building-materials': [
    { title: 'Cement Bags (50kg)', price: 15, description: 'Portland cement for construction' },
    { title: 'Steel Rebar Set', price: 200, description: 'Construction steel reinforcement' },
    { title: 'Concrete Blocks', price: 2, description: 'Building blocks for walls' },
    { title: 'Ceramic Tiles', price: 25, description: 'Floor and wall tiles' },
    { title: 'Paint Cans Set', price: 80, description: 'Interior and exterior paint' }
  ],
  'industrial-equipment': [
    { title: 'Industrial Welding Machine', price: 2500, description: 'Professional welding equipment' },
    { title: 'Forklift Truck', price: 15000, description: 'Used forklift in good condition' },
    { title: 'Industrial Generator', price: 8000, description: 'Backup power generator' },
    { title: 'Air Compressor', price: 1200, description: 'Industrial air compressor' },
    { title: 'Safety Equipment Set', price: 300, description: 'Complete safety gear' }
  ],
  'sports-equipment': [
    { title: 'Treadmill Exercise Machine', price: 800, description: 'Home fitness treadmill' },
    { title: 'Basketball Set', price: 150, description: 'Portable basketball hoop' },
    { title: 'Tennis Racket Set', price: 120, description: 'Professional tennis equipment' },
    { title: 'Camping Tent', price: 200, description: '4-person camping tent' },
    { title: 'Scuba Diving Gear', price: 600, description: 'Complete diving equipment' }
  ],
  'musical-equipment': [
    { title: 'Acoustic Guitar', price: 300, description: 'Quality acoustic guitar' },
    { title: 'Digital Piano', price: 800, description: '88-key digital piano' },
    { title: 'Drum Set', price: 500, description: 'Complete drum kit' },
    { title: 'Guitar Amplifier', price: 200, description: 'Electric guitar amplifier' },
    { title: 'Microphone Set', price: 150, description: 'Professional microphone kit' }
  ],
  'animals': [
    { title: 'Golden Retriever Puppy', price: 800, description: 'Purebred golden retriever' },
    { title: 'Persian Cat', price: 400, description: 'Beautiful Persian cat' },
    { title: 'Parrot Cage Set', price: 120, description: 'Large bird cage with accessories' },
    { title: 'Pet Food Supply', price: 50, description: 'Premium pet food variety pack' }
  ],
  'medical-supplies': [
    { title: 'Blood Pressure Monitor', price: 80, description: 'Digital blood pressure device' },
    { title: 'Wheelchair', price: 300, description: 'Lightweight wheelchair' },
    { title: 'First Aid Kit', price: 45, description: 'Complete first aid supplies' },
    { title: 'Medical Scale', price: 120, description: 'Digital medical scale' }
  ],
  'foodstuffs': [
    { title: 'Fresh Organic Vegetables', price: 25, description: 'Farm fresh organic produce' },
    { title: 'Premium Beef Cuts', price: 60, description: 'High-quality beef selection' },
    { title: 'Artisan Cheese Set', price: 35, description: 'Gourmet cheese variety' },
    { title: 'Fresh Baked Bread', price: 8, description: 'Artisan bread selection' },
    { title: 'Organic Juice Set', price: 20, description: 'Fresh organic juices' }
  ]
};

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Create users
  const user10Password = await argon2.hash('Squirrel.123');
  const user11Password = await argon2.hash('Squirrel.123');

  const user10 = await prisma.user.upsert({
    where: { email: 'pratomoadhe+10@gmail.com' },
    update: {},
    create: {
      email: 'pratomoadhe+10@gmail.com',
      passwordHash: user10Password,
      name: 'User10 test',
      role: UserRole.USER,
      emailVerified: true,
    },
  });

  const user11 = await prisma.user.upsert({
    where: { email: 'pratomoadhe+11@gmail.com' },
    update: {},
    create: {
      email: 'pratomoadhe+11@gmail.com',
      passwordHash: user11Password,
      name: 'User11 test',
      role: UserRole.USER,
      emailVerified: true,
    },
  });

  console.log('✅ Users created successfully');

  // New Categories from user
  const newCategoryData = [
      {
        name: 'Real Estate',
        subcategories: [
          'Apartments',
          'Houses',
          'Land',
          'Shops and offices',
          'Factory and workshops',
          'Tourist properties'
        ]
      },
      {
        name: 'Vehicles',
        subcategories: [
          'Cars',
          'Motorcycles',
          'Trucks and Commercial Vehicles',
          'Agricultural and Industrial Vehicles',
          'Marine Vehicles'
        ]
      },
      {
        name: 'Electronics',
        subcategories: [
          'Televisions',
          'Refrigerators and Freezers',
          'Washing Machines & Dryers',
          'Ovens and Microwaves',
          'Vacuum Cleaners',
          'Cameras',
          'Video Games',
          'Air Conditioners',
          'Water Heaters',
          'Audio Equipment',
          'E-Books',
          'Security and Surveillance Systems',
          'Home and Kitchen Appliances',
          'Uncategorized Appliances'
        ]
      },
      {
        name: 'Furniture',
        subcategories: [
          'Bedrooms',
          'Living Rooms',
          'Dining Rooms',
          'Kids\' Rooms',
          'Guest Rooms',
          'Office Furniture',
          'Garden Furniture',
          'Lighting and Décor'
        ]
      },
      {
        name: 'Phones and Accessories',
        subcategories: [
          'Mobile Phones',
          'iPads',
          'Smart Watches',
          'Power bank',
          'Mobile covers',
          'Headphones',
          'Chargers',
          'Phone Numbers',
          'Spare Parts'
        ]
      },
      {
        name: 'Computers and Accessories',
        subcategories: [
          'Laptops',
          'Desktop Computers',
          'Monitors',
          'Mouses',
          'Cameras',
          'Keyboards',
          'Printers and Scanners',
          'Audio',
          'Networks and Communications',
          'Software',
          'Computer Hardware',
          'Gaming Consoles (PlayStation)'
        ]
      },
      {
        name: "Children's World",
        subcategories: [
          'Clothing & Shoes',
          'Strollers',
          'Car Seats',
          'Toys',
          'Books',
          'Health and Care',
          'Nutrition',
          'Uncategorized'
        ]
      },
      {
        name: 'Clothing',
        subcategories: [
          'Men\'s Clothing',
          'Women\'s Clothing',
          'children\'s clothing',
          'Bags',
          'Watches and Jewelry',
          'Other'
        ]
      },
      {
        name: 'Jobs',
        subcategories: [
          'Job Vacancies',
          'searching for Job'
        ]
      },
      {
        name: 'Solar Energy',
        subcategories: [
          'Solar Panels',
          'Inverters',
          'Batteries',
          'Charge Controllers',
          'Cables and Accessories',
          'Turnkey Systems',
          'Services'
        ]
      },
      {
        name: 'Services and Businesses',
        subcategories: [
          'Home Services',
          'Car Services',
          'Business and Corporate Services',
          'Technical Services',
          'Education/Courses',
          'Medical and Healthcare Services',
          'Transportation and Logistics',
          'Miscellaneous Services',
          'Other'
        ]
      },
      {
        name: 'Handicrafts',
        subcategories: [
          'Textiles and Fabrics',
          'Accessories and Jewelry',
          'Wood Products',
          'Pottery and Ceramics',
          'Glass and Metals',
          'Leatherware',
          'Natural and healthy products'
        ]
      },
      {
        name: 'Building Materials',
        subcategories: [
          'Basic Materials',
          'Cladding and Finishing Materials',
          'Tools and Equipment',
          'Wood and Wood Derivatives',
          'Sanitary Ware and Plumbing',
          'Electrical and Lighting',
          'Glass and Aluminum'
        ]
      },
      {
        name: 'Industrial Equipment',
        subcategories: [
          'Workshop Equipment',
          'Restaurant and Cafe Equipment',
          'Bakery Equipment',
          'Construction and Heavy Industry Equipment',
          'Agricultural and Industrial Equipment',
          'Production Lines',
          'Industrial Safety Equipment',
          'General Equipment',
          'Spare Parts and Maintenance',
          'Generators',
          'Industrial Textile and Sewing Machines',
          'Unclassified Equipment'
        ]
      },
      {
        name: 'Sports Equipment',
        subcategories: [
          'Bodybuilding and Fitness Equipment',
          'Individual Sports Equipment',
          'Martial Arts and Martial Arts Equipment',
          'Outdoor Sports Equipment',
          'Sports Accessories'
        ]
      },
      {
        name: 'Musical Equipment',
        subcategories: [
          'Stringed Instruments',
          'Percussion Instruments',
          'Wind Instruments',
          'Keyboard Instruments',
          'Recording Equipment',
          'Accessories'
        ]
      },
      {
        name: 'Animals',
        subcategories: [
          'Pets',
          'Farm Animals',
          'Animal Supplies',
          'Animal Services'
        ]
      },
      {
        name: 'Medical Supplies',
        subcategories: [
          'Medical Devices',
          'Medical Instruments',
          'Consumables Laboratory',
          'Supplies Medical',
          'Beds and Chairs'
        ]
      },
      {
        name: 'Foodstuffs',
        subcategories: [
          'Basic Ingredients',
          'Oils and Fats',
          'Canned Foods',
          'Beverages',
          'Dairy Products',
          'Meat, Poultry, and Fish',
          'Vegetables and Fruits',
          'Unclassified Products'
        ]
      }
    ];

    const categories = newCategoryData.map(c => ({
      name: c.name,
      slug: slugify(c.name),
      subcategories: c.subcategories.map(s => ({ name: s, slug: slugify(s) })),
    }));


  // Create all categories and subcategories
  /*
  const categories = [
    {
      name: 'Real Estate',
      slug: 'real-estate',
      subcategories: [
        { name: 'Apartments', slug: 'apartments' },
        { name: 'Houses', slug: 'houses' },
        { name: 'Land', slug: 'land' },
        { name: 'Shops and Offices', slug: 'shops-offices' },
        { name: 'Factory and Workshops', slug: 'factory-workshops' },
        { name: 'Tourist Properties', slug: 'tourist-properties' }
      ]
    },
    {
      name: 'Vehicles',
      slug: 'vehicles',
      subcategories: [
        { name: 'Cars', slug: 'cars' },
        { name: 'Motorcycles', slug: 'motorcycles' },
        { name: 'Trucks and Commercial Vehicles', slug: 'trucks-commercial' },
        { name: 'Agricultural and Industrial Vehicles', slug: 'agricultural-industrial' },
        { name: 'Marine Vehicles', slug: 'marine-vehicles' }
      ]
    },
    {
      name: 'Electronics',
      slug: 'electronics',
      subcategories: [
        { name: 'Televisions', slug: 'televisions' },
        { name: 'Refrigerators and Freezers', slug: 'refrigerators-freezers' },
        { name: 'Washing Machines & Dryers', slug: 'washing-machines-dryers' },
        { name: 'Ovens and Microwaves', slug: 'ovens-microwaves' },
        { name: 'Vacuum Cleaners', slug: 'vacuum-cleaners' },
        { name: 'Cameras', slug: 'cameras' },
        { name: 'Video Games', slug: 'video-games' },
        { name: 'Air Conditioners', slug: 'air-conditioners' },
        { name: 'Water Heaters', slug: 'water-heaters' },
        { name: 'Audio Equipment', slug: 'audio-equipment' },
        { name: 'E-Books', slug: 'e-books' },
        { name: 'Security and Surveillance Systems', slug: 'security-surveillance' },
        { name: 'Home and Kitchen Appliances', slug: 'home-kitchen-appliances' },
        { name: 'Uncategorized Appliances', slug: 'uncategorized-appliances' }
      ]
    },
    {
      name: 'Furniture',
      slug: 'furniture',
      subcategories: [
        { name: 'Bedrooms', slug: 'bedrooms' },
        { name: 'Living Rooms', slug: 'living-rooms' },
        { name: 'Dining Rooms', slug: 'dining-rooms' },
        { name: 'Kids\' Rooms', slug: 'kids-rooms' },
        { name: 'Guest Rooms', slug: 'guest-rooms' },
        { name: 'Office Furniture', slug: 'office-furniture' },
        { name: 'Garden Furniture', slug: 'garden-furniture' },
        { name: 'Lighting and Decor', slug: 'lighting-decor' }
      ]
    },
    {
      name: 'Phones and Accessories',
      slug: 'phones-accessories',
      subcategories: [
        { name: 'Mobile Phones', slug: 'mobile-phones' },
        { name: 'iPads', slug: 'ipads' },
        { name: 'Smart Watches', slug: 'smart-watches' },
        { name: 'Power Bank', slug: 'power-bank' },
        { name: 'Mobile Covers', slug: 'mobile-covers' },
        { name: 'Headphones', slug: 'headphones' },
        { name: 'Chargers', slug: 'chargers' },
        { name: 'Phone Numbers', slug: 'phone-numbers' }
      ]
    },
    {
      name: 'Computers and Accessories',
      slug: 'computers-accessories',
      subcategories: [
        { name: 'Laptops', slug: 'laptops' },
        { name: 'Desktop Computers', slug: 'desktop-computers' },
        { name: 'Monitors', slug: 'monitors' },
        { name: 'Mouses', slug: 'mouses' },
        { name: 'Cameras', slug: 'computer-cameras' },
        { name: 'Keyboards', slug: 'keyboards' },
        { name: 'Printers and Scanners', slug: 'printers-scanners' },
        { name: 'Audio', slug: 'computer-audio' },
        { name: 'Networks and Communications', slug: 'networks-communications' },
        { name: 'Software', slug: 'software' },
        { name: 'Computer Hardware', slug: 'computer-hardware' },
        { name: 'Gaming Consoles (PlayStation)', slug: 'gaming-consoles' }
      ]
    },
    {
      name: "Children's World",
      slug: 'childrens-world',
      subcategories: [
        { name: 'Clothing & Shoes', slug: 'clothing-shoes' },
        { name: 'Strollers', slug: 'strollers' },
        { name: 'Car Seats', slug: 'car-seats' },
        { name: 'Toys', slug: 'toys' },
        { name: 'Books', slug: 'books' },
        { name: 'Health and Care', slug: 'health-care' },
        { name: 'Nutrition', slug: 'nutrition' },
        { name: 'Uncategorized', slug: 'children-uncategorized' }
      ]
    },
    {
      name: 'Clothing',
      slug: 'clothing',
      subcategories: [
        { name: 'Men\'s Clothing', slug: 'mens-clothing' },
        { name: 'Women\'s Clothing', slug: 'womens-clothing' },
        { name: 'Children\'s Clothing', slug: 'childrens-clothing' },
        { name: 'Bags', slug: 'bags' },
        { name: 'Watches and Jewelry', slug: 'watches-jewelry' },
        { name: 'Other', slug: 'clothing-other' }
      ]
    },
    {
      name: 'Jobs',
      slug: 'jobs',
      subcategories: [
        { name: 'Job Vacancies', slug: 'job-vacancies' },
        { name: 'Searching for Job', slug: 'searching-for-job' }
      ]
    },
    {
      name: 'Solar Energy',
      slug: 'solar-energy',
      subcategories: [
        { name: 'Solar Panels', slug: 'solar-panels' },
        { name: 'Inverters', slug: 'inverters' },
        { name: 'Batteries', slug: 'batteries' },
        { name: 'Charge Controllers', slug: 'charge-controllers' },
        { name: 'Cables and Accessories', slug: 'cables-accessories' },
        { name: 'Turnkey Systems', slug: 'turnkey-systems' },
        { name: 'Services', slug: 'solar-services' }
      ]
    },
    {
      name: 'Services and Businesses',
      slug: 'services-businesses',
      subcategories: [
        { name: 'Home Services', slug: 'home-services' },
        { name: 'Car Services', slug: 'car-services' },
        { name: 'Business and Corporate Services', slug: 'business-corporate-services' },
        { name: 'Technical Services', slug: 'technical-services' },
        { name: 'Education/Courses', slug: 'education-courses' },
        { name: 'Medical and Healthcare Services', slug: 'medical-healthcare-services' },
        { name: 'Transportation and Logistics', slug: 'transportation-logistics' },
        { name: 'Miscellaneous Services', slug: 'miscellaneous-services' },
        { name: 'Other', slug: 'services-other' }
      ]
    },
    {
      name: 'Handicrafts',
      slug: 'handicrafts',
      subcategories: [
        { name: 'Textiles and Fabrics', slug: 'textiles-fabrics' },
        { name: 'Accessories and Jewelry', slug: 'accessories-jewelry' },
        { name: 'Wood Products', slug: 'wood-products' },
        { name: 'Pottery and Ceramics', slug: 'pottery-ceramics' },
        { name: 'Glass and Metals', slug: 'glass-metals' },
        { name: 'Leatherware', slug: 'leatherware' },
        { name: 'Natural and Healthy Products', slug: 'natural-healthy-products' }
      ]
    },
    {
      name: 'Building Materials',
      slug: 'building-materials',
      subcategories: [
        { name: 'Cement and Concrete', slug: 'cement-concrete' },
        { name: 'Steel and Metals', slug: 'steel-metals' },
        { name: 'Bricks and Blocks', slug: 'bricks-blocks' },
        { name: 'Tiles and Flooring', slug: 'tiles-flooring' },
        { name: 'Paint and Coatings', slug: 'paint-coatings' },
        { name: 'Plumbing and Electrical', slug: 'plumbing-electrical' },
        { name: 'Insulation and Roofing', slug: 'insulation-roofing' }
      ]
    },
    {
      name: 'Industrial Equipment',
      slug: 'industrial-equipment',
      subcategories: [
        { name: 'Manufacturing Equipment', slug: 'manufacturing-equipment' },
        { name: 'Construction Equipment', slug: 'construction-equipment' },
        { name: 'Generators and Power Equipment', slug: 'generators-power' },
        { name: 'Compressors and Pumps', slug: 'compressors-pumps' },
        { name: 'Welding Equipment', slug: 'welding-equipment' },
        { name: 'Material Handling Equipment', slug: 'material-handling' },
        { name: 'HVAC Equipment', slug: 'hvac-industrial' },
        { name: 'Testing and Measurement', slug: 'testing-measurement' },
        { name: 'Safety Equipment', slug: 'safety-equipment' },
        { name: 'Packaging Equipment', slug: 'packaging-equipment' },
        { name: 'Cleaning Equipment', slug: 'cleaning-equipment' },
        { name: 'Other Industrial Equipment', slug: 'industrial-other' }
      ]
    },
    {
      name: 'Sports Equipment',
      slug: 'sports-equipment',
      subcategories: [
        { name: 'Fitness Equipment', slug: 'fitness-equipment' },
        { name: 'Team Sports', slug: 'team-sports' },
        { name: 'Individual Sports', slug: 'individual-sports' },
        { name: 'Outdoor Sports', slug: 'outdoor-sports' },
        { name: 'Water Sports', slug: 'water-sports' }
      ]
    },
    {
      name: 'Musical Equipment',
      slug: 'musical-equipment',
      subcategories: [
        { name: 'String Instruments', slug: 'string-instruments' },
        { name: 'Wind Instruments', slug: 'wind-instruments' },
        { name: 'Percussion Instruments', slug: 'percussion-instruments' },
        { name: 'Keyboards and Pianos', slug: 'keyboards-pianos' },
        { name: 'Amplifiers and Audio', slug: 'amplifiers-audio' },
        { name: 'Music Accessories', slug: 'music-accessories' }
      ]
    },
    {
      name: 'Animals',
      slug: 'animals',
      subcategories: [
        { name: 'Dogs', slug: 'dogs' },
        { name: 'Cats', slug: 'cats' },
        { name: 'Birds', slug: 'birds' },
        { name: 'Other Animals', slug: 'other-animals' }
      ]
    },
    {
      name: 'Medical Supplies',
      slug: 'medical-supplies',
      subcategories: [
        { name: 'Medical Equipment', slug: 'medical-equipment' },
        { name: 'Personal Care', slug: 'personal-care' },
        { name: 'Mobility Aids', slug: 'mobility-aids' },
        { name: 'First Aid', slug: 'first-aid' },
        { name: 'Pharmacy Supplies', slug: 'pharmacy-supplies' }
      ]
    },
    {
      name: 'Foodstuffs',
      slug: 'foodstuffs',
      subcategories: [
        { name: 'Fresh Produce', slug: 'fresh-produce' },
        { name: 'Meat and Seafood', slug: 'meat-seafood' },
        { name: 'Dairy Products', slug: 'dairy-products' },
        { name: 'Bakery Items', slug: 'bakery-items' },
        { name: 'Beverages', slug: 'beverages' },
        { name: 'Canned and Packaged Foods', slug: 'canned-packaged' },
        { name: 'Spices and Condiments', slug: 'spices-condiments' },
        { name: 'Organic and Specialty Foods', slug: 'organic-specialty' }
      ]
    }
  ];
  */

  const createdCategories = new Map();
  const createdSubcategories = new Map();

  // Create main categories
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        path: category.slug,
        depth: 0,
      },
    });
    createdCategories.set(category.slug, createdCategory);

    // Create subcategories
    for (const subcategory of category.subcategories) {
      const createdSubcategory = await prisma.category.upsert({
        where: { slug: subcategory.slug },
        update: {},
        create: {
          name: subcategory.name,
          slug: subcategory.slug,
          parentId: createdCategory.id,
          path: `${category.slug}/${subcategory.slug}`,
          depth: 1,
        },
      });
      createdSubcategories.set(subcategory.slug, createdSubcategory);
    }
  }

  console.log('✅ Categories and subcategories created successfully');

  // Create products for each user
  const users = [user10, user11];
  let totalProducts = 0;

  for (const user of users) {
    console.log(`📦 Creating products for ${user.name}...`);
    
    for (const [categorySlug, products] of Object.entries(productData)) {
      const category = createdCategories.get(categorySlug);
      if (!category) continue;

      // Get subcategories for this category
      const subcategories = Array.from(createdSubcategories.values())
        .filter(sub => sub.parentId === category.id);

      for (let i = 0; i < Math.min(products.length, 10); i++) {
        const product = products[i];
        const subcategory = subcategories[i % subcategories.length] || category;

        const listing = await prisma.listing.create({
          data: {
            sellerId: user.id,
            title: product.title,
            description: product.description,
            price: product.price,
            currency: 'USD',
            categoryId: subcategory.id,
            city: 'Jakarta',
            latitude: -6.2088,
            longitude: 106.8456,
            status: ListingStatus.ACTIVE,
            isVip: Math.random() > 0.7,
            isFeatured: Math.random() > 0.8,
          },
        });

        // Add some sample images
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

        totalProducts++;
      }
    }
  }

  console.log('✅ Products created successfully');

  // Create sample reviews for some listings
  console.log('⭐ Creating sample reviews...');
  const listings = await prisma.listing.findMany({
    take: 20, // Get first 20 listings to add reviews to
    select: { id: true, sellerId: true }
  });

  let totalReviews = 0;
  for (const listing of listings) {
    // Create 2-5 reviews per listing
    const numReviews = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numReviews; i++) {
      // Alternate between users for reviews
      const reviewerId = i % 2 === 0 ? user10.id : user11.id;
      
      // Skip if reviewer is the same as seller
      if (reviewerId === listing.sellerId) continue;
      
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
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
          reviewerId: reviewerId,
          rating: rating,
          comment: comments[Math.floor(Math.random() * comments.length)],
        },
      });
      totalReviews++;
    }
  }

  // Create sample view tracking data
  console.log('👁️ Creating sample view tracking...');
  let totalViews = 0;
  for (const listing of listings) {
    // Create 10-50 views per listing
    const numViews = Math.floor(Math.random() * 41) + 10;
    
    for (let i = 0; i < numViews; i++) {
      // Randomly assign some views to users, some anonymous
      const viewerId = Math.random() > 0.3 ? (i % 2 === 0 ? user10.id : user11.id) : null;
      
      await prisma.listingView.create({
        data: {
          listingId: listing.id,
          viewerId: viewerId,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      totalViews++;
    }
  }

  console.log('✅ Database seeding completed!');
  console.log(`👤 User10: pratomoadhe+10@gmail.com / Squirrel.123`);
  console.log(`👤 User11: pratomoadhe+11@gmail.com / Squirrel.123`);
  console.log(`📦 Total products created: ${totalProducts}`);
  console.log(`⭐ Total reviews created: ${totalReviews}`);
  console.log(`👁️ Total views tracked: ${totalViews}`);
  console.log(`📁 Categories created: ${categories.length} main categories with subcategories`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
