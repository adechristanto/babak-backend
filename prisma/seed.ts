import {
  PrismaClient,
  UserRole,
  ListingStatus,
  ListingCondition,
  NegotiableStatus,
  AttributeType,
  AttributeDataType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Syria cities and coordinates
const syriaCities = [
  { name: 'Damascus', lat: 33.5138, lng: 36.2765 },
  { name: 'Aleppo', lat: 36.2021, lng: 37.1343 },
  { name: 'Homs', lat: 34.7324, lng: 36.7137 },
  { name: 'Latakia', lat: 35.5407, lng: 35.7828 },
  { name: 'Hama', lat: 35.1318, lng: 36.7578 },
  { name: 'Tartus', lat: 34.895, lng: 35.8867 },
  { name: 'Deir ez-Zor', lat: 35.3333, lng: 40.15 },
  { name: 'Al-Hasakah', lat: 36.5119, lng: 40.7422 },
  { name: 'Idlib', lat: 35.9306, lng: 36.6339 },
  { name: 'Daraa', lat: 32.6189, lng: 36.1025 },
];

// Function to get random Syrian city
function getRandomSyrianCity() {
  return syriaCities[Math.floor(Math.random() * syriaCities.length)];
}

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
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Home and office furniture',
    icon: '🪑',
    subcategories: [
      {
        id: 'bedrooms',
        name: 'Bedrooms',
        description: 'Bedroom furniture and accessories',
      },
      {
        id: 'living-rooms',
        name: 'Living Rooms',
        description: 'Living room furniture',
      },
      {
        id: 'dining-rooms',
        name: 'Dining Rooms',
        description: 'Dining room furniture',
      },
      {
        id: 'kids-rooms',
        name: "Kids' Rooms",
        description: "Children's furniture",
      },
      {
        id: 'guest-rooms',
        name: 'Guest Rooms',
        description: 'Guest room furniture',
      },
      {
        id: 'office-furniture',
        name: 'Office Furniture',
        description: 'Office and business furniture',
      },
      {
        id: 'garden-furniture',
        name: 'Garden Furniture',
        description: 'Outdoor and garden furniture',
      },
      {
        id: 'lighting-decor',
        name: 'Lighting and Decor',
        description: 'Lighting fixtures and decorative items',
      },
    ],
  },
  {
    id: 'phones-accessories',
    name: 'Phones and Accessories',
    description: 'Mobile phones and accessories',
    icon: '📱',
    subcategories: [
      {
        id: 'mobile-phones',
        name: 'Mobile Phones',
        description: 'Smartphones and feature phones',
      },
      { id: 'ipads', name: 'iPads', description: 'Apple iPad tablets' },
      {
        id: 'smart-watches',
        name: 'Smart Watches',
        description: 'Smartwatches and fitness trackers',
      },
      {
        id: 'power-bank',
        name: 'Power Bank',
        description: 'Portable charging devices',
      },
      {
        id: 'mobile-covers',
        name: 'Mobile Covers',
        description: 'Phone cases and covers',
      },
      {
        id: 'headphones',
        name: 'Headphones',
        description: 'Headphones and earphones',
      },
      {
        id: 'chargers',
        name: 'Chargers',
        description: 'Phone chargers and cables',
      },
      {
        id: 'phone-numbers',
        name: 'Phone Numbers',
        description: 'Phone number services',
      },
    ],
  },
  {
    id: 'computers-accessories',
    name: 'Computers and Accessories',
    description: 'Computers and computer accessories',
    icon: '💻',
    subcategories: [
      { id: 'laptops', name: 'Laptops', description: 'Laptop computers' },
      {
        id: 'desktop-computers',
        name: 'Desktop Computers',
        description: 'Desktop PC systems',
      },
      {
        id: 'monitors',
        name: 'Monitors',
        description: 'Computer monitors and displays',
      },
      {
        id: 'mouses',
        name: 'Mouses',
        description: 'Computer mice and pointing devices',
      },
      {
        id: 'computer-cameras',
        name: 'Cameras',
        description: 'Webcams and computer cameras',
      },
      { id: 'keyboards', name: 'Keyboards', description: 'Computer keyboards' },
      {
        id: 'printers-scanners',
        name: 'Printers and Scanners',
        description: 'Printing and scanning devices',
      },
      {
        id: 'computer-audio',
        name: 'Audio',
        description: 'Computer speakers and audio equipment',
      },
      {
        id: 'networks-communications',
        name: 'Networks and Communications',
        description: 'Networking equipment',
      },
      {
        id: 'software',
        name: 'Software',
        description: 'Computer software and licenses',
      },
      {
        id: 'computer-hardware',
        name: 'Computer Hardware',
        description: 'PC components and parts',
      },
      {
        id: 'gaming-consoles',
        name: 'Gaming Consoles (PlayStation)',
        description: 'Gaming consoles and accessories',
      },
    ],
  },
  {
    id: 'childrens-world',
    name: "Children's World",
    description: 'Products for babies and children',
    icon: '🧸',
    subcategories: [
      {
        id: 'clothing-shoes',
        name: 'Clothing & Shoes',
        description: "Children's clothing and footwear",
      },
      {
        id: 'strollers',
        name: 'Strollers',
        description: 'Baby strollers and pushchairs',
      },
      {
        id: 'car-seats',
        name: 'Car Seats',
        description: 'Child car seats and boosters',
      },
      { id: 'toys', name: 'Toys', description: "Children's toys and games" },
      {
        id: 'books',
        name: 'Books',
        description: "Children's books and educational materials",
      },
      {
        id: 'health-care',
        name: 'Health and Care',
        description: 'Baby health and care products',
      },
      {
        id: 'nutrition',
        name: 'Nutrition',
        description: 'Baby food and nutrition products',
      },
      {
        id: 'children-uncategorized',
        name: 'Uncategorized',
        description: "Other children's products",
      },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Fashion and apparel',
    icon: '👔',
    subcategories: [
      {
        id: 'mens-clothing',
        name: "Men's Clothing",
        description: "Men's fashion and apparel",
      },
      {
        id: 'womens-clothing',
        name: "Women's Clothing",
        description: "Women's fashion and apparel",
      },
      {
        id: 'childrens-clothing',
        name: "Children's Clothing",
        description: "Children's fashion and apparel",
      },
      {
        id: 'bags',
        name: 'Bags',
        description: 'Handbags, backpacks, and luggage',
      },
      {
        id: 'watches-jewelry',
        name: 'Watches and Jewelry',
        description: 'Watches, jewelry, and accessories',
      },
      {
        id: 'clothing-other',
        name: 'Other',
        description: 'Other clothing and fashion items',
      },
    ],
  },
  {
    id: 'jobs',
    name: 'Jobs',
    description: 'Employment opportunities',
    icon: '💼',
    subcategories: [
      {
        id: 'job-vacancies',
        name: 'Job Vacancies',
        description: 'Available job positions',
      },
      {
        id: 'searching-for-job',
        name: 'Searching for Job',
        description: 'Job seekers and resumes',
      },
    ],
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy',
    description: 'Solar energy equipment and systems',
    icon: '☀️',
    subcategories: [
      {
        id: 'solar-panels',
        name: 'Solar Panels',
        description: 'Photovoltaic solar panels',
      },
      {
        id: 'inverters',
        name: 'Inverters',
        description: 'Solar power inverters',
      },
      {
        id: 'batteries',
        name: 'Batteries',
        description: 'Solar system batteries',
      },
      {
        id: 'charge-controllers',
        name: 'Charge Controllers',
        description: 'Solar charge controllers',
      },
      {
        id: 'cables-accessories',
        name: 'Cables and Accessories',
        description: 'Solar system cables and accessories',
      },
      {
        id: 'turnkey-systems',
        name: 'Turnkey Systems',
        description: 'Complete solar energy systems',
      },
      {
        id: 'solar-services',
        name: 'Services',
        description: 'Solar installation and maintenance services',
      },
    ],
  },
  {
    id: 'services-businesses',
    name: 'Services and Businesses',
    description: 'Professional and business services',
    icon: '🔧',
    subcategories: [
      {
        id: 'home-services',
        name: 'Home Services',
        description: 'Home repair and maintenance services',
      },
      {
        id: 'car-services',
        name: 'Car Services',
        description: 'Automotive services and repairs',
      },
      {
        id: 'business-corporate-services',
        name: 'Business and Corporate Services',
        description: 'Professional business services',
      },
      {
        id: 'technical-services',
        name: 'Technical Services',
        description: 'IT and technical support services',
      },
      {
        id: 'education-courses',
        name: 'Education/Courses',
        description: 'Educational services and courses',
      },
      {
        id: 'medical-healthcare-services',
        name: 'Medical and Healthcare Services',
        description: 'Healthcare and medical services',
      },
      {
        id: 'transportation-logistics',
        name: 'Transportation and Logistics',
        description: 'Transportation and delivery services',
      },
      {
        id: 'miscellaneous-services',
        name: 'Miscellaneous Services',
        description: 'Other miscellaneous services',
      },
      {
        id: 'services-other',
        name: 'Other',
        description: 'Other services not listed',
      },
    ],
  },
  {
    id: 'handicrafts',
    name: 'Handicrafts',
    description: 'Handmade crafts and artisan products',
    icon: '🎨',
    subcategories: [
      {
        id: 'textiles-fabrics',
        name: 'Textiles and Fabrics',
        description: 'Handmade textiles and fabric products',
      },
      {
        id: 'accessories-jewelry',
        name: 'Accessories and Jewelry',
        description: 'Handmade jewelry and accessories',
      },
      {
        id: 'wood-products',
        name: 'Wood Products',
        description: 'Handmade wooden items',
      },
      {
        id: 'pottery-ceramics',
        name: 'Pottery and Ceramics',
        description: 'Handmade pottery and ceramic items',
      },
      {
        id: 'glass-metals',
        name: 'Glass and Metals',
        description: 'Handmade glass and metal crafts',
      },
      {
        id: 'leatherware',
        name: 'Leatherware',
        description: 'Handmade leather products',
      },
      {
        id: 'natural-healthy-products',
        name: 'Natural and Healthy Products',
        description: 'Natural and organic handmade products',
      },
    ],
  },
  {
    id: 'building-materials',
    name: 'Building Materials',
    description: 'Construction and building supplies',
    icon: '🧱',
    subcategories: [
      {
        id: 'cement-concrete',
        name: 'Cement and Concrete',
        description: 'Cement, concrete, and related materials',
      },
      {
        id: 'steel-metals',
        name: 'Steel and Metals',
        description: 'Steel rebar, metals, and structural materials',
      },
      {
        id: 'bricks-blocks',
        name: 'Bricks and Blocks',
        description: 'Building bricks and concrete blocks',
      },
      {
        id: 'tiles-flooring',
        name: 'Tiles and Flooring',
        description: 'Floor and wall tiles, flooring materials',
      },
      {
        id: 'paint-coatings',
        name: 'Paint and Coatings',
        description: 'Paints, primers, and protective coatings',
      },
      {
        id: 'plumbing-electrical',
        name: 'Plumbing and Electrical',
        description: 'Plumbing and electrical supplies',
      },
      {
        id: 'insulation-roofing',
        name: 'Insulation and Roofing',
        description: 'Insulation materials and roofing supplies',
      },
    ],
  },
  {
    id: 'industrial-equipment',
    name: 'Industrial Equipment',
    description: 'Industrial machinery and equipment',
    icon: '⚙️',
    subcategories: [
      {
        id: 'manufacturing-equipment',
        name: 'Manufacturing Equipment',
        description: 'Industrial manufacturing machinery',
      },
      {
        id: 'construction-equipment',
        name: 'Construction Equipment',
        description: 'Heavy construction machinery',
      },
      {
        id: 'generators-power',
        name: 'Generators and Power Equipment',
        description: 'Power generation equipment',
      },
      {
        id: 'compressors-pumps',
        name: 'Compressors and Pumps',
        description: 'Industrial compressors and pumps',
      },
      {
        id: 'welding-equipment',
        name: 'Welding Equipment',
        description: 'Welding tools and equipment',
      },
      {
        id: 'material-handling',
        name: 'Material Handling Equipment',
        description: 'Forklifts, conveyors, and handling equipment',
      },
      {
        id: 'hvac-industrial',
        name: 'HVAC Equipment',
        description: 'Industrial heating, ventilation, and cooling',
      },
      {
        id: 'testing-measurement',
        name: 'Testing and Measurement',
        description: 'Industrial testing and measurement tools',
      },
      {
        id: 'safety-equipment',
        name: 'Safety Equipment',
        description: 'Industrial safety gear and equipment',
      },
      {
        id: 'packaging-equipment',
        name: 'Packaging Equipment',
        description: 'Industrial packaging machinery',
      },
      {
        id: 'cleaning-equipment',
        name: 'Cleaning Equipment',
        description: 'Industrial cleaning machinery',
      },
      {
        id: 'industrial-other',
        name: 'Other Industrial Equipment',
        description: 'Other industrial machinery and tools',
      },
    ],
  },
  {
    id: 'sports-equipment',
    name: 'Sports Equipment',
    description: 'Sports and fitness equipment',
    icon: '⚽',
    subcategories: [
      {
        id: 'fitness-equipment',
        name: 'Fitness Equipment',
        description: 'Gym and fitness equipment',
      },
      {
        id: 'team-sports',
        name: 'Team Sports',
        description: 'Equipment for team sports',
      },
      {
        id: 'individual-sports',
        name: 'Individual Sports',
        description: 'Equipment for individual sports',
      },
      {
        id: 'outdoor-sports',
        name: 'Outdoor Sports',
        description: 'Outdoor and adventure sports equipment',
      },
      {
        id: 'water-sports',
        name: 'Water Sports',
        description: 'Water sports equipment',
      },
    ],
  },
  {
    id: 'musical-equipment',
    name: 'Musical Equipment',
    description: 'Musical instruments and audio equipment',
    icon: '🎵',
    subcategories: [
      {
        id: 'string-instruments',
        name: 'String Instruments',
        description: 'Guitars, violins, and string instruments',
      },
      {
        id: 'wind-instruments',
        name: 'Wind Instruments',
        description: 'Woodwind and brass instruments',
      },
      {
        id: 'percussion-instruments',
        name: 'Percussion Instruments',
        description: 'Drums and percussion equipment',
      },
      {
        id: 'keyboards-pianos',
        name: 'Keyboards and Pianos',
        description: 'Piano and keyboard instruments',
      },
      {
        id: 'amplifiers-audio',
        name: 'Amplifiers and Audio',
        description: 'Musical amplifiers and audio equipment',
      },
      {
        id: 'music-accessories',
        name: 'Music Accessories',
        description: 'Musical accessories and parts',
      },
    ],
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Pets and animals',
    icon: '🐕',
    subcategories: [
      { id: 'dogs', name: 'Dogs', description: 'Dogs and dog supplies' },
      { id: 'cats', name: 'Cats', description: 'Cats and cat supplies' },
      { id: 'birds', name: 'Birds', description: 'Birds and bird supplies' },
      {
        id: 'other-animals',
        name: 'Other Animals',
        description: 'Other pets and animal supplies',
      },
    ],
  },
  {
    id: 'medical-supplies',
    name: 'Medical Supplies',
    description: 'Medical equipment and healthcare supplies',
    icon: '🏥',
    subcategories: [
      {
        id: 'medical-equipment',
        name: 'Medical Equipment',
        description: 'Professional medical equipment',
      },
      {
        id: 'personal-care',
        name: 'Personal Care',
        description: 'Personal healthcare products',
      },
      {
        id: 'mobility-aids',
        name: 'Mobility Aids',
        description: 'Wheelchairs, walkers, and mobility equipment',
      },
      {
        id: 'first-aid',
        name: 'First Aid',
        description: 'First aid supplies and emergency equipment',
      },
      {
        id: 'pharmacy-supplies',
        name: 'Pharmacy Supplies',
        description: 'Pharmaceutical and pharmacy supplies',
      },
    ],
  },
  {
    id: 'foodstuffs',
    name: 'Foodstuffs',
    description: 'Food and beverage products',
    icon: '🍎',
    subcategories: [
      {
        id: 'fresh-produce',
        name: 'Fresh Produce',
        description: 'Fresh fruits and vegetables',
      },
      {
        id: 'meat-seafood',
        name: 'Meat and Seafood',
        description: 'Fresh and frozen meat and seafood',
      },
      {
        id: 'dairy-products',
        name: 'Dairy Products',
        description: 'Milk, cheese, and dairy products',
      },
      {
        id: 'bakery-items',
        name: 'Bakery Items',
        description: 'Bread, pastries, and baked goods',
      },
      {
        id: 'beverages',
        name: 'Beverages',
        description: 'Drinks, juices, and beverages',
      },
      {
        id: 'canned-packaged',
        name: 'Canned and Packaged Foods',
        description: 'Processed and packaged food products',
      },
      {
        id: 'spices-condiments',
        name: 'Spices and Condiments',
        description: 'Spices, herbs, and condiments',
      },
      {
        id: 'organic-specialty',
        name: 'Organic and Specialty Foods',
        description: 'Organic and specialty food products',
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

  // Furniture
  bedrooms: [
    {
      title: 'Queen Size Bed Set',
      description:
        'Complete bedroom set with bed, wardrobe, and bedside tables.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'King Size Bed Frame',
      description: 'Elegant king size bed frame with upholstered headboard.',
      price: 600,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'living-rooms': [
    {
      title: 'Leather Living Room Set',
      description: '3-seater sofa with matching chairs, high-quality leather.',
      price: 1200,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Modern Sectional Sofa',
      description: 'Contemporary sectional sofa perfect for family gatherings.',
      price: 1000,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'dining-rooms': [
    {
      title: '6-Seater Dining Table Set',
      description: 'Elegant dining table with 6 chairs and buffet.',
      price: 700,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '8-Seater Extendable Table',
      description: 'Large extendable dining table perfect for family meals.',
      price: 900,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'kids-rooms': [
    {
      title: "Children's Bedroom Set",
      description:
        "Complete children's bedroom furniture with bed and storage.",
      price: 500,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Kids Study Desk',
      description: 'Functional study desk with chair and storage compartments.',
      price: 300,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  'guest-rooms': [
    {
      title: 'Guest Bed Set',
      description: 'Comfortable guest bed with mattress and bedding.',
      price: 400,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Folding Guest Bed',
      description: 'Space-saving folding bed for occasional guests.',
      price: 250,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  'office-furniture': [
    {
      title: 'Executive Office Desk',
      description: 'Large executive desk with drawers and cable management.',
      price: 600,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Office Chair Set',
      description: 'Ergonomic office chairs for professional workspace.',
      price: 400,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'garden-furniture': [
    {
      title: 'Garden Table Set',
      description: 'Outdoor dining table with 6 chairs, weather-resistant.',
      price: 450,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Garden Lounge Chairs',
      description: 'Comfortable outdoor lounge chairs with cushions.',
      price: 300,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  'lighting-decor': [
    {
      title: 'Modern Chandelier',
      description: 'Elegant crystal chandelier for dining room.',
      price: 350,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Table Lamps Set',
      description: 'Pair of decorative table lamps for living room.',
      price: 180,
      condition: ListingCondition.GOOD,
    },
  ],

  // Phones and Accessories
  'mobile-phones': [
    {
      title: 'iPhone 14 Pro 128GB',
      description:
        'Latest iPhone in excellent condition with original accessories.',
      price: 900,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Samsung Galaxy S23',
      description:
        'Premium Android phone with excellent camera and performance.',
      price: 700,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  ipads: [
    {
      title: 'iPad Pro 12.9" 2022',
      description: 'Professional iPad with M2 chip and Apple Pencil.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'iPad Air 5th Generation',
      description: 'Lightweight iPad perfect for work and entertainment.',
      price: 600,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'smart-watches': [
    {
      title: 'Apple Watch Series 8',
      description: 'Latest Apple Watch with health monitoring features.',
      price: 400,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Samsung Galaxy Watch 5',
      description: 'Premium Android smartwatch with fitness tracking.',
      price: 300,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'power-bank': [
    {
      title: '20000mAh Power Bank',
      description: 'High-capacity portable charger for multiple devices.',
      price: 80,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '10000mAh Fast Charging Power Bank',
      description: 'Fast charging power bank with USB-C and wireless charging.',
      price: 60,
      condition: ListingCondition.GOOD,
    },
  ],
  'mobile-covers': [
    {
      title: 'Premium Phone Cases Set',
      description: 'Set of 3 premium phone cases with different designs.',
      price: 45,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Leather Phone Wallet Case',
      description: 'Genuine leather case with card slots and stand.',
      price: 35,
      condition: ListingCondition.GOOD,
    },
  ],
  headphones: [
    {
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium wireless headphones with noise cancellation.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Gaming Headset with Microphone',
      description: 'Professional gaming headset with clear audio and mic.',
      price: 90,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  chargers: [
    {
      title: 'Fast Charging Cable Set',
      description: 'Set of 5 fast charging cables for all devices.',
      price: 25,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Wireless Charging Pad',
      description: 'Qi-compatible wireless charging pad for smartphones.',
      price: 40,
      condition: ListingCondition.GOOD,
    },
  ],
  'phone-numbers': [
    {
      title: 'Premium Phone Number',
      description: 'Memorable phone number with special pattern.',
      price: 150,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Business Phone Number',
      description: 'Professional business phone number for companies.',
      price: 200,
      condition: ListingCondition.NEW,
    },
  ],

  // Computers and Accessories
  laptops: [
    {
      title: 'MacBook Pro 16" M2',
      description: 'Powerful laptop for professionals with M2 chip.',
      price: 2500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Dell XPS 15',
      description: 'Premium Windows laptop with excellent performance.',
      price: 1800,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'desktop-computers': [
    {
      title: 'Gaming Desktop PC',
      description: 'High-performance gaming computer with RTX graphics.',
      price: 1500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Apple iMac 27"',
      description: 'All-in-one desktop with stunning display.',
      price: 2000,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  monitors: [
    {
      title: 'Samsung 32" 4K Monitor',
      description: 'Ultra-high resolution monitor for professional work.',
      price: 400,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'LG 27" Gaming Monitor',
      description: 'High refresh rate gaming monitor with G-Sync.',
      price: 350,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  mouses: [
    {
      title: 'Gaming Mouse RGB',
      description: 'High-precision gaming mouse with customizable RGB.',
      price: 80,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Wireless Office Mouse',
      description: 'Ergonomic wireless mouse for office use.',
      price: 45,
      condition: ListingCondition.GOOD,
    },
  ],
  'computer-cameras': [
    {
      title: '4K Webcam',
      description: 'High-quality webcam for video calls and streaming.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'HD Webcam with Microphone',
      description: 'Webcam with built-in microphone for conferences.',
      price: 75,
      condition: ListingCondition.GOOD,
    },
  ],
  keyboards: [
    {
      title: 'Mechanical Gaming Keyboard',
      description: 'RGB mechanical keyboard with customizable switches.',
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Wireless Bluetooth Keyboard',
      description: 'Slim wireless keyboard for productivity.',
      price: 60,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'printers-scanners': [
    {
      title: 'All-in-One Printer',
      description: 'Printer, scanner, and copier in one device.',
      price: 200,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Document Scanner',
      description: 'High-speed document scanner for office use.',
      price: 180,
      condition: ListingCondition.GOOD,
    },
  ],
  'computer-audio': [
    {
      title: 'Computer Speaker Set',
      description: '2.1 speaker system with subwoofer.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'USB Microphone',
      description: 'Professional USB microphone for recording.',
      price: 90,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'networks-communications': [
    {
      title: 'WiFi Router',
      description: 'High-speed WiFi 6 router for home use.',
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Network Switch',
      description: '8-port gigabit network switch.',
      price: 80,
      condition: ListingCondition.GOOD,
    },
  ],
  software: [
    {
      title: 'Office Software Suite',
      description: 'Complete office software with word, excel, powerpoint.',
      price: 200,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Antivirus Software',
      description: '1-year antivirus protection for 3 devices.',
      price: 60,
      condition: ListingCondition.NEW,
    },
  ],
  'computer-hardware': [
    {
      title: 'SSD 1TB',
      description: 'High-speed 1TB solid state drive.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'RAM 16GB DDR4',
      description: '16GB DDR4 RAM for desktop computers.',
      price: 80,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'gaming-consoles': [
    {
      title: 'PlayStation 5',
      description: 'Latest PlayStation console with controller.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Xbox Series X',
      description: 'Microsoft gaming console with 4K gaming.',
      price: 750,
      condition: ListingCondition.LIKE_NEW,
    },
  ],

  // Children's World
  'clothing-shoes': [
    {
      title: "Children's Clothing Set",
      description: "Complete set of children's clothing for ages 5-7.",
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Kids Winter Jacket',
      description: 'Warm winter jacket with hood for children.',
      price: 80,
      condition: ListingCondition.GOOD,
    },
  ],
  strollers: [
    {
      title: 'Baby Stroller',
      description: 'Lightweight stroller with safety harness.',
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Travel System Stroller',
      description: 'Complete travel system with car seat adapter.',
      price: 250,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'car-seats': [
    {
      title: 'Convertible Car Seat',
      description: 'Safe convertible car seat for toddlers.',
      price: 180,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Booster Car Seat',
      description: 'High-back booster seat for older children.',
      price: 120,
      condition: ListingCondition.GOOD,
    },
  ],
  toys: [
    {
      title: 'Educational Toy Set',
      description: 'Set of educational toys for learning.',
      price: 90,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Building Blocks Set',
      description: 'Large set of building blocks for creativity.',
      price: 75,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  books: [
    {
      title: "Children's Book Collection",
      description: "Collection of 20 children's books.",
      price: 60,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Educational Workbooks',
      description: 'Set of educational workbooks for different subjects.',
      price: 45,
      condition: ListingCondition.GOOD,
    },
  ],
  'health-care': [
    {
      title: 'Baby Care Kit',
      description: 'Complete baby care kit with essentials.',
      price: 100,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: "Children's First Aid Kit",
      description: 'First aid kit designed for children.',
      price: 65,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  nutrition: [
    {
      title: 'Baby Food Collection',
      description: 'Collection of organic baby food products.',
      price: 85,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: "Children's Vitamins",
      description: 'Multivitamin supplements for children.',
      price: 55,
      condition: ListingCondition.GOOD,
    },
  ],
  'children-uncategorized': [
    {
      title: "Children's Room Decor",
      description: 'Complete room decoration set for children.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Kids Storage Solutions',
      description: "Organized storage solutions for children's rooms.",
      price: 95,
      condition: ListingCondition.LIKE_NEW,
    },
  ],

  // Clothing
  'mens-clothing': [
    {
      title: "Men's Suit Set",
      description: "Professional men's suit with shirt and tie.",
      price: 300,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: "Men's Casual Wear",
      description: "Collection of casual men's clothing.",
      price: 180,
      condition: ListingCondition.GOOD,
    },
  ],
  'womens-clothing': [
    {
      title: "Women's Dress Collection",
      description: "Elegant collection of women's dresses.",
      price: 250,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: "Women's Business Attire",
      description: 'Professional business clothing for women.',
      price: 200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'childrens-clothing': [
    {
      title: "Children's Fashion Set",
      description: "Trendy children's clothing collection.",
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Kids Party Wear',
      description: 'Special occasion clothing for children.',
      price: 120,
      condition: ListingCondition.GOOD,
    },
  ],
  bags: [
    {
      title: 'Designer Handbag',
      description: 'Authentic designer handbag in excellent condition.',
      price: 400,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Travel Luggage Set',
      description: 'Complete set of travel luggage.',
      price: 280,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'watches-jewelry': [
    {
      title: 'Luxury Watch',
      description: 'Premium luxury watch with original box.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Diamond Jewelry Set',
      description: 'Beautiful diamond jewelry set.',
      price: 1200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'clothing-other': [
    {
      title: 'Vintage Clothing Collection',
      description: 'Unique vintage clothing pieces.',
      price: 180,
      condition: ListingCondition.GOOD,
    },
    {
      title: 'Traditional Syrian Clothing',
      description: 'Authentic traditional Syrian garments.',
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
  ],

  // Solar Energy
  'solar-panels': [
    {
      title: '300W Solar Panel Set',
      description: 'High-efficiency solar panels with mounting brackets.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '500W Solar Panel System',
      description: 'Complete solar panel system for home use.',
      price: 1200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  inverters: [
    {
      title: '2000W Pure Sine Wave Inverter',
      description: 'High-quality inverter for solar power systems.',
      price: 300,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '5000W Hybrid Inverter',
      description: 'Hybrid inverter with battery backup capability.',
      price: 800,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  batteries: [
    {
      title: '100Ah Deep Cycle Battery',
      description: 'Deep cycle battery for solar energy storage.',
      price: 200,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '200Ah Lithium Battery',
      description: 'High-capacity lithium battery for solar systems.',
      price: 600,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'charge-controllers': [
    {
      title: '30A Solar Charge Controller',
      description: 'Efficient charge controller for solar systems.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '60A MPPT Controller',
      description: 'Advanced MPPT charge controller.',
      price: 250,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'cables-accessories': [
    {
      title: 'Solar Cable Set',
      description: 'Complete set of solar cables and connectors.',
      price: 80,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Solar Mounting Kit',
      description: 'Mounting hardware for solar panels.',
      price: 150,
      condition: ListingCondition.GOOD,
    },
  ],
  'turnkey-systems': [
    {
      title: '5KW Solar System',
      description: 'Complete 5KW solar power system.',
      price: 3500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: '10KW Solar System',
      description: 'Large solar system for commercial use.',
      price: 6500,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'solar-services': [
    {
      title: 'Solar Installation Service',
      description: 'Professional solar panel installation service.',
      price: 500,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Solar Maintenance Service',
      description: 'Regular maintenance service for solar systems.',
      price: 200,
      condition: ListingCondition.NEW,
    },
  ],

  // Services and Businesses
  'home-services': [
    {
      title: 'House Cleaning Service',
      description: 'Professional house cleaning service in Damascus area.',
      price: 50,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Plumbing Repair Service',
      description: 'Experienced plumber for all types of repairs.',
      price: 40,
      condition: ListingCondition.NEW,
    },
  ],
  'car-services': [
    {
      title: 'Car Repair Workshop',
      description: 'Professional car repair and maintenance service.',
      price: 35,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Car Wash and Detailing',
      description: 'Premium car wash and interior detailing service.',
      price: 25,
      condition: ListingCondition.NEW,
    },
  ],
  'business-corporate-services': [
    {
      title: 'Business Consulting Service',
      description: 'Professional business consulting and strategy.',
      price: 200,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Legal Services',
      description: 'Comprehensive legal services for businesses.',
      price: 150,
      condition: ListingCondition.NEW,
    },
  ],
  'technical-services': [
    {
      title: 'IT Support Service',
      description: 'Professional IT support and maintenance.',
      price: 80,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Web Development Service',
      description: 'Custom website development and design.',
      price: 300,
      condition: ListingCondition.NEW,
    },
  ],
  'education-courses': [
    {
      title: 'English Language Course',
      description: 'Professional English language courses for all levels.',
      price: 200,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Computer Programming Course',
      description: 'Learn web development and programming skills.',
      price: 300,
      condition: ListingCondition.NEW,
    },
  ],
  'medical-healthcare-services': [
    {
      title: 'Medical Consultation Service',
      description: 'Professional medical consultation and advice.',
      price: 100,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Dental Care Service',
      description: 'Comprehensive dental care and treatment.',
      price: 120,
      condition: ListingCondition.NEW,
    },
  ],
  'transportation-logistics': [
    {
      title: 'Delivery Service',
      description: 'Fast and reliable delivery service.',
      price: 30,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Moving Service',
      description: 'Professional moving and relocation service.',
      price: 250,
      condition: ListingCondition.NEW,
    },
  ],
  'miscellaneous-services': [
    {
      title: 'Event Planning Service',
      description: 'Complete event planning and coordination.',
      price: 180,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Photography Service',
      description: 'Professional photography for events and portraits.',
      price: 150,
      condition: ListingCondition.NEW,
    },
  ],
  'services-other': [
    {
      title: 'Translation Service',
      description: 'Professional translation services in multiple languages.',
      price: 80,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Interior Design Service',
      description: 'Professional interior design and decoration.',
      price: 200,
      condition: ListingCondition.NEW,
    },
  ],

  // Jobs
  'job-vacancies': [
    {
      title: 'Software Developer Position',
      description: 'Full-time software developer role in tech company.',
      price: 0,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Marketing Manager Role',
      description: 'Experienced marketing manager for growing business.',
      price: 0,
      condition: ListingCondition.NEW,
    },
  ],
  'searching-for-job': [
    {
      title: 'Experienced Developer Available',
      description: 'Skilled developer seeking new opportunities.',
      price: 0,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Marketing Professional Available',
      description: 'Creative marketing professional looking for work.',
      price: 0,
      condition: ListingCondition.NEW,
    },
  ],

  // Handicrafts
  'textiles-fabrics': [
    {
      title: 'Handmade Syrian Textiles',
      description: 'Beautiful handmade Syrian textile products.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Traditional Fabric Collection',
      description: 'Collection of traditional Syrian fabrics.',
      price: 180,
      condition: ListingCondition.GOOD,
    },
  ],
  'accessories-jewelry': [
    {
      title: 'Handmade Jewelry Set',
      description: 'Unique handmade jewelry pieces.',
      price: 250,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Traditional Accessories',
      description: 'Traditional Syrian accessories and jewelry.',
      price: 150,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'wood-products': [
    {
      title: 'Handcrafted Wooden Furniture',
      description: 'Beautiful handcrafted wooden furniture pieces.',
      price: 400,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Wooden Decorative Items',
      description: 'Handmade wooden decorative items.',
      price: 120,
      condition: ListingCondition.GOOD,
    },
  ],
  'pottery-ceramics': [
    {
      title: 'Handmade Pottery Collection',
      description: 'Beautiful handmade pottery pieces.',
      price: 180,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Ceramic Vases Set',
      description: 'Set of handcrafted ceramic vases.',
      price: 95,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'glass-metals': [
    {
      title: 'Handmade Glass Art',
      description: 'Unique handmade glass art pieces.',
      price: 220,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Metal Craft Items',
      description: 'Handcrafted metal decorative items.',
      price: 150,
      condition: ListingCondition.GOOD,
    },
  ],
  leatherware: [
    {
      title: 'Handmade Leather Bags',
      description: 'Beautiful handmade leather bags.',
      price: 280,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Leather Accessories',
      description: 'Handcrafted leather accessories.',
      price: 120,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'natural-healthy-products': [
    {
      title: 'Natural Soap Collection',
      description: 'Handmade natural soap products.',
      price: 45,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Organic Beauty Products',
      description: 'Handmade organic beauty and skincare.',
      price: 85,
      condition: ListingCondition.GOOD,
    },
  ],

  // Building Materials
  'cement-concrete': [
    {
      title: 'Portland Cement',
      description: 'High-quality Portland cement for construction.',
      price: 25,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Ready-Mix Concrete',
      description: 'Ready-mix concrete for construction projects.',
      price: 45,
      condition: ListingCondition.NEW,
    },
  ],
  'steel-metals': [
    {
      title: 'Steel Rebar Set',
      description: 'High-quality steel rebar for construction.',
      price: 180,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Metal Beams',
      description: 'Structural metal beams for construction.',
      price: 250,
      condition: ListingCondition.NEW,
    },
  ],
  'bricks-blocks': [
    {
      title: 'Clay Bricks',
      description: 'Traditional clay bricks for building.',
      price: 0.5,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Concrete Blocks',
      description: 'Concrete blocks for construction.',
      price: 1.2,
      condition: ListingCondition.NEW,
    },
  ],
  'tiles-flooring': [
    {
      title: 'Ceramic Floor Tiles',
      description: 'Beautiful ceramic floor tiles.',
      price: 15,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Marble Tiles',
      description: 'Premium marble tiles for luxury projects.',
      price: 45,
      condition: ListingCondition.NEW,
    },
  ],
  'paint-coatings': [
    {
      title: 'Interior Paint Set',
      description: 'Complete set of interior paints.',
      price: 80,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Exterior Paint',
      description: 'Weather-resistant exterior paint.',
      price: 65,
      condition: ListingCondition.NEW,
    },
  ],
  'plumbing-electrical': [
    {
      title: 'Plumbing Fixtures Set',
      description: 'Complete set of plumbing fixtures.',
      price: 200,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Electrical Wiring Kit',
      description: 'Complete electrical wiring kit.',
      price: 150,
      condition: ListingCondition.NEW,
    },
  ],
  'insulation-roofing': [
    {
      title: 'Roof Insulation Material',
      description: 'High-quality roof insulation material.',
      price: 120,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Roofing Shingles',
      description: 'Durable roofing shingles.',
      price: 85,
      condition: ListingCondition.NEW,
    },
  ],

  // Industrial Equipment
  'manufacturing-equipment': [
    {
      title: 'CNC Machine',
      description: 'Professional CNC manufacturing machine.',
      price: 25000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Industrial Press',
      description: 'Heavy-duty industrial press machine.',
      price: 18000,
      condition: ListingCondition.GOOD,
    },
  ],
  'construction-equipment': [
    {
      title: 'Excavator',
      description: 'Heavy construction excavator.',
      price: 45000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Bulldozer',
      description: 'Construction bulldozer for heavy work.',
      price: 38000,
      condition: ListingCondition.GOOD,
    },
  ],
  'generators-power': [
    {
      title: 'Industrial Generator',
      description: 'High-power industrial generator.',
      price: 12000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Backup Power System',
      description: 'Complete backup power system.',
      price: 8500,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'compressors-pumps': [
    {
      title: 'Air Compressor',
      description: 'Industrial air compressor.',
      price: 3500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Water Pump System',
      description: 'Industrial water pump system.',
      price: 2800,
      condition: ListingCondition.GOOD,
    },
  ],
  'welding-equipment': [
    {
      title: 'Arc Welding Machine',
      description: 'Professional arc welding machine.',
      price: 1200,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'MIG Welder',
      description: 'MIG welding machine with accessories.',
      price: 950,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'material-handling': [
    {
      title: 'Forklift',
      description: 'Industrial forklift for material handling.',
      price: 15000,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Conveyor Belt System',
      description: 'Complete conveyor belt system.',
      price: 8500,
      condition: ListingCondition.GOOD,
    },
  ],
  'hvac-industrial': [
    {
      title: 'Industrial AC Unit',
      description: 'Large industrial air conditioning unit.',
      price: 6500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Ventilation System',
      description: 'Complete industrial ventilation system.',
      price: 4200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'testing-measurement': [
    {
      title: 'Quality Testing Equipment',
      description: 'Professional quality testing equipment.',
      price: 2800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Measurement Tools Set',
      description: 'Complete set of measurement tools.',
      price: 1200,
      condition: ListingCondition.GOOD,
    },
  ],
  'safety-equipment': [
    {
      title: 'Safety Gear Set',
      description: 'Complete industrial safety equipment set.',
      price: 450,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Fire Safety Equipment',
      description: 'Industrial fire safety equipment.',
      price: 650,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'packaging-equipment': [
    {
      title: 'Packaging Machine',
      description: 'Automated packaging machine.',
      price: 8500,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Sealing Equipment',
      description: 'Industrial sealing equipment.',
      price: 3200,
      condition: ListingCondition.GOOD,
    },
  ],
  'cleaning-equipment': [
    {
      title: 'Industrial Cleaner',
      description: 'Heavy-duty industrial cleaning machine.',
      price: 2800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Pressure Washer',
      description: 'High-pressure industrial washer.',
      price: 1800,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'industrial-other': [
    {
      title: 'Industrial Tools Set',
      description: 'Complete set of industrial tools.',
      price: 1200,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Spare Parts Collection',
      description: 'Collection of industrial spare parts.',
      price: 850,
      condition: ListingCondition.GOOD,
    },
  ],

  // Sports Equipment
  'fitness-equipment': [
    {
      title: 'Treadmill',
      description: 'Professional treadmill for home gym.',
      price: 800,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Weight Bench Set',
      description: 'Complete weight bench with weights.',
      price: 450,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'team-sports': [
    {
      title: 'Football Equipment Set',
      description: 'Complete football equipment for team.',
      price: 350,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Basketball Court Equipment',
      description: 'Basketball hoops and court equipment.',
      price: 280,
      condition: ListingCondition.GOOD,
    },
  ],
  'individual-sports': [
    {
      title: 'Tennis Equipment Set',
      description: 'Complete tennis equipment set.',
      price: 220,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Golf Club Set',
      description: 'Professional golf club set.',
      price: 450,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'outdoor-sports': [
    {
      title: 'Camping Equipment Set',
      description: 'Complete camping gear set.',
      price: 380,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Hiking Gear Collection',
      description: 'Professional hiking equipment.',
      price: 280,
      condition: ListingCondition.GOOD,
    },
  ],
  'water-sports': [
    {
      title: 'Scuba Diving Equipment',
      description: 'Complete scuba diving gear.',
      price: 1200,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Surfing Equipment',
      description: 'Professional surfing gear.',
      price: 450,
      condition: ListingCondition.LIKE_NEW,
    },
  ],

  // Musical Equipment
  'string-instruments': [
    {
      title: 'Acoustic Guitar',
      description: 'Beautiful acoustic guitar in excellent condition.',
      price: 350,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Violin Set',
      description: 'Professional violin with case and bow.',
      price: 280,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'wind-instruments': [
    {
      title: 'Saxophone',
      description: 'Professional saxophone for jazz music.',
      price: 650,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Flute',
      description: 'High-quality flute for classical music.',
      price: 320,
      condition: ListingCondition.GOOD,
    },
  ],
  'percussion-instruments': [
    {
      title: 'Drum Set',
      description: 'Complete drum set with cymbals.',
      price: 850,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Electronic Drum Kit',
      description: 'Modern electronic drum kit.',
      price: 1200,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'keyboards-pianos': [
    {
      title: 'Digital Piano',
      description: 'Professional digital piano with stand.',
      price: 950,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Synthesizer',
      description: 'Modern synthesizer for electronic music.',
      price: 650,
      condition: ListingCondition.GOOD,
    },
  ],
  'amplifiers-audio': [
    {
      title: 'Guitar Amplifier',
      description: 'Professional guitar amplifier.',
      price: 450,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'PA System',
      description: 'Complete PA system for live performances.',
      price: 850,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'music-accessories': [
    {
      title: 'Microphone Set',
      description: 'Professional microphone set for recording.',
      price: 280,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Music Stand Collection',
      description: 'Set of music stands for performances.',
      price: 120,
      condition: ListingCondition.GOOD,
    },
  ],

  // Animals
  dogs: [
    {
      title: 'Purebred Puppy',
      description: 'Beautiful purebred puppy for adoption.',
      price: 800,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Dog Supplies Set',
      description: 'Complete set of dog supplies and accessories.',
      price: 150,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  cats: [
    {
      title: 'Persian Cat',
      description: 'Beautiful Persian cat for adoption.',
      price: 600,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Cat Care Kit',
      description: 'Complete cat care and grooming kit.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  birds: [
    {
      title: 'Parrot',
      description: 'Talking parrot for adoption.',
      price: 450,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Bird Cage Set',
      description: 'Large bird cage with accessories.',
      price: 180,
      condition: ListingCondition.EXCELLENT,
    },
  ],
  'other-animals': [
    {
      title: 'Rabbit',
      description: 'Cute rabbit for adoption.',
      price: 120,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Fish Tank Set',
      description: 'Complete fish tank with fish and accessories.',
      price: 250,
      condition: ListingCondition.EXCELLENT,
    },
  ],

  // Medical Supplies
  'medical-equipment': [
    {
      title: 'Blood Pressure Monitor',
      description: 'Professional blood pressure monitoring device.',
      price: 180,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Stethoscope',
      description: 'High-quality medical stethoscope.',
      price: 120,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'personal-care': [
    {
      title: 'Personal Care Kit',
      description: 'Complete personal care and hygiene kit.',
      price: 85,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'First Aid Kit',
      description: 'Comprehensive first aid kit for home.',
      price: 65,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'mobility-aids': [
    {
      title: 'Wheelchair',
      description: 'Lightweight wheelchair for mobility.',
      price: 450,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Walking Frame',
      description: 'Stable walking frame for support.',
      price: 180,
      condition: ListingCondition.GOOD,
    },
  ],
  'first-aid': [
    {
      title: 'Emergency First Aid Kit',
      description: 'Complete emergency first aid kit.',
      price: 95,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Travel First Aid Kit',
      description: 'Compact first aid kit for travel.',
      price: 45,
      condition: ListingCondition.LIKE_NEW,
    },
  ],
  'pharmacy-supplies': [
    {
      title: 'Medicine Storage Cabinet',
      description: 'Secure medicine storage cabinet.',
      price: 120,
      condition: ListingCondition.EXCELLENT,
    },
    {
      title: 'Prescription Organizer',
      description: 'Daily pill organizer for medications.',
      price: 35,
      condition: ListingCondition.GOOD,
    },
  ],

  // Foodstuffs
  'fresh-produce': [
    {
      title: 'Fresh Vegetable Basket',
      description: 'Fresh organic vegetables from local farm.',
      price: 25,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Fresh Fruit Collection',
      description: 'Assorted fresh fruits from local market.',
      price: 30,
      condition: ListingCondition.NEW,
    },
  ],
  'meat-seafood': [
    {
      title: 'Fresh Meat Selection',
      description: 'Fresh meat selection from local butcher.',
      price: 45,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Fresh Seafood Collection',
      description: 'Fresh seafood from local fish market.',
      price: 55,
      condition: ListingCondition.NEW,
    },
  ],
  'dairy-products': [
    {
      title: 'Dairy Products Set',
      description: 'Fresh dairy products from local farm.',
      price: 35,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Cheese Collection',
      description: 'Assorted cheese selection.',
      price: 40,
      condition: ListingCondition.NEW,
    },
  ],
  'bakery-items': [
    {
      title: 'Fresh Bread Collection',
      description: 'Fresh baked bread from local bakery.',
      price: 15,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Pastry Set',
      description: 'Assorted pastries and desserts.',
      price: 25,
      condition: ListingCondition.NEW,
    },
  ],
  beverages: [
    {
      title: 'Fresh Juice Collection',
      description: 'Fresh fruit juices from local market.',
      price: 20,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Tea and Coffee Set',
      description: 'Premium tea and coffee selection.',
      price: 35,
      condition: ListingCondition.NEW,
    },
  ],
  'canned-packaged': [
    {
      title: 'Canned Food Collection',
      description: 'Assorted canned food products.',
      price: 30,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Packaged Snacks',
      description: 'Variety of packaged snack foods.',
      price: 25,
      condition: ListingCondition.NEW,
    },
  ],
  'spices-condiments': [
    {
      title: 'Spice Collection',
      description: 'Complete collection of spices and herbs.',
      price: 40,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Condiment Set',
      description: 'Assorted condiments and sauces.',
      price: 30,
      condition: ListingCondition.NEW,
    },
  ],
  'organic-specialty': [
    {
      title: 'Organic Food Basket',
      description: 'Complete organic food basket.',
      price: 60,
      condition: ListingCondition.NEW,
    },
    {
      title: 'Specialty Food Collection',
      description: 'Unique and specialty food products.',
      price: 45,
      condition: ListingCondition.NEW,
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

  // Create category attributes for vehicles
  console.log('🔧 Creating vehicle attributes...');

  // Find the Cars subcategory
  const carsSubcategory = await prisma.category.findFirst({
    where: { slug: 'cars' },
  });

  if (carsSubcategory) {
    // Create car-specific attributes
    const carAttributes = [
      {
        name: 'Vehicle Type',
        key: 'vehicle_type',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.STRING,
        required: true,
        searchable: true,
        sortable: false,
        options: [
          'car',
          'motorcycle',
          'truck',
          'commercial',
          'agricultural',
          'industrial',
          'marine',
        ],
        displayOrder: 1,
      },
      {
        name: 'Make',
        key: 'make',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
        required: true,
        searchable: true,
        sortable: false,
        placeholder: 'Vehicle make (e.g., Toyota, Honda, Hyundai)',
        displayOrder: 2,
      },
      {
        name: 'Model',
        key: 'model',
        type: AttributeType.TEXT,
        dataType: AttributeDataType.STRING,
        required: true,
        searchable: true,
        sortable: false,
        placeholder: 'Vehicle model (e.g., Camry, Civic, Tucson)',
        displayOrder: 3,
      },
      {
        name: 'Year',
        key: 'year',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: true,
        searchable: true,
        sortable: true,
        unit: 'year',
        placeholder: 'Manufacturing year',
        displayOrder: 4,
      },
      {
        name: 'Fuel Type',
        key: 'fuel_type',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.STRING,
        required: true,
        searchable: true,
        sortable: false,
        options: ['Bensin', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'],
        displayOrder: 5,
      },
      {
        name: 'Engine Power',
        key: 'engine_power',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: false,
        searchable: true,
        sortable: true,
        unit: 'PS',
        placeholder: 'Engine power in PS',
        displayOrder: 6,
      },
      {
        name: 'Mileage',
        key: 'mileage',
        type: AttributeType.NUMBER,
        dataType: AttributeDataType.INTEGER,
        required: false,
        searchable: true,
        sortable: true,
        unit: 'km',
        placeholder: 'Total kilometers driven',
        displayOrder: 7,
      },
      {
        name: 'Transmission',
        key: 'transmission',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.STRING,
        required: false,
        searchable: true,
        sortable: false,
        options: ['Manual', 'Automatic', 'CVT', 'Semi-automatic'],
        displayOrder: 8,
      },
      {
        name: 'Color',
        key: 'color',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.STRING,
        required: false,
        searchable: true,
        sortable: false,
        options: [
          'White',
          'Black',
          'Silver',
          'Gray',
          'Red',
          'Blue',
          'Green',
          'Yellow',
          'Orange',
          'Purple',
          'Brown',
          'Other',
        ],
        displayOrder: 9,
      },
      {
        name: 'Number of Doors',
        key: 'doors',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.INTEGER,
        required: false,
        searchable: true,
        sortable: false,
        options: [2, 3, 4, 5],
        displayOrder: 10,
      },
      {
        name: 'Number of Seats',
        key: 'seats',
        type: AttributeType.SELECT,
        dataType: AttributeDataType.INTEGER,
        required: false,
        searchable: true,
        sortable: false,
        options: [2, 3, 4, 5, 6, 7, 8],
        displayOrder: 11,
      },
    ];

    // Create all car attributes
    for (const attr of carAttributes) {
      await prisma.categoryAttribute.create({
        data: {
          categoryId: carsSubcategory.id,
          name: attr.name,
          key: attr.key,
          type: attr.type,
          dataType: attr.dataType,
          required: attr.required,
          searchable: attr.searchable,
          sortable: attr.sortable,
          options: attr.options,
          unit: attr.unit,
          placeholder: attr.placeholder,
          displayOrder: attr.displayOrder,
        },
      });
    }
    console.log('✅ Car attributes created successfully');
  }

  // Create attributes for Real Estate
  console.log('🏠 Creating real estate attributes...');
  const realEstateSubcategories = [
    'apartments',
    'houses',
    'land',
    'shops-offices',
    'factory-workshops',
    'tourist-properties',
  ];

  for (const subcategorySlug of realEstateSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const realEstateAttributes = [
        {
          name: 'Property Type',
          key: 'property_type',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options:
            subcategorySlug === 'apartments'
              ? [
                  'Studio',
                  '1 Bedroom',
                  '2 Bedrooms',
                  '3 Bedrooms',
                  '4+ Bedrooms',
                  'Penthouse',
                ]
              : subcategorySlug === 'houses'
                ? [
                    'Villa',
                    'Townhouse',
                    'Detached House',
                    'Semi-detached',
                    'Cottage',
                  ]
                : subcategorySlug === 'land'
                  ? [
                      'Residential',
                      'Commercial',
                      'Agricultural',
                      'Industrial',
                      'Mixed Use',
                    ]
                  : subcategorySlug === 'shops-offices'
                    ? [
                        'Shop',
                        'Office',
                        'Warehouse',
                        'Showroom',
                        'Restaurant',
                        'Clinic',
                      ]
                    : subcategorySlug === 'factory-workshops'
                      ? [
                          'Factory',
                          'Workshop',
                          'Industrial Building',
                          'Storage Facility',
                        ]
                      : [
                          'Hotel',
                          'Resort',
                          'Guest House',
                          'Vacation Rental',
                          'Tourist Complex',
                        ],
          displayOrder: 1,
        },
        {
          name: 'Area',
          key: 'area',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          searchable: true,
          sortable: true,
          unit: 'm²',
          placeholder: 'Property area in square meters',
          displayOrder: 2,
        },
        {
          name: 'Bedrooms',
          key: 'bedrooms',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.INTEGER,
          required:
            subcategorySlug === 'apartments' || subcategorySlug === 'houses',
          searchable: true,
          sortable: true,
          options: [1, 2, 3, 4, 5, 6, 7, 8],
          displayOrder: 3,
        },
        {
          name: 'Bathrooms',
          key: 'bathrooms',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.INTEGER,
          required:
            subcategorySlug === 'apartments' || subcategorySlug === 'houses',
          searchable: true,
          sortable: true,
          options: [1, 2, 3, 4, 5],
          displayOrder: 4,
        },
        {
          name: 'Floor',
          key: 'floor',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: false,
          searchable: true,
          sortable: true,
          placeholder: 'Floor number',
          displayOrder: 5,
        },
        {
          name: 'Furnished',
          key: 'furnished',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Furnished', 'Semi-furnished', 'Unfurnished'],
          displayOrder: 6,
        },
        {
          name: 'Parking',
          key: 'parking',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Yes', 'No', 'Street Parking'],
          displayOrder: 7,
        },
      ];

      for (const attr of realEstateAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Real estate attributes created successfully');

  // Create attributes for Electronics
  console.log('📱 Creating electronics attributes...');
  const electronicsSubcategories = [
    'televisions',
    'refrigerators-freezers',
    'washing-machines-dryers',
    'ovens-microwaves',
    'vacuum-cleaners',
    'cameras',
    'video-games',
    'air-conditioners',
    'water-heaters',
    'audio-equipment',
    'e-books',
    'security-surveillance',
    'home-kitchen-appliances',
    'uncategorized-appliances',
  ];

  for (const subcategorySlug of electronicsSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const electronicsAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name (e.g., Samsung, LG, Apple)',
          unit: undefined,
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        // Screen Size for TVs
        ...(subcategorySlug === 'televisions' ? [{
          name: 'Screen Size',
          key: 'screen_size',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          searchable: true,
          sortable: true,
          unit: 'inch',
          placeholder: 'Screen size in inches',
          displayOrder: 3,
        }] : []),
        // Capacity for appliances
        ...(subcategorySlug === 'refrigerators-freezers' || subcategorySlug === 'washing-machines-dryers' ? [{
          name: 'Capacity',
          key: 'capacity',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          searchable: true,
          sortable: true,
          unit: subcategorySlug === 'refrigerators-freezers' ? 'L' : 'kg',
          placeholder: subcategorySlug === 'refrigerators-freezers' ? 'Capacity in liters' : 'Capacity in kilograms',
          displayOrder: 3,
        }] : []),
        // Camera-specific attributes
        ...(subcategorySlug === 'cameras' ? [
          {
            name: 'Camera Type',
            key: 'camera_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Film Camera', 'Other'],
            unit: undefined,
            placeholder: undefined,
            displayOrder: 3,
          },
          {
            name: 'Megapixels',
            key: 'megapixels',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: false,
            searchable: true,
            sortable: true,
            unit: 'MP',
            placeholder: 'Camera resolution in megapixels',
            displayOrder: 4,
          },
          {
            name: 'Lens Mount',
            key: 'lens_mount',
            type: AttributeType.TEXT,
            dataType: AttributeDataType.STRING,
            required: false,
            searchable: true,
            sortable: false,
            placeholder: 'Lens mount type (e.g., Canon EF, Nikon F, Sony E)',
            unit: undefined,
            displayOrder: 5,
          }
        ] : []),
        // Video Game-specific attributes
        ...(subcategorySlug === 'video-games' ? [
          {
            name: 'Platform',
            key: 'platform',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile', 'Other'],
            unit: undefined,
            placeholder: undefined,
            displayOrder: 3,
          },
          {
            name: 'Game Type',
            key: 'game_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: false,
            searchable: true,
            sortable: false,
            options: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'Other'],
            displayOrder: 4,
          }
        ] : []),
        // Audio Equipment-specific attributes
        ...(subcategorySlug === 'audio-equipment' ? [
          {
            name: 'Audio Type',
            key: 'audio_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['Speakers', 'Headphones', 'Microphone', 'Amplifier', 'Receiver', 'Other'],
            displayOrder: 3,
          },
          {
            name: 'Power Output',
            key: 'power_output',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: false,
            searchable: true,
            sortable: true,
            unit: 'W',
            placeholder: 'Power output in watts',
            displayOrder: 4,
          }
        ] : []),
        // Security Systems-specific attributes
        ...(subcategorySlug === 'security-surveillance' ? [
          {
            name: 'System Type',
            key: 'system_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['CCTV Camera', 'Security System', 'Alarm System', 'Access Control', 'Other'],
            displayOrder: 3,
          },
          {
            name: 'Resolution',
            key: 'resolution',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: false,
            searchable: true,
            sortable: false,
            options: ['720p', '1080p', '2K', '4K', 'Other'],
            displayOrder: 4,
          }
        ] : []),
        // Air Conditioner-specific attributes
        ...(subcategorySlug === 'air-conditioners' ? [
          {
            name: 'Cooling Capacity',
            key: 'cooling_capacity',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'BTU',
            placeholder: 'Cooling capacity in BTU',
            displayOrder: 3,
          }
        ] : []),
        // Water Heater-specific attributes
        ...(subcategorySlug === 'water-heaters' ? [
          {
            name: 'Capacity',
            key: 'capacity',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'L',
            placeholder: 'Water heater capacity in liters',
            displayOrder: 3,
          }
        ] : []),
        // Common color attribute for all
        {
          name: 'Color',
          key: 'color',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: [
            'White',
            'Black',
            'Silver',
            'Stainless Steel',
            'Red',
            'Blue',
            'Other',
          ],
          unit: undefined,
          placeholder: undefined,
          displayOrder: subcategorySlug === 'cameras' || subcategorySlug === 'video-games' || subcategorySlug === 'audio-equipment' || subcategorySlug === 'security-surveillance' ? 6 : 5,
        },
        // Camera-specific attributes
        ...(subcategorySlug === 'cameras' ? [
          {
            name: 'Camera Type',
            key: 'camera_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Film Camera', 'Other'],
            unit: undefined,
            placeholder: undefined,
            displayOrder: 3,
          },
          {
            name: 'Megapixels',
            key: 'megapixels',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'MP',
            placeholder: 'Camera resolution in megapixels',
            displayOrder: 4,
          },
          {
            name: 'Lens Mount',
            key: 'lens_mount',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: false,
            searchable: true,
            sortable: false,
            options: ['Canon EF', 'Nikon F', 'Sony E', 'Micro Four Thirds', 'Other'],
            unit: undefined,
            placeholder: undefined,
            displayOrder: 5,
          }
        ] : []),
      ];

      for (const attr of electronicsAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit || undefined,
            placeholder: attr.placeholder || undefined,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }

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

            // Get random Syrian city for this product
            const randomCity = getRandomSyrianCity();

            const listing = await prisma.listing.create({
              data: {
                sellerId: user.id,
                title: template.title,
                description: template.description,
                price: template.price,
                currency: 'SYP',
                categoryId: subcategory.id,
                city: randomCity.name,
                locationCountry: 'Syria',
                locationCity: randomCity.name,
                locationAddress: `${randomCity.name}, Syria`,
                latitude: randomCity.lat,
                longitude: randomCity.lng,
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

  console.log('✅ Real estate attributes created successfully');

  console.log('✅ Services and businesses attributes created successfully');

  // Create attributes for Industrial Equipment
  console.log('🏭 Creating industrial equipment attributes...');
  const industrialSubcategories = [
    'manufacturing-equipment',
    'construction-equipment',
    'cleaning-equipment',
    'material-handling',
    'hvac-industrial',
    'testing-measurement',
    'welding-equipment',
    'packaging-equipment',
    'safety-equipment',
    'compressors-pumps',
    'generators-power',
    'industrial-other',
  ];

  for (const subcategorySlug of industrialSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const industrialAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: undefined,
          unit: undefined,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: undefined,
          unit: undefined,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        {
          name: 'Year',
          key: 'year',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: false,
          searchable: true,
          sortable: true,
          options: undefined,
          unit: 'year',
          placeholder: 'Manufacturing year',
          displayOrder: 3,
        },
        {
          name: 'Power Rating',
          key: 'power_rating',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: false,
          searchable: true,
          sortable: true,
          options: undefined,
          unit: 'HP',
          placeholder: 'Power rating in horsepower',
          displayOrder: 4,
        },
      ];

      for (const attr of industrialAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options || undefined,
            unit: attr.unit || undefined,
            placeholder: attr.placeholder || undefined,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Industrial equipment attributes created successfully');

  // Create attributes for Phones and Accessories
  console.log('📱 Creating phones and accessories attributes...');
  const phonesSubcategories = [
    'mobile-phones',
    'ipads',
    'smart-watches',
    'power-bank',
    'mobile-covers',
    'headphones',
    'chargers',
    'phone-numbers',
  ];

  for (const subcategorySlug of phonesSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const phonesAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name (e.g., Apple, Samsung, Huawei)',
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        // Mobile Phone-specific attributes
        ...(subcategorySlug === 'mobile-phones' ? [
          {
            name: 'Storage',
            key: 'storage',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: true,
            options: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', 'Other'],
            displayOrder: 3,
          },
          {
            name: 'Color',
            key: 'color',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: false,
            searchable: true,
            sortable: false,
            options: ['Black', 'White', 'Gold', 'Silver', 'Blue', 'Red', 'Green', 'Other'],
            displayOrder: 4,
          }
        ] : []),
        // Smart Watch-specific attributes
        ...(subcategorySlug === 'smart-watches' ? [
          {
            name: 'Watch Type',
            key: 'watch_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['Fitness Tracker', 'Smartwatch', 'Hybrid', 'Other'],
            displayOrder: 3,
          },
          {
            name: 'Compatibility',
            key: 'compatibility',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['iOS', 'Android', 'Both', 'Other'],
            displayOrder: 4,
          }
        ] : []),
        // Power Bank-specific attributes
        ...(subcategorySlug === 'power-bank' ? [
          {
            name: 'Capacity',
            key: 'capacity',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'mAh',
            placeholder: 'Battery capacity in mAh',
            displayOrder: 3,
          }
        ] : []),
        // Headphones-specific attributes
        ...(subcategorySlug === 'headphones' ? [
          {
            name: 'Headphone Type',
            key: 'headphone_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['Over-ear', 'On-ear', 'In-ear', 'Wireless', 'Other'],
            displayOrder: 3,
          }
        ] : []),
        // Common condition attribute
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: subcategorySlug === 'mobile-phones' || subcategorySlug === 'smart-watches' ? 5 : 3,
        },
      ];

      for (const attr of phonesAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Phones and accessories attributes created successfully');

  // Create attributes for Computers and Accessories
  console.log('💻 Creating computers and accessories attributes...');
  const computersSubcategories = [
    'laptops',
    'desktop-computers',
    'monitors',
    'mouses',
    'computer-cameras',
    'keyboards',
    'printers-scanners',
    'computer-audio',
    'networks-communications',
    'software',
    'computer-hardware',
    'gaming-consoles',
  ];

  for (const subcategorySlug of computersSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const computersAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name (e.g., Dell, HP, Lenovo)',
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        // Laptop-specific attributes
        ...(subcategorySlug === 'laptops' ? [
          {
            name: 'Processor',
            key: 'processor',
            type: AttributeType.TEXT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            placeholder: 'Processor model (e.g., Intel i7, AMD Ryzen)',
            displayOrder: 3,
          },
          {
            name: 'RAM',
            key: 'ram',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: true,
            options: ['4GB', '8GB', '16GB', '32GB', '64GB', 'Other'],
            displayOrder: 4,
          },
          {
            name: 'Storage',
            key: 'storage',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: true,
            options: ['128GB', '256GB', '512GB', '1TB', '2TB', 'Other'],
            displayOrder: 5,
          }
        ] : []),
        // Monitor-specific attributes
        ...(subcategorySlug === 'monitors' ? [
          {
            name: 'Screen Size',
            key: 'screen_size',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'inch',
            placeholder: 'Screen size in inches',
            displayOrder: 3,
          },
          {
            name: 'Resolution',
            key: 'resolution',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['720p', '1080p', '2K', '4K', 'Other'],
            displayOrder: 4,
          }
        ] : []),
        // Gaming Console-specific attributes
        ...(subcategorySlug === 'gaming-consoles' ? [
          {
            name: 'Console Type',
            key: 'console_type',
            type: AttributeType.SELECT,
            dataType: AttributeDataType.STRING,
            required: true,
            searchable: true,
            sortable: false,
            options: ['PlayStation', 'Xbox', 'Nintendo', 'Other'],
            displayOrder: 3,
          },
          {
            name: 'Generation',
            key: 'generation',
            type: AttributeType.TEXT,
            dataType: AttributeDataType.STRING,
            required: false,
            searchable: true,
            sortable: false,
            placeholder: 'Console generation (e.g., PS5, Xbox Series X)',
            displayOrder: 4,
          }
        ] : []),
        // Common condition attribute
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: subcategorySlug === 'laptops' ? 6 : (subcategorySlug === 'monitors' || subcategorySlug === 'gaming-consoles' ? 5 : 3),
        },
      ];

      for (const attr of computersAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Computers and accessories attributes created successfully');

  // Create attributes for Furniture
  console.log('🪑 Creating furniture attributes...');
  const furnitureSubcategories = [
    'bedrooms',
    'living-rooms',
    'dining-rooms',
    'kids-rooms',
    'guest-rooms',
    'office-furniture',
    'garden-furniture',
    'lighting-decor',
  ];

  for (const subcategorySlug of furnitureSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const furnitureAttributes = [
        {
          name: 'Material',
          key: 'material',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['Wood', 'Metal', 'Plastic', 'Fabric', 'Leather', 'Glass', 'Other'],
          displayOrder: 1,
        },
        {
          name: 'Color',
          key: 'color',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Brown', 'Black', 'White', 'Gray', 'Beige', 'Blue', 'Red', 'Other'],
          displayOrder: 2,
        },
        {
          name: 'Style',
          key: 'style',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Modern', 'Traditional', 'Contemporary', 'Vintage', 'Industrial', 'Minimalist', 'Other'],
          displayOrder: 3,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 4,
        },
      ];

      for (const attr of furnitureAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Furniture attributes created successfully');

  // Create attributes for Children's World
  console.log('🧸 Creating children\'s world attributes...');
  const childrenSubcategories = [
    'clothing-shoes',
    'strollers',
    'car-seats',
    'toys',
    'books',
    'health-care',
    'nutrition',
    'children-uncategorized',
  ];

  for (const subcategorySlug of childrenSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const childrenAttributes = [
        {
          name: 'Age Range',
          key: 'age_range',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['0-6 months', '6-12 months', '1-2 years', '2-4 years', '4-6 years', '6-8 years', '8-12 years', '12+ years'],
          displayOrder: 1,
        },
        {
          name: 'Gender',
          key: 'gender',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Boys', 'Girls', 'Unisex', 'Other'],
          displayOrder: 2,
        },
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 3,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 4,
        },
      ];

      for (const attr of childrenAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Children\'s world attributes created successfully');

  // Create attributes for Clothing
  console.log('👔 Creating clothing attributes...');
  const clothingSubcategories = [
    'mens-clothing',
    'womens-clothing',
    'childrens-clothing',
    'bags',
    'watches-jewelry',
    'clothing-other',
  ];

  for (const subcategorySlug of clothingSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const clothingAttributes = [
        {
          name: 'Size',
          key: 'size',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Other'],
          displayOrder: 1,
        },
        {
          name: 'Color',
          key: 'color',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray', 'Other'],
          displayOrder: 2,
        },
        {
          name: 'Material',
          key: 'material',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Leather', 'Denim', 'Linen', 'Other'],
          displayOrder: 3,
        },
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 4,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 5,
        },
      ];

      for (const attr of clothingAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Clothing attributes created successfully');

  // Create attributes for Jobs
  console.log('💼 Creating jobs attributes...');
  const jobsSubcategories = [
    'job-vacancies',
    'searching-for-job',
  ];

  for (const subcategorySlug of jobsSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const jobsAttributes = [
        {
          name: 'Job Type',
          key: 'job_type',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Other'],
          displayOrder: 1,
        },
        {
          name: 'Experience Level',
          key: 'experience_level',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Other'],
          displayOrder: 2,
        },
        {
          name: 'Education',
          key: 'education',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Other'],
          displayOrder: 3,
        },
        {
          name: 'Salary Range',
          key: 'salary_range',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Under $30k', '$30k-$50k', '$50k-$75k', '$75k-$100k', '$100k-$150k', '$150k+', 'Negotiable'],
          displayOrder: 4,
        },
      ];

      for (const attr of jobsAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Jobs attributes created successfully');

  // Create attributes for Solar Energy
  console.log('☀️ Creating solar energy attributes...');
  const solarSubcategories = [
    'solar-panels',
    'inverters',
    'batteries',
    'charge-controllers',
    'cables-accessories',
    'turnkey-systems',
    'solar-services',
  ];

  for (const subcategorySlug of solarSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const solarAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        // Solar Panel-specific attributes
        ...(subcategorySlug === 'solar-panels' ? [
          {
            name: 'Power Output',
            key: 'power_output',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'W',
            placeholder: 'Power output in watts',
            displayOrder: 3,
          },
          {
            name: 'Efficiency',
            key: 'efficiency',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.DECIMAL,
            required: false,
            searchable: true,
            sortable: true,
            unit: '%',
            placeholder: 'Panel efficiency percentage',
            displayOrder: 4,
          }
        ] : []),
        // Battery-specific attributes
        ...(subcategorySlug === 'batteries' ? [
          {
            name: 'Capacity',
            key: 'capacity',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'kWh',
            placeholder: 'Battery capacity in kWh',
            displayOrder: 3,
          },
          {
            name: 'Voltage',
            key: 'voltage',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'V',
            placeholder: 'Battery voltage',
            displayOrder: 4,
          }
        ] : []),
        // Inverter-specific attributes
        ...(subcategorySlug === 'inverters' ? [
          {
            name: 'Power Rating',
            key: 'power_rating',
            type: AttributeType.NUMBER,
            dataType: AttributeDataType.INTEGER,
            required: true,
            searchable: true,
            sortable: true,
            unit: 'W',
            placeholder: 'Inverter power rating in watts',
            displayOrder: 3,
          }
        ] : []),
        // Common condition attribute
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: subcategorySlug === 'solar-panels' || subcategorySlug === 'batteries' ? 5 : (subcategorySlug === 'inverters' ? 4 : 3),
        },
      ];

      for (const attr of solarAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Solar energy attributes created successfully');

  // Create attributes for Services and Businesses
  console.log('🔧 Creating services and businesses attributes...');
  const servicesSubcategories = [
    'home-services',
    'car-services',
    'business-corporate-services',
    'technical-services',
    'education-courses',
    'medical-healthcare-services',
    'transportation-logistics',
    'miscellaneous-services',
    'services-other',
  ];

  for (const subcategorySlug of servicesSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const servicesAttributes = [
        {
          name: 'Service Type',
          key: 'service_type',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Type of service offered',
          displayOrder: 1,
        },
        {
          name: 'Experience',
          key: 'experience',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
          displayOrder: 2,
        },
        {
          name: 'Certification',
          key: 'certification',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Yes', 'No', 'In Progress'],
          displayOrder: 3,
        },
        {
          name: 'Service Area',
          key: 'service_area',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          placeholder: 'Areas where service is provided',
          displayOrder: 4,
        },
      ];

      for (const attr of servicesAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Services and businesses attributes created successfully');

  // Create attributes for Handicrafts
  console.log('🎨 Creating handicrafts attributes...');
  const handicraftsSubcategories = [
    'textiles-fabrics',
    'accessories-jewelry',
    'wood-products',
    'pottery-ceramics',
    'glass-metals',
    'leatherware',
    'natural-healthy-products',
  ];

  for (const subcategorySlug of handicraftsSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const handicraftsAttributes = [
        {
          name: 'Material',
          key: 'material',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['Cotton', 'Wool', 'Silk', 'Wood', 'Clay', 'Glass', 'Metal', 'Leather', 'Other'],
          displayOrder: 1,
        },
        {
          name: 'Style',
          key: 'style',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Traditional', 'Modern', 'Vintage', 'Contemporary', 'Ethnic', 'Other'],
          displayOrder: 2,
        },
        {
          name: 'Color',
          key: 'color',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Natural', 'Dyed', 'Multi-color', 'Other'],
          displayOrder: 3,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 4,
        },
      ];

      for (const attr of handicraftsAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Handicrafts attributes created successfully');

  // Create attributes for Building Materials
  console.log('🧱 Creating building materials attributes...');
  const buildingMaterialsSubcategories = [
    'cement-concrete',
    'steel-metals',
    'bricks-blocks',
    'tiles-flooring',
    'paint-coatings',
    'plumbing-electrical',
    'building-other',
  ];

  for (const subcategorySlug of buildingMaterialsSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const buildingMaterialsAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Grade',
          key: 'grade',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Premium', 'Standard', 'Economy', 'Other'],
          displayOrder: 2,
        },
        {
          name: 'Quantity',
          key: 'quantity',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          searchable: true,
          sortable: true,
          placeholder: 'Available quantity',
          displayOrder: 3,
        },
        {
          name: 'Unit',
          key: 'unit',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['Piece', 'Kilogram', 'Ton', 'Meter', 'Square Meter', 'Liter', 'Other'],
          displayOrder: 4,
        },
      ];

      for (const attr of buildingMaterialsAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Building materials attributes created successfully');

  // Create attributes for Agricultural
  console.log('🌾 Creating agricultural attributes...');
  const agriculturalSubcategories = [
    'seeds-plants',
    'fertilizers',
    'pesticides',
    'agricultural-tools',
    'irrigation-systems',
    'harvesting-equipment',
    'agricultural-other',
  ];

  for (const subcategorySlug of agriculturalSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const agriculturalAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Type',
          key: 'type',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Product type',
          displayOrder: 2,
        },
        {
          name: 'Quantity',
          key: 'quantity',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: true,
          searchable: true,
          sortable: true,
          placeholder: 'Available quantity',
          displayOrder: 3,
        },
        {
          name: 'Unit',
          key: 'unit',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          options: ['Kilogram', 'Liter', 'Piece', 'Pack', 'Bag', 'Other'],
          displayOrder: 4,
        },
      ];

      for (const attr of agriculturalAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Agricultural attributes created successfully');

  // Create attributes for Animals
  console.log('🐾 Creating animals attributes...');
  const animalsSubcategories = [
    'pets',
    'livestock',
    'birds',
    'fish-aquatic',
    'horses-equines',
    'wild-animals',
    'animals-other',
  ];

  for (const subcategorySlug of animalsSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const animalsAttributes = [
        {
          name: 'Species',
          key: 'species',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Animal species',
          displayOrder: 1,
        },
        {
          name: 'Age',
          key: 'age',
          type: AttributeType.NUMBER,
          dataType: AttributeDataType.INTEGER,
          required: false,
          searchable: true,
          sortable: true,
          unit: 'years',
          placeholder: 'Animal age in years',
          displayOrder: 2,
        },
        {
          name: 'Gender',
          key: 'gender',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Male', 'Female', 'Unknown'],
          displayOrder: 3,
        },
        {
          name: 'Health Status',
          key: 'health_status',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Healthy', 'Good', 'Fair', 'Needs Care', 'Other'],
          displayOrder: 4,
        },
      ];

      for (const attr of animalsAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Animals attributes created successfully');

  // Create attributes for Books and Media
  console.log('📚 Creating books and media attributes...');
  const booksMediaSubcategories = [
    'books',
    'magazines',
    'newspapers',
    'audio-books',
    'e-books',
    'movies-dvds',
    'music-cds',
  ];

  for (const subcategorySlug of booksMediaSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const booksMediaAttributes = [
        {
          name: 'Title',
          key: 'title',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Book/movie/music title',
          displayOrder: 1,
        },
        {
          name: 'Author/Artist',
          key: 'author_artist',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          placeholder: 'Author or artist name',
          displayOrder: 2,
        },
        {
          name: 'Language',
          key: 'language',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Arabic', 'English', 'French', 'German', 'Spanish', 'Other'],
          displayOrder: 3,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 4,
        },
      ];

      for (const attr of booksMediaAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Books and media attributes created successfully');

  // Create attributes for Sports and Hobbies
  console.log('⚽ Creating sports and hobbies attributes...');
  const sportsHobbiesSubcategories = [
    'sports-equipment',
    'fitness-equipment',
    'outdoor-gear',
    'musical-instruments',
    'art-supplies',
    'collectibles',
    'hobbies-other',
  ];

  for (const subcategorySlug of sportsHobbiesSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const sportsHobbiesAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        {
          name: 'Type',
          key: 'type',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Equipment type',
          displayOrder: 3,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 4,
        },
      ];

      for (const attr of sportsHobbiesAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Sports and hobbies attributes created successfully');

  // Create attributes for Health and Beauty
  console.log('💄 Creating health and beauty attributes...');
  const healthBeautySubcategories = [
    'cosmetics',
    'skincare',
    'haircare',
    'fragrances',
    'health-supplements',
    'medical-equipment',
    'health-beauty-other',
  ];

  for (const subcategorySlug of healthBeautySubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const healthBeautyAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Product Type',
          key: 'product_type',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Type of product',
          displayOrder: 2,
        },
        {
          name: 'Skin Type',
          key: 'skin_type',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Other'],
          displayOrder: 3,
        },
        {
          name: 'Expiry Date',
          key: 'expiry_date',
          type: AttributeType.DATE,
          dataType: AttributeDataType.DATE,
          required: false,
          searchable: true,
          sortable: true,
          placeholder: 'Expiry date',
          displayOrder: 4,
        },
      ];

      for (const attr of healthBeautyAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Health and beauty attributes created successfully');

  // Create attributes for Tools and Equipment
  console.log('🔧 Creating tools and equipment attributes...');
  const toolsEquipmentSubcategories = [
    'hand-tools',
    'power-tools',
    'garden-tools',
    'automotive-tools',
    'construction-tools',
    'kitchen-tools',
    'cleaning-tools',
    'measuring-tools',
    'tools-other',
  ];

  for (const subcategorySlug of toolsEquipmentSubcategories) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: subcategorySlug },
    });

    if (subcategory) {
      const toolsEquipmentAttributes = [
        {
          name: 'Brand',
          key: 'brand',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Brand name',
          displayOrder: 1,
        },
        {
          name: 'Model',
          key: 'model',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          placeholder: 'Model name or number',
          displayOrder: 2,
        },
        {
          name: 'Tool Type',
          key: 'tool_type',
          type: AttributeType.TEXT,
          dataType: AttributeDataType.STRING,
          required: true,
          searchable: true,
          sortable: false,
          placeholder: 'Type of tool',
          displayOrder: 3,
        },
        {
          name: 'Condition',
          key: 'condition',
          type: AttributeType.SELECT,
          dataType: AttributeDataType.STRING,
          required: false,
          searchable: true,
          sortable: false,
          options: ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
          displayOrder: 4,
        },
      ];

      for (const attr of toolsEquipmentAttributes) {
        await prisma.categoryAttribute.create({
          data: {
            categoryId: subcategory.id,
            name: attr.name,
            key: attr.key,
            type: attr.type,
            dataType: attr.dataType,
            required: attr.required,
            searchable: attr.searchable,
            sortable: attr.sortable,
            options: attr.options,
            unit: attr.unit,
            placeholder: attr.placeholder,
            displayOrder: attr.displayOrder,
          },
        });
      }
    }
  }
  console.log('✅ Tools and equipment attributes created successfully');

  // Create attributes for Services and Businesses
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
