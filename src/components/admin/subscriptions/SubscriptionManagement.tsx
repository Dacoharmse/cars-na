'use client';

import { useState, useEffect } from 'react';
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

interface ApiSubscription {
  id: string;
  dealershipId: string;
  dealershipName: string;
  billingEmail: string;
  planId: string;
  plan: string;
  planPrice: number;
  status: string;
  billingCycle: string;
  monthlyFee: number;
  nextBilling: string | null;
  totalPaid: number;
  autoRenew: boolean;
  currentListings: number;
  startedAt: string;
  createdAt: string;
}

interface ApiPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxListings: number;
  maxPhotos: number;
  features: unknown;
  status: string;
  subscribers: number;
  priority: number;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  stats: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    pendingSubscriptions: number;
    overdueSubscriptions: number;
    cancelledSubscriptions: number;
    monthlyRevenue: number;
    annualRevenue: number;
    avgSubscriptionValue: number;
    churnRate: number;
  };
  subscriptions: ApiSubscription[];
  plans: ApiPlan[];
}

function mapApiToSubscription(sub: ApiSubscription, plans: ApiPlan[]): DealershipSubscription {
  const matchedPlan = plans.find(p => p.id === sub.planId);
  return {
    id: sub.id,
    dealership: {
      id: sub.dealershipId,
      name: sub.dealershipName,
      contactPerson: '', // Not available from API
      email: sub.billingEmail,
      phone: '',         // Not available from API
    },
    plan: {
      name: sub.plan,
      price: sub.planPrice,
      currency: matchedPlan?.currency || 'NAD',
    },
    status: sub.status as DealershipSubscription['status'],
    startDate: sub.startedAt,
    endDate: '',           // Not returned by API
    autoRenew: sub.autoRenew,
    currentListings: sub.currentListings,
    maxListings: matchedPlan?.maxListings ?? 0,
    totalRevenue: sub.totalPaid,
    lastPaymentDate: '',   // Not returned by API
    nextPaymentDate: sub.nextBilling || '',
  };
}

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
  const [subscriptions, setSubscriptions] = useState<DealershipSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubscription, setSelectedSubscription] = useState<DealershipSubscription | null>(null);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/subscriptions');
        if (!res.ok) {
          throw new Error(`Failed to fetch subscriptions (${res.status})`);
        }
        const data: ApiResponse = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch subscriptions');
        }
        const mapped = data.subscriptions.map(sub => mapApiToSubscription(sub, data.plans));
        setSubscriptions(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600">Loading subscriptions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
        <p className="text-red-600 font-medium">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

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