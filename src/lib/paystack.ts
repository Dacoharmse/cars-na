'use client';

// Import PaystackPop dynamically for client-side usage only
let PaystackPop: any;

if (typeof window !== 'undefined') {
  try {
    PaystackPop = require('@paystack/inline-js');
  } catch (error) {
    console.warn('PaystackPop import failed:', error);
  }
}

// Server-side Paystack (for Node.js/API routes)
let Paystack: any;
if (typeof window === 'undefined') {
  // Only import on server-side
  try {
    Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
  } catch (error) {
    console.warn('Paystack not available on server:', error);
  }
}

export const paystack = Paystack;

// Client-side Paystack popup configuration
export const initializePaystackPayment = (config: {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  callback: (response: any) => void;
  onClose: () => void;
}) => {
  const handler = PaystackPop.setup({
    key: config.key,
    email: config.email,
    amount: config.amount * 100, // Paystack expects amount in kobo (for NGN) or cents
    currency: config.currency || 'NGN',
    ref: config.ref || generatePaymentReference(),
    callback: config.callback,
    onClose: config.onClose,
  });

  return handler;
};

// Generate unique payment reference
export const generatePaymentReference = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  return `cars-na-${timestamp}-${random}`;
};

// Format amount for Paystack (convert to kobo/cents)
export const formatAmountForPaystack = (amount: number, currency: string = 'NGN'): number => {
  // Paystack expects amounts in the smallest currency unit
  // For NGN: kobo (1 NGN = 100 kobo)
  // For USD: cents (1 USD = 100 cents)
  // For most currencies: multiply by 100
  return Math.round(amount * 100);
};

// Format amount from Paystack (convert from kobo/cents)
export const formatAmountFromPaystack = (amount: number, currency: string = 'NGN'): number => {
  // Convert from smallest currency unit back to main unit
  return Math.round(amount / 100);
};

// Currency conversion helpers for Namibian Dollar (NAD)
export const convertNADToNGN = (amountInNAD: number): number => {
  // Approximate conversion rate (this should be fetched from a real exchange rate API)
  const exchangeRate = 23.5; // 1 NAD ≈ 23.5 NGN (as of 2024)
  return Math.round(amountInNAD * exchangeRate);
};

export const convertNGNToNAD = (amountInNGN: number): number => {
  // Approximate conversion rate
  const exchangeRate = 0.0426; // 1 NGN ≈ 0.0426 NAD (as of 2024)
  return Math.round(amountInNGN * exchangeRate * 100) / 100; // Round to 2 decimal places
};

// Paystack supported currencies for Namibian businesses
export const SUPPORTED_CURRENCIES = {
  NGN: 'Nigerian Naira',
  USD: 'US Dollar',
  GHS: 'Ghanaian Cedi',
  ZAR: 'South African Rand',
  KES: 'Kenyan Shilling',
};

// Get appropriate currency for Namibian users
export const getPaymentCurrency = (): string => {
  // For Namibian users, we'll use NGN since Paystack doesn't directly support NAD
  // You can implement more sophisticated currency detection based on user location
  return 'NGN';
};