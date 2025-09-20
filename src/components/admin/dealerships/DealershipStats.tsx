'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Car,
  Users,
  DollarSign,
  MessageSquare,
  Star,
  Clock,
  Eye,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  Building2
} from 'lucide-react';

interface DealershipStatsProps {
  dealershipId?: string;
  dateRange?: 'week' | 'month' | 'quarter' | 'year';
}

interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  format: 'number' | 'currency' | 'percentage';
}

interface DealerPerformance {
  id: string;
  name: string;
  listings: number;
  leads: number;
  conversions: number;
  revenue: number;
  rating: number;
  tier: 'Gold' | 'Silver' | 'Bronze';
}

export function DealershipStats({ dealershipId, dateRange = 'month' }: DealershipStatsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(dateRange);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock performance data
  const performanceMetrics: PerformanceMetric[] = [
    {
      label: 'Total Listings',
      value: 2847,
      change: 12.5,
      trend: 'up',
      format: 'number'
    },
    {
      label: 'Active Dealers',
      value: 89,
      change: 5.2,
      trend: 'up',
      format: 'number'
    },
    {
      label: 'Total Leads',
      value: 1534,
      change: 8.7,
      trend: 'up',
      format: 'number'
    },
    {
      label: 'Conversion Rate',
      value: 12.4,
      change: -2.1,
      trend: 'down',
      format: 'percentage'
    },
    {
      label: 'Monthly Revenue',
      value: 486500,
      change: 15.3,
      trend: 'up',
      format: 'currency'
    },
    {
      label: 'Avg. Response Time',
      value: 2.5,
      change: -12.0,
      trend: 'up',
      format: 'number'
    }
  ];

  // Mock top performing dealers
  const topDealers: DealerPerformance[] = [
    {
      id: '1',
      name: 'Premium Motors Namibia',
      listings: 45,
      leads: 123,
      conversions: 18,
      revenue: 125000,
      rating: 4.8,
      tier: 'Gold'
    },
    {
      id: '2',
      name: 'City Cars Swakopmund',
      listings: 32,
      leads: 89,
      conversions: 12,
      revenue: 89000,
      rating: 4.6,
      tier: 'Silver'
    },
    {
      id: '3',
      name: 'Elite Autos Oshakati',
      listings: 28,
      leads: 67,
      conversions: 9,
      revenue: 67000,
      rating: 4.4,
      tier: 'Silver'
    },
    {
      id: '4',
      name: 'Motor City Windhoek',
      listings: 25,
      leads: 54,
      conversions: 7,
      revenue: 54000,
      rating: 4.2,
      tier: 'Bronze'
    },
    {
      id: '5',
      name: 'Coastal Motors',
      listings: 22,
      leads: 48,
      conversions: 6,
      revenue: 45000,
      rating: 4.1,
      tier: 'Bronze'
    }
  ];

  // Mock regional performance data
  const regionalData = [
    { region: 'Khomas', dealers: 32, listings: 1247, revenue: 198500, avgRating: 4.5 },
    { region: 'Erongo', dealers: 18, listings: 687, revenue: 123400, avgRating: 4.3 },
    { region: 'Oshana', dealers: 12, listings: 456, revenue: 89600, avgRating: 4.2 },
    { region: 'Hardap', dealers: 8, listings: 234, revenue: 45300, avgRating: 4.1 },
    { region: 'Others', dealers: 19, listings: 223, revenue: 29700, avgRating: 4.0 }
  ];

  // Mock monthly trend data
  const monthlyTrends = [
    { month: 'Jan', listings: 2156, leads: 1234, revenue: 385000 },
    { month: 'Feb', listings: 2298, leads: 1345, revenue: 412000 },
    { month: 'Mar', listings: 2434, leads: 1456, revenue: 438000 },
    { month: 'Apr', listings: 2567, leads: 1534, revenue: 467000 },
    { month: 'May', listings: 2689, leads: 1623, revenue: 486500 },
    { month: 'Jun', listings: 2847, leads: 1534, revenue: 486500 }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `N$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'Silver':
        return 'text-gray-600 bg-gray-100';
      case 'Bronze':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConversionRate = (conversions: number, leads: number) => {
    return leads > 0 ? ((conversions / leads) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dealership Analytics</h2>
          <p className="text-gray-600">Performance insights and business metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
            <option value="year">Last 12 months</option>
          </select>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = [Car, Building2, MessageSquare, Target, DollarSign, Clock][index];
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      index % 6 === 0 ? 'bg-blue-100' :
                      index % 6 === 1 ? 'bg-green-100' :
                      index % 6 === 2 ? 'bg-purple-100' :
                      index % 6 === 3 ? 'bg-orange-100' :
                      index % 6 === 4 ? 'bg-indigo-100' :
                      'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        index % 6 === 0 ? 'text-blue-600' :
                        index % 6 === 1 ? 'text-green-600' :
                        index % 6 === 2 ? 'text-purple-600' :
                        index % 6 === 3 ? 'text-orange-600' :
                        index % 6 === 4 ? 'text-indigo-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatValue(metric.value, metric.format)}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center text-sm ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                    {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Performing Dealers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Performing Dealers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDealers.map((dealer, index) => (
                <div key={dealer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dealer.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{dealer.listings} listings</span>
                        <span>{dealer.leads} leads</span>
                        <span>{getConversionRate(dealer.conversions, dealer.leads)}% conversion</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">N${dealer.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{dealer.rating}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(dealer.tier)}`}>
                      {dealer.tier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalData.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{region.region}</span>
                    <span className="text-sm text-gray-600">{region.dealers} dealers</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Listings:</span>
                      <p className="font-medium">{region.listings}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue:</span>
                      <p className="font-medium">N${region.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="font-medium">{region.avgRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(region.revenue / 200000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Listings Trend */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Listings Growth</h4>
              <div className="space-y-2">
                {monthlyTrends.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.listings / 3000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{month.listings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads Trend */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Leads Generation</h4>
              <div className="space-y-2">
                {monthlyTrends.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(month.leads / 2000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{month.leads}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Trend */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Revenue Growth</h4>
              <div className="space-y-2">
                {monthlyTrends.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(month.revenue / 500000) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16">N${Math.round(month.revenue / 1000)}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Growth Rate</h4>
              <p className="text-2xl font-bold text-blue-600">+12.5%</p>
              <p className="text-sm text-gray-600">vs last month</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Avg Rating</h4>
              <p className="text-2xl font-bold text-green-600">4.5</p>
              <p className="text-sm text-gray-600">dealer rating</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Response Time</h4>
              <p className="text-2xl font-bold text-purple-600">2.5h</p>
              <p className="text-sm text-gray-600">average</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-gray-900">Conversion</h4>
              <p className="text-2xl font-bold text-orange-600">12.4%</p>
              <p className="text-sm text-gray-600">lead to sale</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}