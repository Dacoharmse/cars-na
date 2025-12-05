'use client';

import { use, useState, useEffect } from 'react';
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

export default function DealershipProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [dealership, setDealership] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    vehicleId: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetchDealership();
  }, [slug]);

  const fetchDealership = async () => {
    try {
      const response = await fetch(`/api/dealerships/${slug}`);
      const data = await response.json();

      console.log('📥 Received dealership data:', data);
      console.log('📸 Cover Image from API:', data.dealership?.coverImage);
      console.log('🖼️  Logo from API:', data.dealership?.logo);

      if (data.success && data.dealership) {
        setDealership(data.dealership);
        setVehicles(data.dealership.vehicles || []);
        console.log('✅ Dealership state set:', data.dealership.name);
        console.log('🎨 Background will be:', data.dealership.coverImage ? `url(${data.dealership.coverImage})` : 'gradient');
      }
    } catch (error) {
      console.error('Error fetching dealership:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to send inquiry
    console.log('Contact form submitted:', contactForm);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleWhatsApp = () => {
    if (!dealership) return;
    const message = encodeURIComponent(`Hi, I'm interested in your vehicles at ${dealership.name}`);
    window.open(`https://wa.me/${dealership.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dealership...</p>
        </div>
      </div>
    );
  }

  if (!dealership) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Dealership not found</p>
          <p className="text-gray-600 mt-2">The dealership you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div
        className="h-64 relative overflow-hidden"
        style={{
          backgroundImage: dealership?.coverImage
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${dealership.coverImage})`
            : 'linear-gradient(to right, rgb(37, 99, 235), rgb(30, 64, 175))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {/* Logo */}
                <div className="w-24 h-24 bg-white border-4 border-white rounded-lg shadow-lg flex items-center justify-center">
                  {dealership.logo ? (
                    <img src={dealership.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <Car className="w-12 h-12 text-blue-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold text-gray-900">{dealership.name}</h1>
                    {dealership.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{dealership.description}</p>
                  {dealership.specializations && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dealership.specializations.split(',').map((spec: string, idx: number) => (
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
                <p className="text-2xl font-bold text-gray-900">{dealership._count?.vehicles || 0}</p>
                <p className="text-sm text-gray-600">Vehicles Available</p>
              </div>
              <div className="text-center border-l border-r">
                <p className="text-2xl font-bold text-gray-900">{dealership.profileViews?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{dealership.responseTime || 'N/A'}</p>
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
            </div>

            {/* Special Offer / Highlight */}
            {dealership.highlightActive && dealership.highlightTitle && dealership.highlightDescription && (
              <div className="mt-6 pt-6 border-t">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4">
                  <div className="flex items-start">
                    <Star className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900 mb-1">{dealership.highlightTitle}</h3>
                      <p className="text-sm text-yellow-800">{dealership.highlightDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                  Available Vehicles ({vehicles.length})
                </CardTitle>
                <CardDescription>Browse our current inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {vehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No vehicles available at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="relative">
                          <img
                            src={vehicle.images?.[0] || '/placeholder-car.jpg'}
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
                            N$ {vehicle.price?.toLocaleString() || 'Contact for price'}
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
                )}
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
                {(dealership.streetAddress || dealership.city || dealership.region) && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">
                        {dealership.streetAddress && <>{dealership.streetAddress}<br /></>}
                        {dealership.city && dealership.region && <>{dealership.city}, {dealership.region}<br /></>}
                        {dealership.postalCode}
                      </p>
                      {dealership.googleMapsUrl && (
                        <a
                          href={dealership.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline inline-flex items-center mt-1"
                        >
                          View on Map <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {dealership.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{dealership.phone}</p>
                      {dealership.alternatePhone && (
                        <p className="text-sm text-gray-600">{dealership.alternatePhone}</p>
                      )}
                    </div>
                  </div>
                )}

                {dealership.email && (
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{dealership.email}</p>
                    </div>
                  </div>
                )}

                {dealership.website && (
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a
                        href={`https://${dealership.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {dealership.website}
                      </a>
                    </div>
                  </div>
                )}

                {dealership.openingHours && (
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Opening Hours</p>
                      <pre className="text-sm text-gray-600 whitespace-pre-line font-sans">
                        {dealership.openingHours}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            {(dealership.facebookUrl || dealership.instagramUrl || dealership.twitterUrl || dealership.linkedinUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    {dealership.facebookUrl && (
                      <a
                        href={dealership.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {dealership.instagramUrl && (
                      <a
                        href={dealership.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {dealership.twitterUrl && (
                      <a
                        href={dealership.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {dealership.linkedinUrl && (
                      <a
                        href={dealership.linkedinUrl}
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
