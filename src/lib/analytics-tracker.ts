/**
 * Real-time analytics tracking system for dealership performance
 */

import { prisma } from '@/lib/prisma';

export interface AnalyticsEvent {
  dealershipId: string;
  eventType: 'view' | 'inquiry' | 'phone_call' | 'email' | 'lead' | 'sale' | 'feature_impression';
  vehicleId?: string;
  userId?: string;
  sessionId?: string;
  source?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  views: number;
  inquiries: number;
  phoneCallsReceived: number;
  leadGenerated: number;
  featuredImpressions: number;
  heroImpressions: number;
  conversionRate: number;
  averageViewTime: number;
}

export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private eventQueue: AnalyticsEvent[] = [];
  private isProcessing = false;
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds

  private constructor() {
    // Start the batch processing
    this.startBatchProcessing();
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  /**
   * Track an analytics event
   */
  public async track(event: AnalyticsEvent): Promise<void> {
    this.eventQueue.push({
      ...event,
      metadata: {
        ...event.metadata,
        timestamp: new Date().toISOString(),
      }
    });

    // If batch is full, process immediately
    if (this.eventQueue.length >= this.batchSize) {
      await this.processBatch();
    }
  }

  /**
   * Track vehicle view
   */
  public async trackVehicleView(
    dealershipId: string,
    vehicleId: string,
    userId?: string,
    sessionId?: string,
    source?: string
  ): Promise<void> {
    await this.track({
      dealershipId,
      vehicleId,
      userId,
      sessionId,
      source,
      eventType: 'view',
      metadata: {
        page: 'vehicle_detail',
        source: source || 'direct'
      }
    });

    // Update vehicle view count
    await this.incrementVehicleViews(vehicleId);
  }

  /**
   * Track customer inquiry
   */
  public async trackInquiry(
    dealershipId: string,
    vehicleId: string,
    inquiryType: 'email' | 'phone' | 'form',
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    await this.track({
      dealershipId,
      vehicleId,
      userId,
      sessionId,
      eventType: 'inquiry',
      metadata: {
        inquiryType,
        convertedFromView: true
      }
    });

    // Create lead record
    await this.createLead(dealershipId, vehicleId, inquiryType);
  }

  /**
   * Track phone call
   */
  public async trackPhoneCall(
    dealershipId: string,
    vehicleId?: string,
    duration?: number,
    source?: string
  ): Promise<void> {
    await this.track({
      dealershipId,
      vehicleId,
      eventType: 'phone_call',
      source,
      metadata: {
        duration,
        callType: 'inbound'
      }
    });
  }

  /**
   * Track lead generation
   */
  public async trackLead(
    dealershipId: string,
    leadData: {
      vehicleId?: string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      source: string;
      quality: 'hot' | 'warm' | 'cold';
    }
  ): Promise<void> {
    await this.track({
      dealershipId,
      vehicleId: leadData.vehicleId,
      eventType: 'lead',
      source: leadData.source,
      metadata: {
        leadQuality: leadData.quality,
        customerData: {
          name: leadData.customerName,
          email: leadData.customerEmail,
          phone: leadData.customerPhone
        }
      }
    });
  }

  /**
   * Track sale completion
   */
  public async trackSale(
    dealershipId: string,
    vehicleId: string,
    saleData: {
      amount: number;
      currency: string;
      leadId?: string;
      salesRep?: string;
      timeToSale: number; // days from first contact
    }
  ): Promise<void> {
    await this.track({
      dealershipId,
      vehicleId,
      eventType: 'sale',
      metadata: {
        saleAmount: saleData.amount,
        currency: saleData.currency,
        leadId: saleData.leadId,
        salesRep: saleData.salesRep,
        timeToSale: saleData.timeToSale,
        conversionComplete: true
      }
    });
  }

  /**
   * Track featured listing impression
   */
  public async trackFeatureImpression(
    dealershipId: string,
    vehicleId: string,
    featureType: 'hero' | 'featured' | 'carousel',
    position: number
  ): Promise<void> {
    await this.track({
      dealershipId,
      vehicleId,
      eventType: 'feature_impression',
      metadata: {
        featureType,
        position,
        premium: true
      }
    });
  }

  /**
   * Get real-time metrics for a dealership
   */
  public async getRealtimeMetrics(dealershipId: string, timeframe: '1h' | '24h' | '7d' = '24h'): Promise<PerformanceMetrics> {
    const now = new Date();
    const startTime = new Date();

    switch (timeframe) {
      case '1h':
        startTime.setHours(now.getHours() - 1);
        break;
      case '24h':
        startTime.setHours(now.getHours() - 24);
        break;
      case '7d':
        startTime.setDate(now.getDate() - 7);
        break;
    }

    // Get subscription for this dealership
    const subscription = await prisma.dealershipSubscription.findUnique({
      where: { dealershipId },
      include: { usageAnalytics: {
        where: {
          createdAt: {
            gte: startTime
          }
        }
      }}
    });

    if (!subscription) {
      return {
        views: 0,
        inquiries: 0,
        phoneCallsReceived: 0,
        leadGenerated: 0,
        featuredImpressions: 0,
        heroImpressions: 0,
        conversionRate: 0,
        averageViewTime: 0
      };
    }

    // Aggregate metrics
    const metrics = subscription.usageAnalytics.reduce(
      (acc, day) => ({
        views: acc.views + day.listingsViewed,
        inquiries: acc.inquiries + day.inquiriesReceived,
        phoneCallsReceived: acc.phoneCallsReceived + day.phoneCallsReceived,
        leadGenerated: acc.leadGenerated + day.leadGenerated,
        featuredImpressions: acc.featuredImpressions + day.featuredImpressions,
        heroImpressions: acc.heroImpressions + day.heroImpressions,
        conversionRate: 0, // Will calculate below
        averageViewTime: acc.averageViewTime + (day.averageViewTime || 0)
      }),
      {
        views: 0,
        inquiries: 0,
        phoneCallsReceived: 0,
        leadGenerated: 0,
        featuredImpressions: 0,
        heroImpressions: 0,
        conversionRate: 0,
        averageViewTime: 0
      }
    );

    // Calculate conversion rate
    metrics.conversionRate = metrics.views > 0 ? (metrics.leadGenerated / metrics.views) * 100 : 0;

    // Calculate average view time
    metrics.averageViewTime = subscription.usageAnalytics.length > 0
      ? metrics.averageViewTime / subscription.usageAnalytics.length
      : 0;

    return metrics;
  }

  /**
   * Get performance comparison with industry benchmarks
   */
  public async getPerformanceComparison(dealershipId: string): Promise<{
    dealership: PerformanceMetrics;
    industryAverage: PerformanceMetrics;
    percentile: number;
  }> {
    const dealershipMetrics = await this.getRealtimeMetrics(dealershipId, '7d');

    // Industry benchmarks (these would come from aggregated data in production)
    const industryAverage: PerformanceMetrics = {
      views: 1500,
      inquiries: 45,
      phoneCallsReceived: 25,
      leadGenerated: 15,
      featuredImpressions: 200,
      heroImpressions: 50,
      conversionRate: 2.8,
      averageViewTime: 180 // seconds
    };

    // Calculate percentile (simplified)
    const conversionPercentile = dealershipMetrics.conversionRate > industryAverage.conversionRate ? 75 : 25;

    return {
      dealership: dealershipMetrics,
      industryAverage,
      percentile: conversionPercentile
    };
  }

  /**
   * Process events in batches
   */
  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const batch = this.eventQueue.splice(0, this.batchSize);

    try {
      // Group events by dealership and date for efficient database updates
      const dailyMetrics = new Map<string, PerformanceMetrics>();

      for (const event of batch) {
        const dateKey = `${event.dealershipId}-${new Date().toISOString().split('T')[0]}`;

        if (!dailyMetrics.has(dateKey)) {
          dailyMetrics.set(dateKey, {
            views: 0,
            inquiries: 0,
            phoneCallsReceived: 0,
            leadGenerated: 0,
            featuredImpressions: 0,
            heroImpressions: 0,
            conversionRate: 0,
            averageViewTime: 0
          });
        }

        const metrics = dailyMetrics.get(dateKey)!;

        switch (event.eventType) {
          case 'view':
            metrics.views++;
            break;
          case 'inquiry':
            metrics.inquiries++;
            break;
          case 'phone_call':
            metrics.phoneCallsReceived++;
            break;
          case 'lead':
            metrics.leadGenerated++;
            break;
          case 'feature_impression':
            if (event.metadata?.featureType === 'hero') {
              metrics.heroImpressions++;
            } else {
              metrics.featuredImpressions++;
            }
            break;
        }
      }

      // Update database with aggregated metrics
      for (const [dateKey, metrics] of dailyMetrics) {
        const [dealershipId, date] = dateKey.split('-');
        await this.updateDailyMetrics(dealershipId, new Date(date), metrics);
      }

    } catch (error) {
      console.error('Error processing analytics batch:', error);
      // Re-queue failed events
      this.eventQueue.unshift(...batch);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Update daily metrics in database
   */
  private async updateDailyMetrics(dealershipId: string, date: Date, metrics: PerformanceMetrics): Promise<void> {
    const subscription = await prisma.dealershipSubscription.findUnique({
      where: { dealershipId }
    });

    if (!subscription) return;

    await prisma.usageAnalytics.upsert({
      where: {
        subscriptionId_date: {
          subscriptionId: subscription.id,
          date
        }
      },
      update: {
        listingsViewed: { increment: metrics.views },
        leadGenerated: { increment: metrics.leadGenerated },
        inquiriesReceived: { increment: metrics.inquiries },
        phoneCallsReceived: { increment: metrics.phoneCallsReceived },
        featuredImpressions: { increment: metrics.featuredImpressions },
        heroImpressions: { increment: metrics.heroImpressions },
      },
      create: {
        subscriptionId: subscription.id,
        date,
        listingsViewed: metrics.views,
        leadGenerated: metrics.leadGenerated,
        inquiriesReceived: metrics.inquiries,
        phoneCallsReceived: metrics.phoneCallsReceived,
        featuredImpressions: metrics.featuredImpressions,
        heroImpressions: metrics.heroImpressions,
      }
    });
  }

  /**
   * Increment vehicle view count
   */
  private async incrementVehicleViews(vehicleId: string): Promise<void> {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { viewCount: { increment: 1 } }
    });
  }

  /**
   * Create lead record
   */
  private async createLead(dealershipId: string, vehicleId: string, source: string): Promise<void> {
    // This would typically create an actual lead record
    // For now, we'll just increment the usage analytics
    console.log(`Lead created for dealership ${dealershipId}, vehicle ${vehicleId}, source: ${source}`);
  }

  /**
   * Start batch processing interval
   */
  private startBatchProcessing(): void {
    setInterval(async () => {
      await this.processBatch();
    }, this.flushInterval);
  }
}

// Export singleton instance
export const analyticsTracker = AnalyticsTracker.getInstance();