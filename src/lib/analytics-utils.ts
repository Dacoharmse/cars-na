import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities for analytics
export const dateUtils = {
  formatDate: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  formatDateShort: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  },

  formatDateTime: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  getDateRange: (period: string) => {
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date('2024-01-01'); // Platform launch date
    }

    return { startDate, endDate };
  },

  getDaysInRange: (startDate: Date, endDate: Date) => {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  },
};

// Number formatting utilities
export const formatters = {
  currency: (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NAD', 'N$');
  },

  number: (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  percentage: (value: number, decimals = 1) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  shortNumber: (num: number) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toString();
  },

  duration: (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  },
};

// Chart color utilities
export const chartColors = {
  primary: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a'],
  secondary: ['#10b981', '#059669', '#047857', '#065f46'],
  tertiary: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  quaternary: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],

  // Multi-color palettes for charts
  rainbow: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ],

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  neutral: '#6b7280',

  // Gradient definitions for recharts
  gradients: {
    blue: {
      id: 'blueGradient',
      colors: [
        { offset: '0%', color: '#3b82f6', opacity: 0.8 },
        { offset: '100%', color: '#3b82f6', opacity: 0.1 },
      ],
    },
    green: {
      id: 'greenGradient',
      colors: [
        { offset: '0%', color: '#10b981', opacity: 0.8 },
        { offset: '100%', color: '#10b981', opacity: 0.1 },
      ],
    },
    orange: {
      id: 'orangeGradient',
      colors: [
        { offset: '0%', color: '#f59e0b', opacity: 0.8 },
        { offset: '100%', color: '#f59e0b', opacity: 0.1 },
      ],
    },
  },
};

// Analytics calculation utilities
export const analytics = {
  calculateGrowthRate: (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 1 : 0;
    return (current - previous) / previous;
  },

  calculateChangePercentage: (current: number, previous: number) => {
    return analytics.calculateGrowthRate(current, previous) * 100;
  },

  calculateAverage: (values: number[]) => {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },

  calculateSum: (values: number[]) => {
    return values.reduce((sum, value) => sum + value, 0);
  },

  calculateMedian: (values: number[]) => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },

  calculatePercentile: (values: number[], percentile: number) => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  },

  calculateMovingAverage: (values: number[], window: number) => {
    if (values.length < window) return values;

    const result: number[] = [];
    for (let i = window - 1; i < values.length; i++) {
      const windowValues = values.slice(i - window + 1, i + 1);
      result.push(analytics.calculateAverage(windowValues));
    }
    return result;
  },

  calculateCorrelation: (x: number[], y: number[]) => {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = analytics.calculateSum(x);
    const sumY = analytics.calculateSum(y);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  },
};

// Export utilities
export const exportUtils = {
  downloadCSV: (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  downloadJSON: (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  generateReportPDF: async (title: string, data: any) => {
    // This would integrate with a PDF generation library like jsPDF or Puppeteer
    // For now, return a mock implementation
    console.log('Generating PDF report:', title, data);
    return {
      success: true,
      filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      size: Math.floor(Math.random() * 1000000) + 100000,
    };
  },
};

// Validation utilities
export const validation = {
  isValidDateRange: (startDate: Date, endDate: Date) => {
    return startDate <= endDate && startDate <= new Date();
  },

  isValidNumber: (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  },

  isValidPercentage: (value: number) => {
    return validation.isValidNumber(value) && value >= 0 && value <= 1;
  },

  sanitizeString: (str: string) => {
    return str.replace(/[<>]/g, '').trim();
  },
};

// Trend analysis utilities
export const trends = {
  detectTrend: (values: number[], threshold = 0.1) => {
    if (values.length < 2) return 'stable';

    const first = values[0];
    const last = values[values.length - 1];
    const change = (last - first) / first;

    if (change > threshold) return 'increasing';
    if (change < -threshold) return 'decreasing';
    return 'stable';
  },

  calculateTrendStrength: (values: number[]) => {
    if (values.length < 2) return 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const correlation = analytics.calculateCorrelation(x, values);

    return Math.abs(correlation);
  },

  forecastLinear: (values: number[], periods: number) => {
    if (values.length < 2) return Array(periods).fill(values[0] || 0);

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);

    // Simple linear regression
    const xMean = analytics.calculateAverage(x);
    const yMean = analytics.calculateAverage(values);

    const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (values[i] - yMean), 0);
    const denominator = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    return Array.from({ length: periods }, (_, i) => slope * (n + i) + intercept);
  },
};

// Alert and notification utilities
export const alerts = {
  createAlert: (type: 'success' | 'warning' | 'error' | 'info', message: string, metric?: string, value?: number, threshold?: number) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      metric,
      value,
      threshold,
      timestamp: new Date(),
    };
  },

  evaluateThreshold: (value: number, threshold: number, operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq') => {
    switch (operator) {
      case 'gt': return value > threshold;
      case 'lt': return value < threshold;
      case 'gte': return value >= threshold;
      case 'lte': return value <= threshold;
      case 'eq': return value === threshold;
      default: return false;
    }
  },

  getAlertSeverity: (deviation: number) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation > 0.5) return 'critical';
    if (absDeviation > 0.3) return 'high';
    if (absDeviation > 0.1) return 'medium';
    return 'low';
  },
};

// Performance monitoring utilities
export const performance = {
  measureExecutionTime: async <T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return { result, duration: end - start };
  },

  debounce: <T extends (...args: any[]) => any>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    }) as T;
  },

  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
};

// Data transformation utilities
export const transforms = {
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  aggregateBy: <T>(array: T[], groupKey: keyof T, aggregateKey: keyof T, aggregateFn: (values: number[]) => number = analytics.calculateSum) => {
    const groups = transforms.groupBy(array, groupKey);
    const result: Record<string, number> = {};

    Object.entries(groups).forEach(([key, items]) => {
      const values = items.map(item => Number(item[aggregateKey])).filter(v => !isNaN(v));
      result[key] = aggregateFn(values);
    });

    return result;
  },

  pivotTable: <T>(array: T[], rowKey: keyof T, colKey: keyof T, valueKey: keyof T) => {
    const result: Record<string, Record<string, any>> = {};

    array.forEach(item => {
      const row = String(item[rowKey]);
      const col = String(item[colKey]);
      const value = item[valueKey];

      if (!result[row]) result[row] = {};
      result[row][col] = value;
    });

    return result;
  },

  normalizeData: (values: number[], min = 0, max = 1) => {
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;

    if (range === 0) return values.map(() => min);

    return values.map(value =>
      min + ((value - dataMin) / range) * (max - min)
    );
  },
};