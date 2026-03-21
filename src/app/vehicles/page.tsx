'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { VehicleCard } from '@/components/ui/VehicleCard';
import { api } from '@/lib/api';
import {
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  LayoutGrid, List, Car,
} from 'lucide-react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

/* ─── Shared styles ─────────────────────────────────────── */
const inputCls =
  'w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white ' +
  'focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 transition-colors';

const selectCls =
  'w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white ' +
  'focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 ' +
  'transition-colors appearance-none cursor-pointer ' +
  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_10px_center] pr-8';

/* ─── Skeleton card ─────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-3" />
    </div>
  </div>
);

/* ─── Checkbox ──────────────────────────────────────────── */
function FilterCheckbox({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? 'bg-[#CB2030] border-[#CB2030]' : 'border-gray-300 group-hover:border-gray-400'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

/* ─── Toggle pill group ─────────────────────────────────── */
function PillGroup({
  options, value, onChange,
}: { options: { v: string; l: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ v, l }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`h-8 px-3 text-xs font-medium rounded-lg border transition-colors ${
            value === v
              ? 'bg-[#CB2030] border-[#CB2030] text-white'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ─── Filter panel content ──────────────────────────────── */
interface FilterState {
  make: string;
  priceMin: string;
  priceMax: string;
  year: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  featured: boolean;
  dealerPick: boolean;
  hasDiscount: boolean;
  isNew: boolean | undefined;
}

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string | boolean | undefined) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  resetPagination: () => void;
}

function FilterPanel({
  searchQuery, setSearchQuery, filters, setFilter,
  activeFilterCount, clearFilters, resetPagination,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">

      {/* Search */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Make, model, keyword…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); resetPagination(); }}
            className={`${inputCls} pl-9`}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); resetPagination(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Make */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Make
        </label>
        <select
          value={filters.make}
          onChange={(e) => setFilter('make', e.target.value)}
          className={selectCls}
        >
          <option value="">All Makes</option>
          {[
            'Toyota', 'Volkswagen', 'Ford', 'BMW', 'Mercedes-Benz',
            'Nissan', 'Mazda', 'Hyundai', 'Kia', 'Honda',
            'Isuzu', 'Mitsubishi', 'Land Rover', 'Audi',
          ].map((m) => (
            <option key={m} value={m.toLowerCase()}>{m}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Price (N$)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilter('priceMin', e.target.value)}
            className={inputCls}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilter('priceMax', e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Year */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Year
        </label>
        <select
          value={filters.year}
          onChange={(e) => setFilter('year', e.target.value)}
          className={selectCls}
        >
          <option value="">Any Year</option>
          {Array.from({ length: 20 }, (_, i) => 2025 - i).map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      {/* Max Mileage */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Max Mileage
        </label>
        <select
          value={filters.mileage}
          onChange={(e) => setFilter('mileage', e.target.value)}
          className={selectCls}
        >
          <option value="">Any Mileage</option>
          <option value="10000">Under 10 000 km</option>
          <option value="30000">Under 30 000 km</option>
          <option value="60000">Under 60 000 km</option>
          <option value="100000">Under 100 000 km</option>
          <option value="150000">Under 150 000 km</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Transmission
        </label>
        <PillGroup
          options={[
            { v: '', l: 'Any' },
            { v: 'automatic', l: 'Automatic' },
            { v: 'manual', l: 'Manual' },
          ]}
          value={filters.transmission}
          onChange={(v) => setFilter('transmission', v)}
        />
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
          Fuel Type
        </label>
        <PillGroup
          options={[
            { v: '', l: 'Any' },
            { v: 'petrol', l: 'Petrol' },
            { v: 'diesel', l: 'Diesel' },
            { v: 'hybrid', l: 'Hybrid' },
            { v: 'electric', l: 'Electric' },
          ]}
          value={filters.fuelType}
          onChange={(v) => setFilter('fuelType', v)}
        />
      </div>

      {/* Condition / Special */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
          Extras
        </label>
        <div className="space-y-2.5">
          <FilterCheckbox
            label="New Vehicles"
            checked={filters.isNew === true}
            onChange={(v) => setFilter('isNew', v ? true : undefined)}
          />
          <FilterCheckbox
            label="On Sale / Discounted"
            checked={filters.hasDiscount}
            onChange={(v) => setFilter('hasDiscount', v)}
          />
          <FilterCheckbox
            label="Featured Listings"
            checked={filters.featured}
            onChange={(v) => setFilter('featured', v)}
          />
        </div>
      </div>

      {/* Clear all */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full h-9 text-sm font-semibold text-[#CB2030] border border-[#CB2030]/30 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

/* ─── Main page content ─────────────────────────────────── */
function VehiclesContent() {
  const searchParams = useSearchParams();
  const searchParam   = searchParams.get('search');
  const makeParam     = searchParams.get('make');
  const locationParam = searchParams.get('location');
  const featuredParam    = searchParams.get('featured');
  const dealerPickParam  = searchParams.get('dealerPick');
  const hasDiscountParam = searchParams.get('hasDiscount');
  const isNewParam       = searchParams.get('isNew');
  const sortByParam      = searchParams.get('sortBy');

  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [showFilters, setShowFilters]  = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    make:        makeParam || '',
    priceMin:    '',
    priceMax:    '',
    year:        '',
    mileage:     '',
    transmission: '',
    fuelType:    '',
    featured:    featuredParam === 'true',
    dealerPick:  dealerPickParam === 'true',
    hasDiscount: hasDiscountParam === 'true',
    isNew:       isNewParam ? isNewParam === 'true' : undefined,
  });
  const [sortBy,    setSortBy]    = useState(sortByParam || 'newest');
  const [viewMode,  setViewMode]  = useState<'grid' | 'list'>('grid');
  const [cursorStack, setCursorStack] = useState<(string | null | undefined)[]>([undefined]);
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 20;

  const { data: vehicleData, isLoading, error, refetch } = api.vehicle.getAll.useQuery({
    limit: PAGE_SIZE,
    cursor: cursorStack[pageIndex] ?? undefined,
    filters: {
      make:         filters.make        || undefined,
      minPrice:     filters.priceMin    ? parseInt(filters.priceMin)  : undefined,
      maxPrice:     filters.priceMax    ? parseInt(filters.priceMax)  : undefined,
      minYear:      filters.year        ? parseInt(filters.year)      : undefined,
      maxYear:      filters.year        ? parseInt(filters.year)      : undefined,
      maxMileage:   filters.mileage     ? parseInt(filters.mileage)   : undefined,
      transmission: filters.transmission || undefined,
      fuelType:     filters.fuelType    || undefined,
      search:       searchQuery         || undefined,
      location:     locationParam       || undefined,
      featured:     filters.featured    || undefined,
      dealerPick:   filters.dealerPick  || undefined,
      hasDiscount:  filters.hasDiscount || undefined,
      isNew:        filters.isNew,
      sortBy:       sortBy              || undefined,
    },
  });

  const vehicles = vehicleData?.items || [];

  const resetPagination = () => {
    setCursorStack([undefined]);
    setPageIndex(0);
  };

  const setFilter = (key: keyof FilterState, value: string | boolean | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const clearFilters = () => {
    setFilters({
      make: '', priceMin: '', priceMax: '', year: '', mileage: '',
      transmission: '', fuelType: '', featured: false, dealerPick: false,
      hasDiscount: false, isNew: undefined,
    });
    setSearchQuery('');
    setSortBy('newest');
    resetPagination();
  };

  const handleNextPage = () => {
    if (!vehicleData?.nextCursor) return;
    const newStack = [...cursorStack.slice(0, pageIndex + 1), vehicleData.nextCursor];
    setCursorStack(newStack);
    setPageIndex(pageIndex + 1);
  };

  const handlePrevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex(pageIndex - 1);
  };

  const currentPage  = pageIndex + 1;
  const hasNextPage  = !!vehicleData?.nextCursor;
  const hasPrevPage  = pageIndex > 0;

  const activeFilterCount = [
    filters.make, filters.priceMin, filters.priceMax, filters.year,
    filters.mileage, filters.transmission, filters.fuelType,
    filters.featured || undefined, filters.dealerPick || undefined,
    filters.hasDiscount || undefined, filters.isNew,
  ].filter((v) => v !== '' && v !== false && v !== undefined).length + (searchQuery ? 1 : 0);

  const filterPanelProps: FilterPanelProps = {
    searchQuery, setSearchQuery, filters, setFilter,
    activeFilterCount, clearFilters, resetPagination,
  };

  if (error) {
    return (
      <MainLayout>
        <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Car className="w-7 h-7 text-[#CB2030]" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Failed to load vehicles</h1>
            <p className="text-sm text-gray-500 mb-6">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="h-10 px-6 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ── Page header ── */}
          <div className="mb-6">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
              <a href="/" className="hover:text-gray-600 transition-colors">Home</a>
              <span>/</span>
              <span className="text-gray-700 font-medium">Vehicles</span>
            </nav>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Browse Vehicles</h1>
                {!isLoading && vehicles.length > 0 && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-6">

            {/* ── Desktop sidebar ── */}
            <aside className="hidden lg:block w-56 xl:w-60 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-[102px]">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900">
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold bg-[#CB2030] text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <FilterPanel {...filterPanelProps} />
              </div>

            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-5">
                {/* Mobile: filters toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden relative flex items-center gap-2 h-10 px-3.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-[#CB2030] text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Result count */}
                <span className="flex-1 text-sm text-gray-500">
                  {isLoading ? 'Loading…' : `${vehicles.length} result${vehicles.length !== 1 ? 's' : ''}`}
                </span>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); resetPagination(); }}
                  className="h-10 pl-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#CB2030] transition-colors cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="mileage">Lowest Mileage</option>
                  <option value="year">Newest Year</option>
                </select>

                {/* Grid / List toggle */}
                <div className="hidden sm:flex bg-white border border-gray-200 rounded-lg overflow-hidden divide-x divide-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    className={`p-2.5 transition-colors ${
                      viewMode === 'grid' ? 'bg-[#CB2030] text-white' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    className={`p-2.5 transition-colors ${
                      viewMode === 'list' ? 'bg-[#CB2030] text-white' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile filter panel */}
              {showFilters && (
                <div className="lg:hidden bg-white border border-gray-200 rounded-xl p-5 mb-5">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900">
                      Filters
                    </span>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <FilterPanel {...filterPanelProps} />
                </div>
              )}

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 bg-gray-900 text-white text-xs font-medium rounded-full">
                      &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => { setSearchQuery(''); resetPagination(); }} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.make && (
                    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 bg-gray-900 text-white text-xs font-medium rounded-full capitalize">
                      {filters.make}
                      <button onClick={() => setFilter('make', '')} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.transmission && (
                    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 bg-gray-900 text-white text-xs font-medium rounded-full capitalize">
                      {filters.transmission}
                      <button onClick={() => setFilter('transmission', '')} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.fuelType && (
                    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 bg-gray-900 text-white text-xs font-medium rounded-full capitalize">
                      {filters.fuelType}
                      <button onClick={() => setFilter('fuelType', '')} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.isNew === true && (
                    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 bg-blue-600 text-white text-xs font-medium rounded-full">
                      New Only
                      <button onClick={() => setFilter('isNew', undefined)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.hasDiscount && (
                    <span className="inline-flex items-center gap-1.5 h-7 pl-3 pr-2 bg-green-600 text-white text-xs font-medium rounded-full">
                      On Sale
                      <button onClick={() => setFilter('hasDiscount', false)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="h-7 px-3 text-xs font-medium text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* ── Top leaderboard banner ── */}
              <div className="mb-5 rounded-xl overflow-hidden border border-gray-200 relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">
                    Advertisement
                  </span>
                </div>
                <div className="h-[90px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center px-6 gap-6 relative overflow-hidden">
                  {/* Decorative grid */}
                  <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
                  />
                  {/* Red left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CB2030]" />
                  {/* Logo block */}
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-[#CB2030] flex items-center justify-center">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  {/* Copy */}
                  <div className="relative flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">MFC by FirstRand Bank</p>
                    <h3 className="text-white font-extrabold text-base leading-tight">
                      Finance your next vehicle in minutes
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5 hidden sm:block">
                      Competitive rates · Fast approval · Flexible terms up to 72 months
                    </p>
                  </div>
                  {/* CTA */}
                  <a
                    href="#"
                    className="relative flex-shrink-0 h-9 px-5 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-xs font-bold rounded-lg flex items-center transition-colors whitespace-nowrap"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>

              {/* ── Loading skeleton ── */}
              {isLoading && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4'
                    : 'space-y-4'
                }>
                  {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* ── Empty state ── */}
              {!isLoading && vehicles.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">No vehicles found</h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                    Try adjusting your filters or broadening your search terms.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="h-10 px-6 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* ── Vehicle grid ── */}
              {!isLoading && vehicles.length > 0 && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4'
                    : 'space-y-4'
                }>
                  {vehicles.map((vehicle: any) => (
                    <VehicleCard
                      key={vehicle.id}
                      id={vehicle.id}
                      make={vehicle.make}
                      model={vehicle.model}
                      year={vehicle.year}
                      price={vehicle.price}
                      mileage={vehicle.mileage}
                      transmission={vehicle.transmission}
                      fuelType={vehicle.fuelType}
                      color={vehicle.color}
                      image={vehicle.images?.[0]?.url || 'https://placehold.co/800x600/e5e7eb/6b7280?text=Car+Image'}
                      dealer={vehicle.dealership?.name || 'Unknown Dealer'}
                      location={vehicle.dealership?.city || 'Unknown Location'}
                      isNew={vehicle.isNew}
                    />
                  ))}
                </div>
              )}

              {/* ── Pagination ── */}
              {!isLoading && (hasPrevPage || hasNextPage) && (
                <div className="flex items-center justify-center mt-10 gap-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                    className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-sm text-gray-400 px-2">Page {currentPage}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="flex items-center gap-1.5 h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* ── Right ad column ── */}
            <aside className="hidden xl:flex flex-col gap-4 w-[168px] flex-shrink-0">

              {/* Sticky wrapper */}
              <div className="sticky top-[102px] flex flex-col gap-4">

                {/* Ad 1 — Insurance (tall) */}
                <div className="rounded-xl overflow-hidden border border-gray-200 relative">
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">
                      Ad
                    </span>
                  </div>
                  <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-4 pt-8 flex flex-col items-center text-center gap-3 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.04]"
                      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '18px 18px' }}
                    />
                    <div className="relative w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="relative">
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">Momentum Insurance</p>
                      <h4 className="text-white font-extrabold text-sm leading-tight">
                        Protect your vehicle from day one
                      </h4>
                      <p className="text-gray-400 text-[11px] mt-2 leading-relaxed">
                        Comprehensive cover starting from N$ 299/month
                      </p>
                    </div>
                    <a
                      href="#"
                      className="relative w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center transition-colors"
                    >
                      Get a Quote
                    </a>
                  </div>
                </div>

                {/* Ad 2 — Dealer signup (shorter) */}
                <div className="rounded-xl overflow-hidden border border-[#CB2030]/30 relative">
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">
                      Ad
                    </span>
                  </div>
                  <div className="bg-red-50 p-4 pt-8 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#CB2030] flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#CB2030] uppercase tracking-widest font-bold mb-1">Cars.na Dealers</p>
                      <h4 className="text-gray-900 font-extrabold text-sm leading-tight">
                        List your stock on Cars.na
                      </h4>
                      <p className="text-gray-500 text-[11px] mt-2 leading-relaxed">
                        Reach thousands of buyers across Namibia
                      </p>
                    </div>
                    <a
                      href="/dealers/register"
                      className="w-full h-8 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-[11px] font-bold rounded-lg flex items-center justify-center transition-colors"
                    >
                      Register Now
                    </a>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

/* ─── Page wrapper ──────────────────────────────────────── */
export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#CB2030]/30 border-t-[#CB2030] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading vehicles…</p>
          </div>
        </div>
      }
    >
      <VehiclesContent />
    </Suspense>
  );
}
