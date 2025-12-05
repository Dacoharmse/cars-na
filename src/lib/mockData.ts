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

// Mock vehicles data for showcase display
export const MOCK_VEHICLES: MockVehicle[] = [
  {
    id: 'vehicle-1',
    make: 'Toyota',
    model: 'Fortuner',
    year: 2024,
    price: 550000,
    originalPrice: 580000,
    mileage: 12000,
    color: 'White',
    vin: 'VIN12345',
    description: 'Reliable and spacious SUV perfect for Namibian roads',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: true,
    featured: true,
    viewCount: 245,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-27'),
    dealershipId: 'windhoek-auto-id',
    images: [
      { id: 'img-1', url: 'https://placehold.co/800x600/fff/333?text=Toyota+Fortuner', isPrimary: true },
    ],
  },
  {
    id: 'vehicle-2',
    make: 'BMW',
    model: 'X5',
    year: 2025,
    price: 850000,
    mileage: 0,
    color: 'Black',
    vin: 'VIN23456',
    description: 'Brand new luxury SUV with all premium features',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: true,
    dealerPick: true,
    featured: true,
    viewCount: 380,
    createdAt: new Date('2024-11-26'),
    updatedAt: new Date('2024-11-27'),
    dealershipId: 'elite-autos-id',
    images: [
      { id: 'img-2', url: 'https://placehold.co/800x600/000/fff?text=BMW+X5', isPrimary: true },
    ],
  },
  {
    id: 'vehicle-3',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2024,
    price: 620000,
    originalPrice: 680000,
    mileage: 8500,
    color: 'Silver',
    vin: 'VIN34567',
    description: 'Elegant sedan with low mileage',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: true,
    viewCount: 190,
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-27'),
    dealershipId: 'namibia-motors-id',
    images: [
      { id: 'img-3', url: 'https://placehold.co/800x600/c0c0c0/000?text=Mercedes+C-Class', isPrimary: true },
    ],
  },
  {
    id: 'vehicle-4',
    make: 'Audi',
    model: 'A4',
    year: 2025,
    price: 720000,
    mileage: 0,
    color: 'Blue',
    vin: 'VIN45678',
    description: 'Brand new Audi A4 with cutting-edge technology',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: true,
    dealerPick: true,
    featured: false,
    viewCount: 420,
    createdAt: new Date('2024-11-27'),
    updatedAt: new Date('2024-11-27'),
    dealershipId: 'windhoek-auto-id',
    images: [
      { id: 'img-4', url: 'https://placehold.co/800x600/00f/fff?text=Audi+A4', isPrimary: true },
    ],
  },
  {
    id: 'vehicle-5',
    make: 'Ford',
    model: 'Ranger',
    year: 2023,
    price: 480000,
    originalPrice: 520000,
    mileage: 25000,
    color: 'Red',
    vin: 'VIN56789',
    description: 'Powerful pickup truck for work and adventure',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    isPrivate: false,
    status: 'AVAILABLE',
    isNew: false,
    dealerPick: false,
    featured: false,
    viewCount: 310,
    createdAt: new Date('2024-11-18'),
    updatedAt: new Date('2024-11-27'),
    dealershipId: 'elite-autos-id',
    images: [
      { id: 'img-5', url: 'https://placehold.co/800x600/f00/fff?text=Ford+Ranger', isPrimary: true },
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
  // Handle both 'vehicle-1' and '1' formats
  const normalizedId = id.startsWith('vehicle-') ? id : `vehicle-${id}`;
  const vehicle = MOCK_VEHICLES.find(v => v.id === normalizedId);
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
  featured?: boolean;
  dealerPick?: boolean;
  hasDiscount?: boolean;
  isNew?: boolean;
  sortBy?: string;
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

  // New filters for showcase sections
  if (filters.featured) {
    filtered = filtered.filter(v => v.featured);
  }

  if (filters.dealerPick) {
    filtered = filtered.filter(v => v.dealerPick);
  }

  if (filters.hasDiscount) {
    filtered = filtered.filter(v => v.originalPrice && v.originalPrice > v.price);
  }

  if (filters.isNew !== undefined) {
    filtered = filtered.filter(v => v.isNew === filters.isNew);
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'views':
        filtered = filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popularity':
        filtered = filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
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