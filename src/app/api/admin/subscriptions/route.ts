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

    // Fetch all subscription data in parallel
    const [
      totalSubscriptions,
      activeSubscriptions,
      pendingSubscriptions,
      cancelledSubscriptions,
      monthlyRevenue,
      annualRevenue,
      subscriptionsList,
      subscriptionPlans,
    ] = await Promise.all([
      // Total subscriptions count
      prisma.dealershipSubscription.count(),

      // Active subscriptions count
      prisma.dealershipSubscription.count({
        where: { status: 'ACTIVE' }
      }),

      // Pending subscriptions count
      prisma.dealershipSubscription.count({
        where: { status: 'PENDING_PAYMENT' }
      }),

      // Cancelled subscriptions count
      prisma.dealershipSubscription.count({
        where: { status: 'CANCELLED' }
      }),

      // Monthly revenue - sum of payments this month
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),

      // Annual revenue - sum of payments this year
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1)
          }
        }
      }),

      // List of all subscriptions with dealership and plan details
      prisma.dealershipSubscription.findMany({
        include: {
          dealership: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
            }
          },
          payments: {
            select: {
              amount: true,
              status: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // List of all subscription plans
      prisma.subscriptionPlan.findMany({
        include: {
          _count: {
            select: {
              subscriptions: true
            }
          }
        },
        orderBy: {
          priority: 'asc'
        }
      })
    ]);

    // Calculate overdue subscriptions (ACTIVE but payment is overdue)
    const overdueSubscriptions = await prisma.dealershipSubscription.count({
      where: {
        status: 'ACTIVE',
        nextPaymentDate: {
          lt: new Date()
        },
        payments: {
          none: {
            status: 'COMPLETED',
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 35)) // No payment in last 35 days
            }
          }
        }
      }
    });

    // Calculate stats
    const totalSubs = totalSubscriptions || 0;
    const activeSubs = activeSubscriptions || 0;
    const cancelledSubs = cancelledSubscriptions || 0;
    const churnRate = totalSubs > 0 ? ((cancelledSubs / totalSubs) * 100).toFixed(1) : '0.0';
    const monthlyRev = monthlyRevenue._sum.amount || 0;
    const annualRev = annualRevenue._sum.amount || 0;
    const avgSubscriptionValue = activeSubs > 0 ? monthlyRev / activeSubs : 0;

    // Format subscriptions list
    const formattedSubscriptions = subscriptionsList.map(sub => {
      const totalPaid = sub.payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        id: sub.id,
        dealershipId: sub.dealershipId,
        dealershipName: sub.dealership.name,
        billingEmail: sub.dealership.email || 'N/A',
        planId: sub.planId,
        plan: sub.plan.name,
        planPrice: sub.plan.price,
        status: sub.status,
        billingCycle: 'Monthly',
        monthlyFee: sub.plan.price,
        nextBilling: sub.billingDate?.toISOString() || null,
        totalPaid: totalPaid,
        autoRenew: sub.autoRenew,
        currentListings: sub.currentListings,
        startedAt: sub.startedAt?.toISOString() || sub.createdAt.toISOString(),
        createdAt: sub.createdAt.toISOString(),
      };
    });

    // Format subscription plans
    const formattedPlans = subscriptionPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      price: plan.price,
      currency: 'NAD',
      billingCycle: 'Monthly',
      maxListings: plan.maxListings,
      maxPhotos: plan.maxPhotos,
      features: plan.features,
      status: 'Active', // All plans in DB are active
      subscribers: plan._count.subscriptions,
      priority: plan.priority,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalSubscriptions: totalSubs,
        activeSubscriptions: activeSubs,
        pendingSubscriptions: pendingSubscriptions || 0,
        overdueSubscriptions: overdueSubscriptions,
        cancelledSubscriptions: cancelledSubs,
        monthlyRevenue: monthlyRev,
        annualRevenue: annualRev,
        avgSubscriptionValue: avgSubscriptionValue,
        churnRate: parseFloat(churnRate),
      },
      subscriptions: formattedSubscriptions,
      plans: formattedPlans,
    });
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscription data'
      },
      { status: 500 }
    );
  }
}
