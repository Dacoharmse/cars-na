'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';

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
  pdfPath: string | null;
  createdAt: string;
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const statusConfig: Record<Invoice['status'], { label: string; classes: string }> = {
  PENDING:   { label: 'Pending',   classes: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  OVERDUE:   { label: 'Overdue',   classes: 'bg-red-100 text-red-800 border-red-200' },
  PAID:      { label: 'Paid',      classes: 'bg-green-100 text-green-800 border-green-200' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
};

function formatNAD(n: number) {
  return `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function daysOverdue(dueDate: string): number {
  return Math.floor((Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
}

export default function DealerInvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) { router.push('/dealer/login'); return; }
    if (session.user.role !== 'DEALER_PRINCIPAL' && session.user.role !== 'SALES_EXECUTIVE') {
      router.push('/dealer/dashboard');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/invoices')
      .then(r => r.json())
      .then(data => { if (data.invoices) setInvoices(data.invoices); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleDownload = async (invoice: Invoice) => {
    if (!invoice.pdfPath) return;
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

  const totalOwed = invoices
    .filter(i => i.status === 'PENDING' || i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoices & Billing</h1>
          <p className="text-gray-500 mt-1">Your monthly invoices from Cars.na</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p>
          </div>
          <div className={`rounded-xl border p-5 shadow-sm ${overdueInvoices.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
            <p className="text-sm text-gray-500">Amount Outstanding</p>
            <p className={`text-2xl font-bold mt-1 ${overdueInvoices.length > 0 ? 'text-red-700' : 'text-gray-900'}`}>
              {formatNAD(totalOwed)}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Paid (all time)</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {formatNAD(invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.totalAmount, 0))}
            </p>
          </div>
        </div>

        {/* Overdue warning */}
        {overdueInvoices.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-red-600 text-xl mt-0.5">⚠️</span>
            <div>
              <p className="font-semibold text-red-800">You have {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''}.</p>
              <p className="text-sm text-red-700 mt-0.5">
                Please settle immediately to avoid service restrictions. Contact <a href="mailto:support@cars.na" className="underline">support@cars.na</a> once payment is made.
              </p>
            </div>
          </div>
        )}

        {/* Invoice table */}
        {invoices.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No invoices yet.</p>
            <p className="text-sm mt-1">Invoices are generated on the 1st of each month.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Period</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Subscription</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock Fee</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Due Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map(invoice => {
                    const cfg = statusConfig[invoice.status];
                    const overdueDays = daysOverdue(invoice.dueDate);
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-900 font-medium">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {MONTH_NAMES[invoice.billingMonth - 1]} {invoice.billingYear}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {formatNAD(invoice.subscriptionAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          <span title={`0.1% of ${formatNAD(invoice.stockValue)} stock value (${invoice.vehicleCount} vehicles)`}>
                            {formatNAD(invoice.stockFeeAmount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {formatNAD(invoice.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString('en-NA')}
                          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && overdueDays > 0 && (
                            <span className="ml-1 text-red-600 text-xs font-medium">({overdueDays}d overdue)</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {invoice.pdfPath ? (
                            <button
                              onClick={() => handleDownload(invoice)}
                              disabled={downloading === invoice.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {downloading === invoice.id ? (
                                <>
                                  <span className="animate-spin inline-block w-3 h-3 border border-white border-t-transparent rounded-full" />
                                  Downloading...
                                </>
                              ) : (
                                <>↓ PDF</>
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">No PDF</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing explanation */}
        <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-5 text-sm text-blue-800">
          <p className="font-semibold mb-1">How your invoice is calculated</p>
          <p>Monthly invoice = <strong>Subscription plan fee</strong> + <strong>0.1% of total stock value</strong></p>
          <p className="mt-1 text-blue-700">Stock value is the sum of all your active (AVAILABLE) vehicle listing prices at the time of invoice generation.</p>
        </div>
      </div>
    </MainLayout>
  );
}
