'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
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

export default function WebsiteManagerContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    fetchDealership();
  }, []);

  const fetchDealership = async () => {
    try {
      const response = await fetch('/api/dealer/dealership');
      const data = await response.json();

      if (data.success && data.dealership) {
        setProfileData(data.dealership);
      }
    } catch (error) {
      console.error('Error fetching dealership:', error);
    } finally {
      setLoading(false);
    }
  };

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/dealership/${profileData?.slug || ''}`;

  const updateField = (field: string, value: string) => {
    setProfileData((prev: any) => ({ ...prev, [field]: value }));
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
    if (profileData && (!profileData.slug || profileData.slug === generateSlug(profileData.name))) {
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
    try {
      const response = await fetch('/api/dealer/dealership', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setProfileData(data.dealership);
        showToast({
          title: 'Success!',
          description: 'Profile updated successfully!',
          variant: 'success'
        });
      } else {
        showToast({
          title: 'Error',
          description: data.error || 'Failed to update profile',
          variant: 'error'
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to save changes',
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: 'File Too Large',
        description: 'File size must be less than 5MB',
        variant: 'error'
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Invalid File Type',
        description: 'Please upload an image file',
        variant: 'error'
      });
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/dealer/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProfileData((prev: any) => ({ ...prev, logo: data.url }));
        showToast({
          title: 'Success!',
          description: 'Logo uploaded successfully!',
          variant: 'success'
        });
      } else {
        showToast({
          title: 'Upload Failed',
          description: data.error || 'Failed to upload logo',
          variant: 'error'
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'error'
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: 'File Too Large',
        description: 'File size must be less than 5MB',
        variant: 'error'
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Invalid File Type',
        description: 'Please upload an image file',
        variant: 'error'
      });
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');

      const response = await fetch('/api/dealer/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProfileData((prev: any) => ({ ...prev, coverImage: data.url }));
        showToast({
          title: 'Success!',
          description: 'Cover image uploaded successfully!',
          variant: 'success'
        });
      } else {
        showToast({
          title: 'Upload Failed',
          description: data.error || 'Failed to upload cover image',
          variant: 'error'
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to upload cover image',
        variant: 'error'
      });
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dealership data...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">No dealership found</p>
          <p className="text-gray-600 mt-2">Please contact support</p>
        </div>
      </div>
    );
  }

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
                      value={profileData?.name || ''}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter dealership name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Profile URL Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">/dealership/</span>
                      <Input
                        value={profileData?.slug || ''}
                        onChange={(e) => updateField('slug', generateSlug(e.target.value))}
                        placeholder="dealership-name"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={profileData?.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none"
                      placeholder="Brief description of your dealership..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Specializations</label>
                    <Input
                      value={profileData?.specializations || ''}
                      onChange={(e) => updateField('specializations', e.target.value)}
                      placeholder="e.g. Luxury Cars, SUVs, Trucks"
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
                    value={profileData?.phone || ''}
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
                    value={profileData?.alternatePhone || ''}
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
                    value={profileData?.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="info@dealership.na"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    WhatsApp Number
                  </label>
                  <Input
                    value={profileData?.whatsappNumber || ''}
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
                    value={profileData?.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="www.dealership.na"
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
                    value={profileData?.streetAddress || ''}
                    onChange={(e) => updateField('streetAddress', e.target.value)}
                    placeholder="123 Independence Avenue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={profileData?.city || ''}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Windhoek"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <Input
                    value={profileData?.region || ''}
                    onChange={(e) => updateField('region', e.target.value)}
                    placeholder="Khomas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <Input
                    value={profileData?.postalCode || ''}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Google Maps URL</label>
                  <Input
                    value={profileData?.googleMapsUrl || ''}
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
                value={profileData?.openingHours || ''}
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
                    value={profileData?.facebookUrl || ''}
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
                    value={profileData?.instagramUrl || ''}
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
                    value={profileData?.twitterUrl || ''}
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
                    value={profileData?.linkedinUrl || ''}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer / Highlight Section */}
          <Card>
            <CardHeader>
              <CardTitle>Special Offer / Highlight</CardTitle>
              <CardDescription>Add a highlighted message to showcase special offers or promotions on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      checked={profileData?.highlightActive || false}
                      onChange={(e) => updateField('highlightActive', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">Show highlight on profile</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Highlight Title
                  </label>
                  <Input
                    value={profileData?.highlightTitle || ''}
                    onChange={(e) => updateField('highlightTitle', e.target.value)}
                    placeholder="e.g. Special Offer, Limited Time Deal"
                    disabled={!profileData?.highlightActive}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Highlight Description
                  </label>
                  <textarea
                    value={profileData?.highlightDescription || ''}
                    onChange={(e) => updateField('highlightDescription', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md h-20 resize-none disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="e.g. 0% financing available on selected vehicles. Trade-in bonuses up to N$50,000!"
                    disabled={!profileData?.highlightActive}
                  />
                </div>

                {profileData?.highlightActive && profileData?.highlightTitle && profileData?.highlightDescription && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">{profileData.highlightTitle}</p>
                    <p className="text-sm text-yellow-800">{profileData.highlightDescription}</p>
                  </div>
                )}
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
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center block cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {profileData?.logo ? (
                    <div className="space-y-2">
                      <img src={profileData.logo} alt="Logo" className="h-20 w-20 mx-auto object-contain rounded" />
                      <p className="text-sm text-gray-600">Click to change logo</p>
                    </div>
                  ) : uploadingLogo ? (
                    <div className="space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                    </div>
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, Max 5MB</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <label
                  htmlFor="cover-upload"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center block cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {profileData?.coverImage ? (
                    <div className="space-y-2">
                      <img src={profileData.coverImage} alt="Cover" className="h-24 w-full mx-auto object-cover rounded" />
                      <p className="text-sm text-gray-600">Click to change cover</p>
                    </div>
                  ) : uploadingCover ? (
                    <div className="space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload cover</p>
                    </div>
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-2">Recommended: 1200x400px, Max 5MB</p>
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
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <Badge variant="secondary">{profileData?._count?.vehicles || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Team Members</span>
                  <Badge variant="secondary">{profileData?._count?.users || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Status</span>
                  <Badge variant="secondary">{profileData?.status || 'Active'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
