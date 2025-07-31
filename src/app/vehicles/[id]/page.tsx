'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Car, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle,
  User,
  Send,
  Star,
  Shield,
  Calculator,
  Facebook,
  MessageCircle
} from 'lucide-react';

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as string;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Finance Calculator State
  const [financeForm, setFinanceForm] = useState({
    loanAmount: 0,
    downPayment: 0,
    loanTerm: 60, // months
    selectedBank: 'fnb',
    vehicleAge: 'new'
  });
  const [showFinanceCalculator, setShowFinanceCalculator] = useState(false);
  const [similarCarsFilter, setSimilarCarsFilter] = useState('All');

  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch vehicle data using REST API
  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        
        if (!response.ok) {
          throw new Error('Vehicle not found');
        }
        
        const vehicleData = await response.json();
        setVehicle(vehicleData);
        
        // Initialize finance form when vehicle loads
        setFinanceForm(prev => ({
          ...prev,
          loanAmount: vehicleData.price * 0.9, // 90% financing
          downPayment: vehicleData.price * 0.1, // 10% down payment
          vehicleAge: vehicleData.year >= 2022 ? 'new' : 'used'
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : [{ url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80', isPrimary: true }];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your inquiry! We will contact you soon.');
  };

  // Social Sharing Functions
  const shareOnFacebook = () => {
    const url = window.location.href;
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${formatPrice(vehicle.price)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const message = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for ${formatPrice(vehicle.price)} on Cars.na! ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Google Maps Function
  const showOnGoogleMaps = () => {
    if (vehicle.dealership?.address) {
      const address = `${vehicle.dealership.address}, ${vehicle.dealership.city}, ${vehicle.dealership.state}, Namibia`;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  // Scroll to Contact Form Function
  const scrollToContactForm = () => {
    const contactForm = document.getElementById('contact-dealer-form');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatPrice = (price: number) => {
    return 'N$ ' + new Intl.NumberFormat('en-NA', {
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-NA').format(mileage);
  };

  // Namibian Banks Vehicle Finance Data
  const namibianBanks = {
    fnb: {
      name: 'FNB Namibia',
      rates: {
        new: { min: 11.5, max: 15.5 }, // New vehicles (0-2 years)
        used: { min: 13.5, max: 18.5 }, // Used vehicles (3+ years)
      },
      maxTerm: 84, // months
      minDownPayment: 10, // percentage
    },
    standardBank: {
      name: 'Standard Bank Namibia',
      rates: {
        new: { min: 11.75, max: 16.0 },
        used: { min: 14.0, max: 19.0 },
      },
      maxTerm: 84,
      minDownPayment: 10,
    },
    bankWindhoek: {
      name: 'Bank Windhoek',
      rates: {
        new: { min: 12.0, max: 16.5 },
        used: { min: 14.5, max: 19.5 },
      },
      maxTerm: 72,
      minDownPayment: 15,
    },
    nedbank: {
      name: 'Nedbank Namibia',
      rates: {
        new: { min: 11.25, max: 15.75 },
        used: { min: 13.75, max: 18.75 },
      },
      maxTerm: 84,
      minDownPayment: 10,
    },
  };

  // Finance Calculation Functions
  const calculateMonthlyPayment = (principal: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                   (Math.pow(1 + monthlyRate, term) - 1);
    return payment;
  };

  const getFinanceCalculations = () => {
    const bank = namibianBanks[financeForm.selectedBank as keyof typeof namibianBanks];
    const vehicleAge = vehicle.year >= 2022 ? 'new' : 'used';
    const loanAmount = financeForm.loanAmount || (vehicle.price - financeForm.downPayment);
    
    const minRate = bank.rates[vehicleAge].min;
    const maxRate = bank.rates[vehicleAge].max;
    const avgRate = (minRate + maxRate) / 2;
    
    const minPayment = calculateMonthlyPayment(loanAmount, minRate, financeForm.loanTerm);
    const maxPayment = calculateMonthlyPayment(loanAmount, maxRate, financeForm.loanTerm);
    const avgPayment = calculateMonthlyPayment(loanAmount, avgRate, financeForm.loanTerm);
    
    const totalInterestMin = (minPayment * financeForm.loanTerm) - loanAmount;
    const totalInterestMax = (maxPayment * financeForm.loanTerm) - loanAmount;
    
    return {
      loanAmount,
      minPayment,
      maxPayment,
      avgPayment,
      minRate,
      maxRate,
      avgRate,
      totalInterestMin,
      totalInterestMax,
      bank
    };
  };

  // Similar Cars Data
  const similarCars = [
    { id: '2', year: 2020, make: 'Toyota', model: 'Fortuner 2.4', price: 495000, mileage: 45000, engine: '2.4L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '3', year: 2021, make: 'Toyota', model: 'Fortuner 2.4', price: 499000, mileage: 32000, engine: '2.4L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '4', year: 2019, make: 'Toyota', model: 'Hilux 2.8', price: 399900, mileage: 67000, engine: '2.8L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '5', year: 2016, make: 'Toyota', model: 'Prado 3.0 TD', price: 499500, mileage: 89000, engine: '3.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '6', year: 2024, make: 'Toyota', model: 'Corolla Cross', price: 499995, mileage: 5000, engine: '1.8L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '7', year: 2019, make: 'Mercedes-Benz', model: 'GLA 200', price: 480000, mileage: 55000, engine: '2.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '8', year: 2014, make: 'Land Rover', model: 'Range Rover', price: 424995, mileage: 98000, engine: '3.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '9', year: 2023, make: 'Volkswagen', model: 'Taigo 1.0', price: 489900, mileage: 12000, engine: '1.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '10', year: 2020, make: 'BMW', model: 'X1 Sdrive 18d', price: 489900, mileage: 43000, engine: '2.0L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
    { id: '11', year: 2023, make: 'Chery', model: 'Tiggo 4 Pro', price: 489900, mileage: 8000, engine: '1.5L', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80' },
  ];

  // Filter similar cars based on selected filter
  const getFilteredSimilarCars = () => {
    let filtered = [...similarCars];
    
    switch (similarCarsFilter) {
      case 'Year':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'Engine':
        filtered.sort((a, b) => parseFloat(a.engine) - parseFloat(b.engine));
        break;
      case 'Mileage':
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'Price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        // 'All' - keep original order
        break;
    }
    
    return filtered.slice(0, 6); // Show only first 6
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-[#CB2030]">Home</a>
              <span>/</span>
              <a href="/vehicles" className="hover:text-[#CB2030]">Used Cars</a>
              <span>/</span>
              <span className="text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Vehicle Title and Price */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-5xl font-extrabold mb-3 leading-tight tracking-tight">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex items-center gap-6 text-base text-blue-100 font-medium">
                    <span className="flex items-center gap-2">
                      <Gauge className="h-5 w-5" />
                      {formatMileage(vehicle.mileage)} km
                    </span>
                    <span className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {vehicle.transmission}
                    </span>
                    <span className="flex items-center gap-2">
                      <Fuel className="h-5 w-5" />
                      {vehicle.fuelType}
                    </span>
                    <Badge variant={vehicle.status === 'AVAILABLE' ? 'success' : 'secondary'} className="bg-green-500 text-white text-sm px-3 py-1">
                      {vehicle.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-6 lg:mt-0 text-right">
                  <div className="text-6xl font-black text-yellow-400 mb-2 leading-none">
                    {formatPrice(vehicle.price)}
                  </div>
                  <div className="text-base text-blue-100 font-medium">
                    Ref No: {vehicle.id.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Action Bar */}
            <div className="p-5 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-base text-gray-600 font-medium">
                  <span className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Viewed 47 times this week
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Listed {new Date(vehicle.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={scrollToContactForm}
                    className="bg-[#CB2030] hover:bg-[#CB2030]/90 text-white" 
                    size="sm"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Enquire
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="relative h-96 lg:h-[500px] bg-gray-100">
                  <Image
                    src={images[currentImageIndex]?.url || ''}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="grid grid-cols-6 gap-2">
                    {images.map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-[#CB2030] ring-2 ring-[#CB2030]/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`View ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicle Details */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Year:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Make:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.make}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Model:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.model}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Mileage:</span>
                      <span className="text-lg font-semibold text-gray-900">{formatMileage(vehicle.mileage)} km</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Transmission:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.transmission}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Fuel Type:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Color:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.color}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-lg text-gray-600 font-medium">Body Type:</span>
                      <span className="text-lg font-semibold text-gray-900">{vehicle.bodyType}</span>
                    </div>
                  </div>
                </div>
                
                {vehicle.description && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Description</h3>
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">{vehicle.description}</p>
                  </div>
                )}
                
                {/* Social Sharing */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Share this vehicle</h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={shareOnFacebook}
                      className="flex items-center gap-3 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white text-base font-medium px-6 py-3"
                    >
                      <Facebook className="h-5 w-5" />
                      Share on Facebook
                    </Button>
                    <Button
                      onClick={shareOnWhatsApp}
                      className="flex items-center gap-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-base font-medium px-6 py-3"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Send via WhatsApp
                    </Button>
                  </div>
                  <p className="text-base text-gray-500 mt-3 font-medium">
                    Share this vehicle with friends and family
                  </p>
                </div>
              </div>

              {/* Contact Dealer Form */}
              <div id="contact-dealer-form" className="bg-white rounded-lg shadow-sm p-8 mt-10">
                <h3 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">Contact Dealer</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email address *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact No *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                      placeholder="Please, enter your message..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#CB2030] hover:bg-[#CB2030]/90 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </form>
                
                <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
                  For more information please contact the used car dealership directly by telephone or by completing the form above
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Dealer Information */}
              {vehicle.dealership && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Dealer Header */}
                  <div className="bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                        <Car className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">Auto Dealer Information</h3>
                        <p className="text-base text-blue-100 font-medium">Authorized Vehicle Dealer</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Dealership Details */}
                    <div className="text-center pb-6 border-b">
                      <h4 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{vehicle.dealership.name}</h4>
                      {vehicle.dealership.description && (
                        <p className="text-lg text-gray-600 mb-4 font-medium">{vehicle.dealership.description}</p>
                      )}
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>Verified Dealer</span>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    {vehicle.dealership.address && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin className="h-5 w-5 mt-1 text-[#CB2030]" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">Visit Our Showroom</div>
                            <div className="text-sm text-gray-600 mt-1">
                              <div>{vehicle.dealership.address}</div>
                              <div>{vehicle.dealership.city}, {vehicle.dealership.state}</div>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={showOnGoogleMaps}
                          variant="outline" 
                          className="w-full border-[#CB2030] text-[#CB2030] hover:bg-[#CB2030] hover:text-white"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Show on Google Maps
                        </Button>
                      </div>
                    )}
                    
                    {/* Sales Team */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-[#CB2030]" />
                        Our Sales Team
                      </h5>
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              MV
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">Michiel van Wyk</div>
                              <div className="text-sm text-blue-600 font-medium">Senior Sales Executive</div>
                              <div className="flex items-center gap-2 mt-2">
                                <Phone className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-900">+264 81 750 3953</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                              onClick={() => window.open(`https://wa.me/26481750395?text=Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`, '_blank')}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              WV
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">William Versloos</div>
                              <div className="text-sm text-green-600 font-medium">Sales Manager</div>
                              <div className="flex items-center gap-2 mt-2">
                                <Phone className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-900">+264 81 278 6890</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                              onClick={() => window.open(`https://wa.me/26481278689?text=Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`, '_blank')}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              JJ
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">Jamie-Lee Jasson</div>
                              <div className="text-sm text-purple-600 font-medium">Sales Consultant</div>
                              <div className="flex items-center gap-2 mt-2">
                                <Phone className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-900">+264 81 854 4251</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                              onClick={() => window.open(`https://wa.me/26481854425?text=Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`, '_blank')}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dealer Actions */}
                    <div className="pt-4 border-t">
                      <Button className="w-full bg-[#CB2030] hover:bg-[#CB2030]/90 text-white mb-3">
                        <Car className="h-4 w-4 mr-2" />
                        View All Our Inventory
                      </Button>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          Trusted automotive dealer in Namibia
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* Finance Calculator */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[#CB2030]" />
                    Finance Calculator
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFinanceCalculator(!showFinanceCalculator)}
                  >
                    {showFinanceCalculator ? 'Hide' : 'Calculate'}
                  </Button>
                </div>
                
                {showFinanceCalculator && (
                  <div className="space-y-4">
                    {/* Bank Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Select Bank</label>
                      <select
                        value={financeForm.selectedBank}
                        onChange={(e) => setFinanceForm({...financeForm, selectedBank: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                      >
                        {Object.entries(namibianBanks).map(([key, bank]) => (
                          <option key={key} value={key}>{bank.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Vehicle Price */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Vehicle Price</label>
                      <div className="text-lg font-semibold text-[#CB2030]">
                        {formatPrice(vehicle.price)}
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Down Payment</label>
                      <input
                        type="number"
                        value={financeForm.downPayment}
                        onChange={(e) => setFinanceForm({
                          ...financeForm, 
                          downPayment: Number(e.target.value),
                          loanAmount: vehicle.price - Number(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                        min={0}
                        max={vehicle.price * 0.5}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Minimum: {formatPrice(vehicle.price * (namibianBanks[financeForm.selectedBank as keyof typeof namibianBanks].minDownPayment / 100))}
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Loan Term (months)</label>
                      <select
                        value={financeForm.loanTerm}
                        onChange={(e) => setFinanceForm({...financeForm, loanTerm: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:border-transparent"
                      >
                        <option value={12}>12 months (1 year)</option>
                        <option value={24}>24 months (2 years)</option>
                        <option value={36}>36 months (3 years)</option>
                        <option value={48}>48 months (4 years)</option>
                        <option value={60}>60 months (5 years)</option>
                        <option value={72}>72 months (6 years)</option>
                        <option value={84}>84 months (7 years)</option>
                      </select>
                    </div>

                    {/* Calculations Display */}
                    {(() => {
                      const calc = getFinanceCalculations();
                      return (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Estimated Monthly Payment</div>
                            <div className="text-2xl font-bold text-[#CB2030]">
                              {formatPrice(calc.avgPayment)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Range: {formatPrice(calc.minPayment)} - {formatPrice(calc.maxPayment)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-600">Loan Amount:</div>
                              <div className="font-medium">{formatPrice(calc.loanAmount)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Interest Rate:</div>
                              <div className="font-medium">{calc.minRate}% - {calc.maxRate}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Total Interest:</div>
                              <div className="font-medium">{formatPrice(calc.totalInterestMin)} - {formatPrice(calc.totalInterestMax)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Total Cost:</div>
                              <div className="font-medium">{formatPrice(calc.loanAmount + calc.totalInterestMin)} - {formatPrice(calc.loanAmount + calc.totalInterestMax)}</div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 text-center pt-2 border-t">
                            *Rates are indicative and subject to bank approval and credit assessment
                          </div>
                        </div>
                      );
                    })()}

                    {/* Apply for Finance Button */}
                    <Button className="w-full bg-[#CB2030] hover:bg-[#CB2030]/90 text-white">
                      Apply for Finance with {namibianBanks[financeForm.selectedBank as keyof typeof namibianBanks].name}
                    </Button>
                  </div>
                )}
              </div>

              {/* Similar Vehicles */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Similar used cars for sale</h3>
                  
                  {/* Filter Tabs */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {['All', 'Year', 'Engine', 'Mileage', 'Price'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSimilarCarsFilter(filter)}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          similarCarsFilter === filter
                            ? 'bg-white text-[#CB2030] shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {getFilteredSimilarCars().map((car) => (
                      <div key={car.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                          <Image
                            src={car.image}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            width={64}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 group-hover:text-[#CB2030] transition-colors">
                            {car.year} {car.make} {car.model}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {formatMileage(car.mileage)} km • {car.engine}
                          </div>
                          <div className="text-sm font-semibold text-[#CB2030] mt-1">
                            {formatPrice(car.price)}
                          </div>
                        </div>
                        <div className="text-gray-400 group-hover:text-[#CB2030] transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t text-center">
                    <Button variant="outline" className="w-full border-[#CB2030] text-[#CB2030] hover:bg-[#CB2030] hover:text-white">
                      View All Similar Vehicles
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
