'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Crown,
  Star,
  Zap,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Calendar,
  Shield,
  Sparkles,
} from 'lucide-react';

interface DealerSubscriptionTabProps {
  dealershipId: string;
  userEmail: string;
}

interface SubscriptionData {
  id: string;
  status: string;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  currentListings: number;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
  paystackCustomerId: string | null;
  plan: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    currency: string;
    duration: number;
    features: string[];
    maxListings: number;
    maxPhotos: number;
  };
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    paidAt: string | null;
  }>;
}

interface PlanData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  maxListings: number;
  maxPhotos: number;
  priority: number;
}

/* ── Brand palette ─────────────────────────────────── */
const BRAND = {
  navy: '#1F3469',
  red: '#CB2030',
  navySoft: '#E8EDF5',
  redSoft: '#FDEDEF',
  greenSoft: '#ECFDF5',
  amberSoft: '#FFFBEB',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  ACTIVE: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle },
  PAST_DUE: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: AlertTriangle },
  CANCELLED: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', icon: XCircle },
  PENDING_PAYMENT: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock },
  EXPIRED: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-500', icon: XCircle },
  SUSPENDED: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: AlertTriangle },
};

const PLAN_ICONS: Record<string, typeof Zap> = {
  starter: Zap,
  professional: Star,
  enterprise: Crown,
};

const PLAN_COLORS: Record<string, { gradient: string; badge: string }> = {
  starter: { gradient: 'from-blue-500 to-blue-600', badge: 'bg-blue-50 text-blue-700' },
  professional: { gradient: 'from-violet-500 to-purple-600', badge: 'bg-violet-50 text-violet-700' },
  enterprise: { gradient: 'from-amber-500 to-yellow-500', badge: 'bg-amber-50 text-amber-700' },
};

export default function DealerSubscriptionTab({ dealershipId, userEmail }: DealerSubscriptionTabProps) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subRes, plansRes] = await Promise.all([
        fetch('/api/dealer/dealership'),
        fetch('/api/subscription-plans'),
      ]);

      // Get dealership data which may include subscription info
      if (subRes.ok) {
        const dealerData = await subRes.json();
        // Try to get subscription from dealership data
        if (dealerData.dealership?.subscription) {
          setSubscription(dealerData.dealership.subscription);
        }
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.plans || plansData || []);
      }
    } catch (err) {
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatNAD = (amount: number) => {
    return `N$ ${new Intl.NumberFormat('en-NA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    setCancelling(true);
    try {
      const res = await fetch('/api/paystack/create-subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealershipId }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch {
      // Silently handle - the tRPC mutation is the canonical path
    } finally {
      setCancelling(false);
    }
  };

  /* ── Loading state ──────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-slate-100 rounded-xl mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ────────────────────────────────── */
  if (error) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-slate-700 font-medium mb-1">Unable to load subscription</p>
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const statusStyle = subscription
    ? STATUS_STYLES[subscription.status] || STATUS_STYLES.ACTIVE
    : null;

  const usagePct = subscription && subscription.plan.maxListings > 0
    ? Math.min(100, (subscription.currentListings / subscription.plan.maxListings) * 100)
    : 0;

  const planSlug = subscription?.plan?.slug?.toLowerCase() || subscription?.plan?.name?.toLowerCase() || 'starter';

  return (
    <div className="space-y-6">
      {/* ── Current Subscription ────────────────────── */}
      {subscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main subscription card */}
          <Card className="lg:col-span-2 overflow-hidden">
            {/* Plan header stripe */}
            <div className={`h-1.5 bg-gradient-to-r ${PLAN_COLORS[planSlug]?.gradient || 'from-slate-400 to-slate-500'}`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${PLAN_COLORS[planSlug]?.gradient || 'from-slate-400 to-slate-500'} flex items-center justify-center shadow-sm`}>
                    {(() => {
                      const Icon = PLAN_ICONS[planSlug] || Zap;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{subscription.plan.name} Plan</CardTitle>
                    <CardDescription>{subscription.plan.description || 'Active subscription'}</CardDescription>
                  </div>
                </div>
                {statusStyle && (
                  <Badge className={`${statusStyle.bg} ${statusStyle.text} border gap-1.5 px-3 py-1`}>
                    <statusStyle.icon className="w-3.5 h-3.5" />
                    {subscription.status.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Key info row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Monthly Cost</p>
                  <p className="text-xl font-bold text-slate-900">{formatNAD(subscription.plan.price)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Next Payment</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {subscription.nextPaymentDate
                      ? new Date(subscription.nextPaymentDate).toLocaleDateString('en-NA', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Auto-Renew</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {subscription.autoRenew ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700">Enabled</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage bar */}
              {subscription.plan.maxListings > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Vehicle Listings</span>
                    <span className="text-sm text-slate-500 tabular-nums">
                      {subscription.currentListings} / {subscription.plan.maxListings}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usagePct}%`,
                        backgroundColor: usagePct > 90 ? BRAND.red : usagePct > 70 ? '#D97706' : '#059669'
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {subscription.plan.maxListings - subscription.currentListings} listings remaining
                  </p>
                </div>
              )}

              {/* Features list */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Plan Features</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(Array.isArray(subscription.plan.features) ? subscription.plan.features : []).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-1">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  className="w-full text-white justify-between group"
                  style={{ background: BRAND.red }}
                  onClick={() => router.push('/pricing')}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Upgrade Plan
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/dealer/invoices')}>
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  View Invoices
                </Button>
                {subscription.status === 'ACTIVE' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                  >
                    <XCircle className="w-4 h-4" />
                    {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Usage alert */}
            {usagePct > 80 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Usage Alert</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    You're approaching your listing limit. Upgrade to continue adding vehicles without interruption.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recent payments */}
            {subscription.payments && subscription.payments.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-500">Recent Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {subscription.payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-1.5">
                      <div>
                        <p className="text-sm font-medium text-slate-800 tabular-nums">{formatNAD(payment.amount)}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(payment.createdAt).toLocaleDateString('en-NA', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <Badge className={`text-[10px] ${
                        payment.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                        payment.status === 'FAILED' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* ── No subscription ─────────────────────────── */
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Subscription</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Subscribe to a plan to unlock powerful features — priority placement, advanced analytics, lead management, and more.
            </p>
            <Button
              className="text-white px-6"
              style={{ background: BRAND.red }}
              onClick={() => router.push('/pricing')}
            >
              <Crown className="w-4 h-4 mr-2" />
              Choose a Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Available Plans ────────────────────────── */}
      {plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Plans</CardTitle>
            <CardDescription>Choose the plan that best fits your dealership needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => {
                const slug = plan.slug?.toLowerCase() || plan.name?.toLowerCase();
                const isCurrent = subscription?.planId === plan.id;
                const colors = PLAN_COLORS[slug] || PLAN_COLORS.starter;
                const Icon = PLAN_ICONS[slug] || Zap;
                const isPopular = plan.priority === 1 || slug === 'professional';
                const features = Array.isArray(plan.features)
                  ? plan.features
                  : typeof plan.features === 'string'
                    ? JSON.parse(plan.features)
                    : [];

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border-2 p-5 transition-all ${
                      isCurrent
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : isPopular
                          ? 'border-[#CB2030]/40 hover:border-[#CB2030] hover:shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {isPopular && !isCurrent && (
                      <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white px-3 py-0.5" style={{ background: BRAND.red }}>
                        Most Popular
                      </Badge>
                    )}
                    {isCurrent && (
                      <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-0.5">
                        Current Plan
                      </Badge>
                    )}

                    <div className="text-center mb-4 pt-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-slate-900">
                          {formatNAD(plan.price)}
                        </span>
                        <span className="text-sm text-slate-500">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-5">
                      {features.slice(0, 6).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {features.length > 6 && (
                        <li className="text-xs text-slate-400 pl-5.5">+{features.length - 6} more features</li>
                      )}
                    </ul>

                    <Button
                      className={`w-full ${
                        isCurrent
                          ? 'bg-slate-200 text-slate-500 cursor-default hover:bg-slate-200'
                          : isPopular
                            ? 'text-white hover:opacity-90'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                      style={!isCurrent && isPopular ? { background: BRAND.red } : undefined}
                      disabled={isCurrent}
                      onClick={() => !isCurrent && router.push('/pricing')}
                    >
                      {isCurrent ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
