import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Placeholder banners for when database is unavailable
const PLACEHOLDER_BANNERS = [
  {
    id: 'banner-hero-100',
    title: 'New Arrivals - Premium Cars',
    subtitle: 'Luxury Vehicles Now Available',
    description: 'Browse our latest collection of premium vehicles from top dealers',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=600&fit=crop',
    linkUrl: '/vehicles?sort=newest',
    buttonText: 'View Collection',
    isActive: true,
    position: 'HERO',
    priority: 100,
    backgroundColor: '#1F3469',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
    impressions: 8234,
    clicks: 891,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'banner-main-90',
    title: 'Summer Sale 2024',
    subtitle: 'Up to 20% Off Selected Vehicles',
    description: 'Limited time offer on premium sedans and SUVs',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop',
    linkUrl: '/vehicles?sale=summer',
    buttonText: 'Shop Now',
    isActive: true,
    position: 'MAIN',
    priority: 90,
    backgroundColor: '#D97706',
    textColor: '#FFFFFF',
    overlayOpacity: 0.6,
    impressions: 12456,
    clicks: 1523,
    createdAt: new Date('2024-06-01').toISOString(),
    updatedAt: new Date('2024-06-01').toISOString(),
  },
  {
    id: 'banner-sidebar-80',
    title: 'Finance Your Dream Car',
    subtitle: 'Flexible Payment Plans',
    description: 'Get pre-approved in minutes with competitive rates',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    linkUrl: '/financing',
    buttonText: 'Learn More',
    isActive: true,
    position: 'SIDEBAR',
    priority: 80,
    backgroundColor: '#059669',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
    impressions: 6789,
    clicks: 445,
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'banner-between-70',
    title: 'Trade-In Your Vehicle',
    subtitle: 'Get Top Value Today',
    description: 'Instant valuation and competitive offers for your current vehicle',
    imageUrl: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1200&h=400&fit=crop',
    linkUrl: '/sell',
    buttonText: 'Get Quote',
    isActive: true,
    position: 'BETWEEN',
    priority: 70,
    backgroundColor: '#DC2626',
    textColor: '#FFFFFF',
    overlayOpacity: 0.4,
    impressions: 4532,
    clicks: 312,
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'banner-hero-95',
    title: 'Certified Pre-Owned',
    subtitle: 'Quality Guaranteed',
    description: 'Every vehicle inspected and certified by our expert technicians',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop',
    linkUrl: '/vehicles?certified=true',
    buttonText: 'Browse Certified',
    isActive: true,
    position: 'HERO',
    priority: 95,
    backgroundColor: '#7C3AED',
    textColor: '#FFFFFF',
    overlayOpacity: 0.45,
    impressions: 9876,
    clicks: 1234,
    createdAt: new Date('2024-04-05').toISOString(),
    updatedAt: new Date('2024-04-05').toISOString(),
  },
  {
    id: 'banner-sidebar-75',
    title: 'Dealership Spotlight',
    subtitle: 'Featured Dealer of the Month',
    description: 'Discover exclusive deals from our top-rated dealers',
    imageUrl: 'https://images.unsplash.com/photo-1562519819-019d3336fe48?w=800&h=600&fit=crop',
    linkUrl: '/dealers',
    buttonText: 'View Dealers',
    isActive: true,
    position: 'SIDEBAR',
    priority: 75,
    backgroundColor: '#2563EB',
    textColor: '#FFFFFF',
    overlayOpacity: 0.55,
    impressions: 5643,
    clicks: 389,
    createdAt: new Date('2024-05-12').toISOString(),
    updatedAt: new Date('2024-05-12').toISOString(),
  },
  {
    id: 'banner-main-85',
    title: 'Electric Vehicles',
    subtitle: 'Drive the Future',
    description: 'Explore our growing selection of electric and hybrid vehicles',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=600&fit=crop',
    linkUrl: '/vehicles?type=electric',
    buttonText: 'View EVs',
    isActive: true,
    position: 'MAIN',
    priority: 85,
    backgroundColor: '#0891B2',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
    impressions: 7821,
    clicks: 923,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'banner-between-65',
    title: 'Extended Warranty',
    subtitle: 'Peace of Mind Coverage',
    description: 'Protect your investment with comprehensive warranty plans',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=400&fit=crop',
    linkUrl: '/help',
    buttonText: 'Get Protected',
    isActive: true,
    position: 'BETWEEN',
    priority: 65,
    backgroundColor: '#7C2D12',
    textColor: '#FFFFFF',
    overlayOpacity: 0.6,
    impressions: 3421,
    clicks: 198,
    createdAt: new Date('2024-02-14').toISOString(),
    updatedAt: new Date('2024-02-14').toISOString(),
  },
];

// GET /api/admin/banners - Get all banners
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');
    const isActive = searchParams.get('isActive');

    try {
      // Try to fetch from database
      if (!prisma || !prisma.banner) {
        throw new Error('Database not available');
      }

      const where: any = {};

      if (position) {
        where.position = position;
      }

      if (isActive !== null) {
        where.isActive = isActive === 'true';
      }

      const banners = await prisma.banner.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      // If database returns data, use it
      if (banners && banners.length > 0) {
        return NextResponse.json(banners);
      }

      // If database is empty, fall back to placeholders
      throw new Error('No banners in database');
    } catch (dbError) {
      // Fallback to placeholder banners
      console.log('Using placeholder banners for admin panel:', dbError);
      let filteredBanners = PLACEHOLDER_BANNERS;

      if (position) {
        filteredBanners = filteredBanners.filter(banner => banner.position === position);
      }

      if (isActive !== null) {
        const activeFilter = isActive === 'true';
        filteredBanners = filteredBanners.filter(banner => banner.isActive === activeFilter);
      }

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

// POST /api/admin/banners - Create new banner
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      imageUrl,
      linkUrl,
      buttonText,
      isActive,
      position,
      priority,
      startDate,
      endDate,
      backgroundColor,
      textColor,
      overlayOpacity
    } = body;

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        description,
        imageUrl,
        linkUrl,
        buttonText,
        isActive: isActive ?? true,
        position: position || 'MAIN',
        priority: priority || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        backgroundColor,
        textColor,
        overlayOpacity,
        createdBy: session.user.id
      }
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}