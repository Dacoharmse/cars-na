'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Dealership {
  id: string;
  name: string;
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
}

export default function DealersDropdown({ isMobile = false }: DealersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dealerGroups, setDealerGroups] = useState<TownGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch grouped dealerships
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
    // Close dropdown when clicking outside
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

  if (isMobile) {
    return (
      <div className="py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-neutral-900 hover:text-blue-600 transition-colors"
        >
          <span>Dealers</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="bg-neutral-50 py-2">
            <Link
              href="/dealers"
              className="block px-8 py-2 text-sm text-neutral-700 hover:text-blue-600 hover:bg-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              All Dealers
            </Link>

            {loading ? (
              <div className="px-8 py-2 text-sm text-neutral-500">Loading...</div>
            ) : (
              dealerGroups.map((group) => (
                <div key={group.town} className="py-1">
                  <div className="px-8 py-2 text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                    {group.town}
                  </div>
                  {group.dealerships.map((dealer) => (
                    <Link
                      key={dealer.id}
                      href={`/dealers/${dealer.id}`}
                      className="block px-10 py-2 text-sm text-neutral-600 hover:text-blue-600 hover:bg-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {dealer.name}
                    </Link>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div
      className="relative group"
      ref={dropdownRef}
    >
      <button
        className="relative text-sm font-semibold text-slate-700 dark:text-slate-100 hover:text-[#1F3469] dark:hover:text-white transition-colors py-2 flex items-center space-x-1"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Dealers</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1F3469] dark:bg-white group-hover:w-full transition-all duration-200"></span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 max-h-[80vh] overflow-y-auto z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link
            href="/dealers"
            className="block px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 border-b border-neutral-200 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            View All Dealers
          </Link>

          {loading ? (
            <div className="px-4 py-3 text-sm text-neutral-500">Loading dealerships...</div>
          ) : dealerGroups.length === 0 ? (
            <div className="px-4 py-3 text-sm text-neutral-500">No dealerships available</div>
          ) : (
            dealerGroups.map((group, index) => (
              <div key={group.town} className={index > 0 ? 'border-t border-neutral-200' : ''}>
                <div className="px-4 py-2 bg-neutral-50">
                  <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                    {group.town}
                  </h3>
                </div>
                <div className="py-1">
                  {group.dealerships.map((dealer) => (
                    <Link
                      key={dealer.id}
                      href={`/dealers/${dealer.id}`}
                      className="block px-6 py-2 text-sm text-neutral-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {dealer.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
