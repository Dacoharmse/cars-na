'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Send,
  MessageCircle,
  ExternalLink,
  Car,
  CheckCircle,
  Star
} from 'lucide-react';

// Mock dealership data (in real app, fetch from API using slug)
const mockDealership = {
  id: 'dealer-1',
  name: 'Premium Auto Namibia',
  slug: 'premium-auto-namibia',
  description: "Namibia's leading premium vehicle dealership specializing in luxury cars and SUVs. With over 15 years of experience, we provide exceptional service and quality vehicles to our customers across Namibia.",
  phone: '+264 61 123 4567',
  alternatePhone: '+264 81 123 4567',
  email: 'info@premiumauto.na',
  whatsappNumber: '+264 81 123 4567',
  streetAddress: '123 Independence Avenue',
  city: 'Windhoek',
  region: 'Khomas',
  postalCode: '10001',
  website: 'www.premiumauto.na',
  googleMapsUrl: 'https://maps.google.com',
  openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM\nSat: 9:00 AM - 1:00 PM\nSun: Closed',
  specializations: 'Luxury Cars, SUVs, Electric Vehicles',
  facebookUrl: 'https://facebook.com/premiumauto',
  instagramUrl: 'https://instagram.com/premiumauto',
  twitterUrl: 'https://twitter.com/premiumauto',
  linkedinUrl: 'https://linkedin.com/company/premiumauto',
  logo: '',
  coverImage: '',
  isVerified: true,
  stats: {
    totalVehicles: 23,
    profileViews: 1234,
    responseTime: '< 2 hours'
  }
};

// Mock vehicles for this dealership
const mockVehicles = [
  {
    id: 'v1',
    year: 2022,
    make: 'BMW',
    model: 'X3',
    price: 650000,
    mileage: 25000,
    category: 'CARS',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'White',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
    isNew: false,
    featured: true
  },
  {
    id: 'v2',
    year: 2021,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    price: 580000,
    mileage: 32000,
    category: 'CARS',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    color: 'Black',
    images: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'],
    isNew: false,
    featured: false
  },
  {
    id: 'v3',
    year: 2023,
    make: 'Audi',
    model: 'Q5',
    price: 720000,
    mileage: 12000,
    category: 'CARS',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    color: 'Grey',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
    isNew: false,
    featured: true
  },
  {
    id: 'v4',
    year: 2024,
    make: 'Toyota',
    model: 'Land Cruiser',
    price: 980000,
    mileage: 0,
    category: 'CARS',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    color: 'White',
    images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'],
    isNew: true,
    featured: true
  }
];

export default function DealershipProfile({ params }: { params: { slug: string } }) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    vehicleId: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to send inquiry
    console.log('Contact form submitted:', contactForm);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your vehicles at ${mockDealership.name}`);
    window.open(`https://wa.me/${mockDealership.whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-blue-600 to-blue-800 relative">
        {mockDealership.coverImage && (
          <img
            src={mockDealership.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {/* Logo */}
                <div className="w-24 h-24 bg-white border-4 border-white rounded-lg shadow-lg flex items-center justify-center">
                  {mockDealership.logo ? (
                    <img src={mockDealership.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <Car className="w-12 h-12 text-blue-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold text-gray-900">{mockDealership.name}</h1>
                    {mockDealership.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{mockDealership.description}</p>
                  {mockDealership.specializations && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mockDealership.specializations.split(',').map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleWhatsApp}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{mockDealership.stats.totalVehicles}</p>
                <p className="text-sm text-gray-600">Vehicles Available</p>
              </div>
              <div className="text-center border-l border-r">
                <p className="text-2xl font-bold text-gray-900">{mockDealership.stats.profileViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{mockDealership.stats.responseTime}</p>
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Vehicles */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Available Vehicles ({mockVehicles.length})
                </CardTitle>
                <CardDescription>Browse our current inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {vehicle.isNew && (
                          <Badge className="absolute top-2 left-2 bg-green-600">New</Badge>
                        )}
                        {vehicle.featured && (
                          <Badge className="absolute top-2 right-2 bg-blue-600">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          N$ {vehicle.price.toLocaleString()}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                          <div>{vehicle.mileage > 0 ? `${vehicle.mileage.toLocaleString()} km` : 'Brand New'}</div>
                          <div>{vehicle.transmission}</div>
                          <div>{vehicle.fuelType}</div>
                          <div>{vehicle.color}</div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => setContactForm(prev => ({ ...prev, vehicleId: vehicle.id }))}
                        >
                          Inquire Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Dealership</CardTitle>
                <CardDescription>Send an inquiry or request information</CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 text-sm">
                      The dealership will contact you shortly
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+264 81 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none"
                        placeholder="I'm interested in..."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      {mockDealership.streetAddress}<br />
                      {mockDealership.city}, {mockDealership.region}<br />
                      {mockDealership.postalCode}
                    </p>
                    {mockDealership.googleMapsUrl && (
                      <a
                        href={mockDealership.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline inline-flex items-center mt-1"
                      >
                        View on Map <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{mockDealership.phone}</p>
                    {mockDealership.alternatePhone && (
                      <p className="text-sm text-gray-600">{mockDealership.alternatePhone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{mockDealership.email}</p>
                  </div>
                </div>

                {mockDealership.website && (
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a
                        href={`https://${mockDealership.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {mockDealership.website}
                      </a>
                    </div>
                  </div>
                )}

                {mockDealership.openingHours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Opening Hours</p>
                      <pre className="text-sm text-gray-600 whitespace-pre-line font-sans">
                        {mockDealership.openingHours}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            {(mockDealership.facebookUrl || mockDealership.instagramUrl || mockDealership.twitterUrl || mockDealership.linkedinUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    {mockDealership.facebookUrl && (
                      <a
                        href={mockDealership.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {mockDealership.instagramUrl && (
                      <a
                        href={mockDealership.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {mockDealership.twitterUrl && (
                      <a
                        href={mockDealership.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {mockDealership.linkedinUrl && (
                      <a
                        href={mockDealership.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
