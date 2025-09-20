'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

interface DealershipSubscription {
  id: string;
  dealership: {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  plan: {
    name: string;
    price: number;
    currency: string;
  };
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED' | 'PENDING_PAYMENT' | 'PAST_DUE';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  currentListings: number;
  maxListings: number;
  totalRevenue: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

// Mock data for demonstration
const mockSubscriptions: DealershipSubscription[] = [
  {
    id: '1',
    dealership: {
      id: '1',
      name: 'Premium Motors Windhoek',
      contactPerson: 'Johannes Müller',
      email: 'johannes@premiummotors.com.na',
      phone: '+264 61 123 4567'
    },
    plan: {
      name: 'Enterprise',
      price: 4999,
      currency: 'NAD'
    },
    status: 'ACTIVE',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    autoRenew: true,
    currentListings: 45,
    maxListings: 0, // Unlimited
    totalRevenue: 49990,
    lastPaymentDate: '2024-08-15',
    nextPaymentDate: '2024-09-15'
  },
  {
    id: '2',
    dealership: {
      id: '2',
      name: 'City Auto Traders',
      contactPerson: 'Maria Silva',
      email: 'maria@cityauto.na',
      phone: '+264 81 987 6543'
    },
    plan: {
      name: 'Professional',
      price: 2499,
      currency: 'NAD'
    },
    status: 'ACTIVE',
    startDate: '2024-03-01',
    endDate: '2024-12-01',
    autoRenew: true,
    currentListings: 67,
    maxListings: 100,
    totalRevenue: 17493,
    lastPaymentDate: '2024-08-01',
    nextPaymentDate: '2024-09-01'
  },
  {
    id: '3',
    dealership: {
      id: '3',
      name: 'Desert Wheels',
      contactPerson: 'David Shikongo',
      email: 'david@desertwheels.na',
      phone: '+264 64 456 7890'
    },
    plan: {
      name: 'Starter',
      price: 899,
      currency: 'NAD'
    },
    status: 'PAST_DUE',
    startDate: '2024-02-10',
    endDate: '2024-11-10',
    autoRenew: false,
    currentListings: 23,
    maxListings: 25,
    totalRevenue: 6293,
    lastPaymentDate: '2024-07-10',
    nextPaymentDate: '2024-08-10'
  },
  {
    id: '4',
    dealership: {
      id: '4',
      name: 'Coastal Cars',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@coastalcars.na',
      phone: '+264 64 789 0123'
    },
    plan: {
      name: 'Professional',
      price: 2499,
      currency: 'NAD'
    },
    status: 'SUSPENDED',
    startDate: '2024-01-20',
    endDate: '2024-10-20',
    autoRenew: true,
    currentListings: 0,
    maxListings: 100,
    totalRevenue: 19992,
    lastPaymentDate: '2024-07-20',
    nextPaymentDate: '2024-08-20'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'SUSPENDED':
      return 'bg-yellow-100 text-yellow-800';
    case 'PAST_DUE':
      return 'bg-red-100 text-red-800';
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-800';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800';
    case 'PENDING_PAYMENT':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <CheckCircle className="w-4 h-4" />;
    case 'SUSPENDED':
      return <AlertTriangle className="w-4 h-4" />;
    case 'PAST_DUE':
      return <XCircle className="w-4 h-4" />;
    case 'EXPIRED':
      return <Clock className="w-4 h-4" />;
    case 'CANCELLED':
      return <XCircle className="w-4 h-4" />;
    case 'PENDING_PAYMENT':
      return <CreditCard className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<DealershipSubscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubscription, setSelectedSubscription] = useState<DealershipSubscription | null>(null);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.dealership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.dealership.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'ACTIVE').length;
  const totalMRR = subscriptions.filter(sub => sub.status === 'ACTIVE')
    .reduce((sum, sub) => sum + sub.plan.price, 0);
  const pastDueCount = subscriptions.filter(sub => sub.status === 'PAST_DUE').length;

  const handleStatusChange = (subscriptionId: string, newStatus: string) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === subscriptionId ? { ...sub, status: newStatus as any } : sub
    ));
  };

  const exportData = () => {
    const csvData = filteredSubscriptions.map(sub => ({
      'Dealership': sub.dealership.name,
      'Contact': sub.dealership.contactPerson,
      'Plan': sub.plan.name,
      'Status': sub.status,
      'Price': sub.plan.price,
      'Current Listings': sub.currentListings,
      'Total Revenue': sub.totalRevenue,
      'Next Payment': sub.nextPaymentDate
    }));

    console.log('Exporting data:', csvData);
    // Implementation would generate and download CSV
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900">{totalSubscriptions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-3xl font-bold text-green-600">{activeSubscriptions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-blue-600">NAD {totalMRR.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Past Due</p>
                <p className="text-3xl font-bold text-red-600">{pastDueCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Monitor and manage dealership subscriptions</p>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search dealerships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAST_DUE">Past Due</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Dealership</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Listings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Next Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{subscription.dealership.name}</div>
                        <div className="text-sm text-gray-600">{subscription.dealership.contactPerson}</div>
                        <div className="text-sm text-gray-500">{subscription.dealership.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{subscription.plan.name}</div>
                        <div className="text-sm text-gray-600">
                          {subscription.plan.currency} {subscription.plan.price.toLocaleString()}/month
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusColor(subscription.status)} flex items-center w-fit`}>
                        {getStatusIcon(subscription.status)}
                        <span className="ml-1">{subscription.status.replace('_', ' ')}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {subscription.currentListings}
                          {subscription.maxListings > 0 && ` / ${subscription.maxListings}`}
                          {subscription.maxListings === 0 && ' / Unlimited'}
                        </div>
                        <div className="text-gray-600">
                          {subscription.maxListings > 0 &&
                            `${Math.round((subscription.currentListings / subscription.maxListings) * 100)}% used`
                          }
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        NAD {subscription.totalRevenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {new Date(subscription.nextPaymentDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${
                          new Date(subscription.nextPaymentDate) < new Date()
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {new Date(subscription.nextPaymentDate) < new Date() ? 'Overdue' : 'Upcoming'}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubscription(subscription)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Subscription Details</DialogTitle>
                              <DialogDescription>
                                Detailed view of {subscription.dealership.name}&apos;s subscription
                              </DialogDescription>
                            </DialogHeader>

                            {selectedSubscription && (
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Dealership Information</h4>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                      <p><strong>Name:</strong> {selectedSubscription.dealership.name}</p>
                                      <p><strong>Contact:</strong> {selectedSubscription.dealership.contactPerson}</p>
                                      <p><strong>Email:</strong> {selectedSubscription.dealership.email}</p>
                                      <p><strong>Phone:</strong> {selectedSubscription.dealership.phone}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium text-gray-900">Subscription Details</h4>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                      <p><strong>Plan:</strong> {selectedSubscription.plan.name}</p>
                                      <p><strong>Price:</strong> {selectedSubscription.plan.currency} {selectedSubscription.plan.price.toLocaleString()}/month</p>
                                      <p><strong>Status:</strong> {selectedSubscription.status}</p>
                                      <p><strong>Auto Renew:</strong> {selectedSubscription.autoRenew ? 'Yes' : 'No'}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium text-gray-900">Usage Statistics</h4>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                      <p><strong>Current Listings:</strong> {selectedSubscription.currentListings}</p>
                                      <p><strong>Max Listings:</strong> {selectedSubscription.maxListings === 0 ? 'Unlimited' : selectedSubscription.maxListings}</p>
                                      <p><strong>Total Revenue:</strong> NAD {selectedSubscription.totalRevenue.toLocaleString()}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-medium text-gray-900">Payment Information</h4>
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                      <p><strong>Last Payment:</strong> {new Date(selectedSubscription.lastPaymentDate).toLocaleDateString()}</p>
                                      <p><strong>Next Payment:</strong> {new Date(selectedSubscription.nextPaymentDate).toLocaleDateString()}</p>
                                      <p><strong>Start Date:</strong> {new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                                      <p><strong>End Date:</strong> {new Date(selectedSubscription.endDate).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <select
                          value={subscription.status}
                          onChange={(e) => handleStatusChange(subscription.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="SUSPENDED">Suspended</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="PAST_DUE">Past Due</option>
                        </select>
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
  );
}