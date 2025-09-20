'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Download,
  Filter,
} from 'lucide-react';
import {
  LineChart,
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

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number) => string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'stable',
  icon,
  color,
  formatter = (v) => v.toString(),
  subtitle,
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {change > 0 ? '+' : ''}{formatters.percentage(change, 1)}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface CohortHeatmapProps {
  data: Array<{
    cohort: string;
    cohortSize: number;
    retention: number[];
  }>;
}

const CohortHeatmap: React.FC<CohortHeatmapProps> = ({ data }) => {
  const getRetentionColor = (rate: number) => {
    if (rate >= 0.8) return 'bg-green-600';
    if (rate >= 0.6) return 'bg-green-400';
    if (rate >= 0.4) return 'bg-yellow-400';
    if (rate >= 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Retention Analysis</CardTitle>
        <CardDescription>User retention rates by registration month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-13 gap-1 text-xs">
              {/* Header */}
              <div className="font-medium text-gray-600 p-2">Cohort</div>
              <div className="font-medium text-gray-600 p-2">Size</div>
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} className="font-medium text-gray-600 p-2 text-center">
                  Month {i + 1}
                </div>
              ))}

              {/* Data rows */}
              {data.slice(0, 8).map((cohort) => (
                <>
                  <div key={`${cohort.cohort}-label`} className="font-medium text-gray-900 p-2">
                    {cohort.cohort}
                  </div>
                  <div key={`${cohort.cohort}-size`} className="text-gray-600 p-2">
                    {formatters.number(cohort.cohortSize)}
                  </div>
                  {cohort.retention.slice(0, 11).map((rate, index) => (
                    <div
                      key={`${cohort.cohort}-${index}`}
                      className={`p-2 text-center text-white text-xs rounded ${getRetentionColor(rate)}`}
                      title={`${formatters.percentage(rate)} retention`}
                    >
                      {formatters.percentage(rate, 0)}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span>80%+</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>60-80%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>40-60%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span>20-40%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>&lt;20%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UserAnalytics: React.FC = () => {
  const [period, setPeriod] = useState('30d');
  const [region, setRegion] = useState<string>('all');

  // Data fetching
  const { data: userMetrics, isLoading } = api.analytics.getUserAnalytics.useQuery({
    period,
    region: region !== 'all' ? region : undefined,
  });

  const handleExport = async () => {
    // In a real implementation, this would trigger the export mutation
    try {
      console.log('Exporting user analytics...');
      // await exportAnalytics.mutateAsync({ format: 'CSV', reportType: 'USERS', period, region });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading || !userMetrics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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

  const { overview, timeSeries, demographics, cohortAnalysis } = userMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-600">User growth, behavior, and retention insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={region}
            onValueChange={setRegion}
            className="w-40"
          >
            <option value="all">All Regions</option>
            <option value="Khomas">Khomas</option>
            <option value="Erongo">Erongo</option>
            <option value="Oshana">Oshana</option>
            <option value="Hardap">Hardap</option>
          </Select>
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
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={overview.totalUsers}
          change={overview.userGrowthRate}
          trend={overview.userGrowthRate > 0 ? 'up' : overview.userGrowthRate < 0 ? 'down' : 'stable'}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
          formatter={formatters.number}
          subtitle="Registered users"
        />
        <MetricCard
          title="Active Users"
          value={overview.totalActiveUsers}
          change={0.08} // Mock change
          trend="up"
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
          formatter={formatters.number}
          subtitle={`${formatters.percentage(overview.totalActiveUsers / overview.totalUsers)} of total`}
        />
        <MetricCard
          title="New Users"
          value={overview.newUsersThisPeriod}
          change={overview.userGrowthRate}
          trend={overview.userGrowthRate > 0 ? 'up' : 'stable'}
          icon={<UserPlus className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
          formatter={formatters.number}
          subtitle="This period"
        />
        <MetricCard
          title="Retention Rate"
          value={formatters.percentage(overview.averageRetentionRate)}
          change={0.03} // Mock change
          trend="up"
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
          subtitle={`Churn: ${formatters.percentage(overview.churnRate)}`}
        />
      </div>

      {/* Charts and Analysis */}
      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          {/* User Growth Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
              <CardDescription>New user registrations and cumulative growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => dateUtils.formatDateShort(value)}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      labelFormatter={(value) => dateUtils.formatDate(value)}
                      formatter={(value: number, name: string) => [
                        formatters.number(value),
                        name === 'newUsers' ? 'New Users' :
                        name === 'activeUsers' ? 'Active Users' :
                        name === 'registrations' ? 'Registrations' : name
                      ]}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="newUsers"
                      fill={chartColors.primary[0]}
                      name="New Users"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="activeUsers"
                      stroke={chartColors.secondary[0]}
                      strokeWidth={2}
                      name="Active Users"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="registrations"
                      stroke={chartColors.tertiary[0]}
                      strokeWidth={2}
                      name="Registrations"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Activity Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Daily User Activity</CardTitle>
              <CardDescription>User engagement and retention patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => dateUtils.formatDateShort(value)}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => dateUtils.formatDate(value)}
                      formatter={(value: number, name: string) => [
                        name === 'retention' ? formatters.percentage(value) : formatters.number(value),
                        name === 'retention' ? 'Retention Rate' : 'Active Users'
                      ]}
                    />
                    <Legend />
                    <defs>
                      <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary[0]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartColors.primary[0]} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stroke={chartColors.primary[0]}
                      fillOpacity={1}
                      fill="url(#activeUsersGradient)"
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>User demographics by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={demographics.ageGroups}
                        dataKey="percentage"
                        nameKey="group"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ group, percentage }) => `${group}: ${percentage}%`}
                      >
                        {demographics.ageGroups.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors.rainbow[index % chartColors.rainbow.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Users by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demographics.regions} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="region" type="category" width={80} />
                      <Tooltip
                        formatter={(value: number) => [formatters.number(value), 'Users']}
                      />
                      <Bar
                        dataKey="count"
                        fill={chartColors.primary[0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Detailed breakdown by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Region</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Users</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Percentage</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demographics.regions.map((region, index) => (
                      <tr key={region.region} className="border-b">
                        <td className="py-3 px-4 font-medium">{region.region}</td>
                        <td className="py-3 px-4 text-right">{formatters.number(region.count)}</td>
                        <td className="py-3 px-4 text-right">
                          {formatters.percentage(region.count / overview.totalUsers)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge className="bg-green-100 text-green-800">
                            +{Math.floor(Math.random() * 15 + 5)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohort" className="space-y-6">
          <CohortHeatmap data={cohortAnalysis} />

          {/* Cohort Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Best Cohort</h3>
                    <p className="text-2xl font-bold text-gray-900">2024-01</p>
                    <p className="text-sm text-gray-600">
                      {formatters.percentage(0.82)} 6-month retention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Average Retention</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatters.percentage(overview.averageRetentionRate)}
                    </p>
                    <p className="text-sm text-gray-600">30-day retention rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UserX className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Churn Rate</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatters.percentage(overview.churnRate)}
                    </p>
                    <p className="text-sm text-gray-600">Monthly churn rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* User Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Type Distribution</CardTitle>
                <CardDescription>Active vs. inactive users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Active Users', value: overview.totalActiveUsers },
                          { name: 'Inactive Users', value: overview.totalUsers - overview.totalActiveUsers },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${formatters.number(value)}`}
                      >
                        <Cell fill={chartColors.secondary[0]} />
                        <Cell fill={chartColors.neutral} />
                      </Pie>
                      <Tooltip formatter={(value: number) => formatters.number(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Trends</CardTitle>
                <CardDescription>Daily registration patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => dateUtils.formatDateShort(value)}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => dateUtils.formatDate(value)}
                        formatter={(value: number) => [formatters.number(value), 'Registrations']}
                      />
                      <Line
                        type="monotone"
                        dataKey="registrations"
                        stroke={chartColors.primary[0]}
                        strokeWidth={2}
                        dot={{ fill: chartColors.primary[0] }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Summary</CardTitle>
              <CardDescription>Key engagement metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatters.percentage(overview.totalActiveUsers / overview.totalUsers)}
                  </div>
                  <div className="text-sm text-gray-600">User Activation Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatters.number(overview.newUsersThisPeriod / dateUtils.getDaysInRange(...dateUtils.getDateRange(period)), 1)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Daily Signups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatters.percentage(overview.averageRetentionRate)}
                  </div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatters.percentage(overview.userGrowthRate)}
                  </div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalytics;