'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Calculator,
  Shield,
  Clock,
  CheckCircle,
  Users,
  Star,
  ChevronRight,
  Info,
} from 'lucide-react';

/* ─── Brand palette ─────────────────────────────────────────── */
const RED = '#CB2030';

/* ─── Shared input / select styles ──────────────────────────── */
const inputCls =
  'w-full h-10 px-3 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 transition-colors bg-white';

const selectCls =
  'w-full h-10 px-3 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 transition-colors bg-white appearance-none cursor-pointer';

const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5';

/* ─── Bank data ──────────────────────────────────────────────── */
const NAMIBIAN_BANKS = [
  {
    name: 'Bank Windhoek',
    abbr: 'BW',
    interestRate: 11.5,
    maxTerm: 72,
    minDeposit: 10,
    features: ['Quick approval', 'Flexible terms', 'Online application'],
  },
  {
    name: 'First National Bank',
    abbr: 'FNB',
    interestRate: 12.0,
    maxTerm: 84,
    minDeposit: 15,
    features: ['Competitive rates', 'Extended terms', 'Pre-approval'],
  },
  {
    name: 'Standard Bank',
    abbr: 'SB',
    interestRate: 11.8,
    maxTerm: 72,
    minDeposit: 12,
    features: ['Fast processing', 'Digital banking', 'Insurance options'],
  },
  {
    name: 'Nedbank',
    abbr: 'NB',
    interestRate: 12.2,
    maxTerm: 60,
    minDeposit: 20,
    features: ['Personal service', 'Balloon payments', 'Trade-in assistance'],
  },
];

/* ─── Feature cards data ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: Calculator,
    title: 'Easy Calculator',
    desc: 'Estimate monthly payments based on real Namibian bank rates — no registration needed.',
  },
  {
    icon: CheckCircle,
    title: 'Accurate Estimates',
    desc: 'Current interest rates from all major Namibian banks, updated regularly.',
  },
  {
    icon: Shield,
    title: 'Free to Use',
    desc: 'Our calculator is completely free. Plan your budget without any commitment.',
  },
  {
    icon: Users,
    title: 'Apply with Dealers',
    desc: 'Use your estimates to negotiate with dealerships or apply directly with your bank.',
  },
  {
    icon: Clock,
    title: 'Save Time',
    desc: 'Know your budget before visiting dealers. Compare loan terms in seconds.',
  },
  {
    icon: Star,
    title: 'Trusted Tool',
    desc: 'Thousands of Namibian car buyers use our calculator to plan their purchase.',
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (n: number) =>
  'N$ ' + Math.round(n).toLocaleString('en-NA');

export default function FinancingPage() {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [term, setTerm] = useState('60');
  const [selectedBank, setSelectedBank] = useState(NAMIBIAN_BANKS[0]);

  /* ── Calculation ─────────────────────────────────────────── */
  const price = parseFloat(vehiclePrice) || 0;
  const dep = parseFloat(deposit) || 0;
  const loanAmount = Math.max(0, price - dep);
  const months = parseInt(term);
  const monthlyRate = selectedBank.interestRate / 100 / 12;

  const monthlyPayment =
    loanAmount > 0 && months > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : 0;

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - loanAmount;
  const depositPct = price > 0 ? ((dep / price) * 100).toFixed(0) : '0';

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">

        {/* ── Page Header ──────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 uppercase tracking-widest font-semibold">
              <span>Financing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              Car Financing <span style={{ color: RED }}>Calculator</span>
            </h1>
            <p className="text-base text-gray-500 max-w-xl">
              Estimate your monthly payments using real interest rates from Namibia&apos;s leading banks.
              Use your results to apply with a dealership or bank of your choice.
            </p>
          </div>
        </section>

        {/* ── Calculator ───────────────────────────────────────── */}
        <section className="py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left — Inputs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: RED }}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Loan Calculator</h2>
                </div>

                {/* Vehicle Price */}
                <div>
                  <label className={labelCls}>Vehicle Price (N$)</label>
                  <input
                    type="number"
                    placeholder="e.g. 250 000"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    className={inputCls}
                    min="0"
                  />
                </div>

                {/* Deposit */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <label className={labelCls.replace('mb-1.5', '')}>Deposit (N$)</label>
                    {price > 0 && (
                      <span className="text-xs text-gray-400">{depositPct}% of price</span>
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder="e.g. 50 000"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className={inputCls}
                    min="0"
                  />
                  {selectedBank.minDeposit > 0 && (
                    <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                      <Info className="w-3 h-3 shrink-0" />
                      {selectedBank.name} requires min. {selectedBank.minDeposit}% deposit
                    </p>
                  )}
                </div>

                {/* Loan Term */}
                <div>
                  <label className={labelCls}>Loan Term</label>
                  <div className="relative">
                    <select
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className={selectCls}
                    >
                      {[12, 24, 36, 48, 60, 72, 84].map((m) => (
                        <option key={m} value={m}>{m} months ({(m / 12).toFixed(m % 12 === 0 ? 0 : 1)} yr{m > 12 ? 's' : ''})</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Bank Selector */}
                <div>
                  <label className={labelCls}>Select Bank</label>
                  <div className="space-y-2">
                    {NAMIBIAN_BANKS.map((bank) => {
                      const active = selectedBank.name === bank.name;
                      return (
                        <button
                          key={bank.name}
                          onClick={() => setSelectedBank(bank)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all ${
                            active
                              ? 'border-[#CB2030] bg-[#CB2030]/5 ring-1 ring-[#CB2030]/20'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar abbr */}
                            <div
                              className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                              style={active ? { background: RED, color: '#fff' } : { background: '#f3f4f6', color: '#6b7280' }}
                            >
                              {bank.abbr}
                            </div>
                            <span className={`text-sm font-semibold ${active ? 'text-gray-900' : 'text-gray-700'}`}>
                              {bank.name}
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${active ? 'text-[#CB2030]' : 'text-gray-500'}`}>
                            {bank.interestRate}% p.a.
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right — Results */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                    <Calculator className="w-4 h-4 text-gray-500" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Payment Breakdown</h2>
                </div>

                {/* Monthly Payment Hero */}
                <div className="rounded-xl p-6 mb-6 text-center" style={{ background: '#111827' }}>
                  <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2">
                    Estimated Monthly Payment
                  </p>
                  <p
                    className="text-4xl font-extrabold tracking-tight"
                    style={{ color: monthlyPayment > 0 ? RED : '#6b7280' }}
                  >
                    {monthlyPayment > 0 ? fmt(monthlyPayment) : 'N$ —'}
                  </p>
                  {monthlyPayment > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedBank.name} · {selectedBank.interestRate}% p.a. · {term} months
                    </p>
                  )}
                </div>

                {/* Breakdown rows */}
                <div className="space-y-3 flex-1">
                  {[
                    { label: 'Vehicle Price', value: price > 0 ? fmt(price) : '—' },
                    { label: 'Deposit', value: dep > 0 ? fmt(dep) : '—' },
                    { label: 'Loan Amount', value: loanAmount > 0 ? fmt(loanAmount) : '—' },
                    { label: 'Interest Rate', value: `${selectedBank.interestRate}% p.a.` },
                    { label: 'Loan Term', value: `${term} months` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}

                  {/* Totals */}
                  {totalPayment > 0 && (
                    <>
                      <div className="pt-1" />
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Total Repayment</span>
                        <span className="text-sm font-bold text-gray-900">{fmt(totalPayment)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">Total Interest</span>
                        <span className="text-sm font-bold" style={{ color: RED }}>{fmt(totalInterest)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 space-y-3">
                  <Link
                    href="/vehicles"
                    className="flex items-center justify-center gap-2 h-11 w-full rounded-lg text-white text-sm font-bold transition-colors"
                    style={{ background: RED }}
                  >
                    Browse Vehicles
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/dealers"
                    className="flex items-center justify-center gap-2 h-11 w-full rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Contact a Dealer
                  </Link>
                </div>

                {/* Disclaimer */}
                <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
                  * Estimates only. Actual rates and terms are set by banks and may vary based on your credit profile. Contact your preferred bank for a formal quote.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works / Features ──────────────────────────── */}
        <section className="py-10 sm:py-14 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: RED }}>
                Why use our tool
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Plan smarter before you buy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: RED }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: RED }}>
              Ready to buy?
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Find your next vehicle on Cars.na
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
              Browse hundreds of verified listings across Namibia. Apply for financing with your preferred bank or dealer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-lg text-white text-sm font-bold transition-colors"
                style={{ background: RED }}
              >
                Browse All Cars
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dealers"
                className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                View Dealerships
              </Link>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
