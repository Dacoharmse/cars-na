"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Search, X, Car, MapPin, DollarSign, Calendar, Fuel, Settings } from "lucide-react";
import clsx from "clsx";

interface Props {
  open: boolean;
  onClose: () => void;
}

const carBrands = [
  "BMW", "Mercedes-Benz", "Audi", "Toyota", "Ford", "Volkswagen", 
  "Nissan", "Honda", "Hyundai", "Kia", "Mazda", "Subaru", "Jeep", "Chevrolet"
];

const priceRanges = [
  "Under N$ 100,000",
  "N$ 100,000 - N$ 300,000", 
  "N$ 300,000 - N$ 500,000",
  "N$ 500,000 - N$ 1,000,000",
  "Over N$ 1,000,000"
];

const yearRanges = [
  "2020 - 2024",
  "2015 - 2019", 
  "2010 - 2014",
  "2005 - 2009",
  "Before 2005"
];

const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

const locations = ["Windhoek", "Swakopmund", "Walvis Bay", "Oshakati", "Rundu", "Katima Mulilo"];

export default function CarFilterSearch({ open, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedYearRange, setSelectedYearRange] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = () => {
    // Build search URL with filters
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedPriceRange) params.set('price', selectedPriceRange);
    if (selectedYearRange) params.set('year', selectedYearRange);
    if (selectedFuelType) params.set('fuel', selectedFuelType);
    if (selectedLocation) params.set('location', selectedLocation);
    
    const searchUrl = `/vehicles${params.toString() ? '?' + params.toString() : ''}`;
    window.location.href = searchUrl;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedPriceRange("");
    setSelectedYearRange("");
    setSelectedFuelType("");
    setSelectedLocation("");
  };

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={onClose}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-start justify-center pt-16">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl mx-4 rounded-xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Car className="w-6 h-6 text-[#1F3469] dark:text-white" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Find Your Perfect Car
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Input */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                    placeholder="Search by make, model, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Car className="w-4 h-4" />
                      Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                    >
                      <option value="">All Brands</option>
                      {carBrands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Price Range
                    </label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                    >
                      <option value="">Any Price</option>
                      {priceRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Range Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      Year
                    </label>
                    <select
                      value={selectedYearRange}
                      onChange={(e) => setSelectedYearRange(e.target.value)}
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                    >
                      <option value="">Any Year</option>
                      {yearRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Fuel className="w-4 h-4" />
                      Fuel Type
                    </label>
                    <select
                      value={selectedFuelType}
                      onChange={(e) => setSelectedFuelType(e.target.value)}
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                    >
                      <option value="">Any Fuel Type</option>
                      {fuelTypes.map((fuel) => (
                        <option key={fuel} value={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Clear Filters
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-[#1F3469] hover:bg-[#1F3469]/90 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:ring-offset-2"
                  >
                    Search Cars
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
