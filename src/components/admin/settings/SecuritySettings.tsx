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
  Shield,
  Lock,
  Key,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  Mail,
  Ban
} from 'lucide-react';

interface SecuritySettingsData {
  // Password Policy
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiryDays: number;
  preventPasswordReuse: number;

  // Two-Factor Authentication
  twoFactorEnabled: boolean;
  twoFactorRequired: boolean;
  supportedTwoFactorMethods: string[];

  // Session Management
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  rememberMeEnabled: boolean;
  rememberMeDuration: number;

  // Account Security
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  suspiciousActivityDetection: boolean;
  emailVerificationRequired: boolean;
  phoneVerificationRequired: boolean;

  // IP & Access Control
  ipWhitelistEnabled: boolean;
  ipWhitelist: string;
  ipBlacklistEnabled: boolean;
  ipBlacklist: string;
  geoBlockingEnabled: boolean;
  allowedCountries: string[];

  // Rate Limiting
  rateLimitingEnabled: boolean;
  apiRateLimit: number;
  loginRateLimit: number;
  registrationRateLimit: number;

  // Security Monitoring
  securityLoggingEnabled: boolean;
  failedLoginNotifications: boolean;
  adminLoginNotifications: boolean;
  dataBreachProtection: boolean;
  intrusionDetection: boolean;

  // Data Protection
  dataEncryptionEnabled: boolean;
  anonymizeUserData: boolean;
  dataRetentionDays: number;
  automaticBackups: boolean;
}

const TWO_FACTOR_METHODS = [
  { value: 'email', label: 'Email OTP' },
  { value: 'sms', label: 'SMS OTP' },
  { value: 'authenticator', label: 'Authenticator App' },
  { value: 'backup_codes', label: 'Backup Codes' }
];

const COUNTRIES = [
  { value: 'NA', label: 'Namibia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'BW', label: 'Botswana' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' }
];

export default function SecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettingsData>({
    // Password Policy
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    preventPasswordReuse: 5,

    // Two-Factor Authentication
    twoFactorEnabled: true,
    twoFactorRequired: false,
    supportedTwoFactorMethods: ['email', 'sms'],

    // Session Management
    sessionTimeoutMinutes: 30,
    maxConcurrentSessions: 3,
    rememberMeEnabled: true,
    rememberMeDuration: 30,

    // Account Security
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    suspiciousActivityDetection: true,
    emailVerificationRequired: true,
    phoneVerificationRequired: false,

    // IP & Access Control
    ipWhitelistEnabled: false,
    ipWhitelist: '',
    ipBlacklistEnabled: false,
    ipBlacklist: '',
    geoBlockingEnabled: false,
    allowedCountries: ['NA', 'ZA', 'BW'],

    // Rate Limiting
    rateLimitingEnabled: true,
    apiRateLimit: 100,
    loginRateLimit: 5,
    registrationRateLimit: 3,

    // Security Monitoring
    securityLoggingEnabled: true,
    failedLoginNotifications: true,
    adminLoginNotifications: true,
    dataBreachProtection: true,
    intrusionDetection: true,

    // Data Protection
    dataEncryptionEnabled: true,
    anonymizeUserData: false,
    dataRetentionDays: 2555, // 7 years
    automaticBackups: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleInputChange = (field: keyof SecuritySettingsData, value: string | number | boolean | string[]) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleTwoFactorMethodToggle = (method: string) => {
    const currentMethods = settings.supportedTwoFactorMethods;
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];

    handleInputChange('supportedTwoFactorMethods', newMethods);
  };

  const handleCountryToggle = (country: string) => {
    const currentCountries = settings.allowedCountries;
    const newCountries = currentCountries.includes(country)
      ? currentCountries.filter(c => c !== country)
      : [...currentCountries, country];

    handleInputChange('allowedCountries', newCountries);
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

  const getSecurityScore = () => {
    let score = 0;
    if (settings.twoFactorEnabled) score += 20;
    if (settings.rateLimitingEnabled) score += 15;
    if (settings.securityLoggingEnabled) score += 15;
    if (settings.dataEncryptionEnabled) score += 20;
    if (settings.suspiciousActivityDetection) score += 10;
    if (settings.minPasswordLength >= 12) score += 10;
    if (settings.requireSpecialChars && settings.requireNumbers) score += 10;
    return Math.min(score, 100);
  };

  const securityScore = getSecurityScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
          <p className="text-gray-600">Configure security policies and access controls</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Security Score</p>
            <Badge className={getScoreColor(securityScore)}>
              {securityScore}/100
            </Badge>
          </div>
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
            Security settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Warnings */}
      {!settings.twoFactorEnabled && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Two-factor authentication is disabled. This significantly reduces platform security.
          </AlertDescription>
        </Alert>
      )}

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Password Policy
          </CardTitle>
          <CardDescription>
            Configure password requirements and security rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Password Length</label>
              <Input
                type="number"
                min="6"
                max="50"
                value={settings.minPasswordLength}
                onChange={(e) => handleInputChange('minPasswordLength', parseInt(e.target.value) || 6)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password Expiry (Days)</label>
              <Input
                type="number"
                min="0"
                value={settings.passwordExpiryDays}
                onChange={(e) => handleInputChange('passwordExpiryDays', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">0 = Never expires</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Password Requirements</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Uppercase Letters</span>
                  <Switch
                    checked={settings.requireUppercase}
                    onCheckedChange={(checked) => handleInputChange('requireUppercase', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Lowercase Letters</span>
                  <Switch
                    checked={settings.requireLowercase}
                    onCheckedChange={(checked) => handleInputChange('requireLowercase', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Numbers</span>
                  <Switch
                    checked={settings.requireNumbers}
                    onCheckedChange={(checked) => handleInputChange('requireNumbers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require Special Characters</span>
                  <Switch
                    checked={settings.requireSpecialChars}
                    onCheckedChange={(checked) => handleInputChange('requireSpecialChars', checked)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prevent Password Reuse</label>
              <Input
                type="number"
                min="0"
                max="20"
                value={settings.preventPasswordReuse}
                onChange={(e) => handleInputChange('preventPasswordReuse', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Number of previous passwords to remember</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Configure multi-factor authentication options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Enable Two-Factor Authentication</span>
              <p className="text-sm text-gray-500">Allow users to enable 2FA on their accounts</p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) => handleInputChange('twoFactorEnabled', checked)}
            />
          </div>

          {settings.twoFactorEnabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Require Two-Factor Authentication</span>
                  <p className="text-sm text-gray-500">Make 2FA mandatory for all users</p>
                </div>
                <Switch
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleInputChange('twoFactorRequired', checked)}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3">Supported Methods</h4>
                <div className="grid grid-cols-2 gap-3">
                  {TWO_FACTOR_METHODS.map(method => (
                    <div key={method.value} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{method.label}</span>
                      <Switch
                        checked={settings.supportedTwoFactorMethods.includes(method.value)}
                        onCheckedChange={() => handleTwoFactorMethodToggle(method.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Session Management
          </CardTitle>
          <CardDescription>
            Configure user session behavior and timeouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Session Timeout (Minutes)</label>
              <Input
                type="number"
                min="5"
                max="480"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => handleInputChange('sessionTimeoutMinutes', parseInt(e.target.value) || 30)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Concurrent Sessions</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={settings.maxConcurrentSessions}
                onChange={(e) => handleInputChange('maxConcurrentSessions', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Enable "Remember Me"</span>
              <p className="text-sm text-gray-500">Allow users to stay logged in longer</p>
            </div>
            <Switch
              checked={settings.rememberMeEnabled}
              onCheckedChange={(checked) => handleInputChange('rememberMeEnabled', checked)}
            />
          </div>

          {settings.rememberMeEnabled && (
            <div>
              <label className="block text-sm font-medium mb-2">Remember Me Duration (Days)</label>
              <Input
                type="number"
                min="1"
                max="365"
                value={settings.rememberMeDuration}
                onChange={(e) => handleInputChange('rememberMeDuration', parseInt(e.target.value) || 30)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" />
            Account Security
          </CardTitle>
          <CardDescription>
            Configure account protection and verification settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
              <Input
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lockout Duration (Minutes)</label>
              <Input
                type="number"
                min="5"
                max="1440"
                value={settings.lockoutDurationMinutes}
                onChange={(e) => handleInputChange('lockoutDurationMinutes', parseInt(e.target.value) || 15)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Security Features</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Suspicious Activity Detection</span>
                  <Switch
                    checked={settings.suspiciousActivityDetection}
                    onCheckedChange={(checked) => handleInputChange('suspiciousActivityDetection', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Verification Requirements</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verification</span>
                  <Switch
                    checked={settings.emailVerificationRequired}
                    onCheckedChange={(checked) => handleInputChange('emailVerificationRequired', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verification</span>
                  <Switch
                    checked={settings.phoneVerificationRequired}
                    onCheckedChange={(checked) => handleInputChange('phoneVerificationRequired', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP & Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            IP & Access Control
          </CardTitle>
          <CardDescription>
            Configure IP-based access restrictions and geographic blocking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">IP Whitelist</span>
                <Switch
                  checked={settings.ipWhitelistEnabled}
                  onCheckedChange={(checked) => handleInputChange('ipWhitelistEnabled', checked)}
                />
              </div>
              {settings.ipWhitelistEnabled && (
                <Textarea
                  placeholder="Enter IP addresses or ranges, one per line&#10;192.168.1.1&#10;192.168.1.0/24"
                  value={settings.ipWhitelist}
                  onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
                  rows={4}
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">IP Blacklist</span>
                <Switch
                  checked={settings.ipBlacklistEnabled}
                  onCheckedChange={(checked) => handleInputChange('ipBlacklistEnabled', checked)}
                />
              </div>
              {settings.ipBlacklistEnabled && (
                <Textarea
                  placeholder="Enter IP addresses or ranges to block, one per line&#10;192.168.1.100&#10;10.0.0.0/8"
                  value={settings.ipBlacklist}
                  onChange={(e) => handleInputChange('ipBlacklist', e.target.value)}
                  rows={4}
                />
              )}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-medium">Geographic Blocking</span>
                <p className="text-sm text-gray-500">Restrict access by country</p>
              </div>
              <Switch
                checked={settings.geoBlockingEnabled}
                onCheckedChange={(checked) => handleInputChange('geoBlockingEnabled', checked)}
              />
            </div>

            {settings.geoBlockingEnabled && (
              <div>
                <h4 className="font-medium mb-3">Allowed Countries</h4>
                <div className="grid grid-cols-3 gap-2">
                  {COUNTRIES.map(country => (
                    <div key={country.value} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{country.label}</span>
                      <Switch
                        checked={settings.allowedCountries.includes(country.value)}
                        onCheckedChange={() => handleCountryToggle(country.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ban className="w-5 h-5 mr-2" />
            Rate Limiting
          </CardTitle>
          <CardDescription>
            Configure request rate limits to prevent abuse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Enable Rate Limiting</span>
              <p className="text-sm text-gray-500">Limit the number of requests per time period</p>
            </div>
            <Switch
              checked={settings.rateLimitingEnabled}
              onCheckedChange={(checked) => handleInputChange('rateLimitingEnabled', checked)}
            />
          </div>

          {settings.rateLimitingEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">API Rate Limit (per minute)</label>
                <Input
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.apiRateLimit}
                  onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value) || 100)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Login Attempts (per minute)</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.loginRateLimit}
                  onChange={(e) => handleInputChange('loginRateLimit', parseInt(e.target.value) || 5)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Registration (per hour)</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.registrationRateLimit}
                  onChange={(e) => handleInputChange('registrationRateLimit', parseInt(e.target.value) || 3)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Monitoring
          </CardTitle>
          <CardDescription>
            Configure security logging and monitoring features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Monitoring Features</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Logging</span>
                  <Switch
                    checked={settings.securityLoggingEnabled}
                    onCheckedChange={(checked) => handleInputChange('securityLoggingEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Intrusion Detection</span>
                  <Switch
                    checked={settings.intrusionDetection}
                    onCheckedChange={(checked) => handleInputChange('intrusionDetection', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Breach Protection</span>
                  <Switch
                    checked={settings.dataBreachProtection}
                    onCheckedChange={(checked) => handleInputChange('dataBreachProtection', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Notifications</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Failed Login Alerts</span>
                  <Switch
                    checked={settings.failedLoginNotifications}
                    onCheckedChange={(checked) => handleInputChange('failedLoginNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admin Login Alerts</span>
                  <Switch
                    checked={settings.adminLoginNotifications}
                    onCheckedChange={(checked) => handleInputChange('adminLoginNotifications', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Data Protection
          </CardTitle>
          <CardDescription>
            Configure data encryption and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Encryption & Privacy</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Encryption</span>
                  <Switch
                    checked={settings.dataEncryptionEnabled}
                    onCheckedChange={(checked) => handleInputChange('dataEncryptionEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anonymize User Data</span>
                  <Switch
                    checked={settings.anonymizeUserData}
                    onCheckedChange={(checked) => handleInputChange('anonymizeUserData', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automatic Backups</span>
                  <Switch
                    checked={settings.automaticBackups}
                    onCheckedChange={(checked) => handleInputChange('automaticBackups', checked)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Retention Period (Days)</label>
              <Input
                type="number"
                min="30"
                max="3650"
                value={settings.dataRetentionDays}
                onChange={(e) => handleInputChange('dataRetentionDays', parseInt(e.target.value) || 365)}
              />
              <p className="text-xs text-gray-500 mt-1">How long to keep inactive user data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}