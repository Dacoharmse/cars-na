'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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

// Mock salespeople data (in real app, this would come from API)
const SALESPEOPLE = [
  { id: '1', name: 'John Smith', email: 'john@dealership.com', phone: '+264 81 123 4567' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@dealership.com', phone: '+264 81 234 5678' },
  { id: '3', name: 'Mike Wilson', email: 'mike@dealership.com', phone: '+264 81 345 6789' },
  { id: '4', name: 'Lisa Brown', email: 'lisa@dealership.com', phone: '+264 81 456 7890' }
];

// Mock current user (in real app, this would come from session)
const CURRENT_USER = {
  id: '1',
  name: 'John Smith',
  email: 'john@dealership.com',
  phone: '+264 81 123 4567'
};

interface FormData {
  // Step 1: Salesperson & Category
  salespersonId: string;
  salespersonName: string;
  salespersonEmail: string;
  salespersonPhone: string;
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
}

export default function SellYourCarWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1: Salesperson & Category (default to current user)
    salespersonId: CURRENT_USER.id,
    salespersonName: CURRENT_USER.name,
    salespersonEmail: CURRENT_USER.email,
    salespersonPhone: CURRENT_USER.phone,
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
    images: []
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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would submit to your API
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
              <Step1SalespersonAndCategory 
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
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step 1: Salesperson Selection & Category Selection
function Step1SalespersonAndCategory({ 
  formData, 
  updateFormData, 
  onNext 
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  onNext: () => void;
}) {
  const handleSalespersonChange = (salesperson: typeof SALESPEOPLE[0]) => {
    updateFormData('salespersonId', salesperson.id);
    updateFormData('salespersonName', salesperson.name);
    updateFormData('salespersonEmail', salesperson.email);
    updateFormData('salespersonPhone', salesperson.phone);
  };

  const canProceed = formData.salespersonId && formData.category;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Your Listing</h2>
        <p className="text-gray-600">Select the salesperson and vehicle category</p>
      </div>

      {/* Salesperson Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <Users className="inline w-4 h-4 mr-2" />
          Salesperson
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SALESPEOPLE.map((person) => (
            <Card 
              key={person.id}
              className={`cursor-pointer transition-all ${
                formData.salespersonId === person.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSalespersonChange(person)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.email}</p>
                    <p className="text-sm text-gray-500">{person.phone}</p>
                  </div>
                  {formData.salespersonId === person.id && (
                    <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  formData.category === key
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => updateFormData('category', key)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.description}
                  </p>
                  {formData.category === key && (
                    <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mt-2" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 py-2"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

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
          <Input
            value={formData.manufacturer}
            onChange={(e) => updateFormData('manufacturer', e.target.value)}
            placeholder="e.g., Toyota, BMW, Ford"
          />
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
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
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
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext}>
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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateFormData('images', [...formData.images, ...files]);
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', updatedImages);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h2>
        <p className="text-gray-600">Add high-quality images of your vehicle</p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
        <label htmlFor="image-upload">
          <Button type="button" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Choose Images
          </Button>
        </label>
      </div>

      {/* Image Preview */}
      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Vehicle ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext}>
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
  onPrev 
}: {
  formData: FormData;
  onSubmit: () => void;
  onPrev: () => void;
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
        {/* Salesperson Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Salesperson</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {formData.salespersonName}</p>
            <p><strong>Email:</strong> {formData.salespersonEmail}</p>
            <p><strong>Phone:</strong> {formData.salespersonPhone}</p>
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
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Publish Listing
        </Button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sell Your Car</h1>
              <p className="text-gray-600">List your vehicle on Cars.na</p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Contact Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Your Contact Details</CardTitle>
                  <CardDescription>
                    Starting March 18, 2024, advertising private vehicles on Cars.na is prohibited.
                    To sell your vehicle, please consult the list of authorized dealers on our website
                    and submit your proposal to them collectively.
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Your Name *
                    </label>
                    <Input
                      required
                      value={vehicleData.dealerName}
                      onChange={(e) => updateVehicleData('dealerName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Contact No. *
                    </label>
                    <Input
                      required
                      value={vehicleData.contactNumber}
                      onChange={(e) => updateVehicleData('contactNumber', e.target.value)}
                      placeholder="(+264) 81 200 21 49"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      E-mail address *
                    </label>
                    <Input
                      required
                      type="email"
                      value={vehicleData.email}
                      onChange={(e) => updateVehicleData('email', e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Your Location *
                    </label>
                    <select
                      required
                      value={vehicleData.location}
                      onChange={(e) => updateVehicleData('location', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Location</option>
                      <option value="Windhoek">Windhoek</option>
                      <option value="Swakopmund">Swakopmund</option>
                      <option value="Walvis Bay">Walvis Bay</option>
                      <option value="Oshakati">Oshakati</option>
                      <option value="Rundu">Rundu</option>
                      <option value="Katima Mulilo">Katima Mulilo</option>
                      <option value="Otjiwarongo">Otjiwarongo</option>
                      <option value="Gobabis">Gobabis</option>
                      <option value="Henties Bay">Henties Bay</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Vehicle Information</CardTitle>
                  <CardDescription>
                    Please provide detailed information about your vehicle
                  </CardDescription>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type *</label>
                  <select
                    required
                    value={vehicleData.vehicleType}
                    onChange={(e) => updateVehicleData('vehicleType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {VEHICLE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* About your vehicle */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">About your vehicle:</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Manufacturer *</label>
                      <select
                        required
                        value={vehicleData.manufacturer}
                        onChange={(e) => updateVehicleData('manufacturer', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select</option>
                        {MANUFACTURERS.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Vehicle Model *</label>
                      <Input
                        required
                        value={vehicleData.model}
                        onChange={(e) => updateVehicleData('model', e.target.value)}
                        placeholder="e.g. X3, C-Class"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type of the Vehicle *</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Pickup">Pickup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Manufactured Year *</label>
                      <select
                        required
                        value={vehicleData.year}
                        onChange={(e) => updateVehicleData('year', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select</option>
                        {Array.from({ length: 35 }, (_, i) => 2025 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price Expectation and Mileage */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Price Expectation and Mileage:</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price of the vehicle N$ *</label>
                      <Input
                        required
                        type="number"
                        value={vehicleData.price}
                        onChange={(e) => updateVehicleData('price', e.target.value)}
                        placeholder="650000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mileage km *</label>
                      <Input
                        required
                        type="number"
                        value={vehicleData.mileage}
                        onChange={(e) => updateVehicleData('mileage', e.target.value)}
                        placeholder="25000"
                      />
                    </div>
                  </div>
                </div>

                {/* More details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">More details:</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Engine Capacity (cm³) *</label>
                      <select
                        required
                        value={vehicleData.engineCapacity}
                        onChange={(e) => updateVehicleData('engineCapacity', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select</option>
                        <option value="1000">1.0L (1000cc)</option>
                        <option value="1200">1.2L (1200cc)</option>
                        <option value="1400">1.4L (1400cc)</option>
                        <option value="1600">1.6L (1600cc)</option>
                        <option value="1800">1.8L (1800cc)</option>
                        <option value="2000">2.0L (2000cc)</option>
                        <option value="2500">2.5L (2500cc)</option>
                        <option value="3000">3.0L (3000cc)</option>
                        <option value="3500">3.5L (3500cc)</option>
                        <option value="4000">4.0L (4000cc)</option>
                        <option value="5000">5.0L+ (5000cc+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type of Fuel *</label>
                      <select
                        required
                        value={vehicleData.fuelType}
                        onChange={(e) => updateVehicleData('fuelType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {FUEL_TYPES.map(fuel => (
                          <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Transmission *</label>
                      <select
                        required
                        value={vehicleData.transmission}
                        onChange={(e) => updateVehicleData('transmission', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {TRANSMISSIONS.map(trans => (
                          <option key={trans} value={trans}>{trans}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Driving side *</label>
                      <select
                        required
                        value={vehicleData.drivingSide}
                        onChange={(e) => updateVehicleData('drivingSide', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {DRIVING_SIDES.map(side => (
                          <option key={side} value={side}>{side}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Options your vehicle comes with */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Options your vehicle comes with:</h3>
                  
                  {/* Comfort Features */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-blue-600">Comfort</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {COMFORT_FEATURES.map(feature => (
                        <label key={feature} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={vehicleData.comfort.includes(feature)}
                            onChange={() => toggleFeature('comfort', feature)}
                            className="rounded"
                          />
                          <span>{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Safety Features */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-blue-600">Safety</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {SAFETY_FEATURES.map(feature => (
                        <label key={feature} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={vehicleData.safety.includes(feature)}
                            onChange={() => toggleFeature('safety', feature)}
                            className="rounded"
                          />
                          <span>{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sound System */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-blue-600">Sound System</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {SOUND_FEATURES.map(feature => (
                        <label key={feature} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={vehicleData.soundSystem.includes(feature)}
                            onChange={() => toggleFeature('soundSystem', feature)}
                            className="rounded"
                          />
                          <span>{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Other Features */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 text-blue-600">Other</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {OTHER_FEATURES.map(feature => (
                        <label key={feature} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={vehicleData.other.includes(feature)}
                            onChange={() => toggleFeature('other', feature)}
                            className="rounded"
                          />
                          <span>{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Other vehicle details */}
                <div>
                  <label className="block text-sm font-medium mb-2">Other vehicle details:</label>
                  <textarea
                    value={vehicleData.description}
                    onChange={(e) => updateVehicleData('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none"
                    placeholder="Describe any additional features, condition, service history, or other relevant details about your vehicle..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Upload Pictures */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Upload Pictures</CardTitle>
                  <CardDescription>
                    You may upload multiple files at once up to 12. Use JPG, GIF or PNG files.
                    To change the order of the displayed pictures, you can use "Drag & Drop" method.
                  </CardDescription>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <Button
                      type="button"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose file pictures
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500">
                      You may upload multiple files at once up to 12. Use JPG, GIF or PNG files.
                    </p>
                    <p className="text-xs text-orange-600">
                      If you have any trouble with uploading pictures, try to use single picture upload by clicking the button below.
                    </p>
                  </div>
                </div>

                {/* Uploaded Images Grid */}
                {vehicleData.images.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-4">Uploaded Pictures ({vehicleData.images.length}/12)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {vehicleData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Upload Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Video Upload (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please paste link to your YouTube video here:
                  </p>
                  <Input placeholder="https://youtube.com/watch?v=..." />
                  <p className="text-xs text-gray-500 mt-2">
                    You can add YouTube video of your vehicle, also paste the link of your video.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Preview Your Listing</CardTitle>
                  <CardDescription>
                    Please review all the information before publishing your listing
                  </CardDescription>
                </div>

                {/* Contact Information Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <p className="font-medium">{vehicleData.dealerName || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="font-medium">{vehicleData.contactNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="font-medium">{vehicleData.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location:</span>
                        <p className="font-medium">{vehicleData.location || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Car className="h-5 w-5 mr-2" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Make & Model:</span>
                        <p className="font-medium">{vehicleData.manufacturer} {vehicleData.model}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Year:</span>
                        <p className="font-medium">{vehicleData.year}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Price:</span>
                        <p className="font-medium text-green-600">N$ {vehicleData.price ? Number(vehicleData.price).toLocaleString() : '0'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Mileage:</span>
                        <p className="font-medium">{vehicleData.mileage ? Number(vehicleData.mileage).toLocaleString() : '0'} km</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Fuel Type:</span>
                        <p className="font-medium">{vehicleData.fuelType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Transmission:</span>
                        <p className="font-medium">{vehicleData.transmission}</p>
                      </div>
                    </div>

                    {/* Features */}
                    {(vehicleData.comfort.length > 0 || vehicleData.safety.length > 0 || vehicleData.soundSystem.length > 0 || vehicleData.other.length > 0) && (
                      <div>
                        <h4 className="font-medium mb-3">Features & Options:</h4>
                        <div className="space-y-3">
                          {vehicleData.comfort.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-blue-600">Comfort: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {vehicleData.comfort.map(feature => (
                                  <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {vehicleData.safety.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-blue-600">Safety: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {vehicleData.safety.map(feature => (
                                  <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {vehicleData.soundSystem.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-blue-600">Sound System: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {vehicleData.soundSystem.map(feature => (
                                  <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {vehicleData.other.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-blue-600">Other: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {vehicleData.other.map(feature => (
                                  <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {vehicleData.description && (
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-500">Description:</span>
                        <p className="mt-1 text-gray-700">{vehicleData.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Images Preview */}
                {vehicleData.images.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Camera className="h-5 w-5 mr-2" />
                        Images ({vehicleData.images.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {vehicleData.images.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 5: Publish */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <CardTitle className="text-2xl mb-2">Listing Complete!</CardTitle>
                  <CardDescription className="text-lg">
                    Your vehicle listing has been successfully submitted for review.
                  </CardDescription>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
                  <div className="text-sm text-green-700 space-y-2">
                    <p>• Your listing will be reviewed by our team within 24 hours</p>
                    <p>• Once approved, it will be published on Cars.na</p>
                    <p>• You'll receive email notifications for any inquiries</p>
                    <p>• You can manage your listing from the dealer dashboard</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.href = '/dealer/dashboard'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(1);
                      setVehicleData({
                        dealerName: '',
                        contactNumber: '',
                        email: '',
                        location: '',
                        vehicleType: 'Used cars',
                        manufacturer: '',
                        model: '',
                        year: '',
                        price: '',
                        mileage: '',
                        engineCapacity: '',
                        fuelType: 'Petrol',
                        transmission: 'Automatic',
                        drivingSide: 'Left Hand Drive',
                        comfort: [],
                        safety: [],
                        soundSystem: [],
                        other: [],
                        description: '',
                        images: []
                      });
                    }}
                  >
                    List Another Vehicle
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={currentStep === 5 ? handleSubmit : nextStep}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === 5 ? 'Publish Listing' : 'Next Step'}
                {currentStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
