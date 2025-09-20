'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import {
  Key,
  Globe,
  BarChart3,
  Webhook,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  TestTube,
  AlertTriangle,
  Copy,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Activity,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  enabled: boolean;
  expiresAt?: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  lastTriggered?: string;
}

interface ApiSettingsData {
  // API Management
  apiEnabled: boolean;
  apiRateLimit: number;
  apiKeyExpiration: number;
  corsEnabled: boolean;
  allowedOrigins: string;
  apiVersioning: boolean;
  currentVersion: string;
  deprecationWarnings: boolean;

  // API Keys
  apiKeys: ApiKey[];

  // Webhooks
  webhooks: Webhook[];
  webhookRetries: number;
  webhookTimeout: number;

  // Third-party Integrations
  googleAnalyticsEnabled: boolean;
  googleAnalyticsId: string;
  googleMapsEnabled: boolean;
  googleMapsApiKey: string;
  facebookPixelEnabled: boolean;
  facebookPixelId: string;
  metaApiEnabled: boolean;
  metaAppId: string;
  metaAppSecret: string;

  // Social Media Integration
  facebookEnabled: boolean;
  facebookPageId: string;
  facebookAccessToken: string;
  twitterEnabled: boolean;
  twitterApiKey: string;
  twitterApiSecret: string;
  instagramEnabled: boolean;
  instagramBusinessId: string;
  youtubeEnabled: boolean;
  youtubeChannelId: string;
  linkedinEnabled: boolean;
  linkedinPageId: string;

  // External Services
  cloudinaryEnabled: boolean;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  awsS3Enabled: boolean;
  awsAccessKey: string;
  awsSecretKey: string;
  awsRegion: string;
  awsBucket: string;

  // Monitoring & Analytics
  sentryEnabled: boolean;
  sentryDsn: string;
  hotjarEnabled: boolean;
  hotjarId: string;
  mixpanelEnabled: boolean;
  mixpanelToken: string;
  datadogEnabled: boolean;
  datadogApiKey: string;

  // External APIs
  vehicleDataApiEnabled: boolean;
  vehicleDataApiKey: string;
  currencyApiEnabled: boolean;
  currencyApiKey: string;
  locationApiEnabled: boolean;
  locationApiKey: string;
  insuranceApiEnabled: boolean;
  insuranceApiKey: string;
}

const API_PERMISSIONS = [
  'vehicles:read',
  'vehicles:write',
  'dealers:read',
  'dealers:write',
  'users:read',
  'users:write',
  'leads:read',
  'leads:write',
  'analytics:read',
  'settings:read',
  'settings:write'
];

const WEBHOOK_EVENTS = [
  'user.created',
  'user.updated',
  'dealer.created',
  'dealer.approved',
  'vehicle.created',
  'vehicle.updated',
  'vehicle.sold',
  'lead.created',
  'payment.completed',
  'subscription.created',
  'subscription.cancelled'
];

export default function ApiSettings() {
  const [settings, setSettings] = useState<ApiSettingsData>({
    // API Management
    apiEnabled: true,
    apiRateLimit: 1000,
    apiKeyExpiration: 365,
    corsEnabled: true,
    allowedOrigins: 'https://cars.na, https://admin.cars.na',
    apiVersioning: true,
    currentVersion: 'v1',
    deprecationWarnings: true,

    // API Keys
    apiKeys: [
      {
        id: '1',
        name: 'Mobile App',
        key: 'cna_live_1234567890abcdef',
        permissions: ['vehicles:read', 'dealers:read', 'leads:write'],
        lastUsed: '2024-01-15T10:30:00Z',
        enabled: true,
        expiresAt: '2024-12-31T23:59:59Z'
      },
      {
        id: '2',
        name: 'Website Integration',
        key: 'cna_live_abcdef1234567890',
        permissions: ['vehicles:read', 'leads:write'],
        lastUsed: '2024-01-15T09:15:00Z',
        enabled: true
      }
    ],

    // Webhooks
    webhooks: [
      {
        id: '1',
        name: 'Lead Notifications',
        url: 'https://crm.example.com/webhooks/leads',
        events: ['lead.created'],
        secret: 'whsec_1234567890abcdef',
        enabled: true,
        lastTriggered: '2024-01-15T10:30:00Z'
      }
    ],
    webhookRetries: 3,
    webhookTimeout: 30,

    // Third-party Integrations
    googleAnalyticsEnabled: true,
    googleAnalyticsId: 'GA-123456789',
    googleMapsEnabled: true,
    googleMapsApiKey: '',
    facebookPixelEnabled: false,
    facebookPixelId: '',
    metaApiEnabled: false,
    metaAppId: '',
    metaAppSecret: '',

    // Social Media Integration
    facebookEnabled: false,
    facebookPageId: '',
    facebookAccessToken: '',
    twitterEnabled: false,
    twitterApiKey: '',
    twitterApiSecret: '',
    instagramEnabled: false,
    instagramBusinessId: '',
    youtubeEnabled: false,
    youtubeChannelId: '',
    linkedinEnabled: false,
    linkedinPageId: '',

    // External Services
    cloudinaryEnabled: false,
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    awsS3Enabled: false,
    awsAccessKey: '',
    awsSecretKey: '',
    awsRegion: 'us-east-1',
    awsBucket: '',

    // Monitoring & Analytics
    sentryEnabled: true,
    sentryDsn: '',
    hotjarEnabled: false,
    hotjarId: '',
    mixpanelEnabled: false,
    mixpanelToken: '',
    datadogEnabled: false,
    datadogApiKey: '',

    // External APIs
    vehicleDataApiEnabled: false,
    vehicleDataApiKey: '',
    currencyApiEnabled: true,
    currencyApiKey: '',
    locationApiEnabled: false,
    locationApiKey: '',
    insuranceApiEnabled: false,
    insuranceApiKey: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const handleInputChange = (field: keyof ApiSettingsData, value: string | number | boolean) => {
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

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'cna_live_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createApiKey = () => {
    if (!newApiKeyName.trim()) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKeyName,
      key: generateApiKey(),
      permissions: ['vehicles:read'],
      lastUsed: '',
      enabled: true
    };

    setSettings(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKey]
    }));

    setNewApiKeyName('');
    setIsSaved(false);
  };

  const updateApiKey = (keyId: string, updates: Partial<ApiKey>) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.map(key =>
        key.id === keyId ? { ...key, ...updates } : key
      )
    }));
    setIsSaved(false);
  };

  const deleteApiKey = (keyId: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key.id !== keyId)
    }));
    setIsSaved(false);
  };

  const createWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) return;

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: ['lead.created'],
      secret: 'whsec_' + Math.random().toString(36).substring(2, 18),
      enabled: true
    };

    setSettings(prev => ({
      ...prev,
      webhooks: [...prev.webhooks, newWebhook]
    }));

    setNewWebhookName('');
    setNewWebhookUrl('');
    setIsSaved(false);
  };

  const updateWebhook = (webhookId: string, updates: Partial<Webhook>) => {
    setSettings(prev => ({
      ...prev,
      webhooks: prev.webhooks.map(webhook =>
        webhook.id === webhookId ? { ...webhook, ...updates } : webhook
      )
    }));
    setIsSaved(false);
  };

  const deleteWebhook = (webhookId: string) => {
    setSettings(prev => ({
      ...prev,
      webhooks: prev.webhooks.filter(webhook => webhook.id !== webhookId)
    }));
    setIsSaved(false);
  };

  const testWebhook = async (webhookId: string) => {
    // TODO: Implement webhook testing
    console.log(`Testing webhook ${webhookId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskSecret = (secret: string) => {
    if (!secret) return '';
    return secret.substring(0, 8) + '•'.repeat(Math.max(0, secret.length - 8));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
          <p className="text-gray-600">Configure API access, integrations, and external services</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowSecrets(!showSecrets)}>
            {showSecrets ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showSecrets ? 'Hide' : 'Show'} Secrets
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
            API settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* API Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Management
          </CardTitle>
          <CardDescription>
            Configure general API settings and policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Enable API Access</span>
                <p className="text-sm text-gray-500">Allow external API access to platform</p>
              </div>
              <Switch
                checked={settings.apiEnabled}
                onCheckedChange={(checked) => handleInputChange('apiEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">CORS Enabled</span>
                <p className="text-sm text-gray-500">Allow cross-origin requests</p>
              </div>
              <Switch
                checked={settings.corsEnabled}
                onCheckedChange={(checked) => handleInputChange('corsEnabled', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rate Limit (requests per hour)</label>
              <Input
                type="number"
                min="100"
                max="10000"
                value={settings.apiRateLimit}
                onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value) || 1000)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">API Key Expiration (days)</label>
              <Input
                type="number"
                min="30"
                max="3650"
                value={settings.apiKeyExpiration}
                onChange={(e) => handleInputChange('apiKeyExpiration', parseInt(e.target.value) || 365)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Allowed Origins</label>
            <Textarea
              value={settings.allowedOrigins}
              onChange={(e) => handleInputChange('allowedOrigins', e.target.value)}
              placeholder="https://cars.na, https://admin.cars.na"
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of allowed domains</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">API Versioning</span>
                <p className="text-sm text-gray-500">Enable API version management</p>
              </div>
              <Switch
                checked={settings.apiVersioning}
                onCheckedChange={(checked) => handleInputChange('apiVersioning', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Deprecation Warnings</span>
                <p className="text-sm text-gray-500">Show warnings for deprecated endpoints</p>
              </div>
              <Switch
                checked={settings.deprecationWarnings}
                onCheckedChange={(checked) => handleInputChange('deprecationWarnings', checked)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current API Version</label>
            <Input
              value={settings.currentVersion}
              onChange={(e) => handleInputChange('currentVersion', e.target.value)}
              placeholder="v1"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage API keys for external access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New API Key */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Create New API Key</h4>
            <div className="flex space-x-3">
              <Input
                placeholder="API Key Name"
                value={newApiKeyName}
                onChange={(e) => setNewApiKeyName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createApiKey} disabled={!newApiKeyName.trim()}>
                Create Key
              </Button>
            </div>
          </div>

          {/* Existing API Keys */}
          <div className="space-y-3">
            {settings.apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{apiKey.name}</h4>
                    <p className="text-sm text-gray-500">
                      Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={apiKey.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {apiKey.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={apiKey.enabled}
                      onCheckedChange={(checked) => updateApiKey(apiKey.id, { enabled: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        readOnly
                        value={showSecrets ? apiKey.key : maskSecret(apiKey.key)}
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Permissions</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {API_PERMISSIONS.map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={apiKey.permissions.includes(permission)}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...apiKey.permissions, permission]
                                : apiKey.permissions.filter(p => p !== permission);
                              updateApiKey(apiKey.id, { permissions: newPermissions });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete Key
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Webhook className="w-5 h-5 mr-2" />
            Webhooks
          </CardTitle>
          <CardDescription>
            Configure webhook endpoints for real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Webhook Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Retry Attempts</label>
              <Input
                type="number"
                min="0"
                max="10"
                value={settings.webhookRetries}
                onChange={(e) => handleInputChange('webhookRetries', parseInt(e.target.value) || 3)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timeout (seconds)</label>
              <Input
                type="number"
                min="5"
                max="60"
                value={settings.webhookTimeout}
                onChange={(e) => handleInputChange('webhookTimeout', parseInt(e.target.value) || 30)}
              />
            </div>
          </div>

          <Separator />

          {/* Create New Webhook */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Create New Webhook</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Webhook Name"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                />
                <Input
                  placeholder="Webhook URL"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                />
              </div>
              <Button onClick={createWebhook} disabled={!newWebhookName.trim() || !newWebhookUrl.trim()}>
                Create Webhook
              </Button>
            </div>
          </div>

          {/* Existing Webhooks */}
          <div className="space-y-3">
            {settings.webhooks.map((webhook) => (
              <div key={webhook.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{webhook.name}</h4>
                    <p className="text-sm text-gray-500 font-mono">{webhook.url}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={webhook.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {webhook.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={webhook.enabled}
                      onCheckedChange={(checked) => updateWebhook(webhook.id, { enabled: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Events</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {WEBHOOK_EVENTS.map(event => (
                        <div key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={webhook.events.includes(event)}
                            onChange={(e) => {
                              const newEvents = e.target.checked
                                ? [...webhook.events, event]
                                : webhook.events.filter(ev => ev !== event);
                              updateWebhook(webhook.id, { events: newEvents });
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook Secret</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        readOnly
                        value={showSecrets ? webhook.secret : maskSecret(webhook.secret)}
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(webhook.secret)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testWebhook(webhook.id)}
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Webhook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Google Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Google Services
          </CardTitle>
          <CardDescription>
            Configure Google Analytics, Maps, and other Google services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Google Analytics</span>
                <Switch
                  checked={settings.googleAnalyticsEnabled}
                  onCheckedChange={(checked) => handleInputChange('googleAnalyticsEnabled', checked)}
                />
              </div>
              {settings.googleAnalyticsEnabled && (
                <Input
                  placeholder="GA-123456789"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Google Maps</span>
                <Switch
                  checked={settings.googleMapsEnabled}
                  onCheckedChange={(checked) => handleInputChange('googleMapsEnabled', checked)}
                />
              </div>
              {settings.googleMapsEnabled && (
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  placeholder="Google Maps API Key"
                  value={showSecrets ? settings.googleMapsApiKey : maskSecret(settings.googleMapsApiKey)}
                  onChange={(e) => handleInputChange('googleMapsApiKey', e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Facebook Pixel</span>
                <Switch
                  checked={settings.facebookPixelEnabled}
                  onCheckedChange={(checked) => handleInputChange('facebookPixelEnabled', checked)}
                />
              </div>
              {settings.facebookPixelEnabled && (
                <Input
                  placeholder="Facebook Pixel ID"
                  value={settings.facebookPixelId}
                  onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Meta API</span>
                <Switch
                  checked={settings.metaApiEnabled}
                  onCheckedChange={(checked) => handleInputChange('metaApiEnabled', checked)}
                />
              </div>
              {settings.metaApiEnabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Meta App ID"
                    value={settings.metaAppId}
                    onChange={(e) => handleInputChange('metaAppId', e.target.value)}
                  />
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Meta App Secret"
                    value={showSecrets ? settings.metaAppSecret : maskSecret(settings.metaAppSecret)}
                    onChange={(e) => handleInputChange('metaAppSecret', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Social Media Integration
          </CardTitle>
          <CardDescription>
            Connect with social media platforms for sharing and marketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Facebook</span>
                </div>
                <Switch
                  checked={settings.facebookEnabled}
                  onCheckedChange={(checked) => handleInputChange('facebookEnabled', checked)}
                />
              </div>
              {settings.facebookEnabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Page ID"
                    value={settings.facebookPageId}
                    onChange={(e) => handleInputChange('facebookPageId', e.target.value)}
                  />
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Access Token"
                    value={showSecrets ? settings.facebookAccessToken : maskSecret(settings.facebookAccessToken)}
                    onChange={(e) => handleInputChange('facebookAccessToken', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Twitter */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Twitter</span>
                </div>
                <Switch
                  checked={settings.twitterEnabled}
                  onCheckedChange={(checked) => handleInputChange('twitterEnabled', checked)}
                />
              </div>
              {settings.twitterEnabled && (
                <div className="space-y-2">
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="API Key"
                    value={showSecrets ? settings.twitterApiKey : maskSecret(settings.twitterApiKey)}
                    onChange={(e) => handleInputChange('twitterApiKey', e.target.value)}
                  />
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="API Secret"
                    value={showSecrets ? settings.twitterApiSecret : maskSecret(settings.twitterApiSecret)}
                    onChange={(e) => handleInputChange('twitterApiSecret', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Instagram */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  <span className="font-medium">Instagram</span>
                </div>
                <Switch
                  checked={settings.instagramEnabled}
                  onCheckedChange={(checked) => handleInputChange('instagramEnabled', checked)}
                />
              </div>
              {settings.instagramEnabled && (
                <Input
                  placeholder="Business Account ID"
                  value={settings.instagramBusinessId}
                  onChange={(e) => handleInputChange('instagramBusinessId', e.target.value)}
                />
              )}
            </div>

            {/* YouTube */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Youtube className="w-5 h-5 text-red-600" />
                  <span className="font-medium">YouTube</span>
                </div>
                <Switch
                  checked={settings.youtubeEnabled}
                  onCheckedChange={(checked) => handleInputChange('youtubeEnabled', checked)}
                />
              </div>
              {settings.youtubeEnabled && (
                <Input
                  placeholder="Channel ID"
                  value={settings.youtubeChannelId}
                  onChange={(e) => handleInputChange('youtubeChannelId', e.target.value)}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            External Services
          </CardTitle>
          <CardDescription>
            Configure external service integrations for enhanced functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cloud Storage */}
          <div>
            <h4 className="font-medium mb-3">Cloud Storage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cloudinary */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Cloudinary</span>
                  <Switch
                    checked={settings.cloudinaryEnabled}
                    onCheckedChange={(checked) => handleInputChange('cloudinaryEnabled', checked)}
                  />
                </div>
                {settings.cloudinaryEnabled && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Cloud Name"
                      value={settings.cloudinaryCloudName}
                      onChange={(e) => handleInputChange('cloudinaryCloudName', e.target.value)}
                    />
                    <Input
                      placeholder="API Key"
                      value={settings.cloudinaryApiKey}
                      onChange={(e) => handleInputChange('cloudinaryApiKey', e.target.value)}
                    />
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      placeholder="API Secret"
                      value={showSecrets ? settings.cloudinaryApiSecret : maskSecret(settings.cloudinaryApiSecret)}
                      onChange={(e) => handleInputChange('cloudinaryApiSecret', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* AWS S3 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">AWS S3</span>
                  <Switch
                    checked={settings.awsS3Enabled}
                    onCheckedChange={(checked) => handleInputChange('awsS3Enabled', checked)}
                  />
                </div>
                {settings.awsS3Enabled && (
                  <div className="space-y-2">
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      placeholder="Access Key"
                      value={showSecrets ? settings.awsAccessKey : maskSecret(settings.awsAccessKey)}
                      onChange={(e) => handleInputChange('awsAccessKey', e.target.value)}
                    />
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      placeholder="Secret Key"
                      value={showSecrets ? settings.awsSecretKey : maskSecret(settings.awsSecretKey)}
                      onChange={(e) => handleInputChange('awsSecretKey', e.target.value)}
                    />
                    <Input
                      placeholder="Region"
                      value={settings.awsRegion}
                      onChange={(e) => handleInputChange('awsRegion', e.target.value)}
                    />
                    <Input
                      placeholder="Bucket Name"
                      value={settings.awsBucket}
                      onChange={(e) => handleInputChange('awsBucket', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Monitoring & Analytics */}
          <div>
            <h4 className="font-medium mb-3">Monitoring & Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sentry */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Sentry</span>
                  <Switch
                    checked={settings.sentryEnabled}
                    onCheckedChange={(checked) => handleInputChange('sentryEnabled', checked)}
                  />
                </div>
                {settings.sentryEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Sentry DSN"
                    value={showSecrets ? settings.sentryDsn : maskSecret(settings.sentryDsn)}
                    onChange={(e) => handleInputChange('sentryDsn', e.target.value)}
                  />
                )}
              </div>

              {/* Hotjar */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Hotjar</span>
                  <Switch
                    checked={settings.hotjarEnabled}
                    onCheckedChange={(checked) => handleInputChange('hotjarEnabled', checked)}
                  />
                </div>
                {settings.hotjarEnabled && (
                  <Input
                    placeholder="Hotjar Site ID"
                    value={settings.hotjarId}
                    onChange={(e) => handleInputChange('hotjarId', e.target.value)}
                  />
                )}
              </div>

              {/* Mixpanel */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Mixpanel</span>
                  <Switch
                    checked={settings.mixpanelEnabled}
                    onCheckedChange={(checked) => handleInputChange('mixpanelEnabled', checked)}
                  />
                </div>
                {settings.mixpanelEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Project Token"
                    value={showSecrets ? settings.mixpanelToken : maskSecret(settings.mixpanelToken)}
                    onChange={(e) => handleInputChange('mixpanelToken', e.target.value)}
                  />
                )}
              </div>

              {/* Datadog */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Datadog</span>
                  <Switch
                    checked={settings.datadogEnabled}
                    onCheckedChange={(checked) => handleInputChange('datadogEnabled', checked)}
                  />
                </div>
                {settings.datadogEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="API Key"
                    value={showSecrets ? settings.datadogApiKey : maskSecret(settings.datadogApiKey)}
                    onChange={(e) => handleInputChange('datadogApiKey', e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* External APIs */}
          <div>
            <h4 className="font-medium mb-3">External APIs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Data API */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Vehicle Data API</span>
                  <Switch
                    checked={settings.vehicleDataApiEnabled}
                    onCheckedChange={(checked) => handleInputChange('vehicleDataApiEnabled', checked)}
                  />
                </div>
                {settings.vehicleDataApiEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Vehicle Data API Key"
                    value={showSecrets ? settings.vehicleDataApiKey : maskSecret(settings.vehicleDataApiKey)}
                    onChange={(e) => handleInputChange('vehicleDataApiKey', e.target.value)}
                  />
                )}
              </div>

              {/* Currency API */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Currency Exchange API</span>
                  <Switch
                    checked={settings.currencyApiEnabled}
                    onCheckedChange={(checked) => handleInputChange('currencyApiEnabled', checked)}
                  />
                </div>
                {settings.currencyApiEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Currency API Key"
                    value={showSecrets ? settings.currencyApiKey : maskSecret(settings.currencyApiKey)}
                    onChange={(e) => handleInputChange('currencyApiKey', e.target.value)}
                  />
                )}
              </div>

              {/* Location API */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Location API</span>
                  <Switch
                    checked={settings.locationApiEnabled}
                    onCheckedChange={(checked) => handleInputChange('locationApiEnabled', checked)}
                  />
                </div>
                {settings.locationApiEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Location API Key"
                    value={showSecrets ? settings.locationApiKey : maskSecret(settings.locationApiKey)}
                    onChange={(e) => handleInputChange('locationApiKey', e.target.value)}
                  />
                )}
              </div>

              {/* Insurance API */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Insurance API</span>
                  <Switch
                    checked={settings.insuranceApiEnabled}
                    onCheckedChange={(checked) => handleInputChange('insuranceApiEnabled', checked)}
                  />
                </div>
                {settings.insuranceApiEnabled && (
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    placeholder="Insurance API Key"
                    value={showSecrets ? settings.insuranceApiKey : maskSecret(settings.insuranceApiKey)}
                    onChange={(e) => handleInputChange('insuranceApiKey', e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}