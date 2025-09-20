'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { trpc } from '@/lib/trpc';
import {
  Crown,
  Star,
  Zap,
  TrendingUp,
  Users,
  Eye,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface SubscriptionDashboardProps {
  dealershipId: string;
}

export default function SubscriptionDashboard({ dealershipId }: SubscriptionDashboardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: subscription, isLoading } = trpc.subscription.getDealershipSubscription.useQuery({
    dealershipId,
  });

  const { data: analytics } = trpc.subscription.getAnalytics.useQuery({
    dealershipId,
    days: 30,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">
            Subscribe to a plan to unlock powerful features for your dealership.
          </p>
          <Button onClick={() => setShowUpgrade(true)}>
            Choose a Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <Zap className="w-6 h-6 text-blue-500" />;
      case 'professional':
        return <Star className="w-6 h-6 text-purple-500" />;
      case 'enterprise':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      default:
        return <Zap className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAST_DUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'PAST_DUE':
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const usagePercentage = subscription.plan.maxListings > 0
    ? (subscription.currentListings / subscription.plan.maxListings) * 100
    : 0;

  const totalAnalytics = analytics?.reduce(
    (acc, day) => ({
      views: acc.views + day.listingsViewed,
      leads: acc.leads + day.leadGenerated,
      inquiries: acc.inquiries + day.inquiriesReceived,
      calls: acc.calls + day.phoneCallsReceived,
    }),
    { views: 0, leads: 0, inquiries: 0, calls: 0 }
  ) || { views: 0, leads: 0, inquiries: 0, calls: 0 };

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getPlanIcon(subscription.plan.name)}
              <div>
                <h3 className="text-xl font-bold">{subscription.plan.name} Plan</h3>
                <p className="text-gray-600 text-sm">{subscription.plan.description}</p>
              </div>
            </div>
            <Badge className={`flex items-center space-x-1 ${getStatusColor(subscription.status)}`}>
              {getStatusIcon(subscription.status)}
              <span>{subscription.status.replace('_', ' ')}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="text-2xl font-bold">NAD {subscription.plan.price.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Payment</p>
              <p className="text-lg font-semibold">
                {subscription.nextPaymentDate
                  ? new Date(subscription.nextPaymentDate).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Auto Renew</p>
              <p className="text-lg font-semibold">
                {subscription.autoRenew ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vehicle Listings</p>
                <p className="text-2xl font-bold">
                  {subscription.currentListings}
                  {subscription.plan.maxListings > 0 && (
                    <span className="text-lg text-gray-500">/{subscription.plan.maxListings}</span>
                  )}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            {subscription.plan.maxListings > 0 && (
              <div className="mt-4">
                <Progress value={usagePercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {usagePercentage.toFixed(0)}% of limit used
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{totalAnalytics.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                <p className="text-2xl font-bold">{totalAnalytics.leads}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inquiries</p>
                <p className="text-2xl font-bold">{totalAnalytics.inquiries}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Your Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(subscription.plan.features as string[]).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      {subscription.payments && subscription.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscription.payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">NAD {payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setShowUpgrade(true)}>
          Upgrade Plan
        </Button>
        <Button variant="outline" className="text-red-600 hover:text-red-700">
          Cancel Subscription
        </Button>
      </div>
    </div>
  );
}