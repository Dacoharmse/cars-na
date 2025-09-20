'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Flag,
  TrendingUp,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface Dealership {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  createdAt: Date;
  updatedAt: Date;
  dealership: Dealership;
  images: VehicleImage[];
}

interface VehicleListProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onVehicleAction?: (action: string, vehicleId: string) => void;
}

// Mock data for demonstration
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    make: 'BMW',
    model: 'X5',
    year: 2020,
    price: 450000,
    originalPrice: 520000,
    mileage: 25000,
    color: 'Black',
    vin: 'WBAXL4C53LDH12345',
    description: 'Luxury SUV in excellent condition',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'SUV',
    status: 'AVAILABLE',
    moderationStatus: 'APPROVED',
    featured: true,
    dealerPick: true,
    isNew: false,
    isPrivate: false,
    viewCount: 1234,
    leadCount: 45,
    qualityScore: 92,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    dealership: {
      id: 'dealer1',
      name: 'Premium Motors',
      email: 'contact@premium.com',
      phone: '+264-61-123456'
    },
    images: [{
      id: 'img1',
      url: '/images/bmw-x5.jpg',
      isPrimary: true
    }]
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'Hilux',
    year: 2021,
    price: 520000,
    mileage: 15000,
    color: 'White',
    vin: 'JTKKU4B41M1234567',
    description: 'Brand new pickup truck',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    status: 'AVAILABLE',
    moderationStatus: 'PENDING',
    featured: false,
    dealerPick: false,
    isNew: true,
    isPrivate: false,
    viewCount: 567,
    leadCount: 12,
    qualityScore: 85,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    dealership: {
      id: 'dealer2',
      name: 'City Cars',
      email: 'info@citycars.com',
      phone: '+264-61-789012'
    },
    images: [{
      id: 'img2',
      url: '/images/toyota-hilux.jpg',
      isPrimary: true
    }]
  },
  {
    id: '3',
    make: 'Audi',
    model: 'A4',
    year: 2018,
    price: 320000,
    mileage: 45000,
    color: 'Silver',
    vin: 'WAUZZZF4XMA123456',
    description: 'Sporty sedan with premium features',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: 'Sedan',
    status: 'AVAILABLE',
    moderationStatus: 'FLAGGED',
    featured: false,
    dealerPick: false,
    isNew: false,
    isPrivate: false,
    viewCount: 234,
    leadCount: 3,
    qualityScore: 67,
    flaggedReasons: ['Suspicious pricing', 'Poor image quality'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    dealership: {
      id: 'dealer3',
      name: 'Elite Autos',
      email: 'sales@elite.com',
      phone: '+264-61-345678'
    },
    images: [{
      id: 'img3',
      url: '/images/audi-a4.jpg',
      isPrimary: true
    }]
  }
];

export default function VehicleList({ onVehicleSelect, onVehicleAction }: VehicleListProps) {
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [moderationFilter, setModerationFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedVehicles = useMemo(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = !searchTerm ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.dealership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
      const matchesModeration = moderationFilter === 'all' || vehicle.moderationStatus === moderationFilter;

      return matchesSearch && matchesStatus && matchesModeration;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'mileage':
          aValue = a.mileage;
          bValue = b.mileage;
          break;
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'qualityScore':
          aValue = a.qualityScore;
          bValue = b.qualityScore;
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [vehicles, searchTerm, statusFilter, moderationFilter, sortField, sortDirection]);

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleVehicleAction = (action: string, vehicleId: string) => {
    onVehicleAction?.(action, vehicleId);
  };

  const handleBulkAction = (action: string) => {
    selectedVehicles.forEach(vehicleId => {
      handleVehicleAction(action, vehicleId);
    });
    setSelectedVehicles([]);
  };

  const toggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const selectAllVisible = () => {
    setSelectedVehicles(filteredAndSortedVehicles.map(v => v.id));
  };

  const clearSelection = () => {
    setSelectedVehicles([]);
  };

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
          <p className="text-gray-600">
            {filteredAndSortedVehicles.length} vehicles found
            {selectedVehicles.length > 0 && ` • ${selectedVehicles.length} selected`}
          </p>
        </div>

        <div className="flex space-x-2">
          {selectedVehicles.length > 0 && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('approve')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('reject')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear Selection
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button variant="outline">
            Export Data
          </Button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by make, model, dealer, or VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
          <option value="PENDING">Pending</option>
          <option value="RESERVED">Reserved</option>
        </select>

        <select
          value={moderationFilter}
          onChange={(e) => setModerationFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Moderation</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending Review</option>
          <option value="FLAGGED">Flagged</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year Range</label>
                <div className="flex space-x-2">
                  <Input placeholder="From" type="number" />
                  <Input placeholder="To" type="number" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quality Score</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">All Scores</option>
                  <option value="high">80+ (High)</option>
                  <option value="medium">60-79 (Medium)</option>
                  <option value="low">&lt;60 (Low)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Flags</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Featured Only
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Dealer Picks
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    New Cars Only
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => e.target.checked ? selectAllVisible() : clearSelection()}
                      checked={selectedVehicles.length === filteredAndSortedVehicles.length && filteredAndSortedVehicles.length > 0}
                    />
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moderation
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('qualityScore')}
                  >
                    <div className="flex items-center">
                      Quality
                      {sortField === 'qualityScore' && (
                        sortDirection === 'asc' ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('viewCount')}
                  >
                    <div className="flex items-center">
                      Performance
                      {sortField === 'viewCount' && (
                        sortDirection === 'asc' ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedVehicles.includes(vehicle.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => onVehicleSelect?.(vehicle)}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle.id)}
                        onChange={() => toggleVehicleSelection(vehicle.id)}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={vehicle.images[0]?.url || '/placeholder-car.jpg'}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.dealership.name} • {vehicle.mileage.toLocaleString()} km
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {vehicle.featured && (
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {vehicle.dealerPick && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Dealer Pick
                              </Badge>
                            )}
                            {vehicle.isNew && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        N${vehicle.price.toLocaleString()}
                      </div>
                      {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                        <div className="text-sm text-gray-500 line-through">
                          N${vehicle.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadge(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getModerationBadge(vehicle.moderationStatus)}>
                        {vehicle.moderationStatus}
                      </Badge>
                      {vehicle.flaggedReasons && vehicle.flaggedReasons.length > 0 && (
                        <div className="text-xs text-red-600 mt-1">
                          <Flag className="w-3 h-3 inline mr-1" />
                          {vehicle.flaggedReasons.length} issues
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getQualityScoreColor(vehicle.qualityScore)}`}>
                        {vehicle.qualityScore}/100
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {vehicle.viewCount}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {vehicle.leadCount} leads
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVehicleAction('view', vehicle.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVehicleAction('edit', vehicle.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {vehicle.moderationStatus === 'PENDING' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVehicleAction('approve', vehicle.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVehicleAction('reject', vehicle.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVehicleAction('more', vehicle.id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}