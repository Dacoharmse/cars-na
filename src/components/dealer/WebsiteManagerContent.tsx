'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Save,
  Globe,
  Copy,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
  Upload,
  ExternalLink
} from 'lucide-react';

// Mock current dealership data
const mockDealership = {
  id: 'dealer-1',
  name: 'Premium Auto Namibia',
  slug: 'premium-auto-namibia',
  description: "Namibia's leading premium vehicle dealership",
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
  twitterUrl: '',
  linkedinUrl: '',
  logo: '',
  coverImage: ''
};

export default function WebsiteManagerContent() {
  const [profileData, setProfileData] = useState(mockDealership);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/dealership/${profileData.slug}`;

  const updateField = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    updateField('name', name);
    // Auto-generate slug if it hasn't been manually changed
    if (!profileData.slug || profileData.slug === generateSlug(profileData.name)) {
      updateField('slug', generateSlug(name));
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement API call to save profile data
    setTimeout(() => {
      setSaving(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Link Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Your Public Profile Link
              </CardTitle>
              <CardDescription>
                Share this link with customers to showcase your inventory and dealership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={profileUrl}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={copyProfileLink}
                    className="flex items-center"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(profileUrl, '_blank')}
                    className="flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Customize your profile URL by changing the slug below for a more branded link
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dealership Information */}
          <Card>
            <CardHeader>
              <CardTitle>Dealership Information</CardTitle>
              <CardDescription>Basic information about your dealership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Dealership Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Premium Auto Namibia"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Profile URL Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">/dealership/</span>
                      <Input
                        value={profileData.slug}
                        onChange={(e) => updateField('slug', generateSlug(e.target.value))}
                        placeholder="premium-auto-namibia"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={profileData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none"
                      placeholder="Brief description of your dealership..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Specializations</label>
                    <Input
                      value={profileData.specializations}
                      onChange={(e) => updateField('specializations', e.target.value)}
                      placeholder="e.g. Luxury Cars, SUVs, Electric Vehicles"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of your specialties</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+264 61 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Alternate Phone
                  </label>
                  <Input
                    value={profileData.alternatePhone}
                    onChange={(e) => updateField('alternatePhone', e.target.value)}
                    placeholder="+264 81 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="info@premiumauto.na"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    WhatsApp Number
                  </label>
                  <Input
                    value={profileData.whatsappNumber}
                    onChange={(e) => updateField('whatsappNumber', e.target.value)}
                    placeholder="+264 81 123 4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Website
                  </label>
                  <Input
                    value={profileData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="www.premiumauto.na"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin className="h-5 w-5 inline mr-2" />
                Location
              </CardTitle>
              <CardDescription>Your dealership's physical address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={profileData.streetAddress}
                    onChange={(e) => updateField('streetAddress', e.target.value)}
                    placeholder="123 Independence Avenue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={profileData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Windhoek"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <Input
                    value={profileData.region}
                    onChange={(e) => updateField('region', e.target.value)}
                    placeholder="Khomas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <Input
                    value={profileData.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Google Maps URL</label>
                  <Input
                    value={profileData.googleMapsUrl}
                    onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock className="h-5 w-5 inline mr-2" />
                Opening Hours
              </CardTitle>
              <CardDescription>When customers can visit your dealership</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={profileData.openingHours}
                onChange={(e) => updateField('openingHours', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none"
                placeholder="Mon-Fri: 8:00 AM - 5:00 PM&#10;Sat: 9:00 AM - 1:00 PM&#10;Sun: Closed"
              />
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Facebook className="h-4 w-4 inline mr-1 text-blue-600" />
                    Facebook
                  </label>
                  <Input
                    value={profileData.facebookUrl}
                    onChange={(e) => updateField('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Instagram className="h-4 w-4 inline mr-1 text-pink-600" />
                    Instagram
                  </label>
                  <Input
                    value={profileData.instagramUrl}
                    onChange={(e) => updateField('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Twitter className="h-4 w-4 inline mr-1 text-blue-400" />
                    Twitter / X
                  </label>
                  <Input
                    value={profileData.twitterUrl}
                    onChange={(e) => updateField('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Linkedin className="h-4 w-4 inline mr-1 text-blue-700" />
                    LinkedIn
                  </label>
                  <Input
                    value={profileData.linkedinUrl}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Save Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(profileUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Profile
              </Button>
            </CardContent>
          </Card>

          {/* Profile Images */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Images</CardTitle>
              <CardDescription>Upload your dealership logo and cover image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload logo</p>
                  <p className="text-xs text-gray-400">Recommended: 200x200px</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload cover</p>
                  <p className="text-xs text-gray-400">Recommended: 1200x400px</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <Badge variant="secondary">1,234</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <Badge variant="secondary">23</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inquiries (30d)</span>
                  <Badge variant="secondary">45</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
