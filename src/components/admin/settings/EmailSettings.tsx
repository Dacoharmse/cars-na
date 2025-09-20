'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { Separator } from '@/components/ui/Separator';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import {
  Mail,
  Send,
  Settings,
  Phone,
  MessageSquare,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  TestTube,
  AlertTriangle,
  Edit,
  Copy,
  Bell,
  Users,
  Server,
  Key,
  Shield
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  enabled: boolean;
  type: 'user' | 'dealer' | 'admin';
}

interface EmailSettingsData {
  // SMTP Configuration
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: 'none' | 'tls' | 'ssl';
  smtpFromEmail: string;
  smtpFromName: string;
  smtpReplyTo: string;

  // Email Service Providers
  sendgridEnabled: boolean;
  sendgridApiKey: string;
  mailgunEnabled: boolean;
  mailgunApiKey: string;
  mailgunDomain: string;

  // Email Templates
  emailTemplates: EmailTemplate[];

  // Notification Settings
  welcomeEmailEnabled: boolean;
  verificationEmailEnabled: boolean;
  passwordResetEnabled: boolean;
  dealerApplicationEnabled: boolean;
  listingApprovalEnabled: boolean;
  leadNotificationEnabled: boolean;
  paymentConfirmationEnabled: boolean;
  subscriptionNotificationEnabled: boolean;

  // Admin Notifications
  adminNewUserNotification: boolean;
  adminNewDealerNotification: boolean;
  adminNewListingNotification: boolean;
  adminPaymentNotification: boolean;
  adminSystemAlertNotification: boolean;

  // WhatsApp Integration
  whatsappEnabled: boolean;
  whatsappApiKey: string;
  whatsappPhoneNumber: string;
  whatsappBusinessId: string;

  // SMS Configuration
  smsEnabled: boolean;
  smsProvider: 'twilio' | 'nexmo' | 'local';
  smsApiKey: string;
  smsApiSecret: string;
  smsFromNumber: string;

  // Email Limits & Throttling
  dailyEmailLimit: number;
  hourlyEmailLimit: number;
  emailThrottling: boolean;
  bounceHandling: boolean;
  unsubscribeHandling: boolean;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Cars.na!',
    content: `Dear {{name}},

Welcome to Cars.na, Namibia's premier automotive marketplace!

Your account has been successfully created. You can now:
- Browse thousands of vehicles
- Contact dealers directly
- Save your favorite listings
- Get real-time updates on new vehicles

Best regards,
The Cars.na Team`,
    enabled: true,
    type: 'user'
  },
  {
    id: 'verification',
    name: 'Email Verification',
    subject: 'Verify your Cars.na account',
    content: `Hi {{name}},

Please verify your email address by clicking the link below:

{{verification_link}}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
The Cars.na Team`,
    enabled: true,
    type: 'user'
  },
  {
    id: 'dealer_application',
    name: 'Dealer Application Received',
    subject: 'Your dealer application has been received',
    content: `Dear {{name}},

Thank you for applying to become a dealer on Cars.na.

Your application is currently being reviewed by our team. We will get back to you within 2-3 business days.

Application Reference: {{application_id}}

Best regards,
The Cars.na Team`,
    enabled: true,
    type: 'dealer'
  },
  {
    id: 'listing_approved',
    name: 'Listing Approved',
    subject: 'Your vehicle listing has been approved',
    content: `Hi {{dealer_name}},

Great news! Your vehicle listing has been approved and is now live on Cars.na.

Vehicle: {{vehicle_title}}
Listing ID: {{listing_id}}
View Listing: {{listing_url}}

Best regards,
The Cars.na Team`,
    enabled: true,
    type: 'dealer'
  },
  {
    id: 'new_lead',
    name: 'New Lead Notification',
    subject: 'New lead for {{vehicle_title}}',
    content: `Hi {{dealer_name}},

You have received a new lead for your vehicle listing.

Vehicle: {{vehicle_title}}
Customer: {{customer_name}}
Phone: {{customer_phone}}
Email: {{customer_email}}
Message: {{customer_message}}

Please respond to this lead as soon as possible.

Best regards,
The Cars.na Team`,
    enabled: true,
    type: 'dealer'
  }
];

export default function EmailSettings() {
  // Additional state for email testing
  const [testEmail, setTestEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    template: string;
    success: boolean;
    error?: string;
    timestamp: string;
  }>>([]);

  const [connectionStatus, setConnectionStatus] = useState({
    smtp: false,
    auth: false
  });

  const [emailStats, setEmailStats] = useState({
    dailySent: 0,
    hourlySent: 0
  });

  const [emailLogs, setEmailLogs] = useState<Array<{
    id: string;
    recipient: string;
    subject: string;
    status: 'sent' | 'failed' | 'pending';
    timestamp: string;
  }>>([]);

  const [settings, setSettings] = useState<EmailSettingsData>({
    // SMTP Configuration
    smtpEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    smtpFromEmail: 'noreply@cars.na',
    smtpFromName: 'Cars.na',
    smtpReplyTo: 'support@cars.na',

    // Email Service Providers
    sendgridEnabled: false,
    sendgridApiKey: '',
    mailgunEnabled: false,
    mailgunApiKey: '',
    mailgunDomain: '',

    // Email Templates
    emailTemplates: DEFAULT_TEMPLATES,

    // Notification Settings
    welcomeEmailEnabled: true,
    verificationEmailEnabled: true,
    passwordResetEnabled: true,
    dealerApplicationEnabled: true,
    listingApprovalEnabled: true,
    leadNotificationEnabled: true,
    paymentConfirmationEnabled: true,
    subscriptionNotificationEnabled: true,

    // Admin Notifications
    adminNewUserNotification: true,
    adminNewDealerNotification: true,
    adminNewListingNotification: false,
    adminPaymentNotification: true,
    adminSystemAlertNotification: true,

    // WhatsApp Integration
    whatsappEnabled: false,
    whatsappApiKey: '',
    whatsappPhoneNumber: '',
    whatsappBusinessId: '',

    // SMS Configuration
    smsEnabled: false,
    smsProvider: 'twilio',
    smsApiKey: '',
    smsApiSecret: '',
    smsFromNumber: '',

    // Email Limits & Throttling
    dailyEmailLimit: 10000,
    hourlyEmailLimit: 500,
    emailThrottling: true,
    bounceHandling: true,
    unsubscribeHandling: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const handleInputChange = (field: keyof EmailSettingsData, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleTemplateUpdate = (templateId: string, updates: Partial<EmailTemplate>) => {
    setSettings(prev => ({
      ...prev,
      emailTemplates: prev.emailTemplates.map(template =>
        template.id === templateId ? { ...template, ...updates } : template
      )
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

  const testEmailConfiguration = async () => {
    if (!testEmailAddress) return;

    try {
      // TODO: Implement email test functionality
      console.log(`Testing email configuration by sending to ${testEmailAddress}`);
    } catch (error) {
      console.error('Email test failed:', error);
    }
  };

  const maskSecret = (secret: string) => {
    if (!secret) return '';
    return secret.substring(0, 8) + '•'.repeat(Math.max(0, secret.length - 8));
  };

  // Email testing functions
  const checkEmailServiceStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const response = await fetch('/api/email/test');
      const data = await response.json();

      setConnectionStatus({
        smtp: response.ok,
        auth: response.ok
      });

      // Update email stats
      setEmailStats({
        dailySent: Math.floor(Math.random() * 100),
        hourlySent: Math.floor(Math.random() * 20)
      });
    } catch (error) {
      console.error('Failed to check email service status:', error);
      setConnectionStatus({ smtp: false, auth: false });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) return;

    setIsSendingTest(true);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testEmail,
          template: selectedTemplate
        }),
      });

      const result = await response.json();

      const testResult = {
        template: selectedTemplate,
        success: response.ok,
        error: response.ok ? undefined : result.error,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 4)]);

      // Add to email logs
      const logEntry = {
        id: Date.now().toString(),
        recipient: testEmail,
        subject: `Test: ${selectedTemplate}`,
        status: response.ok ? 'sent' : 'failed' as const,
        timestamp: new Date().toISOString()
      };

      setEmailLogs(prev => [logEntry, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Failed to send test email:', error);
      setTestResults(prev => [{
        template: selectedTemplate,
        success: false,
        error: 'Network error',
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
    } finally {
      setIsSendingTest(false);
    }
  };

  const testAllTemplates = async () => {
    if (!testEmail) return;

    const templates = ['welcome', 'verification', 'login_notification', 'password_reset', 'dealer_approval'];

    for (const template of templates) {
      setSelectedTemplate(template);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
      await sendTestEmail();
    }
  };

  const exportConfiguration = () => {
    const configToExport = {
      ...settings,
      smtpPassword: '', // Don't export sensitive data
      sendgridApiKey: '',
      mailgunApiKey: '',
      smsApiKey: '',
      smsApiSecret: '',
      whatsappApiKey: ''
    };

    const blob = new Blob([JSON.stringify(configToExport, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cars-na-email-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings(prev => ({
          ...prev,
          ...imported,
          // Keep current sensitive data
          smtpPassword: prev.smtpPassword,
          sendgridApiKey: prev.sendgridApiKey,
          mailgunApiKey: prev.mailgunApiKey
        }));
        console.log('Configuration imported successfully');
      } catch (error) {
        console.error('Failed to import configuration:', error);
      }
    };
    reader.readAsText(file);
  };

  // Load initial data
  useEffect(() => {
    checkEmailServiceStatus();

    // Mock some email logs
    setEmailLogs([
      {
        id: '1',
        recipient: 'user@example.com',
        subject: 'Welcome to Cars.na!',
        status: 'sent',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        recipient: 'dealer@motors.na',
        subject: 'New vehicle inquiry',
        status: 'sent',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '3',
        recipient: 'customer@email.com',
        subject: 'Password reset request',
        status: 'failed',
        timestamp: new Date(Date.now() - 10800000).toISOString()
      }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Settings</h2>
          <p className="text-gray-600">Configure email delivery, templates, and communication settings</p>
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
            Email settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Warning for disabled email */}
      {!settings.smtpEnabled && !settings.sendgridEnabled && !settings.mailgunEnabled && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No email service is enabled. Users will not receive email notifications.
          </AlertDescription>
        </Alert>
      )}

      {/* Email Service Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Service Configuration
          </CardTitle>
          <CardDescription>
            Configure your email delivery method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SMTP Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">SMTP Server</h4>
                <p className="text-sm text-gray-500">Use your own SMTP server or email provider</p>
              </div>
              <Switch
                checked={settings.smtpEnabled}
                onCheckedChange={(checked) => handleInputChange('smtpEnabled', checked)}
              />
            </div>

            {settings.smtpEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Host</label>
                    <Input
                      value={settings.smtpHost}
                      onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Port</label>
                    <Input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value) || 587)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <Input
                      value={settings.smtpUsername}
                      onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      value={showSecrets ? settings.smtpPassword : maskSecret(settings.smtpPassword)}
                      onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                      placeholder="Your email password or app password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Encryption</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={settings.smtpEncryption}
                      onChange={(e) => handleInputChange('smtpEncryption', e.target.value as 'none' | 'tls' | 'ssl')}
                    >
                      <option value="none">None</option>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From Email</label>
                    <Input
                      type="email"
                      value={settings.smtpFromEmail}
                      onChange={(e) => handleInputChange('smtpFromEmail', e.target.value)}
                      placeholder="noreply@cars.na"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">From Name</label>
                    <Input
                      value={settings.smtpFromName}
                      onChange={(e) => handleInputChange('smtpFromName', e.target.value)}
                      placeholder="Cars.na"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reply-To Email</label>
                  <Input
                    type="email"
                    value={settings.smtpReplyTo}
                    onChange={(e) => handleInputChange('smtpReplyTo', e.target.value)}
                    placeholder="support@cars.na"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SendGrid Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">SendGrid</h4>
                <p className="text-sm text-gray-500">Professional email delivery service</p>
              </div>
              <Switch
                checked={settings.sendgridEnabled}
                onCheckedChange={(checked) => handleInputChange('sendgridEnabled', checked)}
              />
            </div>

            {settings.sendgridEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">SendGrid API Key</label>
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={showSecrets ? settings.sendgridApiKey : maskSecret(settings.sendgridApiKey)}
                  onChange={(e) => handleInputChange('sendgridApiKey', e.target.value)}
                  placeholder="SG...."
                />
              </div>
            )}
          </div>

          {/* Mailgun Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Mailgun</h4>
                <p className="text-sm text-gray-500">Email delivery for developers</p>
              </div>
              <Switch
                checked={settings.mailgunEnabled}
                onCheckedChange={(checked) => handleInputChange('mailgunEnabled', checked)}
              />
            </div>

            {settings.mailgunEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mailgun API Key</label>
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    value={showSecrets ? settings.mailgunApiKey : maskSecret(settings.mailgunApiKey)}
                    onChange={(e) => handleInputChange('mailgunApiKey', e.target.value)}
                    placeholder="key-..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mailgun Domain</label>
                  <Input
                    value={settings.mailgunDomain}
                    onChange={(e) => handleInputChange('mailgunDomain', e.target.value)}
                    placeholder="mg.cars.na"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Email Configuration */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-3">Test Email Configuration</h4>
            <div className="flex space-x-3">
              <Input
                type="email"
                placeholder="test@example.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="flex-1"
              />
              <Button onClick={testEmailConfiguration} disabled={!testEmailAddress}>
                <TestTube className="w-4 h-4 mr-2" />
                Send Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Customize email templates for different notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {settings.emailTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={template.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {template.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={template.enabled}
                      onCheckedChange={(checked) => handleTemplateUpdate(template.id, { enabled: checked })}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 line-clamp-3">
                  {template.content.split('\n').slice(0, 3).join(' ')}...
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Template Editor Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Email Template</h3>
              <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject Line</label>
                <Input
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Content</label>
                <Textarea
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  rows={12}
                  placeholder="Email content with {{variables}}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available variables: {'{{name}}'}, {'{{email}}'}, {'{{verification_link}}'}, {'{{listing_url}}'}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  handleTemplateUpdate(editingTemplate.id, editingTemplate);
                  setEditingTemplate(null);
                }}>
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure which email notifications to send
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">User Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Welcome Email</span>
                  <Switch
                    checked={settings.welcomeEmailEnabled}
                    onCheckedChange={(checked) => handleInputChange('welcomeEmailEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verification</span>
                  <Switch
                    checked={settings.verificationEmailEnabled}
                    onCheckedChange={(checked) => handleInputChange('verificationEmailEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password Reset</span>
                  <Switch
                    checked={settings.passwordResetEnabled}
                    onCheckedChange={(checked) => handleInputChange('passwordResetEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Confirmation</span>
                  <Switch
                    checked={settings.paymentConfirmationEnabled}
                    onCheckedChange={(checked) => handleInputChange('paymentConfirmationEnabled', checked)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Dealer Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Application Received</span>
                  <Switch
                    checked={settings.dealerApplicationEnabled}
                    onCheckedChange={(checked) => handleInputChange('dealerApplicationEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Listing Approval</span>
                  <Switch
                    checked={settings.listingApprovalEnabled}
                    onCheckedChange={(checked) => handleInputChange('listingApprovalEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Lead</span>
                  <Switch
                    checked={settings.leadNotificationEnabled}
                    onCheckedChange={(checked) => handleInputChange('leadNotificationEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subscription Updates</span>
                  <Switch
                    checked={settings.subscriptionNotificationEnabled}
                    onCheckedChange={(checked) => handleInputChange('subscriptionNotificationEnabled', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Admin Notifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">New User Registration</span>
                <Switch
                  checked={settings.adminNewUserNotification}
                  onCheckedChange={(checked) => handleInputChange('adminNewUserNotification', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Dealer Application</span>
                <Switch
                  checked={settings.adminNewDealerNotification}
                  onCheckedChange={(checked) => handleInputChange('adminNewDealerNotification', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New Listing</span>
                <Switch
                  checked={settings.adminNewListingNotification}
                  onCheckedChange={(checked) => handleInputChange('adminNewListingNotification', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Received</span>
                <Switch
                  checked={settings.adminPaymentNotification}
                  onCheckedChange={(checked) => handleInputChange('adminPaymentNotification', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            WhatsApp Business Integration
          </CardTitle>
          <CardDescription>
            Configure WhatsApp Business API for messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Enable WhatsApp Integration</span>
              <p className="text-sm text-gray-500">Send notifications via WhatsApp Business API</p>
            </div>
            <Switch
              checked={settings.whatsappEnabled}
              onCheckedChange={(checked) => handleInputChange('whatsappEnabled', checked)}
            />
          </div>

          {settings.whatsappEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp API Key</label>
                <Input
                  type={showSecrets ? 'text' : 'password'}
                  value={showSecrets ? settings.whatsappApiKey : maskSecret(settings.whatsappApiKey)}
                  onChange={(e) => handleInputChange('whatsappApiKey', e.target.value)}
                  placeholder="WhatsApp Business API Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Phone Number</label>
                <Input
                  value={settings.whatsappPhoneNumber}
                  onChange={(e) => handleInputChange('whatsappPhoneNumber', e.target.value)}
                  placeholder="+264812345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business ID</label>
                <Input
                  value={settings.whatsappBusinessId}
                  onChange={(e) => handleInputChange('whatsappBusinessId', e.target.value)}
                  placeholder="WhatsApp Business ID"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SMS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            SMS Configuration
          </CardTitle>
          <CardDescription>
            Configure SMS notifications and verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Enable SMS Notifications</span>
              <p className="text-sm text-gray-500">Send SMS for verification and alerts</p>
            </div>
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => handleInputChange('smsEnabled', checked)}
            />
          </div>

          {settings.smsEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">SMS Provider</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={settings.smsProvider}
                  onChange={(e) => handleInputChange('smsProvider', e.target.value as 'twilio' | 'nexmo' | 'local')}
                >
                  <option value="twilio">Twilio</option>
                  <option value="nexmo">Vonage (Nexmo)</option>
                  <option value="local">Local SMS Gateway</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    value={showSecrets ? settings.smsApiKey : maskSecret(settings.smsApiKey)}
                    onChange={(e) => handleInputChange('smsApiKey', e.target.value)}
                    placeholder="SMS API Key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Secret</label>
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    value={showSecrets ? settings.smsApiSecret : maskSecret(settings.smsApiSecret)}
                    onChange={(e) => handleInputChange('smsApiSecret', e.target.value)}
                    placeholder="SMS API Secret"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">From Number</label>
                <Input
                  value={settings.smsFromNumber}
                  onChange={(e) => handleInputChange('smsFromNumber', e.target.value)}
                  placeholder="+264812345678"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Limits & Throttling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Email Limits & Throttling
          </CardTitle>
          <CardDescription>
            Configure email sending limits and delivery settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Daily Email Limit</label>
              <Input
                type="number"
                min="100"
                max="100000"
                value={settings.dailyEmailLimit}
                onChange={(e) => handleInputChange('dailyEmailLimit', parseInt(e.target.value) || 10000)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hourly Email Limit</label>
              <Input
                type="number"
                min="10"
                max="5000"
                value={settings.hourlyEmailLimit}
                onChange={(e) => handleInputChange('hourlyEmailLimit', parseInt(e.target.value) || 500)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Email Throttling</span>
                <p className="text-sm text-gray-500">Rate limit email sending</p>
              </div>
              <Switch
                checked={settings.emailThrottling}
                onCheckedChange={(checked) => handleInputChange('emailThrottling', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Bounce Handling</span>
                <p className="text-sm text-gray-500">Handle bounced emails</p>
              </div>
              <Switch
                checked={settings.bounceHandling}
                onCheckedChange={(checked) => handleInputChange('bounceHandling', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Unsubscribe Handling</span>
                <p className="text-sm text-gray-500">Process unsubscribe requests</p>
              </div>
              <Switch
                checked={settings.unsubscribeHandling}
                onCheckedChange={(checked) => handleInputChange('unsubscribeHandling', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Testing & Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Email Testing & Status
          </CardTitle>
          <CardDescription>
            Test email functionality and check service status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Status */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Server className="w-4 h-4 mr-2" />
              Service Status
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SMTP Connection</span>
                  <Badge variant={connectionStatus.smtp ? 'default' : 'destructive'}>
                    {connectionStatus.smtp ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.smtpHost}:{settings.smtpPort}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication</span>
                  <Badge variant={connectionStatus.auth ? 'default' : 'destructive'}>
                    {connectionStatus.auth ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.smtpUsername}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Daily Emails Sent</span>
                  <Badge variant="outline">
                    {emailStats.dailySent}/{settings.dailyEmailLimit}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((emailStats.dailySent / settings.dailyEmailLimit) * 100)}% of limit
                </p>
              </div>
            </div>

            <Button
              onClick={checkEmailServiceStatus}
              disabled={isCheckingStatus}
              size="sm"
              variant="outline"
            >
              {isCheckingStatus ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Check Status
            </Button>
          </div>

          <Separator />

          {/* Test Email Sending */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Send Test Email
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Test Email Address</label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Template</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="welcome">Welcome Email</option>
                  <option value="verification">Email Verification</option>
                  <option value="login_notification">Login Notification</option>
                  <option value="password_reset">Password Reset</option>
                  <option value="dealer_approval">Dealer Approval</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={sendTestEmail}
                disabled={isSendingTest || !testEmail}
                size="sm"
              >
                {isSendingTest ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Test Email
              </Button>

              <Button
                onClick={testAllTemplates}
                disabled={isSendingTest || !testEmail}
                size="sm"
                variant="outline"
              >
                Test All Templates
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Test Results:</h5>
                {testResults.map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{result.template}</span>
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'Sent' : 'Failed'}
                      </Badge>
                    </div>
                    {result.error && (
                      <p className="text-xs text-red-500 mt-1">{result.error}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Email Logs */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Recent Email Activity
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {emailLogs.map((log) => (
                <div key={log.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{log.subject}</p>
                      <p className="text-xs text-gray-500">To: {log.recipient}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.status === 'sent' ? 'default' : log.status === 'failed' ? 'destructive' : 'secondary'}>
                        {log.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Backup/Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Configuration Management
          </CardTitle>
          <CardDescription>
            Backup and restore email configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={exportConfiguration}
              size="sm"
              variant="outline"
            >
              <Copy className="w-4 h-4 mr-2" />
              Export Configuration
            </Button>

            <Button
              onClick={() => document.getElementById('config-import')?.click()}
              size="sm"
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Import Configuration
            </Button>

            <input
              id="config-import"
              type="file"
              accept=".json"
              onChange={importConfiguration}
              className="hidden"
            />
          </div>

          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Configuration exports may contain sensitive information. Store securely and never share publicly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}