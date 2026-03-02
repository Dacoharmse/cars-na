'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from '@/components/ui/Modal';

interface UnpaidInvoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: string;
  status: 'PENDING' | 'OVERDUE';
}

function formatNAD(n: number) {
  return `N$ ${n.toLocaleString('en-NA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function daysOverdue(dueDate: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)));
}

export function InvoiceReminderModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [invoices, setInvoices] = useState<UnpaidInvoice[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const storageKey = `invoiceReminderShown_${today}`;
    if (sessionStorage.getItem(storageKey)) return;

    fetch('/api/invoices?unpaidOnly=true')
      .then(r => r.json())
      .then(data => {
        if (data.invoices && data.invoices.length > 0) {
          setInvoices(data.invoices);
          setIsOpen(true);
          sessionStorage.setItem(storageKey, '1');
        }
      })
      .catch(() => {/* silently ignore — reminder is non-critical */});
  }, []);

  const handleDismiss = () => setIsOpen(false);

  const handleViewBilling = () => {
    setIsOpen(false);
    router.push('/dealer/invoices');
  };

  if (!isOpen || invoices.length === 0) return null;

  const totalDue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');
  const maxOverdueDays = overdueInvoices.length > 0
    ? Math.max(...overdueInvoices.map(i => daysOverdue(i.dueDate)))
    : 0;
  const hasOverdue = overdueInvoices.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDismiss}
      closeOnOverlayClick={false}
      size="sm"
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${hasOverdue ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${hasOverdue ? 'text-red-600' : 'text-yellow-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <ModalTitle className={hasOverdue ? 'text-red-800' : 'text-yellow-800'}>
            {hasOverdue ? 'Invoice Overdue' : 'Invoice Payment Due'}
          </ModalTitle>
        </div>
      </ModalHeader>

      <ModalContent>
        <div className={`rounded-lg p-4 mb-4 ${hasOverdue ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className={`text-sm font-medium ${hasOverdue ? 'text-red-700' : 'text-yellow-700'}`}>
            You have {invoices.length} unpaid invoice{invoices.length > 1 ? 's' : ''} totalling:
          </p>
          <p className={`text-2xl font-bold mt-1 ${hasOverdue ? 'text-red-800' : 'text-yellow-800'}`}>
            {formatNAD(totalDue)}
          </p>
          {hasOverdue && maxOverdueDays > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {maxOverdueDays} day{maxOverdueDays !== 1 ? 's' : ''} overdue
            </p>
          )}
        </div>

        {hasOverdue && maxOverdueDays >= 5 && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
            Warning: access to your account will be restricted if payment is not received within{' '}
            {7 - maxOverdueDays <= 0 ? 'shortly' : `${7 - maxOverdueDays} day${7 - maxOverdueDays !== 1 ? 's' : ''}`}.
          </p>
        )}

        <p className="text-sm text-gray-500 mt-3">
          Please make payment and contact{' '}
          <a href="mailto:support@cars.na" className="text-blue-600 underline">support@cars.na</a>{' '}
          once payment is made.
        </p>
      </ModalContent>

      <ModalFooter>
        <button
          onClick={handleDismiss}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={handleViewBilling}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${hasOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
        >
          View Billing
        </button>
      </ModalFooter>
    </Modal>
  );
}
