'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { api } from '@/lib/api';
import WebsiteManagerContent from '@/components/dealer/WebsiteManagerContent';
import SalesProfileContent from '@/components/dealer/SalesProfileContent';
import DealershipAnalyticsDashboard from '@/components/analytics/DealershipAnalyticsDashboard';
import DealerSubscriptionTab from '@/components/dealer/DealerSubscriptionTab';
import { InvoiceReminderModal } from '@/components/dealer/InvoiceReminderModal';
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
  Send,
  Upload,
  Camera,
  Tag,
  MapPin,
  Bell,
  Inbox,
  FileText,
  Download,
  AlertCircle,
  Fuel,
  Gauge,
  History,
  PhoneCall,
  MessageSquare,
  Handshake,
  Activity,
  ArrowUpDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
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
// Mock data removed - using real API data instead
const mockDealership = {
  id: 'dealer-1',
  name: 'Loading...',
  description: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  email: '',
  website: ''
};

/* Mock vehicles removed - using real data from API
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
*/

/* Mock leads removed - using real data from API
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
*/

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
  { name: 'Contact Form', value: 65, count: 45, color: '#CB2030' },
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
  { name: 'Inquiries', value: 180, color: '#FCA5A5' },
  { name: 'Sales', value: 42, color: '#CB2030' }
];

const COLORS = ['#CB2030', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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

// Vehicle Listings Tab Component
function VehicleListingsTab() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<Record<string, any[]>>({});
  const [loadingActivity, setLoadingActivity] = useState<string | null>(null);
  const [detailActivities, setDetailActivities] = useState<any[]>([]);
  const [loadingDetailActivities, setLoadingDetailActivities] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  // Lock body scroll & reset scroll position when details modal opens
  useEffect(() => {
    if (showDetailsModal) {
      document.body.style.overflow = 'hidden';
      if (detailsScrollRef.current) {
        detailsScrollRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showDetailsModal]);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/dealer/vehicle-listings');
      const data = await response.json();
      if (data.success) {
        setListings(data.listings);
      }
    } catch {
      showToast({ title: 'Error', description: 'Failed to load vehicle listings', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Log activity (view, call, email, etc.)
  const logActivity = async (listingId: string, action: string, metadata?: any) => {
    try {
      await fetch('/api/dealer/listing-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, action, metadata }),
      });
    } catch {
      // silent — activity logging shouldn't block UX
    }
  };

  // Fetch activity log for a listing
  const fetchActivity = async (listingId: string) => {
    if (activityData[listingId]) {
      setExpandedActivity(expandedActivity === listingId ? null : listingId);
      return;
    }
    setLoadingActivity(listingId);
    setExpandedActivity(listingId);
    try {
      const res = await fetch(`/api/dealer/listing-activity?listingId=${listingId}`);
      const data = await res.json();
      if (data.success) {
        setActivityData(prev => ({ ...prev, [listingId]: data.activities }));
      }
    } catch {
      // silent
    } finally {
      setLoadingActivity(null);
    }
  };

  // Fetch activity for detail modal
  const fetchDetailActivities = async (listingId: string) => {
    setLoadingDetailActivities(true);
    try {
      const res = await fetch(`/api/dealer/listing-activity?listingId=${listingId}`);
      const data = await res.json();
      if (data.success) {
        setDetailActivities(data.activities);
      }
    } catch {
      // silent
    } finally {
      setLoadingDetailActivities(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!selectedListing) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/dealer/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedListing.id,
          offerPrice: offerPrice ? parseFloat(offerPrice) : null,
          message,
        }),
      });
      const data = await response.json();
      if (data.success) {
        logActivity(selectedListing.id, 'EXPRESSED_INTEREST', { offerPrice: offerPrice || null });
        showToast({ title: 'Success', description: 'Interest expressed successfully!', variant: 'success' });
        setShowInterestModal(false);
        setOfferPrice('');
        setMessage('');
        fetchListings();
      } else {
        showToast({ title: 'Error', description: data.error || 'Failed to express interest', variant: 'error' });
      }
    } catch {
      showToast({ title: 'Error', description: 'An error occurred', variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // View details handler — logs VIEWED activity
  const handleViewDetails = (listing: any) => {
    setSelectedListing(listing);
    setShowDetailsModal(true);
    logActivity(listing.id, 'VIEWED');
    fetchDetailActivities(listing.id);
  };

  // Contact action handlers — log activity then perform action
  const handleCall = (listing: any) => {
    logActivity(listing.id, 'CALLED_SELLER');
    window.location.href = `tel:${listing.userPhone}`;
  };

  const handleEmail = (listing: any) => {
    logActivity(listing.id, 'EMAILED_SELLER');
    window.location.href = `mailto:${listing.userEmail}?subject=Inquiry about ${listing.year} ${listing.make} ${listing.model}`;
  };

  const handleWhatsApp = (listing: any) => {
    logActivity(listing.id, 'WHATSAPP_SELLER');
    const phone = listing.userPhone?.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hi, I'm interested in your ${listing.year} ${listing.make} ${listing.model} listed on Cars.na`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Activity icon helper
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'VIEWED': return <Eye className="w-3.5 h-3.5" />;
      case 'EXPRESSED_INTEREST': return <Heart className="w-3.5 h-3.5" />;
      case 'CALLED_SELLER': return <PhoneCall className="w-3.5 h-3.5" />;
      case 'EMAILED_SELLER': return <Mail className="w-3.5 h-3.5" />;
      case 'WHATSAPP_SELLER': return <MessageSquare className="w-3.5 h-3.5" />;
      case 'STATUS_CHANGED': return <Activity className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'VIEWED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'EXPRESSED_INTEREST': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'CALLED_SELLER': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'EMAILED_SELLER': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'WHATSAPP_SELLER': return 'text-green-600 bg-green-50 border-green-200';
      case 'STATUS_CHANGED': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityLabel = (action: string) => {
    switch (action) {
      case 'VIEWED': return 'Viewed listing';
      case 'EXPRESSED_INTEREST': return 'Expressed interest';
      case 'CALLED_SELLER': return 'Called seller';
      case 'EMAILED_SELLER': return 'Emailed seller';
      case 'WHATSAPP_SELLER': return 'WhatsApp\'d seller';
      case 'STATUS_CHANGED': return 'Status changed';
      default: return action;
    }
  };

  const formatActivityDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-NA', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 border-[3px] border-gray-200 border-t-[#CB2030] rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Vehicle Listings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Browse vehicles for sale from private sellers in your region</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <Car className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">{listings.length}</span>
            <span className="text-xs text-gray-500">available</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No listings available</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Private seller vehicle listings in your region will appear here when they become available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
              <div className="flex flex-col md:flex-row">
                {/* Image — horizontal card layout */}
                <button
                  onClick={() => handleViewDetails(listing)}
                  className="md:w-72 flex-shrink-0 relative group cursor-pointer"
                >
                  {listing.images && listing.images.length > 0 ? (
                    <div className="relative h-52 md:h-full min-h-[200px] bg-gray-100">
                      <img
                        src={listing.images[0]}
                        alt={`${listing.year} ${listing.make} ${listing.model}`}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {listing.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                          <Camera className="w-3 h-3" />
                          {listing.images.length} photos
                        </div>
                      )}
                      {listing.hasExpressedInterest && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                          <CheckCircle className="w-3 h-3" />
                          Interest Sent
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-52 md:h-full min-h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <Car className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col">
                  {/* Top row: Title + Price */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <button
                        onClick={() => handleViewDetails(listing)}
                        className="text-lg font-bold text-gray-900 hover:text-[#CB2030] transition-colors text-left"
                      >
                        {listing.year} {listing.make} {listing.model}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{listing.category}</span>
                        {listing.condition && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-xs text-gray-500">{listing.condition}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black tabular-nums" style={{ color: '#CB2030' }}>
                        NAD {listing.price.toLocaleString()}
                      </p>
                      {listing.negotiable && (
                        <span className="text-[11px] font-medium text-gray-500">Negotiable</span>
                      )}
                    </div>
                  </div>

                  {/* Spec pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.mileage && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
                        <Gauge className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">{listing.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                    {listing.transmission && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
                        <Settings className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">{listing.transmission}</span>
                      </div>
                    )}
                    {listing.fuelType && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
                        <Fuel className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">{listing.fuelType}</span>
                      </div>
                    )}
                    {listing.color && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs text-gray-600">
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: listing.color.toLowerCase() }} />
                        <span className="font-medium">{listing.color}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {listing.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">{listing.description}</p>
                  )}

                  {/* Location + date */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.city && listing.region ? `${listing.city}, ${listing.region}` : listing.city || listing.region || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(listing.createdAt).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {listing.totalInterests > 0 && (
                      <div className="flex items-center gap-1 text-[#CB2030] font-medium">
                        <Handshake className="w-3 h-3" />
                        {listing.totalInterests} dealer{listing.totalInterests > 1 ? 's' : ''} interested
                      </div>
                    )}
                  </div>

                  {/* Action bar */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => handleViewDetails(listing)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#CB2030' }}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {!listing.hasExpressedInterest && (
                      <button
                        onClick={() => { setSelectedListing(listing); setShowInterestModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#CB2030] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Interest
                      </button>
                    )}

                    <button
                      onClick={() => handleCall(listing)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Call seller"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>

                    <button
                      onClick={() => handleEmail(listing)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Email seller"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>

                    <button
                      onClick={() => handleWhatsApp(listing)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      aria-label="WhatsApp seller"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </button>

                    {/* Activity log toggle */}
                    <button
                      onClick={() => fetchActivity(listing.id)}
                      className={`ml-auto flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        expandedActivity === listing.id
                          ? 'text-indigo-700 bg-indigo-50'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      Activity
                      {(listing.totalActivities || 0) > 0 && (
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">
                          {listing.totalActivities}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Log — expandable below card */}
              {expandedActivity === listing.id && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-sm font-semibold text-gray-700">Dealer Activity Log</h4>
                  </div>

                  {loadingActivity === listing.id ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                      Loading activity...
                    </div>
                  ) : (activityData[listing.id] || []).length === 0 ? (
                    <p className="text-sm text-gray-400 py-3">No activity recorded yet for this listing.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {(activityData[listing.id] || []).map((act: any) => (
                        <div key={act.id} className="flex items-center gap-3 py-2 px-3 bg-white rounded-lg border border-gray-100">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border ${getActivityColor(act.action)}`}>
                            {getActivityIcon(act.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800 truncate">{act.dealership?.name || 'Unknown Dealer'}</span>
                              {act.dealership?.city && (
                                <span className="text-[10px] text-gray-400">{act.dealership.city}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{getActivityLabel(act.action)}</p>
                          </div>
                          <span className="text-[11px] text-gray-400 flex-shrink-0 tabular-nums">{formatActivityDate(act.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Express Interest Modal — portalled to body to escape stacking context */}
      {showInterestModal && selectedListing && createPortal(
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Express Interest</h3>
                <button
                  onClick={() => { setShowInterestModal(false); setOfferPrice(''); setMessage(''); }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {selectedListing.year} {selectedListing.make} {selectedListing.model}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Your Offer Price (Optional)
                </label>
                <Input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder={`Asking: NAD ${selectedListing.price.toLocaleString()}`}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Message to Seller (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030] text-sm transition-all resize-none"
                  placeholder="Introduce yourself and your dealership..."
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller Contact</p>
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">{selectedListing.userName}</p>
                  <p className="text-gray-500">{selectedListing.userEmail}</p>
                  <p className="text-gray-500">{selectedListing.userPhone}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleExpressInterest}
                  disabled={submitting}
                  className="flex-1 h-11 flex items-center justify-center gap-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#CB2030' }}
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Heart className="w-4 h-4" /> Express Interest</>
                  )}
                </button>
                <button
                  onClick={() => { setShowInterestModal(false); setOfferPrice(''); setMessage(''); }}
                  disabled={submitting}
                  className="px-4 h-11 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Vehicle Details Modal — portalled to body to escape stacking context */}
      {showDetailsModal && selectedListing && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Sticky header */}
            <div className="flex-shrink-0 border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#CB2030' }}>
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedListing.year} {selectedListing.make} {selectedListing.model}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="uppercase tracking-wide font-medium">{selectedListing.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{selectedListing.condition || 'Used'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-2">
                  <p className="text-2xl font-black tabular-nums" style={{ color: '#CB2030' }}>NAD {selectedListing.price.toLocaleString()}</p>
                  {selectedListing.negotiable && <span className="text-xs text-gray-500">Negotiable</span>}
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain" ref={detailsScrollRef}>
              {/* At-a-glance strip — always visible near top */}
              <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
                {[
                  selectedListing.year && { label: 'Year', value: selectedListing.year },
                  selectedListing.mileage && { label: 'Mileage', value: `${Number(selectedListing.mileage).toLocaleString()} km` },
                  selectedListing.transmission && { label: 'Trans.', value: selectedListing.transmission },
                  selectedListing.fuelType && { label: 'Fuel', value: selectedListing.fuelType },
                  selectedListing.color && { label: 'Color', value: selectedListing.color },
                  selectedListing.status && { label: 'Status', value: selectedListing.status },
                ].filter(Boolean).map((spec: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{spec.label}:</span>
                    <span className="text-xs font-semibold text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {/* Specs grid */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Specifications</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Year', value: selectedListing.year, icon: <Calendar className="w-4 h-4" /> },
                      selectedListing.mileage ? { label: 'Mileage', value: `${selectedListing.mileage.toLocaleString()} km`, icon: <Gauge className="w-4 h-4" /> } : null,
                      selectedListing.transmission ? { label: 'Transmission', value: selectedListing.transmission, icon: <Settings className="w-4 h-4" /> } : null,
                      selectedListing.fuelType ? { label: 'Fuel Type', value: selectedListing.fuelType, icon: <Fuel className="w-4 h-4" /> } : null,
                      selectedListing.color ? { label: 'Color', value: selectedListing.color } : null,
                      selectedListing.vin ? { label: 'VIN', value: selectedListing.vin } : null,
                      selectedListing.registrationNo ? { label: 'Reg. No', value: selectedListing.registrationNo } : null,
                    ].filter(Boolean).map((spec: any, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg px-4 py-3">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">{spec.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedListing.description && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedListing.description}</p>
                  </div>
                )}

                {/* Image gallery — placed after specs so specs are visible on open */}
                {selectedListing.images && selectedListing.images.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Photos</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
                      {selectedListing.images.map((image: string, index: number) => (
                        <div key={index} className="flex-shrink-0 rounded-lg overflow-hidden border border-gray-200" style={{ width: selectedListing.images.length === 1 ? '100%' : '240px' }}>
                          <img
                            src={image}
                            alt={`${selectedListing.make} ${selectedListing.model} - ${index + 1}`}
                            className="w-full h-36 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Vehicle History</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedListing.hasAccident !== null && (
                      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${selectedListing.hasAccident ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
                        {selectedListing.hasAccident ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase">Accident</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedListing.hasAccident ? 'Yes' : 'None'}</p>
                        </div>
                      </div>
                    )}
                    {selectedListing.serviceHistory !== null && (
                      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${selectedListing.serviceHistory ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase">Service History</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedListing.serviceHistory ? 'Available' : 'None'}</p>
                        </div>
                      </div>
                    )}
                    {selectedListing.numberOfOwners && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase">Owners</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedListing.numberOfOwners}</p>
                        </div>
                      </div>
                    )}
                    {selectedListing.availableForTest !== null && (
                      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${selectedListing.availableForTest ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                        <Car className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase">Test Drive</p>
                          <p className="text-sm font-semibold text-gray-800">{selectedListing.availableForTest ? 'Available' : 'No'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Seller — side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Location</h4>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{selectedListing.city && selectedListing.region ? `${selectedListing.city}, ${selectedListing.region}` : selectedListing.city || selectedListing.region || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Seller</h4>
                    <p className="text-sm font-semibold text-gray-900">{selectedListing.userName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedListing.userEmail}</p>
                    <p className="text-xs text-gray-500">{selectedListing.userPhone}</p>
                  </div>
                </div>

                {/* Activity log in detail modal */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dealer Activity Log</h4>
                  {loadingDetailActivities ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                      Loading activity...
                    </div>
                  ) : detailActivities.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <History className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No dealer activity recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                      {detailActivities.map((act: any) => (
                        <div key={act.id} className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${getActivityColor(act.action)}`}>
                            {getActivityIcon(act.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-800 truncate">{act.dealership?.name || 'Unknown'}</span>
                              {act.dealership?.city && (
                                <span className="text-[10px] text-gray-400 flex-shrink-0">{act.dealership.city}</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{getActivityLabel(act.action)}{act.user?.name ? ` by ${act.user.name}` : ''}</p>
                          </div>
                          <span className="text-[11px] text-gray-400 flex-shrink-0 tabular-nums">{formatActivityDate(act.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky footer actions */}
            <div className="flex-shrink-0 border-t border-gray-100 bg-white px-6 py-4 flex items-center gap-3">
              {!selectedListing.hasExpressedInterest && (
                <button
                  onClick={() => { setShowDetailsModal(false); setShowInterestModal(true); }}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: '#CB2030' }}
                >
                  <Heart className="w-4 h-4" />
                  Express Interest
                </button>
              )}
              <button
                onClick={() => handleCall(selectedListing)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button
                onClick={() => handleEmail(selectedListing)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={() => handleWhatsApp(selectedListing)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="ml-auto px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


function DealerDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
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
  const [inventorySortBy, setInventorySortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low' | 'most-views'>('newest');
  const [inventoryView, setInventoryView] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Lead detail state
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [leadResponse, setLeadResponse] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('ALL');
  const [leadMessages, setLeadMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionCursorPos, setMentionCursorPos] = useState(0);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
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
  const [teamMembers, setTeamMembers] = useState<any[]>([]); // Using real data from database

  // New user management modals
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditPermissionsModal, setShowEditPermissionsModal] = useState(false);
  const [showSuspendUserModal, setShowSuspendUserModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: '' });
  const [suspendReason, setSuspendReason] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [dealership, setDealership] = useState<any>(mockDealership);
  const [dealershipLoading, setDealershipLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // Featured request state
  const [selectedFeaturedDuration, setSelectedFeaturedDuration] = useState<number | null>(null);
  const [featuredRequestNotes, setFeaturedRequestNotes] = useState('');
  const [submittingFeaturedRequest, setSubmittingFeaturedRequest] = useState(false);
  const [featuredRequests, setFeaturedRequests] = useState<any[]>([]);

  // Featured listing request state
  const [showFeaturedListingModal, setShowFeaturedListingModal] = useState(false);
  const [selectedVehicleForFeatured, setSelectedVehicleForFeatured] = useState<any>(null);
  const [selectedListingDuration, setSelectedListingDuration] = useState<number | null>(null);
  const [featuredListingNotes, setFeaturedListingNotes] = useState('');
  const [submittingListingRequest, setSubmittingListingRequest] = useState(false);
  const [featuredListingRequests, setFeaturedListingRequests] = useState<any[]>([]);

  // Deal/promotion state
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedVehicleForDeal, setSelectedVehicleForDeal] = useState<any>(null);
  const [dealPrice, setDealPrice] = useState('');
  const [dealTitle, setDealTitle] = useState('');
  const [dealBadge, setDealBadge] = useState('HOT DEAL');
  const [dealEndDate, setDealEndDate] = useState('');
  const [submittingDeal, setSubmittingDeal] = useState(false);

  // Fetch dealership data
  useEffect(() => {
    const fetchDealership = async () => {
      try {
        const response = await fetch('/api/dealer/dealership');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.dealership) {
            setDealership(data.dealership);
          }
        }
      } catch (error) {
        console.error('Error fetching dealership:', error);
      } finally {
        setDealershipLoading(false);
      }
    };

    fetchDealership();
  }, []);

  // State for vehicles loaded from REST API
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);

  // Invoices state
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => { if (data.invoices) setInvoices(data.invoices); })
      .catch(() => {})
      .finally(() => setInvoicesLoading(false));
  }, []);

  const handleInvoiceDownload = async (invoice: any) => {
    if (!invoice.pdfPath) return;
    setDownloadingInvoice(invoice.id);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/pdf`);
      if (!res.ok) { showToast({ title: 'Error', description: 'PDF not available. Please contact support.', variant: 'error' }); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${invoice.invoiceNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { showToast({ title: 'Error', description: 'Failed to download PDF. Please try again.', variant: 'error' }); }
    finally { setDownloadingInvoice(null); }
  };

  const INVOICE_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const invoiceStatusCfg: Record<string, { label: string; classes: string }> = {
    PENDING:   { label: 'Pending',   classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    OVERDUE:   { label: 'Overdue',   classes: 'bg-red-100 text-red-800 border-red-200' },
    PAID:      { label: 'Paid',      classes: 'bg-green-100 text-green-800 border-green-200' },
    CANCELLED: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
  };
  const formatNAD = (n: number) => `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const daysOverdue = (dueDate: string) => Math.floor((Date.now() - new Date(dueDate).getTime()) / 86400000);
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');
  const totalOwed = invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((s, i) => s + i.totalAmount, 0);

  // tRPC queries for leads and stats
  const { data: leadData, isLoading: leadsLoading, error: leadsError } = api.lead.getByDealership.useQuery({
    limit: 50,
  });

  const { data: leadStats, isLoading: statsLoading } = api.lead.getStats.useQuery({});

  const leads = leadData?.leads || [];

  // Fetch vehicles from REST API
  useEffect(() => {
    const fetchVehicles = async () => {
      if (status === 'loading' || !session) return;

      try {
        setVehiclesLoading(true);
        const response = await fetch('/api/dealer/vehicles');

        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }

        const data = await response.json();

        if (data.success && data.vehicles) {
          setVehicles(data.vehicles);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehiclesError('Failed to load vehicles');
      } finally {
        setVehiclesLoading(false);
      }
    };

    fetchVehicles();
  }, [session, status]);

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
    if (tab && ['overview', 'inventory', 'leads', 'listings', 'analytics', 'users', 'profile', 'sales-profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch featured requests
  useEffect(() => {
    const fetchFeaturedRequests = async () => {
      try {
        const response = await fetch('/api/dealer/featured-request');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFeaturedRequests(data.requests);
          }
        }
      } catch (error) {
        console.error('Error fetching featured requests:', error);
      }
    };

    if (session?.user?.dealershipId) {
      fetchFeaturedRequests();
    }
  }, [session]);

  // Fetch featured listing requests
  useEffect(() => {
    const fetchFeaturedListingRequests = async () => {
      try {
        const response = await fetch('/api/dealer/featured-listing');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFeaturedListingRequests(data.requests);
          }
        }
      } catch (error) {
        console.error('Error fetching featured listing requests:', error);
      }
    };

    if (session?.user?.dealershipId) {
      fetchFeaturedListingRequests();
    }
  }, [session]);

  // Compute notifications from leads data (memoized to prevent infinite loops)
  const newLeadsList = leads.filter((lead: any) => lead.status === 'NEW');
  const newLeadsForNotification = newLeadsList.slice(0, 10);
  const newLeadsCount = leadStats?.new || newLeadsList.length;

  // Navigate to leads tab when clicking a notification
  const handleNotificationClick = () => {
    setActiveTab('leads');
    setShowNotifications(false);
  };

  // Handle opening lead detail
  const handleViewLead = async (lead: any) => {
    setSelectedLead(lead);
    setLeadResponse('');
    setShowLeadDetail(true);
    setLoadingMessages(true);
    setShowMentionDropdown(false);

    // Fetch messages and team members in parallel
    try {
      const [messagesRes, teamRes] = await Promise.all([
        fetch(`/api/dealer/leads?leadId=${lead.id}`),
        teamMembers.length === 0 ? fetch('/api/dealer/users') : Promise.resolve(null),
      ]);

      if (messagesRes.ok) {
        const data = await messagesRes.json();
        setLeadMessages(data.lead?.messages || []);
      }

      if (teamRes && teamRes.ok) {
        const teamData = await teamRes.json();
        setTeamMembers(teamData.users || []);
      }
    } catch (error) {
      console.error('Error fetching lead data:', error);
      setLeadMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handle sending response to a lead
  const handleSendLeadResponse = async () => {
    if (!selectedLead || !leadResponse.trim()) return;

    setSendingResponse(true);
    try {
      // Send email response to customer
      const response = await fetch('/api/lead-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          customerEmail: selectedLead.customerEmail,
          customerName: selectedLead.customerName,
          message: leadResponse,
          dealershipName: dealership?.name,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Add the new message to the conversation thread
        const newMessage = result.leadMessage || {
          id: Date.now().toString(),
          content: leadResponse,
          senderType: 'DEALERSHIP',
          senderName: session?.user?.name || 'You',
          createdAt: new Date().toISOString(),
          emailSent: result.emailSent,
        };
        setLeadMessages(prev => [...prev, newMessage]);

        // Update the selected lead status
        setSelectedLead((prev: any) => ({ ...prev, status: 'CONTACTED' }));

        // Show success message using toast
        showToast({
          title: result.emailSent ? 'Response Sent' : 'Response Saved',
          description: result.emailSent ? 'Response sent and email delivered!' : 'Response saved (email delivery pending)',
          variant: result.emailSent ? 'success' : 'info',
        });
        setLeadResponse('');
      } else {
        const error = await response.json();
        showToast({ title: 'Error', description: `Failed to send response: ${error.error || 'Unknown error'}`, variant: 'error' });
      }
    } catch (error) {
      console.error('Error sending response:', error);
      showToast({ title: 'Error', description: 'Failed to send response. Please try again.', variant: 'error' });
    } finally {
      setSendingResponse(false);
    }
  };

  // Handle updating lead status
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/dealer/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      if (response.ok) {
        // Update the selected lead status without page reload
        setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
        showToast({ title: 'Success', description: `Lead status updated to ${newStatus}`, variant: 'success' });
      } else {
        showToast({ title: 'Error', description: 'Failed to update status', variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      showToast({ title: 'Error', description: 'Failed to update status', variant: 'error' });
    }
  };

  // @mention helpers
  const handleLeadResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setLeadResponse(value);
    setMentionCursorPos(cursorPos);

    // Check if user is typing an @mention
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1].toLowerCase());
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
      setMentionQuery('');
    }
  };

  const insertMention = (member: { id: string; name: string }) => {
    const textBeforeCursor = leadResponse.substring(0, mentionCursorPos);
    const textAfterCursor = leadResponse.substring(mentionCursorPos);
    // Find the @ trigger position
    const atIndex = textBeforeCursor.lastIndexOf('@');
    const before = leadResponse.substring(0, atIndex);
    const after = textAfterCursor;
    const mention = `@[${member.name}](${member.id}) `;
    setLeadResponse(before + mention + after);
    setShowMentionDropdown(false);
    setMentionQuery('');
  };

  const filteredTeamMembers = teamMembers.filter(
    (m: any) => m.id !== (session?.user as any)?.id &&
      (mentionQuery === '' || m.name?.toLowerCase().includes(mentionQuery))
  );

  // Render message content with styled @mentions
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(@\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const mentionMatch = part.match(/@\[([^\]]+)\]\(([^)]+)\)/);
      if (mentionMatch) {
        return (
          <span key={i} className="inline-flex items-center bg-[#CB2030]/10 text-[#CB2030] font-medium rounded px-1 -mx-0.5">
            @{mentionMatch[1]}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

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
      case 'NEW': return 'bg-[#CB2030]/10 text-[#CB2030]';
      case 'CONTACTED': return 'bg-amber-100 text-amber-700';
      case 'INTERESTED': return 'bg-emerald-100 text-emerald-700';
      case 'QUALIFIED': return 'bg-emerald-100 text-emerald-700';
      case 'CONVERTED': return 'bg-indigo-100 text-indigo-600';
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

  // Handle vehicle deletion - open confirmation modal
  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setShowDeleteModal(true);
  };

  // Confirm vehicle deletion
  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      const response = await fetch(`/api/dealer/vehicles/${vehicleToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh vehicles list
        const fetchResponse = await fetch('/api/dealer/vehicles');
        const data = await fetchResponse.json();
        if (data.success && data.vehicles) {
          setVehicles(data.vehicles);
        }
        // Close modal and reset
        setShowDeleteModal(false);
        setVehicleToDelete(null);
        showToast({ title: 'Success', description: 'Vehicle deleted successfully', variant: 'success' });
      } else {
        showToast({ title: 'Error', description: 'Failed to delete vehicle. Please try again.', variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      showToast({ title: 'Error', description: 'An error occurred while deleting the vehicle.', variant: 'error' });
    }
  };

  // Handle featured request submission
  const handleSubmitFeaturedRequest = async () => {
    if (!selectedFeaturedDuration) return;

    setSubmittingFeaturedRequest(true);
    try {
      const response = await fetch('/api/dealer/featured-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration: selectedFeaturedDuration,
          notes: featuredRequestNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh featured requests list
        const fetchResponse = await fetch('/api/dealer/featured-request');
        const fetchData = await fetchResponse.json();
        if (fetchData.success) {
          setFeaturedRequests(fetchData.requests);
        }

        // Reset form
        setSelectedFeaturedDuration(null);
        setFeaturedRequestNotes('');

        showToast({ title: 'Request Submitted', description: 'Featured request submitted successfully! Our team will review it shortly.', variant: 'success' });
      } else {
        showToast({ title: 'Error', description: data.error || 'Failed to submit featured request. Please try again.', variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting featured request:', error);
      showToast({ title: 'Error', description: 'An error occurred while submitting your request.', variant: 'error' });
    } finally {
      setSubmittingFeaturedRequest(false);
    }
  };

  // Handle featured listing request submission
  const handleSubmitListingRequest = async () => {
    if (!selectedVehicleForFeatured || !selectedListingDuration) return;

    setSubmittingListingRequest(true);
    try {
      const response = await fetch('/api/dealer/featured-listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: selectedVehicleForFeatured.id,
          duration: selectedListingDuration,
          notes: featuredListingNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh featured listing requests
        const fetchResponse = await fetch('/api/dealer/featured-listing');
        const fetchData = await fetchResponse.json();
        if (fetchData.success) {
          setFeaturedListingRequests(fetchData.requests);
        }

        // Close modal and reset form
        setShowFeaturedListingModal(false);
        setSelectedVehicleForFeatured(null);
        setSelectedListingDuration(null);
        setFeaturedListingNotes('');

        showToast({ title: 'Request Submitted', description: 'Featured listing request submitted successfully! Our team will review it shortly.', variant: 'success' });
      } else {
        showToast({ title: 'Error', description: data.error || 'Failed to submit featured listing request. Please try again.', variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting featured listing request:', error);
      showToast({ title: 'Error', description: 'An error occurred while submitting your request.', variant: 'error' });
    } finally {
      setSubmittingListingRequest(false);
    }
  };

  // Handle deal submission
  const handleSubmitDeal = async () => {
    if (!selectedVehicleForDeal || !dealPrice) return;

    const discountedPrice = parseFloat(dealPrice);
    if (isNaN(discountedPrice) || discountedPrice <= 0) {
      showToast({ title: 'Invalid Price', description: 'Please enter a valid deal price', variant: 'warning' });
      return;
    }

    if (discountedPrice >= selectedVehicleForDeal.price) {
      showToast({ title: 'Invalid Price', description: 'Deal price must be lower than the original price', variant: 'warning' });
      return;
    }

    setSubmittingDeal(true);
    try {
      const response = await fetch(`/api/dealer/vehicles/${selectedVehicleForDeal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPrice: selectedVehicleForDeal.price,
          price: discountedPrice,
          dealActive: true,
          dealTitle: dealTitle || null,
          dealBadge: dealBadge || null,
          dealEndDate: dealEndDate ? new Date(dealEndDate).toISOString() : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh vehicles list
        const fetchResponse = await fetch('/api/dealer/vehicles');
        const fetchData = await fetchResponse.json();
        if (fetchData.success && fetchData.vehicles) {
          setVehicles(fetchData.vehicles);
        }

        // Close modal and reset form
        setShowDealModal(false);
        setSelectedVehicleForDeal(null);
        setDealPrice('');
        setDealTitle('');
        setDealBadge('HOT DEAL');
        setDealEndDate('');

        showToast({ title: 'Success', description: 'Deal created successfully!', variant: 'success' });
      } else {
        showToast({ title: 'Error', description: data.error || 'Failed to create deal. Please try again.', variant: 'error' });
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      showToast({ title: 'Error', description: 'An error occurred while creating the deal.', variant: 'error' });
    } finally {
      setSubmittingDeal(false);
    }
  };

  // Handle remove deal
  const handleRemoveDeal = async () => {
    if (!selectedVehicleForDeal) return;

    setSubmittingDeal(true);
    try {
      const response = await fetch(`/api/dealer/vehicles/${selectedVehicleForDeal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: selectedVehicleForDeal.originalPrice || selectedVehicleForDeal.price,
          originalPrice: null,
          dealActive: false,
          dealTitle: null,
          dealBadge: null,
          dealEndDate: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh vehicles list
        const fetchResponse = await fetch('/api/dealer/vehicles');
        const fetchData = await fetchResponse.json();
        if (fetchData.success && fetchData.vehicles) {
          setVehicles(fetchData.vehicles);
        }

        // Close modal and reset form
        setShowDealModal(false);
        setSelectedVehicleForDeal(null);
        setDealPrice('');
        setDealTitle('');
        setDealBadge('HOT DEAL');
        setDealEndDate('');

        showToast({ title: 'Success', description: 'Deal removed successfully!', variant: 'success' });
      } else {
        showToast({ title: 'Error', description: data.error || 'Failed to remove deal. Please try again.', variant: 'error' });
      }
    } catch (error) {
      console.error('Error removing deal:', error);
      showToast({ title: 'Error', description: 'An error occurred while removing the deal.', variant: 'error' });
    } finally {
      setSubmittingDeal(false);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchTerm !== '' || statusFilter !== 'ALL' || categoryFilter !== 'ALL' ||
           manufacturerFilter !== 'ALL' || transmissionFilter !== 'ALL' || fuelTypeFilter !== 'ALL' ||
           minPrice !== '' || maxPrice !== '' || minYear !== '' || maxYear !== '';
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    // Handle both 'make' and 'manufacturer' field names, and ensure values are not null/undefined
    const make = vehicle.make || vehicle.manufacturer || '';
    const model = vehicle.model || '';
    const year = vehicle.year || '';
    const status = vehicle.status || '';
    const category = vehicle.category || '';
    const transmission = vehicle.transmission || '';
    const fuelType = vehicle.fuelType || '';
    const price = vehicle.price || 0;

    const matchesSearch = make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         year.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || category === categoryFilter;
    const matchesManufacturer = manufacturerFilter === 'ALL' || make === manufacturerFilter;
    const matchesTransmission = transmissionFilter === 'ALL' || transmission === transmissionFilter;
    const matchesFuelType = fuelTypeFilter === 'ALL' || fuelType === fuelTypeFilter;

    const matchesPriceRange = (!minPrice || price >= parseFloat(minPrice)) &&
                              (!maxPrice || price <= parseFloat(maxPrice));
    const matchesYearRange = (!minYear || parseInt(year.toString()) >= parseInt(minYear)) &&
                             (!maxYear || parseInt(year.toString()) <= parseInt(maxYear));

    return matchesSearch && matchesStatus && matchesCategory && matchesManufacturer &&
           matchesTransmission && matchesFuelType && matchesPriceRange && matchesYearRange;
  }).sort((a, b) => {
    switch (inventorySortBy) {
      case 'newest': return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'oldest': return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'most-views': return (b.views || 0) - (a.views || 0);
      default: return 0;
    }
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
    showToast({ title: 'Success', description: 'Vehicle added successfully!', variant: 'success' });
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
    const inviteId = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,'0')).join('');
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
    showToast({ title: 'Success', description: 'User information updated successfully!', variant: 'success' });
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
    showToast({ title: 'Success', description: 'Permissions updated successfully!', variant: 'success' });
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
    showToast({ title: 'Success', description: 'User suspended successfully!', variant: 'success' });
  };

  const handleUnsuspendUser = (userId: string) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId
        ? { ...member, status: 'ACTIVE', suspendReason: undefined }
        : member
    ));
    showToast({ title: 'Success', description: 'User unsuspended successfully!', variant: 'success' });
  };

  const handleSendPasswordReset = (user: any) => {
    setSelectedUser(user);
    setShowPasswordResetModal(true);
  };

  const handleConfirmPasswordReset = () => {
    // Generate password reset link
    const resetLink = `https://cars.na/reset-password?token=${Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,'0')).join('')}&email=${selectedUser.email}`;
    navigator.clipboard.writeText(resetLink);
    setShowPasswordResetModal(false);
    setSelectedUser(null);
    showToast({
      title: 'Password Reset Link Generated',
      description: `Link copied to clipboard and sent to ${selectedUser.email}`,
      variant: 'success'
    });
  };

  const handleResendInvite = (user: any) => {
    const inviteLink = `https://cars.na/dealer/accept-invite?token=${Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2,'0')).join('')}&email=${user.email}`;
    showToast({
      title: 'Invite Resent',
      description: `Invite link sent to ${user.email}`,
      variant: 'success'
    });
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
    showToast({ title: 'Copied', description: 'Invite link copied to clipboard!', variant: 'success' });
  };

  if (status === 'loading' || vehiclesLoading || leadsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CB2030] mx-auto"></div>
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
            className="px-4 py-2 text-white rounded hover:opacity-90"
            style={{ background: '#CB2030' }}
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <InvoiceReminderModal />
    <div className="fixed inset-0 bg-gray-50 flex overflow-hidden">
      {/* Sidebar Navigation - Inspired by professional dealer systems */}
      <div className="w-56 bg-white border-r border-gray-100 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center">
            <Car className="h-7 w-7 mr-3" style={{ color: '#CB2030' }} />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Cars.na</h1>
              <p className="text-sm text-gray-600">Dealer Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Main Menu</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleTabSwitch('overview')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                Dashboard Overview
                {isLoading && activeTab === 'overview' && (
                  <div className="ml-auto w-4 h-4 border-2 border-[#CB2030] border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
              
              <button
                onClick={() => handleTabSwitch('inventory')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'inventory'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
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
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'leads'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Users className="h-4 w-4 mr-3" />
                Lead Manager
                {newLeads > 0 && activeTab !== 'leads' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{newLeads}</span>
                )}
              </button>

              <button
                onClick={() => handleTabSwitch('listings')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'listings'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Tag className="h-4 w-4 mr-3" />
                Vehicle Listings
              </button>

              <button
                onClick={() => handleTabSwitch('analytics')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
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
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'subscription'
                      ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Subscription
                  <Crown className="h-3 w-3 ml-auto text-yellow-500" />
                </button>
              )}

              {/* Billing tab - only visible to dealership principals */}
              {isDealershipPrincipal && (
                <button
                  onClick={() => handleTabSwitch('billing')}
                  disabled={isLoading}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'billing'
                      ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Billing &amp; Invoices
                  {overdueInvoices.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{overdueInvoices.length}</span>
                  )}
                </button>
              )}

              {/* User Management tab - only visible to dealership principals */}
              {isDealershipPrincipal && (
                <button
                  onClick={() => handleTabSwitch('users')}
                  disabled={isLoading}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'users'
                      ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                      : 'text-gray-600 hover:bg-gray-50'
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
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">Website</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleTabSwitch('profile')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Website Manager
              </button>
              <button
                onClick={() => handleTabSwitch('sales-profile')}
                disabled={isLoading}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'sales-profile'
                    ? 'bg-red-50 text-[#CB2030] border-l-2 border-[#CB2030]'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <UserCheck className="h-4 w-4 mr-3" />
                My Sales Profile
              </button>
            </div>
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ background: '#CB2030' }}>
              {dealership?.name?.charAt(0) || 'D'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{dealership?.name || 'Loading...'}</p>
              <p className="text-xs text-gray-500">{dealership?.subscription?.plan?.name || 'Free Plan'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'inventory' && 'Stock Manager'}
                {activeTab === 'leads' && 'Lead Manager'}
                {activeTab === 'listings' && 'Vehicle Listings'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'subscription' && 'Subscription Management'}
                {activeTab === 'billing' && 'Billing & Invoices'}
                {activeTab === 'users' && 'Team Management'}
                {activeTab === 'profile' && 'Website Manager'}
                {activeTab === 'sales-profile' && 'My Sales Profile'}
              </h1>
              <p className="text-xs text-gray-400">
                {activeTab === 'overview' && 'Monitor your dealership performance'}
                {activeTab === 'inventory' && 'Manage your vehicle inventory'}
                {activeTab === 'leads' && 'Track and manage customer inquiries'}
                {activeTab === 'listings' && 'Browse vehicles for sale from users'}
                {activeTab === 'analytics' && 'View detailed performance metrics'}
                {activeTab === 'subscription' && 'Manage your subscription and billing'}
                {activeTab === 'billing' && 'View and download your monthly invoices'}
                {activeTab === 'users' && 'Manage your dealership team members'}
                {activeTab === 'profile' && 'Update your dealership information'}
                {activeTab === 'sales-profile' && 'Manage your personal sales profile'}
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

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <Bell className="h-5 w-5 text-gray-600 hover:text-[#CB2030]" />
                  {newLeadsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1 animate-pulse">
                      {newLeadsCount > 99 ? '99+' : newLeadsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <>
                    {/* Backdrop to close on click outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-[#CB2030]" />
                          <h3 className="font-semibold text-gray-900">New Leads</h3>
                          {newLeadsCount > 0 && (
                            <Badge variant="secondary" className="bg-red-100 text-[#CB2030]">
                              {newLeadsCount} new
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {leadsLoading ? (
                          <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-[#CB2030] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Loading...</p>
                          </div>
                        ) : newLeadsForNotification.length === 0 ? (
                          <div className="p-8 text-center">
                            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No new leads</p>
                            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {newLeadsForNotification.map((lead: any) => (
                              <button
                                key={lead.id}
                                onClick={handleNotificationClick}
                                className="w-full p-4 hover:bg-red-50 transition-colors text-left flex items-start gap-3"
                              >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(203,32,48,0.08)' }}>
                                  <Users className="h-5 w-5 text-[#CB2030]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-gray-900 truncate">
                                      {lead.customerName || 'New Lead'}
                                    </p>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                      {new Date(lead.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {lead.vehicle && (
                                    <p className="text-sm text-gray-700 truncate">
                                      Interested in: {lead.vehicle.year} {lead.vehicle.make} {lead.vehicle.model}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500 truncate mt-0.5">
                                    {lead.message?.substring(0, 60) || lead.customerEmail || 'New inquiry'}
                                  </p>
                                  {lead.source && (
                                    <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                      {lead.source.replace('_', ' ')}
                                    </span>
                                  )}
                                </div>
                                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#CB2030' }}></div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setActiveTab('leads');
                            setShowNotifications(false);
                          }}
                          className="w-full text-center text-sm font-medium hover:underline" style={{ color: '#CB2030' }}
                        >
                          View all leads →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {activeTab === 'inventory' && (
                <Button 
                  onClick={handleAddVehicle}
                  className="hover:opacity-90 hover:scale-105 transition-all duration-200 text-white"
                  style={{ background: '#CB2030' }}
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
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#CB2030', borderTopColor: 'transparent' }}></div>
                <p className="text-sm text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-5">

                {/* Overdue Invoice Alert */}
                {overdueInvoices.length > 0 && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-800">
                          {overdueInvoices.length === 1
                            ? `Invoice ${overdueInvoices[0].invoiceNumber} is ${daysOverdue(overdueInvoices[0].dueDate)} days overdue`
                            : `${overdueInvoices.length} invoices are overdue — total ${formatNAD(overdueInvoices.reduce((s, i) => s + i.totalAmount, 0))}`}
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">Overdue invoices may restrict your account. Pay now to restore full access.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTabSwitch('billing')}
                      className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      View Invoices
                    </button>
                  </div>
                )}

                {/* Welcome Banner */}
                <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                  <div className="h-0.5 w-full" style={{ background: '#CB2030' }} />
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Dealer Portal</p>
                        <h2 className="text-gray-900 text-xl font-bold truncate">{dealership?.name || 'Your Dealership'}</h2>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {newLeads > 0 ? `${newLeads} new lead${newLeads > 1 ? 's' : ''} waiting for your attention` : 'All leads up to date — great work!'}
                        </p>
                      </div>
                      {/* Subscription badge */}
                      <div className="shrink-0 text-right hidden sm:block">
                        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
                          <Crown className="h-3 w-3" style={{ color: '#CB2030' }} />
                          {dealership?.subscription?.plan?.name || 'Free Plan'}
                        </div>
                        {dealership?.subscription?.plan?.maxListings && (
                          <div>
                            <p className="text-gray-400 text-xs">{availableVehicles} of {dealership.subscription.plan.maxListings} listings used</p>
                            <div className="w-32 bg-gray-100 rounded-full h-1 mt-1">
                              <div
                                className="h-1 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (availableVehicles / dealership.subscription.plan.maxListings) * 100)}%`, background: '#CB2030' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Quick actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => handleTabSwitch('inventory')}
                        className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer border border-gray-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Vehicle
                      </button>
                      <button
                        onClick={() => handleTabSwitch('leads')}
                        className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer border border-gray-200"
                      >
                        <Users className="h-3.5 w-3.5" />
                        View Leads
                      </button>
                      <button
                        onClick={() => handleTabSwitch('analytics')}
                        className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer border border-gray-200"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                        Analytics
                      </button>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Vehicles */}
                  {vehiclesLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="h-1 w-full bg-gray-100" />
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
                          <div className="w-14 h-5 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                        <div className="w-16 h-9 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="w-24 h-3 bg-gray-100 rounded-full animate-pulse" />
                        <div className="w-20 h-3 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleTabSwitch('inventory')}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(203,32,48,0.08)' }}>
                            <Car style={{ color: '#CB2030', width: '18px', height: '18px' }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{availableVehicles} active</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900 tabular-nums">{totalVehicles}</div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Total Vehicles</p>
                        <p className="text-xs text-gray-400 mt-2">{soldVehicles} sold · {vehicles.filter(v => v.status === 'PENDING').length} pending</p>
                      </div>
                    </div>
                  )}

                  {/* Total Views */}
                  {vehiclesLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="h-1 w-full bg-gray-100" />
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
                          <div className="w-12 h-5 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                        <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="w-24 h-3 bg-gray-100 rounded-full animate-pulse" />
                        <div className="w-28 h-3 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50">
                            <Eye className="text-emerald-600" style={{ width: '18px', height: '18px' }} />
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900 tabular-nums">{totalViews.toLocaleString()}</div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Total Views</p>
                        <p className="text-xs text-gray-400 mt-2">{totalVehicles > 0 ? Math.round(totalViews / totalVehicles) : 0} avg per listing</p>
                      </div>
                    </div>
                  )}

                  {/* Inquiries */}
                  {leadsLoading || statsLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="h-1 w-full bg-gray-100" />
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
                          <div className="w-12 h-5 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                        <div className="w-12 h-9 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="w-20 h-3 bg-gray-100 rounded-full animate-pulse" />
                        <div className="w-28 h-3 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleTabSwitch('leads')}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50">
                            <MessageCircle className="text-amber-500" style={{ width: '18px', height: '18px' }} />
                          </div>
                          {newLeads > 0 && (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{newLeads} new</span>
                          )}
                        </div>
                        <div className="text-4xl font-black text-gray-900 tabular-nums">{totalInquiries}</div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Inquiries</p>
                        <p className="text-xs text-gray-400 mt-2">{leadStats?.converted || 0} converted to sales</p>
                      </div>
                    </div>
                  )}

                  {/* Stock Value */}
                  {vehiclesLoading ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="h-1 w-full bg-gray-100" />
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
                          <div className="w-14 h-5 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                        <div className="w-24 h-7 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="w-20 h-3 bg-gray-100 rounded-full animate-pulse" />
                        <div className="w-24 h-3 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50">
                            <CreditCard className="text-indigo-500" style={{ width: '18px', height: '18px' }} />
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {availableVehicles} listing{availableVehicles !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-gray-900 tabular-nums leading-tight">
                          {formatPrice(vehicles.filter(v => v.status === 'AVAILABLE').reduce((s, v) => s + (v.price || 0), 0))}
                        </div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1">Stock Value</p>
                        <p className="text-xs text-gray-400 mt-2">active inventory</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lead Pipeline + Inventory Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lead Pipeline */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Lead Pipeline</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Conversion funnel</p>
                      </div>
                      <button
                        onClick={() => handleTabSwitch('leads')}
                        className="text-xs font-semibold hover:underline cursor-pointer"
                        style={{ color: '#CB2030' }}
                      >
                        Manage →
                      </button>
                    </div>
                    {leadsLoading || statsLoading ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-20 h-2.5 bg-gray-100 rounded-full animate-pulse" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full animate-pulse" />
                            <div className="w-5 h-2.5 bg-gray-100 rounded-full animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[
                          { label: 'New', count: leadStats?.new || 0, color: 'bg-[#CB2030]' },
                          { label: 'Contacted', count: leadStats?.contacted || 0, color: 'bg-amber-400' },
                          { label: 'Qualified', count: leads.filter((l: any) => l.status === 'QUALIFIED').length, color: 'bg-emerald-400' },
                          { label: 'Converted', count: leadStats?.converted || 0, color: 'bg-indigo-500' },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${color} transition-all duration-700`}
                                style={{ width: totalInquiries > 0 ? `${Math.min(100, (count / totalInquiries) * 100)}%` : '0%' }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700 tabular-nums w-5 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {!leadsLoading && !statsLoading && totalInquiries > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Conversion rate</span>
                        <span className="text-xs font-bold text-gray-700 tabular-nums">{leadStats?.conversionRate ?? 0}%</span>
                      </div>
                    )}
                  </div>

                  {/* Inventory Breakdown */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Inventory</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Stock status breakdown</p>
                      </div>
                      <button
                        onClick={() => handleTabSwitch('inventory')}
                        className="text-xs font-semibold hover:underline cursor-pointer"
                        style={{ color: '#CB2030' }}
                      >
                        Manage →
                      </button>
                    </div>
                    {vehiclesLoading ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-20 h-2.5 bg-gray-100 rounded-full animate-pulse" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full animate-pulse" />
                            <div className="w-5 h-2.5 bg-gray-100 rounded-full animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[
                          { label: 'Available', count: availableVehicles, color: 'bg-emerald-400' },
                          { label: 'Sold', count: soldVehicles, color: 'bg-gray-400' },
                          { label: 'Pending', count: vehicles.filter(v => v.status === 'PENDING').length, color: 'bg-amber-400' },
                          { label: 'Reserved', count: vehicles.filter(v => v.status === 'RESERVED').length, color: 'bg-indigo-400' },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${color} transition-all duration-700`}
                                style={{ width: totalVehicles > 0 ? `${Math.min(100, (count / totalVehicles) * 100)}%` : '0%' }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700 tabular-nums w-5 text-right">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {!vehiclesLoading && totalVehicles > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Sell-through rate</span>
                        <span className="text-xs font-bold text-gray-700 tabular-nums">
                          {Math.round((soldVehicles / totalVehicles) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                  {/* Recent Leads — wider */}
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Recent Leads</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Latest customer inquiries</p>
                      </div>
                      <button
                        onClick={() => handleTabSwitch('leads')}
                        className="text-xs font-semibold hover:underline cursor-pointer"
                        style={{ color: '#CB2030' }}
                      >
                        View all →
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {leadsLoading ? (
                        [...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-3 bg-gray-100 rounded-full animate-pulse w-32" />
                              <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-48" />
                            </div>
                            <div className="w-14 h-5 bg-gray-100 rounded-full animate-pulse shrink-0" />
                          </div>
                        ))
                      ) : leads.slice(0, 4).length > 0 ? (
                        leads.slice(0, 4).map((lead: any) => (
                          <div
                            key={lead.id}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors cursor-pointer"
                            onClick={() => handleTabSwitch('leads')}
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: '#CB2030' }}
                            >
                              {lead.customerName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{lead.customerName}</p>
                              <p className="text-xs text-gray-400 truncate">
                                {lead.vehicle
                                  ? `${lead.vehicle.year} ${lead.vehicle.make || lead.vehicle.manufacturer} ${lead.vehicle.model}`
                                  : lead.source?.replace(/_/g, ' ')}
                              </p>
                            </div>
                            <Badge className={`${getLeadStatusColor(lead.status)} text-[10px] font-bold uppercase tracking-wide shrink-0`}>
                              {lead.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-2">
                            <Inbox className="h-5 w-5 text-gray-300" />
                          </div>
                          <p className="text-sm font-medium text-gray-400">No leads yet</p>
                          <p className="text-xs text-gray-300 mt-0.5">Leads will appear here when customers enquire</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Vehicles — narrower */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Top Vehicles</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Most viewed</p>
                      </div>
                      <button
                        onClick={() => handleTabSwitch('inventory')}
                        className="text-xs font-semibold hover:underline cursor-pointer"
                        style={{ color: '#CB2030' }}
                      >
                        Manage →
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {vehiclesLoading ? (
                        [...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-4 h-3 bg-gray-100 rounded animate-pulse shrink-0" />
                            <div className="w-9 h-9 bg-gray-100 rounded-lg animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-3 bg-gray-100 rounded-full animate-pulse w-28" />
                              <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-20" />
                            </div>
                            <div className="w-8 h-5 bg-gray-100 rounded animate-pulse shrink-0" />
                          </div>
                        ))
                      ) : [...vehicles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 4).length > 0 ? (
                        [...vehicles]
                          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                          .slice(0, 4)
                          .map((vehicle, idx) => (
                            <div key={vehicle.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                              <span className="text-xs font-black text-gray-200 w-4 shrink-0">#{idx + 1}</span>
                              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <img
                                  src={vehicle.images?.[0]?.url || ''}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">
                                  {vehicle.year} {vehicle.make || vehicle.manufacturer} {vehicle.model}
                                </p>
                                <p className="text-xs text-gray-400">{formatPrice(vehicle.price)}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-bold text-gray-700">{vehicle.viewCount || 0}</p>
                                <p className="text-[10px] text-gray-400">views</p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-2">
                            <Car className="h-5 w-5 text-gray-300" />
                          </div>
                          <p className="text-sm font-medium text-gray-400">No inventory yet</p>
                          <button
                            onClick={() => handleTabSwitch('inventory')}
                            className="text-xs font-semibold mt-2 hover:underline cursor-pointer"
                            style={{ color: '#CB2030' }}
                          >
                            + Add your first vehicle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-5">
                {/* Inventory Summary Bar */}
                {vehicles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Stock', value: vehicles.length, color: 'text-gray-900' },
                      { label: 'Available', value: vehicles.filter(v => v.status === 'AVAILABLE').length, color: 'text-emerald-600' },
                      { label: 'Reserved', value: vehicles.filter(v => v.status === 'RESERVED' || v.status === 'PENDING').length, color: 'text-amber-600' },
                      { label: 'Sold', value: vehicles.filter(v => v.status === 'SOLD').length, color: 'text-gray-500' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search and Filter Controls */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                  {/* Top Row */}
                  <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                    <div className="flex gap-2 items-center flex-wrap flex-1">
                      <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search make, model, year..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-9 text-sm border-gray-200"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030]"
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
                        className="h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030]"
                      >
                        <option value="ALL">All Categories</option>
                        <option value="CARS">Cars</option>
                        <option value="TRUCKS">Trucks</option>
                        <option value="MOTORCYCLES">Motorcycles</option>
                        <option value="BUSES">Buses</option>
                        <option value="INDUSTRIAL_MACHINERY">Industrial</option>
                        <option value="TRACTORS">Tractors</option>
                        <option value="BOATS">Boats</option>
                        <option value="ACCESSORIES">Accessories</option>
                      </select>
                      <select
                        value={manufacturerFilter}
                        onChange={(e) => setManufacturerFilter(e.target.value)}
                        className="h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030]"
                      >
                        <option value="ALL">All Makes</option>
                        {availableManufacturers.map((manufacturer, index) => (
                          <option key={`manufacturer-${manufacturer}-${index}`} value={manufacturer}>
                            {manufacturer}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="h-9 flex items-center gap-1.5 text-xs"
                      >
                        <Filter className="h-3.5 w-3.5" />
                        Filters
                        {hasActiveFilters() && (
                          <span className="ml-0.5 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center" style={{ background: '#CB2030' }}>
                            {[searchTerm, statusFilter !== 'ALL', categoryFilter !== 'ALL', manufacturerFilter !== 'ALL', transmissionFilter !== 'ALL', fuelTypeFilter !== 'ALL', minPrice, maxPrice, minYear, maxYear].filter(Boolean).length}
                          </span>
                        )}
                      </Button>
                      {hasActiveFilters() && (
                        <button
                          onClick={clearFilters}
                          className="h-9 px-2.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <X className="h-3.5 w-3.5" />
                          Clear
                        </button>
                      )}
                      <div className="w-px h-6 bg-gray-200 mx-1" />
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => setInventoryView('grid')}
                          className={`p-1.5 rounded-md transition-colors ${inventoryView === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setInventoryView('list')}
                          className={`p-1.5 rounded-md transition-colors ${inventoryView === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Filters Panel */}
                  {showFilters && (
                    <div className="border-t border-gray-100 pt-3 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">Transmission</label>
                          <select
                            value={transmissionFilter}
                            onChange={(e) => setTransmissionFilter(e.target.value)}
                            className="w-full h-9 px-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030]"
                          >
                            <option value="ALL">All</option>
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                            <option value="CVT">CVT</option>
                            <option value="Semi-Automatic">Semi-Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">Fuel Type</label>
                          <select
                            value={fuelTypeFilter}
                            onChange={(e) => setFuelTypeFilter(e.target.value)}
                            className="w-full h-9 px-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030]"
                          >
                            <option value="ALL">All</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">Min Price</label>
                          <Input type="number" placeholder="N$ 0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-9 text-sm border-gray-200" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">Max Price</label>
                          <Input type="number" placeholder="No limit" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-9 text-sm border-gray-200" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">From Year</label>
                          <Input type="number" placeholder="1900" value={minYear} onChange={(e) => setMinYear(e.target.value)} className="h-9 text-sm border-gray-200" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-500 mb-1">To Year</label>
                          <Input type="number" placeholder={new Date().getFullYear().toString()} value={maxYear} onChange={(e) => setMaxYear(e.target.value)} className="h-9 text-sm border-gray-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results bar with sort */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{filteredVehicles.length}</span> of {vehicles.length} vehicles
                    {hasActiveFilters() && <span className="text-[#CB2030] ml-1">(filtered)</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                    <select
                      value={inventorySortBy}
                      onChange={(e) => setInventorySortBy(e.target.value as typeof inventorySortBy)}
                      className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer pr-6"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="most-views">Most views</option>
                    </select>
                  </div>
                </div>

                {/* Empty State */}
                {vehicles.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 py-20 px-4 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(203,32,48,0.06)' }}>
                      <Car className="w-8 h-8 text-[#CB2030]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No vehicles yet
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                      Add your first vehicle to start building your online inventory.
                    </p>
                    <Button
                      onClick={handleAddVehicle}
                      className="text-white hover:opacity-90"
                      style={{ background: '#CB2030' }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Vehicle
                    </Button>
                  </div>
                ) : filteredVehicles.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 py-16 px-4 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No matches</h3>
                    <p className="text-sm text-gray-500 mb-4">Try adjusting your filters.</p>
                    <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                      <X className="w-3.5 h-3.5 mr-1" /> Clear Filters
                    </Button>
                  </div>
                ) : inventoryView === 'grid' ? (
                  /* Grid View */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={vehicle.images?.[0]?.url || '/api/placeholder/800/600'}
                            alt={`${vehicle.year} ${vehicle.make || vehicle.manufacturer} ${vehicle.model}`}
                            className="w-full h-44 object-cover bg-gray-100"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="500" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getVehicleStatusColor(vehicle.status)}`}>
                            {vehicle.status}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dealer/vehicles/${vehicle.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/vehicles/${vehicle.id}`, '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" /> View Public
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedVehicleForFeatured(vehicle); setShowFeaturedListingModal(true); }}>
                                <Crown className="h-4 w-4 mr-2 text-amber-500" /> Request Featured
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedVehicleForDeal(vehicle); setShowDealModal(true); }}>
                                <Tag className="h-4 w-4 mr-2 text-emerald-600" /> {vehicle.dealActive ? 'Edit Deal' : 'Create Deal'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteVehicle(vehicle.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="p-3.5">
                          <h3 className="font-semibold text-sm text-gray-900 mb-0.5 line-clamp-1">
                            {vehicle.year} {vehicle.make || vehicle.manufacturer} {vehicle.model}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2.5">
                            <span>{formatMileage(vehicle.mileage)} km</span>
                            <span>·</span>
                            <span>{vehicle.transmission}</span>
                            <span>·</span>
                            <span>{vehicle.fuelType}</span>
                          </div>
                          <p className="text-base font-bold mb-3" style={{ color: '#CB2030' }}>
                            {formatPrice(vehicle.price)}
                          </p>
                          <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                            <div className="flex gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" /> {vehicle.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" /> {vehicle.inquiries || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" /> {vehicle.favorites || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    {filteredVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center gap-4 p-3 hover:bg-gray-50/50 transition-colors group">
                        <img
                          src={vehicle.images?.[0]?.url || '/api/placeholder/800/600'}
                          alt={`${vehicle.year} ${vehicle.make || vehicle.manufacturer} ${vehicle.model}`}
                          className="w-20 h-14 object-cover rounded-lg bg-gray-100 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="112"%3E%3Crect fill="%23f3f4f6" width="160" height="112"/%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm text-gray-900 truncate">
                              {vehicle.year} {vehicle.make || vehicle.manufacturer} {vehicle.model}
                            </h3>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${getVehicleStatusColor(vehicle.status)}`}>
                              {vehicle.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                            <span>{formatMileage(vehicle.mileage)} km</span>
                            <span>{vehicle.transmission}</span>
                            <span>{vehicle.fuelType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 shrink-0">
                          <div className="flex gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {vehicle.views || 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {vehicle.inquiries || 0}</span>
                          </div>
                          <p className="text-sm font-bold whitespace-nowrap" style={{ color: '#CB2030' }}>
                            {formatPrice(vehicle.price)}
                          </p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dealer/vehicles/${vehicle.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/vehicles/${vehicle.id}`, '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" /> View Public
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedVehicleForFeatured(vehicle); setShowFeaturedListingModal(true); }}>
                                <Crown className="h-4 w-4 mr-2 text-amber-500" /> Request Featured
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedVehicleForDeal(vehicle); setShowDealModal(true); }}>
                                <Tag className="h-4 w-4 mr-2 text-emerald-600" /> {vehicle.dealActive ? 'Edit Deal' : 'Create Deal'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteVehicle(vehicle.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating Add Stock Button */}
                <button
                  onClick={handleAddVehicle}
                  className="fixed bottom-8 right-8 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50 flex items-center gap-2 group"
                  style={{ background: '#CB2030' }}
                  title="Add New Vehicle"
                >
                  <Plus className="h-5 w-5" />
                  <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
                    Add Stock
                  </span>
                </button>
              </div>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (() => {
              const filteredLeads = leads.filter((lead: any) => leadStatusFilter === 'ALL' || lead.status === leadStatusFilter);
              const leadSearchTerm = searchTerm.toLowerCase();
              const searchedLeads = leadSearchTerm
                ? filteredLeads.filter((lead: any) =>
                    (lead.customerName || '').toLowerCase().includes(leadSearchTerm) ||
                    (lead.customerEmail || '').toLowerCase().includes(leadSearchTerm) ||
                    (lead.vehicle?.make || '').toLowerCase().includes(leadSearchTerm) ||
                    (lead.vehicle?.model || '').toLowerCase().includes(leadSearchTerm)
                  )
                : filteredLeads;

              const timeAgo = (dateStr: string) => {
                const now = new Date();
                const date = new Date(dateStr);
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins}m ago`;
                const diffHours = Math.floor(diffMins / 60);
                if (diffHours < 24) return `${diffHours}h ago`;
                const diffDays = Math.floor(diffHours / 24);
                if (diffDays < 7) return `${diffDays}d ago`;
                return date.toLocaleDateString();
              };

              const statusCounts: Record<string, number> = {};
              leads.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

              return (
              <div className="space-y-5">
                {/* Lead Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Leads', value: leadStats?.total || 0, color: 'text-gray-900' },
                    { label: 'New', value: leadStats?.new || 0, color: 'text-[#CB2030]' },
                    { label: 'Contacted', value: leadStats?.contacted || 0, color: 'text-amber-600' },
                    { label: 'Converted', value: leadStats?.converted || 0, color: 'text-emerald-600' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                      <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      {stat.label === 'Total Leads' && leadStats && leadStats.total > 0 && (
                        <p className="text-[11px] text-gray-400 mt-0.5">{leadStats.conversionRate}% conversion</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Search + Filter Controls */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search leads by name, email, vehicle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-9 text-sm border-gray-200"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{searchedLeads.length}</span> lead{searchedLeads.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {/* Status filter pills */}
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { key: 'ALL', label: 'All' },
                      { key: 'NEW', label: 'New' },
                      { key: 'CONTACTED', label: 'Contacted' },
                      { key: 'INTERESTED', label: 'Interested' },
                      { key: 'QUALIFIED', label: 'Qualified' },
                      { key: 'CONVERTED', label: 'Converted' },
                      { key: 'CLOSED', label: 'Closed' },
                    ].map(({ key, label }) => {
                      const count = key === 'ALL' ? leads.length : (statusCounts[key] || 0);
                      const isActive = leadStatusFilter === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setLeadStatusFilter(key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                            isActive
                              ? 'text-white'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                          style={isActive ? { background: '#CB2030' } : {}}
                        >
                          {label}
                          {count > 0 && (
                            <span className={`text-[10px] rounded-full px-1.5 py-px ${
                              isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Leads List */}
                {leadsLoading ? (
                  <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
                    <div className="w-8 h-8 border-2 border-[#CB2030] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500">Loading leads...</p>
                  </div>
                ) : leadsError ? (
                  <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
                    <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <h3 className="font-medium text-gray-900 mb-1">Error loading leads</h3>
                    <p className="text-sm text-gray-500">{leadsError.message}</p>
                  </div>
                ) : searchedLeads.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 py-16 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Inbox className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {leads.length === 0 ? 'No leads yet' : 'No matching leads'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {leads.length === 0 ? 'Customer inquiries will appear here' : 'Try adjusting your search or filters'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    {searchedLeads.map((lead: any) => (
                      <div
                        key={lead.id}
                        className="px-4 py-3.5 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                        onClick={() => handleViewLead(lead)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0" style={{ background: lead.status === 'NEW' ? '#CB2030' : '#6b7280' }}>
                            {lead.customerName?.charAt(0)?.toUpperCase() || '?'}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">{lead.customerName}</h4>
                              <Badge className={`${getLeadStatusColor(lead.status)} text-[10px] font-bold uppercase tracking-wide shrink-0`}>
                                {lead.status}
                              </Badge>
                              {lead.status === 'NEW' && (
                                <span className="w-2 h-2 rounded-full bg-[#CB2030] shrink-0" title="Unread" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              {lead.vehicle ? `${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model}` : 'General Inquiry'}
                              {lead.vehicle?.price ? ` · ${formatPrice(lead.vehicle.price)}` : ''}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">{lead.message || 'No message provided'}</p>
                          </div>

                          {/* Right side */}
                          <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                            <span className="text-[11px] text-gray-400">{timeAgo(lead.createdAt)}</span>
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              {lead.customerPhone && (
                                <a href={`https://wa.me/${lead.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="WhatsApp">
                                  <MessageCircle className="h-3.5 w-3.5" />
                                </a>
                              )}
                              <a href={`mailto:${lead.customerEmail}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Email">
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                              {lead.customerPhone && (
                                <a href={`tel:${lead.customerPhone}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Call">
                                  <Phone className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lead Detail Modal */}
                {showLeadDetail && selectedLead && (
                  <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4" onClick={() => setShowLeadDetail(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                      {/* Modal Header — clean white */}
                      <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: '#CB2030' }}>
                              {selectedLead.customerName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-gray-900">{selectedLead.customerName}</h2>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`${getLeadStatusColor(selectedLead.status)} text-[10px] font-bold uppercase`}>
                                  {selectedLead.status}
                                </Badge>
                                <span className="text-xs text-gray-400">{selectedLead.source?.replace('_', ' ')}</span>
                                <span className="text-xs text-gray-400">· {timeAgo(selectedLead.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => setShowLeadDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Modal Content */}
                      <div className="flex-1 overflow-y-auto">
                        {/* Contact + Vehicle Info Row */}
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                          <div className="flex flex-wrap gap-4 text-sm">
                            <a href={`mailto:${selectedLead.customerEmail}`} className="flex items-center gap-1.5 text-gray-700 hover:text-[#CB2030] transition-colors">
                              <Mail className="h-4 w-4 text-gray-400" /> {selectedLead.customerEmail}
                            </a>
                            {selectedLead.customerPhone && (
                              <a href={`tel:${selectedLead.customerPhone}`} className="flex items-center gap-1.5 text-gray-700 hover:text-[#CB2030] transition-colors">
                                <Phone className="h-4 w-4 text-gray-400" /> {selectedLead.customerPhone}
                              </a>
                            )}
                          </div>
                          {selectedLead.vehicle && (
                            <div className="mt-3 flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
                              <Car className="h-4 w-4 text-gray-400 shrink-0" />
                              <span className="text-sm font-medium text-gray-900">
                                {selectedLead.vehicle.year} {selectedLead.vehicle.make} {selectedLead.vehicle.model}
                              </span>
                              {selectedLead.vehicle.price && (
                                <span className="text-sm font-semibold ml-auto" style={{ color: '#CB2030' }}>
                                  {formatPrice(selectedLead.vehicle.price)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Update — inline select */}
                        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Status:</span>
                          <div className="flex gap-1 flex-wrap">
                            {['NEW', 'CONTACTED', 'INTERESTED', 'QUALIFIED', 'CONVERTED', 'CLOSED'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateLeadStatus(selectedLead.id, status)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                                  selectedLead.status === status
                                    ? 'text-white shadow-sm'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                                style={selectedLead.status === status ? { background: '#CB2030' } : {}}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Conversation Thread */}
                        <div className="px-6 py-4">
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Conversation</h3>
                          <div className="space-y-3 min-h-[200px] max-h-[360px] overflow-y-auto">
                            {loadingMessages ? (
                              <div className="py-10 text-center">
                                <div className="w-6 h-6 border-2 border-[#CB2030] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-xs text-gray-400">Loading...</p>
                              </div>
                            ) : (
                              <>
                                {/* Original inquiry */}
                                {!leadMessages.some((m: any) => m.senderType === 'CUSTOMER') && selectedLead.message && (
                                  <div className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-600 shrink-0 mt-0.5">
                                      {selectedLead.customerName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-gray-900">{selectedLead.customerName}</span>
                                        <span className="text-[10px] text-gray-400">{timeAgo(selectedLead.createdAt)}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{renderMessageContent(selectedLead.message)}</p>
                                    </div>
                                  </div>
                                )}
                                {/* Messages */}
                                {leadMessages.map((msg: any, index: number) => {
                                  const isDealer = msg.senderType === 'DEALERSHIP';
                                  return (
                                    <div key={msg.id || index} className={`flex gap-2.5 ${isDealer ? 'flex-row-reverse' : ''}`}>
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                                        isDealer ? 'bg-[#CB2030] text-white' : 'bg-gray-200 text-gray-600'
                                      }`}>
                                        {msg.senderName?.charAt(0)?.toUpperCase() || (isDealer ? 'D' : 'C')}
                                      </div>
                                      <div className={`flex-1 rounded-xl px-3.5 py-2.5 max-w-[85%] ${
                                        isDealer ? 'bg-[#CB2030]/5 rounded-tr-sm' : 'bg-gray-50 rounded-tl-sm'
                                      }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-semibold text-gray-900">{msg.senderName}</span>
                                          <span className="text-[10px] text-gray-400">{timeAgo(msg.createdAt)}</span>
                                          {msg.emailSent && (
                                            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                                              <CheckCircle className="h-2.5 w-2.5" /> Delivered
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{renderMessageContent(msg.content)}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                                {leadMessages.length === 0 && !selectedLead.message && (
                                  <p className="text-center text-sm text-gray-400 py-8">No messages yet</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Compose + Footer */}
                      <div className="border-t border-gray-100 p-4 bg-white">
                        <div className="relative mb-3">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <textarea
                                value={leadResponse}
                                onChange={handleLeadResponseChange}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') setShowMentionDropdown(false);
                                }}
                                placeholder="Type your response... Use @ to mention a team member"
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030] resize-none transition-colors"
                                rows={2}
                              />
                              {/* @mention autocomplete dropdown */}
                              {showMentionDropdown && filteredTeamMembers.length > 0 && (
                                <div className="absolute bottom-full left-0 mb-1 w-64 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-40 overflow-y-auto">
                                  <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">Team Members</div>
                                  {filteredTeamMembers.map((member) => (
                                    <button
                                      key={member.id}
                                      onClick={() => insertMention(member)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    >
                                      <div className="w-7 h-7 rounded-full bg-[#CB2030] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                        {member.name?.charAt(0)?.toUpperCase() || '?'}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                                        <p className="text-[11px] text-gray-400 truncate">{member.role === 'DEALER_PRINCIPAL' ? 'Principal' : 'Sales'}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={handleSendLeadResponse}
                              disabled={!leadResponse.trim() || sendingResponse}
                              className="text-white hover:opacity-90 self-end px-4"
                              style={{ background: '#CB2030' }}
                            >
                              {sendingResponse ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 ml-1">Use <span className="font-medium">@</span> to mention team members — they&apos;ll be notified via system and email</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5">
                            {selectedLead.customerPhone && (
                              <a
                                href={`https://wa.me/${selectedLead.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.customerName}, thank you for your inquiry on Cars.na!`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                              </a>
                            )}
                            {selectedLead.customerPhone && (
                              <a href={`tel:${selectedLead.customerPhone}`} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                                <Phone className="h-3.5 w-3.5" /> Call
                              </a>
                            )}
                            <a href={`mailto:${selectedLead.customerEmail}`} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                              <Mail className="h-3.5 w-3.5" /> Email
                            </a>
                          </div>
                          <button onClick={() => setShowLeadDetail(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Vehicle Listings Tab */}
            {activeTab === 'listings' && (
              <VehicleListingsTab />
            )}

            {/* Analytics Tab — uses real data from /api/dealer/analytics */}
            {activeTab === 'analytics' && (
              <DealershipAnalyticsDashboard dealershipId={session?.user?.id || ''} />
            )}

            {/* Website Manager Tab */}
            {activeTab === 'profile' && (
              <WebsiteManagerContent />
            )}

            {/* Sales Profile Tab */}
            {activeTab === 'sales-profile' && (
              <SalesProfileContent />
            )}

            {/* Subscription Tab - Only visible to dealership principals */}
            {activeTab === 'subscription' && isDealershipPrincipal && (
              <div className="space-y-6">
                {/* Real Subscription Data */}
                <DealerSubscriptionTab
                  dealershipId={session?.user?.dealershipId || session?.user?.id || ''}
                  userEmail={session?.user?.email || ''}
                />

                {/* Featured Dealership Request */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Featured Dealership Placement
                    </CardTitle>
                    <CardDescription>
                      Boost your visibility by becoming a featured dealership on the homepage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Benefits Section */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                          Why Go Featured?
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Prime placement on the homepage with your logo and showcase</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Increased visibility to thousands of potential buyers</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Priority listing in search results and categories</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Featured badge on all your vehicle listings</span>
                          </li>
                        </ul>
                      </div>

                      {/* Pricing Options */}
                      <div>
                        <h3 className="font-semibold mb-4">Select Duration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {[
                            { days: 7, price: 50, label: '1 Week' },
                            { days: 14, price: 90, label: '2 Weeks', popular: true },
                            { days: 30, price: 150, label: '1 Month' },
                            { days: 60, price: 250, label: '2 Months', savings: 'Save N$50' }
                          ].map((option) => (
                            <div
                              key={option.days}
                              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedFeaturedDuration === option.days
                                  ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
                                  : 'border-gray-200 hover:border-yellow-300'
                              }`}
                              onClick={() => setSelectedFeaturedDuration(option.days)}
                            >
                              {option.popular && (
                                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-600">
                                  Popular
                                </Badge>
                              )}
                              {option.savings && (
                                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600">
                                  {option.savings}
                                </Badge>
                              )}
                              <div className="text-center">
                                <div className="text-sm font-medium text-gray-600 mb-1">{option.label}</div>
                                <div className="text-2xl font-bold text-gray-900">
                                  N${option.price}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  N${(option.price / option.days).toFixed(2)}/day
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Additional Notes (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          rows={3}
                          placeholder="Any special requests or information for the admin team..."
                          value={featuredRequestNotes}
                          onChange={(e) => setFeaturedRequestNotes(e.target.value)}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {selectedFeaturedDuration && (
                            <span>
                              You'll be featured for <strong>{selectedFeaturedDuration} days</strong> at{' '}
                              <strong className="text-yellow-600">
                                N${
                                  selectedFeaturedDuration === 7 ? 50 :
                                  selectedFeaturedDuration === 14 ? 90 :
                                  selectedFeaturedDuration === 30 ? 150 :
                                  250
                                }
                              </strong>
                            </span>
                          )}
                        </div>
                        <Button
                          className="bg-yellow-600 hover:bg-yellow-700"
                          disabled={!selectedFeaturedDuration || submittingFeaturedRequest}
                          onClick={handleSubmitFeaturedRequest}
                        >
                          {submittingFeaturedRequest ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Crown className="h-4 w-4 mr-2" />
                              Request Featured Placement
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Current/Past Requests */}
                      {featuredRequests.length > 0 && (
                        <div className="pt-6 border-t">
                          <h3 className="font-semibold mb-4">Your Featured Requests</h3>
                          <div className="space-y-3">
                            {featuredRequests.map((request: any) => (
                              <div
                                key={request.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    request.status === 'ACTIVE' ? 'bg-green-100' :
                                    request.status === 'PENDING' ? 'bg-yellow-100' :
                                    request.status === 'APPROVED' ? 'bg-blue-100' :
                                    request.status === 'EXPIRED' ? 'bg-gray-100' :
                                    'bg-red-100'
                                  }`}>
                                    {request.status === 'ACTIVE' && <Crown className="h-5 w-5 text-green-600" />}
                                    {request.status === 'PENDING' && <Clock className="h-5 w-5 text-yellow-600" />}
                                    {request.status === 'APPROVED' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                                    {request.status === 'EXPIRED' && <Calendar className="h-5 w-5 text-gray-600" />}
                                    {request.status === 'REJECTED' && <X className="h-5 w-5 text-red-600" />}
                                  </div>
                                  <div>
                                    <p className="font-medium">{request.duration} days featured placement</p>
                                    <p className="text-sm text-gray-600">
                                      Requested: {new Date(request.requestedAt).toLocaleDateString()}
                                      {request.startDate && ` • Active: ${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="font-medium">N${request.amount}</p>
                                    <Badge className={`${
                                      request.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                      request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                      request.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                      request.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {request.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing & Invoices Tab */}
            {activeTab === 'billing' && isDealershipPrincipal && (
              <div className="space-y-6">

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Invoices</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p>
                  </div>
                  <div className={`rounded-xl border p-5 shadow-sm ${overdueInvoices.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                    <p className="text-sm text-gray-500">Amount Outstanding</p>
                    <p className={`text-2xl font-bold mt-1 ${overdueInvoices.length > 0 ? 'text-red-700' : 'text-gray-900'}`}>
                      {formatNAD(totalOwed)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl border border-green-200 p-5 shadow-sm">
                    <p className="text-sm text-gray-500">Total Paid (all time)</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">
                      {formatNAD(invoices.filter(i => i.status === 'PAID').reduce((s: number, i: any) => s + i.totalAmount, 0))}
                    </p>
                  </div>
                </div>

                {/* Overdue warning */}
                {overdueInvoices.length > 0 && (
                  <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">
                        {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-red-700 mt-0.5">
                        Please settle immediately to avoid service restrictions. Contact{' '}
                        <a href="mailto:support@cars.na" className="underline font-medium">support@cars.na</a>{' '}
                        once payment is made.
                      </p>
                    </div>
                  </div>
                )}

                {/* Invoice table */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#CB2030]" />
                        Invoice History
                      </CardTitle>
                      <CardDescription>Your monthly billing from Cars.na</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {invoicesLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-[#CB2030] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : invoices.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-200" />
                        <p className="font-medium">No invoices yet</p>
                        <p className="text-sm mt-1">Invoices are generated on the 1st of each month.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice #</th>
                              <th className="text-left px-4 py-3 font-semibold text-gray-600">Period</th>
                              <th className="text-right px-4 py-3 font-semibold text-gray-600">Subscription</th>
                              <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock Fee</th>
                              <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                              <th className="text-left px-4 py-3 font-semibold text-gray-600">Due Date</th>
                              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                              <th className="px-4 py-3" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {invoices.map((invoice: any) => {
                              const cfg = invoiceStatusCfg[invoice.status] || invoiceStatusCfg.PENDING;
                              const overdue = daysOverdue(invoice.dueDate);
                              return (
                                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 font-mono text-gray-900 font-medium text-xs">
                                    {invoice.invoiceNumber}
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">
                                    {INVOICE_MONTHS[invoice.billingMonth - 1] ?? '—'} {invoice.billingYear}
                                    <span className="ml-1 text-xs text-gray-400">• {invoice.planName}</span>
                                  </td>
                                  <td className="px-4 py-3 text-right text-gray-700">{formatNAD(invoice.subscriptionAmount)}</td>
                                  <td className="px-4 py-3 text-right text-gray-700">
                                    <span title={`0.1% of ${formatNAD(invoice.stockValue)} stock value (${invoice.vehicleCount} vehicles)`}>
                                      {formatNAD(invoice.stockFeeAmount)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatNAD(invoice.totalAmount)}</td>
                                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                    {new Date(invoice.dueDate).toLocaleDateString('en-NA')}
                                    {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && overdue > 0 && (
                                      <span className="ml-1 text-red-600 text-xs font-medium">({overdue}d overdue)</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
                                      {cfg.label}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {invoice.pdfPath ? (
                                      <button
                                        onClick={() => handleInvoiceDownload(invoice)}
                                        disabled={downloadingInvoice === invoice.id}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 hover:opacity-90"
                                        style={{ background: '#CB2030' }}
                                      >
                                        {downloadingInvoice === invoice.id ? (
                                          <span className="animate-spin inline-block w-3 h-3 border border-white border-t-transparent rounded-full" />
                                        ) : (
                                          <Download className="h-3 w-3" />
                                        )}
                                        PDF
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 text-xs">No PDF</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Billing explanation */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-sm text-gray-700">
                  <p className="font-semibold mb-1">How your invoice is calculated</p>
                  <p>Monthly invoice = <strong>Subscription plan fee</strong> + <strong>0.1% of total stock value</strong></p>
                  <p className="mt-1 text-blue-700">Stock value is the sum of all your active (AVAILABLE) vehicle listing prices at the time of invoice generation.</p>
                </div>

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
                    className="text-white hover:opacity-90"
                    style={{ background: '#CB2030' }}
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
                              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(203,32,48,0.08)' }}>
                                <span className="font-semibold text-lg" style={{ color: '#CB2030' }}>
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
                            className="text-white hover:opacity-90"
                            style={{ background: '#CB2030' }}
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
                    <option key="Automatic" value="Automatic">Automatic</option>
                    <option key="Manual" value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option key="Petrol" value="Petrol">Petrol</option>
                    <option key="Diesel" value="Diesel">Diesel</option>
                    <option key="Electric" value="Electric">Electric</option>
                    <option key="Hybrid" value="Hybrid">Hybrid</option>
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
                  className="flex-1 text-white hover:opacity-90"
                  style={{ background: '#CB2030' }}
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
                    className="flex-1 text-white hover:opacity-90"
                  style={{ background: '#CB2030' }}
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
                    className="flex-1 text-white hover:opacity-90"
                    style={{ background: '#CB2030' }}
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
                    <option key="SALES_EXECUTIVE" value="SALES_EXECUTIVE">Sales Executive</option>
                    <option key="DEALER_ADMIN" value="DEALER_ADMIN">Dealer Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveEditUser}
                  className="flex-1 text-white hover:opacity-90"
                  style={{ background: '#CB2030' }}
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
                  className="flex-1 text-white hover:opacity-90"
                  style={{ background: '#CB2030' }}
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
                  className="flex-1 text-white hover:opacity-90"
                  style={{ background: '#CB2030' }}
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

      {/* Delete Vehicle Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Vehicle</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this vehicle? All associated data including images and inquiries will be permanently removed.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVehicleToDelete(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteVehicle}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Vehicle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Listing Request Modal */}
      {showFeaturedListingModal && selectedVehicleForFeatured && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Request Featured Listing</h3>
                  <p className="text-sm text-gray-500">
                    {selectedVehicleForFeatured.make} {selectedVehicleForFeatured.model} {selectedVehicleForFeatured.year}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowFeaturedListingModal(false);
                    setSelectedVehicleForFeatured(null);
                    setSelectedListingDuration(null);
                    setFeaturedListingNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  Why Feature This Listing?
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Priority placement in search results and category pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Featured badge on listing to attract more attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Increased visibility to potential buyers</span>
                  </li>
                </ul>
              </div>

              {/* Pricing Options */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Select Duration</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { days: 7, price: 25, label: '1 Week' },
                    { days: 14, price: 45, label: '2 Weeks', popular: true },
                    { days: 30, price: 75, label: '1 Month' },
                    { days: 60, price: 125, label: '2 Months' }
                  ].map((option) => (
                    <div
                      key={option.days}
                      className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedListingDuration === option.days
                          ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                      onClick={() => setSelectedListingDuration(option.days)}
                    >
                      {option.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-xs">
                          Popular
                        </Badge>
                      )}
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-600 mb-1">{option.label}</div>
                        <div className="text-lg font-bold text-gray-900">N${option.price}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          N${(option.price / option.days).toFixed(2)}/day
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                  placeholder="Any special requests or information..."
                  value={featuredListingNotes}
                  onChange={(e) => setFeaturedListingNotes(e.target.value)}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {selectedListingDuration && (
                    <span>
                      Featured for <strong>{selectedListingDuration} days</strong> at{' '}
                      <strong className="text-yellow-600">
                        N${
                          selectedListingDuration === 7 ? 25 :
                          selectedListingDuration === 14 ? 45 :
                          selectedListingDuration === 30 ? 75 :
                          125
                        }
                      </strong>
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowFeaturedListingModal(false);
                      setSelectedVehicleForFeatured(null);
                      setSelectedListingDuration(null);
                      setFeaturedListingNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-yellow-600 hover:bg-yellow-700"
                    disabled={!selectedListingDuration || submittingListingRequest}
                    onClick={handleSubmitListingRequest}
                  >
                    {submittingListingRequest ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deal/Promotion Modal */}
      {showDealModal && selectedVehicleForDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedVehicleForDeal.dealActive ? 'Edit Deal' : 'Create Deal'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedVehicleForDeal.make} {selectedVehicleForDeal.model} {selectedVehicleForDeal.year}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDealModal(false);
                    setSelectedVehicleForDeal(null);
                    setDealPrice('');
                    setDealTitle('');
                    setDealBadge('HOT DEAL');
                    setDealEndDate('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Current Price Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(selectedVehicleForDeal.originalPrice || selectedVehicleForDeal.price)}
                    </p>
                  </div>
                  {selectedVehicleForDeal.dealActive && selectedVehicleForDeal.originalPrice && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Deal Price</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(selectedVehicleForDeal.price)}
                      </p>
                      <p className="text-xs text-green-600">
                        Save {formatPrice(selectedVehicleForDeal.originalPrice - selectedVehicleForDeal.price)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Price */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Deal Price (N$) *
                </label>
                <Input
                  type="number"
                  placeholder="Enter discounted price"
                  value={dealPrice}
                  onChange={(e) => setDealPrice(e.target.value)}
                  className="w-full"
                />
                {dealPrice && parseFloat(dealPrice) < (selectedVehicleForDeal.originalPrice || selectedVehicleForDeal.price) && (
                  <p className="text-sm text-green-600 mt-1">
                    Savings: {formatPrice((selectedVehicleForDeal.originalPrice || selectedVehicleForDeal.price) - parseFloat(dealPrice))}
                    ({(((selectedVehicleForDeal.originalPrice || selectedVehicleForDeal.price) - parseFloat(dealPrice)) / (selectedVehicleForDeal.originalPrice || selectedVehicleForDeal.price) * 100).toFixed(0)}% off)
                  </p>
                )}
              </div>

              {/* Deal Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Deal Title (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Summer Sale, Year-End Clearance"
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Deal Badge */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Deal Badge
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['HOT DEAL', 'SPECIAL OFFER', 'CLEARANCE', 'LIMITED TIME', 'BEST PRICE', 'REDUCED'].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => setDealBadge(badge)}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                        dealBadge === badge
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              {/* End Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Deal End Date (Optional)
                </label>
                <Input
                  type="datetime-local"
                  value={dealEndDate}
                  onChange={(e) => setDealEndDate(e.target.value)}
                  className="w-full"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank for no expiration date
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t gap-3">
                {selectedVehicleForDeal.dealActive && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleRemoveDeal}
                    disabled={submittingDeal}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Deal
                  </Button>
                )}
                <div className="flex gap-3 ml-auto">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDealModal(false);
                      setSelectedVehicleForDeal(null);
                      setDealPrice('');
                      setDealTitle('');
                      setDealBadge('HOT DEAL');
                      setDealEndDate('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!dealPrice || submittingDeal}
                    onClick={handleSubmitDeal}
                  >
                    {submittingDeal ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 mr-2" />
                        {selectedVehicleForDeal.dealActive ? 'Update Deal' : 'Create Deal'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Tutorial Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Tutorial Header */}
            <div className="p-6 text-white" style={{ background: '#CB2030' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">How to List a Vehicle</h2>
                  <p className="text-blue-100 mt-1">Step-by-step guide to adding your first vehicle</p>
                </div>
                <button
                  onClick={() => setShowTutorialModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="mt-4 flex gap-2">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      step <= tutorialStep ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tutorial Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              {tutorialStep === 0 && (
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(203,32,48,0.08)' }}>
                    <Plus className="w-12 h-12 text-[#CB2030]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Click "Add Vehicle"</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Start by clicking the <strong className="text-blue-600">"+ Add Your First Vehicle"</strong> button
                    or the <strong className="text-blue-600">blue "+" button</strong> in the bottom right corner of the Stock Manager.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2" style={{ background: '#CB2030' }}>
                        <Plus className="w-5 h-5" />
                        Add Your First Vehicle
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">This opens the vehicle listing form</p>
                  </div>
                </div>
              )}

              {tutorialStep === 1 && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Car className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Enter Vehicle Details</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Fill in the essential information about your vehicle. The more details you provide, the better your listing will perform.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Make *</label>
                        <div className="bg-white border rounded-lg px-3 py-2 text-gray-500">e.g., Toyota</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Model *</label>
                        <div className="bg-white border rounded-lg px-3 py-2 text-gray-500">e.g., Hilux</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Year *</label>
                        <div className="bg-white border rounded-lg px-3 py-2 text-gray-500">e.g., 2023</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Price (N$) *</label>
                        <div className="bg-white border rounded-lg px-3 py-2 text-gray-500">e.g., 450,000</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mileage (km)</label>
                        <div className="bg-white border rounded-lg px-3 py-2 text-gray-500">e.g., 25,000</div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Color</label>
                        <div className="bg-white border rounded-lg px-3 py-2 text-gray-500">e.g., White</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">* Required fields</p>
                  </div>
                </div>
              )}

              {tutorialStep === 2 && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Upload Photos</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    High-quality photos are crucial for attracting buyers. Upload multiple images showing different angles of your vehicle.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-white">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Drag & drop images or click to browse</p>
                      <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG up to 5MB each</p>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      <div className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-blue-600">Front</span>
                      </div>
                      <div className="aspect-square bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-green-600">Side</span>
                      </div>
                      <div className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-purple-600">Rear</span>
                      </div>
                      <div className="aspect-square bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-orange-600">Interior</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">Pro tip: Include at least 4-6 photos for best results</p>
                  </div>
                </div>
              )}

              {tutorialStep === 3 && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileEdit className="w-12 h-12 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Add Description & Features</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Write a compelling description and select the features your vehicle has. This helps buyers find exactly what they're looking for.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto text-left">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
                        <div className="bg-white border rounded-lg p-3 text-sm text-gray-500 min-h-[80px]">
                          "Well-maintained 2023 Toyota Hilux with full service history. One owner, accident-free. Features include leather seats, reverse camera, and Bluetooth connectivity..."
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Features</label>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">✓ Air Conditioning</span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">✓ Bluetooth</span>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">✓ Reverse Camera</span>
                          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">+ Add more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tutorialStep === 4 && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Step 5: Publish Your Listing</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Review your listing and click "Save Vehicle" to publish it. Your vehicle will immediately be visible to thousands of potential buyers across Namibia!
                  </p>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 max-w-lg mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">What happens next?</h4>
                    <ul className="text-left text-sm text-gray-600 space-y-2 max-w-xs mx-auto">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Your vehicle appears in search results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Buyers can contact you via the platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Track views and inquiries in your dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Edit or update your listing anytime</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Tutorial Footer */}
            <div className="border-t p-6 bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  tutorialStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                disabled={tutorialStep === 0}
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                Step {tutorialStep + 1} of 5
              </span>
              {tutorialStep < 4 ? (
                <button
                  onClick={() => setTutorialStep(Math.min(4, tutorialStep + 1))}
                  className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                  style={{ background: '#CB2030' }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowTutorialModal(false);
                    handleAddVehicle();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Start Adding Vehicle
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default function DealerDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading dashboard...</div></div>}>
      <DealerDashboardContent />
    </Suspense>
  );
}
