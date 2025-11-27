/**
 * Stripe integration for Cars.na
 * Handles payment processing and subscription management
 */
import Stripe from 'stripe';

// Initialize Stripe with API key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Format amount for Stripe (convert to smallest currency unit)
 * Stripe expects amounts in cents for USD, pence for GBP, etc.
 *
 * @param amount - Amount in dollars/major currency unit
 * @param currency - Currency code (default: 'usd')
 * @returns Amount in cents/minor currency unit
 */
export function formatAmountForStripe(amount: number, currency: string = 'usd'): number {
  // Stripe expects amounts in the smallest currency unit
  // For most currencies, this is cents (multiply by 100)
  return Math.round(amount * 100);
}

/**
 * Format amount from Stripe (convert from smallest currency unit to display format)
 *
 * @param amount - Amount in cents/minor currency unit
 * @param currency - Currency code (default: 'usd')
 * @returns Amount in dollars/major currency unit
 */
export function formatAmountFromStripe(amount: number, currency: string = 'usd'): number {
  return amount / 100;
}

/**
 * Get Stripe publishable key for client-side use
 */
export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}
