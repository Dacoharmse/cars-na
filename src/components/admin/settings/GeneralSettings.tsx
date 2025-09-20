'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  Globe,
  DollarSign,
  Eye,
  Shield,
  AlertCircle,
  CheckCircle2,
  Save,
  RefreshCw
} from 'lucide-react';

interface GeneralSettingsData {
  platformName: string;
  platformDescription: string;
  supportEmail: string;
  contactPhone: string;
  defaultCurrency: string;
  defaultLocale: string;
  timezone: string;
  commissionRate: number;
  featuredListingPrice: number;
  basicListingPrice: number;
  premiumListingPrice: number;
  autoApprovalThreshold: number;
  contentModerationEnabled: boolean;
  autoContentModeration: boolean;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  guestBrowsingEnabled: boolean;
  maxListingsPerDealer: number;
  listingExpiryDays: number;
}

const CURRENCIES = [
  { value: 'NAD', label: 'Namibian Dollar (N$)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'ZAR', label: 'South African Rand (R)' }
];

const LOCALES = [
  { value: 'en-NA', label: 'English (Namibia)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'af-NA', label: 'Afrikaans (Namibia)' },
  { value: 'de-NA', label: 'German (Namibia)' }
];

const TIMEZONES = [
  { value: 'Africa/Windhoek', label: 'Africa/Windhoek (CAT)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST)' }
];

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    platformName: 'Cars.na',
    platformDescription: 'Namibia\'s Premier Automotive Marketplace',
    supportEmail: 'support@cars.na',
    contactPhone: '+264 61 123 4567',
    defaultCurrency: 'NAD',
    defaultLocale: 'en-NA',
    timezone: 'Africa/Windhoek',
    commissionRate: 5.0,
    featuredListingPrice: 150,
    basicListingPrice: 50,
    premiumListingPrice: 100,
    autoApprovalThreshold: 1000000,
    contentModerationEnabled: true,
    autoContentModeration: true,
    maintenanceMode: false,
    registrationEnabled: true,
    guestBrowsingEnabled: true,
    maxListingsPerDealer: 100,
    listingExpiryDays: 90
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: keyof GeneralSettingsData, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement tRPC mutation to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      platformName: 'Cars.na',
      platformDescription: 'Namibia\'s Premier Automotive Marketplace',
      supportEmail: 'support@cars.na',
      contactPhone: '+264 61 123 4567',
      defaultCurrency: 'NAD',
      defaultLocale: 'en-NA',
      timezone: 'Africa/Windhoek',
      commissionRate: 5.0,
      featuredListingPrice: 150,
      basicListingPrice: 50,
      premiumListingPrice: 100,
      autoApprovalThreshold: 1000000,
      contentModerationEnabled: true,
      autoContentModeration: true,
      maintenanceMode: false,
      registrationEnabled: true,
      guestBrowsingEnabled: true,
      maxListingsPerDealer: 100,
      listingExpiryDays: 90
    });
    setIsSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
          <p className="text-gray-600">Configure platform-wide settings and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Success Alert */}
      {isSaved && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Maintenance Mode Warning */}
      {settings.maintenanceMode && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Maintenance mode is currently enabled. The platform is not accessible to users.
          </AlertDescription>
        </Alert>
      )}

      {/* Platform Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Platform Information
          </CardTitle>
          <CardDescription>
            Basic platform identification and branding settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform Name</label>
              <Input
                value={settings.platformName}
                onChange={(e) => handleInputChange('platformName', e.target.value)}
                placeholder="Enter platform name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                placeholder="support@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform Description</label>
              <Input
                value={settings.platformDescription}
                onChange={(e) => handleInputChange('platformDescription', e.target.value)}
                placeholder="Brief platform description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+264 61 123 4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
          <CardDescription>
            Configure regional settings and formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Currency</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Default Locale</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.defaultLocale}
                onChange={(e) => handleInputChange('defaultLocale', e.target.value)}
              >
                {LOCALES.map(locale => (
                  <option key={locale.value} value={locale.value}>
                    {locale.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              >
                {TIMEZONES.map(timezone => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Commission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Pricing & Commission
          </CardTitle>
          <CardDescription>
            Configure listing prices and commission rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={settings.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of vehicle sale price</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Auto-Approval Threshold (N$)</label>
              <Input
                type="number"
                min="0"
                value={settings.autoApprovalThreshold}
                onChange={(e) => handleInputChange('autoApprovalThreshold', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Vehicles below this price are auto-approved</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Listing Prices (N$)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Basic Listing</label>
                <Input
                  type="number"
                  min="0"
                  value={settings.basicListingPrice}
                  onChange={(e) => handleInputChange('basicListingPrice', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Premium Listing</label>
                <Input
                  type="number"
                  min="0"
                  value={settings.premiumListingPrice}
                  onChange={(e) => handleInputChange('premiumListingPrice', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Featured Listing</label>
                <Input
                  type="number"
                  min="0"
                  value={settings.featuredListingPrice}
                  onChange={(e) => handleInputChange('featuredListingPrice', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Access & Moderation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Platform Access & Moderation
          </CardTitle>
          <CardDescription>
            Control platform accessibility and content moderation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Maintenance Mode</span>
                  <p className="text-sm text-gray-500">Disable platform access for maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">User Registration</span>
                  <p className="text-sm text-gray-500">Allow new user registrations</p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => handleInputChange('registrationEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Guest Browsing</span>
                  <p className="text-sm text-gray-500">Allow browsing without registration</p>
                </div>
                <Switch
                  checked={settings.guestBrowsingEnabled}
                  onCheckedChange={(checked) => handleInputChange('guestBrowsingEnabled', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Content Moderation</span>
                  <p className="text-sm text-gray-500">Enable manual content review</p>
                </div>
                <Switch
                  checked={settings.contentModerationEnabled}
                  onCheckedChange={(checked) => handleInputChange('contentModerationEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Auto Moderation</span>
                  <p className="text-sm text-gray-500">Automatic content filtering</p>
                </div>
                <Switch
                  checked={settings.autoContentModeration}
                  onCheckedChange={(checked) => handleInputChange('autoContentModeration', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Listings per Dealer</label>
              <Input
                type="number"
                min="1"
                value={settings.maxListingsPerDealer}
                onChange={(e) => handleInputChange('maxListingsPerDealer', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Listing Expiry (Days)</label>
              <Input
                type="number"
                min="1"
                value={settings.listingExpiryDays}
                onChange={(e) => handleInputChange('listingExpiryDays', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}