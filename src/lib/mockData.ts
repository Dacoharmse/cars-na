/**
 * Mock data service for demo vehicles and dealerships
 * Used when database is not available for testing and development
 */

export interface MockDealership {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  color: string;
  vin?: string;
  description: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  isPrivate: boolean;
  status: 'AVAILABLE' | 'SOLD' | 'PENDING' | 'RESERVED';
  isNew: boolean;
  dealerPick: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  dealershipId: string;
  dealership?: MockDealership;
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

// Mock dealerships data
export const MOCK_DEALERSHIPS: MockDealership[] = [
  {
    id: 'premium-motors-id',
    name: 'Premium Motors',
    address: '123 Independence Avenue',
    city: 'Windhoek',
    state: 'Khomas',
    zipCode: '9000',
    phone: '+264 61 123 4567',
    email: 'info@premiummotors.na',
    website: 'https://premiummotors.na',
    description: 'Windhoek\'s premier luxury vehicle dealership specializing in German brands and high-end SUVs.',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-08-01'),
  },
  {
    id: 'city-cars-namibia-id',
    name: 'City Cars Namibia',
    address: '456 Sam Nujoma Avenue',
    city: 'Swakopmund',
    state: 'Erongo',
    zipCode: '9000',
    phone: '+264 64 234 5678',
    email: 'sales@citycars.na',
    website: 'https://citycars.na',
    description: 'Family-focused dealership offering reliable, economical vehicles perfect for first-time buyers.',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: 'auto-palace-id',
    name: 'Auto Palace',
    address: '789 Theo-Ben Gurirab Street',
    city: 'Walvis Bay',
    state: 'Erongo',
    zipCode: '9000',
    phone: '+264 64 345 6789',
    email: 'contact@autopalace.na',
    website: 'https://autopalace.na',
    description: 'Specialized in trucks, commercial vehicles, and off-road vehicles for businesses and adventure seekers.',
    createdAt: new Date('2022-06-20'),
    updatedAt: new Date('2024-08-10'),
  },
  {
    id: 'elite-autos-id',
    name: 'Elite Autos',
    address: '321 Oshakati Main Road',
    city: 'Oshakati',
    state: 'Oshana',
    zipCode: '9000',
    phone: '+264 65 456 7890',
    email: 'info@eliteautos.na',
    website: 'https://eliteautos.na',
    description: 'Performance and luxury vehicle specialists importing high-end sports cars and premium imports.',
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-08-20'),
  },
  {
    id: 'namibia-motors-id',
    name: 'Namibia Motors',
    address: '101 Robert Mugabe Avenue',
    city: 'Windhoek',
    state: 'Khomas',
    zipCode: '9000',
    phone: '+264 61 123 456',
    email: 'info@namibiamotors.na',
    website: 'https://namibiamotors.na',
    description: 'Premium automotive dealer serving Windhoek and surrounding areas since 1995',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2024-08-25'),
  },
];

// Mock vehicles data
export const MOCK_VEHICLES: MockVehicle[] = [
  // Premium Motors - Luxury & German Brands
  {
    id: 'vehicle-1',
    make: 'Mercedes-Benz',
    model: 'E-Class E220d',
    year: 2023,
    price: 899000,
    originalPrice: 950000,
    mileage: 12000,
    color: 'Obsidian Black',
    vin: 'WDD2130461A123456',
    description: 'Pristine Mercedes-Benz E220d with full service history. Executive sedan with premium comfort features.',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: true,
    featured: true,
    viewCount: 234,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-08-25'),
    dealershipId: 'premium-motors-id',
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', isPrimary: false },
      { id: 'img-1-3', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-2',
    make: 'BMW',
    model: 'X5 xDrive40d',
    year: 2022,
    price: 1250000,
    mileage: 25000,
    color: 'Alpine White',
    vin: 'WBAJA7C50NCE12345',
    description: 'Powerful BMW X5 with intelligent all-wheel drive. Perfect for Namibian roads and family adventures.',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: true,
    viewCount: 189,
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-08-20'),
    dealershipId: 'premium-motors-id',
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', isPrimary: false },
      { id: 'img-2-3', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-3',
    make: 'Audi',
    model: 'A4 2.0 TFSI',
    year: 2021,
    price: 675000,
    mileage: 35000,
    color: 'Glacier White',
    vin: 'WAUZZZ8K0MA123456',
    description: 'Elegant Audi A4 with advanced technology package. Excellent fuel economy and luxury features.',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: false,
    viewCount: 156,
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-08-15'),
    dealershipId: 'premium-motors-id',
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-3-2', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },

  // City Cars Namibia - Family & Economy
  {
    id: 'vehicle-4',
    make: 'Toyota',
    model: 'Corolla 1.8 XS',
    year: 2022,
    price: 385000,
    mileage: 18000,
    color: 'Silver Metallic',
    vin: 'JTDEPRAE0NJ123456',
    description: 'Reliable Toyota Corolla perfect for daily commuting. Excellent fuel economy and proven reliability.',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: false,
    viewCount: 145,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-08-10'),
    dealershipId: 'city-cars-namibia-id',
    images: [
      { id: 'img-4-1', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-4-2', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-5',
    make: 'Honda',
    model: 'CR-V 2.0 Comfort',
    year: 2021,
    price: 525000,
    mileage: 32000,
    color: 'Modern Steel',
    vin: 'JHLRW1H50BC123456',
    description: 'Spacious Honda CR-V ideal for families. AWD capability and excellent safety ratings.',
    transmission: 'CVT',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: true,
    viewCount: 203,
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-08-05'),
    dealershipId: 'city-cars-namibia-id',
    images: [
      { id: 'img-5-1', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-5-2', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },

  // Auto Palace - Trucks & Commercial
  {
    id: 'vehicle-6',
    make: 'Ford',
    model: 'Ranger 3.2 XLT',
    year: 2021,
    price: 585000,
    mileage: 55000,
    color: 'Lightning Blue',
    vin: 'AFNXXMPC1LW123456',
    description: 'Tough Ford Ranger ready for work and adventure. 4x4 capability with towing capacity.',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: true,
    viewCount: 178,
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-07-30'),
    dealershipId: 'auto-palace-id',
    images: [
      { id: 'img-6-1', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-6-2', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-7',
    make: 'Toyota',
    model: 'Hilux 2.8 GD-6',
    year: 2022,
    price: 695000,
    mileage: 35000,
    color: 'White',
    vin: 'AHTEB52G7LS123456',
    description: 'Legendary Toyota Hilux reliability. Perfect for business and personal use in challenging conditions.',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: true,
    featured: false,
    viewCount: 267,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-08-01'),
    dealershipId: 'auto-palace-id',
    images: [
      { id: 'img-7-1', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-7-2', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },

  // Elite Autos - Performance & Imports
  {
    id: 'vehicle-8',
    make: 'BMW',
    model: 'M3 Competition',
    year: 2023,
    price: 1650000,
    mileage: 3500,
    color: 'BMW Individual Frozen Dark Grey',
    vin: 'WBSMW9C0PEE123456',
    description: 'Ultimate driving machine. BMW M3 Competition with track-focused performance and luxury.',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: true,
    featured: true,
    viewCount: 412,
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-08-22'),
    dealershipId: 'elite-autos-id',
    images: [
      { id: 'img-8-1', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-8-2', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-9',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2022,
    price: 1950000,
    mileage: 6500,
    color: 'Guards Red',
    vin: 'WP0AB2A99NS123456',
    description: 'Iconic Porsche 911 Carrera S. Timeless design meets cutting-edge performance technology.',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sports Car',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: true,
    featured: true,
    viewCount: 523,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-08-18'),
    dealershipId: 'elite-autos-id',
    images: [
      { id: 'img-9-1', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-9-2', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },

  // Namibia Motors - Mixed Premium Selection
  {
    id: 'vehicle-10',
    make: 'Toyota',
    model: 'Camry 2.5 XS',
    year: 2023,
    price: 580000,
    mileage: 15000,
    color: 'Pearl White',
    vin: 'JTNK4RBE3P3123456',
    description: 'Executive sedan with hybrid efficiency. Toyota Camry combining luxury with environmental consciousness.',
    transmission: 'CVT',
    fuelType: 'Hybrid',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: true,
    viewCount: 47,
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-25'),
    dealershipId: 'namibia-motors-id',
    images: [
      { id: 'img-10-1', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-10-2', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-11',
    make: 'Toyota',
    model: 'Fortuner 2.8 GD-6',
    year: 2020,
    price: 495000,
    mileage: 55000,
    color: 'Silver Metallic',
    vin: 'AHTEB42G0KS123456',
    description: '7-seater family SUV perfect for Namibian adventures. Reliable diesel engine with 4x4 capability.',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: false,
    viewCount: 98,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-08-12'),
    dealershipId: 'namibia-motors-id',
    images: [
      { id: 'img-11-1', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-11-2', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-12',
    make: 'Toyota',
    model: 'Fortuner 2.4 GD-6',
    year: 2021,
    price: 499000,
    mileage: 32000,
    color: 'Charcoal Mica',
    vin: 'AHTEB42G1LS123457',
    description: 'Well-maintained Toyota Fortuner with comprehensive service history. Perfect family vehicle.',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: false,
    viewCount: 123,
    createdAt: new Date('2024-04-22'),
    updatedAt: new Date('2024-08-08'),
    dealershipId: 'namibia-motors-id',
    images: [
      { id: 'img-12-1', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-12-2', url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-13',
    make: 'Toyota',
    model: 'Hilux 2.8 GD-6',
    year: 2019,
    price: 399900,
    mileage: 67000,
    color: 'White',
    vin: 'AHTEB52G1KS123458',
    description: 'Proven Toyota Hilux workhorse. Ideal for both business and leisure activities.',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: false,
    viewCount: 87,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-07-28'),
    dealershipId: 'namibia-motors-id',
    images: [
      { id: 'img-13-1', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-13-2', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
  {
    id: 'vehicle-14',
    make: 'Toyota',
    model: 'Corolla Cross 1.8 XS',
    year: 2024,
    price: 499995,
    mileage: 5000,
    color: 'Red Mica Metallic',
    vin: 'MZEA12L0PMA123460',
    description: 'Latest Toyota Corolla Cross with modern technology. Compact SUV with big capabilities.',
    transmission: 'CVT',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: true,
    viewCount: 201,
    createdAt: new Date('2024-07-05'),
    updatedAt: new Date('2024-08-20'),
    dealershipId: 'namibia-motors-id',
    images: [
      { id: 'img-14-1', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', isPrimary: true },
      { id: 'img-14-2', url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', isPrimary: false },
    ],
  },
];

// Helper functions to get dealership data
export const getDealershipById = (id: string): MockDealership | undefined => {
  return MOCK_DEALERSHIPS.find(d => d.id === id);
};

export const getDealershipByName = (name: string): MockDealership | undefined => {
  return MOCK_DEALERSHIPS.find(d => 
    d.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase()
  );
};

// Helper functions to get vehicle data with dealership info
export const getVehiclesWithDealership = (): MockVehicle[] => {
  return MOCK_VEHICLES.map(vehicle => ({
    ...vehicle,
    dealership: getDealershipById(vehicle.dealershipId)
  }));
};

export const getVehicleById = (id: string): MockVehicle | undefined => {
  const vehicle = MOCK_VEHICLES.find(v => v.id === id);
  if (vehicle) {
    return {
      ...vehicle,
      dealership: getDealershipById(vehicle.dealershipId)
    };
  }
  return undefined;
};

export const getVehiclesByDealership = (dealershipId: string): MockVehicle[] => {
  return MOCK_VEHICLES
    .filter(v => v.dealershipId === dealershipId)
    .map(vehicle => ({
      ...vehicle,
      dealership: getDealershipById(vehicle.dealershipId)
    }));
};

export const getVehiclesByDealershipName = (dealershipName: string): MockVehicle[] => {
  const dealership = getDealershipByName(dealershipName);
  if (dealership) {
    return getVehiclesByDealership(dealership.id);
  }
  return [];
};

// Filter and search functions
export const filterVehicles = (filters: {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  dealershipId?: string;
  search?: string;
  location?: string;
}): MockVehicle[] => {
  let filtered = getVehiclesWithDealership();

  // Search query filter
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim();
    filtered = filtered.filter(v => 
      v.make.toLowerCase().includes(searchTerm) ||
      v.model.toLowerCase().includes(searchTerm) ||
      `${v.make} ${v.model}`.toLowerCase().includes(searchTerm) ||
      `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(searchTerm) ||
      v.description.toLowerCase().includes(searchTerm) ||
      v.bodyType.toLowerCase().includes(searchTerm) ||
      v.fuelType.toLowerCase().includes(searchTerm) ||
      v.transmission.toLowerCase().includes(searchTerm)
    );
  }

  // Location filter (filter by dealership city)
  if (filters.location) {
    const locationMap: Record<string, string[]> = {
      'windhoek': ['premium-motors-id', 'namibia-motors-id'],
      'swakopmund': ['city-cars-namibia-id'],
      'walvis-bay': ['auto-palace-id'],
      'oshakati': ['elite-autos-id'],
    };
    
    const dealershipIds = locationMap[filters.location.toLowerCase()] || [];
    if (dealershipIds.length > 0) {
      filtered = filtered.filter(v => dealershipIds.includes(v.dealershipId));
    }
  }

  if (filters.make) {
    filtered = filtered.filter(v => 
      v.make.toLowerCase() === filters.make!.toLowerCase()
    );
  }

  if (filters.model) {
    filtered = filtered.filter(v =>
      v.model.toLowerCase().includes(filters.model!.toLowerCase())
    );
  }

  if (filters.minYear) {
    filtered = filtered.filter(v => v.year >= filters.minYear!);
  }

  if (filters.maxYear) {
    filtered = filtered.filter(v => v.year <= filters.maxYear!);
  }

  if (filters.minPrice) {
    filtered = filtered.filter(v => v.price >= filters.minPrice!);
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(v => v.price <= filters.maxPrice!);
  }

  if (filters.minMileage) {
    filtered = filtered.filter(v => v.mileage >= filters.minMileage!);
  }

  if (filters.maxMileage) {
    filtered = filtered.filter(v => v.mileage <= filters.maxMileage!);
  }

  if (filters.dealershipId) {
    filtered = filtered.filter(v => v.dealershipId === filters.dealershipId!);
  }

  return filtered;
};

// Get showcase vehicles
export const getFeaturedVehicles = (limit: number = 4): MockVehicle[] => {
  return getVehiclesWithDealership()
    .filter(v => v.featured)
    .slice(0, limit);
};

export const getDealerPickVehicles = (limit: number = 4): MockVehicle[] => {
  return getVehiclesWithDealership()
    .filter(v => v.dealerPick)
    .slice(0, limit);
};

export const getMostViewedVehicles = (limit: number = 4): MockVehicle[] => {
  return getVehiclesWithDealership()
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
};

export const getNewListings = (limit: number = 4): MockVehicle[] => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setHours(threeDaysAgo.getHours() - 72);
  
  return getVehiclesWithDealership()
    .filter(v => v.createdAt >= threeDaysAgo)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};