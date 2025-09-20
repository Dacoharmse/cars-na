'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Car,
  Building2,
  Clock,
  Target,
  Zap,
  Award
} from 'lucide-react';

interface AnalyticsData {
  totalListings: number;
  activeListings: number;
  averagePrice: number;
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  averageTimeOnMarket: number;
  topPerformingMakes: Array<{ make: string; count: number; avgPrice: number }>;
  topPerformingDealers: Array<{ name: string; listings: number; revenue: number }>;
  priceDistribution: Array<{ range: string; count: number }>;
  viewsOverTime: Array<{ date: string; views: number; leads: number }>;
  geographicDistribution: Array<{ region: string; listings: number; avgPrice: number }>;
  qualityMetrics: {
    averageQualityScore: number;
    highQualityListings: number;
    imageQualityAverage: number;
    contentCompletenessAverage: number;
  };
}

interface VehicleAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onExport?: (format: string) => void;
}

// Mock analytics data
const MOCK_ANALYTICS: AnalyticsData = {
  totalListings: 3456,
  activeListings: 2876,
  averagePrice: 425000,
  totalViews: 156789,
  totalLeads: 4523,
  conversionRate: 2.88,
  averageTimeOnMarket: 18.5,
  topPerformingMakes: [
    { make: 'Toyota', count: 456, avgPrice: 380000 },
    { make: 'BMW', count: 234, avgPrice: 520000 },
    { make: 'Mercedes-Benz', count: 198, avgPrice: 610000 },
    { make: 'Audi', count: 167, avgPrice: 485000 },
    { make: 'Volkswagen', count: 145, avgPrice: 320000 }
  ],
  topPerformingDealers: [
    { name: 'Premium Motors', listings: 89, revenue: 4250000 },
    { name: 'City Cars', listings: 76, revenue: 3180000 },
    { name: 'Elite Autos', listings: 65, revenue: 2890000 },
    { name: 'Auto Palace', listings: 58, revenue: 2650000 },
    { name: 'Budget Cars', listings: 52, revenue: 1980000 }
  ],
  priceDistribution: [
    { range: 'Under N$200k', count: 456 },
    { range: 'N$200k - N$400k', count: 1234 },
    { range: 'N$400k - N$600k', count: 987 },
    { range: 'N$600k - N$800k', count: 567 },
    { range: 'Above N$800k', count: 212 }
  ],
  viewsOverTime: [
    { date: '2024-01-14', views: 12456, leads: 345 },
    { date: '2024-01-15', views: 13234, leads: 389 },
    { date: '2024-01-16', views: 11876, leads: 312 },
    { date: '2024-01-17', views: 14567, leads: 423 },
    { date: '2024-01-18', views: 15234, leads: 456 },
    { date: '2024-01-19', views: 13987, leads: 401 },
    { date: '2024-01-20', views: 16789, leads: 498 }
  ],
  geographicDistribution: [
    { region: 'Windhoek', listings: 1234, avgPrice: 465000 },
    { region: 'Swakopmund', listings: 567, avgPrice: 520000 },
    { region: 'Walvis Bay', listings: 456, avgPrice: 385000 },
    { region: 'Oshakati', listings: 334, avgPrice: 295000 },
    { region: 'Rundu', listings: 289, avgPrice: 315000 }
  ],
  qualityMetrics: {
    averageQualityScore: 78.5,
    highQualityListings: 2187,
    imageQualityAverage: 82.3,
    contentCompletenessAverage: 74.7
  }
};

export default function VehicleAnalytics({ timeRange = '30d', onExport }: VehicleAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [analytics] = useState<AnalyticsData>(MOCK_ANALYTICS);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const formatCurrency = (amount: number) => `N$${amount.toLocaleString()}`;
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return ArrowUpRight;
    if (change < 0) return ArrowDownRight;
    return null;
  };

  // Calculate mock changes (in a real app, this would come from API)
  const mockChanges = {
    listings: 12.5,
    views: 8.3,
    leads: 15.7,
    conversion: -2.1,
    price: 3.2
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Analytics</h2>
          <p className="text-gray-600">Performance insights and market trends</p>
        </div>

        <div className="flex space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" onClick={() => onExport?.('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalListings)}</p>
                <div className={`flex items-center text-sm ${getChangeColor(mockChanges.listings)}`}>
                  {getChangeIcon(mockChanges.listings) &&
                    React.createElement(getChangeIcon(mockChanges.listings)!, { className: 'w-4 h-4 mr-1' })
                  }
                  +{formatPercentage(mockChanges.listings)} from last period
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalViews)}</p>
                <div className={`flex items-center text-sm ${getChangeColor(mockChanges.views)}`}>
                  {getChangeIcon(mockChanges.views) &&
                    React.createElement(getChangeIcon(mockChanges.views)!, { className: 'w-4 h-4 mr-1' })
                  }
                  +{formatPercentage(mockChanges.views)} from last period
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.totalLeads)}</p>
                <div className={`flex items-center text-sm ${getChangeColor(mockChanges.leads)}`}>
                  {getChangeIcon(mockChanges.leads) &&
                    React.createElement(getChangeIcon(mockChanges.leads)!, { className: 'w-4 h-4 mr-1' })
                  }
                  +{formatPercentage(mockChanges.leads)} from last period
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analytics.conversionRate)}</p>
                <div className={`flex items-center text-sm ${getChangeColor(mockChanges.conversion)}`}>
                  {getChangeIcon(mockChanges.conversion) &&
                    React.createElement(getChangeIcon(mockChanges.conversion)!, { className: 'w-4 h-4 mr-1' })
                  }
                  {formatPercentage(Math.abs(mockChanges.conversion))} from last period
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Performance Trends</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={selectedMetric === 'views' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('views')}
              >
                Views
              </Button>
              <Button
                variant={selectedMetric === 'leads' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('leads')}
              >
                Leads
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Interactive chart would be displayed here</p>
              <p className="text-sm text-gray-400">Showing {selectedMetric} over time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Price</span>
              <span className="text-lg font-bold">{formatCurrency(analytics.averagePrice)}</span>
            </div>

            <div className="space-y-3">
              {analytics.priceDistribution.map((range, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{range.range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(range.count / analytics.totalListings) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{range.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Market Dynamics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Avg. Time on Market</span>
              <span className="text-lg font-bold">{analytics.averageTimeOnMarket} days</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Listings</span>
              <span className="text-lg font-bold">{formatNumber(analytics.activeListings)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Listing Success Rate</span>
              <span className="text-lg font-bold">73.2%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Avg. Views per Listing</span>
              <span className="text-lg font-bold">{Math.round(analytics.totalViews / analytics.totalListings)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Avg. Quality Score</span>
              <span className="text-lg font-bold">{analytics.qualityMetrics.averageQualityScore}/100</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">High Quality Listings</span>
              <span className="text-lg font-bold">{formatNumber(analytics.qualityMetrics.highQualityListings)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Image Quality</span>
              <span className="text-lg font-bold">{analytics.qualityMetrics.imageQualityAverage}/100</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Content Completeness</span>
              <span className="text-lg font-bold">{analytics.qualityMetrics.contentCompletenessAverage}/100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Top Performing Makes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformingMakes.map((make, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{make.make}</div>
                      <div className="text-sm text-gray-500">{make.count} listings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(make.avgPrice)}</div>
                    <div className="text-sm text-gray-500">avg. price</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Top Performing Dealers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformingDealers.map((dealer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <span className="text-sm font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{dealer.name}</div>
                      <div className="text-sm text-gray-500">{dealer.listings} listings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(dealer.revenue)}</div>
                    <div className="text-sm text-gray-500">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.geographicDistribution.map((region, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{region.region}</h4>
                      <p className="text-sm text-gray-500">{region.listings} listings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(region.avgPrice)}</p>
                      <p className="text-xs text-gray-500">avg. price</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(region.listings / analytics.totalListings) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => onExport?.('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline" onClick={() => onExport?.('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV Data
            </Button>
            <Button variant="outline" onClick={() => onExport?.('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}