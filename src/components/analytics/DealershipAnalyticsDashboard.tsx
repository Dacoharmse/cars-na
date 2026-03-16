'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Car,
  Phone,
  Mail,
  DollarSign,
  Target,
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsProps {
  dealershipId: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface TimeSeriesData {
  date: string;
  views: number;
  leads: number;
  inquiries: number;
  sales: number;
  revenue: number;
}

interface VehiclePerformance {
  make: string;
  model: string;
  views: number;
  inquiries: number;
  leads: number;
  conversionRate: number;
  avgTimeToSale: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

interface AnalyticsData {
  metrics: {
    totalViews: number;
    totalLeads: number;
    leadsChange: { change: number; changeType: 'increase' | 'decrease' | 'neutral' };
    totalInquiries: number;
    inquiriesChange: { change: number; changeType: 'increase' | 'decrease' | 'neutral' };
    activeListings: number;
    soldVehicles: number;
    salesChange: { change: number; changeType: 'increase' | 'decrease' | 'neutral' };
    conversionRate: number;
  };
  timeSeries: TimeSeriesData[];
  vehiclePerformance: VehiclePerformance[];
  trafficSources: TrafficSource[];
  funnel: {
    views: number;
    inquiries: number;
    leads: number;
    sales: number;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export default function DealershipAnalyticsDashboard({ dealershipId }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dealer/analytics?period=${timeRange}`);
      if (!res.ok) throw new Error(`Failed to fetch analytics (${res.status})`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-3" />
        <span className="text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <Eye className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load analytics</h3>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchAnalytics}>
          Try Again
        </Button>
      </div>
    );
  }

  const { metrics, timeSeries, vehiclePerformance, trafficSources, funnel } = data;

  const metricCards: MetricCard[] = [
    {
      title: 'Total Views',
      value: metrics.totalViews.toLocaleString(),
      change: 0,
      changeType: 'neutral',
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      title: 'Leads Generated',
      value: metrics.totalLeads.toLocaleString(),
      change: metrics.leadsChange.change,
      changeType: metrics.leadsChange.changeType,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Inquiries',
      value: metrics.totalInquiries.toLocaleString(),
      change: metrics.inquiriesChange.change,
      changeType: metrics.inquiriesChange.changeType,
      icon: Mail,
      color: 'text-purple-600',
    },
    {
      title: 'Vehicles Sold',
      value: metrics.soldVehicles.toLocaleString(),
      change: metrics.salesChange.change,
      changeType: metrics.salesChange.changeType,
      icon: Car,
      color: 'text-orange-600',
    },
    {
      title: 'Active Listings',
      value: metrics.activeListings.toLocaleString(),
      change: 0,
      changeType: 'neutral',
      icon: Car,
      color: 'text-indigo-600',
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      change: 0,
      changeType: 'neutral',
      icon: Target,
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your dealership performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                {metric.change > 0 && (
                  <div className="flex items-center mt-4">
                    {getChangeIcon(metric.changeType)}
                    <span className={`text-sm font-medium ml-1 ${getChangeColor(metric.changeType)}`}>
                      {Math.abs(metric.change)}%
                    </span>
                    <span className="text-sm text-gray-600 ml-2">vs last period</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Trends */}
      {timeSeries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      try { return format(new Date(value), 'MMM dd'); } catch { return value; }
                    }}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) => {
                      try { return format(new Date(value), 'MMM dd, yyyy'); } catch { return String(value); }
                    }}
                    formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    stroke="#8884d8"
                    name="Views"
                  />
                  <Bar yAxisId="right" dataKey="leads" fill="#82ca9d" name="Leads" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke="#ff7300"
                    strokeWidth={3}
                    name="Sales"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      try { return format(new Date(value), 'MMM dd'); } catch { return value; }
                    }}
                  />
                  <YAxis tickFormatter={(value) => `NAD ${(value/1000).toFixed(0)}k`} />
                  <Tooltip
                    labelFormatter={(value) => {
                      try { return format(new Date(value), 'MMM dd, yyyy'); } catch { return String(value); }
                    }}
                    formatter={(value: number) => [`NAD ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vehicle Performance & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vehiclePerformance.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Vehicle</th>
                      <th className="text-right py-3">Views</th>
                      <th className="text-right py-3">Leads</th>
                      <th className="text-right py-3">Conv. Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclePerformance.map((vehicle, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                        </td>
                        <td className="text-right py-3">{vehicle.views.toLocaleString()}</td>
                        <td className="text-right py-3">{vehicle.leads}</td>
                        <td className="text-right py-3">
                          <Badge className={vehicle.conversionRate >= 4 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {vehicle.conversionRate}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {trafficSources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="visitors"
                    label={({ source, percentage }) => `${source} (${percentage}%)`}
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Leads']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: source.color }}
                      />
                      <span>{source.source}</span>
                    </div>
                    <span className="font-medium">{source.visitors.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">{funnel.views.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-xs text-green-600 mt-1">100%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">{funnel.inquiries.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Inquiries</p>
              <p className="text-xs text-green-600 mt-1">
                {funnel.views > 0 ? ((funnel.inquiries / funnel.views) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">{funnel.leads.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Qualified Leads</p>
              <p className="text-xs text-green-600 mt-1">
                {funnel.inquiries > 0 ? ((funnel.leads / funnel.inquiries) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">{funnel.sales.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-xs text-green-600 mt-1">
                {funnel.leads > 0 ? ((funnel.sales / funnel.leads) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
