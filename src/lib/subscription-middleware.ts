import { prisma } from '@/lib/prisma';
import { TRPCError } from '@trpc/server';

export interface SubscriptionFeatures {
  maxListings: number;
  maxPhotos: number;
  featuredListings: boolean;
  heroSection: boolean;
  prioritySearch: boolean;
  analytics: boolean;
  customBranding: boolean;
  multiLocation: boolean;
  apiAccess: boolean;
  dedicatedSupport: boolean;
}

export async function getSubscriptionFeatures(dealershipId: string): Promise<SubscriptionFeatures> {
  const subscription = await prisma.dealershipSubscription.findUnique({
    where: { dealershipId },
    include: { plan: true },
  });

  if (!subscription || subscription.status !== 'ACTIVE') {
    // Return basic/free tier features
    return {
      maxListings: 5,
      maxPhotos: 3,
      featuredListings: false,
      heroSection: false,
      prioritySearch: false,
      analytics: false,
      customBranding: false,
      multiLocation: false,
      apiAccess: false,
      dedicatedSupport: false,
    };
  }

  const plan = subscription.plan;
  const features = plan.features as string[];

  return {
    maxListings: plan.maxListings,
    maxPhotos: plan.maxPhotos,
    featuredListings: features.includes('Featured listings') || features.includes('Premium featured listings'),
    heroSection: features.includes('Hero section') || features.includes('Homepage hero section'),
    prioritySearch: features.includes('Priority search') || features.includes('Top search results'),
    analytics: features.includes('Advanced analytics') || features.includes('Basic analytics'),
    customBranding: features.includes('Custom dealership branding') || features.includes('White-label solutions'),
    multiLocation: features.includes('Multiple location management'),
    apiAccess: features.includes('Advanced inventory sync APIs') || features.includes('Custom integrations'),
    dedicatedSupport: features.includes('Dedicated account manager') || features.includes('Priority customer support'),
  };
}

export async function checkListingLimit(dealershipId: string): Promise<boolean> {
  const features = await getSubscriptionFeatures(dealershipId);

  if (features.maxListings === 0) {
    return true; // Unlimited
  }

  const currentListings = await prisma.vehicle.count({
    where: {
      dealershipId,
      status: 'AVAILABLE',
    },
  });

  return currentListings < features.maxListings;
}

export async function checkPhotoLimit(dealershipId: string, vehicleId?: string): Promise<boolean> {
  const features = await getSubscriptionFeatures(dealershipId);

  if (vehicleId) {
    const currentPhotos = await prisma.vehicleImage.count({
      where: { vehicleId },
    });

    return currentPhotos < features.maxPhotos;
  }

  return true;
}

export async function checkFeatureAccess(
  dealershipId: string,
  feature: keyof SubscriptionFeatures
): Promise<boolean> {
  const features = await getSubscriptionFeatures(dealershipId);
  return features[feature] as boolean;
}

export function requireFeature(feature: keyof SubscriptionFeatures) {
  return async (dealershipId: string) => {
    const hasAccess = await checkFeatureAccess(dealershipId, feature);

    if (!hasAccess) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `This feature requires a higher subscription plan. Please upgrade to access ${feature}.`,
      });
    }
  };
}

export async function updateUsageAnalytics(
  dealershipId: string,
  metrics: Partial<{
    listingsViewed: number;
    leadGenerated: number;
    inquiriesReceived: number;
    phoneCallsReceived: number;
    featuredImpressions: number;
    heroImpressions: number;
  }>
) {
  const subscription = await prisma.dealershipSubscription.findUnique({
    where: { dealershipId },
  });

  if (!subscription) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.usageAnalytics.upsert({
    where: {
      subscriptionId_date: {
        subscriptionId: subscription.id,
        date: today,
      },
    },
    update: {
      listingsViewed: { increment: metrics.listingsViewed || 0 },
      leadGenerated: { increment: metrics.leadGenerated || 0 },
      inquiriesReceived: { increment: metrics.inquiriesReceived || 0 },
      phoneCallsReceived: { increment: metrics.phoneCallsReceived || 0 },
      featuredImpressions: { increment: metrics.featuredImpressions || 0 },
      heroImpressions: { increment: metrics.heroImpressions || 0 },
    },
    create: {
      subscriptionId: subscription.id,
      date: today,
      listingsViewed: metrics.listingsViewed || 0,
      leadGenerated: metrics.leadGenerated || 0,
      inquiriesReceived: metrics.inquiriesReceived || 0,
      phoneCallsReceived: metrics.phoneCallsReceived || 0,
      featuredImpressions: metrics.featuredImpressions || 0,
      heroImpressions: metrics.heroImpressions || 0,
    },
  });
}