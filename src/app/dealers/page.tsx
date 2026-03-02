'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Phone, Mail, Car, Search, Building2, CheckCircle } from 'lucide-react';

interface Dealership {
  id: string;
  name: string;
  slug: string | null;
  city: string | null;
  region: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  description: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  specializations: string | null;
  _count?: { vehicles: number };
}

export default function DealersPage() {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [filtered, setFiltered] = useState<Dealership[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDealerships() {
      try {
        const res = await fetch('/api/dealerships');
        if (!res.ok) throw new Error('Failed to load dealerships');
        const data = await res.json();
        setDealerships(data);
        setFiltered(data);
      } catch {
        setError('Failed to load dealerships. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchDealerships();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(dealerships);
      return;
    }
    setFiltered(
      dealerships.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.city ?? '').toLowerCase().includes(q) ||
          (d.region ?? '').toLowerCase().includes(q) ||
          (d.specializations ?? '').toLowerCase().includes(q)
      )
    );
  }, [search, dealerships]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Find a Dealership</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Browse verified dealerships across Namibia
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, city, or specialization…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* States */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-600">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No dealerships found{search ? ` for "${search}"` : ''}.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dealer) => (
              <Link
                key={dealer.id}
                href={dealer.slug ? `/dealership/${dealer.slug}` : '#'}
                className={`block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${!dealer.slug ? 'pointer-events-none opacity-60' : ''}`}
              >
                {/* Logo / cover */}
                <div className="h-24 bg-gradient-to-r from-[#1F3469] to-[#2a4a8f] flex items-center justify-center">
                  {dealer.logo ? (
                    <img
                      src={dealer.logo}
                      alt={dealer.name}
                      className="h-16 w-auto object-contain"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-white/60" />
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-semibold text-slate-900 dark:text-white text-base leading-tight">
                      {dealer.name}
                    </h2>
                    {dealer.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" title="Verified dealership" />
                    )}
                  </div>

                  {dealer.city && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{[dealer.city, dealer.region].filter(Boolean).join(', ')}</span>
                    </div>
                  )}

                  {dealer.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-1">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{dealer.phone}</span>
                    </div>
                  )}

                  {dealer.email && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{dealer.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <Car className="w-3.5 h-3.5" />
                      <span>{dealer._count?.vehicles ?? 0} vehicles</span>
                    </div>
                    {dealer.isFeatured && (
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">Are you a dealership owner?</p>
          <Link
            href="/dealers/register"
            className="inline-flex items-center px-6 py-3 bg-[#1F3469] text-white font-semibold rounded-lg hover:bg-[#162755] transition-colors"
          >
            Register Your Dealership
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
