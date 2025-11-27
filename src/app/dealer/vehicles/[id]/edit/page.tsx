'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { X, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  color: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  engineCapacity: string;
  horsepower: string;
  description: string;
  internalRef: string;
  comfort: string[];
  safety: string[];
}

const COMFORT_FEATURES = [
  'Air Conditioning', 'Leather Seats', 'Power Windows', 'Power Locks',
  'Cruise Control', 'Heated Seats', 'Sunroof', 'Navigation System',
  'Bluetooth', 'Backup Camera', 'Parking Sensors', 'Keyless Entry'
];

const SAFETY_FEATURES = [
  'ABS', 'Airbags', 'Stability Control', 'Traction Control',
  'Blind Spot Monitor', 'Lane Departure Warning', 'Forward Collision Warning',
  'Automatic Emergency Braking', 'Adaptive Cruise Control'
];

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    color: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: '',
    engineCapacity: '',
    horsepower: '',
    description: '',
    internalRef: '',
    comfort: [],
    safety: []
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      if (status === 'loading') return;

      if (!session?.user) {
        router.push('/dealer/login');
        return;
      }

      try {
        const resolvedParams = await params;
        const vehicleId = resolvedParams.id;
        const response = await fetch(`/api/dealer/vehicles/${vehicleId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch vehicle');
        }

        const data = await response.json();

        if (data.success && data.vehicle) {
          const v = data.vehicle;
          setVehicleData({
            make: v.manufacturer || '',
            model: v.model || '',
            year: v.year?.toString() || '',
            price: v.price?.toString() || '',
            mileage: v.mileage?.toString() || '',
            color: v.color || '',
            transmission: v.transmission || 'Automatic',
            fuelType: v.fuelType || 'Petrol',
            bodyType: v.bodyType || '',
            engineCapacity: v.engineCapacity?.toString() || '',
            horsepower: v.horsepower?.toString() || '',
            description: v.description || '',
            internalRef: v.internalRef || '',
            comfort: v.comfort || [],
            safety: v.safety || []
          });

          // Load existing images
          if (v.images && v.images.length > 0) {
            setExistingImages(v.images);
          }
        } else {
          setError('Vehicle not found');
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setError('Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [params.id, session, status, router]);

  const handleChange = (field: keyof VehicleFormData, value: any) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (category: 'comfort' | 'safety', feature: string) => {
    setVehicleData(prev => {
      const current = prev[category];
      const updated = current.includes(feature)
        ? current.filter(f => f !== feature)
        : [...current, feature];
      return { ...prev, [category]: updated };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      try {
        // Compression options - very aggressive compression for database storage
        const options = {
          maxSizeMB: 0.1, // Compress to max 100KB (very small for database storage)
          maxWidthOrHeight: 600, // Max dimension 600px
          useWebWorker: true,
          initialQuality: 0.6 // Lower quality for smaller file size
        };

        // Compress and convert images
        const newImagePromises = files.map(async (file) => {
          // Compress the image first
          const compressedFile = await imageCompression(file, options);
          console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

          // Convert to base64
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              resolve(dataUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(compressedFile);
          });
        });

        const uploadedImages = await Promise.all(newImagePromises);
        setNewImages(prev => [...prev, ...uploadedImages].slice(0, 12 - existingImages.length + imagesToDelete.length));
      } catch (error) {
        console.error('Error processing images:', error);
        setError('Failed to process images. Please try again.');
      }
    }
  };

  const removeExistingImage = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/dealer/vehicles/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manufacturer: vehicleData.make,
          model: vehicleData.model,
          year: parseInt(vehicleData.year),
          price: parseFloat(vehicleData.price),
          mileage: parseInt(vehicleData.mileage),
          color: vehicleData.color,
          transmission: vehicleData.transmission,
          fuelType: vehicleData.fuelType,
          bodyType: vehicleData.bodyType,
          engineCapacity: vehicleData.engineCapacity ? String(vehicleData.engineCapacity) : undefined,
          horsepower: vehicleData.horsepower ? parseInt(vehicleData.horsepower) : undefined,
          description: vehicleData.description,
          internalRef: vehicleData.internalRef,
          comfort: vehicleData.comfort,
          safety: vehicleData.safety,
          imagesToDelete: imagesToDelete,
          newImages: newImages // Send base64 images to server
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dealer/dashboard');
        }, 1500);
      } else {
        setError(result.message || 'Failed to update vehicle');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setError('An error occurred while updating the vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading vehicle data...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Vehicle</h1>
        <p className="text-gray-600">Update vehicle details</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Vehicle updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Make"
              value={vehicleData.make}
              onChange={(e) => handleChange('make', e.target.value)}
              required
            />
            <Input
              label="Model"
              value={vehicleData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              required
            />
            <Input
              label="Year"
              type="number"
              value={vehicleData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              required
            />
            <Input
              label="Price"
              type="number"
              value={vehicleData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
            />
            <Input
              label="Mileage"
              type="number"
              value={vehicleData.mileage}
              onChange={(e) => handleChange('mileage', e.target.value)}
              required
            />
            <Input
              label="Color"
              value={vehicleData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              required
            />
            <Input
              label="Internal Reference"
              value={vehicleData.internalRef}
              onChange={(e) => handleChange('internalRef', e.target.value)}
              placeholder="Stock #"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Transmission</label>
              <select
                className="w-full p-2 border rounded"
                value={vehicleData.transmission}
                onChange={(e) => handleChange('transmission', e.target.value)}
              >
                <option key="Automatic" value="Automatic">Automatic</option>
                <option key="Manual" value="Manual">Manual</option>
                <option key="CVT" value="CVT">CVT</option>
                <option key="Semi-Automatic" value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type</label>
              <select
                className="w-full p-2 border rounded"
                value={vehicleData.fuelType}
                onChange={(e) => handleChange('fuelType', e.target.value)}
              >
                <option key="Petrol" value="Petrol">Petrol</option>
                <option key="Diesel" value="Diesel">Diesel</option>
                <option key="Electric" value="Electric">Electric</option>
                <option key="Hybrid" value="Hybrid">Hybrid</option>
              </select>
            </div>
            <Input
              label="Body Type"
              value={vehicleData.bodyType}
              onChange={(e) => handleChange('bodyType', e.target.value)}
              placeholder="e.g., Sedan, SUV"
            />
            <Input
              label="Engine Capacity (L)"
              type="number"
              step="0.1"
              value={vehicleData.engineCapacity}
              onChange={(e) => handleChange('engineCapacity', e.target.value)}
            />
            <Input
              label="Horsepower"
              type="number"
              value={vehicleData.horsepower}
              onChange={(e) => handleChange('horsepower', e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Comfort Features</h2>
          <div className="grid grid-cols-3 gap-2">
            {COMFORT_FEATURES.map(feature => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vehicleData.comfort.includes(feature)}
                  onChange={() => toggleFeature('comfort', feature)}
                  className="rounded"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Safety Features</h2>
          <div className="grid grid-cols-3 gap-2">
            {SAFETY_FEATURES.map(feature => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vehicleData.safety.includes(feature)}
                  onChange={() => toggleFeature('safety', feature)}
                  className="rounded"
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <textarea
            className="w-full p-3 border rounded min-h-[150px]"
            value={vehicleData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter vehicle description..."
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vehicle Images</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Current Images</h3>
              <div className="grid grid-cols-4 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Vehicle"
                      className="w-full h-32 object-cover rounded border"
                    />
                    {image.isPrimary && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">New Images to Upload</h3>
              <div className="grid grid-cols-4 gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt="New vehicle image"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <Upload size={20} />
              <span>Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {existingImages.length + newImages.length} / 12 images
            </p>
          </div>
        </Card>
      </form>

      {/* Fixed bottom action bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg mt-6 -mx-6 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dealer/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
