import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Placeholder banners for when database is unavailable
const PLACEHOLDER_BANNERS = [
  {
    id: 'banner-hero-100',
    title: 'Drive Your Dream Today',
    subtitle: 'Premium Selection of Quality Vehicles',
    description: 'Explore thousands of verified vehicles from trusted dealers across Namibia',
    imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=600&fit=crop',
    linkUrl: '/vehicles',
    buttonText: 'Browse Vehicles',
    isActive: true,
    position: 'HERO',
    priority: 100,
    backgroundColor: '#1F3469',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
    impressions: 5420,
  },
  {
    id: 'banner-main-90',
    title: 'Finance Your Dream Car',
    subtitle: 'Flexible Payment Plans Available',
    description: 'Get approved in minutes with our trusted financing partners',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=400&fit=crop',
    linkUrl: '/financing',
    buttonText: 'Learn More',
    isActive: true,
    position: 'MAIN',
    priority: 90,
    backgroundColor: '#2A4A7A',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
    impressions: 3892,
  },
  {
    id: 'banner-main-85',
    title: 'New Arrivals Weekly',
    subtitle: 'Fresh Inventory Every Week',
    description: 'Be the first to see newly listed vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=400&fit=crop',
    linkUrl: '/vehicles?sortBy=newest',
    buttonText: 'See New Arrivals',
    isActive: true,
    position: 'MAIN',
    priority: 85,
    backgroundColor: '#3B4F86',
    textColor: '#FFFFFF',
    overlayOpacity: 0.45,
    impressions: 2987,
  },
  {
    id: 'banner-sidebar-80',
    title: 'Sell Your Car Fast',
    subtitle: 'Get Top Dollar for Your Vehicle',
    description: 'List your car and reach thousands of verified buyers',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=600&fit=crop',
    linkUrl: '/sell',
    buttonText: 'Get Started',
    isActive: true,
    position: 'SIDEBAR',
    priority: 80,
    backgroundColor: '#109B4A',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
    impressions: 2145,
  },
  {
    id: 'banner-sidebar-60',
    title: 'Advertise With Us',
    subtitle: 'Reach 100,000+ Car Buyers Monthly',
    description: 'Premium advertising packages from N$6,500/month',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop',
    linkUrl: '/advertise',
    buttonText: 'View Packages',
    isActive: true,
    position: 'SIDEBAR',
    priority: 60,
    backgroundColor: '#CB2030',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
    impressions: 1532,
  },
  {
    id: 'banner-sidebar-50',
    title: 'Need Help?',
    subtitle: '24/7 Customer Support',
    description: 'Our team is here to assist you',
    imageUrl: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=600&fit=crop',
    linkUrl: '/help',
    buttonText: 'Contact Us',
    isActive: true,
    position: 'SIDEBAR',
    priority: 50,
    backgroundColor: '#109B4A',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
    impressions: 987,
  },
  {
    id: 'banner-between-75',
    title: 'SUVs & 4x4s',
    subtitle: 'Built for Namibian Roads',
    description: 'Explore our collection of adventure-ready vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=300&fit=crop',
    linkUrl: '/vehicles?bodyType=suv',
    buttonText: 'View SUVs',
    isActive: true,
    position: 'BETWEEN',
    priority: 75,
    backgroundColor: '#1F3469',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
    impressions: 2341,
  },
  {
    id: 'banner-between-70',
    title: 'Featured Dealers',
    subtitle: 'Trusted Automotive Professionals',
    description: 'Browse vehicles from Namibia\'s most reputable dealerships',
    imageUrl: 'https://images.unsplash.com/photo-1562141961-4a374b5aa3ba?w=800&h=300&fit=crop',
    linkUrl: '/dealers',
    buttonText: 'View Dealers',
    isActive: true,
    position: 'BETWEEN',
    priority: 70,
    backgroundColor: '#FFDD11',
    textColor: '#1F3469',
    overlayOpacity: 0.3,
    impressions: 1876,
  },
];

// GET /api/banners - Get active banners for public display
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');

    // Try to fetch from database first
    try {
      // Check if prisma.banner is available
      if (!prisma || !prisma.banner) {
        throw new Error('Database not available');
      }

      const now = new Date();

      const where: any = {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      };

      if (position) {
        where.position = position;
      }

      const banners = await prisma.banner.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          subtitle: true,
          description: true,
          imageUrl: true,
          linkUrl: true,
          buttonText: true,
          position: true,
          backgroundColor: true,
          textColor: true,
          overlayOpacity: true,
          impressions: true
        }
      });

      return NextResponse.json(banners);
    } catch (dbError) {
      // Database unavailable, use placeholder banners
      console.log('Database unavailable, using placeholder banners');

      let filteredBanners = PLACEHOLDER_BANNERS;

      // Filter by position if specified
      if (position) {
        filteredBanners = filteredBanners.filter(banner => banner.position === position);
      }

      // Filter active banners
      filteredBanners = filteredBanners.filter(banner => banner.isActive);

      // Sort by priority
      filteredBanners.sort((a, b) => b.priority - a.priority);

      return NextResponse.json(filteredBanners);
    }
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}