'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Loader2, Check, X } from 'lucide-react';

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
  clientSecret?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function CheckoutForm({
  plan,
  dealershipId,
  onSuccess,
  onCancel
}: Omit<SubscriptionCheckoutProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setIsLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/subscription/success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
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
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <X className="h-4 w-4 text-red-600" />
                <div>
                  <h4 className="text-red-800 font-medium">Payment Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </Alert>
            )}

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Subscribe for NAD ${plan.price.toLocaleString()}`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionCheckout({
  plan,
  dealershipId,
  clientSecret,
  onSuccess,
  onCancel
}: SubscriptionCheckoutProps) {
  if (!clientSecret) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Setting up payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        plan={plan}
        dealershipId={dealershipId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}