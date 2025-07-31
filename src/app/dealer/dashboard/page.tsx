'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Heart,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

// Mock data - In real app, this would come from your API
const mockDealership = {
  id: 'dealer-1',
  name: 'Premium Auto Namibia',
  description: 'Namibia\'s leading premium vehicle dealership',
  address: '123 Independence Avenue',
  city: 'Windhoek',
  state: 'Khomas',
  phone: '+264 61 123 4567',
  email: 'info@premiumauto.na',
  website: 'www.premiumauto.na',
  rating: 4.8,
  totalReviews: 156,
  verified: true,
  joinedDate: '2023-01-15'
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
    listedDate: '2024-01-15',
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
    listedDate: '2024-01-10',
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
    listedDate: '2024-01-05',
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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login?callbackUrl=/dealer/dashboard');
    }
  }, [session, status, router]);

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

  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.year.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate dashboard metrics
  const totalVehicles = mockVehicles.length;
  const availableVehicles = mockVehicles.filter(v => v.status === 'AVAILABLE').length;
  const soldVehicles = mockVehicles.filter(v => v.status === 'SOLD').length;
  const totalViews = mockVehicles.reduce((sum, v) => sum + v.views, 0);
  const totalInquiries = mockVehicles.reduce((sum, v) => sum + v.inquiries, 0);
  const newLeads = mockLeads.filter(l => l.status === 'NEW').length;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dealer Dashboard</h1>
                <p className="text-sm text-gray-600">{mockDealership.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
                  {mockLeads.slice(0, 3).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{lead.customerName}</p>
                        <p className="text-sm text-gray-600">{lead.vehicleName}</p>
                        <p className="text-xs text-gray-500">{lead.source}</p>
                      </div>
                      <Badge className={getLeadStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Vehicles</CardTitle>
                  <CardDescription>Most viewed and inquired vehicles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockVehicles
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-gray-600">{formatPrice(vehicle.price)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{vehicle.views} views</p>
                        <p className="text-xs text-gray-500">{vehicle.inquiries} inquiries</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Inventory Controls */}
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
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
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Leads</CardTitle>
                <CardDescription>Manage inquiries and customer communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-semibold">{lead.customerName}</h4>
                            <p className="text-sm text-gray-600">{lead.vehicleName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getLeadStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                          <Badge variant="outline">{lead.source}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{lead.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {lead.customerEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {lead.customerPhone}
                          </span>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
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
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dealership Profile</CardTitle>
                <CardDescription>Manage your dealership information</CardDescription>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
