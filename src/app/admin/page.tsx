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
  Upload
} from 'lucide-react';

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
  { id: '1', name: 'John Doe', email: 'john@email.com', role: 'User', status: 'Active', joinedAt: '2024-01-15' },
  { id: '2', name: 'Premium Motors', email: 'info@premium.com', role: 'Dealer', status: 'Active', joinedAt: '2024-01-10' },
  { id: '3', name: 'Jane Smith', email: 'jane@email.com', role: 'User', status: 'Pending', joinedAt: '2024-01-14' },
  { id: '4', name: 'Auto Palace', email: 'sales@autopalace.com', role: 'Dealer', status: 'Suspended', joinedAt: '2024-01-08' }
];

const RECENT_LISTINGS = [
  { id: '1', title: '2022 BMW X3', dealer: 'Premium Motors', price: 650000, status: 'Active', views: 234, leads: 12 },
  { id: '2', title: '2021 Mercedes C-Class', dealer: 'Auto Palace', price: 580000, status: 'Active', views: 189, leads: 8 },
  { id: '3', title: '2020 Audi A4', dealer: 'Elite Autos', price: 520000, status: 'Pending', views: 0, leads: 0 },
  { id: '4', title: '2018 Audi A4', dealer: 'Elite Autos', price: 320000, status: 'Flagged', views: 156, leads: 3 }
];

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
const MODERATION_REPORTS = [
  {
    id: 'report-001',
    type: 'listing',
    targetId: 'listing-004',
    targetTitle: '2019 Volkswagen Polo 1.0 TSI Comfortline',
    targetType: 'Vehicle Listing',
    reportedBy: 'user-123',
    reporterName: 'John Smith',
    reporterEmail: 'john.smith@email.com',
    reportReason: 'Misleading Information',
    reportCategory: 'False Advertisement',
    description: 'The seller claims the vehicle has only 20k km but the photos clearly show a worn interior consistent with much higher mileage. The price seems too good to be true.',
    severity: 'High',
    status: 'Pending',
    dateReported: '2024-01-21T14:30:00Z',
    lastUpdated: '2024-01-21T14:30:00Z',
    assignedTo: null,
    evidence: ['photo-1.jpg', 'screenshot-1.png'],
    dealerId: 'dealer-004',
    dealerName: 'Coastal Car Sales',
    reviewNotes: '',
    resolution: null,
    actionTaken: null
  },
  {
    id: 'report-002',
    type: 'user',
    targetId: 'user-456',
    targetTitle: 'spam_user_123',
    targetType: 'User Account',
    reportedBy: 'dealer-001',
    reporterName: 'Auto Palace Windhoek',
    reporterEmail: 'sales@autopalace.na',
    reportReason: 'Spam/Unwanted Messages',
    reportCategory: 'Harassment',
    description: 'This user has been sending inappropriate messages to our sales team with vulgar language and threats. They have contacted us multiple times despite being told to stop.',
    severity: 'Critical',
    status: 'Under Review',
    dateReported: '2024-01-20T09:15:00Z',
    lastUpdated: '2024-01-22T11:45:00Z',
    assignedTo: 'admin-001',
    evidence: ['chat-log-1.txt', 'email-thread.pdf'],
    dealerId: null,
    dealerName: null,
    reviewNotes: 'User has history of similar behavior. Considering permanent ban.',
    resolution: null,
    actionTaken: 'Temporary Suspension'
  },
  {
    id: 'report-003',
    type: 'listing',
    targetId: 'listing-002',
    targetTitle: '2021 Toyota Hilux 2.8 GD-6 RB Legend',
    targetType: 'Vehicle Listing',
    reportedBy: 'user-789',
    reporterName: 'Sarah Johnson',
    reporterEmail: 'sarah.j@email.com',
    reportReason: 'Suspected Stolen Vehicle',
    reportCategory: 'Illegal Activity',
    description: 'I saw this exact vehicle (same registration WK 789-012) reported as stolen on social media last week. The seller refuses to provide proper documentation when asked.',
    severity: 'Critical',
    status: 'Resolved',
    dateReported: '2024-01-18T16:22:00Z',
    lastUpdated: '2024-01-19T10:30:00Z',
    assignedTo: 'admin-002',
    evidence: ['social-media-post.jpg', 'police-report.pdf'],
    dealerId: 'dealer-002',
    dealerName: 'Capital Auto Sales',
    reviewNotes: 'Contacted authorities. Vehicle confirmed legitimate after dealer provided proper documentation.',
    resolution: 'False Report',
    actionTaken: 'No Action Required'
  },
  {
    id: 'report-004',
    type: 'listing',
    targetId: 'listing-001',
    targetTitle: '2022 BMW X5 xDrive30d M Sport',
    targetType: 'Vehicle Listing',
    reportedBy: 'user-321',
    reporterName: 'Mike Williams',
    reporterEmail: 'mike.w@email.com',
    reportReason: 'Inappropriate Images',
    reportCategory: 'Content Violation',
    description: 'One of the vehicle images shows someone making inappropriate gestures in the background. This is unprofessional and offensive.',
    severity: 'Medium',
    status: 'Resolved',
    dateReported: '2024-01-17T13:45:00Z',
    lastUpdated: '2024-01-18T09:15:00Z',
    assignedTo: 'admin-001',
    evidence: ['flagged-image.jpg'],
    dealerId: 'dealer-001',
    dealerName: 'Auto Palace Windhoek',
    reviewNotes: 'Image removed and dealer warned about photo quality standards.',
    resolution: 'Content Removed',
    actionTaken: 'Warning Issued'
  },
  {
    id: 'report-005',
    type: 'comment',
    targetId: 'comment-567',
    targetTitle: 'Comment on BMW X5 listing',
    targetType: 'User Comment',
    reportedBy: 'dealer-003',
    reporterName: 'Elite Motors',
    reporterEmail: 'sales@elitemotors.na',
    reportReason: 'Abusive Language',
    reportCategory: 'Harassment',
    description: 'User posted a comment with extremely offensive language targeting our dealership and staff members personally.',
    severity: 'High',
    status: 'Pending',
    dateReported: '2024-01-22T11:20:00Z',
    lastUpdated: '2024-01-22T11:20:00Z',
    assignedTo: null,
    evidence: ['comment-screenshot.png'],
    dealerId: null,
    dealerName: null,
    reviewNotes: '',
    resolution: null,
    actionTaken: null
  },
  {
    id: 'report-006',
    type: 'listing',
    targetId: 'listing-005',
    targetTitle: '2023 Ford Ranger 2.0 Wildtrak 4x4',
    targetType: 'Vehicle Listing',
    reportedBy: 'user-654',
    reporterName: 'David Brown',
    reporterEmail: 'david.b@email.com',
    reportReason: 'Duplicate Listing',
    reportCategory: 'Spam',
    description: 'This exact vehicle is listed multiple times by the same dealer with slightly different prices to manipulate search results.',
    severity: 'Low',
    status: 'Under Review',
    dateReported: '2024-01-21T08:30:00Z',
    lastUpdated: '2024-01-22T14:15:00Z',
    assignedTo: 'admin-002',
    evidence: ['duplicate-listings.pdf'],
    dealerId: 'dealer-005',
    dealerName: 'Northern Auto Sales',
    reviewNotes: 'Investigating multiple listings from same dealer.',
    resolution: null,
    actionTaken: null
  }
];

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
const ANALYTICS_DATA = {
  overview: {
    totalPageViews: 125847,
    uniqueVisitors: 34521,
    bounceRate: 32.4,
    avgSessionDuration: '4:32',
    conversionRate: 2.8,
    totalRevenue: 2847500,
    growthRate: 18.5
  },
  traffic: {
    daily: [
      { date: '2024-01-15', views: 1247, visitors: 892, conversions: 23 },
      { date: '2024-01-16', views: 1398, visitors: 945, conversions: 31 },
      { date: '2024-01-17', views: 1156, visitors: 823, conversions: 19 },
      { date: '2024-01-18', views: 1589, visitors: 1034, conversions: 42 },
      { date: '2024-01-19', views: 1823, visitors: 1156, conversions: 38 },
      { date: '2024-01-20', views: 1445, visitors: 967, conversions: 28 },
      { date: '2024-01-21', views: 1672, visitors: 1098, conversions: 35 }
    ],
    sources: [
      { name: 'Organic Search', visitors: 12847, percentage: 42.1, growth: 15.2 },
      { name: 'Direct Traffic', visitors: 8934, percentage: 29.3, growth: 8.7 },
      { name: 'Social Media', visitors: 4521, percentage: 14.8, growth: 23.4 },
      { name: 'Referral Sites', visitors: 2876, percentage: 9.4, growth: -3.2 },
      { name: 'Email Marketing', visitors: 1345, percentage: 4.4, growth: 31.8 }
    ]
  },
  listings: {
    performance: [
      { make: 'BMW', views: 15420, inquiries: 342, conversions: 28, avgPrice: 750000 },
      { make: 'Mercedes-Benz', views: 13567, inquiries: 298, conversions: 24, avgPrice: 820000 },
      { make: 'Toyota', views: 18934, inquiries: 445, conversions: 67, avgPrice: 450000 },
      { make: 'Ford', views: 12876, inquiries: 287, conversions: 31, avgPrice: 520000 },
      { make: 'Volkswagen', views: 9821, inquiries: 198, conversions: 18, avgPrice: 380000 }
    ],
    categories: [
      { type: 'SUV', listings: 156, views: 23456, inquiries: 567, sales: 42 },
      { type: 'Sedan', listings: 234, views: 34567, inquiries: 789, sales: 68 },
      { type: 'Hatchback', listings: 189, views: 18923, inquiries: 423, sales: 34 },
      { type: 'Pickup', listings: 98, views: 15678, inquiries: 345, sales: 28 },
      { type: 'Coupe', listings: 67, views: 8934, inquiries: 156, sales: 12 }
    ]
  },
  revenue: {
    monthly: [
      { month: 'Jul 2023', subscription: 45600, commission: 78900, total: 124500 },
      { month: 'Aug 2023', subscription: 48200, commission: 82100, total: 130300 },
      { month: 'Sep 2023', subscription: 51800, commission: 89600, total: 141400 },
      { month: 'Oct 2023', subscription: 49900, commission: 76800, total: 126700 },
      { month: 'Nov 2023', subscription: 53400, commission: 94200, total: 147600 },
      { month: 'Dec 2023', subscription: 56700, commission: 102400, total: 159100 },
      { month: 'Jan 2024', subscription: 58900, commission: 108700, total: 167600 }
    ],
    breakdown: {
      subscriptionRevenue: 412500,
      commissionRevenue: 632100,
      featuredListings: 156400,
      premiumServices: 89300,
      totalRevenue: 1290300
    }
  },
  users: {
    registration: [
      { date: '2024-01-15', dealers: 3, buyers: 23, total: 26 },
      { date: '2024-01-16', dealers: 5, buyers: 31, total: 36 },
      { date: '2024-01-17', dealers: 2, buyers: 19, total: 21 },
      { date: '2024-01-18', dealers: 4, buyers: 28, total: 32 },
      { date: '2024-01-19', dealers: 6, buyers: 35, total: 41 },
      { date: '2024-01-20', dealers: 1, buyers: 22, total: 23 },
      { date: '2024-01-21', dealers: 3, buyers: 27, total: 30 }
    ],
    engagement: {
      activeUsers: 8934,
      returningUsers: 5621,
      newUsers: 3313,
      avgSessionDuration: 272, // seconds
      pagesPerSession: 4.2,
      messagesSent: 2847,
      listingsViewed: 15623
    }
  },
  geographic: [
    { region: 'Khomas', users: 12456, revenue: 456789, percentage: 45.2 },
    { region: 'Erongo', users: 6789, revenue: 234567, percentage: 24.6 },
    { region: 'Oshana', users: 4321, revenue: 156789, percentage: 15.7 },
    { region: 'Otjozondjupa', users: 2145, revenue: 89234, percentage: 7.8 },
    { region: 'Other', users: 1876, revenue: 67345, percentage: 6.7 }
  ]
};

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

export default function AdminDashboard() {
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
  const [userFilterOpen, setUserFilterOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

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

  // Dealer management functions
  const handleViewDealer = (dealer: any) => {
    setSelectedDealer(dealer);
    setDealerModalOpen(true);
  };

  const handleApproveDealer = (dealerId: string) => {
    // In a real app, this would make an API call
    console.log('Approving dealer:', dealerId);
    // Update the dealer's verification status to 'Verified'
    // This would normally trigger a state update or refetch
  };

  const handleRejectDealer = (dealerId: string) => {
    // In a real app, this would make an API call
    console.log('Rejecting dealer:', dealerId);
    // Update the dealer's verification status to 'Rejected'
  };

  const handleSuspendDealer = (dealerId: string) => {
    // In a real app, this would make an API call
    console.log('Suspending dealer:', dealerId);
    // Update the dealer's status to 'Suspended'
  };

  const handleDeleteDealer = (dealerId: string) => {
    // In a real app, this would make an API call
    console.log('Deleting dealer:', dealerId);
    // Remove the dealer from the system
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

  const handleApproveListing = (listingId: string) => {
    // In a real app, this would make an API call
    console.log('Approving listing:', listingId);
    // Update the listing's status to 'Approved'
  };

  const handleRejectListing = (listingId: string) => {
    // In a real app, this would make an API call
    console.log('Rejecting listing:', listingId);
    // Update the listing's status to 'Rejected'
  };

  const handleFeatureListing = (listingId: string) => {
    // In a real app, this would make an API call
    console.log('Featuring listing:', listingId);
    // Toggle the featured status of the listing
  };

  const handleRemoveListing = (listingId: string) => {
    // In a real app, this would make an API call
    console.log('Removing listing:', listingId);
    // Remove the listing from the platform
  };

  // Moderation management functions
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleApproveReport = (reportId: string) => {
    // In a real app, this would make an API call
    console.log('Approving report action:', reportId);
    // Take action based on the report (remove content, ban user, etc.)
  };

  const handleRejectReport = (reportId: string) => {
    // In a real app, this would make an API call
    console.log('Rejecting report:', reportId);
    // Mark report as false/invalid
  };

  const handleAssignReport = (reportId: string, adminId: string) => {
    // In a real app, this would make an API call
    console.log('Assigning report:', reportId, 'to admin:', adminId);
    // Assign report to specific admin for review
  };

  const handleTakeAction = (reportId: string, action: string) => {
    // In a real app, this would make an API call
    console.log('Taking action:', action, 'for report:', reportId);
    // Execute moderation action (ban, warn, remove content, etc.)
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
      const recipients = DEALERS_DATA.filter(dealer => {
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
    const filteredDealers = DEALERS_DATA.filter(dealer => {
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
    const confirmed = confirm('Are you sure you want to approve all pending listings?');
    if (confirmed) {
      // In a real app, this would make an API call
      console.log('Approving all pending listings...');
      alert('All pending listings have been approved!');
    }
  };

  const handleManageFeatured = () => {
    setFeaturedModalOpen(true);
  };

  const handleExportData = () => {
    // Generate CSV export of listings
    const csvData = RECENT_LISTINGS.map(listing =>
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
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
                    <div className="text-3xl font-bold text-blue-900">{ADMIN_STATS.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-green-700 flex items-center mt-2">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-700">Active: 234 • Inactive: 1,013</p>
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
                    <div className="text-3xl font-bold text-purple-900">{ADMIN_STATS.totalDealers}</div>
                    <p className="text-xs text-green-700 flex items-center mt-2">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +5% from last month
                    </p>
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <p className="text-xs text-purple-700">Verified: 76 • Pending: 13</p>
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
                    <div className="text-3xl font-bold text-green-900">{ADMIN_STATS.totalListings.toLocaleString()}</div>
                    <p className="text-xs text-green-700 flex items-center mt-2">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +18% from last month
                    </p>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-xs text-green-700">Live: 3,201 • Draft: 255</p>
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
                    <div className="text-3xl font-bold text-amber-900">N${ADMIN_STATS.monthlyRevenue.toLocaleString()}</div>
                    <p className="text-xs text-green-700 flex items-center mt-2">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +23% from last month
                    </p>
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-xs text-amber-700">Avg/Dealer: N$512 • Target: N$50k</p>
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
                        <p className="text-2xl font-bold text-gray-900">67</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">N$33,500/month recurring</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900">892</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">+34 today</p>
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
                    <p className="text-xs text-gray-500 mt-2">-0.3h from last week</p>
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
                    <p className="text-xs text-gray-500 mt-2">+2.1% this month</p>
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
                      <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium">Flagged Listings</p>
                        <p className="text-sm text-gray-600">Reported content</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">2</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">User Reports</p>
                        <p className="text-sm text-gray-600">Moderation queue</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">7</Badge>
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
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">New dealer: Auto Palace registered</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Flagged: 2018 Audi A4 listing</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Suspended: spam_user_123</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Payment: N$2,500 processed</p>
                        <p className="text-xs text-gray-500">8 hours ago</p>
                      </div>
                    </div>
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">January</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">N$29,600</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">February</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '72%'}}></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">N$32,800</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">March</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">N$35,600</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">April</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">N$38,700</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">May</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">N$41,900</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">June</span>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right text-blue-600">N$45,600</span>
                        </div>
                      </div>
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
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full font-bold">
                          1
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Premium Motors</p>
                          <p className="text-xs text-gray-600">342 listings • N$12,400/mo</p>
                        </div>
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-400 text-white rounded-full font-bold">
                          2
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">City Cars</p>
                          <p className="text-xs text-gray-600">287 listings • N$9,800/mo</p>
                        </div>
                        <Star className="h-5 w-5 text-gray-400 fill-gray-400" />
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full font-bold">
                          3
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Auto Palace</p>
                          <p className="text-xs text-gray-600">234 listings • N$8,200/mo</p>
                        </div>
                        <Star className="h-5 w-5 text-orange-600 fill-orange-600" />
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          4
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Elite Autos</p>
                          <p className="text-xs text-gray-600">198 listings • N$6,900/mo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          5
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Dream Cars NA</p>
                          <p className="text-xs text-gray-600">176 listings • N$5,900/mo</p>
                        </div>
                      </div>
                    </div>
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Premium Motors - Professional Plan</p>
                            <p className="text-xs text-gray-500">Subscription payment • 2 hours ago</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">+N$499</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Auto Palace - Feature Listing</p>
                            <p className="text-xs text-gray-500">One-time payment • 5 hours ago</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">+N$350</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">City Cars - Enterprise Plan</p>
                            <p className="text-xs text-gray-500">Subscription renewal • 1 day ago</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">+N$999</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Dream Cars - Basic Plan</p>
                            <p className="text-xs text-gray-500">Payment pending • 2 days ago</p>
                          </div>
                        </div>
                        <span className="font-semibold text-blue-600">N$199</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Elite Autos - Professional Plan</p>
                            <p className="text-xs text-gray-500">Subscription payment • 3 days ago</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">+N$499</span>
                      </div>
                    </div>
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
                      <span className="text-lg font-bold text-blue-600">23</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">New Dealers</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">3</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">New Listings</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">47</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">New Leads</span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">34</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium">Page Views</span>
                      </div>
                      <span className="text-lg font-bold text-amber-600">8.9K</span>
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
                    const csvContent = RECENT_USERS.map(u => `${u.name},${u.email},${u.role},${u.status},${u.joinedAt}`).join('\n');
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
                        {RECENT_USERS
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
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-600">Suspend</Button>
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
                      <option value="User">User</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Admin">Admin</option>
                    </select>
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

              {/* Dealers Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Dealers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{DEALERS_DATA.length}</div>
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
                      {DEALERS_DATA.filter(d => d.status === 'Active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((DEALERS_DATA.filter(d => d.status === 'Active').length / DEALERS_DATA.length) * 100)}% of total
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
                      {DEALERS_DATA.filter(d => d.verificationStatus === 'Pending').length}
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
                      N${DEALERS_DATA.reduce((sum, dealer) => sum + dealer.monthlyFee, 0).toLocaleString()}
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
                        {DEALERS_DATA
                          .filter(dealer =>
                            dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            dealer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            dealer.city.toLowerCase().includes(searchTerm.toLowerCase())
                          )
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
                                dealer.status === 'Active' ? 'bg-green-100 text-green-800' :
                                dealer.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {dealer.status}
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                {dealer.subscriptionStatus}
                              </div>
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
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => handleViewDealer(dealer)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {dealer.verificationStatus === 'Pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => handleApproveDealer(dealer.id)}
                                    title="Approve Dealer"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                {dealer.status === 'Active' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-yellow-600 hover:text-yellow-800"
                                    onClick={() => handleSuspendDealer(dealer.id)}
                                    title="Suspend Dealer"
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleDeleteDealer(dealer.id)}
                                  title="Delete Dealer"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
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
                    <div className="text-2xl font-bold">{VEHICLE_LISTINGS.length}</div>
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
                      {VEHICLE_LISTINGS.filter(l => l.status === 'Active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((VEHICLE_LISTINGS.filter(l => l.status === 'Active').length / VEHICLE_LISTINGS.length) * 100)}% of total
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
                      {VEHICLE_LISTINGS.filter(l => l.listingStatus === 'Pending').length}
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
                      {VEHICLE_LISTINGS.filter(l => l.featured).length}
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
                        {VEHICLE_LISTINGS
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
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleRemoveListing(listing.id)}
                                  title="Remove Listing"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
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
                    <div className="text-2xl font-bold">{MODERATION_STATS.totalReports}</div>
                    <p className="text-xs text-muted-foreground">
                      {MODERATION_STATS.resolvedReports} resolved
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <ClockIcon className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{MODERATION_STATS.pendingReports}</div>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Reports</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{MODERATION_STATS.criticalReports}</div>
                    <p className="text-xs text-red-600">High priority</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                    <Activity className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{MODERATION_STATS.avgResolutionTime}</div>
                    <p className="text-xs text-green-600">Response time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Moderation Filter Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'all', name: 'All Reports', count: MODERATION_REPORTS.length },
                    { id: 'listings', name: 'Listings', count: MODERATION_REPORTS.filter(r => r.type === 'listing').length },
                    { id: 'users', name: 'Users', count: MODERATION_REPORTS.filter(r => r.type === 'user').length },
                    { id: 'dealerships', name: 'Dealerships', count: MODERATION_REPORTS.filter(r => r.type === 'dealer').length }
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
                        {MODERATION_REPORTS
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
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Auto-Moderate
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <Ban className="h-4 w-4" />
                      Bulk Ban Users
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      High Priority
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
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
                    <div className="text-2xl font-bold">{ANALYTICS_DATA.overview.totalPageViews.toLocaleString()}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      +{ANALYTICS_DATA.overview.growthRate}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ANALYTICS_DATA.overview.uniqueVisitors.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg session: {ANALYTICS_DATA.overview.avgSessionDuration}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ANALYTICS_DATA.overview.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Bounce rate: {ANALYTICS_DATA.overview.bounceRate}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N${(ANALYTICS_DATA.overview.totalRevenue / 100).toLocaleString()}</div>
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
                      {ANALYTICS_DATA.traffic.sources.map((source, index) => (
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
                        <span className="text-sm font-medium">N${(ANALYTICS_DATA.revenue.breakdown.subscriptionRevenue / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Commission</span>
                        </div>
                        <span className="text-sm font-medium">N${(ANALYTICS_DATA.revenue.breakdown.commissionRevenue / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm font-medium">Featured Listings</span>
                        </div>
                        <span className="text-sm font-medium">N${(ANALYTICS_DATA.revenue.breakdown.featuredListings / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-medium">Premium Services</span>
                        </div>
                        <span className="text-sm font-medium">N${(ANALYTICS_DATA.revenue.breakdown.premiumServices / 100).toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total Revenue</span>
                          <span>N${(ANALYTICS_DATA.revenue.breakdown.totalRevenue / 100).toLocaleString()}</span>
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
                          {ANALYTICS_DATA.listings.performance.map((make, index) => (
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
                      {ANALYTICS_DATA.geographic.map((region, index) => (
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
                      <div className="text-2xl font-bold text-blue-600">{ANALYTICS_DATA.users.engagement.activeUsers.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{ANALYTICS_DATA.users.engagement.returningUsers.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Returning Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{ANALYTICS_DATA.users.engagement.pagesPerSession}</div>
                      <p className="text-sm text-gray-600">Pages/Session</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{ANALYTICS_DATA.users.engagement.messagesSent.toLocaleString()}</div>
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
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <LineChart className="h-4 w-4" />
                      Custom Reports
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Data Visualization
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
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
                    <div className="text-2xl font-bold">{SUBSCRIPTION_STATS.totalSubscriptions}</div>
                    <p className="text-xs text-muted-foreground">
                      {SUBSCRIPTION_STATS.activeSubscriptions} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">N${(SUBSCRIPTION_STATS.monthlyRevenue / 100).toLocaleString()}</div>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{SUBSCRIPTION_STATS.overdueSubscriptions}</div>
                    <p className="text-xs text-red-600">Requires attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{SUBSCRIPTION_STATS.churnRate}%</div>
                    <p className="text-xs text-green-600">-0.5% from last month</p>
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
                        {SUBSCRIPTIONS_DATA
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
                        ))}
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
                    {SUBSCRIPTION_PLANS.map((plan) => (
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
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
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
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        />
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                        <input
                          type="number"
                          placeholder="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                      <input
                        type="number"
                        placeholder="100 (leave empty for unlimited)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Plans</label>
                      <div className="space-y-2">
                        {SUBSCRIPTION_PLANS.map((plan) => (
                          <label key={plan.id} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">{plan.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Promo Code
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Promo Codes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Promo Codes</CardTitle>
                    <CardDescription>Manage existing discount codes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {PROMO_CODES.filter(promo => promo.status === 'Active').map((promo) => (
                        <div key={promo.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono text-sm font-bold">
                                {promo.code}
                              </code>
                              <Badge className="bg-green-100 text-green-800">
                                {promo.status}
                              </Badge>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              {promo.discountType === 'percentage'
                                ? `${promo.discount}%`
                                : `N$${(promo.discount / 100).toFixed(2)}`
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
                            {promo.applicablePlans.map((planName, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {planName}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                            <button className="text-xs text-gray-600 hover:text-gray-800">Deactivate</button>
                            <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
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
                        {PROMO_CODES.map((promo) => (
                          <tr key={promo.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono text-sm font-bold">
                                {promo.code}
                              </code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium">
                                {promo.discountType === 'percentage'
                                  ? `${promo.discount}%`
                                  : `N$${(promo.discount / 100).toFixed(2)}`
                                }
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={getStatusBadge(promo.status)}>
                                {promo.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {promo.usageCount}{promo.usageLimit && ` / ${promo.usageLimit}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(promo.startDate).toLocaleDateString()} -
                              {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : ' No End'}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {promo.applicablePlans.map((planName, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    {planName}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
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

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Platform Settings</h2>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
                          defaultValue={SETTINGS_DATA.general.siteName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                        <textarea
                          defaultValue={SETTINGS_DATA.general.siteDescription}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
                        <input
                          type="url"
                          defaultValue={SETTINGS_DATA.general.siteUrl}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                        <input
                          type="email"
                          defaultValue={SETTINGS_DATA.general.adminEmail}
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
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="Africa/Windhoek">Africa/Windhoek</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="en">English</option>
                          <option value="af">Afrikaans</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="NAD">Namibian Dollar (NAD)</option>
                          <option value="USD">US Dollar (USD)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Maintenance Mode</span>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.general.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Guest Browsing</span>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.general.guestBrowsing ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.general.guestBrowsing ? 'translate-x-6' : 'translate-x-1'}`} />
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
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.security.requireEmailVerification ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.security.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Two-Factor Authentication</span>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Require CAPTCHA</span>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.security.requireCaptcha ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.security.requireCaptcha ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Min Length</label>
                        <input
                          type="number"
                          defaultValue={SETTINGS_DATA.security.passwordMinLength}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          defaultValue={SETTINGS_DATA.security.sessionTimeout}
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
                          defaultValue={SETTINGS_DATA.security.maxLoginAttempts}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          defaultValue={SETTINGS_DATA.security.accountLockoutDuration}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SSL Enabled</span>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.security.sslEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.security.sslEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Security Headers</span>
                          <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${SETTINGS_DATA.security.securityHeaders ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${SETTINGS_DATA.security.securityHeaders ? 'translate-x-6' : 'translate-x-1'}`} />
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
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="Paystack">Paystack</option>
                          <option value="Stripe">Stripe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paystack Public Key</label>
                        <input
                          type="text"
                          defaultValue={SETTINGS_DATA.payment.paystackPublicKey}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={SETTINGS_DATA.payment.commissionRate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          defaultValue={SETTINGS_DATA.payment.taxRate}
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
                          defaultValue={SETTINGS_DATA.payment.subscriptionPricing.basic / 100}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Plan (NAD)</label>
                        <input
                          type="number"
                          defaultValue={SETTINGS_DATA.payment.subscriptionPricing.professional / 100}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enterprise Plan (NAD)</label>
                        <input
                          type="number"
                          defaultValue={SETTINGS_DATA.payment.subscriptionPricing.enterprise / 100}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Listing Price (NAD)</label>
                        <input
                          type="number"
                          defaultValue={SETTINGS_DATA.payment.featuredListingPrice / 100}
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
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.notifications.emailNotifications.newUserRegistration ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.notifications.emailNotifications.newUserRegistration ? 'translate-x-6' : 'translate-x-1'
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
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.notifications.emailNotifications.newListing ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.notifications.emailNotifications.newListing ? 'translate-x-6' : 'translate-x-1'
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
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.notifications.emailNotifications.paymentReceived ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.notifications.emailNotifications.paymentReceived ? 'translate-x-6' : 'translate-x-1'
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
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.notifications.emailNotifications.moderationReport ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.notifications.emailNotifications.moderationReport ? 'translate-x-6' : 'translate-x-1'
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
                          defaultValue={SETTINGS_DATA.notifications.pushNotifications.firebaseServerKey}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Push Notifications</p>
                          <p className="text-sm text-gray-600">Allow sending push notifications to users</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.notifications.pushNotifications.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.notifications.pushNotifications.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Notification Sound</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.listings.autoApprove ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.listings.autoApprove ? 'translate-x-6' : 'translate-x-1'
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
                          defaultValue={SETTINGS_DATA.listings.maxImages}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Duration (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          defaultValue={SETTINGS_DATA.listings.defaultDuration}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Price Negotiation</p>
                          <p className="text-sm text-gray-600">Enable price negotiation features</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.listings.allowNegotiation ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.listings.allowNegotiation ? 'translate-x-6' : 'translate-x-1'
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
                          defaultValue={SETTINGS_DATA.listings.featuredSlots}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Duration (days)</label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          defaultValue={SETTINGS_DATA.listings.featuredDuration}
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
                            SETTINGS_DATA.listings.autoRenewFeatured ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.listings.autoRenewFeatured ? 'translate-x-6' : 'translate-x-1'
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
                            SETTINGS_DATA.api.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.api.enabled ? 'translate-x-6' : 'translate-x-1'
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
                          defaultValue={SETTINGS_DATA.api.rateLimit}
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
                            SETTINGS_DATA.api.requireAuth ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.api.requireAuth ? 'translate-x-6' : 'translate-x-1'
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
                          defaultValue={SETTINGS_DATA.api.masterKey}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                        <input
                          type="password"
                          defaultValue={SETTINGS_DATA.api.webhookSecret}
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
                            SETTINGS_DATA.integrations.googleAnalytics.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.integrations.googleAnalytics.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                        <input
                          type="text"
                          defaultValue={SETTINGS_DATA.integrations.googleAnalytics.trackingId}
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
                            SETTINGS_DATA.integrations.facebookPixel.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.integrations.facebookPixel.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                        <input
                          type="text"
                          defaultValue={SETTINGS_DATA.integrations.facebookPixel.pixelId}
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
                            SETTINGS_DATA.integrations.awsS3.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.integrations.awsS3.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">S3 Bucket Name</label>
                        <input
                          type="text"
                          defaultValue={SETTINGS_DATA.integrations.awsS3.bucketName}
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
                            SETTINGS_DATA.backup.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
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
                          defaultValue={SETTINGS_DATA.backup.retentionDays}
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
                        <p className="text-sm text-gray-600 mb-4">Last backup: {SETTINGS_DATA.backup.lastBackup}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Include User Data</p>
                          <p className="text-sm text-gray-600">Backup user profiles and preferences</p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            SETTINGS_DATA.backup.includeUserData ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.backup.includeUserData ? 'translate-x-6' : 'translate-x-1'
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
                            SETTINGS_DATA.backup.includeMedia ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              SETTINGS_DATA.backup.includeMedia ? 'translate-x-6' : 'translate-x-1'
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
                            defaultValue={SETTINGS_DATA.banners.maxBanners}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Default Position</label>
                          <select
                            defaultValue={SETTINGS_DATA.banners.defaultPosition}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {SETTINGS_DATA.banners.positions.map(position => (
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
                            defaultValue={SETTINGS_DATA.banners.maxFileSize}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Default Duration (days)</label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            defaultValue={SETTINGS_DATA.banners.defaultDuration}
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
                              SETTINGS_DATA.banners.autoRotation ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.autoRotation ? 'translate-x-6' : 'translate-x-1'
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
                            defaultValue={SETTINGS_DATA.banners.rotationInterval}
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
                              SETTINGS_DATA.banners.clickTracking ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.clickTracking ? 'translate-x-6' : 'translate-x-1'
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
                              SETTINGS_DATA.banners.impressionTracking ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.impressionTracking ? 'translate-x-6' : 'translate-x-1'
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
                              SETTINGS_DATA.banners.requireApproval ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.requireApproval ? 'translate-x-6' : 'translate-x-1'
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
                              SETTINGS_DATA.banners.allowExternalLinks ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.allowExternalLinks ? 'translate-x-6' : 'translate-x-1'
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
                              SETTINGS_DATA.banners.enableScheduling ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.enableScheduling ? 'translate-x-6' : 'translate-x-1'
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
                              SETTINGS_DATA.banners.compressionEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
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
                            defaultValue={SETTINGS_DATA.banners.compressionQuality}
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
                              SETTINGS_DATA.banners.watermarkEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                SETTINGS_DATA.banners.watermarkEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {SETTINGS_DATA.banners.allowedFileTypes.map(type => (
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
                      <div className="text-2xl font-bold text-blue-600">{SETTINGS_DATA.general.siteName}</div>
                      <p className="text-sm text-gray-600">Platform Name</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{SETTINGS_DATA.payment.paymentProvider}</div>
                      <p className="text-sm text-gray-600">Payment Provider</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{SETTINGS_DATA.general.timezone}</div>
                      <p className="text-sm text-gray-600">Timezone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'dealers' && activeTab !== 'listings' && activeTab !== 'moderation' && activeTab !== 'analytics' && activeTab !== 'settings' && (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setReportModalOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setReportModalOpen(false)}>
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
                  <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                    <Ban className="h-4 w-4 mr-2" />
                    Moderate
                  </Button>
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
                  {DEALERS_DATA
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
                    DEALERS_DATA
                      .filter(d => selectedPayments.includes(d.id))
                      .reduce((sum, d) => sum + d.monthlyFee, 0) / 100
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
                  {RECENT_LISTINGS.map((listing) => (
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
                <option value="all">All Dealers ({DEALERS_DATA.length})</option>
                <option value="active">
                  Active Dealers ({DEALERS_DATA.filter(d => d.status === 'Active').length})
                </option>
                <option value="pending">
                  Pending Dealers ({DEALERS_DATA.filter(d => d.verificationStatus === 'Pending').length})
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
                {recipientFilter === 'all' && DEALERS_DATA.length}
                {recipientFilter === 'active' && DEALERS_DATA.filter(d => d.status === 'Active').length}
                {recipientFilter === 'pending' && DEALERS_DATA.filter(d => d.verificationStatus === 'Pending').length}
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
    </div>
  );
}