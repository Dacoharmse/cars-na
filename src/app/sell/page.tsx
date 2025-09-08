'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { 
  User, 
  Car, 
  Camera, 
  Eye, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Truck,
  Bike,
  Anchor,
  Wrench,
  Tractor,
  Bus,
  Package,
  Users
} from 'lucide-react';

// Category definitions
const CATEGORIES = {
  cars: {
    name: 'Cars',
    icon: Car,
    description: 'Passenger vehicles, sedans, hatchbacks, SUVs'
  },
  trucks: {
    name: 'Trucks',
    icon: Truck,
    description: 'Pickup trucks, delivery vehicles, commercial trucks'
  },
  bikes: {
    name: 'Motorcycles & Bikes',
    icon: Bike,
    description: 'Motorcycles, scooters, bicycles, ATVs'
  },
  buses: {
    name: 'Buses & Passenger Vehicles',
    icon: Bus,
    description: 'Passenger buses, minibuses, coaches'
  },
  machinery: {
    name: 'Industrial Machinery',
    icon: Wrench,
    description: 'Construction equipment, industrial machines'
  },
  tractors: {
    name: 'Tractors & Farm Equipment',
    icon: Tractor,
    description: 'Agricultural tractors, farm machinery'
  },
  boats: {
    name: 'Boats & Marine',
    icon: Anchor,
    description: 'Boats, jet-skis, marine equipment'
  },
  accessories: {
    name: 'Accessories & Parts',
    icon: Package,
    description: 'Vehicle parts, accessories, equipment'
  }
};

// Image Preview Component for upload step
function ImagePreview({ 
  image, 
  index, 
  onRemove, 
  isMain, 
  onSetMain 
}: { 
  image: File; 
  index: number; 
  onRemove: () => void;
  isMain: boolean;
  onSetMain: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string>('');
  
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(image);
    
    return () => {
      setImageSrc('');
    };
  }, [image]);

  return (
    <div className="relative group">
      <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${
        isMain ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Vehicle ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Camera className="w-8 h-8" />
          </div>
        )}
        {isMain && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Main
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isMain && (
          <button
            onClick={onSetMain}
            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors shadow-lg text-xs"
            title="Set as main image"
          >
            <Eye className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
          title="Remove image"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center truncate">
        {image.name}
        {isMain && <span className="text-blue-600 font-medium"> (Main)</span>}
      </div>
    </div>
  );
}

// Image Preview Component for review step (read-only)
function ReviewImagePreview({ 
  image, 
  index, 
  isMain 
}: { 
  image: File; 
  index: number; 
  isMain: boolean;
}) {
  const [imageSrc, setImageSrc] = useState<string>('');
  
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(image);
    
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [image]);

  return (
    <div className="relative">
      <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${
        isMain ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Vehicle ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Camera className="w-6 h-6" />
          </div>
        )}
        {isMain && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Main
          </div>
        )}
      </div>
    </div>
  );
}

// This is a public form for car sellers to submit their vehicles to dealers

interface FormData {
  // Step 1: Seller Contact Details
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerLocation: string;
  category: string;
  
  // Step 2: Vehicle Information (dynamic based on category)
  manufacturer: string;
  model: string;
  year: string;
  price: string;
  description: string;
  
  // Category-specific fields
  mileage?: string;
  engineCapacity?: string;
  fuelType?: string;
  transmission?: string;
  drivingSide?: string;
  bodyType?: string;
  doors?: string;
  seats?: string;
  condition?: string;
  
  // Step 3: Features & Options
  features: string[];
  
  // Step 4: Images
  images: File[];
  mainImageIndex: number;
}

export default function SellYourCarWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1: Seller Contact Details
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    sellerLocation: '',
    category: '',
    
    // Step 2: Vehicle Information
    manufacturer: '',
    model: '',
    year: '',
    price: '',
    description: '',
    
    // Step 3: Features
    features: [],
    
    // Step 4: Images
    images: [],
    mainImageIndex: 0
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // tRPC mutation for creating vehicle listing  
  const createVehicle = api.vehicle.create.useMutation({
    onSuccess: (data) => {
      alert('Vehicle listing submitted successfully! Your listing is now being reviewed.');
      // Reset form
      setFormData({
        sellerName: '',
        sellerPhone: '',
        sellerEmail: '',
        sellerLocation: '',
        category: '',
        manufacturer: '',
        model: '',
        year: '',
        price: '',
        description: '',
        features: [],
        images: [],
        mainImageIndex: 0
      });
      setCurrentStep(1);
    },
    onError: (error) => {
      alert(`Error submitting listing: ${error.message}`);
    }
  });

  const handleSubmit = () => {
    if (!formData.sellerName || !formData.manufacturer || !formData.model || !formData.year || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert form data to API format
    const vehicleData = {
      make: formData.manufacturer,
      model: formData.model,
      year: parseInt(formData.year),
      price: parseInt(formData.price),
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
      transmission: formData.transmission || 'MANUAL',
      fuelType: formData.fuelType || 'PETROL',
      color: 'Unknown', // Could add color field to form
      description: formData.description,
      status: 'PENDING' as const, // For review
      images: [], // TODO: Handle image upload
      
      // Seller contact info (for lead generation)
      sellerContact: {
        name: formData.sellerName,
        email: formData.sellerEmail,
        phone: formData.sellerPhone,
        location: formData.sellerLocation,
      }
    };

    createVehicle.mutate(vehicleData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Vehicle</h1>
          <p className="text-lg text-gray-600">Professional multi-category listing wizard</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {step === 1 && 'Setup'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Features'}
                  {step === 4 && 'Photos'}
                  {step === 5 && 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <Step1SellerDetailsAndCategory 
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2VehicleDetails 
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <Step3Features 
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <Step4Images 
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 5 && (
              <Step5Review 
                formData={formData}
                onSubmit={handleSubmit}
                onPrev={prevStep}
                isSubmitting={createVehicle.isLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step 1: Seller Contact Details & Category Selection
function Step1SellerDetailsAndCategory({ 
  formData, 
  updateFormData, 
  onNext 
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  onNext: () => void;
}) {
  const canProceed = formData.sellerName && formData.sellerPhone && formData.sellerEmail && formData.category;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sell Your Vehicle</h2>
        <p className="text-gray-600">Tell us about yourself and your vehicle to get started</p>
      </div>

      {/* Seller Contact Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <User className="inline w-4 h-4 mr-2" />
          Your Contact Information
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <Input
              value={formData.sellerName}
              onChange={(e) => updateFormData('sellerName', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <Input
              value={formData.sellerPhone}
              onChange={(e) => updateFormData('sellerPhone', e.target.value)}
              placeholder="+264 81 123 4567"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <Input
              type="email"
              value={formData.sellerEmail}
              onChange={(e) => updateFormData('sellerEmail', e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              value={formData.sellerLocation}
              onChange={(e) => updateFormData('sellerLocation', e.target.value)}
              placeholder="Windhoek, Namibia"
            />
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Vehicle Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CATEGORIES).map(([key, category]) => {
            const IconComponent = category.icon;
            const isSelected = formData.category === key;
            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'ring-4 ring-blue-300 bg-blue-50 border-blue-500'
                    : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
                }`}
                onClick={() => {
                  console.log('Category clicked:', key);
                  console.log('Current category before update:', formData.category);
                  updateFormData('category', key);
                  console.log('Category should now be:', key);
                }}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                    isSelected ? 'text-blue-700' : 'text-blue-600'
                  }`} />
                  <h3 className={`font-semibold text-sm mb-1 ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.description}
                  </p>
                  {isSelected && (
                    <div className="mt-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />
                      <span className="text-xs text-blue-600 font-medium">Selected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200 bg-white">
        {console.log('Rendering button - canProceed:', canProceed)}
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 text-base font-semibold shadow-lg border ${
            !canProceed 
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
          }`}
          style={{ minHeight: '48px', minWidth: '150px' }}
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-400 mt-2">
        Debug: Name: {formData.sellerName ? '✓' : '✗'}, Phone: {formData.sellerPhone ? '✓' : '✗'}, Email: {formData.sellerEmail ? '✓' : '✗'}, Category: {formData.category ? '✓' : '✗'}, Can Proceed: {canProceed ? '✓' : '✗'}
      </div>
    </div>
  );
}

// Popular car manufacturers list
const POPULAR_MANUFACTURERS = [
  'Toyota', 'BMW', 'Ford', 'Honda', 'Nissan', 'Mercedes-Benz', 'Audi', 'Volkswagen',
  'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Volvo', 'Jeep', 'Land Rover',
  'Porsche', 'Chevrolet', 'Peugeot', 'Renault', 'Mitsubishi', 'Suzuki', 'Isuzu',
  'Daihatsu', 'Opel', 'Fiat', 'Alfa Romeo', 'Jaguar', 'Infiniti', 'Acura'
];

// Step 2: Vehicle Details (Dynamic based on category)
function Step2VehicleDetails({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const categoryName = CATEGORIES[formData.category as keyof typeof CATEGORIES]?.name || 'Vehicle';
  const [showOtherManufacturer, setShowOtherManufacturer] = useState(false);
  
  const canProceed = formData.manufacturer && formData.model && formData.year && formData.price;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{categoryName} Details</h2>
        <p className="text-gray-600">Enter the basic information about your {categoryName.toLowerCase()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md"
            value={POPULAR_MANUFACTURERS.includes(formData.manufacturer) ? formData.manufacturer : (formData.manufacturer ? 'Other' : '')}
            onChange={(e) => {
              if (e.target.value === 'Other') {
                setShowOtherManufacturer(true);
                updateFormData('manufacturer', '');
              } else {
                setShowOtherManufacturer(false);
                updateFormData('manufacturer', e.target.value);
              }
            }}
          >
            <option value="">Select manufacturer</option>
            {POPULAR_MANUFACTURERS.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          
          {showOtherManufacturer && (
            <div className="mt-2">
              <Input
                value={formData.manufacturer}
                onChange={(e) => updateFormData('manufacturer', e.target.value)}
                placeholder="Enter manufacturer name"
                className="border-blue-300 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <Input
            value={formData.model}
            onChange={(e) => updateFormData('model', e.target.value)}
            placeholder="e.g., Camry, X5, F-150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => updateFormData('year', e.target.value)}
            placeholder="2020"
            min="1990"
            max="2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (NAD)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => updateFormData('price', e.target.value)}
            placeholder="250000"
          />
        </div>

        {/* Category-specific fields */}
        {(formData.category === 'cars' || formData.category === 'trucks' || formData.category === 'bikes') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km)</label>
            <Input
              type="number"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData('mileage', e.target.value)}
              placeholder="50000"
            />
          </div>
        )}

        {(formData.category === 'cars' || formData.category === 'trucks') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Engine Capacity</label>
              <Input
                value={formData.engineCapacity || ''}
                onChange={(e) => updateFormData('engineCapacity', e.target.value)}
                placeholder="2.0L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.fuelType || ''}
                onChange={(e) => updateFormData('fuelType', e.target.value)}
              >
                <option value="">Select fuel type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.transmission || ''}
                onChange={(e) => updateFormData('transmission', e.target.value)}
              >
                <option value="">Select transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
                <option value="cvt">CVT</option>
              </select>
            </div>
          </>
        )}

        {formData.category === 'cars' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.bodyType || ''}
                onChange={(e) => updateFormData('bodyType', e.target.value)}
              >
                <option value="">Select body type</option>
                <option value="sedan">Sedan</option>
                <option value="hatchback">Hatchback</option>
                <option value="suv">SUV</option>
                <option value="coupe">Coupe</option>
                <option value="wagon">Wagon</option>
                <option value="convertible">Convertible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Doors</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.doors || ''}
                onChange={(e) => updateFormData('doors', e.target.value)}
              >
                <option value="">Select doors</option>
                <option value="2">2 doors</option>
                <option value="3">3 doors</option>
                <option value="4">4 doors</option>
                <option value="5">5 doors</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md h-32"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe the vehicle's condition, features, and any additional information..."
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button onClick={onPrev} variant="outline" className="px-6 py-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className={`px-8 py-3 text-base font-semibold ${
            !canProceed 
              ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-400 mt-2">
        Debug: Manufacturer: {formData.manufacturer ? '✓' : '✗'}, Model: {formData.model ? '✓' : '✗'}, Year: {formData.year ? '✓' : '✗'}, Price: {formData.price ? '✓' : '✗'}, Can Proceed: {canProceed ? '✓' : '✗'}
      </div>
    </div>
  );
}

// Step 3: Features & Options
function Step3Features({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const availableFeatures = [
    'Air Conditioning', 'Power Steering', 'Electric Windows', 'Central Locking',
    'ABS Brakes', 'Airbags', 'Cruise Control', 'GPS Navigation',
    'Bluetooth', 'USB Ports', 'Backup Camera', 'Parking Sensors',
    'Leather Seats', 'Heated Seats', 'Sunroof', 'Alloy Wheels'
  ];

  const toggleFeature = (feature: string) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    updateFormData('features', updatedFeatures);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Features & Options</h2>
        <p className="text-gray-600">Select all the features your vehicle has</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableFeatures.map((feature) => (
          <div
            key={feature}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              formData.features?.includes(feature)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleFeature(feature)}
          >
            <div className="text-center">
              <span className="text-sm font-medium">{feature}</span>
              {formData.features?.includes(feature) && (
                <CheckCircle className="w-4 h-4 mx-auto mt-1 text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button onClick={onPrev} variant="outline" className="px-6 py-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Step 4: Image Upload
function Step4Images({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrev 
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateFormData('images', [...formData.images, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      updateFormData('images', [...formData.images, ...files]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', updatedImages);
    
    // If removing the main image, set the first remaining image as main
    if (formData.mainImageIndex === index) {
      updateFormData('mainImageIndex', 0);
    } else if (formData.mainImageIndex > index) {
      // Adjust main image index if we removed an image before it
      updateFormData('mainImageIndex', formData.mainImageIndex - 1);
    }
  };

  const setMainImage = (index: number) => {
    updateFormData('mainImageIndex', index);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h2>
        <p className="text-gray-600">Add high-quality images of your vehicle</p>
      </div>

      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Vehicle Photos</h3>
        <p className="text-gray-600 mb-4">Drag and drop or click to select images</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label 
          htmlFor="image-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Images
        </label>
      </div>

      {/* Image Preview */}
      {formData.images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Selected Images ({formData.images.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => {
              return (
                <ImagePreview 
                  key={index} 
                  image={image} 
                  index={index} 
                  onRemove={() => removeImage(index)}
                  isMain={formData.mainImageIndex === index}
                  onSetMain={() => setMainImage(index)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button onClick={onPrev} variant="outline" className="px-6 py-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white">
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Step 5: Review & Submit
function Step5Review({ 
  formData, 
  onSubmit, 
  onPrev,
  isSubmitting = false
}: {
  formData: FormData;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}) {
  const categoryName = CATEGORIES[formData.category as keyof typeof CATEGORIES]?.name || 'Vehicle';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Listing</h2>
        <p className="text-gray-600">Please review all information before publishing</p>
      </div>

      {/* Review Content */}
      <div className="space-y-6">
        {/* Seller Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {formData.sellerName}</p>
            <p><strong>Email:</strong> {formData.sellerEmail}</p>
            <p><strong>Phone:</strong> {formData.sellerPhone}</p>
            {formData.sellerLocation && <p><strong>Location:</strong> {formData.sellerLocation}</p>}
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{categoryName} Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Category:</strong> {categoryName}</p>
              <p><strong>Manufacturer:</strong> {formData.manufacturer}</p>
              <p><strong>Model:</strong> {formData.model}</p>
              <p><strong>Year:</strong> {formData.year}</p>
              <p><strong>Price:</strong> NAD {formData.price}</p>
              {formData.mileage && <p><strong>Mileage:</strong> {formData.mileage} km</p>}
              {formData.engineCapacity && <p><strong>Engine:</strong> {formData.engineCapacity}</p>}
              {formData.fuelType && <p><strong>Fuel Type:</strong> {formData.fuelType}</p>}
            </div>
            {formData.description && (
              <div className="mt-4">
                <strong>Description:</strong>
                <p className="mt-1 text-gray-600">{formData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        {formData.features.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature) => (
                  <Badge key={feature} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images */}
        {formData.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photos ({formData.images.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {formData.images.map((image, index) => (
                  <ReviewImagePreview 
                    key={index} 
                    image={image} 
                    index={index} 
                    isMain={formData.mainImageIndex === index}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button onClick={onPrev} variant="outline" className="px-6 py-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button 
          onClick={onSubmit} 
          className="px-8 py-3 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Publish Listing
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
