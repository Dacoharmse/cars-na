'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Calendar, MapPin, ChevronRight, ExternalLink, Tag, Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  endDate?: string | null;
  location?: string | null;
  venue?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  isFeatured: boolean;
}

const CATEGORIES = ['All', 'Car Show', 'Auction', 'Expo', 'Track Day', 'Other'];

const CATEGORY_COLORS: Record<string, { pill: string; bar: string }> = {
  'Car Show':  { pill: 'bg-red-50 text-red-700 border-red-100',    bar: 'bg-[#CB2030]' },
  'Auction':   { pill: 'bg-amber-50 text-amber-700 border-amber-100', bar: 'bg-amber-500' },
  'Expo':      { pill: 'bg-blue-50 text-blue-700 border-blue-100',  bar: 'bg-blue-500' },
  'Track Day': { pill: 'bg-green-50 text-green-700 border-green-100', bar: 'bg-green-500' },
  'Other':     { pill: 'bg-gray-100 text-gray-600 border-gray-200', bar: 'bg-gray-400' },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-NA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('en-NA', { hour: '2-digit', minute: '2-digit' });
}
function monthLabel(d: string) {
  return new Date(d).toLocaleDateString('en-NA', { month: 'short' }).toUpperCase();
}
function dayNum(d: string) {
  return new Date(d).getDate();
}
function isToday(d: string) {
  const now = new Date();
  const ev = new Date(d);
  return now.toDateString() === ev.toDateString();
}
function isTomorrow(d: string) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toDateString() === new Date(d).toDateString();
}
function badge(d: string) {
  if (isToday(d)) return 'TODAY';
  if (isTomorrow(d)) return 'TOMORROW';
  return null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/events?limit=50')
      .then(r => r.ok ? r.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(ev => {
    const matchCat = activeCategory === 'All' || ev.category === activeCategory;
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location?.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(ev => ev.isFeatured);
  const regular = filtered.filter(ev => !ev.isFeatured);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">

        {/* ── Header ─────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#CB2030] mb-3">Events</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Upcoming Events</h1>
            <p className="text-base text-gray-500 max-w-xl">
              Car shows, auctions, expos and track days happening across Namibia. Stay in the loop.
            </p>

            {/* Search + Filter row */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 bg-white"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`h-10 px-4 rounded-lg text-sm font-semibold border transition-all ${
                      activeCategory === cat
                        ? 'border-[#CB2030] bg-[#CB2030] text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">

          {loading ? (
            /* Skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No events found</h3>
              <p className="text-sm text-gray-400">
                {search || activeCategory !== 'All'
                  ? 'Try adjusting your filters.'
                  : 'No upcoming events at this time. Check back soon.'}
              </p>
              {(search || activeCategory !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); }}
                  className="mt-4 text-sm font-semibold text-[#CB2030] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Featured events */}
              {featured.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#CB2030] mb-4">Featured</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {featured.map(ev => (
                      <EventCard key={ev.id} event={ev} featured />
                    ))}
                  </div>
                </div>
              )}

              {/* All / regular events */}
              {regular.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">All Events</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {regular.map(ev => (
                      <EventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

/* ── Event Card ──────────────────────────────────────────────── */
function EventCard({ event: ev, featured = false }: { event: Event; featured?: boolean }) {
  const colors = CATEGORY_COLORS[ev.category ?? ''] ?? CATEGORY_COLORS['Other'];
  const todayBadge = badge(ev.date);

  return (
    <div className={`bg-white rounded-xl border overflow-hidden group transition-shadow hover:shadow-md ${featured ? 'border-[#CB2030]/20' : 'border-gray-100'}`}>
      {/* Image / color bar */}
      {ev.imageUrl ? (
        <div className="h-44 overflow-hidden">
          <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className={`h-1.5 ${colors.bar}`} />
      )}

      <div className="p-5">
        {/* Date + category row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Date box */}
          <div className="shrink-0 text-center w-12">
            <div className="rounded-lg bg-gray-900 py-1.5 px-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{monthLabel(ev.date)}</p>
              <p className="text-xl font-extrabold text-white leading-none">{dayNum(ev.date)}</p>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {ev.category && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.pill}`}>
                  {ev.category}
                </span>
              )}
              {todayBadge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CB2030] text-white">
                  {todayBadge}
                </span>
              )}
              {ev.isFeatured && !featured && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                  Featured
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#CB2030] transition-colors">
              {ev.title}
            </h3>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{fmtDate(ev.date)}</span>
          </div>
          {ev.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{ev.venue ? `${ev.venue}, ` : ''}{ev.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {ev.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{ev.description}</p>
        )}

        {/* CTA */}
        {ev.externalUrl && (
          <a
            href={ev.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CB2030] hover:underline"
          >
            More info <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
