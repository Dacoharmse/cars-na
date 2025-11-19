import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        priority: 'asc'
      }
    });

    // Parse features JSON for each plan
    const plansWithParsedFeatures = plans.map(plan => ({
      ...plan,
      features: typeof plan.features === 'string'
        ? JSON.parse(plan.features)
        : plan.features
    }));

    return NextResponse.json({
      success: true,
      plans: plansWithParsedFeatures
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subscription plans'
      },
      { status: 500 }
    );
  }
}
