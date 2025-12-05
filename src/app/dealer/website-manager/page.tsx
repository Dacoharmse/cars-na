'use client';
// Updated version - December 2025
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export default function WebsiteManager() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [dealership, setDealership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      window.location.href = '/dealer/login';
      return;
    }

    fetchDealership();
  }, [session, status]);

  const fetchDealership = async () => {
    try {
      const response = await fetch('/api/dealer/dealership');
      const data = await response.json();

      if (data.success && data.dealership) {
        setDealership(data.dealership);
      } else {
        showToast(data.error || 'Failed to load dealership', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to load dealership data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/dealer/dealership', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealership),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Profile updated successfully!', 'success');
        setDealership(data.dealership);
      } else {
        showToast(data.error || 'Failed to update', 'error');
      }
    } catch (error) {
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setDealership((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!dealership) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">No dealership found</p>
          <p className="text-gray-600 mt-2">Please contact support</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Website Manager</h1>
          <p className="text-gray-600 mt-2">Manage your dealership information</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dealership Information</CardTitle>
            <CardDescription>Update your dealership details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dealership Name *</label>
              <Input
                value={dealership.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter dealership name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile URL Slug</label>
              <Input
                value={dealership.slug || ''}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="dealership-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={dealership.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none"
                placeholder="Brief description of your dealership"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Specializations</label>
              <Input
                value={dealership.specializations || ''}
                onChange={(e) => updateField('specializations', e.target.value)}
                placeholder="e.g. Luxury Cars, SUVs, Trucks"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  value={dealership.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+264 81 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alternate Phone</label>
                <Input
                  value={dealership.alternatePhone || ''}
                  onChange={(e) => updateField('alternatePhone', e.target.value)}
                  placeholder="+264 81 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                value={dealership.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="info@dealership.na"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
              <Input
                value={dealership.whatsappNumber || ''}
                onChange={(e) => updateField('whatsappNumber', e.target.value)}
                placeholder="+264 81 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                value={dealership.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="www.dealership.na"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
