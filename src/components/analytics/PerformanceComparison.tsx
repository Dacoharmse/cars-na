'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Award,
  Target,
  Users,
  Eye,
  Phone,
  Mail,
  DollarSign,
  Trophy,
  Star
} from 'lucide-react';

interface ComparisonData {
  metric: string;
  dealership: number;
  industryAverage: number;
  topPerformer: number;
  percentile: number;
  unit: string;
}

interface BenchmarkCategory {
  category: string;
  icon: React.ElementType;
  metrics: ComparisonData[];
  overallScore: number;
  ranking: string;
  color: string;
}

// Mock comparison data
const mockComparisonData: BenchmarkCategory[] = [
  {
    category: 'Traffic & Visibility',
    icon: Eye,
    color: 'blue',
    overallScore: 78,
    ranking: '85th percentile',
    metrics: [
      {
        metric: 'Monthly Views',
        dealership: 24567,
        industryAverage: 18500,
        topPerformer: 45000,
        percentile: 85,
        unit: 'views'
      },
      {
        metric: 'Avg. Session Duration',
        dealership: 3.2,
        industryAverage: 2.8,
        topPerformer: 4.1,
        percentile: 72,
        unit: 'minutes'
      },
      {
        metric: 'Bounce Rate',
        dealership: 42,
        industryAverage: 48,
        topPerformer: 32,
        percentile: 88,
        unit: '%'
      },
      {
        metric: 'Page Views per Session',
        dealership: 4.8,
        industryAverage: 4.2,
        topPerformer: 6.1,
        percentile: 75,
        unit: 'pages'
      }
    ]
  },
  {
    category: 'Lead Generation',
    icon: Users,
    color: 'green',
    overallScore: 82,
    ranking: '90th percentile',
    metrics: [
      {
        metric: 'Monthly Leads',
        dealership: 156,
        industryAverage: 125,
        topPerformer: 220,
        percentile: 90,
        unit: 'leads'
      },
      {
        metric: 'Conversion Rate',
        dealership: 3.2,
        industryAverage: 2.8,
        topPerformer: 4.5,
        percentile: 88,
        unit: '%'
      },
      {
        metric: 'Lead Quality Score',
        dealership: 7.8,
        industryAverage: 6.5,
        topPerformer: 8.9,
        percentile: 85,
        unit: '/10'
      },
      {
        metric: 'Cost per Lead',
        dealership: 145,
        industryAverage: 180,
        topPerformer: 95,
        percentile: 92,
        unit: 'NAD'
      }
    ]
  },
  {
    category: 'Customer Engagement',
    icon: Phone,
    color: 'purple',
    overallScore: 71,
    ranking: '75th percentile',
    metrics: [
      {
        metric: 'Response Time',
        dealership: 2.4,
        industryAverage: 4.2,
        topPerformer: 1.1,
        percentile: 95,
        unit: 'hours'
      },
      {
        metric: 'Phone Inquiries',
        dealership: 67,
        industryAverage: 58,
        topPerformer: 89,
        percentile: 78,
        unit: 'calls/month'
      },
      {
        metric: 'Email Response Rate',
        dealership: 85,
        industryAverage: 72,
        topPerformer: 94,
        percentile: 85,
        unit: '%'
      },
      {
        metric: 'Follow-up Rate',
        dealership: 68,
        industryAverage: 65,
        topPerformer: 88,
        percentile: 62,
        unit: '%'
      }
    ]
  },
  {
    category: 'Sales Performance',
    icon: DollarSign,
    color: 'orange',
    overallScore: 85,
    ranking: '92nd percentile',
    metrics: [
      {
        metric: 'Monthly Revenue',
        dealership: 1200000,
        industryAverage: 950000,
        topPerformer: 1800000,
        percentile: 92,
        unit: 'NAD'
      },
      {
        metric: 'Average Sale Price',
        dealership: 285000,
        industryAverage: 245000,
        topPerformer: 380000,
        percentile: 88,
        unit: 'NAD'
      },
      {
        metric: 'Sales Cycle (Days)',
        dealership: 14,
        industryAverage: 18,
        topPerformer: 9,
        percentile: 85,
        unit: 'days'
      },
      {
        metric: 'Close Rate',
        dealership: 24,
        industryAverage: 18,
        topPerformer: 32,
        percentile: 90,
        unit: '%'
      }
    ]
  }
];

const radarData = mockComparisonData.map(category => ({
  category: category.category,
  dealership: category.overallScore,
  industryAverage: 65,
  topPerformer: 95,
}));

export default function PerformanceComparison() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [timeframe, setTimeframe] = useState('30d');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'bg-green-500';
    if (percentile >= 75) return 'bg-blue-500';
    if (percentile >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'NAD':
        return `NAD ${(value / 1000).toFixed(0)}k`;
      case 'views':
      case 'leads':
        return value.toLocaleString();
      case '%':
        return `${value}%`;
      case 'hours':
      case 'minutes':
      case 'days':
        return `${value} ${unit}`;
      case '/10':
        return `${value}/10`;
      case 'calls/month':
        return `${value} calls`;
      case 'pages':
        return `${value} pages`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Performance Benchmarks</h2>
          <p className="text-gray-600">Compare your performance with industry standards</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
          <Badge className="bg-blue-100 text-blue-800">
            <Trophy className="w-3 h-3 mr-1" />
            Top 15% Overall
          </Badge>
        </div>
      </div>

      {/* Overall Performance Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Your Dealership"
                  dataKey="dealership"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Industry Average"
                  dataKey="industryAverage"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Top Performer"
                  dataKey="topPerformer"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Performance Summary</h3>
              {mockComparisonData.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                       onClick={() => setSelectedCategory(index)}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                        <Icon className={`w-4 h-4 text-${category.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-gray-600">{category.ranking}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getScoreColor(category.overallScore)}>
                        {category.overallScore}/100
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {mockComparisonData.map((category, index) => {
          const Icon = category.icon;
          return (
            <Button
              key={index}
              variant={selectedCategory === index ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(index)}
              className="flex-shrink-0"
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.category}
            </Button>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              {(() => {
                const Icon = mockComparisonData[selectedCategory].icon;
                return <Icon className="w-5 h-5 mr-2" />;
              })()}
              {mockComparisonData[selectedCategory].category} Detailed Analysis
            </CardTitle>
            <Badge className={`${getScoreColor(mockComparisonData[selectedCategory].overallScore)} px-3 py-1`}>
              Score: {mockComparisonData[selectedCategory].overallScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockComparisonData[selectedCategory].metrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{metric.metric}</h4>
                  <Badge className={`${getPercentileColor(metric.percentile)} text-white px-2 py-1`}>
                    {metric.percentile}th percentile
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Your Performance</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatValue(metric.dealership, metric.unit)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Industry Average</p>
                    <p className="text-xl font-bold text-gray-600">
                      {formatValue(metric.industryAverage, metric.unit)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Top Performer</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatValue(metric.topPerformer, metric.unit)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0</span>
                    <span>Industry Avg</span>
                    <span>Top 10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full relative"
                      style={{ width: `${Math.min((metric.dealership / metric.topPerformer) * 100, 100)}%` }}
                    >
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div
                      className="absolute top-0 h-2 w-1 bg-gray-400"
                      style={{ left: `${(metric.industryAverage / metric.topPerformer) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Performance Insight */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    {metric.dealership > metric.industryAverage ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Target className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm text-gray-700">
                      {metric.dealership > metric.industryAverage ? (
                        <>
                          <span className="font-medium text-green-600">Above average!</span> You're performing{' '}
                          {((metric.dealership / metric.industryAverage - 1) * 100).toFixed(1)}% better than industry average.
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-orange-600">Opportunity:</span> You could improve by{' '}
                          {((metric.industryAverage / metric.dealership - 1) * 100).toFixed(1)}% to reach industry average.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">🎯 Quick Wins</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Maintain your excellent response time - it's in the 95th percentile</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Your lead quality score is exceptional - leverage this in marketing</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Cost per lead is 20% below average - scale successful campaigns</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">🚀 Growth Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Improve follow-up rate by 20% to match top performers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Increase session duration with better content and vehicle details</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Focus on premium inventory to increase average sale price</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}