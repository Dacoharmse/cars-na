import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all statistics in parallel for better performance
    const [
      totalUsers,
      totalDealers,
      activeDealers,
      pendingDealers,
      totalVehicles,
      activeVehicles,
      totalLeads,
      activeSubscriptions,
      totalPayments,
      recentUsers,
      recentVehicles,
      topDealers,
      recentPayments,
      todayNewUsers,
      todayNewDealers,
      todayNewVehicles,
      todayNewLeads,
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),

      // Total dealerships count
      prisma.dealership.count(),

      // Active dealers (APPROVED status)
      prisma.dealership.count({
        where: { status: 'APPROVED' }
      }),

      // Pending dealers (PENDING status)
      prisma.dealership.count({
        where: { status: 'PENDING' }
      }),

      // Total vehicles/listings count
      prisma.vehicle.count(),

      // Active vehicles count
      prisma.vehicle.count({
        where: { status: 'AVAILABLE' }
      }),

      // Total leads count
      prisma.lead.count(),

      // Active subscriptions
      prisma.dealershipSubscription.count({
        where: { status: 'ACTIVE' }
      }),

      // Sum of all payments for monthly revenue
      prisma.payment.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // This month
          }
        }
      }),

      // Recent users (last 10)
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          dealership: {
            select: {
              name: true
            }
          }
        }
      }),

      // Recent vehicle listings (last 10)
      prisma.vehicle.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          price: true,
          status: true,
          viewCount: true,
          createdAt: true,
          dealership: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              leads: true
            }
          }
        }
      }),

      // Top performing dealers (by vehicle count and subscription status)
      prisma.dealership.findMany({
        where: {
          status: 'APPROVED'
        },
        take: 5,
        orderBy: [
          { vehicles: { _count: 'desc' } }
        ],
        select: {
          id: true,
          name: true,
          city: true,
          region: true,
          createdAt: true,
          _count: {
            select: {
              vehicles: true,
              users: true
            }
          },
          subscription: {
            select: {
              currentListings: true,
              status: true
            }
          }
        }
      }),

      // Recent payments (last 5)
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          status: true,
          description: true,
          createdAt: true,
          paidAt: true,
          subscription: {
            select: {
              dealership: {
                select: {
                  name: true
                }
              },
              plan: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }),

      // Today's stats - Users created today
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),

      // Today's stats - Dealerships created today
      prisma.dealership.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),

      // Today's stats - Vehicles created today
      prisma.vehicle.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),

      // Today's stats - Leads created today
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // Calculate monthly revenue
    const monthlyRevenue = totalPayments._sum.amount || 0;

    // Format response
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalDealers,
        activeDealers,
        pendingDealers,
        totalListings: totalVehicles,
        activeListings: activeVehicles,
        totalLeads,
        monthlyRevenue: monthlyRevenue / 100, // Convert cents to dollars
        activeSubscriptions,
        pendingApprovals: pendingDealers,
      },
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name || user.email || 'Unknown',
        email: user.email || '',
        role: user.role,
        status: user.status || 'ACTIVE',
        joinedAt: user.createdAt.toISOString(),
        dealershipName: user.dealership?.name || null
      })),
      recentListings: recentVehicles.map(vehicle => ({
        id: vehicle.id,
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        dealer: vehicle.dealership.name,
        price: vehicle.price,
        status: vehicle.status,
        views: vehicle.viewCount || 0,
        leads: vehicle._count.leads
      })),
      topDealers: topDealers.map(dealer => ({
        id: dealer.id,
        name: dealer.name,
        city: dealer.city,
        region: dealer.region,
        activeListings: dealer._count.vehicles,
        totalUsers: dealer._count.users,
        subscriptionStatus: dealer.subscription?.status || 'NONE',
        currentListings: dealer.subscription?.currentListings || 0,
        joinedAt: dealer.createdAt.toISOString()
      })),
      recentPayments: recentPayments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        description: payment.description,
        dealershipName: payment.subscription.dealership.name,
        planName: payment.subscription.plan.name,
        createdAt: payment.createdAt.toISOString(),
        paidAt: payment.paidAt?.toISOString() || null
      })),
      todayStats: {
        newUsers: todayNewUsers,
        newDealers: todayNewDealers,
        newListings: todayNewVehicles,
        newLeads: todayNewLeads
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin statistics'
      },
      { status: 500 }
    );
  }
}
