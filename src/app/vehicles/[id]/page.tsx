'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Phone,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle,
  User,
  Send,
  Shield,
  Calculator,
  Facebook,
  MessageCircle,
  Globe,
  Palette,
  Layers,
  ZoomIn,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [financeForm, setFinanceForm] = useState({
    loanAmount: 0,
    downPayment: 0,
    loanTerm: 60,
    selectedBank: 'fnb',
    vehicleAge: 'new',
  });
  const [showFinanceCalculator, setShowFinanceCalculator] = useState(false);
  const [similarCarsFilter, setSimilarCarsFilter] = useState('All');

  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!vehicleId) return;
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to fetch vehicle');
        setVehicle(data.vehicle);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching vehicle:', err);
        setError({ message: err.message });
        setVehicle(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  useEffect(() => {
    if (vehicle?.price) {
      setFinanceForm(prev => ({
        ...prev,
        loanAmount: vehicle.price * 0.9,
        downPayment: vehicle.price * 0.1,
        vehicleAge: vehicle.year >= 2022 ? 'new' : 'used',
      }));
    }
  }, [vehicle?.price, vehicle?.year]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <MainLayout>
        <div className="bg-slate-50 min-h-screen">
          <div className="h-10 bg-white border-b" />
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="animate-pulse rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="h-40 bg-slate-200" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-80 bg-slate-200 rounded-2xl" />
                <div className="h-40 bg-slate-200 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-slate-200 rounded-2xl" />
                <div className="h-48 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <MainLayout>
        <div className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-[#CB2030]" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Vehicle</h1>
            <p className="text-slate-500 mb-6">{error.message}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-[#CB2030] text-white text-sm font-medium rounded-lg hover:bg-[#b01c28] transition-colors cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isLoading && !vehicle) {
    return (
      <MainLayout>
        <div className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-slate-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Vehicle Not Found</h1>
            <p className="text-slate-500 mb-6">This listing may have been removed or doesn't exist.</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-[#CB2030] text-white text-sm font-medium rounded-lg hover:bg-[#b01c28] transition-colors cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const images = vehicle.images?.length > 0
    ? vehicle.images
    : [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80', isPrimary: true }];

  const nextImage = () => setCurrentImageIndex(p => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(p => (p - 1 + images.length) % images.length);

  const formatPrice = (price: number) =>
    'N$ ' + new Intl.NumberFormat('en-NA', { minimumFractionDigits: 0 }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('en-NA').format(mileage);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          customerName: contactForm.name,
          customerEmail: contactForm.email,
          customerPhone: contactForm.phone,
          message: contactForm.message,
          source: 'CONTACT_FORM',
        }),
      });
      if (response.ok) {
        setFormSuccess(true);
        setContactForm({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error('Failed to submit inquiry');
      }
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${formatPrice(vehicle.price)}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const message = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for ${formatPrice(vehicle.price)} on Cars.na! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const showOnGoogleMaps = () => {
    if (vehicle.dealership?.address) {
      const address = `${vehicle.dealership.address}, ${vehicle.dealership.city}, ${vehicle.dealership.state}, Namibia`;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const scrollToContactForm = () => {
    document.getElementById('contact-dealer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Finance ──────────────────────────────────────────────────────────────
  const namibianBanks = {
    fnb: { name: 'FNB Namibia', rates: { new: { min: 11.5, max: 15.5 }, used: { min: 13.5, max: 18.5 } }, maxTerm: 84, minDownPayment: 10 },
    standardBank: { name: 'Standard Bank Namibia', rates: { new: { min: 11.75, max: 16.0 }, used: { min: 14.0, max: 19.0 } }, maxTerm: 84, minDownPayment: 10 },
    bankWindhoek: { name: 'Bank Windhoek', rates: { new: { min: 12.0, max: 16.5 }, used: { min: 14.5, max: 19.5 } }, maxTerm: 72, minDownPayment: 15 },
    nedbank: { name: 'Nedbank Namibia', rates: { new: { min: 11.25, max: 15.75 }, used: { min: 13.75, max: 18.75 } }, maxTerm: 84, minDownPayment: 10 },
  };

  const calculateMonthlyPayment = (principal: number, rate: number, term: number) => {
    const r = rate / 100 / 12;
    return (principal * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
  };

  const getFinanceCalculations = () => {
    const bank = namibianBanks[financeForm.selectedBank as keyof typeof namibianBanks];
    const vehicleAge = vehicle.year >= 2022 ? 'new' : 'used';
    const loanAmount = financeForm.loanAmount || (vehicle.price - financeForm.downPayment);
    const { min: minRate, max: maxRate } = bank.rates[vehicleAge];
    const avgRate = (minRate + maxRate) / 2;
    const minPayment = calculateMonthlyPayment(loanAmount, minRate, financeForm.loanTerm);
    const maxPayment = calculateMonthlyPayment(loanAmount, maxRate, financeForm.loanTerm);
    const avgPayment = calculateMonthlyPayment(loanAmount, avgRate, financeForm.loanTerm);
    return {
      loanAmount,
      minPayment, maxPayment, avgPayment,
      minRate, maxRate,
      totalInterestMin: (minPayment * financeForm.loanTerm) - loanAmount,
      totalInterestMax: (maxPayment * financeForm.loanTerm) - loanAmount,
      bank,
    };
  };

  // ── Similar Cars ─────────────────────────────────────────────────────────
  const similarCars = [
    { id: '2', year: 2020, make: 'Toyota', model: 'Fortuner 2.4', price: 495000, mileage: 45000, engine: '2.4L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '3', year: 2021, make: 'Toyota', model: 'Fortuner 2.4', price: 499000, mileage: 32000, engine: '2.4L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '4', year: 2019, make: 'Toyota', model: 'Hilux 2.8', price: 399900, mileage: 67000, engine: '2.8L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '5', year: 2016, make: 'Toyota', model: 'Prado 3.0 TD', price: 499500, mileage: 89000, engine: '3.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '6', year: 2024, make: 'Toyota', model: 'Corolla Cross', price: 499995, mileage: 5000, engine: '1.8L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '7', year: 2019, make: 'Mercedes-Benz', model: 'GLA 200', price: 480000, mileage: 55000, engine: '2.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
  ];

  const getFilteredSimilarCars = () => {
    const filtered = [...similarCars];
    switch (similarCarsFilter) {
      case 'Year': filtered.sort((a, b) => b.year - a.year); break;
      case 'Engine': filtered.sort((a, b) => parseFloat(a.engine) - parseFloat(b.engine)); break;
      case 'Mileage': filtered.sort((a, b) => a.mileage - b.mileage); break;
      case 'Price': filtered.sort((a, b) => a.price - b.price); break;
    }
    return filtered.slice(0, 6);
  };

  const inputCls = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030]/50 transition-colors";

  // ── Key specs for the spec strip ─────────────────────────────────────────
  const specs = [
    { icon: Calendar, label: 'Year', value: vehicle.year, color: 'text-blue-500 bg-blue-50' },
    { icon: Gauge, label: 'Mileage', value: `${formatMileage(vehicle.mileage)} km`, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission, color: 'text-purple-500 bg-purple-50' },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType, color: 'text-amber-500 bg-amber-50' },
    { icon: Palette, label: 'Color', value: vehicle.color, color: 'text-pink-500 bg-pink-50' },
    { icon: Layers, label: 'Body Type', value: vehicle.bodyType, color: 'text-slate-500 bg-slate-100' },
  ].filter(s => s.value);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <a href="/" className="hover:text-[#CB2030] transition-colors">Home</a>
              <span>/</span>
              <a href="/vehicles" className="hover:text-[#CB2030] transition-colors">Used Cars</a>
              <span>/</span>
              <span className="text-slate-900 font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">

          {/* ── Hero Card ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            {/* Title + Price bar */}
            <div className="relative bg-gradient-to-r from-slate-900 via-[#1a1a2e] to-[#16213e] px-6 py-6">
              {/* Status badge */}
              <span className={`absolute top-4 right-6 px-2.5 py-1 rounded-full text-xs font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'}`}>
                {vehicle.status}
              </span>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pr-24 lg:pr-0">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />{formatMileage(vehicle.mileage)} km</span>
                    <span className="flex items-center gap-1.5"><Settings className="h-3.5 w-3.5" />{vehicle.transmission}</span>
                    <span className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" />{vehicle.fuelType}</span>
                    {vehicle.dealership?.city && (
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{vehicle.dealership.city}</span>
                    )}
                  </div>
                </div>
                <div className="lg:text-right">
                  <div className="text-4xl lg:text-5xl font-black text-[#CB2030] leading-none mb-1">
                    {formatPrice(vehicle.price)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">Ref: {vehicle.id.slice(0, 12).toUpperCase()}</div>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />Viewed 47 times this week</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Listed {new Date(vehicle.createdAt).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollToContactForm}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#CB2030] hover:bg-[#b01c28] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Enquire
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${isSaved ? 'bg-red-50 border-red-200 text-[#CB2030]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#CB2030]' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Grid ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left Column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Image Gallery */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Main image */}
                <div className="relative bg-slate-100" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={images[currentImageIndex]?.url || ''}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                    {currentImageIndex + 1} / {images.length}
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((image: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            index === currentImageIndex
                              ? 'border-[#CB2030] ring-1 ring-[#CB2030]/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img src={image.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Key Specs Strip */}
              {specs.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Key Specifications</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specs.map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs text-slate-400 font-medium">{label}</div>
                          <div className="text-sm font-semibold text-slate-900 truncate">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Vehicle Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  {/* Left col */}
                  <div className="space-y-0 sm:pr-6">
                    {[
                      { label: 'Year', value: vehicle.year },
                      { label: 'Make', value: vehicle.make },
                      { label: 'Model', value: vehicle.model },
                      { label: 'Mileage', value: `${formatMileage(vehicle.mileage)} km` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-500">{label}</span>
                        <span className="text-sm font-semibold text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Right col */}
                  <div className="space-y-0 sm:pl-6">
                    {[
                      { label: 'Transmission', value: vehicle.transmission },
                      { label: 'Fuel Type', value: vehicle.fuelType },
                      { label: 'Color', value: vehicle.color },
                      { label: 'Body Type', value: vehicle.bodyType },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-500">{label}</span>
                        <span className="text-sm font-semibold text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 mb-3">Description</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{vehicle.description}</p>
                  </div>
                )}

                {/* Social Sharing */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Share this vehicle</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={shareOnFacebook}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </button>
                    <button
                      onClick={shareOnWhatsApp}
                      className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Dealer Form */}
              <div id="contact-dealer-form" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Send an Enquiry</h3>
                <p className="text-sm text-slate-500 mb-5">Interested in this vehicle? Send a message directly to the dealer.</p>

                {formSuccess ? (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-emerald-800">Enquiry sent successfully!</div>
                      <div className="text-sm text-emerald-700 mt-0.5">The dealer will contact you shortly.</div>
                      <button
                        onClick={() => setFormSuccess(false)}
                        className="text-xs text-emerald-600 hover:text-emerald-800 mt-2 underline cursor-pointer"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {formError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        {formError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-[#CB2030]">*</span></label>
                        <input type="text" required placeholder="Your full name" className={inputCls} value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-[#CB2030]">*</span></label>
                        <input type="email" required placeholder="you@example.com" className={inputCls} value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-[#CB2030]">*</span></label>
                      <input type="tel" required placeholder="+264 81 000 0000" className={inputCls} value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        placeholder={`I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Please contact me with more details.`}
                        className={inputCls}
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#CB2030] hover:bg-[#b01c28] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Enquiry
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-400 text-center">
                      By submitting, you agree to be contacted by the dealer regarding this vehicle.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* ── Right Sidebar ────────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Dealer Information */}
              {vehicle.dealership && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Dealer header */}
                  <div className="bg-gradient-to-r from-slate-900 to-[#1a1a2e] px-5 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Authorized Dealer</div>
                      <div className="text-xs text-slate-400">Verified automotive dealer</div>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Dealership name */}
                    <div className="text-center pb-4 border-b border-slate-100">
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{vehicle.dealership.name}</h4>
                      {vehicle.dealership.description && (
                        <p className="text-sm text-slate-500">{vehicle.dealership.description}</p>
                      )}
                      <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-emerald-600">
                        <Shield className="h-3.5 w-3.5" />
                        <span className="font-medium">Verified Dealer</span>
                      </div>
                    </div>

                    {/* Address */}
                    {vehicle.dealership.address && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-2.5 mb-3">
                          <MapPin className="h-4 w-4 text-[#CB2030] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-slate-700">Showroom Address</div>
                            <div className="text-xs text-slate-500 mt-0.5">{vehicle.dealership.address}</div>
                            <div className="text-xs text-slate-500">{vehicle.dealership.city}, {vehicle.dealership.state}</div>
                          </div>
                        </div>
                        <button
                          onClick={showOnGoogleMaps}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-[#CB2030]/30 text-[#CB2030] text-xs font-medium rounded-lg hover:bg-[#CB2030]/5 transition-colors cursor-pointer"
                        >
                          <MapPin className="h-3 w-3" />
                          View on Google Maps
                        </button>
                      </div>
                    )}

                    {/* Sales Team */}
                    {vehicle.dealership?.users?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-3">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales Team</span>
                        </div>
                        <div className="space-y-3">
                          {vehicle.dealership.users.map((user: any, index: number) => {
                            const avatarColors = [
                              'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'
                            ];
                            const initials = user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
                            const roleDisplay = user.jobTitle || (user.role === 'DEALER_PRINCIPAL' ? 'Sales Manager' : 'Sales Executive');
                            const phoneNumber = user.whatsappNumber || user.phone || '';
                            const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');

                            return (
                              <div key={user.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-start gap-3">
                                  {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0" />
                                  ) : (
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                                      {initials}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                                    <div className="text-xs text-slate-500">
                                      {roleDisplay}
                                      {user.yearsExperience && ` • ${user.yearsExperience} yrs exp.`}
                                    </div>
                                    {user.bio && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{user.bio}</p>}
                                    {user.specialties && (
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {user.specialties.split(',').slice(0, 2).map((s: string, i: number) => (
                                          <span key={i} className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{s.trim()}</span>
                                        ))}
                                      </div>
                                    )}
                                    {user.languages && (
                                      <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                                        <Globe className="h-3 w-3" />
                                        {user.languages}
                                      </div>
                                    )}
                                    {phoneNumber && (
                                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                                        <Phone className="h-3 w-3 text-emerald-500" />
                                        {phoneNumber}
                                      </div>
                                    )}
                                  </div>
                                  {whatsappNumber && (
                                    <button
                                      onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`, '_blank')}
                                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                                    >
                                      <MessageCircle className="h-3.5 w-3.5" />
                                      Chat
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Inventory CTA */}
                    <button
                      onClick={() => router.push(`/vehicles?dealer=${vehicle.dealership?.name?.toLowerCase().replace(/\s+/g, '-') || 'dealership'}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#CB2030] hover:bg-[#b01c28] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Car className="h-4 w-4" />
                      View All Inventory
                    </button>
                    <p className="text-xs text-slate-400 text-center -mt-1">Trusted automotive dealer in Namibia</p>
                  </div>
                </div>
              )}

              {/* Finance Calculator */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setShowFinanceCalculator(!showFinanceCalculator)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#CB2030]/10 rounded-lg flex items-center justify-center">
                      <Calculator className="h-4 w-4 text-[#CB2030]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-900">Finance Calculator</div>
                      <div className="text-xs text-slate-400">Estimate monthly payments</div>
                    </div>
                  </div>
                  {showFinanceCalculator
                    ? <ChevronUp className="h-4 w-4 text-slate-400" />
                    : <ChevronDown className="h-4 w-4 text-slate-400" />
                  }
                </button>

                {showFinanceCalculator && (
                  <div className="px-5 pb-5 border-t border-slate-100 space-y-4 pt-4">
                    {/* Bank Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bank</label>
                      <select
                        value={financeForm.selectedBank}
                        onChange={e => setFinanceForm({ ...financeForm, selectedBank: e.target.value })}
                        className={inputCls}
                      >
                        {Object.entries(namibianBanks).map(([key, bank]) => (
                          <option key={key} value={key}>{bank.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Vehicle Price */}
                    <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500">Vehicle Price</span>
                      <span className="text-sm font-bold text-[#CB2030]">{formatPrice(vehicle.price)}</span>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Down Payment</label>
                      <input
                        type="number"
                        value={financeForm.downPayment}
                        onChange={e => setFinanceForm({ ...financeForm, downPayment: Number(e.target.value), loanAmount: vehicle.price - Number(e.target.value) })}
                        className={inputCls}
                        min={0}
                        max={vehicle.price * 0.5}
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Min: {formatPrice(vehicle.price * (namibianBanks[financeForm.selectedBank as keyof typeof namibianBanks].minDownPayment / 100))}
                      </p>
                    </div>

                    {/* Loan Term */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Loan Term</label>
                      <select
                        value={financeForm.loanTerm}
                        onChange={e => setFinanceForm({ ...financeForm, loanTerm: Number(e.target.value) })}
                        className={inputCls}
                      >
                        {[12, 24, 36, 48, 60, 72, 84].map(m => (
                          <option key={m} value={m}>{m} months ({m / 12} {m / 12 === 1 ? 'year' : 'years'})</option>
                        ))}
                      </select>
                    </div>

                    {/* Results */}
                    {(() => {
                      const calc = getFinanceCalculations();
                      return (
                        <div className="bg-slate-900 rounded-xl p-4 space-y-3">
                          <div className="text-center pb-3 border-b border-white/10">
                            <div className="text-xs text-slate-400 mb-1">Est. Monthly Payment</div>
                            <div className="text-2xl font-black text-white">{formatPrice(calc.avgPayment)}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Range: {formatPrice(calc.minPayment)} – {formatPrice(calc.maxPayment)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'Loan Amount', value: formatPrice(calc.loanAmount) },
                              { label: 'Rate', value: `${calc.minRate}–${calc.maxRate}%` },
                              { label: 'Total Interest', value: formatPrice(calc.totalInterestMin) },
                              { label: 'Total Cost', value: formatPrice(calc.loanAmount + calc.totalInterestMin) },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <div className="text-xs text-slate-500">{label}</div>
                                <div className="text-xs font-semibold text-white mt-0.5">{value}</div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 text-center pt-2 border-t border-white/10">
                            *Indicative rates, subject to bank approval
                          </p>
                        </div>
                      );
                    })()}

                    <button
                      onClick={scrollToContactForm}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#CB2030] hover:bg-[#b01c28] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply for Finance
                    </button>
                  </div>
                )}
              </div>

              {/* Similar Vehicles */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Similar Vehicles</h3>
                  {/* Filter pills */}
                  <div className="flex gap-1.5 flex-wrap">
                    {['All', 'Year', 'Engine', 'Mileage', 'Price'].map(f => (
                      <button
                        key={f}
                        onClick={() => setSimilarCarsFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          similarCarsFilter === f
                            ? 'bg-[#CB2030] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-5 space-y-2">
                  {getFilteredSimilarCars().map(car => (
                    <button
                      key={car.id}
                      onClick={() => router.push(`/vehicles/${car.id}`)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group text-left"
                    >
                      <div className="w-16 h-11 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-[#CB2030] transition-colors truncate">
                          {car.year} {car.make} {car.model}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{formatMileage(car.mileage)} km • {car.engine}</div>
                        <div className="text-xs font-bold text-[#CB2030] mt-0.5">{formatPrice(car.price)}</div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#CB2030] flex-shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={() => router.push('/vehicles')}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-[#CB2030]/40 hover:text-[#CB2030] text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    View All Similar Vehicles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={images[currentImageIndex]?.url}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-xs rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
