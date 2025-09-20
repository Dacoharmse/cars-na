'use client';

import { useState } from 'react';
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
import { format, subDays, subMonths } from 'date-fns';

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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

// Mock data - in real app, this would come from the API
const mockMetrics: MetricCard[] = [
  {
    title: 'Total Views',
    value: '24,567',
    change: 12.5,
    changeType: 'increase',
    icon: Eye,
    color: 'text-blue-600'
  },
  {
    title: 'Leads Generated',
    value: '156',
    change: 8.2,
    changeType: 'increase',
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'Total Inquiries',
    value: '89',
    change: -2.1,
    changeType: 'decrease',
    icon: Mail,
    color: 'text-purple-600'
  },
  {
    title: 'Phone Calls',
    value: '67',
    change: 15.3,
    changeType: 'increase',
    icon: Phone,
    color: 'text-orange-600'
  },
  {
    title: 'Active Listings',
    value: '45',
    change: 5.0,
    changeType: 'increase',
    icon: Car,
    color: 'text-indigo-600'
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: 0.8,
    changeType: 'increase',
    icon: Target,
    color: 'text-emerald-600'
  },
  {
    title: 'Avg. Response Time',
    value: '2.4h',
    change: -12.5,
    changeType: 'increase',
    icon: Clock,
    color: 'text-teal-600'
  },
  {
    title: 'Revenue',
    value: 'NAD 1.2M',
    change: 18.7,
    changeType: 'increase',
    icon: DollarSign,
    color: 'text-green-600'
  }
];

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2024-01-01', views: 1200, leads: 15, inquiries: 8, sales: 3, revenue: 45000 },
  { date: '2024-01-02', views: 1350, leads: 18, inquiries: 12, sales: 2, revenue: 38000 },
  { date: '2024-01-03', views: 1100, leads: 12, inquiries: 6, sales: 4, revenue: 52000 },
  { date: '2024-01-04', views: 1400, leads: 22, inquiries: 15, sales: 5, revenue: 68000 },
  { date: '2024-01-05', views: 1600, leads: 25, inquiries: 18, sales: 3, revenue: 42000 },
  { date: '2024-01-06', views: 1250, leads: 16, inquiries: 10, sales: 6, revenue: 75000 },
  { date: '2024-01-07', views: 1450, leads: 20, inquiries: 14, sales: 4, revenue: 58000 }
];

const mockVehiclePerformance: VehiclePerformance[] = [
  { make: 'Toyota', model: 'Camry', views: 2340, inquiries: 45, leads: 23, conversionRate: 4.2, avgTimeToSale: 12 },
  { make: 'BMW', model: '320i', views: 1890, inquiries: 38, leads: 19, conversionRate: 3.8, avgTimeToSale: 18 },
  { make: 'Mercedes', model: 'C-Class', views: 1650, inquiries: 32, leads: 16, conversionRate: 3.5, avgTimeToSale: 21 },
  { make: 'Honda', model: 'Civic', views: 1420, inquiries: 28, leads: 14, conversionRate: 4.1, avgTimeToSale: 9 },
  { make: 'Ford', model: 'Ranger', views: 1280, inquiries: 25, leads: 12, conversionRate: 3.9, avgTimeToSale: 15 }
];

const mockTrafficSources: TrafficSource[] = [
  { source: 'Direct', visitors: 12540, percentage: 35, color: '#8884d8' },
  { source: 'Google Search', visitors: 8960, percentage: 25, color: '#82ca9d' },
  { source: 'Facebook', visitors: 6230, percentage: 17, color: '#ffc658' },
  { source: 'Instagram', visitors: 4510, percentage: 13, color: '#ff7c7c' },
  { source: 'Other', visitors: 3580, percentage: 10, color: '#8dd1e1' }
];

export default function DealershipAnalyticsDashboard({ dealershipId }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [compareMode, setCompareMode] = useState(false);

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return `NAD ${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'time':
        return `${value}h`;
      default:
        return value.toLocaleString();
    }
  };

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
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockMetrics.map((metric, index) => {
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
                <div className="flex items-center mt-4">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-sm font-medium ml-1 ${getChangeColor(metric.changeType)}`}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-sm text-gray-600 ml-2">vs last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mockTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value, name) => [value.toLocaleString(), name]}
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
              <AreaChart data={mockTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis tickFormatter={(value) => `NAD ${(value/1000).toFixed(0)}k`} />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value) => [`NAD ${value.toLocaleString()}`, 'Revenue']}
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

      {/* Vehicle Performance & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <th className="text-right py-3">Inquiries</th>
                    <th className="text-right py-3">Leads</th>
                    <th className="text-right py-3">Conv. Rate</th>
                    <th className="text-right py-3">Avg. Sale Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVehiclePerformance.map((vehicle, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                        </div>
                      </td>
                      <td className="text-right py-3">{vehicle.views.toLocaleString()}</td>
                      <td className="text-right py-3">{vehicle.inquiries}</td>
                      <td className="text-right py-3">{vehicle.leads}</td>
                      <td className="text-right py-3">
                        <Badge className={vehicle.conversionRate >= 4 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {vehicle.conversionRate}%
                        </Badge>
                      </td>
                      <td className="text-right py-3">{vehicle.avgTimeToSale} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockTrafficSources}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visitors"
                  label={({ source, percentage }) => `${source} (${percentage}%)`}
                >
                  {mockTrafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Visitors']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {mockTrafficSources.map((source, index) => (
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
              <h3 className="font-semibold text-lg">24,567</h3>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-xs text-green-600 mt-1">100%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">1,234</h3>
              <p className="text-sm text-gray-600">Inquiries</p>
              <p className="text-xs text-green-600 mt-1">5.0%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">156</h3>
              <p className="text-sm text-gray-600">Qualified Leads</p>
              <p className="text-xs text-green-600 mt-1">12.6%</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">42</h3>
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-xs text-green-600 mt-1">26.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">🎯 Strengths</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Your Toyota Camry listings have a 42% higher conversion rate than industry average</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Response time of 2.4 hours is excellent and leads to higher customer satisfaction</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Direct traffic accounts for 35% of visits, indicating strong brand recognition</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600">💡 Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Consider adding more BMW and Mercedes inventory - high inquiry rates but low stock</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Optimize for mobile - 68% of traffic is mobile but conversion rate is lower</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Increase social media presence - Instagram traffic is growing 23% month-over-month</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}