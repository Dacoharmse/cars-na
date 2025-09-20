'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Crown,
  Zap,
  Check,
  X,
  Users,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  maxListings: number;
  maxPhotos: number;
  priority: number;
  isActive: boolean;
  subscriberCount: number;
}

// Mock data for demonstration
const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Starter',
    slug: 'starter',
    description: 'Perfect for small dealerships and independent sellers',
    price: 899,
    currency: 'NAD',
    duration: 1,
    features: [
      'Up to 25 vehicle listings',
      'Basic vehicle detail pages',
      'Standard search visibility',
      'Customer inquiry management',
      'Basic analytics dashboard',
      '5 high-quality photos per vehicle',
      'Email support'
    ],
    maxListings: 25,
    maxPhotos: 5,
    priority: 1,
    isActive: true,
    subscriberCount: 127
  },
  {
    id: '2',
    name: 'Professional',
    slug: 'professional',
    description: 'Most popular for established dealerships',
    price: 2499,
    currency: 'NAD',
    duration: 1,
    features: [
      'Up to 100 vehicle listings',
      'Priority search placement',
      'Featured listings (10/month)',
      'Enhanced vehicle detail pages',
      'Advanced analytics & reporting',
      '15 photos + 360° spins per vehicle',
      'Customer lead scoring',
      'Automated email campaigns',
      'Homepage carousel feature',
      'Social media integration',
      'Custom dealership branding',
      'Phone & email support'
    ],
    maxListings: 100,
    maxPhotos: 15,
    priority: 2,
    isActive: true,
    subscriberCount: 89
  },
  {
    id: '3',
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For large dealerships and dealer groups',
    price: 4999,
    currency: 'NAD',
    duration: 1,
    features: [
      'Unlimited vehicle listings',
      'Hero section featured placement',
      'Premium featured listings (unlimited)',
      'Top search results guarantee',
      'Dedicated account manager',
      'Advanced inventory sync APIs',
      'Multiple location management',
      'White-label solutions',
      'Custom integrations',
      'Advanced CRM integration',
      'Real-time chat support',
      'Custom reporting dashboards',
      'Homepage hero section (weekly)',
      'Newsletter sponsorship',
      'Exclusive dealer badge'
    ],
    maxListings: 0, // Unlimited
    maxPhotos: 50,
    priority: 3,
    isActive: true,
    subscriberCount: 23
  }
];

const getPlanIcon = (planName: string) => {
  switch (planName.toLowerCase()) {
    case 'starter':
      return <Zap className="w-6 h-6 text-blue-500" />;
    case 'professional':
      return <Star className="w-6 h-6 text-purple-500" />;
    case 'enterprise':
      return <Crown className="w-6 h-6 text-yellow-500" />;
    default:
      return <Zap className="w-6 h-6 text-gray-500" />;
  }
};

const getPlanColor = (planName: string) => {
  switch (planName.toLowerCase()) {
    case 'starter':
      return 'border-blue-200 bg-blue-50';
    case 'professional':
      return 'border-purple-200 bg-purple-50 ring-2 ring-purple-500';
    case 'enterprise':
      return 'border-yellow-200 bg-yellow-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '1',
    maxListings: '',
    maxPhotos: '5',
    features: ''
  });

  const handleCreatePlan = () => {
    // Implementation would call API
    console.log('Creating plan:', formData);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '1',
      maxListings: '',
      maxPhotos: '5',
      features: ''
    });
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      maxListings: plan.maxListings.toString(),
      maxPhotos: plan.maxPhotos.toString(),
      features: plan.features.join('\n')
    });
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(p =>
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscriberCount, 0);
  const totalRevenue = plans.reduce((sum, plan) => sum + (plan.price * plan.subscriberCount), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-3xl font-bold text-gray-900">{totalSubscribers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">NAD {totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-3xl font-bold text-gray-900">{plans.filter(p => p.isActive).length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Manage dealership subscription tiers and pricing</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Subscription Plan</DialogTitle>
              <DialogDescription>
                Define a new subscription tier with features and pricing.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Professional"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price (NAD)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2499"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Months)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Listings</label>
                <Input
                  type="number"
                  value={formData.maxListings}
                  onChange={(e) => setFormData({ ...formData, maxListings: e.target.value })}
                  placeholder="100 (0 for unlimited)"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the plan..."
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Features (one per line)</label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Up to 100 vehicle listings&#10;Priority search placement&#10;Featured listings"
                  rows={6}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlan}>
                Create Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${getPlanColor(plan.name)}`}>
            {plan.name.toLowerCase() === 'professional' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                {getPlanIcon(plan.name)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                NAD {plan.price.toLocaleString()}
                <span className="text-base font-normal text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Active Subscribers</span>
                <Badge variant="outline">{plan.subscriberCount}</Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Key Features:</div>
                <ul className="space-y-1">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-sm text-gray-500">
                      +{plan.features.length - 5} more features
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePlanStatus(plan.id)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${
                      plan.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                        plan.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-gray-600">
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}