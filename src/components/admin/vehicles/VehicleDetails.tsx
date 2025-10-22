'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Star,
  Flag,
  Eye,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Upload,
  Trash2,
  RotateCcw,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react';

interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
  isModerated?: boolean;
  flaggedReasons?: string[];
}

interface Dealership {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  website?: string;
}

interface VehicleAnalytics {
  dailyViews: number[];
  dailyLeads: number[];
  conversionRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topReferrers: string[];
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  color?: string;
  vin?: string;
  description?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  engineSize?: string;
  drivetrain?: string;
  doors?: number;
  seats?: number;
  features?: string[];
  status: 'AVAILABLE' | 'SOLD' | 'PENDING' | 'RESERVED';
  moderationStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'FLAGGED';
  featured: boolean;
  dealerPick: boolean;
  isNew: boolean;
  isPrivate: boolean;
  viewCount: number;
  leadCount: number;
  qualityScore: number;
  flaggedReasons?: string[];
  moderationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  dealership: Dealership;
  images: VehicleImage[];
  analytics?: VehicleAnalytics;
}

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdate: (vehicle: Vehicle) => void;
  onAction: (action: string, vehicleId: string, data?: any) => void;
}

export default function VehicleDetails({ vehicle, onClose, onUpdate, onAction }: VehicleDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle>(vehicle);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [moderationNotes, setModerationNotes] = useState(vehicle.moderationNotes || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'details', label: 'Details', icon: Edit },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'moderation', label: 'Moderation', icon: Flag }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'AVAILABLE': 'bg-green-100 text-green-800',
      'SOLD': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'RESERVED': 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getModerationBadge = (status: string) => {
    const variants = {
      'APPROVED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'FLAGGED': 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSave = () => {
    onUpdate(editedVehicle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedVehicle(vehicle);
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedVehicle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    // In a real implementation, you would upload these files and get URLs
    console.log('Uploading images:', files);
    onAction('upload-images', vehicle.id, { files });
  };

  const handleImageAction = (action: string, imageId: string) => {
    onAction(`image-${action}`, vehicle.id, { imageId });
  };

  const handleModerationAction = (action: string) => {
    onAction(action, vehicle.id, {
      notes: moderationNotes,
      moderationStatus: action.toUpperCase()
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Mock analytics data
  const mockAnalytics: VehicleAnalytics = {
    dailyViews: [45, 52, 38, 67, 89, 76, 43],
    dailyLeads: [2, 3, 1, 4, 6, 5, 2],
    conversionRate: 4.2,
    averageTimeOnPage: 3.45,
    bounceRate: 0.35,
    topReferrers: ['Google', 'Facebook', 'Direct', 'cars.na homepage']
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge className={getStatusBadge(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                    <Badge className={getModerationBadge(vehicle.moderationStatus)}>
                      {vehicle.moderationStatus}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Quality Score: <span className={getQualityScoreColor(vehicle.qualityScore)}>
                        {vehicle.qualityScore}/100
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onAction('view-live', vehicle.id)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vehicle Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Make</label>
                        {isEditing ? (
                          <Input
                            value={editedVehicle.make}
                            onChange={(e) => handleFieldChange('make', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{vehicle.make}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Model</label>
                        {isEditing ? (
                          <Input
                            value={editedVehicle.model}
                            onChange={(e) => handleFieldChange('model', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{vehicle.model}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedVehicle.year}
                            onChange={(e) => handleFieldChange('year', parseInt(e.target.value))}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{vehicle.year}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedVehicle.price}
                            onChange={(e) => handleFieldChange('price', parseFloat(e.target.value))}
                          />
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              N${vehicle.price.toLocaleString()}
                            </p>
                            {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                              <p className="text-sm text-gray-500 line-through">
                                N${vehicle.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Mileage</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedVehicle.mileage}
                            onChange={(e) => handleFieldChange('mileage', parseInt(e.target.value))}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Color</label>
                        {isEditing ? (
                          <Input
                            value={editedVehicle.color || ''}
                            onChange={(e) => handleFieldChange('color', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{vehicle.color || 'Not specified'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">VIN</label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-900 font-mono">{vehicle.vin || 'Not provided'}</p>
                          {vehicle.vin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(vehicle.vin!)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Transmission</label>
                        {isEditing ? (
                          <select
                            value={editedVehicle.transmission || ''}
                            onChange={(e) => handleFieldChange('transmission', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select transmission</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                          </select>
                        ) : (
                          <p className="text-sm text-gray-900">{vehicle.transmission || 'Not specified'}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      {isEditing ? (
                        <textarea
                          value={editedVehicle.description || ''}
                          onChange={(e) => handleFieldChange('description', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {vehicle.description || 'No description provided'}
                        </p>
                      )}
                    </div>

                    {/* Special Flags */}
                    <div className="flex flex-wrap gap-2">
                      {vehicle.featured && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {vehicle.dealerPick && (
                        <Badge className="bg-blue-100 text-blue-800">
                          Dealer Pick
                        </Badge>
                      )}
                      {vehicle.isNew && (
                        <Badge className="bg-green-100 text-green-800">
                          New Car
                        </Badge>
                      )}
                      {vehicle.isPrivate && (
                        <Badge className="bg-gray-100 text-gray-800">
                          Private Sale
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dealership Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dealership Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.dealership.name}</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {vehicle.dealership.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {vehicle.dealership.phone}
                        </div>
                        {vehicle.dealership.address && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {vehicle.dealership.address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Eye className="w-4 h-4 mr-2" />
                            {vehicle.viewCount} views
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {vehicle.leadCount} leads
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Conversion: {((vehicle.leadCount / vehicle.viewCount) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Quality: {vehicle.qualityScore}/100
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Timestamps</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Created: {vehicle.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Updated: {vehicle.updatedAt.toLocaleDateString()}
                        </div>
                        {vehicle.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Published: {vehicle.publishedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Vehicle Images</h3>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                </div>

                {vehicle.images.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Image Display */}
                    <div>
                      <div className="relative">
                        <img
                          src={vehicle.images[selectedImageIndex]?.url || 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                        {vehicle.images[selectedImageIndex]?.isPrimary && (
                          <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800">
                            Primary
                          </Badge>
                        )}
                      </div>

                      {/* Image Controls */}
                      <div className="flex justify-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageAction('set-primary', vehicle.images[selectedImageIndex].id)}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Set as Primary
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageAction('rotate', vehicle.images[selectedImageIndex].id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Rotate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageAction('download', vehicle.images[selectedImageIndex].id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageAction('delete', vehicle.images[selectedImageIndex].id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Image Thumbnails */}
                    <div>
                      <h4 className="font-medium mb-4">All Images ({vehicle.images.length})</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {vehicle.images.map((image, index) => (
                          <div
                            key={image.id}
                            className={`relative cursor-pointer rounded-lg overflow-hidden ${
                              selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img
                              src={image.url}
                              alt={`Vehicle image ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                            {image.isPrimary && (
                              <Badge className="absolute top-1 left-1 bg-blue-100 text-blue-800 text-xs">
                                Primary
                              </Badge>
                            )}
                            {image.flaggedReasons && image.flaggedReasons.length > 0 && (
                              <div className="absolute top-1 right-1">
                                <Flag className="w-4 h-4 text-red-500" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Image Quality Assessment */}
                      <div className="mt-6">
                        <h4 className="font-medium mb-4">Image Quality Assessment</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Resolution Quality</span>
                            <Badge className="bg-green-100 text-green-800">Good</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Lighting</span>
                            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Angle Coverage</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Background</span>
                            <Badge className="bg-green-100 text-green-800">Professional</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload images to improve listing quality.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Views</p>
                          <p className="text-2xl font-bold text-gray-900">{vehicle.viewCount}</p>
                          <p className="text-sm text-green-600">+12% this week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                          <p className="text-2xl font-bold text-gray-900">{vehicle.leadCount}</p>
                          <p className="text-sm text-green-600">+25% this week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.conversionRate}%</p>
                          <p className="text-sm text-green-600">Above average</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Avg. Time on Page</p>
                          <p className="text-2xl font-bold text-gray-900">{mockAnalytics.averageTimeOnPage}m</p>
                          <p className="text-sm text-green-600">High engagement</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts and detailed analytics would go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Analytics charts would be implemented here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Moderation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Status</span>
                        <Badge className={getModerationBadge(vehicle.moderationStatus)}>
                          {vehicle.moderationStatus}
                        </Badge>
                      </div>

                      {vehicle.flaggedReasons && vehicle.flaggedReasons.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Flagged Issues</span>
                          <ul className="mt-2 space-y-1">
                            {vehicle.flaggedReasons.map((reason, index) => (
                              <li key={index} className="flex items-center text-sm text-red-600">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">Moderation Notes</label>
                        <textarea
                          value={moderationNotes}
                          onChange={(e) => setModerationNotes(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Add notes about this listing..."
                        />
                      </div>

                      <div className="flex space-x-2">
                        {vehicle.moderationStatus === 'PENDING' && (
                          <>
                            <Button
                              onClick={() => handleModerationAction('approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Listing
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleModerationAction('reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Listing
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          onClick={() => handleModerationAction('flag')}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Flag for Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quality Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Overall Quality Score</span>
                        <span className={`text-lg font-bold ${getQualityScoreColor(vehicle.qualityScore)}`}>
                          {vehicle.qualityScore}/100
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Information Completeness</span>
                          <Badge className="bg-green-100 text-green-800">95%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Image Quality</span>
                          <Badge className="bg-green-100 text-green-800">88%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Price Accuracy</span>
                          <Badge className="bg-yellow-100 text-yellow-800">75%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Description Quality</span>
                          <Badge className="bg-green-100 text-green-800">92%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}