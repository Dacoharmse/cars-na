'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Calendar,
  Car,
  Gavel,
  Layers,
  Gauge,
  Tag,
  ArrowRight,
  Megaphone,
  MapPin,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string | null;
  venue?: string | null;
  category?: string | null;
  isFeatured: boolean;
}

interface EventsDropdownProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

const CATEGORY_LINKS = [
  { href: '/events', label: 'All Events', icon: Calendar },
  { href: '/events?cat=Car+Show', label: 'Car Shows', icon: Car },
  { href: '/events?cat=Auction', label: 'Auctions', icon: Gavel },
  { href: '/events?cat=Expo', label: 'Expos', icon: Layers },
  { href: '/events?cat=Track+Day', label: 'Track Days', icon: Gauge },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Car Show': 'bg-blue-100 text-blue-700',
  'Auction': 'bg-amber-100 text-amber-700',
  'Expo': 'bg-emerald-100 text-emerald-700',
  'Track Day': 'bg-purple-100 text-purple-700',
  'Other': 'bg-slate-100 text-slate-600',
};

function monthLabel(d: Date) {
  return d.toLocaleString('en', { month: 'short' }).toUpperCase();
}

function dayNum(d: Date) {
  return d.getDate();
}

export default function EventsDropdown({ isMobile = false, onNavigate }: EventsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  const fetchEvents = useCallback(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch('/api/events?limit=4')
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  // Prefetch on mount so menu opens instantly
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 120);
  };

  const close = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  /* ── Mobile ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="w-full flex items-center justify-between text-base font-semibold text-slate-700 dark:text-slate-100 hover:text-primary transition-colors px-2 py-1"
        >
          <span>Events</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="mt-1 pl-3 space-y-0.5">
            {CATEGORY_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-primary py-2 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={close}
              >
                <Icon className="w-4 h-4 opacity-60" />
                {label}
              </Link>
            ))}
            <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-700">
              <Link
                href="/events/advertise"
                className="flex items-center gap-2.5 text-sm font-semibold text-primary py-2 px-2 rounded-md hover:bg-primary/5 transition-colors"
                onClick={close}
              >
                <Megaphone className="w-4 h-4" />
                Advertise Your Event
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Desktop ─────────────────────────────────────────── */
  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <button
        className="relative text-sm font-semibold text-slate-700 dark:text-slate-100 hover:text-[#1F3469] dark:hover:text-white transition-colors py-2 flex items-center space-x-1 group"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Events</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        <span className="absolute bottom-0 left-0 h-0.5 bg-[#1F3469] dark:bg-white transition-all duration-200 w-0 group-hover:w-full" />
      </button>

      {/* Mega menu panel */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 z-[70]"
          style={{ left: '50%', transform: 'translateX(-45%)' }}
        >
          {/* Arrow */}
          <div className="flex justify-center" style={{ marginLeft: '10%' }}>
            <div className="w-3 h-3 bg-white border-l border-t border-neutral-200 rotate-45 -mb-1.5 shadow-[-2px_-2px_4px_0px_rgba(0,0,0,0.04)]" />
          </div>

          <div className="w-[660px] bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden">
            {/* Accent bar */}
            <div className="h-[3px] bg-gradient-to-r from-[#1F3469] via-[#CB2030] to-[#1F3469]" />

            <div className="flex">
              {/* ── Left: Categories ── */}
              <div className="w-[200px] flex-shrink-0 bg-slate-50/80 border-r border-slate-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2.5 px-2">
                  Browse
                </p>
                <nav className="space-y-0.5">
                  {CATEGORY_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white hover:text-[#1F3469] hover:shadow-sm transition-all group/link"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-slate-400 group-hover/link:text-[#1F3469] transition-colors flex-shrink-0" />
                      <span className="flex-1">{label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 text-[#1F3469] transition-opacity" />
                    </Link>
                  ))}
                </nav>

                {/* Advertise CTA */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <Link
                    href="/events/advertise"
                    className="flex items-center gap-2 w-full px-2.5 py-2.5 rounded-lg bg-[#CB2030]/10 hover:bg-[#CB2030]/15 text-[#CB2030] text-sm font-semibold transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Megaphone className="w-4 h-4 flex-shrink-0" />
                    <span>Advertise Event</span>
                  </Link>
                </div>
              </div>

              {/* ── Right: Upcoming events ── */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Upcoming Events
                  </p>
                  <Link
                    href="/events"
                    className="flex items-center gap-1 text-xs font-semibold text-[#1F3469] hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Calendar className="w-9 h-9 mb-2 opacity-30" />
                    <p className="text-sm font-medium">No upcoming events</p>
                    <Link
                      href="/events/advertise"
                      className="mt-3 text-xs text-[#CB2030] font-semibold hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      List your event →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {events.map(event => {
                      const d = new Date(event.date);
                      const catColor = CATEGORY_COLORS[event.category ?? ''] ?? CATEGORY_COLORS['Other'];
                      return (
                        <Link
                          key={event.id}
                          href="/events"
                          className="flex gap-3 p-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group/card"
                          onClick={() => setIsOpen(false)}
                        >
                          {/* Date badge */}
                          <div className="flex-shrink-0 w-11 text-center">
                            <div className="bg-[#1F3469] text-white text-[9px] font-bold uppercase rounded-t-md leading-tight py-0.5 tracking-wider">
                              {monthLabel(d)}
                            </div>
                            <div className="bg-slate-100 text-slate-800 text-xl font-bold leading-tight rounded-b-md py-0.5 tabular-nums">
                              {dayNum(d)}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800 group-hover/card:text-[#1F3469] truncate leading-snug transition-colors">
                              {event.title}
                            </p>
                            {event.category && (
                              <span
                                className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${catColor}`}
                              >
                                {event.category}
                              </span>
                            )}
                            {(event.venue ?? event.location) && (
                              <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {event.venue ?? event.location}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
