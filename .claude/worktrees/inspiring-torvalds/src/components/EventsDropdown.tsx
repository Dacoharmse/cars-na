'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface EventsDropdownProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export default function EventsDropdown({ isMobile = false, onNavigate }: EventsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const links = [
    { href: '/events', label: 'All Events' },
    { href: '/events/car-shows', label: 'Car Shows' },
    { href: '/events/auctions', label: 'Auctions' },
  ];

  if (isMobile) {
    return (
      <div className="border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-base font-semibold text-slate-700 dark:text-slate-100 hover:text-primary transition-colors px-2 py-1"
        >
          <span>Events</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="mt-2 pl-4 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary py-1 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        className="relative text-sm font-semibold text-slate-700 dark:text-slate-100 hover:text-[#1F3469] dark:hover:text-white transition-colors py-2 flex items-center space-x-1"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Events</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1F3469] dark:bg-white group-hover:w-full transition-all duration-200"></span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 z-[70]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2 text-sm text-neutral-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
