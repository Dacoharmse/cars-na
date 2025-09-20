'use client';

import { useState, useEffect } from 'react';
import { PaystackPop } from '@paystack/inline-js';
import {
  initializePaystackPayment,
  generatePaymentReference,
  convertNADToNGN,
  formatAmountForPaystack
} from '@/lib/paystack';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Loader2, Check, X, CreditCard } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
}

interface SubscriptionCheckoutProps {
  plan: SubscriptionPlan;
  dealershipId: string;
  userEmail: string;
  paystackPublicKey?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CheckoutForm({
  plan,
  dealershipId,
  userEmail,
  paystackPublicKey,
  onSuccess,
  onCancel
}: SubscriptionCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Convert NAD to NGN for display
  const amountInNGN = convertNADToNGN(plan.price);
  const amountInKobo = formatAmountForPaystack(amountInNGN, 'NGN');

  const handlePayment = async () => {
    if (!paystackPublicKey) {
      setError('Payment system not configured. Please contact support.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate unique payment reference
      const paymentRef = generatePaymentReference();

      // Initialize Paystack payment popup
      const handler = PaystackPop.setup({
        key: paystackPublicKey,
        email: userEmail,
        amount: amountInKobo,
        currency: 'NGN',
        ref: paymentRef,
        metadata: {
          dealershipId,
          planId: plan.id,
          originalAmount: plan.price,
          originalCurrency: 'NAD',
          subscriptionType: 'recurring',
        },
        callback: async (response: any) => {
          if (response.status === 'success') {
            // Payment successful - verify and activate subscription
            try {
              const verificationResponse = await fetch('/api/paystack/create-subscription', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  dealershipId,
                  planId: plan.id,
                  email: userEmail,
                  paymentReference: response.reference,
                }),
              });

              if (verificationResponse.ok) {
                onSuccess?.();
              } else {
                const errorData = await verificationResponse.json();
                setError(errorData.error || 'Failed to activate subscription');
              }
            } catch (verifyError) {
              setError('Failed to verify payment. Please contact support.');
            }
          } else {
            setError('Payment was not completed successfully');
          }
          setIsLoading(false);
        },
        onClose: () => {
          setIsLoading(false);
        },
      });

      // Open the payment popup
      handler.openIframe();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
      setIsLoading(false);
    }
  };

  const handleSubscriptionPayment = async () => {
    if (!paystackPublicKey) {
      setError('Payment system not configured. Please contact support.');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Create subscription with Paystack
      const response = await fetch('/api/paystack/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealershipId,
          planId: plan.id,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const subscriptionData = await response.json();

      // Initialize payment with subscription data
      const handler = PaystackPop.setup({
        key: paystackPublicKey,
        email: subscriptionData.customer.email,
        amount: subscriptionData.amount,
        currency: subscriptionData.currency,
        plan: subscriptionData.planCode,
        metadata: subscriptionData.metadata,
        callback: (response: any) => {
          if (response.status === 'success') {
            onSuccess?.();
          } else {
            setError('Subscription setup was not completed successfully');
          }
          setIsInitializing(false);
        },
        onClose: () => {
          setIsInitializing(false);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err.message || 'Failed to set up subscription');
      setIsInitializing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {plan.name} Plan
            <Badge className="bg-blue-100 text-blue-800">
              NAD {plan.price.toLocaleString()}/{plan.duration === 1 ? 'month' : `${plan.duration} months`}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">What's included:</h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Secure Payment via Paystack
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment will be processed securely by Paystack. Amount will be converted from NAD {plan.price.toLocaleString()} to NGN {amountInNGN.toLocaleString()} for processing.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h5 className="font-medium text-gray-900 mb-2">Payment Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price (NAD):</span>
                    <span className="font-medium">NAD {plan.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span>Price (NGN):</span>
                    <span className="font-medium">NGN {amountInNGN.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <X className="h-4 w-4 text-red-600" />
                <div>
                  <h4 className="text-red-800 font-medium">Payment Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </Alert>
            )}

            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                disabled={isLoading || isInitializing || !paystackPublicKey}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay NAD {plan.price.toLocaleString()} (One-time)
                  </>
                )}
              </Button>

              <Button
                onClick={handleSubscriptionPayment}
                disabled={isLoading || isInitializing || !paystackPublicKey}
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up Subscription...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Subscribe NAD {plan.price.toLocaleString()}/month (Recurring)
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading || isInitializing}
                className="w-full"
              >
                Cancel
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>
                By proceeding, you agree to our Terms of Service and Privacy Policy.
                Your subscription will auto-renew unless cancelled.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionCheckout(props: SubscriptionCheckoutProps) {
  const [paystackKey, setPaystackKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get Paystack public key from environment or API
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (key) {
      setPaystackKey(key);
    } else {
      console.error('Paystack public key not found in environment variables');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Setting up payment system...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paystackKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <X className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment System Unavailable
            </h3>
            <p className="text-gray-600">
              The payment system is currently not configured. Please contact support for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CheckoutForm
      {...props}
      paystackPublicKey={paystackKey}
    />
  );
}