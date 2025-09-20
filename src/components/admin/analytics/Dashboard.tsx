'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Car,
  DollarSign,
  Eye,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { formatters, chartColors, dateUtils, analytics } from '@/lib/analytics-utils';
import { api } from '@/lib/api';

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number) => string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend = 'stable',
  icon,
  color,
  formatter = (v) => v.toString(),
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    return formatter(val);
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className={`flex items-center justify-end text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-1">
                  {change > 0 ? '+' : ''}{formatters.percentage(change, 1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AlertCardProps {
  alerts: Array<{
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    metric?: string;
    value?: number;
    threshold?: number;
  }>;
}

const AlertCard: React.FC<AlertCardProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <AlertTriangle className="w-5 h-5 mr-2" />
          System Alerts
        </CardTitle>
        <CardDescription>Important metrics and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No active alerts
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  {alert.metric && alert.value !== undefined && alert.threshold !== undefined && (
                    <p className="text-xs text-gray-600 mt-1">
                      {alert.metric}: {formatters.number(alert.value, 2)} (threshold: {formatters.number(alert.threshold, 2)})
                    </p>
                  )}
                </div>
                <Badge className={getAlertBadgeColor(alert.type)}>
                  {alert.type}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RealtimeMetricsProps {
  metrics: {
    activeUsers: number;
    activeListings: number;
    currentRevenue: number;
    serverLoad: number;
    apiResponseTime: number;
    lastUpdated: Date;
  };
}

const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({ metrics }) => {
  const getServerLoadColor = (load: number) => {
    if (load > 0.8) return 'text-red-600';
    if (load > 0.6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getResponseTimeColor = (time: number) => {
    if (time > 500) return 'text-red-600';
    if (time > 200) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Activity className="w-5 h-5 mr-2" />
          Real-time Metrics
        </CardTitle>
        <CardDescription>Live platform performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-medium">{formatters.number(metrics.activeUsers)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Listings</span>
              <span className="font-medium">{formatters.number(metrics.activeListings)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Revenue</span>
              <span className="font-medium">{formatters.currency(metrics.currentRevenue)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Server Load</span>
              <span className={`font-medium ${getServerLoadColor(metrics.serverLoad)}`}>
                {formatters.percentage(metrics.serverLoad)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">API Response</span>
              <span className={`font-medium ${getResponseTimeColor(metrics.apiResponseTime)}`}>
                {metrics.apiResponseTime}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-500">
                {dateUtils.formatDateTime(metrics.lastUpdated)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickInsightsProps {
  data: {
    popularBrands: Array<{ brand: string; listings: number; avgViews: number }>;
    topRegions: Array<{ region: string; visitors: number; percentage: number }>;
    revenueStreams: Array<{ stream: string; amount: number; percentage: number }>;
  };
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Vehicle Brands</CardTitle>
          <CardDescription>Most popular brands by listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.popularBrands.slice(0, 5).map((brand, index) => (
              <div key={brand.brand} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: chartColors.rainbow[index] }} />
                  <span className="text-sm font-medium">{brand.brand}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatters.number(brand.listings)}</div>
                  <div className="text-xs text-gray-500">{formatters.number(brand.avgViews)} views</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Regions</CardTitle>
          <CardDescription>Highest traffic by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topRegions.slice(0, 5).map((region, index) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: chartColors.rainbow[index] }} />
                  <span className="text-sm font-medium">{region.region}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatters.number(region.visitors)}</div>
                  <div className="text-xs text-gray-500">{formatters.percentage(region.percentage / 100)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue Streams</CardTitle>
          <CardDescription>Income by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.revenueStreams.map((stream, index) => (
              <div key={stream.stream} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: chartColors.rainbow[index] }} />
                  <span className="text-sm font-medium">{stream.stream}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatters.currency(stream.amount)}</div>
                  <div className="text-xs text-gray-500">{stream.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data fetching
  const { data: dashboardData, isLoading, refetch } = api.analytics.getDashboardOverview.useQuery(
    { period },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const { data: realtimeData } = api.analytics.getRealTimeMetrics.useQuery(
    undefined,
    { refetchInterval: 10000 } // Refetch every 10 seconds
  );

  const { data: vehicleData } = api.analytics.getVehicleAnalytics.useQuery({ period });
  const { data: trafficData } = api.analytics.getTrafficAnalytics.useQuery({ period });
  const { data: revenueData } = api.analytics.getRevenueAnalytics.useQuery({ period });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleExport = async () => {
    // In a real implementation, this would trigger the export mutation
    console.log('Exporting dashboard data...');
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { kpis, trends, alerts, recentActivity } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive platform performance overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={period}
            onValueChange={setPeriod}
            className="w-32"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Users"
          value={kpis.totalUsers}
          change={trends.userGrowth}
          trend={trends.userGrowth > 0 ? 'up' : trends.userGrowth < 0 ? 'down' : 'stable'}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
          formatter={formatters.number}
        />
        <KPICard
          title="Active Dealers"
          value={kpis.totalDealers}
          change={0.05} // Mock change
          trend="up"
          icon={<Building2 className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
          formatter={formatters.number}
        />
        <KPICard
          title="Total Listings"
          value={kpis.totalListings}
          change={trends.listingGrowth}
          trend={trends.listingGrowth > 0 ? 'up' : trends.listingGrowth < 0 ? 'down' : 'stable'}
          icon={<Car className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
          formatter={formatters.number}
        />
        <KPICard
          title="Total Revenue"
          value={kpis.totalRevenue}
          change={trends.revenueGrowth}
          trend={trends.revenueGrowth > 0 ? 'up' : trends.revenueGrowth < 0 ? 'down' : 'stable'}
          icon={<DollarSign className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
          formatter={formatters.currency}
        />
        <KPICard
          title="Average Views"
          value={kpis.averageViews}
          change={0.08} // Mock change
          trend="up"
          icon={<Eye className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-100"
          formatter={formatters.number}
        />
        <KPICard
          title="Conversion Rate"
          value={formatters.percentage(kpis.conversionRate)}
          change={0.02} // Mock change
          trend="up"
          icon={<Target className="w-6 h-6 text-pink-600" />}
          color="bg-pink-100"
        />
      </div>

      {/* Real-time Metrics and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {realtimeData && <RealtimeMetrics metrics={realtimeData} />}
        <AlertCard alerts={alerts} />
      </div>

      {/* Quick Insights */}
      {vehicleData && trafficData && revenueData && (
        <QuickInsights
          data={{
            popularBrands: vehicleData.brandPerformance,
            topRegions: trafficData.geographicData,
            revenueStreams: revenueData.revenueStreams,
          }}
        />
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest platform events and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {dateUtils.formatDateTime(activity.timestamp)}
                  </p>
                </div>
                <Badge className="text-xs">
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation to detailed analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">User Analytics</h3>
                <p className="text-sm text-gray-600">Growth and behavior metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Dealer Analytics</h3>
                <p className="text-sm text-gray-600">Performance and satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LineChart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Vehicle Analytics</h3>
                <p className="text-sm text-gray-600">Listing trends and performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Traffic Analytics</h3>
                <p className="text-sm text-gray-600">Visitor insights and conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;