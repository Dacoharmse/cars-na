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
import { MessagingCenter } from '@/components/admin/MessagingCenter';
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
  Check,
  Crown,
  HandCoins,
  Send,
  FileDown,
  Megaphone,
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

// Sell Your Car Management Component
function SellYourCarManagement({ showToast }: { showToast: any }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [autoModerate, setAutoModerate] = useState(false);
  const [loadingAutoModerate, setLoadingAutoModerate] = useState(false);

  useEffect(() => {
    fetchListings();
    fetchAutoModerate();
  }, [filterStatus]);

  const fetchAutoModerate = async () => {
    try {
      const response = await fetch('/api/admin/settings/auto-moderate');
      if (response.ok) {
        const data = await response.json();
        setAutoModerate(data.enabled);
      }
    } catch (error) {
      console.error('Error fetching auto-moderate setting:', error);
    }
  };

  const toggleAutoModerate = async () => {
    try {
      setLoadingAutoModerate(true);
      const newValue = !autoModerate;

      const response = await fetch('/api/admin/settings/auto-moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      if (!response.ok) throw new Error('Failed to update auto-moderate');

      setAutoModerate(newValue);
      showToast({
        title: newValue ? 'Auto-Moderate Enabled' : 'Auto-Moderate Disabled',
        description: newValue
          ? 'New listings will be automatically approved.'
          : 'New listings will require manual approval.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error toggling auto-moderate:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update auto-moderate setting',
        variant: 'error',
      });
    } finally {
      setLoadingAutoModerate(false);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus.toUpperCase());
      }

      const response = await fetch(`/api/admin/sell-listings?${params}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Fetch listings error:', data);
        throw new Error(data.details || data.error || 'Failed to fetch listings');
      }

      setListings(data.listings || []);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      showToast({
        title: 'Error',
        description: error.message || 'Failed to load listings',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedListing) return;

    try {
      const response = await fetch('/api/admin/sell-listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listingId: selectedListing.id,
          status: 'APPROVED',
        }),
      });

      if (!response.ok) throw new Error('Failed to approve listing');

      showToast({
        title: 'Listing Approved',
        description: 'The seller has been notified via email.',
        variant: 'success',
      });

      setShowApproveDialog(false);
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error('Error approving listing:', error);
      showToast({
        title: 'Error',
        description: 'Failed to approve listing',
        variant: 'error',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedListing) return;

    try {
      const response = await fetch('/api/admin/sell-listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          listingId: selectedListing.id,
          status: 'REJECTED',
          rejectionReason,
        }),
      });

      if (!response.ok) throw new Error('Failed to reject listing');

      showToast({
        title: 'Listing Rejected',
        description: 'The listing has been marked as rejected.',
        variant: 'success',
      });

      setShowRejectDialog(false);
      setSelectedListing(null);
      setRejectionReason('');
      fetchListings();
    } catch (error) {
      console.error('Error rejecting listing:', error);
      showToast({
        title: 'Error',
        description: 'Failed to reject listing',
        variant: 'error',
      });
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/sell-listings?id=${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete listing');

      showToast({
        title: 'Listing Deleted',
        description: 'The listing has been permanently removed.',
        variant: 'success',
      });

      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete listing',
        variant: 'error',
      });
    }
  };

  const filteredListings = listings.filter(listing => {
    const searchLower = searchTerm.toLowerCase();
    return (
      listing.make.toLowerCase().includes(searchLower) ||
      listing.model.toLowerCase().includes(searchLower) ||
      listing.userName.toLowerCase().includes(searchLower) ||
      listing.userEmail.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Pending' },
      APPROVED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Approved' },
      REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Rejected' },
    };
    const variant = variants[status] || variants.PENDING;
    return (
      <Badge className={`${variant.bg} ${variant.text}`}>{variant.label}</Badge>
    );
  };

  const stats = {
    total: listings.length,
    pending: listings.filter(l => l.status === 'PENDING').length,
    approved: listings.filter(l => l.status === 'APPROVED').length,
    rejected: listings.filter(l => l.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sell Your Car Listings</h2>
          <p className="text-sm text-slate-400 mt-1">
            Auto-Moderate: {autoModerate ? 'Enabled' : 'Disabled'}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Auto-Moderate Toggle */}
          <div className="flex items-center gap-3 px-4 py-2 bg-[#0D1117] rounded-lg border border-white/[0.06]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`h-4 w-4 ${autoModerate ? 'text-green-600' : 'text-slate-500'}`} />
              <span className="text-sm font-medium text-slate-300">Auto-Approve</span>
            </div>
            <button
              onClick={toggleAutoModerate}
              disabled={loadingAutoModerate}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                autoModerate ? 'bg-green-600' : 'bg-white/[0.08]'
              } ${loadingAutoModerate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                  autoModerate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-white/[0.1] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchListings()}>
            <Download className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#111827] border-white/[0.06]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Listings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-white/[0.06]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Approval</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-white/[0.06]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111827] border-white/[0.06]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06]">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 -mb-px font-medium text-sm border-b-2 transition-colors ${
              filterStatus === status
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-white hover:border-white/[0.1]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings Table */}
      <Card className="bg-[#111827] border-white/[0.06]">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Loading listings...</p>
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Car className="h-16 w-16 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-medium">No listings found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0D1117]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-[#0D1117]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-white/[0.06] rounded flex items-center justify-center">
                            <Car className="h-6 w-6 text-slate-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {listing.year} {listing.make} {listing.model}
                            </div>
                            <div className="text-sm text-slate-500">{listing.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{listing.userName}</div>
                        <div className="text-sm text-slate-500">{listing.userEmail}</div>
                        <div className="text-sm text-slate-500">{listing.userPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          N$ {listing.price?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(listing.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {listing.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedListing(listing);
                                  setShowApproveDialog(true);
                                }}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedListing(listing);
                                  setShowRejectDialog(true);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(listing.id)}
                            className="text-slate-400 hover:text-slate-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      {showApproveDialog && selectedListing && (
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Listing</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this listing? The seller will be notified via email.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="text-sm">
                <p><strong>Vehicle:</strong> {selectedListing.year} {selectedListing.make} {selectedListing.model}</p>
                <p><strong>Seller:</strong> {selectedListing.userName} ({selectedListing.userEmail})</p>
                <p><strong>Price:</strong> N$ {selectedListing.price?.toLocaleString()}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && selectedListing && (
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Listing</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this listing (optional).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="text-sm mb-4">
                <p><strong>Vehicle:</strong> {selectedListing.year} {selectedListing.make} {selectedListing.model}</p>
                <p><strong>Seller:</strong> {selectedListing.userName} ({selectedListing.userEmail})</p>
              </div>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason (optional)..."
                className="w-full"
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

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
  const [featuredRequests, setFeaturedRequests] = useState<any[]>([]);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectFeaturedDialogOpen, setRejectFeaturedDialogOpen] = useState(false);
  const [viewFeaturedDialogOpen, setViewFeaturedDialogOpen] = useState(false);
  const [selectedFeaturedRequest, setSelectedFeaturedRequest] = useState<any>(null);
  const [featuredRejectionReason, setFeaturedRejectionReason] = useState('');
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

  // Fetch admin stats, dealers, users, and listings from database once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  // Fetch subscription data
  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  // Fetch promo codes
  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  // Fetch analytics data
  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated, activeTab]);

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

  // Invoices state
  const [adminInvoices, setAdminInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoiceFilter, setInvoiceFilter] = useState('ALL');
  const [invoiceMonth, setInvoiceMonth] = useState(new Date().getMonth() + 1);
  const [invoiceYear, setInvoiceYear] = useState(new Date().getFullYear());
  const [generatingInvoices, setGeneratingInvoices] = useState(false);
  const [runningEscalation, setRunningEscalation] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceModalMode, setInvoiceModalMode] = useState<'view' | 'edit' | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: '', subscriptionAmount: 0, stockFeeAmount: 0, totalAmount: 0, dueDate: '' });
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [sendEmailInvoiceId, setSendEmailInvoiceId] = useState<string | null>(null);
  const [sendEmailTo, setSendEmailTo] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

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

  // Load platform settings from database
  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

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
      router.push('/admin/login');
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

  // Fetch featured requests
  useEffect(() => {
    const fetchFeaturedRequests = async () => {
      try {
        const response = await fetch('/api/admin/featured-requests');
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

    if (isAuthenticated && activeTab === 'invoices') {
      setInvoicesLoading(true);
      const params = new URLSearchParams({ page: '1', limit: '50' });
      if (invoiceFilter !== 'ALL') params.set('status', invoiceFilter);
      fetch(`/api/admin/invoices?${params}`)
        .then(r => r.json())
        .then(data => { if (data.invoices) setAdminInvoices(data.invoices); })
        .catch(console.error)
        .finally(() => setInvoicesLoading(false));
    }
    if (isAuthenticated && activeTab === 'featured-requests') {
      fetchFeaturedRequests();
    }
  }, [isAuthenticated, activeTab, invoiceFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CB2030] mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Overview', icon: Home, id: 'overview', current: activeTab === 'overview' },
    { name: 'Messages', icon: MessageSquare, id: 'messages', current: activeTab === 'messages' },
    { name: 'Users', icon: Users, id: 'users', current: activeTab === 'users' },
    { name: 'Dealers', icon: Building2, id: 'dealers', current: activeTab === 'dealers' },
    { name: 'Listings', icon: Car, id: 'listings', current: activeTab === 'listings' },
    { name: 'Sell Your Car', icon: HandCoins, id: 'sell-your-car', current: activeTab === 'sell-your-car' },
    { name: 'Subscriptions', icon: CreditCard, id: 'subscriptions', current: activeTab === 'subscriptions' },
    { name: 'Invoices', icon: FileText, id: 'invoices', current: activeTab === 'invoices' },
    { name: 'Featured Requests', icon: Crown, id: 'featured-requests', current: activeTab === 'featured-requests' },
    { name: 'Events', icon: Calendar, id: 'events', current: activeTab === 'events' },
    { name: 'Advertisements', icon: Image, id: 'advertisements', current: activeTab === 'advertisements' },
    { name: 'Moderation', icon: Flag, id: 'moderation', current: activeTab === 'moderation' },
    { name: 'Analytics', icon: BarChart3, id: 'analytics', current: activeTab === 'analytics' },
    { name: 'Settings', icon: Settings, id: 'settings', current: activeTab === 'settings' },
  ];

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      // Clear localStorage auth
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminUser');

      // Get current origin to build absolute URL
      const origin = window.location.origin;

      // Also try to sign out from NextAuth if session exists
      if (session) {
        await signOut({
          callbackUrl: `${origin}/admin/login`,
          redirect: true
        });
      } else {
        // Redirect manually if no NextAuth session
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect anyway
      router.push('/admin/login');
    }
  };

  // Featured request handlers
  const handleApproveFeaturedRequest = async () => {
    if (!selectedFeaturedRequest) return;

    try {
      const response = await fetch('/api/admin/featured-requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedFeaturedRequest.id,
          action: 'approve',
        }),
      });

      if (response.ok) {
        // Refresh featured requests
        const fetchResponse = await fetch('/api/admin/featured-requests');
        const data = await fetchResponse.json();
        if (data.success) {
          setFeaturedRequests(data.requests);
        }
        setApproveDialogOpen(false);
        setSelectedFeaturedRequest(null);
      }
    } catch (error) {
      console.error('Error approving featured request:', error);
      alert('Failed to approve request');
    }
  };

  const handleRejectFeaturedRequest = async () => {
    if (!selectedFeaturedRequest) return;

    try {
      const response = await fetch('/api/admin/featured-requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedFeaturedRequest.id,
          action: 'reject',
          rejectionReason: featuredRejectionReason,
        }),
      });

      if (response.ok) {
        // Refresh featured requests
        const fetchResponse = await fetch('/api/admin/featured-requests');
        const data = await fetchResponse.json();
        if (data.success) {
          setFeaturedRequests(data.requests);
        }
        setRejectFeaturedDialogOpen(false);
        setSelectedFeaturedRequest(null);
        setFeaturedRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting featured request:', error);
      alert('Failed to reject request');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
      'Pending': 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
      'Suspended': 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
      'Flagged': 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20'
    };
    return variants[status as keyof typeof variants] || 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20';
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
    <div className="fixed inset-0 bg-[#0B0F1A] flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#111827] border-r border-white/[0.06] flex flex-col transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-9 h-9 bg-[#CB2030] rounded-lg shadow-lg shadow-[#CB2030]/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-base font-bold text-white tracking-tight">Admin Panel</h1>
                <p className="text-xs text-slate-400 font-medium">Cars.na Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                item.current
                  ? 'bg-[#CB2030]/10 text-[#CB2030] ring-1 ring-[#CB2030]/20'
                  : 'text-slate-400 hover:bg-[#111827]/[0.04] hover:text-slate-200'
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${item.current ? 'text-[#CB2030]' : 'text-slate-500'}`} />
              {!sidebarCollapsed && <span className="ml-3 truncate">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/100/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px] text-red-400" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#111827] border-b border-white/[0.06]">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-[#111827]/[0.06] transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    {navigation.find(nav => nav.id === activeTab)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {activeTab === 'overview' && 'Platform overview and key metrics'}
                    {activeTab === 'messages' && 'Customer inquiries and dealership messages'}
                    {activeTab === 'users' && 'Manage platform users'}
                    {activeTab === 'dealers' && 'Manage dealership accounts'}
                    {activeTab === 'listings' && 'Manage vehicle listings'}
                    {activeTab === 'sell-your-car' && 'Review and approve user-submitted vehicle listings'}
                    {activeTab === 'events' && 'Create and manage upcoming events'}
                    {activeTab === 'moderation' && 'Content moderation tools'}
                    {activeTab === 'analytics' && 'Platform analytics and reports'}
                    {activeTab === 'settings' && 'Platform configuration'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-[#111827]/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 focus:ring-[#CB2030]/30 focus:border-[#CB2030]/50"
                  />
                </div>
                <NotificationPanel />

                {/* Admin User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#111827]/[0.06] transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-[#1F3469] ring-2 ring-[#CB2030]/30 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left hidden md:block">
                        <p className="text-sm font-medium text-white">Admin</p>
                        <p className="text-xs text-slate-400">System Administrator</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 pt-[50px] bg-[#0B0F1A]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#111827] border-white/[0.06] hover:border-blue-500/20 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-lg ring-1 ring-blue-500/20">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white tabular-nums">{(adminStats.totalUsers || 0).toLocaleString()}</div>
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-xs text-slate-500">Total registered users</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06] hover:border-purple-500/20 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Active Dealers</CardTitle>
                    <div className="p-2 bg-purple-500/10 rounded-lg ring-1 ring-purple-500/20">
                      <Building2 className="h-5 w-5 text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white tabular-nums">{adminStats.totalDealers}</div>
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-xs text-slate-500">Verified: {adminStats.verifiedDealers} &bull; Pending: {adminStats.pendingDealers}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06] hover:border-emerald-500/20 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Listings</CardTitle>
                    <div className="p-2 bg-emerald-500/10 rounded-lg ring-1 ring-emerald-500/20">
                      <Car className="h-5 w-5 text-emerald-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white tabular-nums">{(adminStats.totalListings || 0).toLocaleString()}</div>
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-xs text-slate-500">Available: {adminStats.availableListings || adminStats.activeListings || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06] hover:border-amber-500/20 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
                    <div className="p-2 bg-amber-500/10 rounded-lg ring-1 ring-amber-500/20">
                      <DollarSign className="h-5 w-5 text-amber-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white tabular-nums">N${(adminStats.monthlyRevenue || 0).toLocaleString()}</div>
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-xs text-slate-500">From completed payments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#111827] border-white/[0.06] border-l-2 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-400">Active Subscriptions</p>
                        <p className="text-2xl font-bold text-white tabular-nums">{adminStats.activeSubscriptions}</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-400/60" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Monthly recurring revenue</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06] border-l-2 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-400">Total Leads</p>
                        <p className="text-2xl font-bold text-white tabular-nums">{adminStats.totalLeads}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-400/60" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Customer inquiries</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06] border-l-2 border-l-emerald-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-400">Avg. Response Time</p>
                        <p className="text-2xl font-bold text-white tabular-nums">2.4h</p>
                      </div>
                      <Clock className="h-8 w-8 text-emerald-400/60" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Lead response time</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06] border-l-2 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-400">Conversion Rate</p>
                        <p className="text-2xl font-bold text-white tabular-nums">12.8%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-400/60" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Lead to sale conversion</p>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Approvals */}
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">Pending Approvals</CardTitle>
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <CardDescription className="text-slate-400">Items requiring immediate admin attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <div>
                        <p className="font-medium text-white">New Dealer Applications</p>
                        <p className="text-sm text-slate-400">Awaiting verification</p>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">{adminStats.pendingDealers}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div>
                        <p className="font-medium text-white">Flagged Listings</p>
                        <p className="text-sm text-slate-400">Reported content</p>
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">0</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div>
                        <p className="font-medium text-white">User Reports</p>
                        <p className="text-sm text-slate-400">Moderation queue</p>
                      </div>
                      <Badge className="bg-red-500/10 text-red-400 ring-1 ring-red-500/20">0</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">System Health</CardTitle>
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                    <CardDescription className="text-slate-400">Real-time platform performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Server Status</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Database</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">API Response</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">Fast</Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-slate-500">99.9% uptime</p>
                      <p className="text-xs text-slate-500">Avg: 120ms</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-slate-400">Latest 24-hour platform events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {users.length === 0 && listings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <p className="text-sm">No recent activity</p>
                      </div>
                    ) : (
                      <>
                        {users.slice(0, 2).map((user, idx) => (
                          <div key={user.id} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">New user: {user.name}</p>
                              <p className="text-xs text-slate-500">{new Date(user.joinedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                        {listings.slice(0, 2).map((listing, idx) => (
                          <div key={listing.id} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500/100 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">New listing: {listing.title}</p>
                              <p className="text-xs text-slate-500">{listing.dealer}</p>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span>Revenue Trend (Last 6 Months)</span>
                      <BarChart3 className="h-5 w-5 text-slate-500" />
                    </CardTitle>
                    <CardDescription className="text-slate-400">Monthly revenue comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                      <p className="text-sm font-medium mb-1 text-slate-400">No revenue data yet</p>
                      <p className="text-xs">Revenue trends will appear once payments are processed</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performing Dealers */}
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span>Top Performing Dealers</span>
                      <Star className="h-5 w-5 text-amber-500" />
                    </CardTitle>
                    <CardDescription className="text-slate-400">Based on listings and revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topDealers.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <Star className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                        <p className="text-sm font-medium mb-1 text-slate-400">No dealers yet</p>
                        <p className="text-xs">Top dealers will appear once dealerships are approved</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topDealers.map((dealer, idx) => (
                          <div
                            key={dealer.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              idx === 0 ? 'bg-amber-500/10 border-amber-500/20' :
                              idx === 1 ? 'bg-white/[0.04] border-white/[0.06]' :
                              idx === 2 ? 'bg-orange-500/10 border-orange-500/20' :
                              'bg-white/[0.02] border-white/[0.06]'
                            }`}
                          >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              idx === 0 ? 'bg-amber-500 text-white' :
                              idx === 1 ? 'bg-slate-500 text-white' :
                              idx === 2 ? 'bg-orange-600 text-white' :
                              'bg-white/[0.1] text-slate-300 font-semibold'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className={idx < 3 ? 'font-semibold text-white' : 'font-medium text-white'}>{dealer.name}</p>
                              <p className="text-xs text-slate-400">{dealer.activeListings} listings • {dealer.city}</p>
                            </div>
                            {idx < 3 && (
                              <Star className={`h-5 w-5 fill-current ${
                                idx === 0 ? 'text-amber-500' :
                                idx === 1 ? 'text-slate-500' :
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
                <Card className="lg:col-span-2 bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span>Recent Transactions</span>
                      <Button variant="outline" size="sm" className="border-white/[0.1] text-slate-300 hover:bg-white/[0.04]">View All</Button>
                    </CardTitle>
                    <CardDescription className="text-slate-400">Latest payment activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentPayments.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 text-slate-500" />
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
                            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-[#0D1117]">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/10' : isPending ? 'bg-blue-500/10' : 'bg-white/[0.04]'}`}>
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                  ) : isPending ? (
                                    <Clock className="h-5 w-5 text-blue-400" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-slate-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{payment.dealershipName} - {payment.planName}</p>
                                  <p className="text-xs text-slate-500">
                                    {payment.description || 'Subscription payment'} • {timeAgo}
                                  </p>
                                </div>
                              </div>
                              <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : isPending ? 'text-blue-400' : 'text-slate-400'}`}>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Stats</CardTitle>
                    <CardDescription className="text-slate-400">Today's snapshot</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-300">New Users</span>
                      </div>
                      <span className="text-lg font-bold text-blue-400">{todayStats.newUsers}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">New Dealers</span>
                      </div>
                      <span className="text-lg font-bold text-purple-400">{todayStats.newDealers}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-slate-300">New Listings</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-400">{todayStats.newListings}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium text-slate-300">New Leads</span>
                      </div>
                      <span className="text-lg font-bold text-orange-400">{todayStats.newLeads}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <MessagingCenter />
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
                  <Button size="sm" className="bg-[#CB2030] hover:bg-[#B01C2A]" onClick={() => setAddUserModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Filter Panel */}
              {userFilterOpen && (
                <Card className="border-white/[0.06] bg-[#111827]">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                        <select
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Roles</option>
                          <option value="User">User</option>
                          <option value="Dealer">Dealer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select
                          value={userStatusFilter}
                          onChange={(e) => setUserStatusFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                        {users
                          .filter(user => userRoleFilter === 'all' || user.role === userRoleFilter)
                          .filter(user => userStatusFilter === 'all' || user.status === userStatusFilter)
                          .map((user) => (
                          <tr key={user.id} className="hover:bg-[#0D1117]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{user.name}</div>
                                <div className="text-sm text-slate-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">{user.role}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusBadge(user.status)}>{user.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setAddUserModalOpen(false)}>
              <Card className="w-full max-w-md m-4 bg-[#111827] border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Add New User</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setAddUserModalOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-slate-400">Create a new user account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Dealer">Dealer</option>
                      <option value="Admin">Admin</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Dealership <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a dealership</option>
                      {dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">All users must be assigned to a dealership</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setAddUserModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-[#CB2030] hover:bg-[#B01C2A]" onClick={() => {
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <Input
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <Input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    >
                      <option value="Dealer">Dealer</option>
                      <option value="Admin">Admin</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Dealership <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                      value={editingUser.dealershipId || ''}
                      onChange={(e) => setEditingUser({...editingUser, dealershipId: e.target.value})}
                      required
                    >
                      <option value="">Select a dealership</option>
                      {dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">All users must be assigned to a dealership</p>
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">Reason for suspension (optional)</label>
                    <Textarea
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="Enter reason for suspension..."
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]" style={{ marginTop: '24px', paddingTop: '16px' }}>
                  <button
                    onClick={() => setSuspendingUser(null)}
                    className="px-4 py-2 border border-white/[0.1] rounded-md bg-[#111827] text-slate-300 hover:bg-[#0D1117] font-medium text-sm"
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search dealers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-white/[0.1] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Dealers</CardTitle>
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

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Active Dealers</CardTitle>
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

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Pending Approval</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dealers.filter(d => d.verificationStatus === 'Pending').length}
                    </div>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      N${dealers.reduce((sum, dealer) => sum + (dealer.monthlyFee || 0), 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Dealers Table */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dealer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Verification</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
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
                          <tr key={dealer.id} className="hover:bg-[#0D1117]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                                  <Building className="h-5 w-5 text-slate-500" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-white">{dealer.name}</div>
                                  <div className="text-sm text-slate-500">{dealer.contactPerson}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{dealer.email}</div>
                              <div className="text-sm text-slate-500">{dealer.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{dealer.city}</div>
                              <div className="text-sm text-slate-500">{dealer.region}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{dealer.subscriptionPlan}</div>
                              <div className="text-sm text-slate-500">N${(dealer.monthlyFee / 100).toFixed(2)}/mo</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                dealer.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                                dealer.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                                dealer.status === 'SUSPENDED' ? 'bg-red-500/10 text-red-400' :
                                'bg-[#111827]/[0.04] text-slate-200'
                              }>
                                {dealer.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                dealer.verificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' :
                                dealer.verificationStatus === 'Flagged' ? 'bg-red-500/10 text-red-400' :
                                'bg-amber-500/10 text-amber-400'
                              }>
                                {dealer.verificationStatus}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {dealer.activeListings} active / {dealer.totalListings} total
                              </div>
                              <div className="text-sm text-slate-500">
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-400">Batch operations and dealer management tools</CardDescription>
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-white/[0.1] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Listings</CardTitle>
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

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Active Listings</CardTitle>
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

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Pending Review</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {listings.filter(l => l.listingStatus === 'Pending').length}
                    </div>
                    <p className="text-xs text-yellow-600">Awaiting approval</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Featured</CardTitle>
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dealer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Posted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                        {listings
                          .filter(listing =>
                            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.model.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((listing) => (
                          <tr key={listing.id} className="hover:bg-[#0D1117]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-12 w-16 rounded bg-white/[0.06] flex items-center justify-center mr-3">
                                  <Car className="h-6 w-6 text-slate-500" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{listing.title}</div>
                                  <div className="text-sm text-slate-500">
                                    {listing.year} • {(listing.mileage || 0).toLocaleString()} km • {listing.fuelType}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{listing.dealerName}</div>
                              <div className="text-sm text-slate-500">{listing.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">
                                N${(listing.price || 0).toLocaleString()}
                              </div>
                              <div className="text-sm text-slate-500">{listing.condition}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                listing.listingStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                listing.listingStatus === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                                listing.listingStatus === 'Under Review' ? 'bg-orange-500/10 text-orange-400' :
                                'bg-amber-500/10 text-amber-400'
                              }>
                                {listing.listingStatus}
                              </Badge>
                              <div className="flex items-center mt-1 text-xs text-slate-500">
                                {listing.featured && <Star className="h-3 w-3 text-yellow-500 mr-1" />}
                                {listing.status}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                👁 {listing.views} views
                              </div>
                              <div className="text-sm text-slate-500">
                                💬 {listing.inquiries} inquiries
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {new Date(listing.datePosted).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-slate-500">
                                Updated: {new Date(listing.lastUpdated).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => handleViewListing(listing)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {listing.listingStatus === 'Pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-emerald-400 hover:text-emerald-300"
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
                                      className="text-emerald-400 hover:text-emerald-300"
                                      onClick={() => handleApproveListing(listing.id)}
                                      title="Approve Listing"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-300"
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
                                      className={listing.featured ? "text-yellow-600 hover:text-yellow-800" : "text-slate-400 hover:text-slate-200"}
                                      onClick={() => handleFeatureListing(listing.id)}
                                      title={listing.featured ? "Remove Feature" : "Feature Listing"}
                                    >
                                      <Star className={`h-4 w-4 ${listing.featured ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-purple-400 hover:text-purple-300"
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
                                    className="text-orange-400 hover:text-orange-300"
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
                                    className="text-emerald-400 hover:text-emerald-300"
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
                                    className="text-red-400 hover:text-red-300"
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Bulk Actions</CardTitle>
                  <CardDescription className="text-slate-400">Manage multiple listings at once</CardDescription>
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
              <div className="border-b border-white/[0.06]">
                {/* Debug indicator */}
                <div className="text-xs text-slate-500 px-4 py-1">Current tab: {activeAdvertTab}</div>
                <nav className="flex gap-6">
                  <button
                    onClick={() => setActiveAdvertTab('banners')}
                    className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeAdvertTab === 'banners'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/[0.1]'
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
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/[0.1]'
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
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/[0.1]'
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Banners</CardTitle>
                    <Image className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bannerStats.totalBanners}</div>
                    <p className="text-xs text-muted-foreground">
                      {bannerStats.activeBanners} active
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Clicks</CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(bannerStats.totalClicks || 0).toLocaleString()}</div>
                    <p className="text-xs text-blue-600">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Impressions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(bannerStats.totalImpressions || 0).toLocaleString()}</div>
                    <p className="text-xs text-green-600">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Avg CTR</CardTitle>
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
                    <Image className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-500">No banners found. Create your first banner to get started!</p>
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
                              <h3 className="text-lg font-semibold text-white">{positionInfo[position].title}</h3>
                              <p className="text-sm text-slate-500">
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
                        <CardTitle className="text-lg text-white">{banner.title}</CardTitle>
                        <Badge className={banner.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#111827]/[0.04] text-slate-200'}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">
                        Fixed Position: {banner.position} •
                        <span className="text-blue-600"> Change image/content only</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Banner Preview */}
                      <div className="aspect-video bg-[#111827]/[0.04] rounded-lg overflow-hidden">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="flex items-center justify-center h-full text-center text-slate-500"><div><div class="h-12 w-12 mx-auto mb-2 flex items-center justify-center"><svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><p class="text-sm">Failed to load image</p></div></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-center text-slate-500">
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
                          <p className="text-slate-500">Link</p>
                          <p className="font-medium text-blue-600 truncate">{banner.linkUrl || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Priority</p>
                          <p className="font-medium">{banner.priority || 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Start Date</p>
                          <p className="font-medium">{banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">End Date</p>
                          <p className="font-medium">{banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Clicks</p>
                          <p className="font-medium text-blue-600">{(banner.clicks || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Impressions</p>
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
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-500/10"
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
              <Card className="bg-[#1F3469]/20 border-[#1F3469]/40">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <Image className="h-5 w-5 mr-2" />
                    How to Manage Banners
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-300 space-y-2">
                  <p><strong className="text-blue-400">1. Edit Existing Banners:</strong> Click the "Edit" button on any banner card above to change its image, title, or link.</p>
                  <p><strong className="text-blue-400">2. Preview Changes:</strong> Use the "Preview" button to see how the banner looks before making changes.</p>
                  <p><strong className="text-blue-400">3. Toggle Active/Inactive:</strong> Use the status dropdown in edit mode to enable or disable banners.</p>
                  <p><strong className="text-blue-400">4. Banner Positions are Fixed:</strong> Each banner slot is tied to a specific location on the website and cannot be moved.</p>
                  <p className="mt-4 p-3 bg-[#0B0F1A] rounded border border-[#1F3469]/40">
                    <strong>Tip:</strong> Changes take effect immediately on the live site. Always preview your changes before saving!
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
                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$12,450</div>
                        <p className="text-xs text-green-600">+18% from last month</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Active Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Advertisers paying</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Pending Payments</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-orange-600">Awaiting payment</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Expiring Soon</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-red-600">Within 7 days</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Active Subscriptions Table */}
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-white">Active Advertisement Subscriptions</CardTitle>
                      <CardDescription className="text-slate-400">Manage advertiser subscriptions and payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#0D1117] border-b border-white/[0.06]">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Advertiser</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Banner Position</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Plan</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Start Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">End Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-[#0D1117]">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-white">ABC Motors</p>
                                  <p className="text-sm text-slate-500">contact@abcmotors.com</p>
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
                                <Badge className="bg-emerald-500/10 text-emerald-400">Active</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">View</Button>
                                  <Button size="sm" variant="outline">Invoice</Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-[#0D1117]">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-white">XYZ Dealership</p>
                                  <p className="text-sm text-slate-500">info@xyzdealership.com</p>
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
                                <Badge className="bg-emerald-500/10 text-emerald-400">Active</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">View</Button>
                                  <Button size="sm" variant="outline">Invoice</Button>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-[#0D1117]">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium text-white">Premium Autos Ltd</p>
                                  <p className="text-sm text-slate-500">sales@premiumautos.com</p>
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
                                <Badge className="bg-amber-500/10 text-amber-400">Expiring Soon</Badge>
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-white">Advertisement Pricing Plans</CardTitle>
                      <CardDescription className="text-slate-400">Manage subscription tiers and pricing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border rounded-lg p-6">
                          <h3 className="font-semibold text-lg mb-2">Basic Plan</h3>
                          <p className="text-3xl font-bold mb-4">$200<span className="text-sm text-slate-500">/month</span></p>
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
                            <Badge className="bg-blue-500/10 text-blue-400">Popular</Badge>
                          </div>
                          <p className="text-3xl font-bold mb-4">$400<span className="text-sm text-slate-500">/month</span></p>
                          <ul className="space-y-2 text-sm mb-4">
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />MAIN position</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Advanced analytics</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Unlimited changes</li>
                            <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
                          </ul>
                          <Button className="w-full">Edit Plan</Button>
                        </div>

                        <div className="border rounded-lg p-6 bg-[#1F3469]/20 border border-[#1F3469]/30">
                          <h3 className="font-semibold text-lg mb-2">Premium Plan</h3>
                          <p className="text-3xl font-bold mb-4">$600<span className="text-sm text-slate-500">/month</span></p>
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
                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Impressions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{(bannerStats.totalImpressions || 0).toLocaleString()}</div>
                        <p className="text-xs text-blue-600">Last 30 days</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Clicks</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{(bannerStats.totalClicks || 0).toLocaleString()}</div>
                        <p className="text-xs text-green-600">Last 30 days</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Average CTR</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{bannerStats.avgCTR}%</div>
                        <p className="text-xs text-muted-foreground">Click-through rate</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">ROI</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">324%</div>
                        <p className="text-xs text-green-600">Return on investment</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance by Position */}
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-white">Performance by Banner Position</CardTitle>
                      <CardDescription className="text-slate-400">Compare performance across different banner slots</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">HERO Position</h4>
                              <p className="text-sm text-slate-500">Top banner on vehicles page</p>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400">Best CTR</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-slate-500">Impressions</p>
                              <p className="text-2xl font-bold">45,234</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Clicks</p>
                              <p className="text-2xl font-bold">4,892</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">CTR</p>
                              <p className="text-2xl font-bold text-green-600">10.8%</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">MAIN Position</h4>
                              <p className="text-sm text-slate-500">Main banner on homepage</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-slate-500">Impressions</p>
                              <p className="text-2xl font-bold">38,567</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Clicks</p>
                              <p className="text-2xl font-bold">3,534</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">CTR</p>
                              <p className="text-2xl font-bold text-blue-600">9.2%</p>
                            </div>
                          </div>
                        </div>

                        <div className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">SIDEBAR Position</h4>
                              <p className="text-sm text-slate-500">Sidebar banner on vehicles page</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-slate-500">Impressions</p>
                              <p className="text-2xl font-bold">22,145</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Clicks</p>
                              <p className="text-2xl font-bold">1,508</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">CTR</p>
                              <p className="text-2xl font-bold text-orange-600">6.8%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performing Banners */}
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-white">Top Performing Banners</CardTitle>
                      <CardDescription className="text-slate-400">Best performing advertisements this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {banners.slice(0, 5).map((banner, index) => (
                          <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold text-slate-600">#{index + 1}</div>
                              <div className="w-24 h-16 bg-[#111827]/[0.04] rounded overflow-hidden">
                                {banner.imageUrl && (
                                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold">{banner.title}</h4>
                                <p className="text-sm text-slate-500">{banner.position}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-8 text-center">
                              <div>
                                <p className="text-sm text-slate-500">Impressions</p>
                                <p className="font-semibold">{(banner.impressions || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Clicks</p>
                                <p className="font-semibold">{(banner.clicks || 0).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">CTR</p>
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Trends</CardTitle>
                      <CardDescription className="text-slate-400">Banner performance over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-[#0D1117] rounded-lg border-2 border-dashed border-white/[0.1]">
                        <div className="text-center text-slate-500">
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-white/[0.1] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Reports</CardTitle>
                    <FlagIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {reports.filter(r => r.status === 'Resolved').length} resolved
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Pending Review</CardTitle>
                    <ClockIcon className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.filter(r => r.status === 'Pending').length}</div>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Critical Reports</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports.filter(r => r.severity === 'Critical').length}</div>
                    <p className="text-xs text-red-600">High priority</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Avg Resolution</CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.4 hours</div>
                    <p className="text-xs text-green-600">Response time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Moderation Filter Tabs */}
              <div className="border-b border-white/[0.06]">
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
                          : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/[0.1]'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                    >
                      {tab.name}
                      <span className={`${
                        moderationFilter === tab.id
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-[#111827]/[0.04] text-slate-400'
                      } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Reports Table */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Report</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reporter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
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
                          <tr key={report.id} className="hover:bg-[#0D1117]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-white/[0.06] flex items-center justify-center mr-3">
                                  {report.type === 'listing' && <Car className="h-5 w-5 text-slate-500" />}
                                  {report.type === 'user' && <Users className="h-5 w-5 text-slate-500" />}
                                  {report.type === 'comment' && <MessageSquare className="h-5 w-5 text-slate-500" />}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{report.targetTitle}</div>
                                  <div className="text-sm text-slate-500">{report.reportReason}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{report.targetType}</div>
                              <div className="text-sm text-slate-500">{report.reportCategory}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{report.reporterName}</div>
                              <div className="text-sm text-slate-500">{report.reporterEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                report.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                report.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                                report.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-blue-500/10 text-blue-400'
                              }>
                                {report.severity}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={
                                report.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                                report.status === 'Under Review' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-emerald-500/10 text-emerald-400'
                              }>
                                {report.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {report.assignedTo || 'Unassigned'}
                              </div>
                              {report.actionTaken && (
                                <div className="text-sm text-slate-500">{report.actionTaken}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {new Date(report.dateReported).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-slate-500">
                                {new Date(report.lastUpdated).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
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
                                      className="text-emerald-400 hover:text-emerald-300"
                                      onClick={() => handleApproveReport(report.id)}
                                      title="Take Action"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-300"
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
                                    className="text-purple-400 hover:text-purple-300"
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Moderation Tools</CardTitle>
                  <CardDescription className="text-slate-400">Quick actions and batch operations</CardDescription>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Page Views</CardTitle>
                    <MousePointer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analyticsData?.overview?.totalPageViews || 0).toLocaleString()}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      +{analyticsData?.overview?.growthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(analyticsData?.overview?.uniqueVisitors || 0).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg session: {analyticsData?.overview?.avgSessionDuration || '0:00'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Conversion Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Bounce rate: {analyticsData.overview.bounceRate}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N${((analyticsData?.overview?.totalRevenue || 0) / 100).toLocaleString()}</div>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Globe className="h-5 w-5" />
                      Traffic Sources
                    </CardTitle>
                    <CardDescription className="text-slate-400">Visitor acquisition channels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.traffic.sources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500/100" style={{
                              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
                            }}></div>
                            <div>
                              <p className="text-sm font-medium">{source.name}</p>
                              <p className="text-xs text-slate-500">{source.visitors.toLocaleString()} visitors</p>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <DollarSign className="h-5 w-5" />
                      Revenue Breakdown
                    </CardTitle>
                    <CardDescription className="text-slate-400">Monthly revenue by source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500/100"></div>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BarChart className="h-5 w-5" />
                      Top Performing Makes
                    </CardTitle>
                    <CardDescription className="text-slate-400">Vehicle brand performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/[0.06]">
                            <th className="text-left py-2">Make</th>
                            <th className="text-right py-2">Views</th>
                            <th className="text-right py-2">Inquiries</th>
                            <th className="text-right py-2">Sales</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.listings.performance.map((make, index) => (
                            <tr key={index} className="border-b border-white/[0.06]">
                              <td className="py-2">
                                <div>
                                  <p className="font-medium">{make.make}</p>
                                  <p className="text-xs text-slate-500">Avg: N${make.avgPrice.toLocaleString()}</p>
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MapPin className="h-5 w-5" />
                      Geographic Distribution
                    </CardTitle>
                    <CardDescription className="text-slate-400">User and revenue by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.geographic.map((region, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{region.region}</p>
                            <p className="text-xs text-slate-500">{region.users.toLocaleString()} users</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">N${(region.revenue / 100).toLocaleString()}</p>
                            <p className="text-xs text-slate-500">{region.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Engagement Metrics */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5" />
                    User Engagement Metrics
                  </CardTitle>
                  <CardDescription className="text-slate-400">Platform usage and engagement statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{(analyticsData?.users?.engagement?.activeUsers || 0).toLocaleString()}</div>
                      <p className="text-sm text-slate-400">Active Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{(analyticsData?.users?.engagement?.returningUsers || 0).toLocaleString()}</div>
                      <p className="text-sm text-slate-400">Returning Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{analyticsData?.users?.engagement?.pagesPerSession || 0}</div>
                      <p className="text-sm text-slate-400">Pages/Session</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{(analyticsData?.users?.engagement?.messagesSent || 0).toLocaleString()}</div>
                      <p className="text-sm text-slate-400">Messages Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Analytics Tools</CardTitle>
                  <CardDescription className="text-slate-400">Data analysis and reporting tools</CardDescription>
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

          {/* Featured Requests Tab */}
          {activeTab === 'featured-requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-600" />
                  Featured Dealership Requests
                </h2>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Requests</CardTitle>
                    <Crown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{featuredRequests.length}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {featuredRequests.filter(r => r.status === 'PENDING').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Active</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {featuredRequests.filter(r => r.status === 'ACTIVE').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Currently featured</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      N${featuredRequests
                        .filter(r => r.status === 'ACTIVE' || r.status === 'APPROVED')
                        .reduce((sum, r) => sum + r.amount, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">From featured placements</p>
                  </CardContent>
                </Card>
              </div>

              {/* Requests Table */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Dealership
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Requested
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Active Period
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                        {featuredRequests.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-500">
                                <Crown className="h-12 w-12 mb-4 text-slate-600" />
                                <p className="font-medium">No featured requests yet</p>
                                <p className="text-sm mt-1">Requests will appear here when dealerships apply</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          featuredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-[#0D1117]">
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-medium text-white">{request.dealership.name}</div>
                                  <div className="text-sm text-slate-500">{request.dealership.city}</div>
                                  <div className="text-xs text-slate-500">{request.dealership.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{request.duration} days</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">N${request.amount}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={`${
                                  request.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                                  request.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                                  request.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-400' :
                                  request.status === 'EXPIRED' ? 'bg-[#111827]/[0.04] text-slate-200' :
                                  'bg-red-500/10 text-red-400'
                                }`}>
                                  {request.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-white">
                                  {new Date(request.requestedAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {new Date(request.requestedAt).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {request.startDate && request.endDate ? (
                                  <div className="text-sm text-white">
                                    <div>{new Date(request.startDate).toLocaleDateString()}</div>
                                    <div className="text-xs text-slate-500">
                                      to {new Date(request.endDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-slate-500">-</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {request.status === 'PENDING' ? (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                                      onClick={() => {
                                        setSelectedFeaturedRequest(request);
                                        setApproveDialogOpen(true);
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-red-500/10 text-red-400 hover:bg-red-500/100/20 border-red-500/20"
                                      onClick={() => {
                                        setSelectedFeaturedRequest(request);
                                        setRejectFeaturedDialogOpen(true);
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedFeaturedRequest(request);
                                      setViewFeaturedDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                )}
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

          {/* Sell Your Car Tab */}
          {activeTab === 'sell-your-car' && (
            <SellYourCarManagement showToast={showToast} />
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Invoice Management
                </h2>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={invoiceMonth}
                      onChange={e => setInvoiceMonth(Number(e.target.value))}
                      className="border border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                        <option key={i} value={i + 1}>{m}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={invoiceYear}
                      onChange={e => setInvoiceYear(Number(e.target.value))}
                      className="border border-white/[0.1] rounded-lg px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-blue-500"
                      min={2024}
                      max={2030}
                    />
                    <Button
                      size="sm"
                      className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
                      onClick={async () => {
                        setGeneratingInvoices(true);
                        try {
                          const res = await fetch('/api/admin/invoices', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ month: invoiceMonth, year: invoiceYear }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            showToast({ title: 'Invoices Generated', description: data.message, type: 'success' });
                            setInvoiceFilter('ALL');
                            // Force re-fetch (filter may already be ALL)
                            fetch('/api/admin/invoices?page=1&limit=50')
                              .then(r => r.json())
                              .then(d => { if (d.invoices) setAdminInvoices(d.invoices); });
                          } else {
                            showToast({ title: 'Error', description: data.error, type: 'error' });
                          }
                        } catch {
                          showToast({ title: 'Error', description: 'Failed to generate invoices', type: 'error' });
                        } finally {
                          setGeneratingInvoices(false);
                        }
                      }}
                      disabled={generatingInvoices}
                    >
                      {generatingInvoices ? 'Generating...' : 'Generate Invoices'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        setRunningEscalation(true);
                        try {
                          const res = await fetch('/api/admin/invoices/escalate', { method: 'POST' });
                          const data = await res.json();
                          if (res.ok) {
                            showToast({ title: 'Escalation Complete', description: data.message, type: 'success' });
                          } else {
                            showToast({ title: 'Error', description: data.error, type: 'error' });
                          }
                        } catch {
                          showToast({ title: 'Error', description: 'Escalation check failed', type: 'error' });
                        } finally {
                          setRunningEscalation(false);
                        }
                      }}
                      disabled={runningEscalation}
                    >
                      {runningEscalation ? 'Running...' : 'Run Escalation Check'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex gap-2">
                {['ALL','PENDING','OVERDUE','PAID','CANCELLED'].map(s => (
                  <button
                    key={s}
                    onClick={() => setInvoiceFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      invoiceFilter === s
                        ? 'bg-[#1F3469] text-white border-blue-600'
                        : 'bg-[#111827] text-slate-400 border-white/[0.1] hover:bg-[#0D1117]'
                    }`}
                  >
                    {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  {invoicesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : adminInvoices.length === 0 ? (
                    <p className="text-center text-slate-500 py-16">No invoices found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#0D1117] border-b border-white/[0.06]">
                            <th className="text-left px-4 py-3 font-semibold text-slate-400">Invoice #</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-400">Dealership</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-400">Period</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-400">Total</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-400">Due Date</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-400">Status</th>
                            <th className="px-4 py-3" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {adminInvoices.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-[#0D1117] transition-colors">
                              <td className="px-4 py-3 font-mono text-white font-medium">{inv.invoiceNumber}</td>
                              <td className="px-4 py-3 text-slate-300">{inv.dealership?.name ?? '—'}</td>
                              <td className="px-4 py-3 text-slate-300">
                                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][inv.billingMonth - 1]} {inv.billingYear}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-white">
                                N$ {inv.totalAmount.toLocaleString('en-NA', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-slate-400">
                                {new Date(inv.dueDate).toLocaleDateString('en-NA')}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${
                                  inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-green-200' :
                                  inv.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border-red-200' :
                                  inv.status === 'CANCELLED' ? 'bg-[#111827]/[0.04] text-slate-400 border-white/[0.06]' :
                                  'bg-amber-500/10 text-amber-400 border-yellow-200'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1 justify-end">
                                  <button title="View" onClick={async () => {
                                    const res = await fetch(`/api/admin/invoices/${inv.id}`);
                                    const data = await res.json();
                                    if (data.invoice) { setSelectedInvoice(data.invoice); setInvoiceModalMode('view'); }
                                  }} className="p-1.5 rounded hover:bg-[#111827]/[0.04] text-slate-500 hover:text-blue-600"><Eye className="h-4 w-4" /></button>
                                  <button title="Edit" onClick={async () => {
                                    const res = await fetch(`/api/admin/invoices/${inv.id}`);
                                    const data = await res.json();
                                    if (data.invoice) {
                                      setSelectedInvoice(data.invoice);
                                      setEditForm({
                                        status: data.invoice.status,
                                        subscriptionAmount: data.invoice.subscriptionAmount,
                                        stockFeeAmount: data.invoice.stockFeeAmount,
                                        totalAmount: data.invoice.totalAmount,
                                        dueDate: new Date(data.invoice.dueDate).toISOString().slice(0, 10),
                                      });
                                      setInvoiceModalMode('edit');
                                    }
                                  }} className="p-1.5 rounded hover:bg-[#111827]/[0.04] text-slate-500 hover:text-yellow-600"><Edit className="h-4 w-4" /></button>
                                  {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                                    <button title="Mark Paid" onClick={async () => {
                                      const res = await fetch(`/api/admin/invoices/${inv.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'mark-paid' }) });
                                      const data = await res.json();
                                      if (res.ok) { showToast({ title: 'Marked Paid', description: `Invoice ${inv.invoiceNumber} marked as paid.`, type: 'success' }); setAdminInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'PAID' } : i)); }
                                      else { showToast({ title: 'Error', description: data.error, type: 'error' }); }
                                    }} className="p-1.5 rounded hover:bg-[#111827]/[0.04] text-slate-500 hover:text-green-600"><Check className="h-4 w-4" /></button>
                                  )}
                                  <button title="Download PDF" onClick={() => { window.open(`/api/admin/invoices/${inv.id}/pdf`, '_blank'); }} className="p-1.5 rounded hover:bg-[#111827]/[0.04] text-slate-500 hover:text-indigo-600"><FileDown className="h-4 w-4" /></button>
                                  <button title="Send Email" onClick={() => { setSendEmailInvoiceId(inv.id); setSendEmailTo(inv.dealership?.email || ''); }} className="p-1.5 rounded hover:bg-[#111827]/[0.04] text-slate-500 hover:text-purple-600"><Send className="h-4 w-4" /></button>
                                  <button title="Delete" onClick={() => setDeletingInvoiceId(inv.id)} className="p-1.5 rounded hover:bg-[#111827]/[0.04] text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Invoice View Modal */}
              {invoiceModalMode === 'view' && selectedInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setInvoiceModalMode(null); setSelectedInvoice(null); }}>
                  <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Invoice Details</h3>
                      <button onClick={() => { setInvoiceModalMode(null); setSelectedInvoice(null); }} className="text-slate-500 hover:text-slate-400"><XCircle className="h-5 w-5" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-slate-500">Invoice #</p><p className="font-mono font-semibold">{selectedInvoice.invoiceNumber}</p></div>
                      <div><p className="text-slate-500">Status</p><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${selectedInvoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-green-200' : selectedInvoice.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border-red-200' : selectedInvoice.status === 'CANCELLED' ? 'bg-[#111827]/[0.04] text-slate-400 border-white/[0.06]' : 'bg-amber-500/10 text-amber-400 border-yellow-200'}`}>{selectedInvoice.status}</span></div>
                      <div><p className="text-slate-500">Dealership</p><p className="font-medium">{selectedInvoice.dealership?.name}</p></div>
                      <div><p className="text-slate-500">Contact</p><p>{selectedInvoice.dealership?.contactPerson || '—'}</p></div>
                      <div><p className="text-slate-500">Period</p><p>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][selectedInvoice.billingMonth - 1]} {selectedInvoice.billingYear}</p></div>
                      <div><p className="text-slate-500">Plan</p><p>{selectedInvoice.planName}</p></div>
                      <div><p className="text-slate-500">Due Date</p><p>{new Date(selectedInvoice.dueDate).toLocaleDateString('en-NA')}</p></div>
                      <div><p className="text-slate-500">Vehicle Count</p><p>{selectedInvoice.vehicleCount}</p></div>
                    </div>
                    <div className="mt-6 bg-[#0D1117] rounded-lg p-4">
                      <h4 className="font-semibold text-slate-300 mb-3">Amount Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Subscription Fee</span><span>N$ {selectedInvoice.subscriptionAmount?.toLocaleString('en-NA', { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Stock Value</span><span>N$ {selectedInvoice.stockValue?.toLocaleString('en-NA', { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Stock Fee (0.1%)</span><span>N$ {selectedInvoice.stockFeeAmount?.toLocaleString('en-NA', { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between border-t pt-2 font-semibold text-base"><span>Total</span><span>N$ {selectedInvoice.totalAmount?.toLocaleString('en-NA', { minimumFractionDigits: 2 })}</span></div>
                      </div>
                    </div>
                    {selectedInvoice.paidAt && (
                      <div className="mt-4 text-sm text-slate-500">
                        <p>Paid on {new Date(selectedInvoice.paidAt).toLocaleDateString('en-NA')} by {selectedInvoice.paidBy?.name || 'Admin'}</p>
                      </div>
                    )}
                    <div className="mt-6 flex gap-2 justify-end flex-wrap">
                      <button onClick={() => { window.open(`/api/admin/invoices/${selectedInvoice.id}/pdf`, '_blank'); }} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-white/[0.1] rounded-lg hover:bg-[#0D1117] text-slate-300"><FileDown className="h-4 w-4" /> Download PDF</button>
                      <Button variant="outline" onClick={() => { setSendEmailInvoiceId(selectedInvoice.id); setSendEmailTo(selectedInvoice.dealership?.email || ''); }}>
                        <Send className="h-4 w-4 mr-1.5" /> Send Email
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setEditForm({ status: selectedInvoice.status, subscriptionAmount: selectedInvoice.subscriptionAmount, stockFeeAmount: selectedInvoice.stockFeeAmount, totalAmount: selectedInvoice.totalAmount, dueDate: new Date(selectedInvoice.dueDate).toISOString().slice(0, 10) });
                        setInvoiceModalMode('edit');
                      }}>Edit Invoice</Button>
                      <Button variant="outline" onClick={() => { setInvoiceModalMode(null); setSelectedInvoice(null); }}>Close</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Edit Modal */}
              {invoiceModalMode === 'edit' && selectedInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setInvoiceModalMode(null); setSelectedInvoice(null); }}>
                  <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Edit Invoice — {selectedInvoice.invoiceNumber}</h3>
                      <button onClick={() => { setInvoiceModalMode(null); setSelectedInvoice(null); }} className="text-slate-500 hover:text-slate-400"><XCircle className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                          {['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Subscription Amount (NAD)</label>
                        <input type="number" step="0.01" value={editForm.subscriptionAmount} onChange={e => { const v = Number(e.target.value); setEditForm(f => ({ ...f, subscriptionAmount: v, totalAmount: v + f.stockFeeAmount })); }} className="w-full border border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Stock Fee Amount (NAD)</label>
                        <input type="number" step="0.01" value={editForm.stockFeeAmount} onChange={e => { const v = Number(e.target.value); setEditForm(f => ({ ...f, stockFeeAmount: v, totalAmount: f.subscriptionAmount + v })); }} className="w-full border border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Total Amount (NAD)</label>
                        <input type="number" step="0.01" value={editForm.totalAmount} readOnly className="w-full border border-white/[0.06] rounded-lg px-3 py-2 text-sm bg-[#0D1117] text-slate-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                        <input type="date" value={editForm.dueDate} onChange={e => setEditForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full border border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => { setInvoiceModalMode(null); setSelectedInvoice(null); }}>Cancel</Button>
                      <Button className="bg-[#CB2030] hover:bg-[#B01C2A] text-white" disabled={savingInvoice} onClick={async () => {
                        setSavingInvoice(true);
                        try {
                          const res = await fetch(`/api/admin/invoices/${selectedInvoice.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', ...editForm }) });
                          const data = await res.json();
                          if (res.ok) {
                            showToast({ title: 'Invoice Updated', description: `Invoice ${selectedInvoice.invoiceNumber} updated.`, type: 'success' });
                            setAdminInvoices(prev => prev.map(i => i.id === selectedInvoice.id ? { ...i, ...data.invoice } : i));
                            setInvoiceModalMode(null); setSelectedInvoice(null);
                          } else { showToast({ title: 'Error', description: data.error, type: 'error' }); }
                        } catch { showToast({ title: 'Error', description: 'Failed to update invoice', type: 'error' }); }
                        finally { setSavingInvoice(false); }
                      }}>{savingInvoice ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deletingInvoiceId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeletingInvoiceId(null)}>
                  <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-semibold text-white mb-2">Delete Invoice</h3>
                    <p className="text-sm text-slate-400 mb-4">Are you sure you want to delete invoice <strong>{adminInvoices.find(i => i.id === deletingInvoiceId)?.invoiceNumber}</strong>? This action cannot be undone.</p>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setDeletingInvoiceId(null)}>Cancel</Button>
                      <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={async () => {
                        const res = await fetch(`/api/admin/invoices/${deletingInvoiceId}`, { method: 'DELETE' });
                        const data = await res.json();
                        if (res.ok) {
                          showToast({ title: 'Deleted', description: data.message, type: 'success' });
                          setAdminInvoices(prev => prev.filter(i => i.id !== deletingInvoiceId));
                        } else { showToast({ title: 'Error', description: data.error, type: 'error' }); }
                        setDeletingInvoiceId(null);
                      }}>Delete</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Send Email Modal */}
              {sendEmailInvoiceId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setSendEmailInvoiceId(null); setSendEmailTo(''); }}>
                  <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Send Invoice Email</h3>
                      <button onClick={() => { setSendEmailInvoiceId(null); setSendEmailTo(''); }} className="text-slate-500 hover:text-slate-400"><XCircle className="h-5 w-5" /></button>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">Send invoice <strong>{adminInvoices.find(i => i.id === sendEmailInvoiceId)?.invoiceNumber}</strong> to:</p>
                    <input
                      type="email"
                      value={sendEmailTo}
                      onChange={e => setSendEmailTo(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full border border-white/[0.1] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 mb-4"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => { setSendEmailInvoiceId(null); setSendEmailTo(''); }}>Cancel</Button>
                      <Button className="bg-[#CB2030] hover:bg-[#B01C2A] text-white" disabled={sendingEmail || !sendEmailTo} onClick={async () => {
                        setSendingEmail(true);
                        try {
                          const res = await fetch(`/api/admin/invoices/${sendEmailInvoiceId}/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: sendEmailTo }) });
                          const data = await res.json();
                          if (res.ok) {
                            showToast({ title: 'Email Sent', description: data.message, type: 'success' });
                            setSendEmailInvoiceId(null); setSendEmailTo('');
                          } else { showToast({ title: 'Error', description: data.error, type: 'error' }); }
                        } catch { showToast({ title: 'Error', description: 'Failed to send email', type: 'error' }); }
                        finally { setSendingEmail(false); }
                      }}>{sendingEmail ? 'Sending...' : 'Send'}</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Subscription Management</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search subscriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-white/[0.1] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Subscriptions</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptionStats.totalSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">
                      {subscriptionStats.activeSubscriptions} active
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N${((subscriptionStats.monthlyRevenue || 0) / 100).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From subscription payments</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Overdue Payments</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptionStats.overdueSubscriptions}</div>
                    <p className="text-xs text-red-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Churn Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscriptionStats.churnRate}%</div>
                    <p className="text-xs text-muted-foreground">Cancellation rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Subscriptions Table */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dealership</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Fee</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Next Billing</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Paid</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Auto-Renew</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                        {subscriptions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-500">
                                <CreditCard className="h-12 w-12 mb-3 text-slate-500" />
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
                            <tr key={subscription.id} className="hover:bg-[#0D1117]">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-white">{subscription.dealershipName}</div>
                                  <div className="text-sm text-slate-500">{subscription.billingEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-white">{subscription.plan}</span>
                                <div className="text-xs text-slate-500">{subscription.billingCycle}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getStatusBadge(subscription.status)}>
                                  {subscription.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                N${(subscription.monthlyFee / 100).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                N${(subscription.totalPaid / 100).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {subscription.autoRenew ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#111827]/[0.04] text-slate-200">
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-white">Subscription Plans & Pricing</CardTitle>
                  <CardDescription className="text-slate-400">Manage subscription plans and pricing tiers</CardDescription>
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
                            <p className="text-sm text-slate-500">{plan.subscribers} active subscribers</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              N${(plan.price / 100).toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-500">{plan.billingCycle}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Price (NAD)</label>
                            <input
                              type="number"
                              defaultValue={plan.price / 100}
                              step="0.01"
                              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Billing Cycle</label>
                            <select
                              defaultValue={plan.billingCycle}
                              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Annually">Annually</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                            <select
                              defaultValue={plan.status}
                              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-sm font-medium text-slate-300 mb-2">Features</label>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(plan.features) ? plan.features.map((feature, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">
                                {feature}
                              </span>
                            )) : (
                              <span className="text-sm text-slate-500">No features defined</span>
                            )}
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
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="text-white">Create Promo Code</CardTitle>
                    <CardDescription className="text-slate-400">Generate new discount codes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="PROMO2024"
                          value={promoFormData.code}
                          onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                          className="flex-1 px-3 py-2 border border-white/[0.1] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        />
                        <Button variant="outline" size="sm" onClick={generatePromoCode}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Discount Type</label>
                        <select
                          value={promoFormData.discountType}
                          onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="PERCENTAGE">Percentage</option>
                          <option value="FIXED_AMOUNT">Fixed Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Discount Value</label>
                        <input
                          type="number"
                          placeholder="20"
                          value={promoFormData.discountValue}
                          onChange={(e) => setPromoFormData({ ...promoFormData, discountValue: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={promoFormData.startDate}
                          onChange={(e) => setPromoFormData({ ...promoFormData, startDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
                        <input
                          type="date"
                          value={promoFormData.endDate}
                          onChange={(e) => setPromoFormData({ ...promoFormData, endDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Usage Limit</label>
                      <input
                        type="number"
                        placeholder="100 (leave empty for unlimited)"
                        value={promoFormData.usageLimit}
                        onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Applicable Plans</label>
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
                          <p className="text-sm text-slate-500">Loading plans...</p>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#CB2030] hover:bg-[#B01C2A] text-white"
                      onClick={handleCreatePromoCode}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Promo Code
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Promo Codes */}
                <Card className="bg-[#111827] border-white/[0.06]">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Promo Codes</CardTitle>
                    <CardDescription className="text-slate-400">Manage existing discount codes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {promoCodesLoading ? (
                      <p className="text-sm text-slate-500">Loading promo codes...</p>
                    ) : promoCodes.length === 0 ? (
                      <p className="text-sm text-slate-500">No promo codes created yet</p>
                    ) : (
                      <div className="space-y-3">
                        {promoCodes.slice(0, 5).map((promo) => (
                          <div key={promo.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <code className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded font-mono text-sm font-bold">
                                  {promo.code}
                                </code>
                                <Badge className={promo.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#111827]/[0.04] text-slate-400'}>
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

                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-2">
                              <div>
                                <span className="text-slate-500">Used:</span> {promo.usageCount}
                                {promo.usageLimit && ` / ${promo.usageLimit}`}
                              </div>
                              <div>
                                <span className="text-slate-500">Expires:</span>{' '}
                                {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Never'}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {promo.applicablePlans.map((planId: string, idx: number) => {
                                const plan = subscriptionPlans.find(p => p.id === planId);
                                return plan ? (
                                  <span key={idx} className="px-1.5 py-0.5 bg-[#111827]/[0.04] text-slate-400 text-xs rounded">
                                    {plan.name}
                                  </span>
                                ) : null;
                              })}
                            </div>

                            <div className="flex gap-2">
                              <button
                                className="text-xs text-blue-400 hover:text-blue-300"
                                onClick={() => handleEditPromo(promo)}
                              >
                                Edit
                              </button>
                              <button
                                className={`text-xs ${promo.isActive ? 'text-orange-400 hover:text-orange-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                                onClick={() => handleDeactivatePromo(promo.id)}
                              >
                                {promo.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                className="text-xs text-red-400 hover:text-red-300"
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-white">All Promo Codes</CardTitle>
                  <CardDescription className="text-slate-400">Complete list of discount codes and their performance</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0D1117]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Code</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Discount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valid Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plans</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                        {promoCodesLoading ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-slate-500">
                              Loading promo codes...
                            </td>
                          </tr>
                        ) : promoCodes.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-slate-500">
                              No promo codes found
                            </td>
                          </tr>
                        ) : (
                          promoCodes.map((promo) => (
                            <tr key={promo.id} className="hover:bg-[#0D1117]">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <code className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded font-mono text-sm font-bold">
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
                                <Badge className={promo.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#111827]/[0.04] text-slate-200'}>
                                  {promo.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {promo.usageCount}{promo.usageLimit && ` / ${promo.usageLimit}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {promo.startDate ? new Date(promo.startDate).toLocaleDateString() : 'Immediate'} -
                                {promo.endDate ? ` ${new Date(promo.endDate).toLocaleDateString()}` : ' No End'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {promo.applicablePlans.map((planId: string, idx: number) => {
                                    const plan = subscriptionPlans.find(p => p.id === planId);
                                    return plan ? (
                                      <span key={idx} className="px-1.5 py-0.5 bg-[#111827]/[0.04] text-slate-400 text-xs rounded">
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
                    className="bg-[#CB2030] hover:bg-[#B01C2A]"
                    onClick={handleSaveSettings}
                    disabled={!settingsChanged}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Settings Navigation */}
              <div className="border-b border-white/[0.06]">
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
                          : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/[0.1]'
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Settings className="h-5 w-5" />
                        Site Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Site Name</label>
                        <input
                          type="text"
                          value={settingsData.general.siteName}
                          onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Site Description</label>
                        <textarea
                          value={settingsData.general.siteDescription}
                          onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Site URL</label>
                        <input
                          type="url"
                          value={settingsData.general.siteUrl}
                          onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
                        <input
                          type="email"
                          value={settingsData.general.adminEmail}
                          onChange={(e) => updateSettings('general', 'adminEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Globe className="h-5 w-5" />
                        Localization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
                        <select
                          value={settingsData.general.timezone}
                          onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Africa/Windhoek">Africa/Windhoek</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                        <select
                          value={settingsData.general.language}
                          onChange={(e) => updateSettings('general', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="af">Afrikaans</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                        <select
                          value={settingsData.general.currency}
                          onChange={(e) => updateSettings('general', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.general.maintenanceMode ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Guest Browsing</span>
                          <button
                            onClick={() => toggleSetting('general', 'guestBrowsing')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.general.guestBrowsing ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.general.guestBrowsing ? 'translate-x-6' : 'translate-x-1'}`} />
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.requireEmailVerification ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.security.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Two-Factor Authentication</span>
                          <button
                            onClick={() => toggleSetting('security', 'twoFactorAuth')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.twoFactorAuth ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Require CAPTCHA</span>
                          <button
                            onClick={() => toggleSetting('security', 'requireCaptcha')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.requireCaptcha ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.security.requireCaptcha ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password Min Length</label>
                        <input
                          type="number"
                          value={settingsData.security.passwordMinLength}
                          onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={settingsData.security.sessionTimeout}
                          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Shield className="h-5 w-5" />
                        Security Policies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Max Login Attempts</label>
                        <input
                          type="number"
                          value={settingsData.security.maxLoginAttempts}
                          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Account Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          value={settingsData.security.accountLockoutDuration}
                          onChange={(e) => updateSettings('security', 'accountLockoutDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SSL Enabled</span>
                          <button
                            onClick={() => toggleSetting('security', 'sslEnabled')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.sslEnabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.security.sslEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Security Headers</span>
                          <button
                            onClick={() => toggleSetting('security', 'securityHeaders')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${settingsData.security.securityHeaders ? 'bg-[#1F3469]' : 'bg-white/[0.06]'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition ${settingsData.security.securityHeaders ? 'translate-x-6' : 'translate-x-1'}`} />
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <CreditCard className="h-5 w-5" />
                        Payment Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Payment Provider</label>
                        <select
                          value={settingsData.payment.provider}
                          onChange={(e) => updateSettings('payment', 'provider', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Paystack">Paystack</option>
                          <option value="Stripe">Stripe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Paystack Public Key</label>
                        <input
                          type="text"
                          value={settingsData.payment.paystackPublicKey}
                          onChange={(e) => updateSettings('payment', 'paystackPublicKey', e.target.value)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Commission Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settingsData.payment.commissionRate}
                          onChange={(e) => updateSettings('payment', 'commissionRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tax Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settingsData.payment.taxRate}
                          onChange={(e) => updateSettings('payment', 'taxRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <DollarSign className="h-5 w-5" />
                        Pricing Structure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Basic Plan (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.subscriptionPricing.basic / 100}
                          onChange={(e) => {
                            const newPricing = { ...settingsData.payment.subscriptionPricing, basic: parseFloat(e.target.value) * 100 };
                            updateSettings('payment', 'subscriptionPricing', newPricing);
                          }}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Professional Plan (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.subscriptionPricing.professional / 100}
                          onChange={(e) => {
                            const newPricing = { ...settingsData.payment.subscriptionPricing, professional: parseFloat(e.target.value) * 100 };
                            updateSettings('payment', 'subscriptionPricing', newPricing);
                          }}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Enterprise Plan (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.subscriptionPricing.enterprise / 100}
                          onChange={(e) => {
                            const newPricing = { ...settingsData.payment.subscriptionPricing, enterprise: parseFloat(e.target.value) * 100 };
                            updateSettings('payment', 'subscriptionPricing', newPricing);
                          }}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Featured Listing Price (NAD)</label>
                        <input
                          type="number"
                          value={settingsData.payment.featuredListingPrice / 100}
                          onChange={(e) => updateSettings('payment', 'featuredListingPrice', parseFloat(e.target.value) * 100)}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSettingsTab === 'notifications' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Bell className="h-5 w-5" />
                        Email Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New User Registration</p>
                          <p className="text-sm text-slate-400">Notify when new users register</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, newUserRegistration: !settingsData.notifications.emailNotifications.newUserRegistration };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.newUserRegistration ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.notifications.emailNotifications.newUserRegistration ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Listing Posted</p>
                          <p className="text-sm text-slate-400">Notify when dealers post new vehicles</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, newListing: !settingsData.notifications.emailNotifications.newListing };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.newListing ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.notifications.emailNotifications.newListing ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment Received</p>
                          <p className="text-sm text-slate-400">Notify when payments are processed</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, paymentReceived: !settingsData.notifications.emailNotifications.paymentReceived };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.paymentReceived ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.notifications.emailNotifications.paymentReceived ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Moderation Reports</p>
                          <p className="text-sm text-slate-400">Notify when content is reported</p>
                        </div>
                        <button
                          onClick={() => {
                            const newEmailNotifications = { ...settingsData.notifications.emailNotifications, moderationReport: !settingsData.notifications.emailNotifications.moderationReport };
                            updateSettings('notifications', 'emailNotifications', newEmailNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.emailNotifications.moderationReport ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.notifications.emailNotifications.moderationReport ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Smartphone className="h-5 w-5" />
                        Push Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Firebase Server Key</label>
                        <input
                          type="password"
                          value={settingsData.notifications.pushNotifications.firebaseServerKey}
                          onChange={(e) => {
                            const newPushNotifications = { ...settingsData.notifications.pushNotifications, firebaseServerKey: e.target.value };
                            updateSettings('notifications', 'pushNotifications', newPushNotifications);
                          }}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Push Notifications</p>
                          <p className="text-sm text-slate-400">Allow sending push notifications to users</p>
                        </div>
                        <button
                          onClick={() => {
                            const newPushNotifications = { ...settingsData.notifications.pushNotifications, enabled: !settingsData.notifications.pushNotifications.enabled };
                            updateSettings('notifications', 'pushNotifications', newPushNotifications);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.notifications.pushNotifications.enabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.notifications.pushNotifications.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Default Notification Sound</label>
                        <select
                          value={settingsData.notifications.pushNotifications.defaultSound}
                          onChange={(e) => {
                            const newPushNotifications = { ...settingsData.notifications.pushNotifications, defaultSound: e.target.value };
                            updateSettings('notifications', 'pushNotifications', newPushNotifications);
                          }}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Car className="h-5 w-5" />
                        Listing Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-approve Listings</p>
                          <p className="text-sm text-slate-400">Automatically approve new listings without review</p>
                        </div>
                        <button
                          onClick={() => toggleSetting('listings', 'autoApprove')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.listings.autoApprove ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.listings.autoApprove ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Maximum Images per Listing</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={settingsData.listings.maxImages}
                          onChange={(e) => updateSettings('listings', 'maxImages', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Listing Duration (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settingsData.listings.defaultDuration}
                          onChange={(e) => updateSettings('listings', 'defaultDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Price Negotiation</p>
                          <p className="text-sm text-slate-400">Enable price negotiation features</p>
                        </div>
                        <button
                          onClick={() => toggleSetting('listings', 'allowNegotiation')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.listings.allowNegotiation ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.listings.allowNegotiation ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Monitor className="h-5 w-5" />
                        Featured Listings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Featured Slots</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={settingsData.listings.featuredSlots}
                          onChange={(e) => updateSettings('listings', 'featuredSlots', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Featured Duration (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={settingsData.listings.featuredDuration}
                          onChange={(e) => updateSettings('listings', 'featuredDuration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-renew Featured</p>
                          <p className="text-sm text-slate-400">Automatically renew featured listings</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.listings.autoRenewFeatured ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Server className="h-5 w-5" />
                        API Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable API Access</p>
                          <p className="text-sm text-slate-400">Allow third-party API access</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.api.enabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.api.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Rate Limit (requests/hour)</label>
                        <input
                          type="number"
                          min="100"
                          max="10000"
                          defaultValue={settingsData.api.rateLimit}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">API Version</label>
                        <select className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="v1">Version 1.0</option>
                          <option value="v2">Version 2.0</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Require API Keys</p>
                          <p className="text-sm text-slate-400">Require authentication for API access</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.api.requireAuth ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.api.requireAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Key className="h-5 w-5" />
                        API Keys
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Master API Key</label>
                        <input
                          type="password"
                          defaultValue={settingsData.api.masterKey}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Webhook Secret</label>
                        <input
                          type="password"
                          defaultValue={settingsData.api.webhookSecret}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Link className="h-5 w-5" />
                        Third-party Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Google Analytics</p>
                          <p className="text-sm text-slate-400">Track website analytics with Google Analytics</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.integrations.googleAnalytics.enabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.integrations.googleAnalytics.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Google Analytics ID</label>
                        <input
                          type="text"
                          defaultValue={settingsData.integrations.googleAnalytics.trackingId}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Facebook Pixel</p>
                          <p className="text-sm text-slate-400">Track conversions with Facebook Pixel</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.integrations.facebookPixel.enabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.integrations.facebookPixel.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Facebook Pixel ID</label>
                        <input
                          type="text"
                          defaultValue={settingsData.integrations.facebookPixel.pixelId}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Cloud className="h-5 w-5" />
                        Cloud Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">AWS S3 Storage</p>
                          <p className="text-sm text-slate-400">Store images and files on Amazon S3</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.integrations.awsS3.enabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.integrations.awsS3.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">S3 Bucket Name</label>
                        <input
                          type="text"
                          defaultValue={settingsData.integrations.awsS3.bucketName}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">AWS Region</label>
                        <select className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <HardDrive className="h-5 w-5" />
                        Backup Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto Backup</p>
                          <p className="text-sm text-slate-400">Automatically create system backups</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.backup.autoBackup ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Backup Frequency</label>
                        <select className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Retention Period (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          defaultValue={settingsData.backup.retentionDays}
                          className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Storage Location</label>
                        <select className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="local">Local Storage</option>
                          <option value="s3">Amazon S3</option>
                          <option value="gcs">Google Cloud Storage</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <DatabaseIcon className="h-5 w-5" />
                        Database Backup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-4">Last backup: {settingsData.backup.lastBackup}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Include User Data</p>
                          <p className="text-sm text-slate-400">Backup user profiles and preferences</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.backup.includeUserData ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                              settingsData.backup.includeUserData ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Include Media Files</p>
                          <p className="text-sm text-slate-400">Backup uploaded images and documents</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settingsData.backup.includeMedia ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
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
                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Monitor className="h-5 w-5" />
                          Banner Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Maximum Banners</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            defaultValue={settingsData.banners.maxBanners}
                            className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Default Position</label>
                          <select
                            defaultValue={settingsData.banners.defaultPosition}
                            className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {settingsData.banners.positions.map(position => (
                              <option key={position} value={position}>{position}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Max File Size (MB)</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            defaultValue={settingsData.banners.maxFileSize}
                            className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Default Duration (days)</label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            defaultValue={settingsData.banners.defaultDuration}
                            className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Settings className="h-5 w-5" />
                          Display Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto Rotation</p>
                            <p className="text-sm text-slate-400">Automatically rotate banners</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.autoRotation ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.autoRotation ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Rotation Interval (seconds)</label>
                          <input
                            type="number"
                            min="5"
                            max="300"
                            defaultValue={settingsData.banners.rotationInterval}
                            className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Click Tracking</p>
                            <p className="text-sm text-slate-400">Track banner click events</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.clickTracking ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.clickTracking ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Impression Tracking</p>
                            <p className="text-sm text-slate-400">Track banner view events</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.impressionTracking ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
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
                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Lock className="h-5 w-5" />
                          Banner Permissions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Require Approval</p>
                            <p className="text-sm text-slate-400">New banners need admin approval</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.requireApproval ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.requireApproval ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Allow External Links</p>
                            <p className="text-sm text-slate-400">Enable links to external websites</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.allowExternalLinks ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.allowExternalLinks ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enable Scheduling</p>
                            <p className="text-sm text-slate-400">Allow scheduled banner campaigns</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.enableScheduling ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.enableScheduling ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#111827] border-white/[0.06]">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Cloud className="h-5 w-5" />
                          Image Processing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto Compression</p>
                            <p className="text-sm text-slate-400">Automatically compress banner images</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.compressionEnabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Compression Quality (%)</label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            defaultValue={settingsData.banners.compressionQuality}
                            className="w-full px-3 py-2 border border-white/[0.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Watermark</p>
                            <p className="text-sm text-slate-400">Add watermark to banner images</p>
                          </div>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settingsData.banners.watermarkEnabled ? 'bg-[#1F3469]' : 'bg-white/[0.06]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-[#111827] transition-transform ${
                                settingsData.banners.watermarkEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Allowed File Types</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {settingsData.banners.allowedFileTypes.map(type => (
                              <span key={type} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">
                                .{type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card className="bg-[#111827] border-white/[0.06]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <BarChart3 className="h-5 w-5" />
                        Banner Management Actions
                      </CardTitle>
                      <CardDescription className="text-slate-400">Quick actions for managing advertisement banners</CardDescription>
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Configuration Summary</CardTitle>
                  <CardDescription className="text-slate-400">Current platform configuration overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{settingsData.general.siteName}</div>
                      <p className="text-sm text-slate-400">Platform Name</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{settingsData.payment.paymentProvider}</div>
                      <p className="text-sm text-slate-400">Payment Provider</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{settingsData.general.timezone}</div>
                      <p className="text-sm text-slate-400">Timezone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <EventsAdminPanel />
          )}

          {/* Other tabs content */}
          {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'dealers' && activeTab !== 'listings' && activeTab !== 'subscriptions' && activeTab !== 'moderation' && activeTab !== 'analytics' && activeTab !== 'settings' && activeTab !== 'featured-requests' && activeTab !== 'invoices' && activeTab !== 'sell-your-car' && activeTab !== 'advertisements' && activeTab !== 'messages' && activeTab !== 'events' && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-white mb-2">
                {navigation.find(nav => nav.id === activeTab)?.name} Section
              </h3>
              <p className="text-slate-400 mb-4">This section is under development.</p>
              <Button onClick={() => setActiveTab('overview')}>Back to Overview</Button>
            </div>
          )}
        </div>
      </div>

      {/* Dealer Details Modal */}
      {dealerModalOpen && selectedDealer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDealerModalOpen(false)}>
          <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Dealer Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setDealerModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Dealer Name</label>
                    <p className="text-lg font-semibold">{selectedDealer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Contact Person</label>
                    <p>{selectedDealer.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <p>{selectedDealer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Phone</label>
                    <p>{selectedDealer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Address</label>
                    <p>{selectedDealer.address}</p>
                    <p className="text-sm text-slate-500">{selectedDealer.city}, {selectedDealer.region}</p>
                  </div>
                  {selectedDealer.website && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Website</label>
                      <p className="text-blue-600">{selectedDealer.website}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Business License</label>
                    <p>{selectedDealer.businessLicense}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Tax Number</label>
                    <p>{selectedDealer.taxNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Verification Status</label>
                    <Badge className={
                      selectedDealer.verificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedDealer.verificationStatus === 'Flagged' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }>
                      {selectedDealer.verificationStatus}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Account Status</label>
                    <Badge className={
                      selectedDealer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedDealer.status === 'Suspended' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }>
                      {selectedDealer.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Joined Date</label>
                    <p>{new Date(selectedDealer.joinedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Last Login</label>
                    <p>{new Date(selectedDealer.lastLogin).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Plan</label>
                    <p className="text-lg font-semibold">{selectedDealer.subscriptionPlan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Monthly Fee</label>
                    <p className="text-lg font-semibold">N${(selectedDealer.monthlyFee / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Payment Status</label>
                    <Badge className={
                      selectedDealer.subscriptionStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedDealer.subscriptionStatus === 'Overdue' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }>
                      {selectedDealer.subscriptionStatus}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Monthly Revenue</label>
                    <p>N${(selectedDealer.monthlyRevenue || 0).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Active Listings</label>
                    <p className="text-lg font-semibold">{selectedDealer.activeListings}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Total Listings</label>
                    <p>{selectedDealer.totalListings}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Total Sales</label>
                    <p className="text-lg font-semibold">{selectedDealer.totalSales}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Rating</label>
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
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
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
                    className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
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
                    className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setListingModalOpen(false)}>
          <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Listing Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setListingModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Title</label>
                    <p className="text-lg font-semibold">{selectedListing.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Make</label>
                      <p>{selectedListing.make}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Model</label>
                      <p>{selectedListing.model}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Year</label>
                      <p>{selectedListing.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Price</label>
                      <p className="text-lg font-semibold">N${(selectedListing.price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Mileage</label>
                      <p>{(selectedListing.mileage || 0).toLocaleString()} km</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Condition</label>
                      <p>{selectedListing.condition}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Fuel Type</label>
                      <p>{selectedListing.fuelType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Transmission</label>
                      <p>{selectedListing.transmission}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Body Type</label>
                      <p>{selectedListing.bodyType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Color</label>
                      <p>{selectedListing.color}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings2 className="h-5 w-5" />
                    Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">VIN</label>
                    <p className="font-mono text-sm">{selectedListing.vin}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Engine Size</label>
                      <p>{selectedListing.engineSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Drivetrain</label>
                      <p>{selectedListing.drivetrain}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Doors</label>
                      <p>{selectedListing.doors}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Seats</label>
                      <p>{selectedListing.seats}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Registration</label>
                    <p>{selectedListing.registration}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Warranty</label>
                      <Badge className={selectedListing.warranty === 'Yes' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#111827]/[0.04] text-slate-200'}>
                        {selectedListing.warranty}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Service History</label>
                      <p className="text-sm">{selectedListing.serviceHistory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dealer Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Building className="h-5 w-5" />
                    Dealer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Dealer</label>
                    <p className="text-lg font-semibold">{selectedListing.dealerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Contact</label>
                    <p>{selectedListing.dealerContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Location</label>
                    <p>{selectedListing.location}, {selectedListing.region}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Listing Status & Performance */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    Status & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Listing Status</label>
                      <Badge className={
                        selectedListing.listingStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                        selectedListing.listingStatus === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                        selectedListing.listingStatus === 'Under Review' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-amber-500/10 text-amber-400'
                      }>
                        {selectedListing.listingStatus}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Status</label>
                      <Badge className={
                        selectedListing.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-red-500/10 text-red-400'
                      }>
                        {selectedListing.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Featured</label>
                    <div className="flex items-center gap-2">
                      <Badge className={selectedListing.featured ? 'bg-amber-500/10 text-amber-400' : 'bg-[#111827]/[0.04] text-slate-200'}>
                        {selectedListing.featured ? 'Yes' : 'No'}
                      </Badge>
                      {selectedListing.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Views</label>
                      <p className="text-lg font-semibold">{(selectedListing.views || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Inquiries</label>
                      <p className="text-lg font-semibold">{selectedListing.inquiries}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Posted</label>
                      <p>{new Date(selectedListing.datePosted).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Last Updated</label>
                      <p>{new Date(selectedListing.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="mt-6 bg-[#111827] border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-white">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{selectedListing.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mt-6 bg-[#111827] border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-white">Features</CardTitle>
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
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
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
                  className={selectedListing.featured ? "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10" : "border-white/[0.1] text-slate-400 hover:bg-[#0D1117]"}
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto pt-20 pb-8"
          onClick={() => {
            console.log('Closing modal');
            setReportModalOpen(false);
          }}
        >
          <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-4xl w-full mx-4 mb-8" onClick={(e) => {
            console.log('Modal content clicked');
            e.stopPropagation();
          }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Report Details</h2>
              <Button variant="ghost" size="sm" onClick={() => {
                console.log('Close button clicked');
                setReportModalOpen(false);
              }}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FlagIcon className="h-5 w-5" />
                    Report Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Report ID</label>
                    <p className="font-mono text-sm">{selectedReport.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Target</label>
                    <p className="text-lg font-semibold">{selectedReport.targetTitle}</p>
                    <p className="text-sm text-slate-500">{selectedReport.targetType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Report Reason</label>
                      <p>{selectedReport.reportReason}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Category</label>
                      <p>{selectedReport.reportCategory}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Severity</label>
                      <Badge className={
                        selectedReport.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                        selectedReport.severity === 'High' ? 'bg-orange-500/10 text-orange-400' :
                        selectedReport.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }>
                        {selectedReport.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Status</label>
                      <Badge className={
                        selectedReport.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                        selectedReport.status === 'Under Review' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }>
                        {selectedReport.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Date Reported</label>
                      <p>{new Date(selectedReport.dateReported).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Last Updated</label>
                      <p>{new Date(selectedReport.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reporter Information */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    Reporter Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Reporter Name</label>
                    <p className="text-lg font-semibold">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <p>{selectedReport.reporterEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Reporter ID</label>
                    <p className="font-mono text-sm">{selectedReport.reportedBy}</p>
                  </div>
                  {selectedReport.dealerName && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Associated Dealer</label>
                      <p>{selectedReport.dealerName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Moderation Status */}
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShieldCheck className="h-5 w-5" />
                    Moderation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Assigned To</label>
                    <p>{selectedReport.assignedTo || 'Unassigned'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Action Taken</label>
                    <p>{selectedReport.actionTaken || 'No action yet'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Resolution</label>
                    <p>{selectedReport.resolution || 'Pending review'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Evidence Files</label>
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
              <Card className="bg-[#111827] border-white/[0.06]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageSquare className="h-5 w-5" />
                    Review Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Admin Notes</label>
                    <p className="text-sm bg-[#0D1117] p-3 rounded">
                      {selectedReport.reviewNotes || 'No review notes yet.'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500">Add Note</label>
                    <textarea
                      className="w-full p-3 border border-white/[0.1] rounded-lg resize-none"
                      rows={3}
                      placeholder="Add your review notes here..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="mt-6 bg-[#111827] border-white/[0.06]">
              <CardHeader>
                <CardTitle className="text-white">Report Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{selectedReport.description}</p>
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
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
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
                    className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                  >
                    <UserCheck2 className="h-4 w-4 mr-2" />
                    Assign to Me
                  </Button>
                )}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="border-white/[0.1] text-slate-400 hover:bg-[#0D1117]"
                    onClick={() => setModerateMenuOpen(!moderateMenuOpen)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Moderate
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                  {moderateMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-[#111827] rounded-lg shadow-lg border border-white/[0.06] z-10">
                      <div className="py-2">
                        {selectedReport.type === 'listing' && (
                          <>
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
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
                        <div className="border-t border-white/[0.06] my-2"></div>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-[#0D1117] text-sm flex items-center gap-2"
                          onClick={() => {
                            setModerateMenuOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400">Cancel</span>
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
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/[0.1] hover:border-gray-400'
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
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/[0.1] hover:border-gray-400'
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
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-white/[0.1] hover:border-gray-400'
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
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
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
            <div className="bg-[#0D1117] border border-white/[0.06] rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-2">Report will include:</h4>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
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
              className="flex items-center gap-2 bg-[#CB2030] hover:bg-[#B01C2A] text-white"
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
                <div className="text-sm text-slate-400">
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
                <thead className="bg-[#0D1117]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Dealer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                  {dealers
                    .filter(dealer => {
                      if (paymentFilter === 'pending') return dealer.subscriptionStatus === 'Pending';
                      if (paymentFilter === 'overdue') return dealer.subscriptionStatus === 'Overdue';
                      return true;
                    })
                    .map((dealer) => (
                      <tr
                        key={dealer.id}
                        className={`hover:bg-[#0D1117] ${
                          selectedPayments.includes(dealer.id) ? 'bg-blue-500/100/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(dealer.id)}
                            onChange={() => togglePaymentSelection(dealer.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/[0.1] rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-white">{dealer.name}</div>
                            <div className="text-sm text-slate-500">{dealer.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{dealer.subscriptionPlan}</td>
                        <td className="px-4 py-3 text-sm font-medium text-white">
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
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
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
              <label className="block text-sm font-medium text-slate-300 mb-1">
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
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={planFormData.description || ''}
                onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})}
                placeholder="Plan description"
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
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
                <label className="block text-sm font-medium text-slate-300 mb-1">
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
                <label className="block text-sm font-medium text-slate-300 mb-1">
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
                <label className="block text-sm font-medium text-slate-300 mb-1">
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
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Status
              </label>
              <select
                value={planFormData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setPlanFormData({...planFormData, isActive: e.target.value === 'active'})}
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
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
              <label className="block text-sm font-medium text-slate-300 mb-1">Code</label>
              <Input
                value={promoFormData.code}
                onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                placeholder="PROMO2024"
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Discount Type</label>
                <select
                  value={promoFormData.discountType}
                  onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Discount Value</label>
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                <Input
                  type="date"
                  value={promoFormData.startDate}
                  onChange={(e) => setPromoFormData({ ...promoFormData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
                <Input
                  type="date"
                  value={promoFormData.endDate}
                  onChange={(e) => setPromoFormData({ ...promoFormData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Usage Limit</label>
              <Input
                type="number"
                value={promoFormData.usageLimit}
                onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: e.target.value })}
                placeholder="100 (leave empty for unlimited)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Applicable Plans</label>
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
            <Button onClick={handleUpdatePromo} className="bg-[#CB2030] hover:bg-[#B01C2A] text-white">
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
              <div className="bg-[#0D1117] rounded-lg p-4 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <code className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded font-mono text-sm font-bold">
                    {promoToDelete.code}
                  </code>
                  <span className="text-sm font-medium">
                    {promoToDelete.discountType === 'PERCENTAGE'
                      ? `${promoToDelete.discountValue}%`
                      : `N$${(promoToDelete.discountValue / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  <div>Used: {promoToDelete.usageCount}{promoToDelete.usageLimit && ` / ${promoToDelete.usageLimit}`}</div>
                  <div>Expires: {promoToDelete.endDate ? new Date(promoToDelete.endDate).toLocaleDateString() : 'Never'}</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-4">
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
                <thead className="bg-[#0D1117]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Dealer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-[#0D1117]">
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
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/[0.1] rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white">{listing.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{listing.dealer}</td>
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
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
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
            >
              {isSendingNewsletter ? 'Sending...' : 'Send Newsletter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setPreviewBanner(null)}>
          <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Banner Preview</h2>
              <button
                onClick={() => setPreviewBanner(null)}
                className="text-slate-500 hover:text-slate-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{previewBanner.title}</h3>
                <Badge className={previewBanner.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#111827]/[0.04] text-slate-200'}>
                  {previewBanner.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              {/* Banner Image Preview */}
              <div className="aspect-video bg-[#111827]/[0.04] rounded-lg overflow-hidden">
                {previewBanner.imageUrl ? (
                  <img
                    src={previewBanner.imageUrl}
                    alt={previewBanner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-slate-500">
                    <div>
                      <Image className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#0D1117] rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Position</p>
                  <p className="font-medium">{previewBanner.position}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Priority</p>
                  <p className="font-medium">{previewBanner.priority || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Link URL</p>
                  <p className="font-medium text-blue-600 truncate">{previewBanner.linkUrl || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="font-medium">{previewBanner.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Start Date</p>
                  <p className="font-medium">{previewBanner.startDate ? new Date(previewBanner.startDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">End Date</p>
                  <p className="font-medium">{previewBanner.endDate ? new Date(previewBanner.endDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Clicks</p>
                  <p className="font-medium text-blue-600">{(previewBanner.clicks || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Impressions</p>
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
                  className="bg-[#CB2030] hover:bg-[#B01C2A]"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditingBanner(null)}>
          <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Banner</h2>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-slate-500 hover:text-slate-400"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Banner Title</label>
                <Input
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({...editingBanner, title: e.target.value})}
                  placeholder="Enter banner title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                <div className="w-full border border-white/[0.1] bg-[#0D1117] rounded-lg px-3 py-2 text-slate-400">
                  {editingBanner.position} (Fixed)
                </div>
                <p className="text-xs text-slate-500 mt-1">Banner position cannot be changed. This slot is fixed on the website.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <Input
                  value={editingBanner.imageUrl}
                  onChange={(e) => setEditingBanner({...editingBanner, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Link URL</label>
                <Input
                  value={editingBanner.linkUrl || ''}
                  onChange={(e) => setEditingBanner({...editingBanner, linkUrl: e.target.value})}
                  placeholder="/vehicles"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <Input
                    type="number"
                    value={editingBanner.priority || 0}
                    onChange={(e) => setEditingBanner({...editingBanner, priority: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    className="w-full border border-white/[0.1] rounded-lg px-3 py-2"
                    value={editingBanner.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingBanner({...editingBanner, isActive: e.target.value === 'active'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Banner Size Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
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
                  className="bg-[#CB2030] hover:bg-[#B01C2A]"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
                          ? 'border-blue-500 bg-blue-500/10 shadow-md'
                          : 'border-white/[0.06] hover:border-blue-300 hover:shadow-none'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-2 right-3">
                          <Badge className="bg-green-600 text-white text-xs">Current Plan</Badge>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                          <p className="text-sm text-slate-400">{plan.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-blue-600">
                            N${(plan.price / 100).toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500">/month</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-slate-300">
                            {plan.maxListings === 0 ? 'Unlimited' : plan.maxListings} listings
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-slate-300">{plan.maxPhotos} photos/listing</span>
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] disabled:opacity-50 disabled:cursor-not-allowed"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
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
                <h3 className="text-sm font-semibold text-white">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Business Name
                    </label>
                    <Input
                      value={editingDealer.name || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, name: e.target.value})}
                      placeholder="Business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Contact Person
                    </label>
                    <Input
                      value={editingDealer.contactPerson || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, contactPerson: e.target.value})}
                      placeholder="Contact person"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
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
                    <label className="block text-sm font-medium text-slate-300 mb-1">
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
                <h3 className="text-sm font-semibold text-white">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Street Address
                    </label>
                    <Input
                      value={editingDealer.address || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, address: e.target.value})}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      City
                    </label>
                    <Input
                      value={editingDealer.city || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Region
                    </label>
                    <Input
                      value={editingDealer.region || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, region: e.target.value})}
                      placeholder="Region"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
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
                <h3 className="text-sm font-semibold text-white">Business Registration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Business License Number
                    </label>
                    <Input
                      value={editingDealer.businessLicense || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, businessLicense: e.target.value})}
                      placeholder="Business license"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Tax Number
                    </label>
                    <Input
                      value={editingDealer.taxNumber || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, taxNumber: e.target.value})}
                      placeholder="Tax number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Business Type
                    </label>
                    <Input
                      value={editingDealer.businessType || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, businessType: e.target.value})}
                      placeholder="Business type"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
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
              className="bg-[#CB2030] hover:bg-[#B01C2A]"
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
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
              <li>Set all pending listings to &quot;Approved&quot; status</li>
              <li>Make them visible to the public</li>
              <li>Send approval notification emails to all affected dealers</li>
              <li>
                Approve{' '}
                <span className="font-semibold text-white">
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
                  <tr className="bg-[#0D1117] border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Report</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reporter</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#111827] divide-y divide-white/[0.06]">
                  {reports
                    .filter(r =>
                      (r.severity === 'High' || r.severity === 'Critical') &&
                      (r.status === 'Pending' || r.status === 'Under Review')
                    )
                    .map((report) => (
                      <tr key={report.id} className="hover:bg-[#0D1117]">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-white">{report.targetTitle}</div>
                          <div className="text-xs text-slate-500">{report.reportReason}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-white">{report.targetType}</div>
                          <div className="text-xs text-slate-500">{report.reportCategory}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-white">{report.reporterName}</div>
                          <div className="text-xs text-slate-500">{report.reporterEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            report.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                            'bg-orange-500/10 text-orange-400'
                          }>
                            {report.severity}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={
                            report.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-blue-500/10 text-blue-400'
                          }>
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300"
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
                              className="text-emerald-400 hover:text-emerald-300"
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
                              className="text-red-400 hover:text-red-300"
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
              <div className="text-center py-8 text-slate-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-slate-500" />
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
                <label className="text-sm font-semibold text-slate-300">Report Type</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="reportType" id="traffic" className="h-4 w-4" defaultChecked />
                    <label htmlFor="traffic" className="text-sm cursor-pointer flex-1">Traffic & User Behavior</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="reportType" id="revenue" className="h-4 w-4" />
                    <label htmlFor="revenue" className="text-sm cursor-pointer flex-1">Revenue & Subscriptions</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="reportType" id="listings" className="h-4 w-4" />
                    <label htmlFor="listings" className="text-sm cursor-pointer flex-1">Listing Performance</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="reportType" id="geographic" className="h-4 w-4" />
                    <label htmlFor="geographic" className="text-sm cursor-pointer flex-1">Geographic Distribution</label>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300">Date Range</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="dateRange" id="last7" className="h-4 w-4" defaultChecked />
                    <label htmlFor="last7" className="text-sm cursor-pointer flex-1">Last 7 Days</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="dateRange" id="last30" className="h-4 w-4" />
                    <label htmlFor="last30" className="text-sm cursor-pointer flex-1">Last 30 Days</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="dateRange" id="last90" className="h-4 w-4" />
                    <label htmlFor="last90" className="text-sm cursor-pointer flex-1">Last 90 Days</label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-[#0D1117] cursor-pointer">
                    <input type="radio" name="dateRange" id="custom" className="h-4 w-4" />
                    <label htmlFor="custom" className="text-sm cursor-pointer flex-1">Custom Range</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Preview */}
            <div className="border rounded-lg p-4 bg-[#0D1117]">
              <h4 className="text-sm font-semibold mb-3">Report Preview</h4>
              <p className="text-sm text-slate-400 mb-4">
                Traffic & User Behavior report for the last 7 days
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#111827] p-3 rounded border">
                  <div className="text-2xl font-bold text-blue-600">
                    {((analyticsData.traffic.daily || []).slice(-7).reduce((sum, day) => sum + (day.views || 0), 0)).toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Total Views</p>
                </div>
                <div className="bg-[#111827] p-3 rounded border">
                  <div className="text-2xl font-bold text-green-600">
                    {((analyticsData.traffic.daily || []).slice(-7).reduce((sum, day) => sum + (day.visitors || 0), 0)).toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Unique Visitors</p>
                </div>
                <div className="bg-[#111827] p-3 rounded border">
                  <div className="text-2xl font-bold text-purple-600">
                    {(analyticsData.traffic.daily || []).slice(-7).reduce((sum, day) => sum + (day.conversions || 0), 0)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Conversions</p>
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
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
                      <span className="text-sm text-slate-300">{source.name}</span>
                      <span className="text-sm font-semibold text-white">
                        {source.visitors.toLocaleString()} ({source.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5">
                      <div
                        className="bg-[#1F3469] h-2.5 rounded-full"
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
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-2">Make</th>
                      <th className="text-right py-2">Views</th>
                      <th className="text-right py-2">Inquiries</th>
                      <th className="text-right py-2">Sales</th>
                      <th className="text-right py-2">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analyticsData.listings.performance || []).map((make, index) => (
                      <tr key={index} className="border-b border-white/[0.06]">
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
                  <div key={index} className="bg-[#0D1117] p-3 rounded border">
                    <div className="text-lg font-bold text-white">{region.region}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      {region.users.toLocaleString()} users
                    </div>
                    <div className="text-sm font-semibold text-green-600 mt-1">
                      N${(region.revenue / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
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
              <Settings2 className="h-5 w-5 text-slate-400" />
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
                    <p className="text-xs text-slate-500">Track page views across the platform</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">User Event Tracking</p>
                    <p className="text-xs text-slate-500">Track user interactions and events</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Conversion Tracking</p>
                    <p className="text-xs text-slate-500">Track lead generation and sales conversions</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Revenue Tracking</p>
                    <p className="text-xs text-slate-500">Track subscription and payment revenue</p>
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
                  <p className="text-xs text-slate-500 mt-1">
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
                    <p className="text-xs text-slate-500">Receive daily analytics summary</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Weekly Performance Report</p>
                    <p className="text-xs text-slate-500">Receive weekly performance insights</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Monthly Executive Summary</p>
                    <p className="text-xs text-slate-500">Comprehensive monthly report</p>
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
              className="bg-[#CB2030] hover:bg-[#B01C2A] text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Featured Request Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Approve Featured Request
            </DialogTitle>
            <DialogDescription>
              Approve this dealership's request to be featured on the homepage?
            </DialogDescription>
          </DialogHeader>
          {selectedFeaturedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-[#0D1117] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-300">Dealership:</span>
                  <span className="text-sm text-white">{selectedFeaturedRequest.dealership.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-300">Duration:</span>
                  <span className="text-sm text-white">{selectedFeaturedRequest.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-300">Amount:</span>
                  <span className="text-sm font-bold text-green-600">N${selectedFeaturedRequest.amount}</span>
                </div>
              </div>
              {selectedFeaturedRequest.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes:</label>
                  <p className="text-sm text-slate-400 bg-[#0D1117] rounded p-3">{selectedFeaturedRequest.notes}</p>
                </div>
              )}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Upon approval, the dealership will be featured immediately and the featured period will start today.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialogOpen(false);
                setSelectedFeaturedRequest(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveFeaturedRequest}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Featured Request Dialog */}
      <Dialog open={rejectFeaturedDialogOpen} onOpenChange={setRejectFeaturedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Reject Featured Request</DialogTitle>
            <DialogDescription>
              Reject this dealership's request to be featured. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          {selectedFeaturedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-[#0D1117] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-300">Dealership:</span>
                  <span className="text-sm text-white">{selectedFeaturedRequest.dealership.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-300">Duration:</span>
                  <span className="text-sm text-white">{selectedFeaturedRequest.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-300">Amount:</span>
                  <span className="text-sm text-white">N${selectedFeaturedRequest.amount}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason for rejection
                </label>
                <Textarea
                  value={featuredRejectionReason}
                  onChange={(e) => setFeaturedRejectionReason(e.target.value)}
                  placeholder="Please explain why this request is being rejected..."
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectFeaturedDialogOpen(false);
                setSelectedFeaturedRequest(null);
                setFeaturedRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectFeaturedRequest}
              className="bg-red-600 hover:bg-red-700"
              disabled={!featuredRejectionReason.trim()}
            >
              <X className="h-4 w-4 mr-2" />
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Featured Request Dialog */}
      <Dialog open={viewFeaturedDialogOpen} onOpenChange={setViewFeaturedDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Featured Request Details
            </DialogTitle>
            <DialogDescription>
              View the complete details of this featured dealership request
            </DialogDescription>
          </DialogHeader>
          {selectedFeaturedRequest && (
            <div className="space-y-4 py-4">
              {/* Dealership Information */}
              <div className="bg-blue-500/10 rounded-lg p-4 space-y-3 border border-blue-500/20">
                <h3 className="font-semibold text-white mb-2">Dealership Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-medium text-slate-300">Name:</span>
                    <p className="text-sm text-white mt-1">{selectedFeaturedRequest.dealership.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-300">Location:</span>
                    <p className="text-sm text-white mt-1">{selectedFeaturedRequest.dealership.city}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-300">Email:</span>
                    <p className="text-sm text-white mt-1">{selectedFeaturedRequest.dealership.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-300">Status:</span>
                    <Badge className={`mt-1 ${
                      selectedFeaturedRequest.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedFeaturedRequest.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                      selectedFeaturedRequest.status === 'APPROVED' ? 'bg-blue-500/10 text-blue-400' :
                      selectedFeaturedRequest.status === 'EXPIRED' ? 'bg-[#111827]/[0.04] text-slate-200' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {selectedFeaturedRequest.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-[#0D1117] rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-white mb-2">Request Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm font-medium text-slate-300">Duration:</span>
                    <p className="text-sm text-white mt-1">{selectedFeaturedRequest.duration} days</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-300">Amount:</span>
                    <p className="text-sm font-bold text-green-600 mt-1">N${selectedFeaturedRequest.amount}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-300">Requested:</span>
                    <p className="text-sm text-white mt-1">
                      {new Date(selectedFeaturedRequest.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-300">Payment Status:</span>
                    <Badge className={`mt-1 ${
                      selectedFeaturedRequest.paymentStatus === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedFeaturedRequest.paymentStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {selectedFeaturedRequest.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Active Period (if approved) */}
              {selectedFeaturedRequest.startDate && selectedFeaturedRequest.endDate && (
                <div className="bg-emerald-500/10 rounded-lg p-4 space-y-2 border border-emerald-500/20">
                  <h3 className="font-semibold text-white mb-2">Featured Period</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-medium text-slate-300">Start Date:</span>
                      <p className="text-sm text-white mt-1">
                        {new Date(selectedFeaturedRequest.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-300">End Date:</span>
                      <p className="text-sm text-white mt-1">
                        {new Date(selectedFeaturedRequest.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval/Rejection Details */}
              {selectedFeaturedRequest.approvedAt && (
                <div className="bg-blue-500/10 rounded-lg p-4 space-y-2 border border-blue-500/20">
                  <h3 className="font-semibold text-white mb-2">Approval Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-medium text-slate-300">Approved By:</span>
                      <p className="text-sm text-white mt-1">{selectedFeaturedRequest.approvedBy || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-300">Approved At:</span>
                      <p className="text-sm text-white mt-1">
                        {new Date(selectedFeaturedRequest.approvedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedFeaturedRequest.rejectedAt && (
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-white mb-2">Rejection Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-300">Rejected By:</span>
                      <p className="text-sm text-white mt-1">{selectedFeaturedRequest.rejectedBy || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-300">Rejected At:</span>
                      <p className="text-sm text-white mt-1">
                        {new Date(selectedFeaturedRequest.rejectedAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedFeaturedRequest.rejectionReason && (
                      <div>
                        <span className="text-sm font-medium text-slate-300">Reason:</span>
                        <p className="text-sm text-white mt-1">{selectedFeaturedRequest.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedFeaturedRequest.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes from Dealership:</label>
                  <p className="text-sm text-slate-400 bg-[#0D1117] rounded p-3 border border-white/[0.06]">
                    {selectedFeaturedRequest.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewFeaturedDialogOpen(false);
                setSelectedFeaturedRequest(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Events Admin Panel ────────────────────────────────────────── */
function EventsAdminPanel() {
  const EMPTY_FORM = {
    title: '', description: '', date: '', endDate: '',
    location: '', venue: '', category: '', imageUrl: '',
    externalUrl: '', isFeatured: false, isPublished: true,
  };

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Sub-panel tabs
  const [subTab, setSubTab] = useState<'events' | 'inquiries'>('events');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const CATEGORIES = ['Car Show', 'Auction', 'Expo', 'Track Day', 'Other'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?all=1&limit=100');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch { setEvents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch('/api/events/advertise');
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch { setInquiries([]); }
    finally { setInquiriesLoading(false); }
  };

  useEffect(() => { if (subTab === 'inquiries') fetchInquiries(); }, [subTab]);

  const updateInquiryStatus = async (id: string, status: string) => {
    setUpdatingStatus(id);
    try {
      await fetch('/api/events/advertise', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await fetchInquiries();
    } catch { alert('Failed to update status.'); }
    finally { setUpdatingStatus(null); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (ev: any) => {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description || '',
      date: ev.date ? ev.date.slice(0, 16) : '',
      endDate: ev.endDate ? ev.endDate.slice(0, 16) : '',
      location: ev.location || '',
      venue: ev.venue || '',
      category: ev.category || '',
      imageUrl: ev.imageUrl || '',
      externalUrl: ev.externalUrl || '',
      isFeatured: ev.isFeatured,
      isPublished: ev.isPublished,
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.title || !form.date) return alert('Title and date are required.');
    setSaving(true);
    try {
      const url = editing ? `/api/events/${editing.id}` : '/api/events';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      closeForm();
      await fetchEvents();
    } catch { alert('Failed to save event. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/events/${deleting.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setDeleting(null);
      await fetchEvents();
    } catch { alert('Failed to delete event.'); }
  };

  const upcomingCount = events.filter(e => new Date(e.date) >= new Date()).length;
  const publishedCount = events.filter(e => e.isPublished).length;
  const featuredCount = events.filter(e => e.isFeatured).length;

  const inputCls = 'w-full h-9 px-3 rounded-md border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 bg-[#111827]';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1';

  const INQUIRY_STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-500/10 text-amber-400',
    REVIEWED: 'bg-blue-500/10 text-blue-400',
    APPROVED: 'bg-emerald-500/10 text-emerald-400',
    REJECTED: 'bg-red-500/10 text-red-400',
  };

  const pendingCount = inquiries.filter(i => i.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1 border-b border-white/[0.06]">
        <button
          onClick={() => setSubTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            subTab === 'events'
              ? 'border-[#CB2030] text-[#CB2030]'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Manage Events
        </button>
        <button
          onClick={() => setSubTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            subTab === 'inquiries'
              ? 'border-[#CB2030] text-[#CB2030]'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Advertising Inquiries
          {pendingCount > 0 && (
            <span className="ml-1 bg-[#CB2030] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Inquiries panel ── */}
      {subTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Event Advertising Inquiries</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Companies requesting to list or promote their events on Cars.na
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={fetchInquiries} disabled={inquiriesLoading}>
              {inquiriesLoading ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>

          {inquiriesLoading ? (
            <div className="text-center py-10 text-slate-500 text-sm">Loading inquiries…</div>
          ) : inquiries.length === 0 ? (
            <Card className="bg-[#111827] border-white/[0.06]">
              <CardContent className="py-12 text-center">
                <Megaphone className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No inquiries yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Inquiries submitted via <strong>/events/advertise</strong> will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq: any) => {
                const isExpanded = expandedInquiry === inq.id;
                return (
                  <Card key={inq.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Summary row */}
                      <div className="flex items-center gap-4 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">{inq.eventName}</span>
                            {inq.eventCategory && (
                              <span className="text-xs bg-white/[0.06] text-slate-400 px-2 py-0.5 rounded-full font-medium">
                                {inq.eventCategory}
                              </span>
                            )}
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${INQUIRY_STATUS_COLORS[inq.status] ?? 'bg-[#111827]/[0.04] text-slate-400'}`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {inq.companyName} · {inq.contactName} · {inq.email}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {inq.eventDate} · {inq.eventLocation}
                            {inq.expectedAttendees && ` · ${inq.expectedAttendees} expected`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setExpandedInquiry(isExpanded ? null : inq.id)}
                            className="text-xs text-[#1F3469] font-semibold hover:underline"
                          >
                            {isExpanded ? 'Collapse' : 'Details'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="border-t border-white/[0.06] p-4 bg-[#0D1117] space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Contact</p>
                              <p className="text-slate-200">{inq.contactName}</p>
                              <p className="text-slate-400">{inq.email}</p>
                              <p className="text-slate-400">{inq.phone}</p>
                              {inq.website && <p className="text-blue-600 text-xs mt-0.5">{inq.website}</p>}
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Event Info</p>
                              <p className="text-slate-200 font-medium">{inq.eventName}</p>
                              <p className="text-slate-400">{inq.eventDate} · {inq.eventLocation}</p>
                              {inq.expectedAttendees && <p className="text-slate-400">Attendance: {inq.expectedAttendees}</p>}
                              {inq.budget && <p className="text-slate-400">Budget: {inq.budget}</p>}
                            </div>
                          </div>
                          {inq.description && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Description</p>
                              <p className="text-sm text-slate-300 whitespace-pre-wrap">{inq.description}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Update Status</p>
                            <div className="flex flex-wrap gap-2">
                              {(['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'] as const).map(s => (
                                <button
                                  key={s}
                                  disabled={inq.status === s || updatingStatus === inq.id}
                                  onClick={() => updateInquiryStatus(inq.id, s)}
                                  className={`text-xs px-3 py-1.5 rounded-md font-semibold border transition-all disabled:opacity-50 ${
                                    inq.status === s
                                      ? `${INQUIRY_STATUS_COLORS[s]} border-current`
                                      : 'bg-[#111827] border-white/[0.1] text-slate-400 hover:border-gray-400'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">
                            Submitted {new Date(inq.createdAt).toLocaleDateString('en-NA', { dateStyle: 'medium' })}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Manage Events panel ── */}
      {subTab === 'events' && <>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, icon: Calendar },
          { label: 'Upcoming', value: upcomingCount, icon: Clock },
          { label: 'Published', value: publishedCount, icon: CheckCircle },
          { label: 'Featured', value: featuredCount, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#CB2030' }}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card className="bg-[#111827] border-white/[0.06]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">All Events</CardTitle>
            <Button size="sm" style={{ background: '#CB2030' }} className="text-white hover:opacity-90" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1.5" /> New Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading events…</div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500 mb-1">No events yet</p>
              <p className="text-xs text-slate-500 mb-4">Create your first event to display it in the nav and events page.</p>
              <Button size="sm" style={{ background: '#CB2030' }} className="text-white hover:opacity-90" onClick={openCreate}>
                <Plus className="w-4 h-4 mr-1.5" /> Create Event
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1117]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map(ev => {
                    const isPast = new Date(ev.date) < new Date();
                    return (
                      <tr key={ev.id} className="hover:bg-[#0D1117] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white truncate max-w-[200px]">{ev.title}</div>
                          {ev.isFeatured && (
                            <span className="text-[10px] font-bold text-amber-600 uppercase">Featured</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {new Date(ev.date).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {isPast && <span className="ml-1.5 text-[10px] text-slate-500 font-semibold uppercase">Past</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{ev.location || '—'}</td>
                        <td className="px-4 py-3">
                          {ev.category ? (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#111827]/[0.04] text-slate-400">{ev.category}</span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${ev.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#111827]/[0.04] text-slate-500'}`}>
                            {ev.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(ev)} className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#111827]/[0.04] transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleting(ev)} className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* Create / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={open => { if (!open) closeForm(); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Event' : 'New Event'}</DialogTitle>
            <DialogDescription>Fill in the details below. Title and date are required.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={inputCls} value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} placeholder="e.g. Windhoek Classic Car Show 2026" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Start Date & Time *</label>
                <input type="datetime-local" className={inputCls} value={form.date} onChange={e => setForm((f: any) => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>End Date & Time</label>
                <input type="datetime-local" className={inputCls} value={form.endDate} onChange={e => setForm((f: any) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
                <option value="">— Select category —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Venue / Venue Name</label>
                <input className={inputCls} value={form.venue} onChange={e => setForm((f: any) => ({ ...f, venue: e.target.value }))} placeholder="e.g. NWR Showgrounds" />
              </div>
              <div>
                <label className={labelCls}>City / Location</label>
                <input className={inputCls} value={form.location} onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))} placeholder="e.g. Windhoek" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={3}
                className={`${inputCls} h-auto py-2 resize-none`}
                value={form.description}
                onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                placeholder="Short description shown on the events page…"
              />
            </div>
            <div>
              <label className={labelCls}>Image URL</label>
              <input className={inputCls} value={form.imageUrl} onChange={e => setForm((f: any) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>External URL (tickets / more info)</label>
              <input className={inputCls} value={form.externalUrl} onChange={e => setForm((f: any) => ({ ...f, externalUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm((f: any) => ({ ...f, isPublished: e.target.checked }))} className="accent-[#CB2030] w-4 h-4" />
                Published (visible on site)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))} className="accent-[#CB2030] w-4 h-4" />
                Featured (highlighted)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeForm} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} style={{ background: '#CB2030' }} className="text-white hover:opacity-90">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </> }

      {/* Delete confirmation */}
      <Dialog open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleting?.title}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
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
