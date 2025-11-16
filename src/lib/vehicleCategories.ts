// Vehicle categories and their manufacturers

export const VEHICLE_CATEGORIES = {
  CARS: {
    label: 'Cars',
    description: 'Passenger vehicles, sedans, hatchbacks, SUVs',
    manufacturers: [
      'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Porsche',
      'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Lexus',
      'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Jeep', 'Dodge', 'RAM',
      'Volvo', 'Land Rover', 'Jaguar', 'Alfa Romeo', 'Fiat',
      'Peugeot', 'Renault', 'Citroën', 'Opel',
      'Tesla', 'Rivian', 'Lucid', 'Polestar',
      'Suzuki', 'Isuzu', 'Mahindra', 'Tata', 'Other'
    ],
    fields: ['engineCapacity', 'horsepower', 'transmission', 'fuelType', 'bodyType', 'mileage']
  },

  TRUCKS: {
    label: 'Trucks',
    description: 'Pickup trucks, delivery vehicles, commercial trucks',
    manufacturers: [
      'Toyota', 'Ford', 'Chevrolet', 'RAM', 'GMC', 'Nissan',
      'Isuzu', 'Mitsubishi', 'Mazda', 'Volkswagen',
      'Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Iveco',
      'Freightliner', 'Kenworth', 'Peterbilt', 'Mack',
      'Hino', 'Fuso', 'UD Trucks',
      'Tata', 'Mahindra', 'Ashok Leyland', 'Other'
    ],
    fields: ['engineCapacity', 'horsepower', 'loadCapacity', 'transmission', 'fuelType', 'mileage']
  },

  MOTORCYCLES: {
    label: 'Motorcycles & Bikes',
    description: 'Motorcycles, scooters, bicycles, ATVs',
    manufacturers: [
      // Motorcycles
      'Honda', 'Yamaha', 'Suzuki', 'Kawasaki',
      'Harley-Davidson', 'BMW', 'Ducati', 'Triumph', 'KTM',
      'Aprilia', 'MV Agusta', 'Royal Enfield',
      // Scooters
      'Vespa', 'Piaggio', 'SYM', 'Kymco',
      // ATVs
      'Can-Am', 'Polaris', 'Arctic Cat', 'Yamaha',
      // Bicycles
      'Trek', 'Giant', 'Specialized', 'Cannondale', 'Scott',
      'Other'
    ],
    fields: ['engineCapacity', 'horsepower', 'transmission', 'fuelType', 'mileage']
  },

  BUSES: {
    label: 'Buses & Passenger Vehicles',
    description: 'Passenger buses, minibuses, coaches',
    manufacturers: [
      'Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'Iveco',
      'Toyota', 'Nissan', 'Mitsubishi', 'Isuzu', 'Hino', 'Fuso',
      'Yutong', 'King Long', 'Golden Dragon', 'Zhongtong',
      'Ashok Leyland', 'Tata', 'Eicher',
      'Setra', 'Neoplan', 'Van Hool', 'Temsa',
      'Other'
    ],
    fields: ['engineCapacity', 'passengerCapacity', 'transmission', 'fuelType', 'mileage']
  },

  INDUSTRIAL_MACHINERY: {
    label: 'Industrial Machinery',
    description: 'Construction equipment, industrial machines',
    manufacturers: [
      'Caterpillar', 'Komatsu', 'Volvo CE', 'Liebherr', 'Hitachi',
      'JCB', 'Case', 'New Holland', 'Bobcat', 'Doosan',
      'Hyundai Heavy Industries', 'SANY', 'XCMG', 'Zoomlion', 'LiuGong',
      'Terex', 'Manitou', 'JLG', 'Genie',
      'Atlas Copco', 'Sandvik', 'Epiroc',
      'Other'
    ],
    fields: ['weight', 'horsepower', 'engineCapacity', 'fuelType']
  },

  TRACTORS: {
    label: 'Tractors & Farm Equipment',
    description: 'Agricultural tractors, farm machinery',
    manufacturers: [
      'John Deere', 'Massey Ferguson', 'New Holland', 'Case IH', 'Kubota',
      'Fendt', 'Claas', 'Deutz-Fahr', 'Valtra', 'Same',
      'Landini', 'McCormick', 'Mahindra', 'Farmtrac', 'Swaraj',
      'LS Tractor', 'Kioti', 'Yanmar', 'Iseki',
      'JCB', 'Argo Tractors', 'Zetor',
      'Other'
    ],
    fields: ['horsepower', 'engineCapacity', 'fuelType', 'mileage']
  },

  BOATS: {
    label: 'Boats & Marine',
    description: 'Boats, jet-skis, marine equipment',
    manufacturers: [
      // Boats
      'Bayliner', 'Sea Ray', 'Boston Whaler', 'Grady-White',
      'Yamaha', 'Suzuki', 'Mercury', 'Honda',
      'Beneteau', 'Jeanneau', 'Bavaria', 'Hanse',
      'Princess', 'Sunseeker', 'Azimut', 'Ferretti',
      'Chris-Craft', 'Chaparral', 'Cobalt', 'Mastercraft',
      // Jet Skis
      'Sea-Doo', 'Yamaha WaveRunner', 'Kawasaki Jet Ski',
      'Other'
    ],
    fields: ['length', 'horsepower', 'fuelType', 'engineCapacity']
  },

  ACCESSORIES: {
    label: 'Accessories & Parts',
    description: 'Vehicle parts, accessories, equipment',
    manufacturers: [
      'Bosch', 'Denso', 'Delphi', 'Continental', 'Valeo',
      'Brembo', 'Akebono', 'NGK', 'Champion',
      'Michelin', 'Bridgestone', 'Goodyear', 'Pirelli',
      'Bilstein', 'KYB', 'Monroe', 'Koni',
      'K&N', 'Mann Filter', 'Wix', 'Fram',
      'Alpine', 'Pioneer', 'JBL', 'Sony',
      'Thule', 'Yakima', 'WeatherTech',
      'OEM', 'Aftermarket', 'Other'
    ],
    fields: ['description'] // Accessories have flexible fields
  }
} as const;

export type VehicleCategoryKey = keyof typeof VEHICLE_CATEGORIES;

// Helper function to get manufacturers for a category
export function getManufacturers(category: VehicleCategoryKey): string[] {
  return VEHICLE_CATEGORIES[category].manufacturers;
}

// Helper function to get required fields for a category
export function getCategoryFields(category: VehicleCategoryKey): string[] {
  return VEHICLE_CATEGORIES[category].fields;
}

// Body types for cars
export const CAR_BODY_TYPES = [
  'Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible',
  'Wagon', 'Van', 'Minivan', 'Pickup', 'Sports Car', 'Luxury'
];

// Fuel types
export const FUEL_TYPES = [
  'Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid',
  'CNG', 'LPG', 'Hydrogen', 'Ethanol'
];

// Transmission types
export const TRANSMISSION_TYPES = [
  'Automatic', 'Manual', 'CVT', 'Semi-Automatic', 'Dual-Clutch'
];

// Comfort features
export const COMFORT_FEATURES = [
  'Air Conditioning', 'Climate Control', 'Cruise Control',
  'Navigation System', 'Central Locking', 'Electric Windows',
  'Sunroof', 'Panoramic Roof', 'Leather Interior', 'Heated Seats',
  'Ventilated Seats', 'Electric Seats', 'Memory Seats',
  'Rear Camera', 'Parking Sensors', 'Bluetooth', 'USB Ports',
  'Wireless Charging', 'Premium Sound System'
];

// Safety features
export const SAFETY_FEATURES = [
  'Air Bags', 'ABS Brakes', 'Stability Control', 'Traction Control',
  'Alarm System', 'Immobilizer', 'Fog Lights', 'LED Lights',
  'Blind Spot Monitor', 'Lane Departure Warning', 'Collision Warning',
  'Adaptive Cruise Control', 'Emergency Braking', 'Tire Pressure Monitor'
];
