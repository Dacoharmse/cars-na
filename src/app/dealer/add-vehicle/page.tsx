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
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Building2,
  Truck,
  Bike,
  Bus,
  Hammer,
  Tractor,
  Ship,
  Package
} from 'lucide-react';
import {
  VEHICLE_CATEGORIES,
  VehicleCategoryKey,
  getManufacturers,
  CAR_BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  COMFORT_FEATURES,
  SAFETY_FEATURES
} from '@/lib/vehicleCategories';

interface VehicleData {
  // Salesperson details
  salespersonId: string;
  salespersonName: string;
  salespersonEmail: string;
  salespersonPhone: string;

  // Vehicle details
  category: VehicleCategoryKey;
  manufacturer: string;
  model: string;
  year: string;
  price: string;
  color: string;
  mileage: string;
  engineCapacity: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  condition: string;
  horsepower: string;
  loadCapacity: string;
  passengerCapacity: string;
  length: string;
  weight: string;
  comfort: string[];
  safety: string[];
  description: string;
  images: File[];
  internalRef: string;
  financing: boolean;
  isNew: boolean;
}

const STEPS = [
  { id: 1, title: 'Salesperson', icon: User, description: 'Select salesperson' },
  { id: 2, title: 'Category', icon: Building2, description: 'Select type' },
  { id: 3, title: 'Vehicle Details', icon: Car, description: 'Basic information' },
  { id: 4, title: 'Specifications', icon: Building2, description: 'Technical details' },
  { id: 5, title: 'Upload Pictures', icon: Camera, description: 'Vehicle photos' },
  { id: 6, title: 'Preview', icon: Eye, description: 'Review listing' },
  { id: 7, title: 'Complete', icon: CheckCircle, description: 'Add to inventory' }
];

// Category icons mapping
const CATEGORY_ICONS: Record<VehicleCategoryKey, any> = {
  CARS: Car,
  TRUCKS: Truck,
  MOTORCYCLES: Bike,
  BUSES: Bus,
  INDUSTRIAL_MACHINERY: Hammer,
  TRACTORS: Tractor,
  BOATS: Ship,
  ACCESSORIES: Package
};

// Mock salespeople data for the dealership (in real app, this would come from API)
const SALESPEOPLE = [
  { id: '1', name: 'John Smith', email: 'john@premium-motors.com', phone: '+264 81 123 4567' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@premium-motors.com', phone: '+264 81 234 5678' },
  { id: '3', name: 'Mike Wilson', email: 'mike@premium-motors.com', phone: '+264 81 345 6789' },
  { id: '4', name: 'Lisa Brown', email: 'lisa@premium-motors.com', phone: '+264 81 456 7890' }
];

// Mock current user (in real app, this would come from session)
const CURRENT_USER = {
  id: '1',
  name: 'Premium Motors Manager',
  email: 'dealer@premium-motors.com',
  phone: '+264 81 123 4567'
};

export default function DealerAddVehicleWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errorModal, setErrorModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    // Salesperson (default to current user)
    salespersonId: CURRENT_USER.id,
    salespersonName: CURRENT_USER.name,
    salespersonEmail: CURRENT_USER.email,
    salespersonPhone: CURRENT_USER.phone,

    // Vehicle details
    category: 'CARS',
    manufacturer: '',
    model: '',
    year: '',
    price: '',
    color: '',
    mileage: '',
    engineCapacity: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: '',
    condition: 'Very Good',
    horsepower: '',
    loadCapacity: '',
    passengerCapacity: '',
    length: '',
    weight: '',
    comfort: [],
    safety: [],
    description: '',
    images: [],
    internalRef: '',
    financing: true,
    isNew: false
  });

  // Cleanup on component unmount (data URLs don't need to be revoked)
  useEffect(() => {
    return () => {
      console.log('Component unmounting, clearing image previews');
      setImagePreviews([]);
    };
  }, []);

  // Debug: Log imagePreviews state changes
  useEffect(() => {
    console.log('=== imagePreviews state changed ===');
    console.log('Current imagePreviews:', imagePreviews);
    console.log('Number of previews:', imagePreviews.length);
    console.log('vehicleData.images.length:', vehicleData.images.length);
  }, [imagePreviews, vehicleData.images]);

  const updateVehicleData = (field: keyof VehicleData, value: any) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (category: 'comfort' | 'safety', feature: string) => {
    setVehicleData(prev => ({
      ...prev,
      [category]: prev[category].includes(feature)
        ? prev[category].filter(f => f !== feature)
        : [...prev[category], feature]
    }));
  };

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      console.log('Files selected:', newImages.length);

      // Use FileReader to convert images to base64 data URLs
      const newPreviewPromises = newImages.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            console.log('Created data URL for file:', file.name);
            resolve(dataUrl);
          };
          reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      });

      try {
        const newPreviews = await Promise.all(newPreviewPromises);
        console.log('All preview data URLs created:', newPreviews.length);

        setVehicleData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 12)
        }));

        setImagePreviews(prev => {
          const updated = [...prev, ...newPreviews].slice(0, 12);
          console.log('Updated imagePreviews state:', updated.length);
          return updated;
        });
      } catch (error) {
        console.error('Error creating image previews:', error);
        setErrorModal({ show: true, message: 'Error loading images. Please try again.' });
      }
    }
  };

  const removeImage = (index: number) => {
    console.log('Removing image at index:', index);

    setVehicleData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/dealer/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Vehicle successfully added:', result);
        setCurrentStep(7); // Go to success step
      } else {
        console.error('Error adding vehicle:', result.error);
        setErrorModal({ show: true, message: result.error || 'Failed to add vehicle' });
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrorModal({ show: true, message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dealer/dashboard'}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Vehicle to Inventory</h1>
                <p className="text-gray-600">Professional vehicle listing wizard</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 6
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
            {/* Step 1: Salesperson Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Select Salesperson</CardTitle>
                  <CardDescription>
                    Choose the salesperson responsible for this vehicle
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SALESPEOPLE.map((person) => {
                    const isSelected = vehicleData.salespersonId === person.id;
                    return (
                      <Card 
                        key={person.id}
                        className={`cursor-pointer transition-all border-2 ${
                          isSelected
                            ? 'ring-4 ring-blue-300 bg-blue-50 border-blue-500'
                            : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setVehicleData(prev => ({
                            ...prev,
                            salespersonId: person.id,
                            salespersonName: person.name,
                            salespersonEmail: person.email,
                            salespersonPhone: person.phone
                          }));
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className={`w-6 h-6 ${
                                isSelected ? 'text-blue-700' : 'text-blue-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {person.name}
                              </h3>
                              <p className="text-sm text-gray-600">{person.email}</p>
                              <p className="text-sm text-gray-500">{person.phone}</p>
                            </div>
                            {isSelected && (
                              <div className="text-center">
                                <CheckCircle className="w-6 h-6 text-blue-600 mx-auto" />
                                <span className="text-xs text-blue-600 font-medium">Selected</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {vehicleData.salespersonId === CURRENT_USER.id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800 font-medium">
                        You are the selected salesperson for this vehicle
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Vehicle Category Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Select Vehicle Category</CardTitle>
                  <CardDescription>
                    Choose the type of vehicle you want to list
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.keys(VEHICLE_CATEGORIES) as VehicleCategoryKey[]).map((categoryKey) => {
                    const category = VEHICLE_CATEGORIES[categoryKey];
                    const Icon = CATEGORY_ICONS[categoryKey];
                    const isSelected = vehicleData.category === categoryKey;

                    return (
                      <Card
                        key={categoryKey}
                        className={`cursor-pointer transition-all border-2 ${
                          isSelected
                            ? 'ring-4 ring-blue-300 bg-blue-50 border-blue-500'
                            : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
                        }`}
                        onClick={() => {
                          updateVehicleData('category', categoryKey);
                          updateVehicleData('manufacturer', ''); // Reset manufacturer when category changes
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-blue-600' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-8 h-8 ${
                                isSelected ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className={`font-semibold text-lg ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {category.label}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {category.description}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Building2 className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <span className="text-sm text-blue-800 font-medium block mb-1">
                        Selected: {VEHICLE_CATEGORIES[vehicleData.category].label}
                      </span>
                      <span className="text-sm text-blue-700">
                        {VEHICLE_CATEGORIES[vehicleData.category].description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Vehicle Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Vehicle Details</CardTitle>
                  <CardDescription>
                    Enter the basic information about the {VEHICLE_CATEGORIES[vehicleData.category].label.toLowerCase()}
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Manufacturer/Brand <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={vehicleData.manufacturer}
                      onChange={(e) => updateVehicleData('manufacturer', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Manufacturer</option>
                      {getManufacturers(vehicleData.category).map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={vehicleData.model}
                      onChange={(e) => updateVehicleData('model', e.target.value)}
                      placeholder="e.g. X3, C-Class"
                      className="p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={vehicleData.year}
                      onChange={(e) => updateVehicleData('year', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Year</option>
                      {Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={vehicleData.condition}
                      onChange={(e) => updateVehicleData('condition', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (N$) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      type="number"
                      value={vehicleData.price}
                      onChange={(e) => updateVehicleData('price', e.target.value)}
                      placeholder="650000"
                      className="p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <Input
                      value={vehicleData.color}
                      onChange={(e) => updateVehicleData('color', e.target.value)}
                      placeholder="e.g. Black, White, Silver"
                      className="p-3"
                    />
                  </div>

                  {vehicleData.category === 'CARS' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Body Type</label>
                      <select
                        value={vehicleData.bodyType}
                        onChange={(e) => updateVehicleData('bodyType', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Body Type</option>
                        {CAR_BODY_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Internal Reference</label>
                    <Input
                      value={vehicleData.internalRef}
                      onChange={(e) => updateVehicleData('internalRef', e.target.value)}
                      placeholder="INV-2024-001"
                      className="p-3"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={vehicleData.isNew}
                      onChange={(e) => updateVehicleData('isNew', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Brand New</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={vehicleData.financing}
                      onChange={(e) => updateVehicleData('financing', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Financing Available</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Specifications */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Technical Specifications</CardTitle>
                  <CardDescription>
                    Technical details and features for {VEHICLE_CATEGORIES[vehicleData.category].label.toLowerCase()}
                  </CardDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mileage - for most categories except accessories */}
                  {vehicleData.category !== 'ACCESSORIES' && vehicleData.category !== 'INDUSTRIAL_MACHINERY' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mileage (km) {!vehicleData.isNew && <span className="text-red-500">*</span>}
                      </label>
                      <Input
                        required={!vehicleData.isNew}
                        type="number"
                        value={vehicleData.mileage}
                        onChange={(e) => updateVehicleData('mileage', e.target.value)}
                        placeholder="25000"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Engine Capacity - for cars, trucks, motorcycles, buses, tractors */}
                  {['CARS', 'TRUCKS', 'MOTORCYCLES', 'BUSES', 'TRACTORS', 'INDUSTRIAL_MACHINERY'].includes(vehicleData.category) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Engine Capacity</label>
                      <Input
                        value={vehicleData.engineCapacity}
                        onChange={(e) => updateVehicleData('engineCapacity', e.target.value)}
                        placeholder="e.g. 2.0L, 3.5L"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Power (kW) - for cars, trucks, motorcycles, industrial, tractors */}
                  {['CARS', 'TRUCKS', 'MOTORCYCLES', 'INDUSTRIAL_MACHINERY', 'TRACTORS', 'BOATS'].includes(vehicleData.category) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Power (kW)</label>
                      <Input
                        type="number"
                        value={vehicleData.horsepower}
                        onChange={(e) => updateVehicleData('horsepower', e.target.value)}
                        placeholder="110"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Load Capacity - for trucks */}
                  {vehicleData.category === 'TRUCKS' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Load Capacity (tons)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={vehicleData.loadCapacity}
                        onChange={(e) => updateVehicleData('loadCapacity', e.target.value)}
                        placeholder="2.5"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Passenger Capacity - for buses */}
                  {vehicleData.category === 'BUSES' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Passenger Capacity</label>
                      <Input
                        type="number"
                        value={vehicleData.passengerCapacity}
                        onChange={(e) => updateVehicleData('passengerCapacity', e.target.value)}
                        placeholder="50"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Length - for boats */}
                  {vehicleData.category === 'BOATS' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Length (meters)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={vehicleData.length}
                        onChange={(e) => updateVehicleData('length', e.target.value)}
                        placeholder="7.5"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Weight - for industrial machinery */}
                  {vehicleData.category === 'INDUSTRIAL_MACHINERY' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                      <Input
                        type="number"
                        value={vehicleData.weight}
                        onChange={(e) => updateVehicleData('weight', e.target.value)}
                        placeholder="5000"
                        className="p-3"
                      />
                    </div>
                  )}

                  {/* Fuel Type - for most categories */}
                  {vehicleData.category !== 'ACCESSORIES' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Fuel Type</label>
                      <select
                        value={vehicleData.fuelType}
                        onChange={(e) => updateVehicleData('fuelType', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Fuel Type</option>
                        {FUEL_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Transmission - for cars, trucks, motorcycles, buses */}
                  {['CARS', 'TRUCKS', 'MOTORCYCLES', 'BUSES', 'TRACTORS'].includes(vehicleData.category) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Transmission</label>
                      <select
                        value={vehicleData.transmission}
                        onChange={(e) => updateVehicleData('transmission', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Transmission</option>
                        {TRANSMISSION_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-3">Comfort Features</h4>
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

                  <div>
                    <h4 className="font-medium text-blue-600 mb-3">Safety Features</h4>
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={vehicleData.description}
                    onChange={(e) => updateVehicleData('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none"
                    placeholder="Additional details about the vehicle..."
                  />
                </div>
              </div>
            )}

            {/* Step 5: Upload Pictures */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Upload Vehicle Pictures</CardTitle>
                  <CardDescription>
                    High-quality photos help sell vehicles faster
                  </CardDescription>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Pictures
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload up to 12 images
                  </p>
                </div>

                {vehicleData.images.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-4">Uploaded Pictures ({vehicleData.images.length}/12)</h3>
                    <p className="text-xs text-gray-500 mb-2">Debug: imagePreviews.length = {imagePreviews.length}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.length === 0 && (
                        <p className="text-red-500 col-span-full">No previews available (imagePreviews is empty)</p>
                      )}
                      {imagePreviews.map((preview, index) => {
                        console.log(`Rendering image ${index}:`, preview);
                        return (
                          <div key={index} className="relative group">
                            <div className="text-xs text-gray-500 mb-1">Preview {index + 1}</div>
                            <img
                              src={preview}
                              alt={`Vehicle ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                              onError={(e) => {
                                console.error('❌ Image failed to load:', preview);
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => {
                                console.log('✅ Image loaded successfully:', preview);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Preview */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Preview Vehicle Listing</CardTitle>
                  <CardDescription>
                    Review all information before adding to inventory
                  </CardDescription>
                </div>

                {/* Salesperson Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Assigned Salesperson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{vehicleData.salespersonName}</p>
                        <p className="text-sm text-gray-600">{vehicleData.salespersonEmail}</p>
                        <p className="text-sm text-gray-500">{vehicleData.salespersonPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vehicle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {vehicleData.manufacturer} {vehicleData.model} ({vehicleData.year})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Price:</span>
                        <p className="font-medium text-green-600">N$ {vehicleData.price ? Number(vehicleData.price).toLocaleString() : '0'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Mileage:</span>
                        <p className="font-medium">{vehicleData.mileage ? Number(vehicleData.mileage).toLocaleString() : '0'} km</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Condition:</span>
                        <p className="font-medium">{vehicleData.condition}</p>
                      </div>
                    </div>

                    {(vehicleData.comfort.length > 0 || vehicleData.safety.length > 0) && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {[...vehicleData.comfort, ...vehicleData.safety].map(feature => (
                            <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {vehicleData.description && (
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-500">Description:</span>
                        <p className="mt-1">{vehicleData.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {vehicleData.images.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Images ({vehicleData.images.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-500 mb-2">Debug: imagePreviews.length = {imagePreviews.length}</p>
                      {imagePreviews.length === 0 && (
                        <p className="text-red-500">No previews available (imagePreviews is empty)</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => {
                          console.log(`Step 6 - Rendering preview ${index}:`, preview);
                          return (
                            <div key={index} className="relative">
                              <div className="text-xs text-gray-500 mb-1">Preview {index + 1}</div>
                              <img
                                src={preview}
                                alt={`Vehicle ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                                onError={(e) => {
                                  console.error('❌ Step 6 - Image failed to load:', preview);
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log('✅ Step 6 - Image loaded successfully:', preview);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Step 7: Success */}
            {currentStep === 7 && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <CardTitle className="text-2xl mb-2">Vehicle Added Successfully!</CardTitle>
                  <CardDescription className="text-lg">
                    The vehicle has been added to your inventory and is now live on Cars.na
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.href = '/dealer/dashboard'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Clear image previews
                      setImagePreviews([]);

                      setCurrentStep(1);
                      setVehicleData({
                        // Salesperson (default to current user)
                        salespersonId: CURRENT_USER.id,
                        salespersonName: CURRENT_USER.name,
                        salespersonEmail: CURRENT_USER.email,
                        salespersonPhone: CURRENT_USER.phone,

                        // Vehicle details
                        category: 'CARS',
                        manufacturer: '',
                        model: '',
                        year: '',
                        price: '',
                        color: '',
                        mileage: '',
                        engineCapacity: '',
                        fuelType: 'Petrol',
                        transmission: 'Automatic',
                        bodyType: '',
                        condition: 'Very Good',
                        horsepower: '',
                        loadCapacity: '',
                        passengerCapacity: '',
                        length: '',
                        weight: '',
                        comfort: [],
                        safety: [],
                        description: '',
                        images: [],
                        internalRef: '',
                        financing: true,
                        isNew: false
                      });
                    }}
                  >
                    Add Another Vehicle
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
                onClick={currentStep === 7 ? () => window.location.href = '/dealer/dashboard?tab=inventory' : currentStep === 6 ? handleSubmit : nextStep}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === 7 ? 'Finish' : currentStep === 6 ? 'Add to Inventory' : 'Next Step'}
                {currentStep < 6 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                <button
                  onClick={() => setErrorModal({ show: false, message: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">{errorModal.message}</p>
              <div className="flex justify-end">
                <Button
                  onClick={() => setErrorModal({ show: false, message: '' })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
