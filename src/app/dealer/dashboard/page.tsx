'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { 
  Car, 
  Users, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  Plus,
  Settings,
  BarChart3,
  Calendar,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

// Mock data
const mockDealership = {
  id: 'dealer-1',
  name: 'Premium Auto Namibia',
  description: 'Namibia\'s leading premium vehicle dealership',
  address: '123 Independence Avenue',
  city: 'Windhoek',
  state: 'Khomas',
  phone: '+264 61 123 4567',
  email: 'info@premiumauto.na',
  website: 'www.premiumauto.na'
};

const mockVehicles = [
  {
    id: 'v1',
    year: 2022,
    make: 'BMW',
    model: 'X3',
    price: 650000,
    mileage: 25000,
    status: 'AVAILABLE',
    views: 234,
    inquiries: 12,
    favorites: 8,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'White'
  },
  {
    id: 'v2',
    year: 2021,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    price: 580000,
    mileage: 35000,
    status: 'AVAILABLE',
    views: 189,
    inquiries: 8,
    favorites: 15,
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Silver'
  },
  {
    id: 'v3',
    year: 2020,
    make: 'Audi',
    model: 'A4',
    price: 520000,
    mileage: 45000,
    status: 'SOLD',
    views: 156,
    inquiries: 6,
    favorites: 12,
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Black'
  }
];

const mockLeads = [
  {
    id: 'l1',
    vehicleId: 'v1',
    vehicleName: '2022 BMW X3',
    customerName: 'John Smith',
    customerEmail: 'john@email.com',
    customerPhone: '+264 81 123 4567',
    message: 'Interested in this vehicle. Can we schedule a test drive?',
    source: 'Contact Form',
    status: 'NEW',
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'l2',
    vehicleId: 'v2',
    vehicleName: '2021 Mercedes-Benz C-Class',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    customerPhone: '+264 81 987 6543',
    message: 'What is the service history of this vehicle?',
    source: 'WhatsApp',
    status: 'CONTACTED',
    createdAt: '2024-01-19T14:15:00Z'
  },
  {
    id: 'l3',
    vehicleId: 'v1',
    vehicleName: '2022 BMW X3',
    customerName: 'Mike Wilson',
    customerEmail: 'mike@email.com',
    customerPhone: '+264 81 555 0123',
    message: 'Is financing available for this vehicle?',
    source: 'Contact Form',
    status: 'QUALIFIED',
    createdAt: '2024-01-18T09:45:00Z'
  }
];

export default function DealerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    status: 'AVAILABLE'
  });

  // tRPC queries for real data
  const { data: vehicleData, isLoading: vehiclesLoading, error: vehiclesError } = api.vehicle.getByDealership.useQuery({
    limit: 50,
    status: statusFilter === 'ALL' ? undefined : statusFilter as any,
  });

  const { data: leadData, isLoading: leadsLoading, error: leadsError } = api.lead.getByDealership.useQuery({
    limit: 50,
  });

  const { data: leadStats, isLoading: statsLoading } = api.lead.getStats.useQuery({});

  const vehicles = vehicleData?.items || [];
  const leads = leadData?.leads || [];

  // Redirect if not authenticated (disabled for development)
  useEffect(() => {
    if (status === 'loading') return;
    // Temporarily disabled for development testing
    // if (!session) {
    //   router.push('/auth/login?callbackUrl=/dealer/dashboard');
    // }
  }, [session, status, router]);

  // Helper functions
  const formatPrice = (price: number) => {
    return 'N$ ' + new Intl.NumberFormat('en-NA', {
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-NA').format(mileage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'SOLD': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.year.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Enhanced tab switching with loading states
  const handleTabSwitch = async (newTab: string) => {
    if (newTab === activeTab) return;
    
    setIsLoading(true);
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveTab(newTab);
    setIsLoading(false);
    setLastUpdated(new Date());
  };

  // Handle adding new vehicle - redirect to comprehensive wizard
  const handleAddVehicle = () => {
    window.location.href = '/dealer/add-vehicle';
  };

  const handleSubmitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to API
    console.log('Adding new vehicle:', newVehicle);
    
    // For demo, just close modal and reset form
    setShowAddVehicleModal(false);
    setNewVehicle({
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      status: 'AVAILABLE'
    });
    
    // Show success notification
    alert('Vehicle added successfully!');
    setLastUpdated(new Date());
  };

  // Calculate dashboard metrics from real data
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const soldVehicles = vehicles.filter(v => v.status === 'SOLD').length;
  const totalViews = vehicles.reduce((sum, v) => sum + (v.viewCount || 0), 0);
  const totalInquiries = leadStats?.total || 0;
  const newLeads = leadStats?.new || 0;

  if (status === 'loading' || vehiclesLoading || leadsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (vehiclesError || leadsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{vehiclesError?.message || leadsError?.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Inspired by professional dealer systems */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Cars.na</h1>
              <p className="text-sm text-gray-600">Dealer Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleTabSwitch('overview')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Dashboard Overview
                {isLoading && activeTab === 'overview' && (
                  <div className="ml-auto w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('inventory')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'inventory'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Car className="h-4 w-4 mr-3" />
                Stock Manager
                {newLeads > 0 && activeTab !== 'inventory' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{availableVehicles}</span>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('leads')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'leads'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Users className="h-4 w-4 mr-3" />
                Lead Manager
                {newLeads > 0 && activeTab !== 'leads' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{newLeads}</span>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('analytics')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Analytics
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Website</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleTabSwitch('profile')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Website Manager
              </button>
            </div>
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {mockDealership.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{mockDealership.name}</p>
              <p className="text-xs text-gray-500">Premium Account</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'inventory' && 'Stock Manager'}
                {activeTab === 'leads' && 'Lead Manager'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'profile' && 'Website Manager'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'overview' && 'Monitor your dealership performance'}
                {activeTab === 'inventory' && 'Manage your vehicle inventory'}
                {activeTab === 'leads' && 'Track and manage customer inquiries'}
                {activeTab === 'analytics' && 'View detailed performance metrics'}
                {activeTab === 'profile' && 'Update your dealership information'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
                <span className="text-xs">Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              {activeTab === 'inventory' && (
                <Button 
                  onClick={handleAddVehicle}
                  className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className={`space-y-6 transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalVehicles}</div>
                      <p className="text-xs text-muted-foreground">
                        {availableVehicles} available, {soldVehicles} sold
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalInquiries}</div>
                      <p className="text-xs text-muted-foreground">
                        {newLeads} new leads
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8.5%</div>
                      <p className="text-xs text-muted-foreground">
                        +2.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Leads</CardTitle>
                      <CardDescription>Latest customer inquiries</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {leads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{lead.customerName}</p>
                            <p className="text-sm text-gray-600">
                              {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : 'Vehicle Info'}
                            </p>
                            <p className="text-xs text-gray-500">{lead.source}</p>
                          </div>
                          <Badge className={getLeadStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No recent leads
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Vehicles</CardTitle>
                      <CardDescription>Most viewed and inquired vehicles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vehicles
                        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                        .slice(0, 3)
                        .map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <img 
                              src={vehicle.images?.[0]?.url || '/placeholder-car.jpg'} 
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                              <p className="text-sm text-gray-600">{formatPrice(vehicle.price)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{vehicle.viewCount || 0} views</p>
                            <p className="text-xs text-gray-500">Vehicle details</p>
                          </div>
                        </div>
                      ))}
                      {vehicles.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No vehicles in inventory
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="ALL">All Status</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="SOLD">Sold</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Public
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-3">
                          {formatPrice(vehicle.price)}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Mileage:</span>
                            <span>{formatMileage(vehicle.mileage)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transmission:</span>
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fuel Type:</span>
                            <span>{vehicle.fuelType}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {vehicle.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {vehicle.inquiries}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {vehicle.favorites}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Leads</CardTitle>
                    <CardDescription>Manage inquiries and customer communications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div key={lead.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-semibold">{lead.customerName}</h4>
                                <p className="text-sm text-gray-600">
                                  {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : 'Vehicle Info'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getLeadStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                              <Badge variant="outline">{lead.source}</Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{lead.message || 'No message provided'}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {lead.customerEmail}
                              </span>
                              {lead.customerPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {lead.customerPhone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Reply</Button>
                              <Button size="sm">Contact</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="font-medium mb-2">No leads yet</h3>
                          <p className="text-sm">Customer inquiries will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                      <CardDescription>Key metrics for your dealership</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Total Listings</span>
                        <span className="font-semibold">{totalVehicles}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Active Listings</span>
                        <span className="font-semibold">{availableVehicles}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Vehicles Sold</span>
                        <span className="font-semibold">{soldVehicles}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Total Views</span>
                        <span className="font-semibold">{totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Total Inquiries</span>
                        <span className="font-semibold">{totalInquiries}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Sources</CardTitle>
                      <CardDescription>Where your leads are coming from</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span>Contact Form</span>
                        <span className="font-semibold">65%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>WhatsApp</span>
                        <span className="font-semibold">25%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span>Phone Calls</span>
                        <span className="font-semibold">10%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Manager</CardTitle>
                    <CardDescription>Manage your dealership information and online presence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Dealership Name</label>
                        <Input defaultValue={mockDealership.name} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input defaultValue={mockDealership.phone} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input defaultValue={mockDealership.email} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Website</label>
                        <Input defaultValue={mockDealership.website} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded-md p-3"
                          rows={3}
                          defaultValue={mockDealership.description}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <Input defaultValue={`${mockDealership.address}, ${mockDealership.city}, ${mockDealership.state}`} />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Vehicle</h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Make</label>
                  <Input
                    required
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                    placeholder="BMW, Mercedes, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <Input
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    placeholder="X3, C-Class, etc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <Input
                    required
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                    placeholder="2023"
                    min="1990"
                    max="2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (N$)</label>
                  <Input
                    required
                    type="number"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({...newVehicle, price: e.target.value})}
                    placeholder="650000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                <Input
                  required
                  type="number"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
                  placeholder="25000"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Transmission</label>
                  <select
                    value={newVehicle.transmission}
                    onChange={(e) => setNewVehicle({...newVehicle, transmission: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
