'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Textarea';
import { NotificationPanel } from '@/components/admin/NotificationPanel';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
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
  Image,
  Bell,
  Home,
  Flag,
  UserCheck,
  Database,
  Activity,
  MoreHorizontal,
  Plus,
  Filter,
  Download,
  CheckCircle,
  Clock,
  Building,
  Eye,
  X,
  Mail,
  CreditCard,
  Star,
  Tag,
  Calendar,
  MapPin,
  Fuel,
  Settings2,
  Image as ImageIcon,
  UserX,
  ShieldCheck,
  Ban,
  AlertCircle,
  Clock as ClockIcon,
  CheckCircle2,
  XCircle,
  UserCheck2,
  MoreVertical,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  Globe,
  MousePointer,
  Timer,
  Percent,
  BarChart,
  PieChart,
  LineChart,
  Key,
  Server,
  Database as DatabaseIcon,
  Wifi,
  Cloud,
  HardDrive,
  Monitor,
  Smartphone,
  Lock,
  Unlock,
  Save,
  RotateCcw,
  Link,
  Edit,
  Trash2,
  Upload,
  ChevronDown,
  Check
} from 'lucide-react';

// Admin stats will be fetched from API

// Comprehensive dealer data
const DEALERS_DATA = [
  {
    id: 'dealer-001',
    name: 'Premium Motors Namibia',
    email: 'info@premiummotors.na',
    phone: '+264 61 123 4567',
    address: '123 Independence Avenue, Windhoek',
    city: 'Windhoek',
    region: 'Khomas',
    status: 'Active',
    subscriptionPlan: 'Professional',
    subscriptionStatus: 'Active',
    monthlyFee: 49900, // N$499.00
    joinedAt: '2023-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    activeListings: 25,
    totalListings: 156,
    totalSales: 89,
    monthlyRevenue: 15600,
    rating: 4.8,
    verificationStatus: 'Verified',
    contactPerson: 'John Smith',
    businessLicense: 'BL-2023-001',
    taxNumber: 'TAX-123456789',
    website: 'www.premiummotors.na'
  },
  {
    id: 'dealer-002',
    name: 'Auto Palace',
    email: 'sales@autopalace.na',
    phone: '+264 61 987 6543',
    address: '456 Sam Nujoma Drive, Windhoek',
    city: 'Windhoek',
    region: 'Khomas',
    status: 'Active',
    subscriptionPlan: 'Basic',
    subscriptionStatus: 'Active',
    monthlyFee: 19900, // N$199.00
    joinedAt: '2023-03-22',
    lastLogin: '2024-01-19T15:45:00Z',
    activeListings: 18,
    totalListings: 89,
    totalSales: 45,
    monthlyRevenue: 8900,
    rating: 4.2,
    verificationStatus: 'Verified',
    contactPerson: 'Sarah Johnson',
    businessLicense: 'BL-2023-002',
    taxNumber: 'TAX-987654321',
    website: 'www.autopalace.na'
  },
  {
    id: 'dealer-003',
    name: 'Elite Autos Namibia',
    email: 'contact@eliteautos.na',
    phone: '+264 61 555 0123',
    address: '789 Robert Mugabe Avenue, Windhoek',
    city: 'Windhoek',
    region: 'Khomas',
    status: 'Pending',
    subscriptionPlan: 'Professional',
    subscriptionStatus: 'Pending',
    monthlyFee: 49900,
    joinedAt: '2024-01-10',
    lastLogin: null,
    activeListings: 0,
    totalListings: 12,
    totalSales: 0,
    monthlyRevenue: 0,
    rating: 0,
    verificationStatus: 'Pending',
    contactPerson: 'Mike Wilson',
    businessLicense: 'BL-2024-001',
    taxNumber: 'TAX-111222333',
    website: 'www.eliteautos.na'
  },
  {
    id: 'dealer-004',
    name: 'Coastal Cars Swakopmund',
    email: 'info@coastalcars.na',
    phone: '+264 64 123 4567',
    address: '321 Strand Street, Swakopmund',
    city: 'Swakopmund',
    region: 'Erongo',
    status: 'Suspended',
    subscriptionPlan: 'Basic',
    subscriptionStatus: 'Overdue',
    monthlyFee: 19900,
    joinedAt: '2023-08-15',
    lastLogin: '2024-01-10T09:20:00Z',
    activeListings: 0,
    totalListings: 34,
    totalSales: 12,
    monthlyRevenue: 2400,
    rating: 3.1,
    verificationStatus: 'Flagged',
    contactPerson: 'Tom Anderson',
    businessLicense: 'BL-2023-003',
    taxNumber: 'TAX-444555666',
    website: 'www.coastalcars.na'
  },
  {
    id: 'dealer-005',
    name: 'Northern Auto Sales',
    email: 'sales@northernauto.na',
    phone: '+264 65 789 0123',
    address: '654 Main Street, Oshakati',
    city: 'Oshakati',
    region: 'Oshana',
    status: 'Active',
    subscriptionPlan: 'Enterprise',
    subscriptionStatus: 'Active',
    monthlyFee: 99900, // N$999.00
    joinedAt: '2022-11-30',
    lastLogin: '2024-01-18T14:15:00Z',
    activeListings: 45,
    totalListings: 298,
    totalSales: 156,
    monthlyRevenue: 28900,
    rating: 4.6,
    verificationStatus: 'Verified',
    contactPerson: 'Linda Nghitila',
    businessLicense: 'BL-2022-015',
    taxNumber: 'TAX-777888999',
    website: 'www.northernauto.na'
  }
];

// Mock vehicle listings data
const VEHICLE_LISTINGS = [
  {
    id: 'listing-001',
    title: '2022 BMW X5 xDrive30d M Sport',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 850000,
    mileage: 15420,
    condition: 'Excellent',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Alpine White',
    dealerId: 'dealer-001',
    dealerName: 'Auto Palace Windhoek',
    dealerContact: 'sales@autopalace.na',
    location: 'Windhoek',
    region: 'Khomas',
    status: 'Active',
    listingStatus: 'Approved',
    featured: true,
    datePosted: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-20T14:15:00Z',
    views: 1245,
    inquiries: 23,
    images: ['bmw-x5-1.jpg', 'bmw-x5-2.jpg', 'bmw-x5-3.jpg'],
    description: 'Immaculate BMW X5 with full service history. Loaded with premium features including panoramic sunroof, leather seats, and advanced safety systems.',
    vin: 'WBAJA31040PZ12345',
    engineSize: '3.0L',
    drivetrain: 'AWD',
    doors: 5,
    seats: 7,
    registration: 'WK 123-456',
    warranty: 'Yes',
    serviceHistory: 'Full BMW Service History',
    features: ['Panoramic Sunroof', 'Leather Seats', 'Navigation System', 'Parking Sensors', 'Cruise Control']
  },
  {
    id: 'listing-002',
    title: '2021 Toyota Hilux 2.8 GD-6 RB Legend',
    make: 'Toyota',
    model: 'Hilux',
    year: 2021,
    price: 520000,
    mileage: 28500,
    condition: 'Very Good',
    fuelType: 'Diesel',
    transmission: 'Manual',
    bodyType: 'Pickup',
    color: 'White',
    dealerId: 'dealer-002',
    dealerName: 'Capital Auto Sales',
    dealerContact: 'info@capitalauto.na',
    location: 'Windhoek',
    region: 'Khomas',
    status: 'Active',
    listingStatus: 'Pending',
    featured: false,
    datePosted: '2024-01-18T09:15:00Z',
    lastUpdated: '2024-01-18T09:15:00Z',
    views: 432,
    inquiries: 8,
    images: ['hilux-1.jpg', 'hilux-2.jpg'],
    description: 'Reliable Toyota Hilux perfect for work and adventure. Well maintained with recent service.',
    vin: 'AHTEB52G200123456',
    engineSize: '2.8L',
    drivetrain: '4WD',
    doors: 4,
    seats: 5,
    registration: 'WK 789-012',
    warranty: 'No',
    serviceHistory: 'Regular maintenance',
    features: ['4WD', 'Tow Bar', 'Bluetooth', 'Air Conditioning', 'Power Steering']
  },
  {
    id: 'listing-003',
    title: '2020 Mercedes-Benz C-Class C200 AMG Line',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    price: 680000,
    mileage: 35600,
    condition: 'Good',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Obsidian Black',
    dealerId: 'dealer-003',
    dealerName: 'Elite Motors',
    dealerContact: 'sales@elitemotors.na',
    location: 'Swakopmund',
    region: 'Erongo',
    status: 'Active',
    listingStatus: 'Approved',
    featured: true,
    datePosted: '2024-01-12T16:45:00Z',
    lastUpdated: '2024-01-19T11:30:00Z',
    views: 892,
    inquiries: 15,
    images: ['merc-c200-1.jpg', 'merc-c200-2.jpg', 'merc-c200-3.jpg', 'merc-c200-4.jpg'],
    description: 'Elegant Mercedes-Benz C200 with AMG styling package. Premium luxury and performance combined.',
    vin: 'WDD2052472A123456',
    engineSize: '2.0L',
    drivetrain: 'RWD',
    doors: 4,
    seats: 5,
    registration: 'SW 345-678',
    warranty: 'Yes',
    serviceHistory: 'Mercedes-Benz Service History',
    features: ['AMG Line', 'Leather Interior', 'Digital Cockpit', 'Heated Seats', 'Keyless Entry']
  },
  {
    id: 'listing-004',
    title: '2019 Volkswagen Polo 1.0 TSI Comfortline',
    make: 'Volkswagen',
    model: 'Polo',
    year: 2019,
    price: 285000,
    mileage: 42300,
    condition: 'Good',
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    color: 'Reflex Silver',
    dealerId: 'dealer-004',
    dealerName: 'Coastal Car Sales',
    dealerContact: 'tom@coastalcars.na',
    location: 'Walvis Bay',
    region: 'Erongo',
    status: 'Flagged',
    listingStatus: 'Under Review',
    featured: false,
    datePosted: '2024-01-16T13:20:00Z',
    lastUpdated: '2024-01-21T08:45:00Z',
    views: 156,
    inquiries: 3,
    images: ['polo-1.jpg'],
    description: 'Economical and reliable Polo with low running costs. Perfect first car or city commuter.',
    vin: 'WVW1234567890123',
    engineSize: '1.0L',
    drivetrain: 'FWD',
    doors: 5,
    seats: 5,
    registration: 'WB 901-234',
    warranty: 'No',
    serviceHistory: 'Basic maintenance records',
    features: ['Air Conditioning', 'Radio/CD', 'Central Locking', 'Electric Windows']
  },
  {
    id: 'listing-005',
    title: '2023 Ford Ranger 2.0 Wildtrak 4x4',
    make: 'Ford',
    model: 'Ranger',
    year: 2023,
    price: 750000,
    mileage: 8900,
    condition: 'Excellent',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'Pickup',
    color: 'Meteor Grey',
    dealerId: 'dealer-005',
    dealerName: 'Northern Auto Sales',
    dealerContact: 'sales@northernauto.na',
    location: 'Oshakati',
    region: 'Oshana',
    status: 'Active',
    listingStatus: 'Approved',
    featured: true,
    datePosted: '2024-01-20T11:00:00Z',
    lastUpdated: '2024-01-21T15:30:00Z',
    views: 678,
    inquiries: 19,
    images: ['ranger-1.jpg', 'ranger-2.jpg', 'ranger-3.jpg'],
    description: 'Brand new Ford Ranger Wildtrak with all the latest features. Premium off-road capability with luxury comfort.',
    vin: 'MAJ1234567890123',
    engineSize: '2.0L',
    drivetrain: '4WD',
    doors: 4,
    seats: 5,
    registration: 'ON 567-890',
    warranty: 'Yes',
    serviceHistory: 'Under warranty',
    features: ['Wildtrak Package', 'Leather Seats', 'SYNC 3', 'Adaptive Cruise', 'Lane Assist', 'Tow Bar']
  },
  {
    id: 'listing-006',
    title: '2018 Nissan Navara 2.3 dCi LE 4x4',
    make: 'Nissan',
    model: 'Navara',
    year: 2018,
    price: 425000,
    mileage: 78500,
    condition: 'Fair',
    fuelType: 'Diesel',
    transmission: 'Manual',
    bodyType: 'Pickup',
    color: 'Gun Metallic',
    dealerId: 'dealer-001',
    dealerName: 'Auto Palace Windhoek',
    dealerContact: 'sales@autopalace.na',
    location: 'Windhoek',
    region: 'Khomas',
    status: 'Active',
    listingStatus: 'Rejected',
    featured: false,
    datePosted: '2024-01-14T14:30:00Z',
    lastUpdated: '2024-01-22T10:15:00Z',
    views: 89,
    inquiries: 1,
    images: ['navara-1.jpg'],
    description: 'Reliable workhorse with high mileage but well maintained. Price negotiable.',
    vin: 'JN11234567890123',
    engineSize: '2.3L',
    drivetrain: '4WD',
    doors: 4,
    seats: 5,
    registration: 'WK 234-567',
    warranty: 'No',
    serviceHistory: 'Some maintenance records',
    features: ['4WD', 'Air Conditioning', 'Power Steering', 'Radio']
  }
];

// Mock moderation data
// Mock data removed - reports will be fetched from database

// Mock moderation statistics
const MODERATION_STATS = {
  totalReports: 847,
  pendingReports: 23,
  resolvedReports: 824,
  criticalReports: 5,
  avgResolutionTime: '2.4 hours',
  topReportCategory: 'False Advertisement',
  activeFlags: 12,
  bannedUsers: 18
};

// Mock analytics data
// Analytics data will be fetched from database

// Mock settings data
const SETTINGS_DATA = {
  general: {
    siteName: 'Cars.na',
    siteDescription: 'Namibia\'s Premier Automotive Marketplace',
    siteUrl: 'https://cars.na',
    adminEmail: 'admin@cars.na',
    supportEmail: 'support@cars.na',
    timezone: 'Africa/Windhoek',
    language: 'en',
    currency: 'NAD',
    dateFormat: 'dd/MM/yyyy',
    maintenanceMode: false,
    registrationEnabled: true,
    guestBrowsing: true
  },
  security: {
    requireEmailVerification: true,
    twoFactorAuth: false,
    passwordMinLength: 8,
    passwordRequireSymbols: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    accountLockoutDuration: 15,
    requireCaptcha: true,
    ipWhitelist: [],
    sslEnabled: true,
    securityHeaders: true
  },
  payment: {
    paymentProvider: 'Paystack',
    paystackPublicKey: 'pk_test_xxxxx',
    paystackSecretKey: '••••••••••••',
    commissionRate: 5.0,
    subscriptionPricing: {
      basic: 19900, // N$199.00
      professional: 49900, // N$499.00
      enterprise: 99900 // N$999.00
    },
    featuredListingPrice: 9900, // N$99.00
    autoRenewal: true,
    refundPolicy: 30,
    taxRate: 15.0
  },
  notifications: {
    emailNotifications: {
      newUserRegistration: true,
      newListing: true,
      paymentReceived: true,
      moderationReport: true
    },
    pushNotifications: {
      enabled: true,
      firebaseServerKey: '••••••••••••'
    },
    smsNotifications: false,
    newsletterEnabled: true,
    marketingEmails: true,
    systemAlerts: true,
    moderationAlerts: true,
    paymentAlerts: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@cars.na',
    smtpPassword: '••••••••••••',
    smtpEncryption: 'TLS'
  },
  listings: {
    maxImages: 10,
    imageMaxSize: 5, // MB
    allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp'],
    requireModeration: true,
    autoApprove: false,
    defaultDuration: 90, // days
    maxDescriptionLength: 2000,
    allowContactInfo: false,
    requirePhoneVerification: true,
    featuredListingDuration: 30, // days
    featuredDuration: 30, // days
    featuredSlots: 10,
    allowNegotiation: true,
    autoRenewFeatured: false,
    maxListingsPerDealer: 100
  },
  api: {
    enabled: true,
    rateLimitEnabled: true,
    rateLimit: 1000,
    requestsPerMinute: 100,
    requireAuth: true,
    requireApiKey: true,
    webhooksEnabled: true,
    corsEnabled: true,
    allowedOrigins: ['https://cars.na', 'https://api.cars.na'],
    apiVersion: 'v1',
    documentationUrl: 'https://docs.cars.na/api',
    masterKey: '••••••••••••••••',
    webhookSecret: '••••••••••••••••'
  },
  integrations: {
    googleAnalytics: {
      enabled: true,
      trackingId: 'GA-XXXXXXXXX'
    },
    facebookPixel: {
      enabled: false,
      pixelId: 'FB-XXXXXXXXX'
    },
    googleMaps: {
      enabled: true,
      apiKey: 'AIzaSyXXXXXXXXXXXXXXX'
    },
    awsS3: {
      enabled: true,
      bucketName: 'cars-na-uploads',
      region: 'af-south-1'
    },
    socialLogin: {
      googleEnabled: true,
      facebookEnabled: true,
      twitterEnabled: false
    },
    cloudStorage: {
      provider: 'AWS S3',
      bucket: 'cars-na-uploads',
      region: 'eu-west-1'
    }
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    retentionDays: 30,
    backupStorage: 'AWS S3',
    lastBackup: '2024-01-22T02:00:00Z',
    backupSize: '2.4 GB',
    includeUserData: true,
    includeMedia: true
  },
  banners: {
    maxBanners: 10,
    defaultPosition: 'MAIN',
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
    maxFileSize: 5, // MB
    autoRotation: true,
    rotationInterval: 30, // seconds
    trackingEnabled: true,
    clickTracking: true,
    impressionTracking: true,
    defaultDuration: 30, // days
    requireApproval: false,
    allowExternalLinks: true,
    enableScheduling: true,
    compressionEnabled: true,
    compressionQuality: 85,
    watermarkEnabled: false,
    positions: ['MAIN', 'HERO', 'SIDEBAR', 'FOOTER', 'BETWEEN']
  }
};

const SUBSCRIPTIONS_DATA = [
  {
    id: 'sub-001',
    dealershipName: 'Premium Motors Namibia',
    dealershipId: 'dealer-001',
    plan: 'Professional',
    status: 'Active',
    monthlyFee: 49900,
    billingCycle: 'Monthly',
    startDate: '2023-01-15',
    nextBilling: '2024-02-15',
    lastPayment: '2024-01-15',
    totalPaid: 599900,
    autoRenew: true,
    features: ['Unlimited Listings', 'Priority Support', 'Analytics Dashboard', 'Featured Listings'],
    paymentMethod: 'Paystack',
    billingEmail: 'billing@premiummotors.na'
  },
  {
    id: 'sub-002',
    dealershipName: 'Auto Palace',
    dealershipId: 'dealer-002',
    plan: 'Basic',
    status: 'Active',
    monthlyFee: 19900,
    billingCycle: 'Monthly',
    startDate: '2023-03-22',
    nextBilling: '2024-02-22',
    lastPayment: '2024-01-22',
    totalPaid: 218900,
    autoRenew: true,
    features: ['Up to 50 Listings', 'Email Support', 'Basic Analytics'],
    paymentMethod: 'Paystack',
    billingEmail: 'finance@autopalace.na'
  },
  {
    id: 'sub-003',
    dealershipName: 'Elite Autos Namibia',
    dealershipId: 'dealer-003',
    plan: 'Professional',
    status: 'Pending',
    monthlyFee: 49900,
    billingCycle: 'Monthly',
    startDate: '2024-01-10',
    nextBilling: '2024-02-10',
    lastPayment: null,
    totalPaid: 0,
    autoRenew: false,
    features: ['Unlimited Listings', 'Priority Support', 'Analytics Dashboard', 'Featured Listings'],
    paymentMethod: 'Paystack',
    billingEmail: 'accounts@eliteautos.na'
  },
  {
    id: 'sub-004',
    dealershipName: 'Coastal Cars Swakopmund',
    dealershipId: 'dealer-004',
    plan: 'Basic',
    status: 'Overdue',
    monthlyFee: 19900,
    billingCycle: 'Monthly',
    startDate: '2023-08-15',
    nextBilling: '2024-01-15',
    lastPayment: '2023-12-15',
    totalPaid: 99500,
    autoRenew: true,
    features: ['Up to 50 Listings', 'Email Support', 'Basic Analytics'],
    paymentMethod: 'Paystack',
    billingEmail: 'admin@coastalcars.na'
  },
  {
    id: 'sub-005',
    dealershipName: 'Luxury Auto Group',
    dealershipId: 'dealer-005',
    plan: 'Enterprise',
    status: 'Active',
    monthlyFee: 99900,
    billingCycle: 'Annually',
    startDate: '2023-06-01',
    nextBilling: '2024-06-01',
    lastPayment: '2023-06-01',
    totalPaid: 999000,
    autoRenew: true,
    features: ['Unlimited Listings', '24/7 Support', 'Advanced Analytics', 'Featured Listings', 'API Access', 'White Label'],
    paymentMethod: 'Paystack',
    billingEmail: 'finance@luxuryauto.na'
  },
  {
    id: 'sub-006',
    dealershipName: 'City Motors Windhoek',
    dealershipId: 'dealer-006',
    plan: 'Professional',
    status: 'Cancelled',
    monthlyFee: 49900,
    billingCycle: 'Monthly',
    startDate: '2023-04-10',
    nextBilling: null,
    lastPayment: '2023-12-10',
    totalPaid: 449100,
    autoRenew: false,
    features: ['Unlimited Listings', 'Priority Support', 'Analytics Dashboard', 'Featured Listings'],
    paymentMethod: 'Paystack',
    billingEmail: 'accounts@citymotors.na'
  }
];

const SUBSCRIPTION_STATS = {
  totalSubscriptions: 89,
  activeSubscriptions: 76,
  pendingSubscriptions: 8,
  overdueSubscriptions: 3,
  cancelledSubscriptions: 2,
  monthlyRevenue: 4256000,
  annualRevenue: 51072000,
  avgSubscriptionValue: 48000,
  churnRate: 2.3
};

const SUBSCRIPTION_PLANS = [
  {
    id: 'plan-001',
    name: 'Basic',
    price: 19900,
    currency: 'NAD',
    billingCycle: 'Monthly',
    features: ['Up to 50 Listings', 'Email Support', 'Basic Analytics', 'Mobile App Access'],
    status: 'Active',
    subscribers: 34
  },
  {
    id: 'plan-002',
    name: 'Professional',
    price: 49900,
    currency: 'NAD',
    billingCycle: 'Monthly',
    features: ['Unlimited Listings', 'Priority Support', 'Analytics Dashboard', 'Featured Listings', 'API Access'],
    status: 'Active',
    subscribers: 42
  },
  {
    id: 'plan-003',
    name: 'Enterprise',
    price: 99900,
    currency: 'NAD',
    billingCycle: 'Annually',
    features: ['Unlimited Listings', '24/7 Support', 'Advanced Analytics', 'Featured Listings', 'API Access', 'White Label', 'Custom Integration'],
    status: 'Active',
    subscribers: 13
  }
];

const PROMO_CODES = [
  {
    id: 'promo-001',
    code: 'SUMMER2024',
    discount: 20,
    discountType: 'percentage',
    status: 'Active',
    usageLimit: 100,
    usageCount: 67,
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    applicablePlans: ['Basic', 'Professional'],
    createdAt: '2023-12-15'
  },
  {
    id: 'promo-002',
    code: 'NEWDEALER50',
    discount: 5000,
    discountType: 'fixed',
    status: 'Active',
    usageLimit: 50,
    usageCount: 12,
    startDate: '2024-01-10',
    endDate: '2024-03-31',
    applicablePlans: ['Professional', 'Enterprise'],
    createdAt: '2024-01-05'
  },
  {
    id: 'promo-003',
    code: 'BLACKFRIDAY',
    discount: 30,
    discountType: 'percentage',
    status: 'Expired',
    usageLimit: 200,
    usageCount: 189,
    startDate: '2023-11-24',
    endDate: '2023-11-27',
    applicablePlans: ['Basic', 'Professional', 'Enterprise'],
    createdAt: '2023-11-15'
  },
  {
    id: 'promo-004',
    code: 'WELCOME15',
    discount: 15,
    discountType: 'percentage',
    status: 'Active',
    usageLimit: null,
    usageCount: 234,
    startDate: '2024-01-01',
    endDate: null,
    applicablePlans: ['Basic'],
    createdAt: '2023-12-20'
  }
];

const BANNERS_DATA = [
  {
    id: 'banner-001',
    title: 'Summer Sale 2024',
    position: 'MAIN',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop',
    link: '/vehicles?sale=summer',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    priority: 1,
    clicks: 1245,
    impressions: 15678,
    createdAt: '2023-12-15'
  },
  {
    id: 'banner-002',
    title: 'New Arrivals - Premium Cars',
    position: 'HERO',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=600&fit=crop',
    link: '/vehicles?sort=newest',
    status: 'Active',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    priority: 2,
    clicks: 892,
    impressions: 12456,
    createdAt: '2024-01-05'
  },
  {
    id: 'banner-003',
    title: 'Finance Options Available',
    position: 'SIDEBAR',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    link: '/financing',
    status: 'Active',
    startDate: '2023-12-01',
    endDate: '2024-06-30',
    priority: 3,
    clicks: 567,
    impressions: 8934,
    createdAt: '2023-11-25'
  },
  {
    id: 'banner-004',
    title: 'Dealer Registration Promo',
    position: 'FOOTER',
    imageUrl: 'https://images.unsplash.com/photo-1562519819-019d3336fe48?w=800&h=600&fit=crop',
    link: '/dealers/register',
    status: 'Scheduled',
    startDate: '2024-02-01',
    endDate: '2024-03-31',
    priority: 4,
    clicks: 0,
    impressions: 0,
    createdAt: '2024-01-20'
  },
  {
    id: 'banner-005',
    title: 'Trade-In Your Old Car',
    position: 'BETWEEN',
    imageUrl: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1200&h=400&fit=crop',
    link: '/sell',
    status: 'Inactive',
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    priority: 5,
    clicks: 234,
    impressions: 4567,
    createdAt: '2023-10-25'
  }
];

const BANNER_STATS = {
  totalBanners: 12,
  activeBanners: 5,
  scheduledBanners: 3,
  inactiveBanners: 4,
  totalClicks: 8934,
  totalImpressions: 89456,
  avgCTR: 10.2
};

function AdminDashboardContent() {
  const { showToast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [moderationFilter, setModerationFilter] = useState('all');
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [settingsData, setSettingsData] = useState(SETTINGS_DATA);
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [userFilterOpen, setUserFilterOpen] = useState(false);
  const [dealerFilterOpen, setDealerFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [dealers, setDealers] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedDealers = localStorage.getItem('admin_dealers_data');
      if (savedDealers) {
        try {
          return JSON.parse(savedDealers);
        } catch (e) {
          console.error('Failed to parse saved dealers data:', e);
        }
      }
    }
    return [];
  });
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendingDealerId, setSuspendingDealerId] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDealerId, setDeletingDealerId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingDealerId, setRejectingDealerId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banningDealerId, setBanningDealerId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<any>(null);
  const [approveAllPendingDialogOpen, setApproveAllPendingDialogOpen] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState<any>(null);
  const [suspendReason, setSuspendReason] = useState<string>('');
  const [activatingUser, setActivatingUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalDealers: 0,
    activeDealers: 0,
    pendingDealers: 0,
    totalListings: 0,
    activeListings: 0,
    totalLeads: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    pendingApprovals: 0,
  });
  const [topDealers, setTopDealers] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    newUsers: 0,
    newDealers: 0,
    newListings: 0,
    newLeads: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    pendingSubscriptions: 0,
    overdueSubscriptions: 0,
    cancelledSubscriptions: 0,
    monthlyRevenue: 0,
    annualRevenue: 0,
    avgSubscriptionValue: 0,
    churnRate: 0,
  });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editPlanModalOpen, setEditPlanModalOpen] = useState(false);
  const [planFormData, setPlanFormData] = useState<any>({});

  // Promo code state
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [promoCodesLoading, setPromoCodesLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [editPromoModalOpen, setEditPromoModalOpen] = useState(false);
  const [deletePromoModalOpen, setDeletePromoModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<any>(null);
  const [promoFormData, setPromoFormData] = useState<any>({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    applicablePlans: [],
  });

  // Moderation state
  const [reports, setReports] = useState<any[]>([]);
  const [moderateMenuOpen, setModerateMenuOpen] = useState(false);
  const [highPriorityModalOpen, setHighPriorityModalOpen] = useState(false);

  // Analytics state
  const [customReportModalOpen, setCustomReportModalOpen] = useState(false);
  const [dataVisualizationModalOpen, setDataVisualizationModalOpen] = useState(false);
  const [configureAnalyticsModalOpen, setConfigureAnalyticsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>({
    overview: {
      totalPageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      avgSessionDuration: '0:00',
      conversionRate: 0,
      totalRevenue: 0,
      growthRate: 0
    },
    traffic: {
      daily: [],
      sources: []
    },
    listings: {
      performance: [],
      categories: []
    },
    revenue: {
      monthly: [],
      breakdown: {
        subscriptionRevenue: 0,
        commissionRevenue: 0,
        featuredListings: 0,
        premiumServices: 0,
        totalRevenue: 0
      }
    },
    users: {
      registration: [],
      engagement: {
        activeUsers: 0,
        returningUsers: 0,
        newUsers: 0,
        avgSessionDuration: 0,
        pagesPerSession: 0,
        messagesSent: 0,
        listingsViewed: 0
      }
    },
    geographic: []
  });

  // Fetch admin stats, dealers, users, and listings from database on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch all admin data in parallel
        const [statsResponse, dealersResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/dealerships')
        ]);

        // Handle stats response
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setAdminStats(statsData.stats);
            setUsers(statsData.recentUsers || []);
            setListings(statsData.recentListings || []);
            setTopDealers(statsData.topDealers || []);
            setRecentPayments(statsData.recentPayments || []);
            setTodayStats(statsData.todayStats || { newUsers: 0, newDealers: 0, newListings: 0, newLeads: 0 });
          }
        }

        // Handle dealers response
        if (dealersResponse.ok) {
          const dealersData = await dealersResponse.json();
          if (dealersData.success) {
            setDealers(dealersData.dealerships);
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch('/api/admin/subscriptions');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSubscriptionStats(data.stats);
            setSubscriptions(data.subscriptions || []);
            setSubscriptionPlans(data.plans || []);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setSubscriptionsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Fetch promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await fetch('/api/admin/promo-codes');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPromoCodes(data.promoCodes);
          }
        }
      } catch (error) {
        console.error('Error fetching promo codes:', error);
      } finally {
        setPromoCodesLoading(false);
      }
    };

    fetchPromoCodes();
  }, []);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAnalyticsData(data.analytics);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Persist dealers data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_dealers_data', JSON.stringify(dealers));
    }
  }, [dealers]);

  // Persist listings data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_listings_data', JSON.stringify(listings));
    }
  }, [listings]);

  // Newsletter modal state
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all'); // 'all', 'active', 'pending'
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);

  // Payment processing modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('pending'); // 'all', 'pending', 'overdue'
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isProcessingPayments, setIsProcessingPayments] = useState(false);

  // Report generation modal state
  const [generateReportModalOpen, setGenerateReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('dealer-performance'); // 'dealer-performance', 'revenue', 'subscriptions', 'analytics'
  const [reportFormat, setReportFormat] = useState('pdf'); // 'pdf', 'csv', 'excel'
  const [reportDateRange, setReportDateRange] = useState('last-30-days'); // 'last-7-days', 'last-30-days', 'last-90-days', 'custom'
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Bulk actions state for listings
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [bulkSettingsModalOpen, setBulkSettingsModalOpen] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  // Subscription management modal state
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Banner management state
  const [previewBanner, setPreviewBanner] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deletingBanner, setDeletingBanner] = useState<any>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerStats, setBannerStats] = useState({
    totalBanners: 0,
    activeBanners: 0,
    scheduledBanners: 0,
    inactiveBanners: 4,
    totalClicks: 0,
    totalImpressions: 0,
    avgCTR: 0
  });
  const [activeAdvertTab, setActiveAdvertTab] = useState('banners'); // 'banners', 'payments', 'analytics'

  // Debug: Log when activeAdvertTab changes
  useEffect(() => {
    console.log('Active Advert Tab changed to:', activeAdvertTab);
  }, [activeAdvertTab]);

  // Load platform settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings && Object.keys(data.settings).length > 0) {
            // Merge database settings with default settings
            setSettingsData((prev: any) => ({
              ...prev,
              ...data.settings,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Keep using default settings if fetch fails
      }
    };

    loadSettings();
  }, []);

  // Dealer management functions
  const handleViewDealer = (dealer: any) => {
    setSelectedDealer(dealer);
    setDealerModalOpen(true);
  };

  const handleApproveDealer = async (dealerId: string) => {
    console.log('Approving dealer:', dealerId);

    try {
      const response = await fetch(`/api/admin/dealerships/${dealerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          status: 'APPROVED'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the dealer in state
        setDealers(prevDealers =>
          prevDealers.map(dealer =>
            dealer.id === dealerId
              ? { ...dealer, status: 'APPROVED', verificationStatus: 'Verified' }
              : dealer
          )
        );
        showToast({
          title: 'Success!',
          description: 'Dealership approved successfully!',
          variant: 'success',
          duration: 5000
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to approve dealership',
          variant: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error approving dealer:', error);
      showToast({
        title: 'Error',
        description: 'Failed to approve dealership. Please try again.',
        variant: 'error',
        duration: 5000
      });
    }
  };

  const handleRejectDealer = (dealerId: string) => {
    setRejectingDealerId(dealerId);
    setRejectDialogOpen(true);
  };

  const confirmRejectDealer = async () => {
    if (!rejectingDealerId || !rejectReason.trim()) {
      showToast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'error',
        duration: 3000
      });
      return;
    }

    console.log('Rejecting dealer:', rejectingDealerId);

    try {
      const response = await fetch(`/api/admin/dealerships/${rejectingDealerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          status: 'REJECTED',
          reason: rejectReason
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDealers(prevDealers =>
          prevDealers.map(dealer =>
            dealer.id === rejectingDealerId
              ? { ...dealer, status: 'REJECTED', verificationStatus: 'Rejected' }
              : dealer
          )
        );
        showToast({
          title: 'Dealership Rejected',
          description: 'Dealership has been rejected successfully.',
          variant: 'success',
          duration: 5000
        });
        setRejectDialogOpen(false);
        setRejectingDealerId(null);
        setRejectReason('');
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to reject dealership',
          variant: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error rejecting dealer:', error);
      showToast({
        title: 'Error',
        description: 'Failed to reject dealership. Please try again.',
        variant: 'error',
        duration: 5000
      });
    }
  };

  const handleEditDealer = (dealer: any) => {
    setEditingDealer(dealer);
    setEditDialogOpen(true);
  };

  const handleBanDealer = (dealerId: string) => {
    setBanningDealerId(dealerId);
    setBanDialogOpen(true);
  };

  const confirmBanDealer = async () => {
    if (!banningDealerId || !banReason.trim()) {
      showToast({
        title: 'Error',
        description: 'Please provide a reason for banning',
        variant: 'error',
        duration: 3000
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/dealerships/${banningDealerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'ban',
          status: 'REJECTED',
          reason: banReason
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDealers(prevDealers =>
          prevDealers.filter(dealer => dealer.id !== banningDealerId)
        );
        showToast({
          title: 'Dealership Banned',
          description: 'Dealership has been permanently banned.',
          variant: 'success',
          duration: 5000
        });
        setBanDialogOpen(false);
        setBanningDealerId(null);
        setBanReason('');
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to ban dealership',
          variant: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error banning dealer:', error);
      showToast({
        title: 'Error',
        description: 'Failed to ban dealership. Please try again.',
        variant: 'error',
        duration: 5000
      });
    }
  };

  const handleReactivateDealer = async (dealerId: string) => {
    try {
      const response = await fetch(`/api/admin/dealerships/${dealerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reactivate',
          status: 'APPROVED'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDealers(prevDealers =>
          prevDealers.map(dealer =>
            dealer.id === dealerId
              ? { ...dealer, status: 'APPROVED', verificationStatus: 'Verified' }
              : dealer
          )
        );
        showToast({
          title: 'Dealership Reactivated',
          description: 'Dealership has been reactivated successfully.',
          variant: 'success',
          duration: 5000
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to reactivate dealership',
          variant: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error reactivating dealer:', error);
      showToast({
        title: 'Error',
        description: 'Failed to reactivate dealership. Please try again.',
        variant: 'error',
        duration: 5000
      });
    }
  };

  const handleManageSubscription = async (dealer: any) => {
    setSelectedDealer(dealer);
    setSelectedPlanId(dealer.subscriptionPlanId || '');

    // Fetch subscription plans
    try {
      const response = await fetch('/api/subscription-plans');
      const data = await response.json();
      if (data.success && data.plans) {
        setSubscriptionPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load subscription plans',
        variant: 'error',
        duration: 5000
      });
      return;
    }

    setSubscriptionModalOpen(true);
  };

  const handleUpdateSubscription = async () => {
    if (!selectedDealer || !selectedPlanId) return;

    try {
      const response = await fetch(`/api/admin/dealerships/${selectedDealer.id}/subscription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlanId
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update dealer in state
        setDealers(prevDealers =>
          prevDealers.map(dealer =>
            dealer.id === selectedDealer.id
              ? {
                  ...dealer,
                  subscriptionPlan: data.subscription.plan.name,
                  subscriptionPlanId: data.subscription.planId,
                  monthlyFee: data.subscription.plan.price,
                  maxListings: data.subscription.plan.maxListings
                }
              : dealer
          )
        );

        showToast({
          title: 'Success!',
          description: 'Subscription plan updated successfully!',
          variant: 'success',
          duration: 5000
        });

        setSubscriptionModalOpen(false);
        setSelectedDealer(null);
        setSelectedPlanId('');
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to update subscription',
          variant: 'error',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'error',
        duration: 5000
      });
    }
  };

  const handleSuspendDealer = (dealerId: string) => {
    setSuspendingDealerId(dealerId);
    setSuspensionReason('');
    setSuspendDialogOpen(true);
  };

  const confirmSuspendDealer = async () => {
    if (!suspendingDealerId) return;

    try {
      const response = await fetch(`/api/admin/dealerships/${suspendingDealerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'suspend',
          status: 'SUSPENDED',
          reason: suspensionReason || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the dealers state
        setDealers(prevDealers =>
          prevDealers.map(dealer =>
            dealer.id === suspendingDealerId
              ? { ...dealer, status: 'Suspended' }
              : dealer
          )
        );
        setSuspendDialogOpen(false);
        setSuspendingDealerId(null);
        setSuspensionReason('');
      } else {
        alert(`Failed to suspend dealer: ${data.error}`);
      }
    } catch (error) {
      console.error('Error suspending dealer:', error);
      alert('An error occurred while suspending the dealer.');
    }
  };

  const handleDeleteDealer = (dealerId: string) => {
    setDeletingDealerId(dealerId);
    setDeleteReason('');
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDealer = async () => {
    if (!deletingDealerId || !deleteReason.trim()) {
      alert('Deletion reason is required.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/dealerships/${deletingDealerId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove the dealer from state
        setDealers(prevDealers =>
          prevDealers.filter(dealer => dealer.id !== deletingDealerId)
        );
        setDeleteDialogOpen(false);
        setDeletingDealerId(null);
        setDeleteReason('');
      } else {
        alert(`Failed to delete dealer: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting dealer:', error);
      alert('An error occurred while deleting the dealer.');
    }
  };

  // User management functions
  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleSuspendUser = (user: any) => {
    setSuspendingUser(user);
  };

  const handleActivateUser = (user: any) => {
    setActivatingUser(user);
  };

  const confirmSuspendUser = async () => {
    if (suspendingUser) {
      // Update the user's status to 'Suspended'
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === suspendingUser.id
            ? { ...u, status: 'Suspended' }
            : u
        )
      );

      // Send email notification about user suspension via API
      try {
        const response = await fetch('/api/admin/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'user_suspended',
            userData: {
              name: suspendingUser.name,
              email: suspendingUser.email,
              id: suspendingUser.id
            },
            adminName: 'System Administrator',
            reason: suspendReason || 'No reason provided'
          })
        });

        if (response.ok) {
          console.log('User suspended and notification sent:', suspendingUser.name);
        }
      } catch (error) {
        console.error('Failed to send suspension notification:', error);
      }

      setSuspendingUser(null);
      setSuspendReason('');
    }
  };

  const confirmActivateUser = async () => {
    if (activatingUser) {
      // Update the user's status to 'Active'
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === activatingUser.id
            ? { ...u, status: 'Active' }
            : u
        )
      );

      // Send email notification about user reactivation via API
      try {
        const response = await fetch('/api/admin/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'user_reactivated',
            userData: {
              name: activatingUser.name,
              email: activatingUser.email,
              id: activatingUser.id
            },
            adminName: 'System Administrator'
          })
        });

        if (response.ok) {
          console.log('User activated and notification sent:', activatingUser.name);
        }
      } catch (error) {
        console.error('Failed to send reactivation notification:', error);
      }

      setActivatingUser(null);
    }
  };

  const saveUserEdit = async () => {
    if (editingUser) {
      const isNewUser = !users.find(u => u.id === editingUser.id);

      // Update the user information
      setUsers(prevUsers => {
        const existingUser = prevUsers.find(u => u.id === editingUser.id);
        if (existingUser) {
          return prevUsers.map(u =>
            u.id === editingUser.id ? editingUser : u
          );
        } else {
          return [...prevUsers, editingUser];
        }
      });

      // Send email notifications for new user creation via API
      if (isNewUser) {
        try {
          const response = await fetch('/api/admin/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'user_created',
              userData: {
                name: editingUser.name,
                email: editingUser.email,
                id: editingUser.id
              },
              adminName: 'System Administrator'
            })
          });

          if (response.ok) {
            console.log('New user created and welcome email sent:', editingUser.name);
          }
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
      } else {
        console.log('User updated:', editingUser.name);
      }

      setEditingUser(null);
    }
  };

  // Banner management functions
  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);

        // Calculate stats
        const activeBanners = data.filter((b: any) => b.isActive).length;
        const totalClicks = data.reduce((sum: number, b: any) => sum + (b.clicks || 0), 0);
        const totalImpressions = data.reduce((sum: number, b: any) => sum + (b.impressions || 0), 0);
        const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0;

        setBannerStats({
          totalBanners: data.length,
          activeBanners,
          scheduledBanners: data.filter((b: any) => b.startDate && new Date(b.startDate) > new Date()).length,
          inactiveBanners: data.filter((b: any) => !b.isActive).length,
          totalClicks,
          totalImpressions,
          avgCTR: parseFloat(avgCTR as string)
        });
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handlePreviewBanner = (banner: any) => {
    setPreviewBanner(banner);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
  };

  const handleDeleteBanner = async (banner: any) => {
    const confirmed = confirm(`Are you sure you want to delete the banner "${banner.title}"?`);
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/banners/${banner.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Banner deleted successfully!');
          fetchBanners(); // Refresh the list
        } else {
          alert('Failed to delete banner');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('An error occurred while deleting the banner');
      }
      setDeletingBanner(null);
    }
  };

  // Listing management functions
  const handleViewListing = (listing: any) => {
    setSelectedListing(listing);
    setListingModalOpen(true);
  };

  const handleApproveListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    setListings(prevListings =>
      prevListings.map(l =>
        l.id === listingId
          ? { ...l, listingStatus: 'Approved', status: 'Active' }
          : l
      )
    );

    // Send email notification via API
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'listing_approved',
          listingData: {
            dealerEmail: listing.dealerContact,
            dealerName: listing.dealerName,
            title: listing.title,
            make: listing.make,
            model: listing.model,
            year: listing.year,
            price: listing.price
          }
        })
      });
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  };

  const handleRejectListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    setListings(prevListings =>
      prevListings.map(l =>
        l.id === listingId
          ? { ...l, listingStatus: 'Rejected', status: 'Inactive' }
          : l
      )
    );

    // Send email notification via API
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'listing_rejected',
          listingData: {
            dealerEmail: listing.dealerContact,
            dealerName: listing.dealerName,
            title: listing.title,
            make: listing.make,
            model: listing.model,
            year: listing.year,
            price: listing.price
          }
        })
      });
    } catch (error) {
      console.error('Failed to send rejection email:', error);
    }
  };

  const handleFeatureListing = (listingId: string) => {
    setListings(prevListings =>
      prevListings.map(listing =>
        listing.id === listingId
          ? { ...listing, featured: !listing.featured }
          : listing
      )
    );
  };

  const handleSuspendListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    setListings(prevListings =>
      prevListings.map(l =>
        l.id === listingId
          ? { ...l, status: 'Suspended', listingStatus: 'Suspended' }
          : l
      )
    );

    // Send email notification via API
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'listing_suspended',
          listingData: {
            dealerEmail: listing.dealerContact,
            dealerName: listing.dealerName,
            title: listing.title,
            make: listing.make,
            model: listing.model,
            year: listing.year,
            price: listing.price
          }
        })
      });
    } catch (error) {
      console.error('Failed to send suspension email:', error);
    }
  };

  const handleReactivateListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    setListings(prevListings =>
      prevListings.map(l =>
        l.id === listingId
          ? { ...l, status: 'Active', listingStatus: 'Approved' }
          : l
      )
    );

    // Send email notification via API
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'listing_reactivated',
          listingData: {
            dealerEmail: listing.dealerContact,
            dealerName: listing.dealerName,
            title: listing.title,
            make: listing.make,
            model: listing.model,
            year: listing.year,
            price: listing.price
          }
        })
      });
    } catch (error) {
      console.error('Failed to send reactivation email:', error);
    }
  };

  const handlePutUnderReview = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    setListings(prevListings =>
      prevListings.map(l =>
        l.id === listingId
          ? { ...l, listingStatus: 'Under Review', status: 'Active' }
          : l
      )
    );

    // Send email notification via API
    try {
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'listing_under_review',
          listingData: {
            dealerEmail: listing.dealerContact,
            dealerName: listing.dealerName,
            title: listing.title,
            make: listing.make,
            model: listing.model,
            year: listing.year,
            price: listing.price
          }
        })
      });
    } catch (error) {
      console.error('Failed to send under review email:', error);
    }
  };

  const handleRemoveListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    if (confirm('Are you sure you want to permanently remove this listing?')) {
      setListings(prevListings =>
        prevListings.filter(l => l.id !== listingId)
      );

      // Send email notification via API
      try {
        await fetch('/api/admin/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'listing_deleted',
            listingData: {
              dealerEmail: listing.dealerContact,
              dealerName: listing.dealerName,
              title: listing.title,
              make: listing.make,
              model: listing.model,
              year: listing.year,
              price: listing.price
            }
          })
        });
      } catch (error) {
        console.error('Failed to send deletion email:', error);
      }
    }
  };

  // Moderation management functions
  const handleViewReport = (report: any) => {
    console.log('Opening report modal for:', report);
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleApproveReport = (reportId: string) => {
    // Update report status to Resolved
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, status: 'Resolved', lastUpdated: new Date().toISOString() }
          : report
      )
    );
    showToast({
      title: 'Success',
      description: 'Report approved and action taken',
      type: 'success',
    });
  };

  const handleRejectReport = (reportId: string) => {
    // Update report status to Resolved (rejected/invalid)
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, status: 'Resolved', lastUpdated: new Date().toISOString() }
          : report
      )
    );
    showToast({
      title: 'Success',
      description: 'Report rejected',
      type: 'success',
    });
  };

  const handleAssignReport = (reportId: string, adminId: string) => {
    // Assign report to admin
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, assignedTo: adminId, status: 'Under Review', lastUpdated: new Date().toISOString() }
          : report
      )
    );
    showToast({
      title: 'Success',
      description: 'Report assigned to you',
      type: 'success',
    });
  };

  const handleTakeAction = (reportId: string, action: string) => {
    // Execute moderation action (ban, warn, remove content, etc.)
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, status: 'Resolved', lastUpdated: new Date().toISOString() }
          : report
      )
    );
    showToast({
      title: 'Success',
      description: `Action taken: ${action}`,
      type: 'success',
    });
  };

  // Moderation tool functions
  const handleAutoModerate = () => {
    // Auto-moderate low severity reports
    const autoModeratedCount = reports.filter(r => r.severity === 'Low' && r.status === 'Pending').length;
    setReports(prevReports =>
      prevReports.map(report =>
        report.severity === 'Low' && report.status === 'Pending'
          ? { ...report, status: 'Resolved', assignedTo: 'auto-moderate', lastUpdated: new Date().toISOString() }
          : report
      )
    );
    showToast({
      title: 'Auto-Moderation Complete',
      description: `${autoModeratedCount} low severity reports auto-resolved`,
      type: 'success',
    });
  };

  const handleBulkBanUsers = () => {
    // Bulk action on critical reports (both pending and under review)
    const criticalReports = reports.filter(r =>
      r.severity === 'Critical' &&
      (r.status === 'Pending' || r.status === 'Under Review')
    );

    if (criticalReports.length === 0) {
      showToast({
        title: 'No Critical Reports',
        description: 'There are no pending critical reports to process',
        type: 'info',
      });
      return;
    }

    // Count by type
    const userReports = criticalReports.filter(r => r.type === 'user').length;
    const listingReports = criticalReports.filter(r => r.type === 'listing').length;
    const commentReports = criticalReports.filter(r => r.type === 'comment').length;

    // Update all critical reports to resolved
    setReports(prevReports =>
      prevReports.map(report =>
        report.severity === 'Critical' && (report.status === 'Pending' || report.status === 'Under Review')
          ? { ...report, status: 'Resolved', lastUpdated: new Date().toISOString() }
          : report
      )
    );

    // Build detailed message
    const actions = [];
    if (userReports > 0) actions.push(`${userReports} user(s) banned`);
    if (listingReports > 0) actions.push(`${listingReports} listing(s) removed`);
    if (commentReports > 0) actions.push(`${commentReports} comment(s) deleted`);

    showToast({
      title: 'Bulk Ban Complete',
      description: `${criticalReports.length} critical reports resolved: ${actions.join(', ')}`,
      type: 'success',
      duration: 7000,
    });
  };

  const handleFilterHighPriority = () => {
    // Open modal showing high and critical priority reports
    const highPriorityReports = reports.filter(r =>
      (r.severity === 'High' || r.severity === 'Critical') &&
      (r.status === 'Pending' || r.status === 'Under Review')
    );

    if (highPriorityReports.length === 0) {
      showToast({
        title: 'No High Priority Reports',
        description: 'There are no pending high or critical priority reports',
        type: 'info',
      });
      return;
    }

    setHighPriorityModalOpen(true);
    showToast({
      title: 'High Priority View',
      description: `Showing ${highPriorityReports.length} high/critical priority reports`,
      type: 'success',
    });
  };

  const handleGenerateModerationReport = () => {
    // Generate CSV file with all reports
    const csvHeaders = [
      'Report ID',
      'Target Title',
      'Target Type',
      'Report Reason',
      'Category',
      'Severity',
      'Status',
      'Reporter Name',
      'Reporter Email',
      'Assigned To',
      'Date Reported',
      'Last Updated',
      'Description'
    ];

    const csvRows = reports.map(report => [
      report.id,
      report.targetTitle,
      report.targetType,
      report.reportReason,
      report.reportCategory,
      report.severity,
      report.status,
      report.reporterName,
      report.reporterEmail,
      report.assignedTo || 'Unassigned',
      new Date(report.dateReported).toLocaleString(),
      new Date(report.lastUpdated).toLocaleString(),
      `"${(report.description || '').replace(/"/g, '""')}"` // Escape quotes in description
    ]);

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `moderation_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      title: 'Report Generated',
      description: `${reports.length} reports exported to Excel file`,
      type: 'success',
    });
  };

  // Analytics Tools handlers
  const handleCustomReports = () => {
    setCustomReportModalOpen(true);
  };

  const handleDataVisualization = () => {
    setDataVisualizationModalOpen(true);
  };

  const handleExportAnalyticsData = () => {
    // Generate comprehensive analytics CSV export
    const csvHeaders = [
      'Metric Category',
      'Metric Name',
      'Value',
      'Period',
      'Percentage/Rate',
      'Growth',
    ];

    const csvRows = [
      // Overview metrics
      ['Overview', 'Total Page Views', analyticsData.overview.totalPageViews, 'All Time', '', `${analyticsData.overview.growthRate}%`],
      ['Overview', 'Unique Visitors', analyticsData.overview.uniqueVisitors, 'All Time', '', ''],
      ['Overview', 'Bounce Rate', analyticsData.overview.bounceRate, 'All Time', `${analyticsData.overview.bounceRate}%`, ''],
      ['Overview', 'Avg Session Duration', analyticsData.overview.avgSessionDuration, 'All Time', '', ''],
      ['Overview', 'Conversion Rate', analyticsData.overview.conversionRate, 'All Time', `${analyticsData.overview.conversionRate}%`, ''],
      ['Overview', 'Total Revenue', `N$${(analyticsData.overview.totalRevenue / 100).toFixed(2)}`, 'All Time', '', `${analyticsData.overview.growthRate}%`],

      // Traffic sources
      ...analyticsData.traffic.sources.map(source => [
        'Traffic Source',
        source.name,
        source.visitors,
        'Current Period',
        `${source.percentage}%`,
        `${source.growth}%`
      ]),

      // Top performing makes
      ...analyticsData.listings.performance.map(make => [
        'Vehicle Performance',
        make.make,
        `${make.views} views, ${make.inquiries} inquiries, ${make.conversions} sales`,
        'Current Period',
        '',
        `Avg Price: N$${(make.avgPrice / 100).toFixed(2)}`
      ]),

      // User engagement
      ['User Engagement', 'Active Users', analyticsData.users.engagement.activeUsers, 'Current Period', '', ''],
      ['User Engagement', 'Returning Users', analyticsData.users.engagement.returningUsers, 'Current Period', '', ''],
      ['User Engagement', 'New Users', analyticsData.users.engagement.newUsers, 'Current Period', '', ''],
      ['User Engagement', 'Messages Sent', analyticsData.users.engagement.messagesSent, 'Current Period', '', ''],
      ['User Engagement', 'Listings Viewed', analyticsData.users.engagement.listingsViewed, 'Current Period', '', ''],

      // Geographic distribution
      ...analyticsData.geographic.map(region => [
        'Geographic',
        region.region,
        `${region.users} users`,
        'Current Period',
        `${region.percentage}%`,
        `Revenue: N$${(region.revenue / 100).toFixed(2)}`
      ]),
    ];

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      title: 'Analytics Exported',
      description: 'Analytics data has been exported to CSV file',
      type: 'success',
    });
  };

  const handleConfigureAnalytics = () => {
    setConfigureAnalyticsModalOpen(true);
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: settingsData,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save settings');
      }

      showToast({
        title: 'Settings Saved',
        description: 'Platform settings have been updated successfully',
        type: 'success',
      });
      setSettingsChanged(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        type: 'error',
      });
    }
  };

  const handleResetSettings = () => {
    setSettingsData(SETTINGS_DATA);
    setSettingsChanged(false);
    showToast({
      title: 'Settings Reset',
      description: 'All settings have been reset to defaults',
      type: 'info',
    });
  };

  const updateSettings = (section: string, field: string, value: any) => {
    setSettingsData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setSettingsChanged(true);
  };

  const toggleSetting = (section: string, field: string) => {
    setSettingsData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
    setSettingsChanged(true);
  };

  // Quick Actions handlers
  const handleSendNewsletter = () => {
    setNewsletterModalOpen(true);
  };

  const sendNewsletter = async () => {
    if (!newsletterSubject.trim() || !newsletterMessage.trim()) {
      alert('Please fill in both subject and message fields.');
      return;
    }

    setIsSendingNewsletter(true);

    try {
      // Filter recipients based on selected filter
      const recipients = dealers.filter(dealer => {
        if (recipientFilter === 'all') return true;
        if (recipientFilter === 'active') return dealer.status === 'Active';
        if (recipientFilter === 'pending') return dealer.verificationStatus === 'Pending';
        return true;
      });

      const response = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: newsletterSubject,
          message: newsletterMessage,
          recipients: recipients.map(d => ({
            email: d.email,
            name: d.name,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Newsletter sent successfully to ${recipients.length} dealers!`);
        setNewsletterModalOpen(false);
        setNewsletterSubject('');
        setNewsletterMessage('');
        setRecipientFilter('all');
      } else {
        alert(`Failed to send newsletter: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('An error occurred while sending the newsletter. Please try again.');
    } finally {
      setIsSendingNewsletter(false);
    }
  };

  const handleProcessPayments = () => {
    setPaymentModalOpen(true);
  };

  const processSelectedPayments = async () => {
    if (selectedPayments.length === 0) {
      alert('Please select at least one payment to process.');
      return;
    }

    setIsProcessingPayments(true);

    try {
      const response = await fetch('/api/admin/process-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIds: selectedPayments,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully processed ${data.processed} payment(s)!`);
        setPaymentModalOpen(false);
        setSelectedPayments([]);
      } else {
        alert(`Failed to process payments: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error processing payments:', error);
      alert('An error occurred while processing payments. Please try again.');
    } finally {
      setIsProcessingPayments(false);
    }
  };

  const togglePaymentSelection = (dealerId: string) => {
    setSelectedPayments(prev =>
      prev.includes(dealerId)
        ? prev.filter(id => id !== dealerId)
        : [...prev, dealerId]
    );
  };

  const selectAllPayments = () => {
    const filteredDealers = dealers.filter(dealer => {
      if (paymentFilter === 'pending') return dealer.subscriptionStatus === 'Pending';
      if (paymentFilter === 'overdue') return dealer.subscriptionStatus === 'Overdue';
      return true;
    });
    setSelectedPayments(filteredDealers.map(d => d.id));
  };

  const clearPaymentSelection = () => {
    setSelectedPayments([]);
  };

  const handleGenerateReports = () => {
    setGenerateReportModalOpen(true);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);

    try {
      const response = await fetch('/api/admin/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          reportFormat,
          dateRange: reportDateRange,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Set filename based on report type and format
      const timestamp = new Date().toISOString().split('T')[0];
      let filename = `${reportType}-${timestamp}.${reportFormat}`;

      // For PDF (HTML) format, open in new tab instead of download
      if (reportFormat === 'pdf') {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
        alert('Report opened in new tab!');
      } else {
        // For CSV and Excel, trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;

        // Trigger download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert(`Report downloaded successfully! File: ${filename}`);
      }

      setGenerateReportModalOpen(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('An error occurred while generating the report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Bulk actions handlers for listings
  const handleApproveAllPending = () => {
    setApproveAllPendingDialogOpen(true);
  };

  const confirmApproveAllPending = async () => {
    const pendingListings = listings.filter(l => l.listingStatus === 'Pending');

    // Update all pending listings to approved
    setListings(prevListings =>
      prevListings.map(l =>
        l.listingStatus === 'Pending'
          ? { ...l, listingStatus: 'Approved', status: 'Active' }
          : l
      )
    );

    // Send email notifications to all affected dealers
    for (const listing of pendingListings) {
      try {
        await fetch('/api/admin/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'listing_approved',
            listingData: {
              dealerEmail: listing.dealerContact,
              dealerName: listing.dealerName,
              title: listing.title,
              make: listing.make,
              model: listing.model,
              year: listing.year,
              price: listing.price
            }
          })
        });
      } catch (error) {
        console.error(`Failed to send approval email for listing ${listing.id}:`, error);
      }
    }

    setApproveAllPendingDialogOpen(false);
  };

  const handleManageFeatured = () => {
    setFeaturedModalOpen(true);
  };

  const handleExportData = () => {
    // Generate CSV export of listings
    const csvData = listings.map(listing =>
      `"${listing.title}","${listing.dealer}","${listing.price}","${listing.status}","${listing.views}","${listing.leads}"`
    ).join('\n');

    const csv = 'Title,Dealer,Price,Status,Views,Leads\n' + csvData;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `listings-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    alert('Listings data exported successfully!');
  };

  const handleBulkSettings = () => {
    setBulkSettingsModalOpen(true);
  };

  useEffect(() => {
    // Check for admin authentication using NextAuth session
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (!session) {
      router.push('/admin/login');
      return;
    }

    // Check if user is admin
    const isAdmin = (session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
    if (!isAdmin) {
      router.push('/dealer/login');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [session, status, router]);

  // Fetch banners when Advertisements tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === 'advertisements') {
      fetchBanners();
    }
  }, [isAuthenticated, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Overview', icon: Home, id: 'overview', current: activeTab === 'overview' },
    { name: 'Users', icon: Users, id: 'users', current: activeTab === 'users' },
    { name: 'Dealers', icon: Building2, id: 'dealers', current: activeTab === 'dealers' },
    { name: 'Listings', icon: Car, id: 'listings', current: activeTab === 'listings' },
    { name: 'Subscriptions', icon: CreditCard, id: 'subscriptions', current: activeTab === 'subscriptions' },
    { name: 'Advertisements', icon: Image, id: 'advertisements', current: activeTab === 'advertisements' },
    { name: 'Moderation', icon: Flag, id: 'moderation', current: activeTab === 'moderation' },
    { name: 'Analytics', icon: BarChart3, id: 'analytics', current: activeTab === 'analytics' },
    { name: 'Settings', icon: Settings, id: 'settings', current: activeTab === 'settings' },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
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

  // Handler to open edit plan modal
  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price / 100, // Convert from cents
      duration: plan.duration || 30,
      maxListings: plan.maxListings,
      maxPhotos: plan.maxPhotos,
      features: plan.features || [],
      isActive: plan.isActive !== false,
    });
    setEditPlanModalOpen(true);
  };

  // Handler to update subscription plan
  const handleUpdatePlan = async () => {
    if (!editingPlan) return;

    try {
      const response = await fetch(`/api/admin/subscription-plans/${editingPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planFormData),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSubscriptionPlans(prevPlans =>
          prevPlans.map(p =>
            p.id === editingPlan.id ? { ...p, ...data.plan } : p
          )
        );

        showToast({
          title: 'Success',
          description: 'Subscription plan updated successfully',
          type: 'success',
        });

        setEditPlanModalOpen(false);
        setEditingPlan(null);
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to update subscription plan',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update subscription plan',
        type: 'error',
      });
    }
  };

  // Handler to add a new feature to the plan
  const handleAddFeature = () => {
    const newFeature = prompt('Enter new feature:');
    if (newFeature && newFeature.trim()) {
      setPlanFormData((prev: any) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
    }
  };

  // Handler to remove a feature from the plan
  const handleRemoveFeature = (index: number) => {
    setPlanFormData((prev: any) => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== index),
    }));
  };

  // Promo code handlers
  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPromoFormData({ ...promoFormData, code });
  };

  const handleCreatePromoCode = async () => {
    try {
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoFormData),
      });

      const data = await response.json();

      if (data.success) {
        setPromoCodes([data.promoCode, ...promoCodes]);
        setPromoFormData({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: '',
          startDate: '',
          endDate: '',
          usageLimit: '',
          applicablePlans: [],
        });
        showToast({
          title: 'Success',
          description: 'Promo code created successfully',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to create promo code',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
      showToast({
        title: 'Error',
        description: 'Failed to create promo code',
        type: 'error',
      });
    }
  };

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo);
    setPromoFormData({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountType === 'PERCENTAGE' ? promo.discountValue : promo.discountValue / 100,
      startDate: promo.startDate ? new Date(promo.startDate).toISOString().split('T')[0] : '',
      endDate: promo.endDate ? new Date(promo.endDate).toISOString().split('T')[0] : '',
      usageLimit: promo.usageLimit || '',
      applicablePlans: promo.applicablePlans || [],
    });
    setEditPromoModalOpen(true);
  };

  const handleUpdatePromo = async () => {
    if (!editingPromo) return;

    try {
      const response = await fetch(`/api/admin/promo-codes/${editingPromo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoFormData),
      });

      const data = await response.json();

      if (data.success) {
        setPromoCodes(promoCodes.map(p => p.id === editingPromo.id ? data.promoCode : p));
        setEditPromoModalOpen(false);
        setEditingPromo(null);
        showToast({
          title: 'Success',
          description: 'Promo code updated successfully',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to update promo code',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating promo code:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update promo code',
        type: 'error',
      });
    }
  };

  const handleDeactivatePromo = async (id: string) => {
    try {
      const promo = promoCodes.find(p => p.id === id);
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo?.isActive }),
      });

      const data = await response.json();

      if (data.success) {
        setPromoCodes(promoCodes.map(p => p.id === id ? data.promoCode : p));
        showToast({
          title: 'Success',
          description: `Promo code ${data.promoCode.isActive ? 'activated' : 'deactivated'} successfully`,
          type: 'success',
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to update promo code',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating promo code:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update promo code',
        type: 'error',
      });
    }
  };

  const handleDeletePromoClick = (promo: any) => {
    setPromoToDelete(promo);
    setDeletePromoModalOpen(true);
  };

  const handleConfirmDeletePromo = async () => {
    if (!promoToDelete) return;

    try {
      const response = await fetch(`/api/admin/promo-codes/${promoToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setPromoCodes(promoCodes.filter(p => p.id !== promoToDelete.id));
        setDeletePromoModalOpen(false);
        setPromoToDelete(null);
        showToast({
          title: 'Success',
          description: 'Promo code deleted successfully',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to delete promo code',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting promo code:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete promo code',
        type: 'error',
      });
    }
  };

  const handlePlanCheckboxChange = (planId: string, checked: boolean) => {
    setPromoFormData((prev: any) => ({
      ...prev,
      applicablePlans: checked
        ? [...prev.applicablePlans, planId]
        : prev.applicablePlans.filter((id: string) => id !== planId),
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Cars.na Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                item.current
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.current ? 'text-blue-700' : 'text-gray-500'}`} />
              {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {navigation.find(nav => nav.id === activeTab)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-gray-600">
                    {activeTab === 'overview' && 'Platform overview and key metrics'}
                    {activeTab === 'users' && 'Manage platform users'}
                    {activeTab === 'dealers' && 'Manage dealership accounts'}
                    {activeTab === 'listings' && 'Manage vehicle listings'}
                    {activeTab === 'moderation' && 'Content moderation tools'}
                    {activeTab === 'analytics' && 'Platform analytics and reports'}
                    {activeTab === 'settings' && 'Platform configuration'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <NotificationPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-900">Total Users</CardTitle>
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">{adminStats.totalUsers.toLocaleString()}</div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-700">Total registered users</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-900">Active Dealers</CardTitle>
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900">{adminStats.totalDealers}</div>
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-purple-700">Verified: {adminStats.verifiedDealers} • Pending: {adminStats.pendingDealers}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-900">Total Listings</CardTitle>
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900">{adminStats.totalListings.toLocaleString()}</div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs text-green-700">Available: {adminStats.availableListings}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-900">Monthly Revenue</CardTitle>
                    <div className="p-2 bg-amber-500 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-900">N${adminStats.monthlyRevenue.toLocaleString()}</div>
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-xs text-amber-700">From completed payments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                        <p className="text-2xl font-bold text-gray-900">{adminStats.activeSubscriptions}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Monthly recurring revenue</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{adminStats.totalLeads}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Customer inquiries</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
                        <p className="text-2xl font-bold text-gray-900">2.4h</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Lead response time</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">12.8%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Lead to sale conversion</p>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Approvals */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Pending Approvals</CardTitle>
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardDescription>Items requiring immediate admin attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">New Dealer Applications</p>
                        <p className="text-sm text-gray-600">Awaiting verification</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">{adminStats.pendingDealers}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">Flagged Listings</p>
                        <p className="text-sm text-gray-600">Reported content</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">0</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">User Reports</p>
                        <p className="text-sm text-gray-600">Moderation queue</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">0</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">System Health</CardTitle>
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <CardDescription>Real-time platform performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Server Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response</span>
                      <Badge className="bg-green-100 text-green-800">Fast</Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">99.9% uptime</p>
                      <p className="text-xs text-gray-500">Avg: 120ms</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>Latest 24-hour platform events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {users.length === 0 && listings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No recent activity</p>
                      </div>
                    ) : (
                      <>
                        {users.slice(0, 2).map((user, idx) => (
                          <div key={user.id} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">New user: {user.name}</p>
                              <p className="text-xs text-gray-500">{new Date(user.joinedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                        {listings.slice(0, 2).map((listing, idx) => (
                          <div key={listing.id} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">New listing: {listing.title}</p>
                              <p className="text-xs text-gray-500">{listing.dealer}</p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Revenue & Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Revenue Trend (Last 6 Months)</span>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </CardTitle>
                    <CardDescription>Monthly revenue comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium mb-1">No revenue data yet</p>
                      <p className="text-xs">Revenue trends will appear once payments are processed</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performing Dealers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Top Performing Dealers</span>
                      <Star className="h-5 w-5 text-amber-500" />
                    </CardTitle>
                    <CardDescription>Based on listings and revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topDealers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Star className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium mb-1">No dealers yet</p>
                        <p className="text-xs">Top dealers will appear once dealerships are approved</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {topDealers.map((dealer, idx) => (
                          <div
                            key={dealer.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              idx === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' :
                              idx === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                              idx === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
                              ''
                            }`}
                          >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              idx === 0 ? 'bg-amber-500 text-white' :
                              idx === 1 ? 'bg-gray-400 text-white' :
                              idx === 2 ? 'bg-orange-600 text-white' :
                              'bg-blue-100 text-blue-700 font-semibold'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className={idx < 3 ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}>{dealer.name}</p>
                              <p className="text-xs text-gray-600">{dealer.activeListings} listings • {dealer.city}</p>
                            </div>
                            {idx < 3 && (
                              <Star className={`h-5 w-5 fill-current ${
                                idx === 0 ? 'text-amber-500' :
                                idx === 1 ? 'text-gray-400' :
                                'text-orange-600'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions & Platform Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recent Transactions</span>
                      <Button variant="outline" size="sm">View All</Button>
                    </CardTitle>
                    <CardDescription>Latest payment activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentPayments.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium mb-1">No transactions yet</p>
                        <p className="text-xs">Payment transactions will appear here once dealers subscribe</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentPayments.map((payment) => {
                          const isCompleted = payment.status === 'COMPLETED';
                          const isPending = payment.status === 'PENDING';
                          const timeAgo = new Date(payment.createdAt).toLocaleString();

                          return (
                            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : isPending ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : isPending ? (
                                    <Clock className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{payment.dealershipName} - {payment.planName}</p>
                                  <p className="text-xs text-gray-500">
                                    {payment.description || 'Subscription payment'} • {timeAgo}
                                  </p>
                                </div>
                              </div>
                              <span className={`font-semibold ${isCompleted ? 'text-green-600' : isPending ? 'text-blue-600' : 'text-gray-600'}`}>
                                {isCompleted ? '+' : ''}N${(payment.amount / 100).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Platform Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Stats</CardTitle>
                    <CardDescription>Today's snapshot</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">New Users</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{todayStats.newUsers}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">New Dealers</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{todayStats.newDealers}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">New Listings</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{todayStats.newListings}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">New Leads</span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">{todayStats.newLeads}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => setUserFilterOpen(!userFilterOpen)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const csvContent = users.map(u => `${u.name},${u.email},${u.role},${u.status},${u.joinedAt}`).join('\n');
                    const blob = new Blob([`Name,Email,Role,Status,Joined\n${csvContent}`], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'users-export.csv';
                    a.click();
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddUserModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Filter Panel */}
              {userFilterOpen && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Roles</option>
                          <option value="User">User</option>
                          <option value="Dealer">Dealer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={userStatusFilter}
                          onChange={(e) => setUserStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" className="w-full" onClick={() => {
                          setUserRoleFilter('all');
                          setUserStatusFilter('all');
                        }}>
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users
                          .filter(user => userRoleFilter === 'all' || user.role === userRoleFilter)
                          .filter(user => userStatusFilter === 'all' || user.status === userStatusFilter)
                          .map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">{user.role}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusBadge(user.status)}>{user.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.joinedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                              {user.status === 'Active' ? (
                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleSuspendUser(user)}>Suspend</Button>
                              ) : (
                                <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleActivateUser(user)}>Activate</Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add User Modal */}
          {addUserModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setAddUserModalOpen(false)}>
              <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add New User</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setAddUserModalOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Create a new user account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Dealer">Dealer</option>
                      <option value="Admin">Admin</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dealership <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a dealership</option>
                      {dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">All users must be assigned to a dealership</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setAddUserModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => {
                      // In real app, this would call an API
                      alert('User would be created here');
                      setAddUserModalOpen(false);
                    }}>
                      Create User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>Update user information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    >
                      <option value="Dealer">Dealer</option>
                      <option value="Admin">Admin</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dealership <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={editingUser.dealershipId || ''}
                      onChange={(e) => setEditingUser({...editingUser, dealershipId: e.target.value})}
                      required
                    >
                      <option value="">Select a dealership</option>
                      {dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">All users must be assigned to a dealership</p>
                  </div>
                </div>
                <DialogFooter className="mt-4 gap-2">
                  <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                  <Button onClick={saveUserEdit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Suspend User Modal */}
          {suspendingUser && (
            <Dialog open={!!suspendingUser} onOpenChange={() => setSuspendingUser(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suspend User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to suspend {suspendingUser.name}? They will not be able to access their account until reactivated.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for suspension (optional)</label>
                    <Textarea
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="Enter reason for suspension..."
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-200" style={{ marginTop: '24px', paddingTop: '16px' }}>
                  <button
                    onClick={() => setSuspendingUser(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSuspendUser}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium text-sm inline-flex items-center"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend User
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Activate User Modal */}
          {activatingUser && (
            <Dialog open={!!activatingUser} onOpenChange={() => setActivatingUser(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Activate User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to activate {activatingUser.name}? They will regain access to their account.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2">
                  <Button variant="outline" onClick={() => setActivatingUser(null)}>Cancel</Button>
                  <Button onClick={confirmActivateUser} className="bg-green-600 hover:bg-green-700">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Dealers Tab */}
          {activeTab === 'dealers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Dealer Management</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search dealers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${statusFilter === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('PENDING')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${statusFilter === 'PENDING' ? 'opacity-100' : 'opacity-0'}`} />
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('APPROVED')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${statusFilter === 'APPROVED' ? 'opacity-100' : 'opacity-0'}`} />
                        Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('SUSPENDED')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${statusFilter === 'SUSPENDED' ? 'opacity-100' : 'opacity-0'}`} />
                        Suspended
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${statusFilter === 'REJECTED' ? 'opacity-100' : 'opacity-0'}`} />
                        Rejected
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Verification</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setVerificationFilter('all')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${verificationFilter === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setVerificationFilter('Verified')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${verificationFilter === 'Verified' ? 'opacity-100' : 'opacity-0'}`} />
                        Verified
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setVerificationFilter('Pending')}>
                        <CheckCircle className={`mr-2 h-4 w-4 ${verificationFilter === 'Pending' ? 'opacity-100' : 'opacity-0'}`} />
                        Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Dealers Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Dealers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dealers.length}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Dealers</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dealers.filter(d => d.status === 'Active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((dealers.filter(d => d.status === 'Active').length / dealers.length) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dealers.filter(d => d.verificationStatus === 'Pending').length}
                    </div>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      N${dealers.reduce((sum, dealer) => sum + dealer.monthlyFee, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Dealers Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dealers
                          .filter(dealer => {
                            // Search filter
                            const matchesSearch = dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              dealer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              dealer.city.toLowerCase().includes(searchTerm.toLowerCase());

                            // Status filter
                            const matchesStatus = statusFilter === 'all' || dealer.status === statusFilter;

                            // Verification filter
                            const matchesVerification = verificationFilter === 'all' || dealer.verificationStatus === verificationFilter;

                            return matchesSearch && matchesStatus && matchesVerification;
                          })
                          .map((dealer) => (
                          <tr key={dealer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Building className="h-5 w-5 text-gray-500" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{dealer.name}</div>
                                  <div className="text-sm text-gray-500">{dealer.contactPerson}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{dealer.email}</div>
                              <div className="text-sm text-gray-500">{dealer.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{dealer.city}</div>
                              <div className="text-sm text-gray-500">{dealer.region}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{dealer.subscriptionPlan}</div>
                              <div className="text-sm text-gray-500">N${(dealer.monthlyFee / 100).toFixed(2)}/mo</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                dealer.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                dealer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                dealer.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {dealer.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                dealer.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                                dealer.verificationStatus === 'Flagged' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {dealer.verificationStatus}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {dealer.activeListings} active / {dealer.totalListings} total
                              </div>
                              <div className="text-sm text-gray-500">
                                ⭐ {dealer.rating.toFixed(1)} • {dealer.totalSales} sales
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleViewDealer(dealer)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />

                                  {dealer.verificationStatus === 'Pending' && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => handleApproveDealer(dealer.id)}
                                        className="text-green-600 focus:text-green-600"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        <span>Approve Dealership</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleRejectDealer(dealer.id)}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        <span>Reject Application</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}

                                  {dealer.status === 'APPROVED' && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => handleSuspendDealer(dealer.id)}
                                        className="text-yellow-600 focus:text-yellow-600"
                                      >
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        <span>Suspend Dealership</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}

                                  {dealer.status === 'SUSPENDED' && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => handleReactivateDealer(dealer.id)}
                                        className="text-green-600 focus:text-green-600"
                                      >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        <span>Reactivate Dealership</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}

                                  <DropdownMenuItem onClick={() => handleEditDealer(dealer)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit Details</span>
                                  </DropdownMenuItem>

                                  <DropdownMenuItem onClick={() => handleManageSubscription(dealer)}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Manage Subscription</span>
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  {dealer.status !== 'REJECTED' && (
                                    <DropdownMenuItem
                                      onClick={() => handleBanDealer(dealer.id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Ban className="mr-2 h-4 w-4" />
                                      <span>Ban Permanently</span>
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem
                                    onClick={() => handleDeleteDealer(dealer.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    <span>Delete Dealership</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Batch operations and dealer management tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleSendNewsletter}
                    >
                      <Mail className="h-4 w-4" />
                      Send Newsletter
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleProcessPayments}
                    >
                      <CreditCard className="h-4 w-4" />
                      Process Payments
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleGenerateReports}
                    >
                      <FileText className="h-4 w-4" />
                      Generate Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Listing Management</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Listings Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{listings.length}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {listings.filter(l => l.status === 'Active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((listings.filter(l => l.status === 'Active').length / listings.length) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {listings.filter(l => l.listingStatus === 'Pending').length}
                    </div>
                    <p className="text-xs text-yellow-600">Awaiting approval</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Featured</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {listings.filter(l => l.featured).length}
                    </div>
                    <p className="text-xs text-blue-600">Premium placements</p>
                  </CardContent>
                </Card>
              </div>

              {/* Listings Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listings
                          .filter(listing =>
                            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.model.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((listing) => (
                          <tr key={listing.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-16 rounded bg-gray-200 flex items-center justify-center mr-3">
                                  <Car className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {listing.year} • {listing.mileage.toLocaleString()} km • {listing.fuelType}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{listing.dealerName}</div>
                              <div className="text-sm text-gray-500">{listing.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                N${listing.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">{listing.condition}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                listing.listingStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                                listing.listingStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                                listing.listingStatus === 'Under Review' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {listing.listingStatus}
                              </Badge>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                {listing.featured && <Star className="h-3 w-3 text-yellow-500 mr-1" />}
                                {listing.status}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                👁 {listing.views} views
                              </div>
                              <div className="text-sm text-gray-500">
                                💬 {listing.inquiries} inquiries
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(listing.datePosted).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Updated: {new Date(listing.lastUpdated).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewListing(listing)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {listing.listingStatus === 'Pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => handleApproveListing(listing.id)}
                                    title="Approve Listing"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                {listing.listingStatus === 'Under Review' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-800"
                                      onClick={() => handleApproveListing(listing.id)}
                                      title="Approve Listing"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => handleRemoveListing(listing.id)}
                                      title="Delete Listing"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {listing.listingStatus === 'Approved' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={listing.featured ? "text-yellow-600 hover:text-yellow-800" : "text-gray-600 hover:text-gray-800"}
                                      onClick={() => handleFeatureListing(listing.id)}
                                      title={listing.featured ? "Remove Feature" : "Feature Listing"}
                                    >
                                      <Star className={`h-4 w-4 ${listing.featured ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-purple-600 hover:text-purple-800"
                                      onClick={() => handlePutUnderReview(listing.id)}
                                      title="Put Under Review"
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {listing.status === 'Active' && listing.listingStatus !== 'Suspended' && listing.listingStatus !== 'Under Review' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-orange-600 hover:text-orange-800"
                                    onClick={() => handleSuspendListing(listing.id)}
                                    title="Suspend Listing"
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                )}
                                {(listing.status === 'Suspended' || listing.listingStatus === 'Suspended') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => handleReactivateListing(listing.id)}
                                    title="Reactivate Listing"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                {listing.listingStatus !== 'Under Review' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleRemoveListing(listing.id)}
                                    title="Remove Listing"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bulk Actions</CardTitle>
                  <CardDescription>Manage multiple listings at once</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleApproveAllPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve All Pending
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleManageFeatured}
                    >
                      <Star className="h-4 w-4" />
                      Manage Featured
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleBulkSettings}
                    >
                      <Settings2 className="h-4 w-4" />
                      Bulk Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Advertisements Tab */}
          {activeTab === 'advertisements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Advertisement Management</h2>
                <div className="flex gap-3">
                  {activeAdvertTab === 'banners' && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Banner
                    </Button>
                  )}
                  {activeAdvertTab === 'analytics' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analytics
                    </Button>
                  )}
                </div>
              </div>

              {/* Sub-tabs Navigation */}
              <div className="border-b border-gray-200">
                {/* Debug indicator */}
                <div className="text-xs text-gray-400 px-4 py-1">Current tab: {activeAdvertTab}</div>
                <nav className="flex gap-6">
                  <button
                    onClick={() => setActiveAdvertTab('banners')}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeAdvertTab === 'banners'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Banner Management
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveAdvertTab('payments')}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeAdvertTab === 'payments'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payments & Subscriptions
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveAdvertTab('analytics')}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeAdvertTab === 'analytics'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Analytics & Reports
                    </div>
                  </button>
                </nav>
              </div>

              {/* Banners Tab Content */}
              {activeAdvertTab === 'banners' && (
                <>
                  {/* Banner Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
                    <Image className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bannerStats.totalBanners}</div>
                    <p className="text-xs text-muted-foreground">
                      {bannerStats.activeBanners} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bannerStats.totalClicks.toLocaleString()}</div>
                    <p className="text-xs text-blue-600">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bannerStats.totalImpressions.toLocaleString()}</div>
                    <p className="text-xs text-green-600">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bannerStats.avgCTR}%</div>
                    <p className="text-xs text-muted-foreground">Click-through rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Banners Grid - Organized by Position */}
              <div className="space-y-8">
                {banners.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No banners found. Create your first banner to get started!</p>
                  </div>
                ) : (
                  <>
                    {['HERO', 'MAIN', 'SIDEBAR'].map(position => {
                      const positionBanners = banners.filter(b => b.position === position);
                      if (positionBanners.length === 0) return null;

                      const positionInfo: Record<string, {title: string, description: string, page: string}> = {
                        HERO: {title: 'Hero Banners', description: 'Top banner on Vehicles page', page: '/vehicles'},
                        MAIN: {title: 'Main Banners', description: 'Main banner on Homepage', page: '/'},
                        SIDEBAR: {title: 'Sidebar Banners', description: 'Sidebar on Vehicles page (desktop only)', page: '/vehicles'}
                      };

                      return (
                        <div key={position}>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{positionInfo[position].title}</h3>
                              <p className="text-sm text-gray-500">
                                {positionInfo[position].description} • <a href={positionInfo[position].page} target="_blank" className="text-blue-600 hover:underline">View page</a>
                              </p>
                            </div>
                            <Badge variant="outline">{positionBanners.length} banner(s)</Badge>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {positionBanners.map((banner) => (
                  <Card key={banner.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{banner.title}</CardTitle>
                        <Badge className={banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription>
                        Fixed Position: {banner.position} •
                        <span className="text-blue-600"> Change image/content only</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Banner Preview */}
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="flex items-center justify-center h-full text-center text-gray-400"><div><div class="h-12 w-12 mx-auto mb-2 flex items-center justify-center"><svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><p class="text-sm">Failed to load image</p></div></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-center text-gray-400">
                            <div>
                              <Image className="h-12 w-12 mx-auto mb-2" />
                              <p className="text-sm">No image available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Banner Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Link</p>
                          <p className="font-medium text-blue-600 truncate">{banner.linkUrl || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Priority</p>
                          <p className="font-medium">{banner.priority || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Start Date</p>
                          <p className="font-medium">{banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">End Date</p>
                          <p className="font-medium">{banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Clicks</p>
                          <p className="font-medium text-blue-600">{(banner.clicks || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Impressions</p>
                          <p className="font-medium text-green-600">{(banner.impressions || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handlePreviewBanner(banner)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditBanner(banner)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteBanner(banner)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Banner Management Help */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Image className="h-5 w-5 mr-2" />
                    How to Manage Banners
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 space-y-2">
                  <p><strong>1. Edit Existing Banners:</strong> Click the "Edit" button on any banner card above to change its image, title, or link.</p>
                  <p><strong>2. Preview Changes:</strong> Use the "Preview" button to see how the banner looks before making changes.</p>
                  <p><strong>3. Toggle Active/Inactive:</strong> Use the status dropdown in edit mode to enable or disable banners.</p>
                  <p><strong>4. Banner Positions are Fixed:</strong> Each banner slot is tied to a specific location on the website and cannot be moved.</p>
                  <p className="mt-4 p-3 bg-white rounded border border-blue-300">
                    <strong>💡 Tip:</strong> Changes take effect immediately on the live site. Always preview your changes before saving!
                  </p>
                </CardContent>
              </Card>
                </>
              )}

              {/* Payments Tab Content */}
              {activeAdvertTab === 'payments' && (
                <div className="space-y-6">
                  {/* Payment Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-green-600">+18% from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Advertisers paying</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-orange-600">Awaiting payment</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-red-600">Within 7 days</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Active Subscriptions Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Advertisement Subscriptions</CardTitle>
                      <CardDescription>Manage advertiser subscriptions and payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advertiser</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banner Position</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-gray-900">ABC Motors</p>
                                  <p className="text-sm text-gray-500">contact@abcmotors.com</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge>HERO</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">Monthly Premium</td>
                              <td className="px-4 py-3 text-sm">Jan 1, 2025</td>
                              <td className="px-4 py-3 text-sm">Jan 31, 2025</td>
                              <td className="px-4 py-3 text-sm font-semibold">$500/mo</td>
                              <td className="px-4 py-3">
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">View</Button>
                                  <Button size="sm" variant="outline">Invoice</Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-gray-900">XYZ Dealership</p>
                                  <p className="text-sm text-gray-500">info@xyzdealership.com</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge>MAIN</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">Quarterly Standard</td>
                              <td className="px-4 py-3 text-sm">Dec 15, 2024</td>
                              <td className="px-4 py-3 text-sm">Mar 15, 2025</td>
                              <td className="px-4 py-3 text-sm font-semibold">$1,200/qtr</td>
                              <td className="px-4 py-3">
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">View</Button>
                                  <Button size="sm" variant="outline">Invoice</Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-gray-900">Premium Autos Ltd</p>
                                  <p className="text-sm text-gray-500">sales@premiumautos.com</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge>SIDEBAR</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">Monthly Basic</td>
                              <td className="px-4 py-3 text-sm">Jan 5, 2025</td>
                              <td className="px-4 py-3 text-sm">Feb 5, 2025</td>
                              <td className="px-4 py-3 text-sm font-semibold">$200/mo</td>
                              <td className="px-4 py-3">
                                <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">Renew</Button>
                                  <Button size="sm" variant="outline">Invoice</Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pricing Plans */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Advertisement Pricing Plans</CardTitle>
                      <CardDescription>Manage subscription tiers and pricing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-6">
                          <h3 className="font-semibold text-lg mb-2">Basic Plan</h3>
                          <p className="text-3xl font-bold mb-4">$200<span className="text-sm text-gray-500">/month</span></p>
                          <ul className="space-y-2 text-sm mb-4">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />SIDEBAR position</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Basic analytics</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />1 banner change/month</li>
                          </ul>
                          <Button className="w-full" variant="outline">Edit Plan</Button>
                        </div>

                        <div className="border-2 border-blue-500 rounded-lg p-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">Standard Plan</h3>
                            <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                          </div>
                          <p className="text-3xl font-bold mb-4">$400<span className="text-sm text-gray-500">/month</span></p>
                          <ul className="space-y-2 text-sm mb-4">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />MAIN position</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Advanced analytics</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited changes</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
                          </ul>
                          <Button className="w-full">Edit Plan</Button>
                        </div>

                        <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                          <h3 className="font-semibold text-lg mb-2">Premium Plan</h3>
                          <p className="text-3xl font-bold mb-4">$600<span className="text-sm text-gray-500">/month</span></p>
                          <ul className="space-y-2 text-sm mb-4">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />HERO position</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Full analytics suite</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited changes</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Dedicated account manager</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Custom reporting</li>
                          </ul>
                          <Button className="w-full" variant="outline">Edit Plan</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Analytics Tab Content */}
              {activeAdvertTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Analytics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{bannerStats.totalImpressions.toLocaleString()}</div>
                        <p className="text-xs text-blue-600">Last 30 days</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{bannerStats.totalClicks.toLocaleString()}</div>
                        <p className="text-xs text-green-600">Last 30 days</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{bannerStats.avgCTR}%</div>
                        <p className="text-xs text-muted-foreground">Click-through rate</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">ROI</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">324%</div>
                        <p className="text-xs text-green-600">Return on investment</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance by Position */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance by Banner Position</CardTitle>
                      <CardDescription>Compare performance across different banner slots</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">HERO Position</h4>
                              <p className="text-sm text-gray-500">Top banner on vehicles page</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Best CTR</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-500">Impressions</p>
                              <p className="text-2xl font-bold">45,234</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Clicks</p>
                              <p className="text-2xl font-bold">4,892</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">CTR</p>
                              <p className="text-2xl font-bold text-green-600">10.8%</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">MAIN Position</h4>
                              <p className="text-sm text-gray-500">Main banner on homepage</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-500">Impressions</p>
                              <p className="text-2xl font-bold">38,567</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Clicks</p>
                              <p className="text-2xl font-bold">3,534</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">CTR</p>
                              <p className="text-2xl font-bold text-blue-600">9.2%</p>
                            </div>
                          </div>
                        </div>

                        <div className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">SIDEBAR Position</h4>
                              <p className="text-sm text-gray-500">Sidebar banner on vehicles page</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-500">Impressions</p>
                              <p className="text-2xl font-bold">22,145</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Clicks</p>
                              <p className="text-2xl font-bold">1,508</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">CTR</p>
                              <p className="text-2xl font-bold text-orange-600">6.8%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performing Banners */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Banners</CardTitle>
                      <CardDescription>Best performing advertisements this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {banners.slice(0, 5).map((banner, index) => (
                          <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold text-gray-300">#{index + 1}</div>
                              <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden">
                                {banner.imageUrl && (
                                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold">{banner.title}</h4>
                                <p className="text-sm text-gray-500">{banner.position}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-8 text-center">
                              <div>
                                <p className="text-sm text-gray-500">Impressions</p>
                                <p className="font-semibold">{(banner.impressions || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Clicks</p>
                                <p className="font-semibold">{(banner.clicks || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">CTR</p>
                                <p className="font-semibold text-green-600">
                                  {banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : 0}%
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Trends Chart Placeholder */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                      <CardDescription>Banner performance over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                          <p>Performance chart visualization</p>
                          <p className="text-sm">(Chart library integration coming soon)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Moderation Tab */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Content Moderation</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Moderation Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                    <FlagIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {reports.filter(r => r.status === 'Resolved').length} resolved
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <ClockIcon className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.filter(r => r.status === 'Pending').length}</div>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Reports</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.filter(r => r.severity === 'Critical').length}</div>
                    <p className="text-xs text-red-600">High priority</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.4 hours</div>
                    <p className="text-xs text-green-600">Response time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Moderation Filter Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'all', name: 'All Reports', count: reports.length },
                    { id: 'listings', name: 'Listings', count: reports.filter(r => r.type === 'listing').length },
                    { id: 'users', name: 'Users', count: reports.filter(r => r.type === 'user').length },
                    { id: 'dealerships', name: 'Dealerships', count: reports.filter(r => r.type === 'dealer').length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setModerationFilter(tab.id)}
                      className={`${
                        moderationFilter === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                    >
                      {tab.name}
                      <span className={`${
                        moderationFilter === tab.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Reports Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reports
                          .filter(report => {
                            // Filter by tab
                            if (moderationFilter !== 'all') {
                              if (moderationFilter === 'listings' && report.type !== 'listing') return false;
                              if (moderationFilter === 'users' && report.type !== 'user') return false;
                              if (moderationFilter === 'dealerships' && report.type !== 'dealer') return false;
                            }
                            // Filter by search term
                            return (
                              report.targetTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              report.reportReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              report.reportCategory.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                          })
                          .map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  {report.type === 'listing' && <Car className="h-5 w-5 text-gray-500" />}
                                  {report.type === 'user' && <Users className="h-5 w-5 text-gray-500" />}
                                  {report.type === 'comment' && <MessageSquare className="h-5 w-5 text-gray-500" />}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{report.targetTitle}</div>
                                  <div className="text-sm text-gray-500">{report.reportReason}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{report.targetType}</div>
                              <div className="text-sm text-gray-500">{report.reportCategory}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{report.reporterName}</div>
                              <div className="text-sm text-gray-500">{report.reporterEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                                report.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                                report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {report.severity}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                report.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {report.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {report.assignedTo || 'Unassigned'}
                              </div>
                              {report.actionTaken && (
                                <div className="text-sm text-gray-500">{report.actionTaken}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(report.dateReported).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(report.lastUpdated).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewReport(report)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {report.status === 'Pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-800"
                                      onClick={() => handleApproveReport(report.id)}
                                      title="Take Action"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => handleRejectReport(report.id)}
                                      title="Reject Report"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {!report.assignedTo && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-purple-600 hover:text-purple-800"
                                    onClick={() => handleAssignReport(report.id, 'admin-001')}
                                    title="Assign to Me"
                                  >
                                    <UserCheck2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Moderation Tools</CardTitle>
                  <CardDescription>Quick actions and batch operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleAutoModerate}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Auto-Moderate
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleBulkBanUsers}
                    >
                      <Ban className="h-4 w-4" />
                      Bulk Ban Users
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleFilterHighPriority}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      High Priority
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleGenerateModerationReport}
                    >
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Platform Analytics</h2>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.totalPageViews.toLocaleString()}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      +{analyticsData.overview.growthRate}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.uniqueVisitors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg session: {analyticsData.overview.avgSessionDuration}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Bounce rate: {analyticsData.overview.bounceRate}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N${(analyticsData.overview.totalRevenue / 100).toLocaleString()}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Traffic Sources
                    </CardTitle>
                    <CardDescription>Visitor acquisition channels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.traffic.sources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500" style={{
                              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
                            }}></div>
                            <div>
                              <p className="text-sm font-medium">{source.name}</p>
                              <p className="text-xs text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{source.percentage}%</p>
                            <p className={`text-xs ${source.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {source.growth > 0 ? '+' : ''}{source.growth}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Revenue Breakdown
                    </CardTitle>
                    <CardDescription>Monthly revenue by source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium">Subscription Fees</span>
                        </div>
                        <span className="text-sm font-medium">N${(analyticsData.revenue.breakdown.subscriptionRevenue / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Commission</span>
                        </div>
                        <span className="text-sm font-medium">N${(analyticsData.revenue.breakdown.commissionRevenue / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm font-medium">Featured Listings</span>
                        </div>
                        <span className="text-sm font-medium">N${(analyticsData.revenue.breakdown.featuredListings / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-medium">Premium Services</span>
                        </div>
                        <span className="text-sm font-medium">N${(analyticsData.revenue.breakdown.premiumServices / 100).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total Revenue</span>
                          <span>N${(analyticsData.revenue.breakdown.totalRevenue / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Makes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Top Performing Makes
                    </CardTitle>
                    <CardDescription>Vehicle brand performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Make</th>
                            <th className="text-right py-2">Views</th>
                            <th className="text-right py-2">Inquiries</th>
                            <th className="text-right py-2">Sales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.listings.performance.map((make, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">
                                <div>
                                  <p className="font-medium">{make.make}</p>
                                  <p className="text-xs text-gray-500">Avg: N${make.avgPrice.toLocaleString()}</p>
                                </div>
                              </td>
                              <td className="text-right py-2">{make.views.toLocaleString()}</td>
                              <td className="text-right py-2">{make.inquiries}</td>
                              <td className="text-right py-2">{make.conversions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Geographic Distribution
                    </CardTitle>
                    <CardDescription>User and revenue by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.geographic.map((region, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{region.region}</p>
                            <p className="text-xs text-gray-500">{region.users.toLocaleString()} users</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">N${(region.revenue / 100).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{region.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    User Engagement Metrics
                  </CardTitle>
                  <CardDescription>Platform usage and engagement statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.users.engagement.activeUsers.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.users.engagement.returningUsers.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Returning Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{analyticsData.users.engagement.pagesPerSession}</div>
                      <p className="text-sm text-gray-600">Pages/Session</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analyticsData.users.engagement.messagesSent.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Messages Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analytics Tools</CardTitle>
                  <CardDescription>Data analysis and reporting tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleCustomReports}
                    >
                      <LineChart className="h-4 w-4" />
                      Custom Reports
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleDataVisualization}
                    >
                      <PieChart className="h-4 w-4" />
                      Data Visualization
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleExportAnalyticsData}
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleConfigureAnalytics}
                    >
                      <Settings2 className="h-4 w-4" />
                      Configure Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Subscription Management</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search subscriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Subscription Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptionStats.totalSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">
                      {subscriptionStats.activeSubscriptions} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N${(subscriptionStats.monthlyRevenue / 100).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From subscription payments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptionStats.overdueSubscriptions}</div>
                    <p className="text-xs text-red-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptionStats.churnRate}%</div>
                    <p className="text-xs text-muted-foreground">Cancellation rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Subscriptions Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealership</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Fee</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto-Renew</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscriptions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                <CreditCard className="h-12 w-12 mb-3 text-gray-400" />
                                <p className="text-sm font-medium mb-1">No subscriptions yet</p>
                                <p className="text-xs">Subscription data will appear here once dealerships subscribe to plans</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          subscriptions
                            .filter(subscription =>
                              subscription.dealershipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              subscription.status.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((subscription) => (
                            <tr key={subscription.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{subscription.dealershipName}</div>
                                  <div className="text-sm text-gray-500">{subscription.billingEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-900">{subscription.plan}</span>
                                <div className="text-xs text-gray-500">{subscription.billingCycle}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getStatusBadge(subscription.status)}>
                                  {subscription.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                N${(subscription.monthlyFee / 100).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                N${(subscription.totalPaid / 100).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {subscription.autoRenew ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    No
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">View</button>
                                <button className="text-green-600 hover:text-green-900">Edit</button>
                                <button className="text-red-600 hover:text-red-900">Cancel</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Pricing Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plans & Pricing</CardTitle>
                  <CardDescription>Manage subscription plans and pricing tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptionPlans.map((plan) => (
                      <div key={plan.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {plan.name}
                              <Badge className={getStatusBadge(plan.status)}>{plan.status}</Badge>
                            </h3>
                            <p className="text-sm text-gray-500">{plan.subscribers} active subscribers</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              N${(plan.price / 100).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">{plan.billingCycle}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (NAD)</label>
                            <input
                              type="number"
                              defaultValue={plan.price / 100}
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                            <select
                              defaultValue={plan.billingCycle}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Annually">Annually</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              defaultValue={plan.status}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                          <div className="flex flex-wrap gap-2">
                            {plan.features.map((feature, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Plan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Promo Codes Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Promo Code */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create Promo Code</CardTitle>
                    <CardDescription>Generate new discount codes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="PROMO2024"
                          value={promoFormData.code}
                          onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        />
                        <Button variant="outline" size="sm" onClick={generatePromoCode}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                        <select
                          value={promoFormData.discountType}
                          onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="PERCENTAGE">Percentage</option>
                          <option value="FIXED_AMOUNT">Fixed Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                        <input
                          type="number"
                          placeholder="20"
                          value={promoFormData.discountValue}
                          onChange={(e) => setPromoFormData({ ...promoFormData, discountValue: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={promoFormData.startDate}
                          onChange={(e) => setPromoFormData({ ...promoFormData, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={promoFormData.endDate}
                          onChange={(e) => setPromoFormData({ ...promoFormData, endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                      <input
                        type="number"
                        placeholder="100 (leave empty for unlimited)"
                        value={promoFormData.usageLimit}
                        onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Plans</label>
                      <div className="space-y-2">
                        {subscriptionPlans.length > 0 ? (
                          subscriptionPlans.map((plan) => (
                            <label key={plan.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={promoFormData.applicablePlans.includes(plan.id)}
                                onChange={(e) => handlePlanCheckboxChange(plan.id, e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm">{plan.name}</span>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Loading plans...</p>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleCreatePromoCode}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Promo Code
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Promo Codes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Promo Codes</CardTitle>
                    <CardDescription>Manage existing discount codes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {promoCodesLoading ? (
                      <p className="text-sm text-gray-500">Loading promo codes...</p>
                    ) : promoCodes.length === 0 ? (
                      <p className="text-sm text-gray-500">No promo codes created yet</p>
                    ) : (
                      <div className="space-y-3">
                        {promoCodes.slice(0, 5).map((promo) => (
                          <div key={promo.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono text-sm font-bold">
                                  {promo.code}
                                </code>
                                <Badge className={promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                                  {promo.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <span className="text-lg font-bold text-blue-600">
                                {promo.discountType === 'PERCENTAGE'
                                  ? `${promo.discountValue}%`
                                  : `N$${(promo.discountValue / 100).toFixed(2)}`
                                }
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                              <div>
                                <span className="text-gray-500">Used:</span> {promo.usageCount}
                                {promo.usageLimit && ` / ${promo.usageLimit}`}
                              </div>
                              <div>
                                <span className="text-gray-500">Expires:</span>{' '}
                                {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Never'}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {promo.applicablePlans.map((planId: string, idx: number) => {
                                const plan = subscriptionPlans.find(p => p.id === planId);
                                return plan ? (
                                  <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    {plan.name}
                                  </span>
                                ) : null;
                              })}
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditPromo(promo)}
                              >
                                Edit
                              </button>
                              <button
                                className={`text-xs ${promo.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}`}
                                onClick={() => handleDeactivatePromo(promo.id)}
                              >
                                {promo.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                className="text-xs text-red-600 hover:text-red-800"
                                onClick={() => handleDeletePromoClick(promo)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* All Promo Codes Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Promo Codes</CardTitle>
                  <CardDescription>Complete list of discount codes and their performance</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plans</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {promoCodesLoading ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                              Loading promo codes...
                            </td>
                          </tr>
                        ) : promoCodes.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                              No promo codes found
                            </td>
                          </tr>
                        ) : (
                          promoCodes.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono text-sm font-bold">
                                  {promo.code}
                                </code>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium">
                                  {promo.discountType === 'PERCENTAGE'
                                    ? `${promo.discountValue}%`
                                    : `N$${(promo.discountValue / 100).toFixed(2)}`
                                  }
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {promo.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {promo.usageCount}{promo.usageLimit && ` / ${promo.usageLimit}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {promo.startDate ? new Date(promo.startDate).toLocaleDateString() : 'Immediate'} -
                                {promo.endDate ? ` ${new Date(promo.endDate).toLocaleDateString()}` : ' No End'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {promo.applicablePlans.map((planId: string, idx: number) => {
                                    const plan = subscriptionPlans.find(p => p.id === planId);
                                    return plan ? (
                                      <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                        {plan.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => handleEditPromo(promo)}
                                >
                                  Edit
                                </button>
                                <button
                                  className={promo.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}
                                  onClick={() => handleDeactivatePromo(promo.id)}
                                >
                                  {promo.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeletePromoClick(promo)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Platform Settings</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSettings}
                    disabled={!settingsChanged}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveSettings}
                    disabled={!settingsChanged}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Settings Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'general', name: 'General', icon: Settings },
                    { id: 'security', name: 'Security', icon: Lock },
                    { id: 'payment', name: 'Payment', icon: CreditCard },
                    { id: 'notifications', name: 'Notifications', icon: Bell },
                    { id: 'listings', name: 'Listings', icon: Car },
                    { id: 'banners', name: 'Banners', icon: Monitor },
                    { id: 'api', name: 'API', icon: Server },
                    { id: 'integrations', name: 'Integrations', icon: Link },
                    { id: 'backup', name: 'Backup', icon: HardDrive }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`${
                        activeSettingsTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* General Settings */}
              {activeSettingsTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Site Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                        <input
                          type="text"
                          value={settingsData.general.siteName}
                          onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                        <textarea
                          value={settingsData.general.siteDescription}
                          onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
                        <input
                          type="url"
                          value={settingsData.general.siteUrl}
                          onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                        <input
                          type="email"
                          value={settingsData.general.adminEmail}
                          onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Localization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <select
                          value={settingsData.general.timezone}
                          onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Africa/Windhoek">Africa/Windhoek</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                          value={settingsData.general.language}
                          onChange={(e) => updateSettings('general', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="af">Afrikaans</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                          value={settingsData.general.currency}
                          onChange={(e) => updateSettings('general', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="NAD">Namibian Dollar (NAD)</option>
                          <option value="USD">US Dollar (USD)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Maintenance Mode</span>
                          <button
                            onClick={() => toggleSetting('general', 'maintenanceMode')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.general.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Guest Browsing</span>
                          <button
                            onClick={() => toggleSetting('general', 'guestBrowsing')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.general.guestBrowsing ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.general.guestBrowsing ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Settings */}
              {activeSettingsTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Authentication
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Require Email Verification</span>
                          <button
                            onClick={() => toggleSetting('security', 'requireEmailVerification')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.security.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Two-Factor Authentication</span>
                          <button
                            onClick={() => toggleSetting('security', 'twoFactorAuth')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Require CAPTCHA</span>
                          <button
                            onClick={() => toggleSetting('security', 'requireCaptcha')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.requireCaptcha ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.security.requireCaptcha ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Min Length</label>
                        <input
                          type="number"
                          value={settingsData.security.passwordMinLength}
                          onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settingsData.security.sessionTimeout}
                          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security Policies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                        <input
                          type="number"
                          value={settingsData.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          value={settingsData.security.accountLockoutDuration}
                          onChange={(e) => updateSettings('security', 'accountLockoutDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SSL Enabled</span>
                          <button
                            onClick={() => toggleSetting('security', 'sslEnabled')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.sslEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.security.sslEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Security Headers</span>
                          <button
                            onClick={() => toggleSetting('security', 'securityHeaders')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.securityHeaders ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${settingsData.security.securityHeaders ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Payment Settings */}
              {activeSettingsTab === 'payment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Provider</label>
                        <select
                          value={settingsData.payment.provider}
                          onChange={(e) => updateSettings('payment', 'provider', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Paystack">Paystack</option>
                          <option value="Stripe">Stripe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paystack Public Key</label>
                        <input
                          type="text"
                          value={settingsData.payment.paystackPublicKey}
                          onChange={(e) => updateSettings('payment', 'paystackPublicKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settingsData.payment.commissionRate}
                          onChange={(e) => updateSettings('payment', 'commissionRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settingsData.payment.taxRate}
                          onChange={(e) => updateSettings('payment', 'taxRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Pricing Structure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Plan (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.subscriptionPricing.basic / 100}
                          onChange={(e) => {
                            const newPricing = { ...settingsData.payment.subscriptionPricing, basic: parseFloat(e.target.value) * 100 };
                            updateSettings('payment', 'subscriptionPricing', newPricing);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Plan (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.subscriptionPricing.professional / 100}
                          onChange={(e) => {
                            const newPricing = { ...settingsData.payment.subscriptionPricing, professional: parseFloat(e.target.value) * 100 };
                            updateSettings('payment', 'subscriptionPricing', newPricing);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enterprise Plan (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.subscriptionPricing.enterprise / 100}
                          onChange={(e) => {
                            const newPricing = { ...settingsData.payment.subscriptionPricing, enterprise: parseFloat(e.target.value) * 100 };
                            updateSettings('payment', 'subscriptionPricing', newPricing);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Listing Price (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.featuredListingPrice / 100}
                          onChange={(e) => updateSettings('payment', 'featuredListingPrice', parseFloat(e.target.value) * 100)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSettingsTab === 'notifications' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Email Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New User Registration</p>
                          <p className="text-sm text-gray-600">Notify when new users register</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, newUserRegistration: !settingsData.notifications.emailNotifications.newUserRegistration };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.newUserRegistration ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.notifications.emailNotifications.newUserRegistration ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Listing Posted</p>
                          <p className="text-sm text-gray-600">Notify when dealers post new vehicles</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, newListing: !settingsData.notifications.emailNotifications.newListing };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.newListing ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.notifications.emailNotifications.newListing ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment Received</p>
                          <p className="text-sm text-gray-600">Notify when payments are processed</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, paymentReceived: !settingsData.notifications.emailNotifications.paymentReceived };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.paymentReceived ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.notifications.emailNotifications.paymentReceived ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Moderation Reports</p>
                          <p className="text-sm text-gray-600">Notify when content is reported</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, moderationReport: !settingsData.notifications.emailNotifications.moderationReport };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.moderationReport ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.notifications.emailNotifications.moderationReport ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Push Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Firebase Server Key</label>
                        <input
                          type="password"
                          value={settingsData.notifications.pushNotifications.firebaseServerKey}
                          onChange={(e) => {
                            const newPushNotifications = { ...settingsData.notifications.pushNotifications, firebaseServerKey: e.target.value };
                            updateSettings('notifications', 'pushNotifications', newPushNotifications);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Push Notifications</p>
                          <p className="text-sm text-gray-600">Allow sending push notifications to users</p>
                        </div>
                        <button
                          onClick={() => {
                            const newPushNotifications = { ...settingsData.notifications.pushNotifications, enabled: !settingsData.notifications.pushNotifications.enabled };
                            updateSettings('notifications', 'pushNotifications', newPushNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.pushNotifications.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.notifications.pushNotifications.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Notification Sound</label>
                        <select
                          value={settingsData.notifications.pushNotifications.defaultSound}
                          onChange={(e) => {
                            const newPushNotifications = { ...settingsData.notifications.pushNotifications, defaultSound: e.target.value };
                            updateSettings('notifications', 'pushNotifications', newPushNotifications);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="default">Default</option>
                          <option value="chime">Chime</option>
                          <option value="alert">Alert</option>
                          <option value="notification">Notification</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Listings Settings */}
              {activeSettingsTab === 'listings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Listing Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-approve Listings</p>
                          <p className="text-sm text-gray-600">Automatically approve new listings without review</p>
                        </div>
                        <button
                          onClick={() => toggleSetting('listings', 'autoApprove')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.listings.autoApprove ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.listings.autoApprove ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Images per Listing</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={settingsData.listings.maxImages}
                          onChange={(e) => updateSettings('listings', 'maxImages', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Duration (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settingsData.listings.defaultDuration}
                          onChange={(e) => updateSettings('listings', 'defaultDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Price Negotiation</p>
                          <p className="text-sm text-gray-600">Enable price negotiation features</p>
                        </div>
                        <button
                          onClick={() => toggleSetting('listings', 'allowNegotiation')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.listings.allowNegotiation ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.listings.allowNegotiation ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Featured Listings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Slots</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={settingsData.listings.featuredSlots}
                          onChange={(e) => updateSettings('listings', 'featuredSlots', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Duration (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={settingsData.listings.featuredDuration}
                          onChange={(e) => updateSettings('listings', 'featuredDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-renew Featured</p>
                          <p className="text-sm text-gray-600">Automatically renew featured listings</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.listings.autoRenewFeatured ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.listings.autoRenewFeatured ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* API Settings */}
              {activeSettingsTab === 'api' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        API Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable API Access</p>
                          <p className="text-sm text-gray-600">Allow third-party API access</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.api.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.api.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/hour)</label>
                        <input
                          type="number"
                          min="100"
                          max="10000"
                          defaultValue={settingsData.api.rateLimit}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Version</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="v1">Version 1.0</option>
                          <option value="v2">Version 2.0</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Require API Keys</p>
                          <p className="text-sm text-gray-600">Require authentication for API access</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.api.requireAuth ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.api.requireAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Keys
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Master API Key</label>
                        <input
                          type="password"
                          defaultValue={settingsData.api.masterKey}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                        <input
                          type="password"
                          defaultValue={settingsData.api.webhookSecret}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Regenerate Keys
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Documentation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Integrations Settings */}
              {activeSettingsTab === 'integrations' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        Third-party Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Google Analytics</p>
                          <p className="text-sm text-gray-600">Track website analytics with Google Analytics</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.integrations.googleAnalytics.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.integrations.googleAnalytics.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                        <input
                          type="text"
                          defaultValue={settingsData.integrations.googleAnalytics.trackingId}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Facebook Pixel</p>
                          <p className="text-sm text-gray-600">Track conversions with Facebook Pixel</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.integrations.facebookPixel.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.integrations.facebookPixel.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                        <input
                          type="text"
                          defaultValue={settingsData.integrations.facebookPixel.pixelId}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-5 w-5" />
                        Cloud Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">AWS S3 Storage</p>
                          <p className="text-sm text-gray-600">Store images and files on Amazon S3</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.integrations.awsS3.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.integrations.awsS3.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">S3 Bucket Name</label>
                        <input
                          type="text"
                          defaultValue={settingsData.integrations.awsS3.bucketName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">AWS Region</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="us-east-1">US East (N. Virginia)</option>
                          <option value="us-west-2">US West (Oregon)</option>
                          <option value="eu-west-1">Europe (Ireland)</option>
                          <option value="af-south-1">Africa (Cape Town)</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Backup Settings */}
              {activeSettingsTab === 'backup' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HardDrive className="h-5 w-5" />
                        Backup Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto Backup</p>
                          <p className="text-sm text-gray-600">Automatically create system backups</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.backup.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          defaultValue={settingsData.backup.retentionDays}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="local">Local Storage</option>
                          <option value="s3">Amazon S3</option>
                          <option value="gcs">Google Cloud Storage</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DatabaseIcon className="h-5 w-5" />
                        Database Backup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-4">Last backup: {settingsData.backup.lastBackup}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Include User Data</p>
                          <p className="text-sm text-gray-600">Backup user profiles and preferences</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.backup.includeUserData ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.backup.includeUserData ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Include Media Files</p>
                          <p className="text-sm text-gray-600">Backup uploaded images and documents</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.backup.includeMedia ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.backup.includeMedia ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Create Backup Now
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Restore Backup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Banner Management Settings */}
              {activeSettingsTab === 'banners' && (
                <div className="space-y-6">
                  {/* Banner Configuration */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="h-5 w-5" />
                          Banner Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Banners</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            defaultValue={settingsData.banners.maxBanners}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Default Position</label>
                          <select
                            defaultValue={settingsData.banners.defaultPosition}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {settingsData.banners.positions.map(position => (
                              <option key={position} value={position}>{position}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            defaultValue={settingsData.banners.maxFileSize}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Default Duration (days)</label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            defaultValue={settingsData.banners.defaultDuration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Display Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto Rotation</p>
                            <p className="text-sm text-gray-600">Automatically rotate banners</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.autoRotation ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.autoRotation ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rotation Interval (seconds)</label>
                          <input
                            type="number"
                            min="5"
                            max="300"
                            defaultValue={settingsData.banners.rotationInterval}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Click Tracking</p>
                            <p className="text-sm text-gray-600">Track banner click events</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.clickTracking ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.clickTracking ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Impression Tracking</p>
                            <p className="text-sm text-gray-600">Track banner view events</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.impressionTracking ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.impressionTracking ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Banner Permissions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          Banner Permissions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Require Approval</p>
                            <p className="text-sm text-gray-600">New banners need admin approval</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.requireApproval ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.requireApproval ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Allow External Links</p>
                            <p className="text-sm text-gray-600">Enable links to external websites</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.allowExternalLinks ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.allowExternalLinks ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enable Scheduling</p>
                            <p className="text-sm text-gray-600">Allow scheduled banner campaigns</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.enableScheduling ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.enableScheduling ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Cloud className="h-5 w-5" />
                          Image Processing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto Compression</p>
                            <p className="text-sm text-gray-600">Automatically compress banner images</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.compressionEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Compression Quality (%)</label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            defaultValue={settingsData.banners.compressionQuality}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Watermark</p>
                            <p className="text-sm text-gray-600">Add watermark to banner images</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.watermarkEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settingsData.banners.watermarkEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {settingsData.banners.allowedFileTypes.map(type => (
                              <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                .{type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Banner Management Actions
                      </CardTitle>
                      <CardDescription>Quick actions for managing advertisement banners</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                          className="flex items-center justify-center gap-2 h-20 flex-col"
                          onClick={() => window.open('/admin/banners', '_blank')}
                        >
                          <Monitor className="h-6 w-6" />
                          <span>Manage Banners</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-2 h-20 flex-col"
                        >
                          <Plus className="h-6 w-6" />
                          <span>Create Banner</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-2 h-20 flex-col"
                        >
                          <BarChart3 className="h-6 w-6" />
                          <span>View Analytics</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-2 h-20 flex-col"
                        >
                          <Settings className="h-6 w-6" />
                          <span>Bulk Actions</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Quick Settings Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration Summary</CardTitle>
                  <CardDescription>Current platform configuration overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{settingsData.general.siteName}</div>
                      <p className="text-sm text-gray-600">Platform Name</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{settingsData.payment.paymentProvider}</div>
                      <p className="text-sm text-gray-600">Payment Provider</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{settingsData.general.timezone}</div>
                      <p className="text-sm text-gray-600">Timezone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'dealers' && activeTab !== 'listings' && activeTab !== 'subscriptions' && activeTab !== 'moderation' && activeTab !== 'analytics' && activeTab !== 'settings' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {navigation.find(nav => nav.id === activeTab)?.name} Section
              </h3>
              <p className="text-gray-600 mb-4">This section is under development.</p>
              <Button onClick={() => setActiveTab('overview')}>Back to Overview</Button>
            </div>
          )}
        </div>
      </div>

      {/* Dealer Details Modal */}
      {dealerModalOpen && selectedDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setDealerModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dealer Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setDealerModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dealer Name</label>
                    <p className="text-lg font-semibold">{selectedDealer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p>{selectedDealer.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p>{selectedDealer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p>{selectedDealer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p>{selectedDealer.address}</p>
                    <p className="text-sm text-gray-500">{selectedDealer.city}, {selectedDealer.region}</p>
                  </div>
                  {selectedDealer.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <p className="text-blue-600">{selectedDealer.website}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business License</label>
                    <p>{selectedDealer.businessLicense}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tax Number</label>
                    <p>{selectedDealer.taxNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Verification Status</label>
                    <Badge className={
                      selectedDealer.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                      selectedDealer.verificationStatus === 'Flagged' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {selectedDealer.verificationStatus}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <Badge className={
                      selectedDealer.status === 'Active' ? 'bg-green-100 text-green-800' :
                      selectedDealer.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {selectedDealer.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Joined Date</label>
                    <p>{new Date(selectedDealer.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p>{new Date(selectedDealer.lastLogin).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plan</label>
                    <p className="text-lg font-semibold">{selectedDealer.subscriptionPlan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Fee</label>
                    <p className="text-lg font-semibold">N${(selectedDealer.monthlyFee / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Status</label>
                    <Badge className={
                      selectedDealer.subscriptionStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      selectedDealer.subscriptionStatus === 'Overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {selectedDealer.subscriptionStatus}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Monthly Revenue</label>
                    <p>N${selectedDealer.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Active Listings</label>
                    <p className="text-lg font-semibold">{selectedDealer.activeListings}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Listings</label>
                    <p>{selectedDealer.totalListings}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Sales</label>
                    <p className="text-lg font-semibold">{selectedDealer.totalSales}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rating</label>
                    <p className="text-lg">⭐ {selectedDealer.rating.toFixed(1)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="flex space-x-3">
                {selectedDealer.verificationStatus === 'Pending' && (
                  <Button
                    onClick={() => {
                      handleApproveDealer(selectedDealer.id);
                      setDealerModalOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Dealer
                  </Button>
                )}
                {selectedDealer.verificationStatus === 'Pending' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRejectDealer(selectedDealer.id);
                      setDealerModalOpen(false);
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                {selectedDealer.status === 'Active' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSuspendDealer(selectedDealer.id);
                      setDealerModalOpen(false);
                    }}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                )}
                {selectedDealer.status === 'Suspended' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReactivateDealer(selectedDealer.id);
                      setDealerModalOpen(false);
                    }}
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Reactivate
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setDealerModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Details Modal */}
      {listingModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setListingModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Listing Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setListingModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Title</label>
                    <p className="text-lg font-semibold">{selectedListing.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Make</label>
                      <p>{selectedListing.make}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Model</label>
                      <p>{selectedListing.model}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Year</label>
                      <p>{selectedListing.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Price</label>
                      <p className="text-lg font-semibold">N${selectedListing.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mileage</label>
                      <p>{selectedListing.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Condition</label>
                      <p>{selectedListing.condition}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fuel Type</label>
                      <p>{selectedListing.fuelType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Transmission</label>
                      <p>{selectedListing.transmission}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Body Type</label>
                      <p>{selectedListing.bodyType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Color</label>
                      <p>{selectedListing.color}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">VIN</label>
                    <p className="font-mono text-sm">{selectedListing.vin}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Engine Size</label>
                      <p>{selectedListing.engineSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Drivetrain</label>
                      <p>{selectedListing.drivetrain}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Doors</label>
                      <p>{selectedListing.doors}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Seats</label>
                      <p>{selectedListing.seats}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration</label>
                    <p>{selectedListing.registration}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Warranty</label>
                      <Badge className={selectedListing.warranty === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {selectedListing.warranty}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service History</label>
                      <p className="text-sm">{selectedListing.serviceHistory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dealer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Dealer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dealer</label>
                    <p className="text-lg font-semibold">{selectedListing.dealerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact</label>
                    <p>{selectedListing.dealerContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p>{selectedListing.location}, {selectedListing.region}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Listing Status & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Status & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Listing Status</label>
                      <Badge className={
                        selectedListing.listingStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        selectedListing.listingStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                        selectedListing.listingStatus === 'Under Review' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {selectedListing.listingStatus}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className={
                        selectedListing.status === 'Active' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedListing.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Featured</label>
                    <div className="flex items-center gap-2">
                      <Badge className={selectedListing.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                        {selectedListing.featured ? 'Yes' : 'No'}
                      </Badge>
                      {selectedListing.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Views</label>
                      <p className="text-lg font-semibold">{selectedListing.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Inquiries</label>
                      <p className="text-lg font-semibold">{selectedListing.inquiries}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Posted</label>
                      <p>{new Date(selectedListing.datePosted).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p>{new Date(selectedListing.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedListing.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedListing.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="flex space-x-3">
                {selectedListing.listingStatus === 'Pending' && (
                  <Button
                    onClick={() => {
                      handleApproveListing(selectedListing.id);
                      setListingModalOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Listing
                  </Button>
                )}
                {selectedListing.listingStatus === 'Pending' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRejectListing(selectedListing.id);
                      setListingModalOpen(false);
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    handleFeatureListing(selectedListing.id);
                    setListingModalOpen(false);
                  }}
                  className={selectedListing.featured ? "border-yellow-300 text-yellow-600 hover:bg-yellow-50" : "border-gray-300 text-gray-600 hover:bg-gray-50"}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {selectedListing.featured ? 'Remove Feature' : 'Feature Listing'}
                </Button>
              </div>
              <Button variant="outline" onClick={() => setListingModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {reportModalOpen && selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto pt-20 pb-8"
          onClick={() => {
            console.log('Closing modal');
            setReportModalOpen(false);
          }}
        >
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 mb-8" onClick={(e) => {
            console.log('Modal content clicked');
            e.stopPropagation();
          }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
              <Button variant="ghost" size="sm" onClick={() => {
                console.log('Close button clicked');
                setReportModalOpen(false);
              }}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlagIcon className="h-5 w-5" />
                    Report Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report ID</label>
                    <p className="font-mono text-sm">{selectedReport.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Target</label>
                    <p className="text-lg font-semibold">{selectedReport.targetTitle}</p>
                    <p className="text-sm text-gray-500">{selectedReport.targetType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Report Reason</label>
                      <p>{selectedReport.reportReason}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p>{selectedReport.reportCategory}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Severity</label>
                      <Badge className={
                        selectedReport.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        selectedReport.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        selectedReport.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {selectedReport.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className={
                        selectedReport.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedReport.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {selectedReport.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date Reported</label>
                      <p>{new Date(selectedReport.dateReported).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p>{new Date(selectedReport.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reporter Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Reporter Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter Name</label>
                    <p className="text-lg font-semibold">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p>{selectedReport.reporterEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter ID</label>
                    <p className="font-mono text-sm">{selectedReport.reportedBy}</p>
                  </div>
                  {selectedReport.dealerName && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Associated Dealer</label>
                      <p>{selectedReport.dealerName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Moderation Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    Moderation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned To</label>
                    <p>{selectedReport.assignedTo || 'Unassigned'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Action Taken</label>
                    <p>{selectedReport.actionTaken || 'No action yet'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Resolution</label>
                    <p>{selectedReport.resolution || 'Pending review'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Evidence Files</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.evidence.map((file: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Review Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Admin Notes</label>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedReport.reviewNotes || 'No review notes yet.'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Add Note</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      placeholder="Add your review notes here..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Report Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedReport.description}</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="flex space-x-3">
                {selectedReport.status === 'Pending' && (
                  <>
                    <Button
                      onClick={() => {
                        handleApproveReport(selectedReport.id);
                        setReportModalOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleRejectReport(selectedReport.id);
                        setReportModalOpen(false);
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Report
                    </Button>
                  </>
                )}
                {!selectedReport.assignedTo && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleAssignReport(selectedReport.id, 'admin-001');
                      setReportModalOpen(false);
                    }}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    <UserCheck2 className="h-4 w-4 mr-2" />
                    Assign to Me
                  </Button>
                )}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={() => setModerateMenuOpen(!moderateMenuOpen)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Moderate
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  {moderateMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-2">
                        {selectedReport.type === 'listing' && (
                          <>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'Listing Removed',
                                  description: 'The reported listing has been removed',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Remove Listing</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'Warning Issued',
                                  description: 'Dealer has been warned about the listing',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-600">Warn Dealer</span>
                            </button>
                          </>
                        )}
                        {selectedReport.type === 'user' && (
                          <>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'User Suspended',
                                  description: 'The reported user has been suspended',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <UserX className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Suspend User</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'User Banned',
                                  description: 'The reported user has been permanently banned',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <Ban className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Ban User Permanently</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'Warning Sent',
                                  description: 'User has been warned',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-yellow-600">Send Warning</span>
                            </button>
                          </>
                        )}
                        {selectedReport.type === 'comment' && (
                          <>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'Comment Removed',
                                  description: 'The reported comment has been removed',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Remove Comment</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                              onClick={() => {
                                handleApproveReport(selectedReport.id);
                                showToast({
                                  title: 'Warning Issued',
                                  description: 'User has been warned about the comment',
                                  type: 'success',
                                });
                                setModerateMenuOpen(false);
                                setReportModalOpen(false);
                              }}
                            >
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="text-orange-600">Warn User</span>
                            </button>
                          </>
                        )}
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                          onClick={() => {
                            setModerateMenuOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">Cancel</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      <Dialog open={generateReportModalOpen} onOpenChange={setGenerateReportModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Reports</DialogTitle>
            <DialogDescription>
              Create comprehensive reports for dealer performance, revenue, and analytics
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Report Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dealer-performance">Dealer Performance Report</option>
                <option value="revenue">Revenue & Financial Report</option>
                <option value="subscriptions">Subscription Analytics</option>
                <option value="analytics">Platform Analytics Report</option>
                <option value="listings">Listings Overview Report</option>
              </select>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <select
                value={reportDateRange}
                onChange={(e) => setReportDateRange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setReportFormat('pdf')}
                  className={`px-4 py-3 border rounded-lg text-center transition-colors ${
                    reportFormat === 'pdf'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm font-medium">PDF</span>
                  </div>
                </button>
                <button
                  onClick={() => setReportFormat('csv')}
                  className={`px-4 py-3 border rounded-lg text-center transition-colors ${
                    reportFormat === 'csv'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Download className="h-5 w-5" />
                    <span className="text-sm font-medium">CSV</span>
                  </div>
                </button>
                <button
                  onClick={() => setReportFormat('excel')}
                  className={`px-4 py-3 border rounded-lg text-center transition-colors ${
                    reportFormat === 'excel'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm font-medium">Excel</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Report Preview Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Report Details:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  <strong>Type:</strong>{' '}
                  {reportType === 'dealer-performance' && 'Dealer Performance Report'}
                  {reportType === 'revenue' && 'Revenue & Financial Report'}
                  {reportType === 'subscriptions' && 'Subscription Analytics'}
                  {reportType === 'analytics' && 'Platform Analytics Report'}
                  {reportType === 'listings' && 'Listings Overview Report'}
                </li>
                <li>
                  <strong>Period:</strong>{' '}
                  {reportDateRange === 'last-7-days' && 'Last 7 Days'}
                  {reportDateRange === 'last-30-days' && 'Last 30 Days'}
                  {reportDateRange === 'last-90-days' && 'Last 90 Days'}
                  {reportDateRange === 'this-month' && 'This Month'}
                  {reportDateRange === 'last-month' && 'Last Month'}
                  {reportDateRange === 'this-year' && 'This Year'}
                </li>
                <li>
                  <strong>Format:</strong> {reportFormat.toUpperCase()}
                </li>
              </ul>
            </div>

            {/* Report Contents based on type */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Report will include:</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                {reportType === 'dealer-performance' && (
                  <>
                    <li>Dealer listing statistics</li>
                    <li>Sales performance metrics</li>
                    <li>Customer engagement data</li>
                    <li>Revenue contribution</li>
                  </>
                )}
                {reportType === 'revenue' && (
                  <>
                    <li>Total revenue breakdown</li>
                    <li>Subscription payments</li>
                    <li>Payment method distribution</li>
                    <li>Revenue trends</li>
                  </>
                )}
                {reportType === 'subscriptions' && (
                  <>
                    <li>Active subscriptions</li>
                    <li>Plan distribution</li>
                    <li>Renewal rates</li>
                    <li>Churn analysis</li>
                  </>
                )}
                {reportType === 'analytics' && (
                  <>
                    <li>Platform traffic statistics</li>
                    <li>User engagement metrics</li>
                    <li>Popular listings</li>
                    <li>Conversion rates</li>
                  </>
                )}
                {reportType === 'listings' && (
                  <>
                    <li>Total listings by category</li>
                    <li>Vehicle type distribution</li>
                    <li>Price range analysis</li>
                    <li>Listing performance</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setGenerateReportModalOpen(false);
              }}
              disabled={isGeneratingReport}
            >
              Cancel
            </Button>
            <Button
              onClick={generateReport}
              disabled={isGeneratingReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGeneratingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Processing Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Process Dealer Payments</DialogTitle>
            <DialogDescription>
              Select and process pending subscription payments from dealers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Filter and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setSelectedPayments([]);
                  }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending Payments</option>
                  <option value="overdue">Overdue Payments</option>
                </select>
                <div className="text-sm text-gray-600">
                  {selectedPayments.length} selected
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllPayments}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearPaymentSelection}>
                  Clear
                </Button>
              </div>
            </div>

            {/* Payment List */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dealer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dealers
                    .filter(dealer => {
                      if (paymentFilter === 'pending') return dealer.subscriptionStatus === 'Pending';
                      if (paymentFilter === 'overdue') return dealer.subscriptionStatus === 'Overdue';
                      return true;
                    })
                    .map((dealer) => (
                      <tr
                        key={dealer.id}
                        className={`hover:bg-gray-50 ${
                          selectedPayments.includes(dealer.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(dealer.id)}
                            onChange={() => togglePaymentSelection(dealer.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{dealer.name}</div>
                            <div className="text-sm text-gray-500">{dealer.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{dealer.subscriptionPlan}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          N${(dealer.monthlyFee / 100).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              dealer.subscriptionStatus === 'Active'
                                ? 'default'
                                : dealer.subscriptionStatus === 'Pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {dealer.subscriptionStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-blue-800">
                  <strong>Total to process:</strong> {selectedPayments.length} payment(s)
                </p>
                <p className="text-sm font-bold text-blue-900">
                  Total Amount: N$
                  {(
                    dealers
                      .filter(d => selectedPayments.includes(d.id))
                      .reduce((sum, d) => sum + (d.monthlyFee || 0), 0) / 100
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPaymentModalOpen(false);
                setSelectedPayments([]);
                setPaymentFilter('pending');
              }}
              disabled={isProcessingPayments}
            >
              Cancel
            </Button>
            <Button
              onClick={processSelectedPayments}
              disabled={isProcessingPayments || selectedPayments.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessingPayments ? 'Processing...' : `Process ${selectedPayments.length} Payment(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Plan Modal */}
      <Dialog open={editPlanModalOpen} onOpenChange={setEditPlanModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>
              Update plan details, pricing, and features
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <Input
                value={planFormData.name || ''}
                onChange={(e) => setPlanFormData({...planFormData, name: e.target.value})}
                placeholder="Plan name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={planFormData.description || ''}
                onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})}
                placeholder="Plan description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (NAD)
                </label>
                <Input
                  type="number"
                  value={planFormData.price || ''}
                  onChange={(e) => setPlanFormData({...planFormData, price: parseFloat(e.target.value)})}
                  placeholder="199.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days)
                </label>
                <Input
                  type="number"
                  value={planFormData.duration || ''}
                  onChange={(e) => setPlanFormData({...planFormData, duration: parseInt(e.target.value)})}
                  placeholder="30"
                />
              </div>
            </div>

            {/* Max Listings and Photos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Listings
                </label>
                <Input
                  type="number"
                  value={planFormData.maxListings || ''}
                  onChange={(e) => setPlanFormData({...planFormData, maxListings: parseInt(e.target.value)})}
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Photos per Listing
                </label>
                <Input
                  type="number"
                  value={planFormData.maxPhotos || ''}
                  onChange={(e) => setPlanFormData({...planFormData, maxPhotos: parseInt(e.target.value)})}
                  placeholder="5"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={planFormData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setPlanFormData({...planFormData, isActive: e.target.value === 'active'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2 mb-2">
                {(planFormData.features || []).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...planFormData.features];
                        newFeatures[index] = e.target.value;
                        setPlanFormData({...planFormData, features: newFeatures});
                      }}
                      placeholder="Feature description"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFeature}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditPlanModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePlan}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promo Code Modal */}
      <Dialog open={editPromoModalOpen} onOpenChange={setEditPromoModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Update promo code details and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <Input
                value={promoFormData.code}
                onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                placeholder="PROMO2024"
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select
                  value={promoFormData.discountType}
                  onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                <Input
                  type="number"
                  value={promoFormData.discountValue}
                  onChange={(e) => setPromoFormData({ ...promoFormData, discountValue: e.target.value })}
                  placeholder="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Input
                  type="date"
                  value={promoFormData.startDate}
                  onChange={(e) => setPromoFormData({ ...promoFormData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <Input
                  type="date"
                  value={promoFormData.endDate}
                  onChange={(e) => setPromoFormData({ ...promoFormData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
              <Input
                type="number"
                value={promoFormData.usageLimit}
                onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: e.target.value })}
                placeholder="100 (leave empty for unlimited)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Plans</label>
              <div className="space-y-2">
                {subscriptionPlans.map((plan) => (
                  <label key={plan.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={promoFormData.applicablePlans.includes(plan.id)}
                      onChange={(e) => handlePlanCheckboxChange(plan.id, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">{plan.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPromoModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePromo} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Promo Code Confirmation Dialog */}
      <Dialog open={deletePromoModalOpen} onOpenChange={setDeletePromoModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promo code?
            </DialogDescription>
          </DialogHeader>

          {promoToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono text-sm font-bold">
                    {promoToDelete.code}
                  </code>
                  <span className="text-sm font-medium">
                    {promoToDelete.discountType === 'PERCENTAGE'
                      ? `${promoToDelete.discountValue}%`
                      : `N$${(promoToDelete.discountValue / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Used: {promoToDelete.usageCount}{promoToDelete.usageLimit && ` / ${promoToDelete.usageLimit}`}</div>
                  <div>Expires: {promoToDelete.endDate ? new Date(promoToDelete.endDate).toLocaleDateString() : 'Never'}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                This action cannot be undone. The promo code will be permanently deleted.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDeletePromoModalOpen(false);
              setPromoToDelete(null);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeletePromo}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Promo Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Featured Modal */}
      <Dialog open={featuredModalOpen} onOpenChange={setFeaturedModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Featured Listings</DialogTitle>
            <DialogDescription>
              Select listings to feature on the homepage
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dealer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => {
                            setSelectedListings(prev =>
                              prev.includes(listing.id)
                                ? prev.filter(id => id !== listing.id)
                                : [...prev, listing.id]
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{listing.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{listing.dealer}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={listing.status === 'Active' ? 'default' : 'secondary'}
                        >
                          {listing.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFeaturedModalOpen(false);
                setSelectedListings([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(`${selectedListings.length} listing(s) set as featured!`);
                setFeaturedModalOpen(false);
                setSelectedListings([]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedListings.length === 0}
            >
              Set as Featured ({selectedListings.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Settings Modal */}
      <Dialog open={bulkSettingsModalOpen} onOpenChange={setBulkSettingsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Settings</DialogTitle>
            <DialogDescription>
              Apply settings to multiple listings at once
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Change Status</option>
                <option>Update Category</option>
                <option>Adjust Pricing</option>
                <option>Set Visibility</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Value</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Active</option>
                <option>Pending</option>
                <option>Sold</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action will affect all selected listings. Please review carefully before applying.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkSettingsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert('Bulk settings applied successfully!');
                setBulkSettingsModalOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Newsletter Modal */}
      <Dialog open={newsletterModalOpen} onOpenChange={setNewsletterModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Newsletter to Dealers</DialogTitle>
            <DialogDescription>
              Compose and send a newsletter to dealers on your platform
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Recipient Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipients</label>
              <select
                value={recipientFilter}
                onChange={(e) => setRecipientFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dealers ({dealers.length})</option>
                <option value="active">
                  Active Dealers ({dealers.filter(d => d.status === 'Active').length})
                </option>
                <option value="pending">
                  Pending Dealers ({dealers.filter(d => d.verificationStatus === 'Pending').length})
                </option>
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Enter newsletter subject..."
                value={newsletterSubject}
                onChange={(e) => setNewsletterSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Enter your newsletter message..."
                value={newsletterMessage}
                onChange={(e) => setNewsletterMessage(e.target.value)}
                rows={10}
                className="resize-none"
              />
            </div>

            {/* Preview Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong> This newsletter will be sent to{' '}
                {recipientFilter === 'all' && dealers.length}
                {recipientFilter === 'active' && dealers.filter(d => d.status === 'Active').length}
                {recipientFilter === 'pending' && dealers.filter(d => d.verificationStatus === 'Pending').length}
                {' '}dealers via email.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewsletterModalOpen(false);
                setNewsletterSubject('');
                setNewsletterMessage('');
                setRecipientFilter('all');
              }}
              disabled={isSendingNewsletter}
            >
              Cancel
            </Button>
            <Button
              onClick={sendNewsletter}
              disabled={isSendingNewsletter || !newsletterSubject.trim() || !newsletterMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSendingNewsletter ? 'Sending...' : 'Send Newsletter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setPreviewBanner(null)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Banner Preview</h2>
              <button
                onClick={() => setPreviewBanner(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{previewBanner.title}</h3>
                <Badge className={previewBanner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {previewBanner.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Banner Image Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {previewBanner.imageUrl ? (
                  <img
                    src={previewBanner.imageUrl}
                    alt={previewBanner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-gray-400">
                    <div>
                      <Image className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{previewBanner.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className="font-medium">{previewBanner.priority || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Link URL</p>
                  <p className="font-medium text-blue-600 truncate">{previewBanner.linkUrl || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{previewBanner.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{previewBanner.startDate ? new Date(previewBanner.startDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">{previewBanner.endDate ? new Date(previewBanner.endDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Clicks</p>
                  <p className="font-medium text-blue-600">{(previewBanner.clicks || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Impressions</p>
                  <p className="font-medium text-green-600">{(previewBanner.impressions || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPreviewBanner(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setEditingBanner(previewBanner);
                    setPreviewBanner(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Banner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingBanner(null)}>
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Banner</h2>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                <Input
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                  placeholder="Enter banner title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-gray-600">
                  {editingBanner.position} (Fixed)
                </div>
                <p className="text-xs text-gray-500 mt-1">Banner position cannot be changed. This slot is fixed on the website.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <Input
                  value={editingBanner.imageUrl}
                  onChange={(e) => setEditingBanner({...editingBanner, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                <Input
                  value={editingBanner.linkUrl || ''}
                  onChange={(e) => setEditingBanner({...editingBanner, linkUrl: e.target.value})}
                  placeholder="/vehicles"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <Input
                    type="number"
                    value={editingBanner.priority || 0}
                    onChange={(e) => setEditingBanner({...editingBanner, priority: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editingBanner.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingBanner({...editingBanner, isActive: e.target.value === 'active'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Banner Size Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                  <Image className="h-4 w-4 mr-2" />
                  Recommended Banner Sizes & Formats
                </h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>HERO:</strong> 1200x600px (2:1 ratio) - Full width banner</p>
                  <p><strong>MAIN:</strong> 1200x600px (2:1 ratio) - Full width banner</p>
                  <p><strong>SIDEBAR:</strong> 800x600px (4:3 ratio) - Vertical banner</p>
                  <p className="mt-2"><strong>Formats:</strong> JPG, PNG, WebP • Max size: 2MB • Use high-quality images</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditingBanner(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/admin/banners/${editingBanner.id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          title: editingBanner.title,
                          subtitle: editingBanner.subtitle,
                          description: editingBanner.description,
                          imageUrl: editingBanner.imageUrl,
                          linkUrl: editingBanner.linkUrl,
                          buttonText: editingBanner.buttonText,
                          isActive: editingBanner.isActive,
                          position: editingBanner.position,
                          priority: editingBanner.priority,
                          startDate: editingBanner.startDate,
                          endDate: editingBanner.endDate,
                          backgroundColor: editingBanner.backgroundColor,
                          textColor: editingBanner.textColor,
                          overlayOpacity: editingBanner.overlayOpacity
                        }),
                      });

                      if (response.ok) {
                        alert('Banner updated successfully! Changes will appear on the site immediately.');
                        setEditingBanner(null);
                        fetchBanners(); // Refresh the list
                      } else {
                        alert('Failed to update banner. Please try again.');
                      }
                    } catch (error) {
                      console.error('Error updating banner:', error);
                      alert('An error occurred while updating the banner.');
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Dealer Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Dealer</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this dealer? Their listings will be hidden from public view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for suspension (optional)
              </label>
              <Textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Enter reason for suspension..."
                rows={3}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSuspendDialogOpen(false);
                setSuspendingDealerId(null);
                setSuspensionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSuspendDealer}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Suspend Dealer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dealer Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Dealer</DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <p className="font-semibold">⚠️ WARNING: This action cannot be undone!</p>
                <p>This will permanently delete the dealer and all associated data including:</p>
                <ul className="list-disc list-inside text-sm">
                  <li>All vehicle listings</li>
                  <li>Customer leads and messages</li>
                  <li>Payment history</li>
                  <li>Analytics data</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for deletion (REQUIRED) <span className="text-red-600">*</span>
              </label>
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Enter reason for deletion..."
                rows={3}
                className="w-full"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletingDealerId(null);
                setDeleteReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteDealer}
              disabled={!deleteReason.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription Management Dialog */}
      <Dialog open={subscriptionModalOpen} onOpenChange={setSubscriptionModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription Plan</DialogTitle>
            <DialogDescription>
              {selectedDealer && (
                <span>Update the subscription plan for <strong>{selectedDealer.name}</strong></span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {subscriptionPlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {subscriptionPlans.map((plan) => {
                  const features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features);
                  const isSelected = selectedPlanId === plan.id;
                  const isCurrent = selectedDealer?.subscriptionPlanId === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-2 right-3">
                          <Badge className="bg-green-600 text-white text-xs">Current Plan</Badge>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-blue-600">
                            N${(plan.price / 100).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">/month</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-gray-700">
                            {plan.maxListings === 0 ? 'Unlimited' : plan.maxListings} listings
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-gray-700">{plan.maxPhotos} photos/listing</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center gap-2 text-blue-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Selected</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSubscriptionModalOpen(false);
                setSelectedDealer(null);
                setSelectedPlanId('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubscription}
              disabled={!selectedPlanId || selectedPlanId === selectedDealer?.subscriptionPlanId}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dealer Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Reject Dealership Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this dealership application. This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection <span className="text-red-600">*</span>
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection (e.g., incomplete documentation, invalid business license)..."
                rows={4}
                className="w-full"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectingDealerId(null);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRejectDealer}
              disabled={!rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dealer Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Ban Dealership Permanently</DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <p className="font-semibold text-red-600">⚠️ WARNING: This action cannot be undone!</p>
                <p>Banning will permanently remove this dealership from the platform and prevent them from re-registering.</p>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>All listings will be removed immediately</li>
                  <li>All users will be deactivated</li>
                  <li>Email and business name will be blacklisted</li>
                  <li>Cannot create new accounts</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for ban (REQUIRED) <span className="text-red-600">*</span>
              </label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for ban (e.g., fraud, policy violations, illegal activity)..."
                rows={4}
                className="w-full"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBanDialogOpen(false);
                setBanningDealerId(null);
                setBanReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBanDealer}
              disabled={!banReason.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ban Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dealer Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Dealership Details</DialogTitle>
            <DialogDescription>
              Update dealership information. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          {editingDealer && (
            <div className="space-y-6 py-4">
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <Input
                      value={editingDealer.name || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, name: e.target.value})}
                      placeholder="Business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <Input
                      value={editingDealer.contactPerson || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, contactPerson: e.target.value})}
                      placeholder="Contact person"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={editingDealer.email || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, email: e.target.value})}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      value={editingDealer.phone || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, phone: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <Input
                      value={editingDealer.address || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, address: e.target.value})}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      value={editingDealer.city || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <Input
                      value={editingDealer.region || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, region: e.target.value})}
                      placeholder="Region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <Input
                      value={editingDealer.postalCode || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, postalCode: e.target.value})}
                      placeholder="Postal code"
                    />
                  </div>
                </div>
              </div>

              {/* Business Registration */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Business Registration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business License Number
                    </label>
                    <Input
                      value={editingDealer.businessLicense || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, businessLicense: e.target.value})}
                      placeholder="Business license"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Number
                    </label>
                    <Input
                      value={editingDealer.taxNumber || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, taxNumber: e.target.value})}
                      placeholder="Tax number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type
                    </label>
                    <Input
                      value={editingDealer.businessType || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, businessType: e.target.value})}
                      placeholder="Business type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input
                      value={editingDealer.website || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, website: e.target.value})}
                      placeholder="Website URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingDealer(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                showToast({
                  title: 'Coming Soon',
                  description: 'Edit functionality will be implemented in the next update.',
                  variant: 'info',
                  duration: 3000
                });
                setEditDialogOpen(false);
                setEditingDealer(null);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve All Pending Dialog */}
      <Dialog open={approveAllPendingDialogOpen} onOpenChange={setApproveAllPendingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve All Pending Listings</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve all pending listings? This will:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Set all pending listings to &quot;Approved&quot; status</li>
              <li>Make them visible to the public</li>
              <li>Send approval notification emails to all affected dealers</li>
              <li>
                Approve{' '}
                <span className="font-semibold text-gray-900">
                  {listings.filter(l => l.listingStatus === 'Pending').length}
                </span>
                {' '}pending listing(s)
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveAllPendingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproveAllPending}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* High Priority Reports Modal */}
      <Dialog open={highPriorityModalOpen} onOpenChange={setHighPriorityModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              High Priority Reports
            </DialogTitle>
            <DialogDescription>
              Urgent reports requiring immediate attention (High & Critical severity)
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports
                    .filter(r =>
                      (r.severity === 'High' || r.severity === 'Critical') &&
                      (r.status === 'Pending' || r.status === 'Under Review')
                    )
                    .map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{report.targetTitle}</div>
                          <div className="text-xs text-gray-500">{report.reportReason}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{report.targetType}</div>
                          <div className="text-xs text-gray-500">{report.reportCategory}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{report.reporterName}</div>
                          <div className="text-xs text-gray-500">{report.reporterEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }>
                            {report.severity}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                setSelectedReport(report);
                                setHighPriorityModalOpen(false);
                                setReportModalOpen(true);
                              }}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-800"
                              onClick={() => {
                                handleApproveReport(report.id);
                              }}
                              title="Resolve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => {
                                handleRejectReport(report.id);
                              }}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {reports.filter(r =>
              (r.severity === 'High' || r.severity === 'Critical') &&
              (r.status === 'Pending' || r.status === 'Under Review')
            ).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No high priority reports found</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHighPriorityModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleBulkBanUsers();
                setHighPriorityModalOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Ban className="h-4 w-4 mr-2" />
              Resolve All Critical
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Reports Modal */}
      <Dialog open={customReportModalOpen} onOpenChange={setCustomReportModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Custom Reports
            </DialogTitle>
            <DialogDescription>
              Generate custom analytics reports based on your criteria
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Report Type</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="reportType" id="traffic" className="h-4 w-4" defaultChecked />
                    <label htmlFor="traffic" className="text-sm cursor-pointer flex-1">Traffic & User Behavior</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="reportType" id="revenue" className="h-4 w-4" />
                    <label htmlFor="revenue" className="text-sm cursor-pointer flex-1">Revenue & Subscriptions</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="reportType" id="listings" className="h-4 w-4" />
                    <label htmlFor="listings" className="text-sm cursor-pointer flex-1">Listing Performance</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="reportType" id="geographic" className="h-4 w-4" />
                    <label htmlFor="geographic" className="text-sm cursor-pointer flex-1">Geographic Distribution</label>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Date Range</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="dateRange" id="last7" className="h-4 w-4" defaultChecked />
                    <label htmlFor="last7" className="text-sm cursor-pointer flex-1">Last 7 Days</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="dateRange" id="last30" className="h-4 w-4" />
                    <label htmlFor="last30" className="text-sm cursor-pointer flex-1">Last 30 Days</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="dateRange" id="last90" className="h-4 w-4" />
                    <label htmlFor="last90" className="text-sm cursor-pointer flex-1">Last 90 Days</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="dateRange" id="custom" className="h-4 w-4" />
                    <label htmlFor="custom" className="text-sm cursor-pointer flex-1">Custom Range</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold mb-3">Report Preview</h4>
              <p className="text-sm text-gray-600 mb-4">
                Traffic & User Behavior report for the last 7 days
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-blue-600">
                    {((analyticsData.traffic.daily || []).slice(-7).reduce((sum, day) => sum + (day.views || 0), 0)).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Total Views</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-green-600">
                    {((analyticsData.traffic.daily || []).slice(-7).reduce((sum, day) => sum + (day.visitors || 0), 0)).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Unique Visitors</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-2xl font-bold text-purple-600">
                    {(analyticsData.traffic.daily || []).slice(-7).reduce((sum, day) => sum + (day.conversions || 0), 0)}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Conversions</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomReportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleExportAnalyticsData();
                setCustomReportModalOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Visualization Modal */}
      <Dialog open={dataVisualizationModalOpen} onOpenChange={setDataVisualizationModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Data Visualization
            </DialogTitle>
            <DialogDescription>
              Interactive charts and graphs of your analytics data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Traffic Sources Visualization */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Traffic Sources Distribution</h4>
              <div className="space-y-3">
                {(analyticsData.traffic.sources || []).map((source, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{source.name}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {source.visitors.toLocaleString()} ({source.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Performance Visualization */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Top Performing Vehicle Makes</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Make</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">Inquiries</th>
                      <th className="text-right py-2">Sales</th>
                      <th className="text-right py-2">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analyticsData.listings.performance || []).map((make, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{make.make}</td>
                        <td className="text-right">{make.views.toLocaleString()}</td>
                        <td className="text-right">{make.inquiries}</td>
                        <td className="text-right">{make.conversions}</td>
                        <td className="text-right">
                          {make.views > 0 ? ((make.conversions / make.views) * 100).toFixed(2) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Revenue by Region</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(analyticsData.geographic || []).map((region, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border">
                    <div className="text-lg font-bold text-gray-900">{region.region}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {region.users.toLocaleString()} users
                    </div>
                    <div className="text-sm font-semibold text-green-600 mt-1">
                      N${(region.revenue / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {region.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDataVisualizationModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleExportAnalyticsData();
                showToast({
                  title: 'Chart Data Exported',
                  description: 'Visualization data has been exported',
                  type: 'success',
                });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Chart Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Analytics Modal */}
      <Dialog open={configureAnalyticsModalOpen} onOpenChange={setConfigureAnalyticsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-gray-600" />
              Configure Analytics
            </DialogTitle>
            <DialogDescription>
              Customize analytics tracking and reporting settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Tracking Settings */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Tracking Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Page View Tracking</p>
                    <p className="text-xs text-gray-500">Track page views across the platform</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">User Event Tracking</p>
                    <p className="text-xs text-gray-500">Track user interactions and events</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Conversion Tracking</p>
                    <p className="text-xs text-gray-500">Track lead generation and sales conversions</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Revenue Tracking</p>
                    <p className="text-xs text-gray-500">Track subscription and payment revenue</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
              </div>
            </div>

            {/* Report Settings */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Report Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default Date Range</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last 12 Months</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Report Timezone</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>Africa/Windhoek (CAT)</option>
                    <option>UTC</option>
                    <option>Africa/Johannesburg (SAST)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency Format</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>NAD (Namibian Dollar)</option>
                    <option>USD (US Dollar)</option>
                    <option>EUR (Euro)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Data Retention</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Analytics Data Retention Period</label>
                  <select className="w-full mt-1 p-2 border rounded-md text-sm">
                    <option>6 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>5 Years</option>
                    <option>Indefinite</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How long to keep historical analytics data
                  </p>
                </div>
              </div>
            </div>

            {/* Email Reports */}
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-4">Automated Reports</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Daily Summary Email</p>
                    <p className="text-xs text-gray-500">Receive daily analytics summary</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Weekly Performance Report</p>
                    <p className="text-xs text-gray-500">Receive weekly performance insights</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Monthly Executive Summary</p>
                    <p className="text-xs text-gray-500">Comprehensive monthly report</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigureAnalyticsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                showToast({
                  title: 'Settings Saved',
                  description: 'Analytics configuration has been updated',
                  type: 'success',
                });
                setConfigureAnalyticsModalOpen(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  );
}
