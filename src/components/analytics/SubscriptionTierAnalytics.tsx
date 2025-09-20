'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Crown,
  Star,
  Zap,
  Lock,
  Unlock,
  TrendingUp,
  Eye,
  Users,
  Phone,
  Mail,
  Target,
  ArrowUp
} from 'lucide-react';

interface SubscriptionTier {
  name: string;
  level: 'starter' | 'professional' | 'enterprise';
  icon: React.ElementType;
  color: string;
  features: string[];
  analyticsFeatures: AnalyticsFeature[];
}

interface AnalyticsFeature {
  name: string;
  description: string;
  available: boolean;
  premium?: boolean;
  comingSoon?: boolean;
}

interface TierUsageData {
  tier: string;
  users: number;
  avgPerformance: number;
  revenue: number;
  color: string;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Starter',
    level: 'starter',
    icon: Zap,
    color: '#3B82F6',
    features: ['Up to 25 listings', 'Basic analytics', 'Email support'],
    analyticsFeatures: [
      { name: 'Basic Metrics', description: 'Views, inquiries, basic stats', available: true },
      { name: 'Monthly Reports', description: 'Simple performance summaries', available: true },
      { name: 'Traffic Sources', description: 'Basic source tracking', available: true },
      { name: 'Performance Insights', description: 'AI-powered recommendations', available: false },
      { name: 'Competitor Analysis', description: 'Market position insights', available: false },
      { name: 'Advanced Segmentation', description: 'Customer behavior analysis', available: false },
      { name: 'Real-time Alerts', description: 'Instant performance notifications', available: false },
      { name: 'Export & API', description: 'Data export and API access', available: false }
    ]
  },
  {
    name: 'Professional',
    level: 'professional',
    icon: Star,
    color: '#8B5CF6',
    features: ['Up to 100 listings', 'Advanced analytics', 'Priority support'],
    analyticsFeatures: [
      { name: 'Basic Metrics', description: 'Views, inquiries, basic stats', available: true },
      { name: 'Monthly Reports', description: 'Simple performance summaries', available: true },
      { name: 'Traffic Sources', description: 'Basic source tracking', available: true },
      { name: 'Performance Insights', description: 'AI-powered recommendations', available: true },
      { name: 'Competitor Analysis', description: 'Market position insights', available: true },
      { name: 'Advanced Segmentation', description: 'Customer behavior analysis', available: true },
      { name: 'Real-time Alerts', description: 'Instant performance notifications', available: false },
      { name: 'Export & API', description: 'Data export and API access', available: false }
    ]
  },
  {
    name: 'Enterprise',
    level: 'enterprise',
    icon: Crown,
    color: '#F59E0B',
    features: ['Unlimited listings', 'Full analytics suite', 'Dedicated support'],
    analyticsFeatures: [
      { name: 'Basic Metrics', description: 'Views, inquiries, basic stats', available: true },
      { name: 'Monthly Reports', description: 'Simple performance summaries', available: true },
      { name: 'Traffic Sources', description: 'Basic source tracking', available: true },
      { name: 'Performance Insights', description: 'AI-powered recommendations', available: true },
      { name: 'Competitor Analysis', description: 'Market position insights', available: true },
      { name: 'Advanced Segmentation', description: 'Customer behavior analysis', available: true },
      { name: 'Real-time Alerts', description: 'Instant performance notifications', available: true },
      { name: 'Export & API', description: 'Data export and API access', available: true }
    ]
  }
];

const tierUsageData: TierUsageData[] = [
  { tier: 'Starter', users: 127, avgPerformance: 65, revenue: 114273, color: '#3B82F6' },
  { tier: 'Professional', users: 89, avgPerformance: 78, revenue: 222411, color: '#8B5CF6' },
  { tier: 'Enterprise', users: 23, avgPerformance: 85, revenue: 114977, color: '#F59E0B' }
];

const featureUsageData = [
  { feature: 'Basic Dashboard', starter: 95, professional: 98, enterprise: 100 },
  { feature: 'Traffic Analytics', starter: 78, professional: 92, enterprise: 98 },
  { feature: 'Lead Tracking', starter: 65, professional: 85, enterprise: 95 },
  { feature: 'Performance Reports', starter: 45, professional: 88, enterprise: 97 },
  { feature: 'Competitor Analysis', starter: 0, professional: 67, enterprise: 89 },
  { feature: 'API Access', starter: 0, professional: 0, enterprise: 52 },
];

interface Props {
  currentTier: 'starter' | 'professional' | 'enterprise';
  dealershipId: string;
}

export default function SubscriptionTierAnalytics({ currentTier, dealershipId }: Props) {
  const [selectedTier, setSelectedTier] = useState<number>(
    subscriptionTiers.findIndex(tier => tier.level === currentTier)
  );

  const currentTierData = subscriptionTiers[selectedTier];
  const Icon = currentTierData.icon;

  const getFeatureStatus = (feature: AnalyticsFeature) => {
    if (feature.comingSoon) {
      return <Badge className="bg-gray-100 text-gray-600 text-xs">Coming Soon</Badge>;
    }
    if (feature.available) {
      return <Unlock className="w-4 h-4 text-green-500" />;
    }
    return <Lock className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Features</h2>
          <p className="text-gray-600">Unlock advanced insights with higher subscription tiers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-blue-100 text-blue-800">
            <Icon className="w-3 h-3 mr-1" />
            Current: {currentTierData.name}
          </Badge>
          {selectedTier < subscriptionTiers.length - 1 && (
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
              <ArrowUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* Tier Comparison Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier, index) => {
          const TierIcon = tier.icon;
          const isCurrentTier = tier.level === currentTier;
          const isSelected = selectedTier === index;

          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${isCurrentTier ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedTier(index)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${tier.color}20` }}
                  >
                    <TierIcon className="w-6 h-6" style={{ color: tier.color }} />
                  </div>
                </div>
                <CardTitle className="flex items-center justify-center">
                  {tier.name}
                  {isCurrentTier && (
                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Current</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold" style={{ color: tier.color }}>
                    {tier.analyticsFeatures.filter(f => f.available).length}
                    <span className="text-sm font-normal text-gray-500">
                      /{tier.analyticsFeatures.length} features
                    </span>
                  </p>
                  <Progress
                    value={(tier.analyticsFeatures.filter(f => f.available).length / tier.analyticsFeatures.length) * 100}
                    className="mt-2"
                  />
                </div>

                <ul className="space-y-1 text-sm">
                  {tier.features.slice(0, 3).map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon className="w-5 h-5 mr-2" style={{ color: currentTierData.color }} />
            {currentTierData.name} Plan - Analytics Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTierData.analyticsFeatures.map((feature, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                feature.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${feature.available ? 'text-green-900' : 'text-gray-600'}`}>
                    {feature.name}
                  </h4>
                  {getFeatureStatus(feature)}
                </div>
                <p className={`text-sm ${feature.available ? 'text-green-700' : 'text-gray-500'}`}>
                  {feature.description}
                </p>
                {!feature.available && (
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Upgrade to Access
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Usage Across Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Usage %', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                <Bar dataKey="starter" fill="#3B82F6" name="Starter" />
                <Bar dataKey="professional" fill="#8B5CF6" name="Professional" />
                <Bar dataKey="enterprise" fill="#F59E0B" name="Enterprise" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierUsageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                  label={({ tier, users }) => `${tier}: ${users}`}
                >
                  {tierUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {tierUsageData.map((tier, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium">{tier.tier}</span>
                  </div>
                  <div className="text-right">
                    <div>{tier.users} users</div>
                    <div className="text-xs text-gray-500">
                      NAD {(tier.revenue / 1000).toFixed(0)}k revenue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Average Performance by Subscription Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tierUsageData.map((tier, index) => (
              <div key={index} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${tier.color}10` }}>
                <div className="text-3xl font-bold mb-2" style={{ color: tier.color }}>
                  {tier.avgPerformance}
                </div>
                <div className="text-sm text-gray-600 mb-2">Average Performance Score</div>
                <div className="text-lg font-semibold">{tier.tier} Plan</div>
                <div className="text-sm text-gray-500">{tier.users} active dealerships</div>
                <div className="mt-3">
                  <Progress value={tier.avgPerformance} className="h-2" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Performance Insights</h4>
                <p className="text-sm text-blue-700">
                  Dealerships with higher-tier subscriptions consistently show better performance metrics.
                  Enterprise users achieve 31% higher conversion rates and 45% more qualified leads compared to Starter plan users.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Recommendation */}
      {currentTier !== 'enterprise' && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Ready to unlock more insights?</h3>
                  <p className="text-gray-600">
                    Upgrade to get advanced analytics, competitor insights, and AI-powered recommendations.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
                <span className="text-xs text-gray-500">30-day free trial</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}