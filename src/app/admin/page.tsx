'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Building2,
  Car,
  MessageSquare,
  TrendingUp,
  Settings,
  Search,
  BarChart3,
  Shield,
  FileText,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  LogOut,
  Image
} from 'lucide-react';

// Import simplified admin components (avoiding tRPC compatibility issues)
import { AdminUserList } from '@/components/admin/AdminUserList';

// Mock admin data
const ADMIN_STATS = {
  totalUsers: 1247,
  totalDealers: 89,
  totalListings: 3456,
  totalLeads: 892,
  monthlyRevenue: 45600,
  activeUsers: 234,
  pendingApprovals: 12,
  flaggedContent: 3
};

const RECENT_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', type: 'Buyer', status: 'Active', joinDate: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@dealer.com', type: 'Dealer', status: 'Active', joinDate: '2024-01-14' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', type: 'Buyer', status: 'Pending', joinDate: '2024-01-13' },
  { id: '4', name: 'Sarah Johnson', email: 'sarah@dealer.com', type: 'Dealer', status: 'Suspended', joinDate: '2024-01-12' }
];

const RECENT_DEALERS = [
  { id: '1', name: 'Premium Motors', contact: 'John Smith', email: 'john@premium.com', status: 'Active', listings: 45, revenue: 12500 },
  { id: '2', name: 'City Cars', contact: 'Sarah Wilson', email: 'sarah@citycars.com', status: 'Active', listings: 32, revenue: 8900 },
  { id: '3', name: 'Auto Palace', contact: 'Mike Brown', email: 'mike@autopalace.com', status: 'Pending', listings: 0, revenue: 0 },
  { id: '4', name: 'Elite Autos', contact: 'Lisa Davis', email: 'lisa@elite.com', status: 'Suspended', listings: 28, revenue: 6700 }
];

const RECENT_LISTINGS = [
  { id: '1', title: '2020 BMW X5', dealer: 'Premium Motors', price: 450000, status: 'Active', views: 234, leads: 12 },
  { id: '2', title: '2019 Mercedes C-Class', dealer: 'City Cars', price: 380000, status: 'Active', views: 189, leads: 8 },
  { id: '3', title: '2021 Toyota Hilux', dealer: 'Auto Palace', price: 520000, status: 'Pending', views: 0, leads: 0 },
  { id: '4', title: '2018 Audi A4', dealer: 'Elite Autos', price: 320000, status: 'Flagged', views: 156, leads: 3 }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for admin authentication
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/admin-auth');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'dealers', label: 'Dealers', icon: Building2 },
    { id: 'listings', label: 'Listings', icon: Car },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const settingsTabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'payment', label: 'Payment' },
    { id: 'email', label: 'Email' },
    { id: 'api', label: 'API' }
  ];

  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    router.push('/admin-auth');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Suspended': 'bg-red-100 text-red-800',
      'Flagged': 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Cars.na Platform Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{ADMIN_STATS.totalUsers.toLocaleString()}</p>
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +12% from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Dealers</p>
                      <p className="text-2xl font-bold text-gray-900">{ADMIN_STATS.totalDealers}</p>
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +5% from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Car className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Listings</p>
                      <p className="text-2xl font-bold text-gray-900">{ADMIN_STATS.totalListings.toLocaleString()}</p>
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +18% from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">N${ADMIN_STATS.monthlyRevenue.toLocaleString()}</p>
                      <div className="flex items-center text-sm text-green-600">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +23% from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>Items requiring immediate admin attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">New Dealer Applications</span>
                        <p className="text-xs text-gray-600">Awaiting verification</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 font-bold">3</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Flagged Listings</span>
                        <p className="text-xs text-gray-600">Reported content</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800 font-bold">2</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">User Reports</span>
                        <p className="text-xs text-gray-600">Moderation queue</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 font-bold">7</Badge>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setActiveTab('moderation')}
                  >
                    Review All
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    System Health
                  </CardTitle>
                  <CardDescription>Real-time platform performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Server Status</span>
                        <p className="text-xs text-gray-600">99.9% uptime</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Database</span>
                        <p className="text-xs text-gray-600">Response: 45ms</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">API Response</span>
                        <p className="text-xs text-gray-600">Avg: 120ms</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Fast</Badge>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest 24-hour platform events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-2 border-l-2 border-blue-200">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">New dealer:</span> Auto Palace registered
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 border-l-2 border-orange-200">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">Flagged:</span> 2018 Audi A4 listing
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 border-l-2 border-red-200">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">Suspended:</span> spam_user_123
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 border-l-2 border-green-200">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <span className="font-medium">Payment:</span> N$2,500 processed
                        <p className="text-xs text-gray-500">8 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && <AdminUserList />}

        {/* Dealers Tab */}
        {activeTab === 'dealers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dealer Management</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Dealer Management</h3>
                <p className="text-gray-600">Advanced dealer management features will be available here.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
              <Button
                onClick={() => router.push('/admin/banners')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Image className="w-4 h-4 mr-2" />
                Manage Banners
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Website Banner Management</h3>
                <p className="text-gray-600 mb-4">
                  Create and manage advertising banners displayed on the homepage and throughout the website.
                </p>
                <Button
                  onClick={() => router.push('/admin/banners')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Open Banner Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Listings</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vehicle Management</h3>
                <p className="text-gray-600">Comprehensive vehicle listing management features.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Vehicle Moderation</h3>
                  <p className="text-gray-600">Advanced content moderation tools.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Flagged Content</h3>
                  <p className="text-gray-600">Review and manage flagged listings.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-gray-600">Comprehensive platform analytics and reporting.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>

            {/* Settings Sub-Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeSettingsTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{settingsTabs.find(t => t.id === activeSettingsTab)?.label} Settings</h3>
                <p className="text-gray-600">Advanced {activeSettingsTab} configuration options will be available here.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
