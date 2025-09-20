'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import DealershipAnalyticsDashboard from '@/components/analytics/DealershipAnalyticsDashboard';
import PerformanceComparison from '@/components/analytics/PerformanceComparison';
import SubscriptionTierAnalytics from '@/components/analytics/SubscriptionTierAnalytics';
import {
  BarChart3,
  TrendingUp,
  Target,
  Crown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function DealerAnalyticsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Mock user data - in real app this would come from session/API
  const dealershipData = {
    id: 'dealer-123',
    name: 'Premium Motors Namibia',
    subscriptionTier: 'professional' as const,
    isActive: true,
    lastUpdated: new Date().toISOString()
  };

  if (!session) {
    redirect('/auth/login');
  }

  const handleRefreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Track performance, analyze trends, and optimize your dealership success
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-purple-100 text-purple-800">
                  <Crown className="w-3 h-3 mr-1" />
                  {dealershipData.subscriptionTier.charAt(0).toUpperCase() + dealershipData.subscriptionTier.slice(1)} Plan
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshData}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">24.5K</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Leads Generated</p>
                      <p className="text-2xl font-bold text-gray-900">156</p>
                    </div>
                    <Target className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">3.2%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+0.8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Performance Score</p>
                      <p className="text-2xl font-bold text-gray-900">78/100</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600">85th percentile</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Benchmarks
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DealershipAnalyticsDashboard dealershipId={dealershipData.id} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <DealershipAnalyticsDashboard dealershipId={dealershipData.id} />
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <PerformanceComparison />
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <SubscriptionTierAnalytics
                currentTier={dealershipData.subscriptionTier}
                dealershipId={dealershipData.id}
              />
            </TabsContent>
          </Tabs>

          {/* Analytics Notice for Lower Tiers */}
          {dealershipData.subscriptionTier === 'starter' && (
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Unlock Advanced Analytics
                    </h3>
                    <p className="text-blue-800 mb-4">
                      Get deeper insights with competitor analysis, AI-powered recommendations,
                      and real-time alerts. Professional and Enterprise plans include advanced
                      analytics features to help you outperform the competition.
                    </p>
                    <div className="flex items-center space-x-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Professional
                      </Button>
                      <Button variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}