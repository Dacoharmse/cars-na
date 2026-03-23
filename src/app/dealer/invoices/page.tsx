'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronRight,
  CreditCard,
  TrendingUp,
  Car,
  Info,
  Copy,
  Check,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  invoiceNumber: string;
  billingMonth: number;
  billingYear: number;
  subscriptionAmount: number;
  stockValue: number;
  stockFeeAmount: number;
  totalAmount: number;
  currency: string;
  planName: string;
  vehicleCount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  pdfPath: string | null;
}

type StatusFilter = 'ALL' | Invoice['status'];

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BRAND_NAVY = '#1F3469';

const STATUS_CONFIG: Record<Invoice['status'], {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = {
  PAID:      { label: 'Paid',      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  PENDING:   { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: Clock },
  OVERDUE:   { label: 'Overdue',   bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: AlertTriangle },
  CANCELLED: { label: 'Cancelled', bg: 'bg-slate-50',   text: 'text-slate-500',   border: 'border-slate-200',   icon: XCircle },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNAD(n: number) {
  return `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function daysOverdue(dueDate: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)));
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
      <div className="h-8 w-32 bg-slate-200 rounded mb-1" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[100, 80, 90, 90, 90, 80, 70, 60].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className={`h-4 bg-slate-100 rounded`} style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ status }: { status: Invoice['status'] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-1.5 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
      title="Copy invoice number"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

// ─── Expanded row detail ──────────────────────────────────────────────────────

function InvoiceDetailRow({ invoice }: { invoice: Invoice }) {
  return (
    <tr className="bg-slate-50 border-b border-slate-100">
      <td colSpan={8} className="px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Plan</p>
            <p className="font-semibold text-slate-800">{invoice.planName}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Vehicles Listed</p>
            <div className="flex items-center gap-1.5">
              <Car size={14} className="text-slate-400" />
              <p className="font-semibold text-slate-800">{invoice.vehicleCount} vehicles</p>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Total Stock Value</p>
            <p className="font-semibold text-slate-800 tabular-nums">{formatNAD(invoice.stockValue)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Stock Fee (0.1%)</p>
            <p className="font-semibold text-slate-800 tabular-nums">{formatNAD(invoice.stockFeeAmount)}</p>
            <p className="text-xs text-slate-400 mt-0.5">of {formatNAD(invoice.stockValue)}</p>
          </div>
          {invoice.paidAt && (
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Paid On</p>
              <p className="font-semibold text-emerald-700">{new Date(invoice.paidAt).toLocaleDateString('en-NA', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          )}
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Generated</p>
            <p className="font-semibold text-slate-800">{new Date(invoice.createdAt).toLocaleDateString('en-NA', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DealerInvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [invoices, setInvoices]       = useState<Invoice[]>([]);
  const [loading, setLoading]         = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [yearFilter, setYearFilter]   = useState<string>('ALL');
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) { router.push('/dealer/login'); return; }
    if (session.user.role !== 'DEALER_PRINCIPAL' && session.user.role !== 'SALES_EXECUTIVE') {
      router.push('/dealer/dashboard');
    }
  }, [session, status, router]);

  // Fetch invoices
  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => { if (data.invoices) setInvoices(data.invoices); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  // Download PDF
  const handleDownload = async (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(invoice.id);
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/pdf`);
      if (!res.ok) { alert('PDF not available. Please contact support.'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  // Derived data
  const years = useMemo(() => {
    const ys = [...new Set(invoices.map(i => String(i.billingYear)))].sort((a, b) => Number(b) - Number(a));
    return ys;
  }, [invoices]);

  const filtered = useMemo(() => {
    return invoices.filter(i => {
      if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
      if (yearFilter !== 'ALL' && String(i.billingYear) !== yearFilter) return false;
      return true;
    });
  }, [invoices, statusFilter, yearFilter]);

  const totalOwed  = useMemo(() => invoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((s, i) => s + i.totalAmount, 0), [invoices]);
  const totalPaid  = useMemo(() => invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.totalAmount, 0), [invoices]);
  const overdueInvoices = useMemo(() => invoices.filter(i => i.status === 'OVERDUE'), [invoices]);
  const paidCount  = invoices.filter(i => i.status === 'PAID').length;

  const STATUS_FILTERS: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'ALL',       label: 'All',       count: invoices.length },
    { key: 'PAID',      label: 'Paid',      count: invoices.filter(i => i.status === 'PAID').length },
    { key: 'PENDING',   label: 'Pending',   count: invoices.filter(i => i.status === 'PENDING').length },
    { key: 'OVERDUE',   label: 'Overdue',   count: invoices.filter(i => i.status === 'OVERDUE').length },
    { key: 'CANCELLED', label: 'Cancelled', count: invoices.filter(i => i.status === 'CANCELLED').length },
  ].filter(f => f.key === 'ALL' || f.count > 0);

  // ── Render: loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Invoice', 'Period', 'Subscription', 'Stock Fee', 'Total', 'Due Date', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1,2,3].map(i => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Render: page ───────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText size={22} style={{ color: BRAND_NAVY }} />
              Billing & Invoices
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Monthly invoices for your Cars.na subscription</p>
          </div>
          {invoices.length > 0 && (
            <a
              href="/dealer/dashboard?tab=subscription"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: BRAND_NAVY }}
            >
              <CreditCard size={15} />
              Manage Subscription
            </a>
          )}
        </div>

        {/* ── Summary cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total invoices */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Invoices</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${BRAND_NAVY}15` }}>
                <FileText size={14} style={{ color: BRAND_NAVY }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{invoices.length}</p>
            <p className="text-xs text-slate-400 mt-1">{paidCount} paid</p>
          </div>

          {/* Outstanding */}
          <div className={`rounded-2xl border p-5 shadow-sm ${overdueInvoices.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-semibold uppercase tracking-wide ${overdueInvoices.length > 0 ? 'text-red-500' : 'text-slate-500'}`}>Outstanding</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${overdueInvoices.length > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                <Clock size={14} className={overdueInvoices.length > 0 ? 'text-red-600' : 'text-slate-400'} />
              </div>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${overdueInvoices.length > 0 ? 'text-red-700' : 'text-slate-900'}`}>
              {formatNAD(totalOwed)}
            </p>
            <p className={`text-xs mt-1 ${overdueInvoices.length > 0 ? 'text-red-500' : 'text-slate-400'}`}>
              {overdueInvoices.length > 0 ? `${overdueInvoices.length} overdue` : 'All up to date'}
            </p>
          </div>

          {/* Total paid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Paid</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-50">
                <TrendingUp size={14} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatNAD(totalPaid)}</p>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </div>
        </div>

        {/* ── Overdue alert ───────────────────────────────────────────────── */}
        {overdueInvoices.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={15} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-800 text-sm">
                {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} — action required
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Please settle immediately to avoid service restrictions. Contact{' '}
                <a href="mailto:support@cars.na" className="underline font-medium">support@cars.na</a>{' '}
                once payment is made.
              </p>
            </div>
            <a
              href="/dealer/dashboard?tab=subscription"
              className="flex-shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Pay Now
            </a>
          </div>
        )}

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        {invoices.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Status pills */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === f.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                  {f.count > 0 && f.key !== 'ALL' && (
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === f.key ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Year filter */}
            {years.length > 1 && (
              <select
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors"
                style={{ '--tw-ring-color': `${BRAND_NAVY}40` } as React.CSSProperties}
              >
                <option value="ALL">All years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            )}

            {filtered.length !== invoices.length && (
              <span className="text-xs text-slate-400 ml-auto">
                Showing {filtered.length} of {invoices.length}
              </span>
            )}
          </div>
        )}

        {/* ── Invoice table ────────────────────────────────────────────────── */}
        {invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND_NAVY}10` }}>
                <FileText size={24} style={{ color: BRAND_NAVY }} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">No invoices yet</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Invoices are generated automatically on the 1st of each month once you have an active subscription.
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-sm font-medium text-slate-500">No invoices match your filters.</p>
              <button
                onClick={() => { setStatusFilter('ALL'); setYearFilter('ALL'); }}
                className="mt-3 text-xs font-semibold underline"
                style={{ color: BRAND_NAVY }}
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Invoice</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Period</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Subscription</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Stock Fee</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Due</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((invoice, idx) => {
                    const isExpanded = expandedId === invoice.id;
                    const overdueDays = daysOverdue(invoice.dueDate);
                    const isLast = idx === filtered.length - 1;
                    return (
                      <React.Fragment key={invoice.id}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : invoice.id)}
                          className={`group cursor-pointer transition-colors hover:bg-slate-50 ${!isLast || isExpanded ? 'border-b border-slate-100' : ''} ${isExpanded ? 'bg-slate-50' : ''}`}
                        >
                          {/* Invoice # */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center">
                              <span className="font-mono text-xs font-semibold text-slate-700">{invoice.invoiceNumber}</span>
                              <CopyButton text={invoice.invoiceNumber} />
                            </div>
                          </td>

                          {/* Period */}
                          <td className="px-4 py-3.5 text-slate-700 font-medium whitespace-nowrap">
                            {MONTH_NAMES[invoice.billingMonth - 1]} {invoice.billingYear}
                          </td>

                          {/* Subscription amount */}
                          <td className="px-4 py-3.5 text-right text-slate-600 tabular-nums">
                            {formatNAD(invoice.subscriptionAmount)}
                          </td>

                          {/* Stock fee */}
                          <td className="px-4 py-3.5 text-right text-slate-600 tabular-nums">
                            {formatNAD(invoice.stockFeeAmount)}
                          </td>

                          {/* Total */}
                          <td className="px-4 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                            {formatNAD(invoice.totalAmount)}
                          </td>

                          {/* Due date */}
                          <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">
                            <span>{new Date(invoice.dueDate).toLocaleDateString('en-NA', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            {invoice.status === 'OVERDUE' && overdueDays > 0 && (
                              <span className="ml-1.5 inline-flex items-center gap-0.5 text-red-600 font-semibold">
                                {overdueDays}d late
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={invoice.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              {invoice.pdfPath ? (
                                <button
                                  onClick={(e) => handleDownload(invoice, e)}
                                  disabled={downloading === invoice.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ backgroundColor: BRAND_NAVY }}
                                >
                                  {downloading === invoice.id ? (
                                    <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Download size={12} />
                                  )}
                                  PDF
                                </button>
                              ) : (
                                <span className="text-slate-300 text-xs">No PDF</span>
                              )}
                              <span className="text-slate-300 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <ChevronDown size={14} />
                              </span>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {isExpanded && <InvoiceDetailRow invoice={invoice} />}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Billing explanation ──────────────────────────────────────────── */}
        <div className="mt-6 bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND_NAVY}10` }}>
              <Info size={14} style={{ color: BRAND_NAVY }} />
            </div>
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-slate-800 mb-1">How your invoice is calculated</p>
              <p>
                Monthly invoice = <span className="font-semibold text-slate-800">Subscription plan fee</span>
                {' '}+{' '}
                <span className="font-semibold text-slate-800">0.1% of total active stock value</span>
              </p>
              <p className="mt-1 text-slate-500 text-xs">
                Stock value is the sum of all your <span className="font-medium">Available</span> vehicle listing prices at the time of invoice generation on the 1st of each month.
              </p>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
