'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Building2,
  Users,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Car,
  MessageSquare,
  DollarSign,
  Calendar,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
  Star,
  Eye,
  Shield,
  Download,
  Send
} from 'lucide-react';
import { DealershipData, DealershipStatus } from './DealershipList';

interface DealershipDetailsProps {
  dealership: DealershipData;
  isOpen: boolean;
  onClose: () => void;
}

export function DealershipDetails({ dealership, isOpen, onClose }: DealershipDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(dealership);

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  const getStatusIcon = (status: DealershipStatus) => {
    const icons = {
      'APPROVED': CheckCircle,
      'PENDING': Clock,
      'SUSPENDED': XCircle,
      'REJECTED': XCircle
    };
    return icons[status];
  };

  const getStatusColor = (status: DealershipStatus) => {
    const colors = {
      'APPROVED': 'text-green-600 bg-green-100',
      'PENDING': 'text-yellow-600 bg-yellow-100',
      'SUSPENDED': 'text-red-600 bg-red-100',
      'REJECTED': 'text-gray-600 bg-gray-100'
    };
    return colors[status];
  };

  // Mock performance data
  const performanceMetrics = {
    totalListings: dealership.vehiclesCount,
    activeListings: Math.floor(dealership.vehiclesCount * 0.8),
    totalLeads: dealership.leadsCount,
    convertedLeads: Math.floor(dealership.leadsCount * 0.12),
    conversionRate: 12,
    averageResponseTime: '2.5 hours',
    customerRating: 4.6,
    monthlyViews: 15420,
    totalViews: 89340
  };

  // Mock vehicle data
  const recentVehicles = [
    {
      id: '1',
      title: '2020 BMW X5',
      price: 450000,
      status: 'AVAILABLE',
      views: 234,
      leads: 12,
      createdAt: '2024-09-15'
    },
    {
      id: '2',
      title: '2019 Mercedes C-Class',
      price: 380000,
      status: 'AVAILABLE',
      views: 189,
      leads: 8,
      createdAt: '2024-09-14'
    },
    {
      id: '3',
      title: '2021 Toyota Hilux',
      price: 520000,
      status: 'SOLD',
      views: 156,
      leads: 15,
      createdAt: '2024-09-10'
    }
  ];

  // Mock lead data
  const recentLeads = [
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john@email.com',
      vehicleTitle: '2020 BMW X5',
      status: 'NEW',
      createdAt: '2024-09-17T10:30:00Z',
      source: 'CONTACT_FORM'
    },
    {
      id: '2',
      customerName: 'Sarah Smith',
      customerEmail: 'sarah@email.com',
      vehicleTitle: '2019 Mercedes C-Class',
      status: 'CONTACTED',
      createdAt: '2024-09-16T14:20:00Z',
      source: 'WHATSAPP'
    },
    {
      id: '3',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@email.com',
      vehicleTitle: '2021 Toyota Hilux',
      status: 'QUALIFIED',
      createdAt: '2024-09-15T09:15:00Z',
      source: 'PHONE_CALL'
    }
  ];

  // Mock payment data
  const paymentHistory = [
    {
      id: '1',
      amount: 12500,
      type: 'Commission',
      status: 'PAID',
      date: '2024-09-01',
      description: 'Monthly commission for August 2024'
    },
    {
      id: '2',
      amount: 2500,
      type: 'Subscription',
      status: 'PAID',
      date: '2024-09-01',
      description: 'Premium subscription fee'
    },
    {
      id: '3',
      amount: 8900,
      type: 'Commission',
      status: 'PENDING',
      date: '2024-09-17',
      description: 'Monthly commission for September 2024'
    }
  ];

  // Mock document data
  const documents = [
    {
      id: '1',
      name: 'Business Registration Certificate',
      type: 'PDF',
      status: 'VERIFIED',
      uploadedAt: '2024-01-15T10:30:00Z',
      verifiedAt: '2024-01-16T09:00:00Z'
    },
    {
      id: '2',
      name: 'Tax Clearance Certificate',
      type: 'PDF',
      status: 'VERIFIED',
      uploadedAt: '2024-01-15T10:35:00Z',
      verifiedAt: '2024-01-16T09:05:00Z'
    },
    {
      id: '3',
      name: 'Bank Statement',
      type: 'PDF',
      status: 'PENDING',
      uploadedAt: '2024-09-10T14:20:00Z',
      verifiedAt: null
    }
  ];

  // Mock activity data
  const activityLog = [
    {
      id: '1',
      action: 'Added new vehicle listing',
      details: '2020 BMW X5 - N$450,000',
      timestamp: '2024-09-17T10:30:00Z',
      type: 'VEHICLE'
    },
    {
      id: '2',
      action: 'Updated contact information',
      details: 'Changed phone number',
      timestamp: '2024-09-16T14:20:00Z',
      type: 'PROFILE'
    },
    {
      id: '3',
      action: 'Responded to lead',
      details: 'Lead #123 from John Doe',
      timestamp: '2024-09-15T09:15:00Z',
      type: 'LEAD'
    },
    {
      id: '4',
      action: 'Vehicle sold',
      details: '2018 Audi A4 - N$320,000',
      timestamp: '2024-09-14T16:45:00Z',
      type: 'SALE'
    }
  ];

  const handleSave = () => {
    // In real app, this would make an API call to update the dealership
    console.log('Updating dealership:', formData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: DealershipStatus) => {
    // In real app, this would make an API call to update the status
    console.log('Changing status to:', newStatus);
    setFormData({ ...formData, status: newStatus });
  };

  const handleSendNotification = () => {
    // In real app, this would open a notification composer
    console.log('Send notification to:', dealership.email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{dealership.name}</h2>
              <p className="text-gray-600">{dealership.businessType}</p>
            </div>
            <div className="ml-4">
              <Badge className={`flex items-center gap-1 ${getStatusColor(dealership.status)}`}>
                {(() => {
                  const Icon = getStatusIcon(dealership.status);
                  return <Icon className="w-3 h-3" />;
                })()}
                {dealership.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSendNotification}>
              <Send className="w-4 h-4 mr-2" />
              Notify
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Business Name</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Business Type</label>
                          <Input
                            value={formData.businessType || ''}
                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Registration Number</label>
                          <Input
                            value={formData.registrationNumber || ''}
                            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span>{dealership.businessType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{dealership.registrationNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Joined {new Date(dealership.createdAt).toLocaleDateString()}</span>
                        </div>
                        {dealership.isVerified && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Verified Business</span>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Person</label>
                          <Input
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{dealership.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{dealership.phone}</span>
                        </div>
                        {dealership.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{dealership.email}</span>
                          </div>
                        )}
                        {dealership.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {dealership.website}
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{dealership.city}, {dealership.region}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Status Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Current Status:</span>
                      <Badge className={`${getStatusColor(dealership.status)}`}>
                        {dealership.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange('APPROVED')}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange('SUSPENDED')}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange('PENDING')}
                        className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Save button for editing mode */}
              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Car className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Listings</p>
                        <p className="text-2xl font-bold">{performanceMetrics.totalListings}</p>
                        <p className="text-xs text-gray-500">{performanceMetrics.activeListings} active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <MessageSquare className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold">{performanceMetrics.totalLeads}</p>
                        <p className="text-xs text-gray-500">{performanceMetrics.convertedLeads} converted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold">{performanceMetrics.conversionRate}%</p>
                        <p className="text-xs text-gray-500">Last 30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="w-8 h-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Rating</p>
                        <p className="text-2xl font-bold">{performanceMetrics.customerRating}</p>
                        <p className="text-xs text-gray-500">Customer reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Response Time</span>
                        <Badge className="bg-green-100 text-green-800">{performanceMetrics.averageResponseTime}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Rate</span>
                        <Badge className="bg-blue-100 text-blue-800">98%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>View Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Views</span>
                        <span className="font-semibold">{performanceMetrics.monthlyViews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Views</span>
                        <span className="font-semibold">{performanceMetrics.totalViews.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vehicle Listings</h3>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentVehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{vehicle.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">N${vehicle.price.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {vehicle.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{vehicle.views} views</div>
                              <div className="text-xs text-gray-500">{vehicle.leads} leads</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(vehicle.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Leads</h3>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{lead.customerName}</div>
                              <div className="text-sm text-gray-500">{lead.customerEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{lead.vehicleTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-blue-100 text-blue-800">{lead.source}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                lead.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                                lead.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {lead.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">N${dealership.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold">N${dealership.monthlyRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Commission Rate</p>
                        <p className="text-2xl font-bold">{dealership.commissionRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">N${payment.amount.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{payment.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Business Documents</h3>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{doc.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                doc.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                                doc.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                                {doc.status === 'PENDING' && (
                                  <Button variant="outline" size="sm" className="text-green-600 border-green-300">
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Activity Log</h3>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'VEHICLE' ? 'bg-blue-100' :
                            activity.type === 'LEAD' ? 'bg-green-100' :
                            activity.type === 'SALE' ? 'bg-purple-100' :
                            'bg-gray-100'
                          }`}>
                            {activity.type === 'VEHICLE' && <Car className="w-4 h-4 text-blue-600" />}
                            {activity.type === 'LEAD' && <MessageSquare className="w-4 h-4 text-green-600" />}
                            {activity.type === 'SALE' && <DollarSign className="w-4 h-4 text-purple-600" />}
                            {activity.type === 'PROFILE' && <Users className="w-4 h-4 text-gray-600" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-sm text-gray-500">{activity.details}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}