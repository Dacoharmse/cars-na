/**
 * Analytics utility functions for data processing and calculations
 */

import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface MetricData {
  date: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
}

export interface PerformanceScore {
  overall: number;
  categories: {
    traffic: number;
    engagement: number;
    conversion: number;
    satisfaction: number;
  };
}

/**
 * Get date range based on period
 */
export function getDateRange(period: '7d' | '30d' | '90d' | '12m'): DateRange {
  const end = new Date();
  let start: Date;

  switch (period) {
    case '7d':
      start = subDays(end, 7);
      break;
    case '30d':
      start = subDays(end, 30);
      break;
    case '90d':
      start = subDays(end, 90);
      break;
    case '12m':
      start = subMonths(end, 12);
      break;
    default:
      start = subDays(end, 30);
  }

  return {
    start: startOfDay(start),
    end: endOfDay(end)
  };
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate performance score based on various metrics
 */
export function calculatePerformanceScore(metrics: {
  views: number;
  leads: number;
  conversionRate: number;
  responseTime: number; // in hours
  satisfactionScore: number; // 1-10
}): PerformanceScore {
  // Normalize metrics to 0-100 scale
  const traffic = Math.min((metrics.views / 1000) * 10, 100); // 1000 views = 10 points
  const engagement = Math.min((metrics.leads / 50) * 25, 100); // 50 leads = 25 points
  const conversion = Math.min(metrics.conversionRate * 20, 100); // 5% conversion = 100 points
  const responsiveness = Math.max(100 - (metrics.responseTime * 10), 0); // <1 hour = 100 points
  const satisfaction = metrics.satisfactionScore * 10; // 10/10 satisfaction = 100 points

  const categories = {
    traffic: Math.round(traffic),
    engagement: Math.round(engagement),
    conversion: Math.round(conversion),
    satisfaction: Math.round((responsiveness + satisfaction) / 2)
  };

  const overall = Math.round(
    (categories.traffic + categories.engagement + categories.conversion + categories.satisfaction) / 4
  );

  return { overall, categories };
}

/**
 * Format numbers for display
 */
export function formatNumber(value: number, type: 'currency' | 'percentage' | 'decimal' | 'integer' = 'integer'): string {
  switch (type) {
    case 'currency':
      return `NAD ${value.toLocaleString()}`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'decimal':
      return value.toFixed(1);
    case 'integer':
    default:
      return value.toLocaleString();
  }
}

/**
 * Get color for metric based on performance
 */
export function getMetricColor(value: number, benchmark: number, higherIsBetter: boolean = true): string {
  const ratio = value / benchmark;

  if (higherIsBetter) {
    if (ratio >= 1.1) return 'text-green-600';
    if (ratio >= 0.9) return 'text-yellow-600';
    return 'text-red-600';
  } else {
    if (ratio <= 0.9) return 'text-green-600';
    if (ratio <= 1.1) return 'text-yellow-600';
    return 'text-red-600';
  }
}