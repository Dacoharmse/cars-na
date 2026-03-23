'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  Mail,
  Target,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface AnalyticsProps {
  dealershipId: string;
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

/* ── Brand-aligned palette ─────────────────────────── */
const BRAND = {
  navy: '#1F3469',
  red: '#CB2030',
  navyLight: '#2A4A8F',
  navySoft: '#E8EDF5',
  redSoft: '#FDEDEF',
  green: '#059669',
  greenSoft: '#ECFDF5',
  amber: '#D97706',
  amberSoft: '#FFFBEB',
  purple: '#7C3AED',
  purpleSoft: '#F3E8FF',
  slate: '#64748B',
};

const CHART_COLORS = {
  views: '#1F3469',
  leads: '#059669',
  sales: '#CB2030',
  revenue: '#059669',
  inquiries: '#7C3AED',
};

const PIE_COLORS = ['#1F3469', '#CB2030', '#059669', '#D97706', '#7C3AED', '#0891B2'];

/* ── Skeleton loader ───────────────────────────────── */
function MetricSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-9 w-9 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-7 w-24 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-100 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="h-4 w-36 bg-slate-200 rounded mb-6" />
          <div className="rounded-lg bg-slate-50" style={{ height }} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Custom tooltip ────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  let formattedLabel = label;
  try { formattedLabel = format(new Date(label), 'MMM dd, yyyy'); } catch {}

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-100 px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1.5">{formattedLabel}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-medium text-slate-800 tabular-nums">
            {entry.name === 'Revenue' ? `NAD ${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  let formattedLabel = label;
  try { formattedLabel = format(new Date(label), 'MMM dd, yyyy'); } catch {}

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-100 px-4 py-3 text-sm">
      <p className="font-semibold text-slate-700 mb-1">{formattedLabel}</p>
      <p className="text-slate-800 font-medium tabular-nums">
        NAD {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function DealershipAnalyticsDashboard({ dealershipId }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
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

  const timeRangeOptions = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: '12m', label: '12 months' },
  ];

  /* ── Loading state ─────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="animate-pulse">
            <div className="h-7 w-48 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <MetricSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  /* ── Error state ───────────────────────────────── */
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Activity className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Unable to load analytics</h3>
        <p className="text-sm text-red-500 mb-5">{error}</p>
        <Button variant="outline" onClick={fetchAnalytics} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const { metrics, timeSeries, vehiclePerformance, trafficSources, funnel } = data;

  /* ── Metric card configs ───────────────────────── */
  const metricCards = [
    {
      title: 'Total Views',
      value: metrics.totalViews.toLocaleString(),
      change: 0,
      changeType: 'neutral' as const,
      icon: Eye,
      iconBg: BRAND.navySoft,
      iconColor: BRAND.navy,
    },
    {
      title: 'Leads Generated',
      value: metrics.totalLeads.toLocaleString(),
      change: metrics.leadsChange.change,
      changeType: metrics.leadsChange.changeType,
      icon: Users,
      iconBg: BRAND.greenSoft,
      iconColor: BRAND.green,
    },
    {
      title: 'Total Inquiries',
      value: metrics.totalInquiries.toLocaleString(),
      change: metrics.inquiriesChange.change,
      changeType: metrics.inquiriesChange.changeType,
      icon: Mail,
      iconBg: BRAND.purpleSoft,
      iconColor: BRAND.purple,
    },
    {
      title: 'Vehicles Sold',
      value: metrics.soldVehicles.toLocaleString(),
      change: metrics.salesChange.change,
      changeType: metrics.salesChange.changeType,
      icon: Car,
      iconBg: BRAND.redSoft,
      iconColor: BRAND.red,
    },
    {
      title: 'Active Listings',
      value: metrics.activeListings.toLocaleString(),
      change: 0,
      changeType: 'neutral' as const,
      icon: Car,
      iconBg: BRAND.amberSoft,
      iconColor: BRAND.amber,
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      change: 0,
      changeType: 'neutral' as const,
      icon: Target,
      iconBg: BRAND.greenSoft,
      iconColor: BRAND.green,
    },
  ];

  const ChangeIndicator = ({ change, type }: { change: number; type: string }) => {
    if (!change) return null;
    const isUp = type === 'increase';
    return (
      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        {Math.abs(change)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track your dealership performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeRange(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === opt.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-slate-150 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{metric.title}</p>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: metric.iconBg }}
                  >
                    <Icon className="w-[18px] h-[18px]" style={{ color: metric.iconColor }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{metric.value}</p>
                {metric.change > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <ChangeIndicator change={metric.change} type={metric.changeType} />
                    <span className="text-xs text-slate-400">vs last period</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Charts Row ─────────────────────────────── */}
      {timeSeries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={timeSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.views} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={CHART_COLORS.views} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={(value) => {
                      try { return format(new Date(value), 'MMM dd'); } catch { return value; }
                    }}
                  />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    fill="url(#viewsGrad)"
                    stroke={CHART_COLORS.views}
                    strokeWidth={2}
                    name="Views"
                  />
                  <Bar yAxisId="right" dataKey="leads" fill={CHART_COLORS.leads} name="Leads" radius={[3, 3, 0, 0]} barSize={16} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke={CHART_COLORS.sales}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: CHART_COLORS.sales, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    name="Sales"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Trends */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timeSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.revenue} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={(value) => {
                      try { return format(new Date(value), 'MMM dd'); } catch { return value; }
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={(value) => `NAD ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS.revenue}
                    strokeWidth={2.5}
                    fill="url(#revenueGrad)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: CHART_COLORS.revenue }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Vehicle Performance & Lead Sources ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vehiclePerformance.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800">Top Performing Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Vehicle</th>
                      <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Views</th>
                      <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Leads</th>
                      <th className="text-right py-2.5 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclePerformance.map((vehicle, index) => (
                      <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-2">
                          <p className="font-medium text-slate-800">{vehicle.make} {vehicle.model}</p>
                        </td>
                        <td className="text-right py-3 px-2 tabular-nums text-slate-600">{vehicle.views.toLocaleString()}</td>
                        <td className="text-right py-3 px-2 tabular-nums text-slate-600">{vehicle.leads}</td>
                        <td className="text-right py-3 px-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            vehicle.conversionRate >= 5
                              ? 'bg-emerald-50 text-emerald-700'
                              : vehicle.conversionRate >= 2
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {vehicle.conversionRate}%
                          </span>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-800">Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="visitors"
                    strokeWidth={0}
                  >
                    {trafficSources.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white rounded-lg shadow-lg border border-slate-100 px-3 py-2 text-sm">
                          <p className="font-medium text-slate-800">{d.source}</p>
                          <p className="text-slate-500">{d.visitors.toLocaleString()} leads ({d.percentage}%)</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <span className="text-slate-600">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 tabular-nums">{source.visitors.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 tabular-nums w-9 text-right">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Conversion Funnel ──────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Page Views',
                value: funnel.views,
                pct: '100',
                icon: Eye,
                color: BRAND.navy,
                bg: BRAND.navySoft,
              },
              {
                label: 'Inquiries',
                value: funnel.inquiries,
                pct: funnel.views > 0 ? ((funnel.inquiries / funnel.views) * 100).toFixed(1) : '0',
                icon: Mail,
                color: BRAND.purple,
                bg: BRAND.purpleSoft,
              },
              {
                label: 'Qualified Leads',
                value: funnel.leads,
                pct: funnel.inquiries > 0 ? ((funnel.leads / funnel.inquiries) * 100).toFixed(1) : '0',
                icon: Users,
                color: BRAND.green,
                bg: BRAND.greenSoft,
              },
              {
                label: 'Sales',
                value: funnel.sales,
                pct: funnel.leads > 0 ? ((funnel.sales / funnel.leads) * 100).toFixed(1) : '0',
                icon: Car,
                color: BRAND.red,
                bg: BRAND.redSoft,
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group">
                  <div className="rounded-xl border border-slate-100 p-4 text-center hover:shadow-sm transition-shadow">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: step.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <p className="text-xl font-bold text-slate-900 tabular-nums">{step.value.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{step.label}</p>
                    <div className="mt-2">
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: step.bg, color: step.color }}
                      >
                        {step.pct}%
                      </span>
                    </div>
                  </div>
                  {/* Connecting arrow (hidden on last item and on small screens) */}
                  {i < 3 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
