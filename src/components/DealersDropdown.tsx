'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, MapPin, Building2, ArrowRight, Search, Users, Star, Car } from 'lucide-react';

const NAVY = '#1F3469';
const RED = '#CB2030';
const GREEN = '#109B4A';

interface Dealership {
  id: string;
  name: string;
  slug: string | null;
  city: string | null;
  streetAddress: string | null;
  phone: string | null;
}

interface TownGroup {
  town: string;
  dealerships: Dealership[];
}

interface DealersDropdownProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

// Initials avatar for dealer
function DealerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  // Pick a consistent hue from name
  const hues = [210, 240, 180, 150, 30, 270, 0];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
      style={{ background: `hsl(${hue},55%,42%)` }}
    >
      {initials}
    </div>
  );
}

export default function DealersDropdown({ isMobile = false, onNavigate }: DealersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dealerGroups, setDealerGroups] = useState<TownGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchDealerships() {
      try {
        const response = await fetch('/api/dealerships/grouped');
        if (response.ok) {
          const data = await response.json();
          setDealerGroups(data);
        }
      } catch (error) {
        console.error('Error fetching dealerships:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDealerships();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search after open
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const totalDealers = dealerGroups.reduce((s, g) => s + g.dealerships.length, 0);
  const totalCities = dealerGroups.length;

  // Filter by search
  const filtered = search.trim()
    ? dealerGroups
        .map((g) => ({
          ...g,
          dealerships: g.dealerships.filter(
            (d) =>
              d.name.toLowerCase().includes(search.toLowerCase()) ||
              g.town.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((g) => g.dealerships.length > 0)
    : dealerGroups;

  const close = () => { setIsOpen(false); setSearch(''); };

  // ─── Mobile ───────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="border-b border-slate-200 pb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-base font-semibold text-slate-700 hover:text-[#1F3469] transition-colors px-2 py-1"
        >
          <span>Dealers</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-2 pl-2 space-y-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              filtered.map((group) => (
                <div key={group.town}>
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    <MapPin size={11} style={{ color: RED }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {group.town}
                    </span>
                    <span className="text-[10px] text-slate-400">({group.dealerships.length})</span>
                  </div>
                  <div className="space-y-0.5">
                    {group.dealerships.map((dealer) =>
                      dealer.slug ? (
                        <Link
                          key={dealer.id}
                          href={`/dealership/${dealer.slug}`}
                          className="flex items-center gap-2 pl-5 pr-2 py-1.5 text-sm text-slate-600 hover:text-[#1F3469] hover:bg-slate-50 rounded-lg transition-colors"
                          onClick={() => { close(); onNavigate?.(); }}
                        >
                          <Building2 size={12} className="text-slate-400 flex-shrink-0" />
                          {dealer.name}
                        </Link>
                      ) : (
                        <div
                          key={dealer.id}
                          className="flex items-center gap-2 pl-5 pr-2 py-1.5 text-sm text-slate-400 cursor-not-allowed"
                          title="Profile not yet available"
                        >
                          <Building2 size={12} className="text-slate-300 flex-shrink-0" />
                          {dealer.name}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))
            )}
            <Link
              href="/dealers"
              className="flex items-center gap-1.5 px-2 py-2 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: NAVY }}
              onClick={() => { close(); onNavigate?.(); }}
            >
              View all {totalDealers} dealers <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    );
  }

  // ─── Desktop mega-menu ────────────────────────────────────────────────────
  const multiColumn = filtered.length >= 3;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        className="relative text-sm font-semibold text-slate-700 hover:text-[#1F3469] transition-colors duration-150 py-2 flex items-center gap-1 group"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>Dealers</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        {/* Underline */}
        <span
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-200 rounded-full"
          style={{
            width: isOpen ? '100%' : '0%',
            background: NAVY,
          }}
        />
      </button>

      {/* Mega-menu panel */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 z-[70] rounded-2xl overflow-hidden"
          style={{
            width: multiColumn ? '580px' : '320px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(31,52,105,0.12)',
            background: '#fff',
            animation: 'dropdownEnter 0.18s cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={close}
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            className="px-5 pt-4 pb-4"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #2a4485 100%)`,
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white font-bold text-base leading-tight">Find a Dealership</p>
                <p className="text-white/55 text-[12px] mt-0.5">
                  {loading
                    ? 'Loading dealers…'
                    : `${totalDealers} authorised dealer${totalDealers !== 1 ? 's' : ''} in ${totalCities} cit${totalCities !== 1 ? 'ies' : 'y'}`}
                </p>
              </div>
              <Link
                href="/dealers"
                onClick={close}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-white/75 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex-shrink-0"
              >
                View all <ArrowRight size={11} />
              </Link>
            </div>

            {/* Stats row */}
            {!loading && totalDealers > 0 && (
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <Building2 size={12} className="text-white/50" />
                  <span className="text-white/65 text-[11px]">{totalDealers} Dealers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-white/50" />
                  <span className="text-white/65 text-[11px]">{totalCities} Cities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-300/70" />
                  <span className="text-white/65 text-[11px]">Authorised</span>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by dealer name or city…"
                className="w-full bg-white/12 hover:bg-white/18 focus:bg-white/22 text-white placeholder:text-white/35 text-[12px] rounded-xl pl-8 pr-3 py-2.5 focus:outline-none transition-colors border border-white/0 focus:border-white/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <div className="p-4 max-h-[56vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {loading ? (
              /* Skeleton */
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2.5 w-2.5 bg-slate-200 rounded-full" />
                      <div className="h-2.5 w-20 bg-slate-200 rounded" />
                    </div>
                    {[1, 2].map((j) => (
                      <div key={j} className="flex items-center gap-3 px-3 py-2.5 mb-1">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-3 bg-slate-100 rounded w-3/4 mb-1" />
                          <div className="h-2.5 bg-slate-50 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              /* Empty state */
              <div className="py-10 text-center">
                <Building2 size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">No dealerships found</p>
                <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
                <button
                  onClick={() => setSearch('')}
                  className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: NAVY, background: `${NAVY}10` }}
                >
                  Clear search
                </button>
              </div>
            ) : (
              /* City groups */
              <div className={multiColumn ? 'grid grid-cols-2 gap-x-4' : ''}>
                {filtered.map((group) => (
                  <div key={group.town} className="mb-4">
                    {/* City header */}
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div
                        className="flex items-center gap-1.5 flex-1"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: RED }}
                        />
                        <span
                          className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500"
                        >
                          {group.town}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none"
                        style={{ color: NAVY, background: `${NAVY}0f` }}
                      >
                        {group.dealerships.length}
                      </span>
                    </div>

                    {/* Dealer rows */}
                    <div className="space-y-0.5">
                      {group.dealerships.map((dealer) =>
                        dealer.slug ? (
                          <Link
                            key={dealer.id}
                            href={`/dealership/${dealer.slug}`}
                            onClick={close}
                            className="group/row flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${NAVY}09`;
                              e.currentTarget.style.transform = 'translateX(2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <DealerAvatar name={dealer.name} />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-[13px] font-semibold text-slate-700 truncate leading-tight transition-colors duration-100 group-hover/row:text-[#1F3469]"
                              >
                                {dealer.name}
                              </p>
                              {dealer.streetAddress ? (
                                <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                                  {dealer.streetAddress}
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-300 truncate leading-tight mt-0.5">
                                  {group.town}, Namibia
                                </p>
                              )}
                            </div>
                            <ArrowRight
                              size={12}
                              className="flex-shrink-0 transition-all duration-150 opacity-0 group-hover/row:opacity-100 -translate-x-1 group-hover/row:translate-x-0"
                              style={{ color: NAVY }}
                            />
                          </Link>
                        ) : (
                          <div
                            key={dealer.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl opacity-40 cursor-not-allowed"
                            title="Profile not yet available"
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-100">
                              <Building2 size={13} className="text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-slate-500 truncate">{dealer.name}</p>
                              <p className="text-[11px] text-slate-300 mt-0.5">Coming soon</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <div
            className="px-4 py-3"
            style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#f8f9fb' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                {totalDealers} dealer{totalDealers !== 1 ? 's' : ''} across Namibia
              </p>
              <Link
                href="/dealers"
                onClick={close}
                className="flex items-center gap-1.5 text-[12px] font-bold rounded-xl px-4 py-2 transition-all duration-150"
                style={{ color: '#fff', background: NAVY }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#2a4485'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = NAVY; }}
              >
                Browse all dealerships
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown entrance animation */}
      <style>{`
        @keyframes dropdownEnter {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}
