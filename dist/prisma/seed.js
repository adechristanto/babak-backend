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
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
async function createCategoryAttributes(createdCategories, createdSubcategories) {
    const realEstateCategory = createdCategories.get('real-estate');
    if (realEstateCategory) {
        const realEstateAttributes = [
            {
                name: 'Property Type',
                key: 'property_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['apartment', 'house', 'land', 'shop', 'office', 'factory', 'workshop', 'tourist'],
                displayOrder: 1
            },
            {
                name: 'Listing Purpose',
                key: 'listing_purpose',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['sale', 'rent'],
                displayOrder: 2
            },
            {
                name: 'Built Area',
                key: 'built_area',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.DECIMAL,
                required: false,
                searchable: true,
                sortable: true,
                unit: 'm²',
                validation: { min: 1, max: 10000 },
                placeholder: 'Enter built area',
                displayOrder: 3
            },
            {
                name: 'Lot Size',
                key: 'lot_size',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.DECIMAL,
                required: false,
                searchable: true,
                sortable: true,
                unit: 'm²',
                validation: { min: 1, max: 100000 },
                placeholder: 'Enter lot size',
                displayOrder: 4
            },
            {
                name: 'Bedrooms',
                key: 'bedrooms',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                sortable: true,
                validation: { min: 0, max: 20 },
                placeholder: 'Number of bedrooms',
                displayOrder: 5
            },
            {
                name: 'Bathrooms',
                key: 'bathrooms',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                sortable: true,
                validation: { min: 0, max: 20 },
                placeholder: 'Number of bathrooms',
                displayOrder: 6
            },
            {
                name: 'Parking Spots',
                key: 'parking_spots',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                validation: { min: 0, max: 50 },
                placeholder: 'Number of parking spots',
                displayOrder: 7
            },
            {
                name: 'Furnishing',
                key: 'furnishing',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                options: ['unfurnished', 'semifurnished', 'furnished'],
                displayOrder: 8
            },
            {
                name: 'Floor Number',
                key: 'floor_number',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                validation: { min: 0, max: 200 },
                placeholder: 'Floor number',
                displayOrder: 9
            },
            {
                name: 'Total Floors',
                key: 'total_floors',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                validation: { min: 1, max: 200 },
                placeholder: 'Total floors in building',
                displayOrder: 10
            },
            {
                name: 'Year Built',
                key: 'year_built',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                sortable: true,
                validation: { min: 1800, max: new Date().getFullYear() + 5 },
                placeholder: 'Year built',
                displayOrder: 11
            },
            {
                name: 'Heating Type',
                key: 'heating_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                options: ['gas', 'electric', 'central', 'none'],
                displayOrder: 12
            },
            {
                name: 'Air Conditioning',
                key: 'air_conditioning',
                type: client_1.AttributeType.BOOLEAN,
                dataType: client_1.AttributeDataType.BOOLEAN,
                required: false,
                searchable: true,
                displayOrder: 13
            },
            {
                name: 'Elevator',
                key: 'elevator',
                type: client_1.AttributeType.BOOLEAN,
                dataType: client_1.AttributeDataType.BOOLEAN,
                required: false,
                searchable: true,
                displayOrder: 14
            },
            {
                name: 'Balcony/Terrace',
                key: 'balcony_terrace',
                type: client_1.AttributeType.BOOLEAN,
                dataType: client_1.AttributeDataType.BOOLEAN,
                required: false,
                searchable: true,
                displayOrder: 15
            },
            {
                name: 'Garden/Patio',
                key: 'garden_patio',
                type: client_1.AttributeType.BOOLEAN,
                dataType: client_1.AttributeDataType.BOOLEAN,
                required: false,
                searchable: true,
                displayOrder: 16
            },
            {
                name: 'Pet Allowed',
                key: 'pet_allowed',
                type: client_1.AttributeType.BOOLEAN,
                dataType: client_1.AttributeDataType.BOOLEAN,
                required: false,
                searchable: true,
                displayOrder: 17
            }
        ];
        for (const attr of realEstateAttributes) {
            await prisma.categoryAttribute.upsert({
                where: {
                    categoryId_key: {
                        categoryId: realEstateCategory.id,
                        key: attr.key
                    }
                },
                update: {},
                create: {
                    categoryId: realEstateCategory.id,
                    ...attr
                }
            });
        }
    }
    const vehiclesCategory = createdCategories.get('vehicles');
    if (vehiclesCategory) {
        const vehicleAttributes = [
            {
                name: 'Vehicle Type',
                key: 'vehicle_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['car', 'motorcycle', 'truck', 'commercial', 'agricultural', 'industrial', 'marine'],
                displayOrder: 1
            },
            {
                name: 'Make',
                key: 'make',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                placeholder: 'Vehicle make (e.g., Toyota, Honda)',
                displayOrder: 2
            },
            {
                name: 'Model',
                key: 'model',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                placeholder: 'Vehicle model',
                displayOrder: 3
            },
            {
                name: 'Year',
                key: 'year',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: true,
                searchable: true,
                sortable: true,
                validation: { min: 1900, max: new Date().getFullYear() + 2 },
                placeholder: 'Manufacturing year',
                displayOrder: 4
            },
            {
                name: 'Mileage',
                key: 'mileage',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: true,
                searchable: true,
                sortable: true,
                unit: 'km',
                validation: { min: 0, max: 1000000 },
                placeholder: 'Vehicle mileage',
                displayOrder: 5
            },
            {
                name: 'Fuel Type',
                key: 'fuel_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['petrol', 'diesel', 'hybrid', 'electric', 'lpg', 'cng'],
                displayOrder: 6
            },
            {
                name: 'Transmission',
                key: 'transmission',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['manual', 'automatic', 'cvt', 'dct'],
                displayOrder: 7
            },
            {
                name: 'Body Type',
                key: 'body_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['sedan', 'suv', 'hatchback', 'coupe', 'van', 'pickup', 'convertible', 'wagon'],
                displayOrder: 8
            },
            {
                name: 'Engine Power',
                key: 'engine_power',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.INTEGER,
                required: false,
                searchable: true,
                sortable: true,
                unit: 'HP',
                validation: { min: 1, max: 2000 },
                placeholder: 'Engine power in HP',
                displayOrder: 9
            },
            {
                name: 'Engine Displacement',
                key: 'engine_displacement',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.DECIMAL,
                required: false,
                searchable: true,
                unit: 'L',
                validation: { min: 0.1, max: 20 },
                placeholder: 'Engine displacement in liters',
                displayOrder: 10
            }
        ];
        for (const attr of vehicleAttributes) {
            await prisma.categoryAttribute.upsert({
                where: {
                    categoryId_key: {
                        categoryId: vehiclesCategory.id,
                        key: attr.key
                    }
                },
                update: {},
                create: {
                    categoryId: vehiclesCategory.id,
                    ...attr
                }
            });
        }
    }
    const electronicsCategory = createdCategories.get('electronics');
    if (electronicsCategory) {
        const electronicsAttributes = [
            {
                name: 'Brand',
                key: 'brand',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                placeholder: 'e.g., Samsung, LG, Sony',
                displayOrder: 1,
            },
            {
                name: 'Model',
                key: 'model',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                placeholder: 'Model name/number',
                displayOrder: 2,
            },
            {
                name: 'Warranty',
                key: 'warranty',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                options: ['no_warranty', '3_months', '6_months', '12_months', '24_months'],
                displayOrder: 3,
            },
        ];
        for (const attr of electronicsAttributes) {
            await prisma.categoryAttribute.upsert({
                where: {
                    categoryId_key: {
                        categoryId: electronicsCategory.id,
                        key: attr.key,
                    },
                },
                update: {},
                create: { categoryId: electronicsCategory.id, ...attr },
            });
        }
        const televisions = createdSubcategories.get('televisions');
        if (televisions) {
            const tvAttrs = [
                {
                    name: 'Screen Size',
                    key: 'screen_size',
                    type: client_1.AttributeType.NUMBER,
                    dataType: client_1.AttributeDataType.INTEGER,
                    required: false,
                    searchable: true,
                    unit: 'in',
                    validation: { min: 19, max: 105 },
                    placeholder: 'e.g., 55',
                    displayOrder: 1,
                },
                {
                    name: 'Resolution',
                    key: 'resolution',
                    type: client_1.AttributeType.SELECT,
                    dataType: client_1.AttributeDataType.STRING,
                    required: false,
                    searchable: true,
                    options: ['HD', 'Full HD', '4K', '8K'],
                    displayOrder: 2,
                },
                {
                    name: 'Panel Type',
                    key: 'panel_type',
                    type: client_1.AttributeType.SELECT,
                    dataType: client_1.AttributeDataType.STRING,
                    required: false,
                    searchable: true,
                    options: ['LED', 'QLED', 'OLED'],
                    displayOrder: 3,
                },
            ];
            for (const attr of tvAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: {
                        categoryId_key: { categoryId: televisions.id, key: attr.key },
                    },
                    update: {},
                    create: { categoryId: televisions.id, ...attr },
                });
            }
        }
        const refrigerators = createdSubcategories.get('refrigerators-and-freezers');
        if (refrigerators) {
            const refAttrs = [
                {
                    name: 'Type',
                    key: 'refrigerator_type',
                    type: client_1.AttributeType.SELECT,
                    dataType: client_1.AttributeDataType.STRING,
                    required: false,
                    searchable: true,
                    options: ['top_freezer', 'bottom_freezer', 'french_door', 'side_by_side', 'chest_freezer'],
                    displayOrder: 1,
                },
                {
                    name: 'Capacity',
                    key: 'capacity_liters',
                    type: client_1.AttributeType.NUMBER,
                    dataType: client_1.AttributeDataType.INTEGER,
                    required: false,
                    searchable: true,
                    unit: 'L',
                    validation: { min: 50, max: 1000 },
                    displayOrder: 2,
                },
            ];
            for (const attr of refAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: {
                        categoryId_key: { categoryId: refrigerators.id, key: attr.key },
                    },
                    update: {},
                    create: { categoryId: refrigerators.id, ...attr },
                });
            }
        }
    }
    const furnitureCategory = createdCategories.get('furniture');
    if (furnitureCategory) {
        const furnitureAttributes = [
            {
                name: 'Item Type',
                key: 'item_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['bed', 'wardrobe', 'dresser', 'nightstand', 'mattress', 'sofa', 'table', 'chair', 'set', 'other'],
                displayOrder: 1,
            },
            {
                name: 'Material',
                key: 'material',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                options: ['wood', 'metal', 'glass', 'fabric', 'leather', 'plastic', 'other'],
                displayOrder: 2,
            },
            {
                name: 'Color/Finish',
                key: 'color',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                displayOrder: 3,
            },
            {
                name: 'Length',
                key: 'length',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.DECIMAL,
                required: false,
                searchable: false,
                unit: 'cm',
                validation: { min: 1, max: 1000, decimalPlaces: 1 },
                displayOrder: 4,
            },
            {
                name: 'Width',
                key: 'width',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.DECIMAL,
                required: false,
                searchable: false,
                unit: 'cm',
                validation: { min: 1, max: 1000, decimalPlaces: 1 },
                displayOrder: 5,
            },
            {
                name: 'Height',
                key: 'height',
                type: client_1.AttributeType.NUMBER,
                dataType: client_1.AttributeDataType.DECIMAL,
                required: false,
                searchable: false,
                unit: 'cm',
                validation: { min: 1, max: 1000, decimalPlaces: 1 },
                displayOrder: 6,
            },
        ];
        for (const attr of furnitureAttributes) {
            await prisma.categoryAttribute.upsert({
                where: { categoryId_key: { categoryId: furnitureCategory.id, key: attr.key } },
                update: {},
                create: { categoryId: furnitureCategory.id, ...attr },
            });
        }
    }
    const clothingCategory = createdCategories.get('clothing');
    if (clothingCategory) {
        const clothingAttributes = [
            {
                name: 'Category',
                key: 'fashion_category',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['men', 'women', 'kids'],
                displayOrder: 1,
            },
            {
                name: 'Item Type',
                key: 'item_type',
                type: client_1.AttributeType.SELECT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                options: ['shirt', 'pants', 'dress', 'shoes', 'accessories', 'outerwear', 'other'],
                displayOrder: 2,
            },
            {
                name: 'Size',
                key: 'size',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: true,
                searchable: true,
                placeholder: 'e.g., S, M, 42 EU',
                displayOrder: 3,
            },
            {
                name: 'Brand',
                key: 'brand',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                placeholder: 'Brand name',
                displayOrder: 4,
            },
            {
                name: 'Material',
                key: 'material',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                displayOrder: 5,
            },
            {
                name: 'Color',
                key: 'color',
                type: client_1.AttributeType.TEXT,
                dataType: client_1.AttributeDataType.STRING,
                required: false,
                searchable: true,
                displayOrder: 6,
            },
        ];
        for (const attr of clothingAttributes) {
            await prisma.categoryAttribute.upsert({
                where: { categoryId_key: { categoryId: clothingCategory.id, key: attr.key } },
                update: {},
                create: { categoryId: clothingCategory.id, ...attr },
            });
        }
    }
    if (vehiclesCategory) {
        const cars = createdSubcategories.get('cars');
        if (cars) {
            const carAttrs = [
                { name: 'Drive Type', key: 'drive_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['fwd', 'rwd', 'awd', '4x4'], displayOrder: 1 },
                { name: 'Doors', key: 'doors', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.INTEGER, required: false, searchable: true, validation: { min: 2, max: 6 }, displayOrder: 2 },
                { name: 'Seats', key: 'seats', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.INTEGER, required: false, searchable: true, validation: { min: 2, max: 9 }, displayOrder: 3 },
                { name: 'Color', key: 'color', type: client_1.AttributeType.TEXT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, displayOrder: 4 },
                { name: 'Trim', key: 'trim', type: client_1.AttributeType.TEXT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, displayOrder: 5 },
            ];
            for (const attr of carAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: { categoryId_key: { categoryId: cars.id, key: attr.key } },
                    update: {},
                    create: { categoryId: cars.id, ...attr },
                });
            }
        }
        const trucks = createdSubcategories.get('trucks-and-commercial-vehicles');
        if (trucks) {
            const truckAttrs = [
                { name: 'GVWR', key: 'gvwr', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.DECIMAL, required: false, searchable: true, unit: 'kg', validation: { min: 1000, max: 40000, decimalPlaces: 0 }, displayOrder: 1 },
                { name: 'Payload', key: 'payload', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.INTEGER, required: false, searchable: true, unit: 'kg', validation: { min: 0, max: 30000 }, displayOrder: 2 },
                { name: 'Wheelbase', key: 'wheelbase', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.INTEGER, required: false, searchable: false, unit: 'mm', validation: { min: 2000, max: 8000 }, displayOrder: 3 },
                { name: 'Axle Config', key: 'axle_config', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['4x2', '4x4', '6x2', '6x4', '8x4'], displayOrder: 4 },
                { name: 'Liftgate', key: 'liftgate', type: client_1.AttributeType.BOOLEAN, dataType: client_1.AttributeDataType.BOOLEAN, required: false, searchable: true, displayOrder: 5 },
            ];
            for (const attr of truckAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: { categoryId_key: { categoryId: trucks.id, key: attr.key } },
                    update: {},
                    create: { categoryId: trucks.id, ...attr },
                });
            }
        }
        const marine = createdSubcategories.get('marine-vehicles');
        if (marine) {
            const marineAttrs = [
                { name: 'Boat Type', key: 'boat_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['sailboat', 'motorboat', 'yacht', 'inflatable', 'other'], displayOrder: 1 },
                { name: 'Length', key: 'boat_length', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.DECIMAL, required: false, searchable: true, unit: 'ft', validation: { min: 6, max: 200, decimalPlaces: 1 }, displayOrder: 2 },
                { name: 'Engine Type', key: 'engine_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['inboard', 'outboard', 'jet'], displayOrder: 3 },
                { name: 'Engine Hours', key: 'engine_hours', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.INTEGER, required: false, searchable: true, validation: { min: 0, max: 20000 }, displayOrder: 4 },
                { name: 'Trailer Included', key: 'trailer_included', type: client_1.AttributeType.BOOLEAN, dataType: client_1.AttributeDataType.BOOLEAN, required: false, searchable: true, displayOrder: 5 },
            ];
            for (const attr of marineAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: { categoryId_key: { categoryId: marine.id, key: attr.key } },
                    update: {},
                    create: { categoryId: marine.id, ...attr },
                });
            }
        }
    }
    if (realEstateCategory) {
        const apartments = createdSubcategories.get('apartments');
        if (apartments) {
            const aptAttrs = [
                { name: 'Unit Type', key: 'unit_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['studio', '1br', '2br', '3br', '4br_plus'], displayOrder: 1 },
                { name: 'HOA/Maintenance Fee', key: 'maintenance_fee', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.DECIMAL, required: false, searchable: false, unit: 'USD/mo', validation: { min: 0, max: 5000, decimalPlaces: 2 }, displayOrder: 2 },
                { name: 'Elevator', key: 'elevator', type: client_1.AttributeType.BOOLEAN, dataType: client_1.AttributeDataType.BOOLEAN, required: false, searchable: true, displayOrder: 3 },
                { name: 'Balcony', key: 'balcony', type: client_1.AttributeType.BOOLEAN, dataType: client_1.AttributeDataType.BOOLEAN, required: false, searchable: true, displayOrder: 4 },
                { name: 'Parking Type', key: 'parking_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['garage', 'street', 'none'], displayOrder: 5 },
            ];
            for (const attr of aptAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: { categoryId_key: { categoryId: apartments.id, key: attr.key } },
                    update: {},
                    create: { categoryId: apartments.id, ...attr },
                });
            }
        }
        const houses = createdSubcategories.get('houses');
        if (houses) {
            const houseAttrs = [
                { name: 'Lot Size', key: 'lot_size', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.DECIMAL, required: false, searchable: true, unit: 'm²', validation: { min: 1, max: 100000 }, displayOrder: 1 },
                { name: 'Number of Floors', key: 'num_floors', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.INTEGER, required: false, searchable: true, validation: { min: 1, max: 10 }, displayOrder: 2 },
                { name: 'Garage Type', key: 'garage_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['attached', 'detached', 'carport', 'none'], displayOrder: 3 },
                { name: 'Basement', key: 'basement', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['none', 'unfinished', 'finished'], displayOrder: 4 },
            ];
            for (const attr of houseAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: { categoryId_key: { categoryId: houses.id, key: attr.key } },
                    update: {},
                    create: { categoryId: houses.id, ...attr },
                });
            }
        }
        const land = createdSubcategories.get('land');
        if (land) {
            const landAttrs = [
                { name: 'Land Type', key: 'land_type', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['residential', 'commercial', 'agricultural'], displayOrder: 1 },
                { name: 'Zoning', key: 'zoning', type: client_1.AttributeType.TEXT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, displayOrder: 2 },
                { name: 'Frontage', key: 'frontage', type: client_1.AttributeType.NUMBER, dataType: client_1.AttributeDataType.DECIMAL, required: false, searchable: false, unit: 'm', validation: { min: 1, max: 1000, decimalPlaces: 1 }, displayOrder: 3 },
                { name: 'Access Road', key: 'access_road', type: client_1.AttributeType.SELECT, dataType: client_1.AttributeDataType.STRING, required: false, searchable: true, options: ['paved', 'gravel', 'dirt'], displayOrder: 4 },
                { name: 'Utilities', key: 'utilities', type: client_1.AttributeType.MULTISELECT, dataType: client_1.AttributeDataType.JSON, required: false, searchable: true, options: ['water', 'electricity', 'gas', 'sewer', 'internet'], displayOrder: 5 },
            ];
            for (const attr of landAttrs) {
                await prisma.categoryAttribute.upsert({
                    where: { categoryId_key: { categoryId: land.id, key: attr.key } },
                    update: {},
                    create: { categoryId: land.id, ...attr },
                });
            }
        }
    }
}
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
    const user10Password = await argon2.hash('Squirrel.123');
    const user11Password = await argon2.hash('Squirrel.123');
    const user10 = await prisma.user.upsert({
        where: { email: 'pratomoadhe+10@gmail.com' },
        update: {},
        create: {
            email: 'pratomoadhe+10@gmail.com',
            passwordHash: user10Password,
            name: 'User10 test',
            role: client_1.UserRole.USER,
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
            role: client_1.UserRole.USER,
            emailVerified: true,
        },
    });
    console.log('✅ Users created successfully');
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
    const createdCategories = new Map();
    const createdSubcategories = new Map();
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
    console.log('🏷️ Creating category attributes...');
    await createCategoryAttributes(createdCategories, createdSubcategories);
    console.log('✅ Category attributes created successfully');
    const users = [user10, user11];
    let totalProducts = 0;
    for (const user of users) {
        console.log(`📦 Creating products for ${user.name}...`);
        for (const [categorySlug, products] of Object.entries(productData)) {
            const category = createdCategories.get(categorySlug);
            if (!category)
                continue;
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
                        status: client_1.ListingStatus.ACTIVE,
                        isVip: Math.random() > 0.7,
                        isFeatured: Math.random() > 0.8,
                    },
                });
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
    console.log('⭐ Creating sample reviews...');
    const listings = await prisma.listing.findMany({
        take: 20,
        select: { id: true, sellerId: true }
    });
    let totalReviews = 0;
    for (const listing of listings) {
        const numReviews = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numReviews; i++) {
            const reviewerId = i % 2 === 0 ? user10.id : user11.id;
            if (reviewerId === listing.sellerId)
                continue;
            const rating = Math.floor(Math.random() * 3) + 3;
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
    console.log('👁️ Creating sample view tracking...');
    let totalViews = 0;
    for (const listing of listings) {
        const numViews = Math.floor(Math.random() * 41) + 10;
        for (let i = 0; i < numViews; i++) {
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
//# sourceMappingURL=seed.js.map