'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import WebsiteManagerContent from '@/components/dealer/WebsiteManagerContent';
import {
  Car,
  Users,
  Eye,
  MessageCircle,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Calendar,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Heart,
  CreditCard,
  Crown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Shield,
  Link,
  Copy,
  Ban,
  Key,
  Lock,
  Unlock,
  FileEdit,
  UserCheck,
  UserX,
  MoreHorizontal,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';

// Mock data
const mockDealership = {
  id: 'dealer-1',
  name: 'Premium Auto Namibia',
  description: 'Namibia\'s leading premium vehicle dealership',
  address: '123 Independence Avenue',
  city: 'Windhoek',
  state: 'Khomas',
  phone: '+264 61 123 4567',
  email: 'info@premiumauto.na',
  website: 'www.premiumauto.na'
};

const mockVehicles = [
  {
    id: 'v1',
    year: 2022,
    make: 'BMW',
    model: 'X3',
    price: 650000,
    mileage: 25000,
    status: 'AVAILABLE',
    views: 234,
    inquiries: 12,
    favorites: 8,
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'White'
  },
  {
    id: 'v2',
    year: 2021,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    price: 580000,
    mileage: 35000,
    status: 'AVAILABLE',
    views: 189,
    inquiries: 8,
    favorites: 15,
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Silver'
  },
  {
    id: 'v3',
    year: 2020,
    make: 'Audi',
    model: 'A4',
    price: 520000,
    mileage: 45000,
    status: 'SOLD',
    views: 156,
    inquiries: 6,
    favorites: 12,
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Black'
  }
];

const mockLeads = [
  {
    id: 'l1',
    vehicleId: 'v1',
    vehicleName: '2022 BMW X3',
    customerName: 'John Smith',
    customerEmail: 'john@email.com',
    customerPhone: '+264 81 123 4567',
    message: 'Interested in this vehicle. Can we schedule a test drive?',
    source: 'Contact Form',
    status: 'NEW',
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'l2',
    vehicleId: 'v2',
    vehicleName: '2021 Mercedes-Benz C-Class',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    customerPhone: '+264 81 987 6543',
    message: 'What is the service history of this vehicle?',
    source: 'WhatsApp',
    status: 'CONTACTED',
    createdAt: '2024-01-19T14:15:00Z'
  },
  {
    id: 'l3',
    vehicleId: 'v1',
    vehicleName: '2022 BMW X3',
    customerName: 'Mike Wilson',
    customerEmail: 'mike@email.com',
    customerPhone: '+264 81 555 0123',
    message: 'Is financing available for this vehicle?',
    source: 'Contact Form',
    status: 'QUALIFIED',
    createdAt: '2024-01-18T09:45:00Z'
  }
];

// Chart data for analytics
const monthlyData = [
  { month: 'Jan', views: 1200, inquiries: 45, sales: 8, listings: 25 },
  { month: 'Feb', views: 1800, inquiries: 62, sales: 12, listings: 28 },
  { month: 'Mar', views: 2100, inquiries: 78, sales: 15, listings: 32 },
  { month: 'Apr', views: 2800, inquiries: 95, sales: 18, listings: 35 },
  { month: 'May', views: 3200, inquiries: 112, sales: 22, listings: 38 },
  { month: 'Jun', views: 2900, inquiries: 98, sales: 19, listings: 40 }
];

const leadSourceData = [
  { name: 'Contact Form', value: 65, count: 45, color: '#3B82F6' },
  { name: 'WhatsApp', value: 25, count: 17, color: '#10B981' },
  { name: 'Phone Calls', value: 10, count: 7, color: '#F59E0B' }
];

const vehiclePerformanceData = [
  { make: 'BMW', views: 1200, inquiries: 35, sales: 8 },
  { make: 'Mercedes', views: 980, inquiries: 28, sales: 6 },
  { make: 'Audi', views: 750, inquiries: 22, sales: 4 },
  { make: 'Toyota', views: 890, inquiries: 31, sales: 7 },
  { make: 'VW', views: 650, inquiries: 18, sales: 3 }
];

const conversionData = [
  { name: 'Views', value: 4800, color: '#E5E7EB' },
  { name: 'Inquiries', value: 180, color: '#93C5FD' },
  { name: 'Sales', value: 42, color: '#3B82F6' }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Mock subscription data
const mockSubscription = {
  id: 'sub-001',
  plan: 'Professional',
  status: 'ACTIVE',
  currentPeriodStart: '2024-01-01',
  currentPeriodEnd: '2024-02-01',
  amount: 49900, // N$499.00
  currency: 'NAD',
  listings: {
    used: 25,
    limit: 50
  },
  features: [
    'Up to 50 vehicle listings',
    'Advanced analytics',
    'Priority support',
    'Featured listings',
    'Lead management'
  ],
  nextBilling: '2024-02-01',
  autoRenew: true
};

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 19900, // N$199.00
    currency: 'NAD',
    interval: 'month',
    features: [
      'Up to 20 vehicle listings',
      'Basic analytics',
      'Email support',
      'Standard visibility'
    ],
    maxListings: 20,
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49900, // N$499.00
    currency: 'NAD',
    interval: 'month',
    features: [
      'Up to 50 vehicle listings',
      'Advanced analytics',
      'Priority support',
      'Featured listings',
      'Lead management'
    ],
    maxListings: 50,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99900, // N$999.00
    currency: 'NAD',
    interval: 'month',
    features: [
      'Unlimited vehicle listings',
      'Advanced analytics & reports',
      '24/7 phone support',
      'Premium featured listings',
      'Advanced lead management',
      'Custom branding',
      'API access'
    ],
    maxListings: 999,
    popular: false
  }
];

const mockBillingHistory = [
  {
    id: 'inv-001',
    date: '2024-01-01',
    amount: 49900,
    status: 'PAID',
    plan: 'Professional',
    period: 'Jan 2024'
  },
  {
    id: 'inv-002',
    date: '2023-12-01',
    amount: 49900,
    status: 'PAID',
    plan: 'Professional',
    period: 'Dec 2023'
  },
  {
    id: 'inv-003',
    date: '2023-11-01',
    amount: 49900,
    status: 'PAID',
    plan: 'Professional',
    period: 'Nov 2023'
  }
];

// Mock team members data
const mockTeamMembers = [
  {
    id: 'user-001',
    name: 'Premium Motors Manager',
    email: 'dealer@premium-motors.com',
    role: 'DEALER_PRINCIPAL',
    status: 'ACTIVE',
    joinedAt: '2023-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    permissions: ['FULL_ACCESS'],
    invitedBy: 'System'
  },
  {
    id: 'user-002',
    name: 'John Smith',
    email: 'john.smith@premium-motors.com',
    role: 'SALES_EXECUTIVE',
    status: 'ACTIVE',
    joinedAt: '2023-03-20',
    lastLogin: '2024-01-19T15:45:00Z',
    permissions: ['VEHICLE_MANAGEMENT', 'LEAD_MANAGEMENT'],
    invitedBy: 'Premium Motors Manager'
  },
  {
    id: 'user-003',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@premium-motors.com',
    role: 'DEALER_ADMIN',
    status: 'ACTIVE',
    joinedAt: '2023-05-10',
    lastLogin: '2024-01-18T09:20:00Z',
    permissions: ['VEHICLE_MANAGEMENT', 'LEAD_MANAGEMENT', 'ANALYTICS'],
    invitedBy: 'Premium Motors Manager'
  },
  {
    id: 'user-004',
    name: 'Mike Wilson',
    email: 'mike.wilson@premium-motors.com',
    role: 'SALES_EXECUTIVE',
    status: 'PENDING',
    joinedAt: '2024-01-15',
    lastLogin: null,
    permissions: ['VEHICLE_MANAGEMENT', 'LEAD_MANAGEMENT'],
    invitedBy: 'Premium Motors Manager'
  }
];

const teamRoles = [
  {
    value: 'SALES_EXECUTIVE',
    label: 'Sales Executive',
    description: 'Can manage vehicles and leads',
    permissions: ['VEHICLE_MANAGEMENT', 'LEAD_MANAGEMENT']
  },
  {
    value: 'DEALER_ADMIN',
    label: 'Dealer Admin',
    description: 'Can manage vehicles, leads, and view analytics',
    permissions: ['VEHICLE_MANAGEMENT', 'LEAD_MANAGEMENT', 'ANALYTICS']
  },
  {
    value: 'DEALER_PRINCIPAL',
    label: 'Dealer Principal',
    description: 'Full access to all dealership features',
    permissions: ['FULL_ACCESS']
  }
];

export default function DealerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [manufacturerFilter, setManufacturerFilter] = useState('ALL');
  const [transmissionFilter, setTransmissionFilter] = useState('ALL');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    status: 'AVAILABLE'
  });

  // User management state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'SALES_EXECUTIVE'
  });
  const [inviteLink, setInviteLink] = useState('');
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);

  // New user management modals
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditPermissionsModal, setShowEditPermissionsModal] = useState(false);
  const [showSuspendUserModal, setShowSuspendUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: '' });
  const [suspendReason, setSuspendReason] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // tRPC queries for real data
  const { data: vehicleData, isLoading: vehiclesLoading, error: vehiclesError } = api.vehicle.getByDealership.useQuery({
    limit: 50,
    status: statusFilter === 'ALL' ? undefined : statusFilter as any,
  });

  const { data: leadData, isLoading: leadsLoading, error: leadsError } = api.lead.getByDealership.useQuery({
    limit: 50,
  });

  const { data: leadStats, isLoading: statsLoading } = api.lead.getStats.useQuery({});

  const vehicles = vehicleData?.items || [];
  const leads = leadData?.leads || [];

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/dealer/login?callbackUrl=/dealer/dashboard');
    }
  }, [session, status, router]);

  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'inventory', 'leads', 'analytics', 'users', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Helper functions
  const formatPrice = (price: number) => {
    return 'N$ ' + new Intl.NumberFormat('en-NA', {
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatSubscriptionPrice = (price: number) => {
    return 'N$ ' + new Intl.NumberFormat('en-NA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price / 100);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-NA').format(mileage);
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'SOLD': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique manufacturers from current inventory
  const availableManufacturers = Array.from(new Set(vehicles.map(v => v.make))).sort();

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setManufacturerFilter('ALL');
    setTransmissionFilter('ALL');
    setFuelTypeFilter('ALL');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchTerm !== '' || statusFilter !== 'ALL' || categoryFilter !== 'ALL' ||
           manufacturerFilter !== 'ALL' || transmissionFilter !== 'ALL' || fuelTypeFilter !== 'ALL' ||
           minPrice !== '' || maxPrice !== '' || minYear !== '' || maxYear !== '';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.year.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || vehicle.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || vehicle.category === categoryFilter;
    const matchesManufacturer = manufacturerFilter === 'ALL' || vehicle.make === manufacturerFilter;
    const matchesTransmission = transmissionFilter === 'ALL' || vehicle.transmission === transmissionFilter;
    const matchesFuelType = fuelTypeFilter === 'ALL' || vehicle.fuelType === fuelTypeFilter;

    const matchesPriceRange = (!minPrice || vehicle.price >= parseFloat(minPrice)) &&
                              (!maxPrice || vehicle.price <= parseFloat(maxPrice));
    const matchesYearRange = (!minYear || vehicle.year >= parseInt(minYear)) &&
                             (!maxYear || vehicle.year <= parseInt(maxYear));

    return matchesSearch && matchesStatus && matchesCategory && matchesManufacturer &&
           matchesTransmission && matchesFuelType && matchesPriceRange && matchesYearRange;
  });

  // Enhanced tab switching with loading states
  const handleTabSwitch = async (newTab: string) => {
    if (newTab === activeTab) return;
    
    setIsLoading(true);
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveTab(newTab);
    setIsLoading(false);
    setLastUpdated(new Date());
  };

  // Handle adding new vehicle - redirect to comprehensive wizard
  const handleAddVehicle = () => {
    window.location.href = '/dealer/add-vehicle';
  };

  const handleSubmitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to API
    console.log('Adding new vehicle:', newVehicle);
    
    // For demo, just close modal and reset form
    setShowAddVehicleModal(false);
    setNewVehicle({
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      status: 'AVAILABLE'
    });
    
    // Show success notification
    alert('Vehicle added successfully!');
    setLastUpdated(new Date());
  };

  // Calculate dashboard metrics from real data
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const soldVehicles = vehicles.filter(v => v.status === 'SOLD').length;
  const totalViews = vehicles.reduce((sum, v) => sum + (v.viewCount || 0), 0);
  const totalInquiries = leadStats?.total || 0;
  const newLeads = leadStats?.new || 0;

  // Check if user is dealership principal
  const isDealershipPrincipal = session?.user?.role === 'DEALER_PRINCIPAL';

  // User management helper functions
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DEALER_PRINCIPAL': return 'bg-purple-100 text-purple-800';
      case 'DEALER_ADMIN': return 'bg-blue-100 text-blue-800';
      case 'SALES_EXECUTIVE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateInviteLink = () => {
    const inviteId = Math.random().toString(36).substring(2, 15);
    const baseUrl = window.location.origin;
    return `${baseUrl}/dealer/invite/${inviteId}`;
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate invite link
    const link = generateInviteLink();
    setInviteLink(link);

    // Create new team member with pending status
    const newMember = {
      id: `user-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'PENDING',
      joinedAt: new Date().toISOString().split('T')[0],
      lastLogin: null,
      permissions: teamRoles.find(r => r.value === inviteForm.role)?.permissions || [],
      invitedBy: session?.user?.name || 'System'
    };

    setTeamMembers(prev => [...prev, newMember]);
    setShowInviteLink(true);

    // Reset form
    setInviteForm({
      email: '',
      name: '',
      role: 'SALES_EXECUTIVE'
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId
        ? { ...member, status: member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
        : member
    ));
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(prev => prev.filter(member => member.id !== userId));
    }
  };

  // New user management handlers
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserForm({ name: user.name, email: user.email, role: user.role });
    setShowEditUserModal(true);
  };

  const handleSaveEditUser = () => {
    setTeamMembers(prev => prev.map(member =>
      member.id === selectedUser.id
        ? { ...member, ...editUserForm }
        : member
    ));
    setShowEditUserModal(false);
    setSelectedUser(null);
    alert('User information updated successfully!');
  };

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setShowEditPermissionsModal(true);
  };

  const handleSavePermissions = () => {
    setTeamMembers(prev => prev.map(member =>
      member.id === selectedUser.id
        ? { ...member, permissions: selectedPermissions }
        : member
    ));
    setShowEditPermissionsModal(false);
    setSelectedUser(null);
    alert('Permissions updated successfully!');
  };

  const handleSuspendUser = (user: any) => {
    setSelectedUser(user);
    setSuspendReason('');
    setShowSuspendUserModal(true);
  };

  const handleConfirmSuspend = () => {
    setTeamMembers(prev => prev.map(member =>
      member.id === selectedUser.id
        ? { ...member, status: 'SUSPENDED', suspendReason: suspendReason }
        : member
    ));
    setShowSuspendUserModal(false);
    setSelectedUser(null);
    setSuspendReason('');
    alert('User suspended successfully!');
  };

  const handleUnsuspendUser = (userId: string) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId
        ? { ...member, status: 'ACTIVE', suspendReason: undefined }
        : member
    ));
    alert('User unsuspended successfully!');
  };

  const handleSendPasswordReset = (user: any) => {
    setSelectedUser(user);
    setShowPasswordResetModal(true);
  };

  const handleConfirmPasswordReset = () => {
    // Generate password reset link
    const resetLink = `https://cars.na/reset-password?token=${Math.random().toString(36).substring(7)}&email=${selectedUser.email}`;
    navigator.clipboard.writeText(resetLink);
    setShowPasswordResetModal(false);
    setSelectedUser(null);
    alert(`Password reset link generated and copied to clipboard!\n\nLink: ${resetLink}\n\nThis link has been sent to ${selectedUser.email}`);
  };

  const handleResendInvite = (user: any) => {
    const inviteLink = `https://cars.na/dealer/accept-invite?token=${Math.random().toString(36).substring(7)}&email=${user.email}`;
    alert(`Invite resent to ${user.email}!\n\nInvite link: ${inviteLink}`);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  if (status === 'loading' || vehiclesLoading || leadsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (vehiclesError || leadsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{vehiclesError?.message || leadsError?.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Inspired by professional dealer systems */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Cars.na</h1>
              <p className="text-sm text-gray-600">Dealer Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleTabSwitch('overview')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Dashboard Overview
                {isLoading && activeTab === 'overview' && (
                  <div className="ml-auto w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('inventory')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'inventory'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Car className="h-4 w-4 mr-3" />
                Stock Manager
                {newLeads > 0 && activeTab !== 'inventory' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{availableVehicles}</span>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('leads')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'leads'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Users className="h-4 w-4 mr-3" />
                Lead Manager
                {newLeads > 0 && activeTab !== 'leads' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{newLeads}</span>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('analytics')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Analytics
              </button>

              {/* Subscription tab - only visible to dealership principals */}
              {isDealershipPrincipal && (
                <button
                  onClick={() => handleTabSwitch('subscription')}
                  disabled={isLoading}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                    activeTab === 'subscription'
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Subscription
                  <Crown className="h-3 w-3 ml-auto text-yellow-500" />
                </button>
              )}

              {/* User Management tab - only visible to dealership principals */}
              {isDealershipPrincipal && (
                <button
                  onClick={() => handleTabSwitch('users')}
                  disabled={isLoading}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                    activeTab === 'users'
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Users className="h-4 w-4 mr-3" />
                  Team Management
                  <Crown className="h-3 w-3 ml-auto text-yellow-500" />
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Website</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleTabSwitch('profile')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Website Manager
              </button>
            </div>
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {mockDealership.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{mockDealership.name}</p>
              <p className="text-xs text-gray-500">Premium Account</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'inventory' && 'Stock Manager'}
                {activeTab === 'leads' && 'Lead Manager'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'subscription' && 'Subscription Management'}
                {activeTab === 'users' && 'Team Management'}
                {activeTab === 'profile' && 'Website Manager'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'overview' && 'Monitor your dealership performance'}
                {activeTab === 'inventory' && 'Manage your vehicle inventory'}
                {activeTab === 'leads' && 'Track and manage customer inquiries'}
                {activeTab === 'analytics' && 'View detailed performance metrics'}
                {activeTab === 'subscription' && 'Manage your subscription and billing'}
                {activeTab === 'users' && 'Manage your dealership team members'}
                {activeTab === 'profile' && 'Update your dealership information'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
                <span className="text-xs">Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              {activeTab === 'inventory' && (
                <Button 
                  onClick={handleAddVehicle}
                  className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className={`space-y-6 transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalVehicles}</div>
                      <p className="text-xs text-muted-foreground">
                        {availableVehicles} available, {soldVehicles} sold
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalInquiries}</div>
                      <p className="text-xs text-muted-foreground">
                        {newLeads} new leads
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8.5%</div>
                      <p className="text-xs text-muted-foreground">
                        +2.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Leads</CardTitle>
                      <CardDescription>Latest customer inquiries</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {leads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{lead.customerName}</p>
                            <p className="text-sm text-gray-600">
                              {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : 'Vehicle Info'}
                            </p>
                            <p className="text-xs text-gray-500">{lead.source}</p>
                          </div>
                          <Badge className={getLeadStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No recent leads
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Vehicles</CardTitle>
                      <CardDescription>Most viewed and inquired vehicles</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vehicles
                        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                        .slice(0, 3)
                        .map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'}
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                              <p className="text-sm text-gray-600">{formatPrice(vehicle.price)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{vehicle.viewCount || 0} views</p>
                            <p className="text-xs text-gray-500">Vehicle details</p>
                          </div>
                        </div>
                      ))}
                      {vehicles.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No vehicles in inventory
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                {/* Search and Filter Controls */}
                <div className="space-y-4">
                  {/* Top Row - Search and Quick Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center flex-wrap">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search vehicles..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="ALL">All Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="SOLD">Sold</option>
                        <option value="PENDING">Pending</option>
                        <option value="RESERVED">Reserved</option>
                      </select>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="CARS">Cars</option>
                        <option value="TRUCKS">Trucks</option>
                        <option value="MOTORCYCLES">Motorcycles</option>
                        <option value="BUSES">Buses</option>
                        <option value="INDUSTRIAL_MACHINERY">Industrial Machinery</option>
                        <option value="TRACTORS">Tractors</option>
                        <option value="BOATS">Boats</option>
                        <option value="ACCESSORIES">Accessories</option>
                      </select>
                      <select
                        value={manufacturerFilter}
                        onChange={(e) => setManufacturerFilter(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="ALL">All Manufacturers</option>
                        {availableManufacturers.map(manufacturer => (
                          <option key={manufacturer} value={manufacturer}>
                            {manufacturer}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        {showFilters ? 'Hide' : 'More'} Filters
                        {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {hasActiveFilters() && !showFilters && (
                          <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {[searchTerm, statusFilter !== 'ALL', categoryFilter !== 'ALL', manufacturerFilter !== 'ALL', transmissionFilter !== 'ALL', fuelTypeFilter !== 'ALL', minPrice, maxPrice, minYear, maxYear].filter(Boolean).length}
                          </span>
                        )}
                      </Button>
                      {hasActiveFilters() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <X className="h-4 w-4" />
                          Clear All
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Advanced Filters Panel */}
                  {showFilters && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Advanced Filters</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Transmission Filter */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
                          <select
                            value={transmissionFilter}
                            onChange={(e) => setTransmissionFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            <option value="ALL">All Transmissions</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                            <option value="CVT">CVT</option>
                            <option value="Semi-Automatic">Semi-Automatic</option>
                          </select>
                        </div>

                        {/* Fuel Type Filter */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
                          <select
                            value={fuelTypeFilter}
                            onChange={(e) => setFuelTypeFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          >
                            <option value="ALL">All Fuel Types</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                          </select>
                        </div>

                        {/* Price Range */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Min Price (N$)</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Max Price (N$)</label>
                          <Input
                            type="number"
                            placeholder="No limit"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        {/* Year Range */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Min Year</label>
                          <Input
                            type="number"
                            placeholder="1900"
                            value={minYear}
                            onChange={(e) => setMinYear(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Max Year</label>
                          <Input
                            type="number"
                            placeholder={new Date().getFullYear().toString()}
                            value={maxYear}
                            onChange={(e) => setMaxYear(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      Showing <strong>{filteredVehicles.length}</strong> of <strong>{vehicles.length}</strong> vehicles
                      {hasActiveFilters() && <span className="ml-2 text-blue-600">(filtered)</span>}
                    </span>
                  </div>
                </div>

                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-2 right-2 ${getVehicleStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Public
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-3">
                          {formatPrice(vehicle.price)}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Mileage:</span>
                            <span>{formatMileage(vehicle.mileage)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transmission:</span>
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fuel Type:</span>
                            <span>{vehicle.fuelType}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {vehicle.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {vehicle.inquiries}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {vehicle.favorites}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Leads</CardTitle>
                    <CardDescription>Manage inquiries and customer communications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div key={lead.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-semibold">{lead.customerName}</h4>
                                <p className="text-sm text-gray-600">
                                  {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : 'Vehicle Info'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getLeadStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                              <Badge variant="outline">{lead.source}</Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{lead.message || 'No message provided'}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {lead.customerEmail}
                              </span>
                              {lead.customerPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {lead.customerPhone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Reply</Button>
                              <Button size="sm">Contact</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="font-medium mb-2">No leads yet</h3>
                          <p className="text-sm">Customer inquiries will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Key Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalVehicles}</div>
                      <p className="text-xs text-muted-foreground">
                        {availableVehicles} available, {soldVehicles} sold
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,900</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Inquiries</CardTitle>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98</div>
                      <p className="text-xs text-muted-foreground">
                        +8% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">19</div>
                      <p className="text-xs text-muted-foreground">
                        +5% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Performance Trends</CardTitle>
                      <CardDescription>Views, inquiries, and sales over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                          <Line type="monotone" dataKey="inquiries" stroke="#10B981" strokeWidth={2} />
                          <Line type="monotone" dataKey="sales" stroke="#F59E0B" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Sources Distribution</CardTitle>
                      <CardDescription>Where your customers are coming from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={leadSourceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {leadSourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vehicle Performance by Brand</CardTitle>
                      <CardDescription>Views, inquiries, and sales by manufacturer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vehiclePerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="make" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="views" fill="#93C5FD" />
                          <Bar dataKey="inquiries" fill="#3B82F6" />
                          <Bar dataKey="sales" fill="#1E40AF" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Funnel</CardTitle>
                      <CardDescription>From views to sales conversion</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={conversionData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row 3 */}
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Activity Overview</CardTitle>
                      <CardDescription>Comprehensive view of all activities over the past 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="views" stackId="1" stroke="#E5E7EB" fill="#E5E7EB" />
                          <Area type="monotone" dataKey="inquiries" stackId="1" stroke="#93C5FD" fill="#93C5FD" />
                          <Area type="monotone" dataKey="sales" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                          <Area type="monotone" dataKey="listings" stackId="1" stroke="#10B981" fill="#10B981" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Rate</CardTitle>
                      <CardDescription>Views to sales conversion</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">6.5%</div>
                      <p className="text-sm text-gray-500 mt-2">
                        19 sales from 2,900 views
                      </p>
                      <div className="mt-4 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '6.5%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Average Response Time</CardTitle>
                      <CardDescription>Time to respond to inquiries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">2.4h</div>
                      <p className="text-sm text-gray-500 mt-2">
                        Average response time
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        ↓ 15% faster than last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Vehicle</CardTitle>
                      <CardDescription>Most viewed this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold text-gray-900">2022 BMW X3</div>
                      <p className="text-sm text-gray-500 mt-1">
                        456 views, 18 inquiries
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        View listing →
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <WebsiteManagerContent />
            )}

            {/* Subscription Tab - Only visible to dealership principals */}
            {activeTab === 'subscription' && isDealershipPrincipal && (
              <div className="space-y-6">
                {/* Current Subscription Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              <Crown className="h-5 w-5 text-yellow-500" />
                              Current Subscription
                            </CardTitle>
                            <CardDescription>Your active plan and usage</CardDescription>
                          </div>
                          <Badge className={`${
                            mockSubscription.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {mockSubscription.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold">{mockSubscription.plan} Plan</h3>
                            <p className="text-gray-600">
                              {formatSubscriptionPrice(mockSubscription.amount)} per month
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Next billing</p>
                            <p className="font-semibold">
                              {new Date(mockSubscription.nextBilling).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Usage Progress */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Vehicle Listings</span>
                            <span className="text-sm text-gray-600">
                              {mockSubscription.listings.used} / {mockSubscription.listings.limit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(mockSubscription.listings.used / mockSubscription.listings.limit) * 100}%`
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {mockSubscription.listings.limit - mockSubscription.listings.used} listings remaining
                          </p>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-medium mb-3">Plan Features</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {mockSubscription.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Auto-renewal status */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Auto-renewal</span>
                          </div>
                          <Badge variant={mockSubscription.autoRenew ? "default" : "secondary"}>
                            {mockSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Upgrade Plan
                        </Button>
                        <Button variant="outline" className="w-full">
                          Update Payment Method
                        </Button>
                        <Button variant="outline" className="w-full">
                          Download Invoice
                        </Button>
                        <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                          Cancel Subscription
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Usage Alert */}
                    {mockSubscription.listings.used / mockSubscription.listings.limit > 0.8 && (
                      <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-orange-800">Usage Alert</span>
                          </div>
                          <p className="text-sm text-orange-700">
                            You're approaching your listing limit. Consider upgrading to continue adding vehicles.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Available Plans */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Plans</CardTitle>
                    <CardDescription>Choose the plan that best fits your dealership needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {subscriptionPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`relative border rounded-lg p-6 ${
                            plan.popular
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200'
                          } ${
                            plan.name === mockSubscription.plan
                              ? 'bg-blue-50'
                              : 'bg-white'
                          }`}
                        >
                          {plan.popular && (
                            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                              Most Popular
                            </Badge>
                          )}

                          <div className="text-center">
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <div className="mt-2 mb-4">
                              <span className="text-3xl font-bold">
                                {formatSubscriptionPrice(plan.price)}
                              </span>
                              <span className="text-gray-600">/{plan.interval}</span>
                            </div>
                          </div>

                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            className={`w-full ${
                              plan.name === mockSubscription.plan
                                ? 'bg-gray-400 cursor-not-allowed'
                                : plan.popular
                                  ? 'bg-blue-600 hover:bg-blue-700'
                                  : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                            disabled={plan.name === mockSubscription.plan}
                          >
                            {plan.name === mockSubscription.plan ? 'Current Plan' : 'Select Plan'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Your recent payments and invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockBillingHistory.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{invoice.plan} Plan</p>
                              <p className="text-sm text-gray-600">
                                {new Date(invoice.date).toLocaleDateString()} • {invoice.period}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">{formatSubscriptionPrice(invoice.amount)}</p>
                              <Badge className={`${
                                invoice.status === 'PAID'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {invoice.status}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User Management Tab - Only visible to dealership principals */}
            {activeTab === 'users' && isDealershipPrincipal && (
              <div className="space-y-6">
                {/* Team Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{teamMembers.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {teamMembers.filter(m => m.status === 'ACTIVE').length} active
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamMembers.filter(m => m.status === 'PENDING').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Awaiting acceptance
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales Team</CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamMembers.filter(m => m.role === 'SALES_EXECUTIVE').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sales executives
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {teamMembers.filter(m => m.role === 'DEALER_ADMIN' || m.role === 'DEALER_PRINCIPAL').length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Admin access
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Team Members</h2>
                  <Button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                </div>

                {/* Team Members List */}
                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {teamMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className={`p-6 ${index !== teamMembers.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-700 font-semibold text-lg">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{member.name}</h3>
                                <p className="text-gray-600">{member.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getRoleColor(member.role)}>
                                    {teamRoles.find(r => r.value === member.role)?.label || member.role}
                                  </Badge>
                                  <Badge className={getUserStatusColor(member.status)}>
                                    {member.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right text-sm text-gray-500">
                                <p>Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                                {member.lastLogin && (
                                  <p>Last login: {new Date(member.lastLogin).toLocaleDateString()}</p>
                                )}
                                {!member.lastLogin && member.status === 'PENDING' && (
                                  <p>Never logged in</p>
                                )}
                              </div>

                              {member.role !== 'DEALER_PRINCIPAL' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={() => handleEditUser(member)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit User Info
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditPermissions(member)}>
                                      <FileEdit className="h-4 w-4 mr-2" />
                                      Edit Permissions
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendPasswordReset(member)}>
                                      <Key className="h-4 w-4 mr-2" />
                                      Send Password Reset
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {member.status === 'SUSPENDED' ? (
                                      <DropdownMenuItem onClick={() => handleUnsuspendUser(member.id)}>
                                        <Unlock className="h-4 w-4 mr-2" />
                                        Unsuspend User
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleSuspendUser(member)}>
                                        <Ban className="h-4 w-4 mr-2" />
                                        Suspend User
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleToggleUserStatus(member.id)}>
                                      {member.status === 'ACTIVE' ? (
                                        <>
                                          <UserX className="h-4 w-4 mr-2" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="h-4 w-4 mr-2" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    {member.status === 'PENDING' && (
                                      <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Resend Invite
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleRemoveUser(member.id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>

                          {/* Permissions Display */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                              {member.permissions.map((permission) => (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {permission.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {teamMembers.length === 0 && (
                        <div className="text-center py-12">
                          <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">No team members</h3>
                          <p className="text-gray-500 mb-4">Get started by inviting your first team member</p>
                          <Button
                            onClick={() => setShowInviteModal(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite Team Member
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Vehicle</h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Make</label>
                  <Input
                    required
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                    placeholder="BMW, Mercedes, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <Input
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                    placeholder="X3, C-Class, etc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <Input
                    required
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                    placeholder="2023"
                    min="1990"
                    max="2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (N$)</label>
                  <Input
                    required
                    type="number"
                    value={newVehicle.price}
                    onChange={(e) => setNewVehicle({...newVehicle, price: e.target.value})}
                    placeholder="650000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                <Input
                  required
                  type="number"
                  value={newVehicle.mileage}
                  onChange={(e) => setNewVehicle({...newVehicle, mileage: e.target.value})}
                  placeholder="25000"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Transmission</label>
                  <select
                    value={newVehicle.transmission}
                    onChange={(e) => setNewVehicle({...newVehicle, transmission: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Invite Team Member</h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setShowInviteLink(false);
                  setInviteForm({ email: '', name: '', role: 'SALES_EXECUTIVE' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {!showInviteLink ? (
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    required
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                    placeholder="John Smith"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                    placeholder="john.smith@premium-motors.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {teamRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {teamRoles.find(r => r.value === inviteForm.role)?.description}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Role Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {teamRoles.find(r => r.value === inviteForm.role)?.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Invitation Sent!</h4>
                  <p className="text-gray-600 mb-4">
                    An invitation has been sent to <strong>{inviteForm.email}</strong>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Invite Link</label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={inviteLink}
                      className="flex-1 bg-white"
                    />
                    <Button
                      onClick={copyInviteLink}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share this link directly with the team member if needed
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowInviteModal(false);
                      setShowInviteLink(false);
                      setInviteForm({ email: '', name: '', role: 'SALES_EXECUTIVE' });
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit User Information</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowEditUserModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={editUserForm.name}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editUserForm.role}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="SALES_EXECUTIVE">Sales Executive</option>
                    <option value="DEALER_ADMIN">Dealer Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveEditUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setShowEditUserModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {showEditPermissionsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit User Permissions</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowEditPermissionsModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Managing permissions for: <strong>{selectedUser.name}</strong></p>
              </div>
              <div className="space-y-3">
                {['VEHICLE_MANAGEMENT', 'LEAD_MANAGEMENT', 'VIEW_ANALYTICS', 'MANAGE_TEAM', 'FULL_ACCESS'].map(permission => (
                  <label key={permission} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="mr-3 h-4 w-4 text-blue-600 rounded"
                    />
                    <div>
                      <div className="font-medium">{permission.replace('_', ' ')}</div>
                      <div className="text-sm text-gray-500">
                        {permission === 'VEHICLE_MANAGEMENT' && 'Add, edit, and remove vehicles from inventory'}
                        {permission === 'LEAD_MANAGEMENT' && 'View and manage customer leads'}
                        {permission === 'VIEW_ANALYTICS' && 'Access analytics and reports'}
                        {permission === 'MANAGE_TEAM' && 'Manage team members and permissions'}
                        {permission === 'FULL_ACCESS' && 'Complete access to all dealership features'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSavePermissions}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Permissions
                </Button>
                <Button
                  onClick={() => setShowEditPermissionsModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {showSuspendUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-red-600">Suspend User</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSuspendUserModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">You are about to suspend: <strong>{selectedUser.name}</strong></p>
                <p className="text-sm text-gray-500 mt-2">Suspended users cannot log in or access the system.</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter reason for suspension..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmSuspend}
                  disabled={!suspendReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend User
                </Button>
                <Button
                  onClick={() => setShowSuspendUserModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordResetModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Send Password Reset</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPasswordResetModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">Send password reset link to:</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  A password reset link will be generated and sent to this email address. The link will be valid for 24 hours.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmPasswordReset}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Send Reset Link
                </Button>
                <Button
                  onClick={() => setShowPasswordResetModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
