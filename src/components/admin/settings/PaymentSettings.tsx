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
  CreditCard,
  DollarSign,
  FileText,
  Settings,
  CheckCircle2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  Receipt,
  Percent,
  Globe,
  Calculator
} from 'lucide-react';

interface PaymentSettingsData {
  // Payment Gateways
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalClientSecret: string;
  paypalSandboxMode: boolean;

  // Commission & Pricing
  commissionType: 'percentage' | 'fixed';
  commissionRate: number;
  commissionFixed: number;
  minimumCommission: number;
  maximumCommission: number;
  processingFeeRate: number;
  refundProcessingFee: boolean;

  // Subscription Plans
  basicPlanEnabled: boolean;
  basicPlanPrice: number;
  basicPlanListings: number;
  basicPlanDuration: number;
  premiumPlanEnabled: boolean;
  premiumPlanPrice: number;
  premiumPlanListings: number;
  premiumPlanDuration: number;
  enterprisePlanEnabled: boolean;
  enterprisePlanPrice: number;
  enterprisePlanListings: number;
  enterprisePlanDuration: number;

  // Invoice Configuration
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  taxNumber: string;
  invoicePrefix: string;
  invoiceNumberStart: number;
  invoiceTerms: string;
  invoiceNotes: string;
  autoInvoiceGeneration: boolean;

  // Tax Configuration
  taxEnabled: boolean;
  defaultTaxRate: number;
  taxIncluded: boolean;
  taxName: string;
  taxNumber: string;
  regionBasedTax: boolean;

  // Currency & Exchange
  baseCurrency: string;
  supportMultipleCurrencies: boolean;
  autoExchangeRates: boolean;
  exchangeRateProvider: string;
  exchangeRateUpdateInterval: number;

  // Payment Processing
  autoPayouts: boolean;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minimumPayout: number;
  payoutFee: number;
  holdingPeriod: number;
  disputeResolution: boolean;
}

const CURRENCIES = [
  { value: 'NAD', label: 'Namibian Dollar', symbol: 'N$' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'ZAR', label: 'South African Rand', symbol: 'R' }
];

const EXCHANGE_PROVIDERS = [
  { value: 'fixer', label: 'Fixer.io' },
  { value: 'openexchange', label: 'Open Exchange Rates' },
  { value: 'currencyapi', label: 'CurrencyAPI' },
  { value: 'exchangerate', label: 'ExchangeRate-API' }
];

export default function PaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettingsData>({
    // Payment Gateways
    stripeEnabled: true,
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    paypalEnabled: false,
    paypalClientId: '',
    paypalClientSecret: '',
    paypalSandboxMode: true,

    // Commission & Pricing
    commissionType: 'percentage',
    commissionRate: 5.0,
    commissionFixed: 50,
    minimumCommission: 25,
    maximumCommission: 1000,
    processingFeeRate: 2.9,
    refundProcessingFee: false,

    // Subscription Plans
    basicPlanEnabled: true,
    basicPlanPrice: 299,
    basicPlanListings: 5,
    basicPlanDuration: 30,
    premiumPlanEnabled: true,
    premiumPlanPrice: 599,
    premiumPlanListings: 15,
    premiumPlanDuration: 30,
    enterprisePlanEnabled: true,
    enterprisePlanPrice: 1299,
    enterprisePlanListings: 50,
    enterprisePlanDuration: 30,

    // Invoice Configuration
    companyName: 'Cars.na (Pty) Ltd',
    companyAddress: '123 Independence Avenue, Windhoek, Namibia',
    companyPhone: '+264 61 123 4567',
    companyEmail: 'billing@cars.na',
    taxNumber: 'VAT12345678',
    invoicePrefix: 'CNA-',
    invoiceNumberStart: 1000,
    invoiceTerms: 'Payment due within 30 days',
    invoiceNotes: 'Thank you for your business with Cars.na',
    autoInvoiceGeneration: true,

    // Tax Configuration
    taxEnabled: true,
    defaultTaxRate: 15.0,
    taxIncluded: false,
    taxName: 'VAT',
    taxNumber: 'VAT12345678',
    regionBasedTax: false,

    // Currency & Exchange
    baseCurrency: 'NAD',
    supportMultipleCurrencies: false,
    autoExchangeRates: true,
    exchangeRateProvider: 'fixer',
    exchangeRateUpdateInterval: 24,

    // Payment Processing
    autoPayouts: true,
    payoutSchedule: 'weekly',
    minimumPayout: 100,
    payoutFee: 10,
    holdingPeriod: 7,
    disputeResolution: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  const handleInputChange = (field: keyof PaymentSettingsData, value: string | number | boolean) => {
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

  const testPaymentGateway = async (gateway: string) => {
    // TODO: Implement gateway testing
    console.log(`Testing ${gateway} connection...`);
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
          <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
          <p className="text-gray-600">Configure payment gateways, billing, and financial settings</p>
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
            Payment settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Warning */}
      {(!settings.stripeEnabled && !settings.paypalEnabled) && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No payment gateways are enabled. Users will not be able to make payments.
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Gateways
          </CardTitle>
          <CardDescription>
            Configure payment processing providers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stripe Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Stripe</h4>
                  <p className="text-sm text-gray-500">Credit card and digital payments</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={settings.stripeEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {settings.stripeEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Switch
                  checked={settings.stripeEnabled}
                  onCheckedChange={(checked) => handleInputChange('stripeEnabled', checked)}
                />
              </div>
            </div>

            {settings.stripeEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Publishable Key</label>
                    <Input
                      type="text"
                      value={settings.stripePublishableKey}
                      onChange={(e) => handleInputChange('stripePublishableKey', e.target.value)}
                      placeholder="pk_live_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Secret Key</label>
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      value={showSecrets ? settings.stripeSecretKey : maskSecret(settings.stripeSecretKey)}
                      onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                      placeholder="sk_live_..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook Secret</label>
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    value={showSecrets ? settings.stripeWebhookSecret : maskSecret(settings.stripeWebhookSecret)}
                    onChange={(e) => handleInputChange('stripeWebhookSecret', e.target.value)}
                    placeholder="whsec_..."
                  />
                </div>
                <Button variant="outline" onClick={() => testPaymentGateway('stripe')}>
                  Test Connection
                </Button>
              </div>
            )}
          </div>

          {/* PayPal Configuration */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">PayPal</h4>
                  <p className="text-sm text-gray-500">PayPal payments and digital wallets</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={settings.paypalEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {settings.paypalEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Switch
                  checked={settings.paypalEnabled}
                  onCheckedChange={(checked) => handleInputChange('paypalEnabled', checked)}
                />
              </div>
            </div>

            {settings.paypalEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Client ID</label>
                    <Input
                      type="text"
                      value={settings.paypalClientId}
                      onChange={(e) => handleInputChange('paypalClientId', e.target.value)}
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Client Secret</label>
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      value={showSecrets ? settings.paypalClientSecret : maskSecret(settings.paypalClientSecret)}
                      onChange={(e) => handleInputChange('paypalClientSecret', e.target.value)}
                      placeholder="PayPal Client Secret"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Sandbox Mode</span>
                    <p className="text-sm text-gray-500">Use PayPal sandbox for testing</p>
                  </div>
                  <Switch
                    checked={settings.paypalSandboxMode}
                    onCheckedChange={(checked) => handleInputChange('paypalSandboxMode', checked)}
                  />
                </div>
                <Button variant="outline" onClick={() => testPaymentGateway('paypal')}>
                  Test Connection
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Commission & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="w-5 h-5 mr-2" />
            Commission & Pricing
          </CardTitle>
          <CardDescription>
            Configure commission rates and processing fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Commission Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.commissionType}
                onChange={(e) => handleInputChange('commissionType', e.target.value as 'percentage' | 'fixed')}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {settings.commissionType === 'percentage' ? 'Commission Rate (%)' : 'Commission Amount (N$)'}
              </label>
              <Input
                type="number"
                step={settings.commissionType === 'percentage' ? '0.1' : '1'}
                min="0"
                value={settings.commissionType === 'percentage' ? settings.commissionRate : settings.commissionFixed}
                onChange={(e) => handleInputChange(
                  settings.commissionType === 'percentage' ? 'commissionRate' : 'commissionFixed',
                  parseFloat(e.target.value) || 0
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Commission (N$)</label>
              <Input
                type="number"
                min="0"
                value={settings.minimumCommission}
                onChange={(e) => handleInputChange('minimumCommission', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maximum Commission (N$)</label>
              <Input
                type="number"
                min="0"
                value={settings.maximumCommission}
                onChange={(e) => handleInputChange('maximumCommission', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Processing Fee (%)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={settings.processingFeeRate}
                onChange={(e) => handleInputChange('processingFeeRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Refund Processing Fee</span>
              <p className="text-sm text-gray-500">Deduct processing fee from refunds</p>
            </div>
            <Switch
              checked={settings.refundProcessingFee}
              onCheckedChange={(checked) => handleInputChange('refundProcessingFee', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Subscription Plans
          </CardTitle>
          <CardDescription>
            Configure dealer subscription plan pricing and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Plan */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Basic Plan</h4>
              <Switch
                checked={settings.basicPlanEnabled}
                onCheckedChange={(checked) => handleInputChange('basicPlanEnabled', checked)}
              />
            </div>
            {settings.basicPlanEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (N$)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.basicPlanPrice}
                    onChange={(e) => handleInputChange('basicPlanPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Listings</label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.basicPlanListings}
                    onChange={(e) => handleInputChange('basicPlanListings', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (Days)</label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.basicPlanDuration}
                    onChange={(e) => handleInputChange('basicPlanDuration', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Premium Plan</h4>
              <Switch
                checked={settings.premiumPlanEnabled}
                onCheckedChange={(checked) => handleInputChange('premiumPlanEnabled', checked)}
              />
            </div>
            {settings.premiumPlanEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (N$)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.premiumPlanPrice}
                    onChange={(e) => handleInputChange('premiumPlanPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Listings</label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.premiumPlanListings}
                    onChange={(e) => handleInputChange('premiumPlanListings', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (Days)</label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.premiumPlanDuration}
                    onChange={(e) => handleInputChange('premiumPlanDuration', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Enterprise Plan</h4>
              <Switch
                checked={settings.enterprisePlanEnabled}
                onCheckedChange={(checked) => handleInputChange('enterprisePlanEnabled', checked)}
              />
            </div>
            {settings.enterprisePlanEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (N$)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.enterprisePlanPrice}
                    onChange={(e) => handleInputChange('enterprisePlanPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Listings</label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.enterprisePlanListings}
                    onChange={(e) => handleInputChange('enterprisePlanListings', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (Days)</label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.enterprisePlanDuration}
                    onChange={(e) => handleInputChange('enterprisePlanDuration', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Invoice Configuration
          </CardTitle>
          <CardDescription>
            Configure invoice generation and company details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax Number</label>
              <Input
                value={settings.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company Address</label>
            <Textarea
              value={settings.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Phone</label>
              <Input
                value={settings.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Billing Email</label>
              <Input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Invoice Prefix</label>
              <Input
                value={settings.invoicePrefix}
                onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                placeholder="CNA-"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Starting Invoice Number</label>
              <Input
                type="number"
                min="1"
                value={settings.invoiceNumberStart}
                onChange={(e) => handleInputChange('invoiceNumberStart', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Terms</label>
            <Input
              value={settings.invoiceTerms}
              onChange={(e) => handleInputChange('invoiceTerms', e.target.value)}
              placeholder="Payment due within 30 days"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Invoice Notes</label>
            <Textarea
              value={settings.invoiceNotes}
              onChange={(e) => handleInputChange('invoiceNotes', e.target.value)}
              rows={2}
              placeholder="Thank you for your business"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Auto Generate Invoices</span>
              <p className="text-sm text-gray-500">Automatically create invoices for transactions</p>
            </div>
            <Switch
              checked={settings.autoInvoiceGeneration}
              onCheckedChange={(checked) => handleInputChange('autoInvoiceGeneration', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Tax Configuration
          </CardTitle>
          <CardDescription>
            Configure tax settings and rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Enable Tax Calculation</span>
              <p className="text-sm text-gray-500">Apply taxes to transactions</p>
            </div>
            <Switch
              checked={settings.taxEnabled}
              onCheckedChange={(checked) => handleInputChange('taxEnabled', checked)}
            />
          </div>

          {settings.taxEnabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Name</label>
                  <Input
                    value={settings.taxName}
                    onChange={(e) => handleInputChange('taxName', e.target.value)}
                    placeholder="VAT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Default Tax Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={settings.defaultTaxRate}
                    onChange={(e) => handleInputChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Registration Number</label>
                  <Input
                    value={settings.taxNumber}
                    onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Tax Included in Prices</span>
                    <p className="text-sm text-gray-500">Display prices with tax included</p>
                  </div>
                  <Switch
                    checked={settings.taxIncluded}
                    onCheckedChange={(checked) => handleInputChange('taxIncluded', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Region-Based Tax</span>
                    <p className="text-sm text-gray-500">Apply different rates by location</p>
                  </div>
                  <Switch
                    checked={settings.regionBasedTax}
                    onCheckedChange={(checked) => handleInputChange('regionBasedTax', checked)}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Currency & Exchange */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Currency & Exchange Rates
          </CardTitle>
          <CardDescription>
            Configure multi-currency support and exchange rates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Base Currency</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.baseCurrency}
                onChange={(e) => handleInputChange('baseCurrency', e.target.value)}
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Support Multiple Currencies</span>
                <p className="text-sm text-gray-500">Allow pricing in different currencies</p>
              </div>
              <Switch
                checked={settings.supportMultipleCurrencies}
                onCheckedChange={(checked) => handleInputChange('supportMultipleCurrencies', checked)}
              />
            </div>
          </div>

          {settings.supportMultipleCurrencies && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Exchange Rate Provider</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.exchangeRateProvider}
                    onChange={(e) => handleInputChange('exchangeRateProvider', e.target.value)}
                  >
                    {EXCHANGE_PROVIDERS.map(provider => (
                      <option key={provider.value} value={provider.value}>
                        {provider.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Update Interval (Hours)</label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.exchangeRateUpdateInterval}
                    onChange={(e) => handleInputChange('exchangeRateUpdateInterval', parseInt(e.target.value) || 24)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Automatic Exchange Rate Updates</span>
                  <p className="text-sm text-gray-500">Automatically fetch latest exchange rates</p>
                </div>
                <Switch
                  checked={settings.autoExchangeRates}
                  onCheckedChange={(checked) => handleInputChange('autoExchangeRates', checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Payment Processing
          </CardTitle>
          <CardDescription>
            Configure payout schedules and processing settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Automatic Payouts</span>
                <p className="text-sm text-gray-500">Automatically process dealer payouts</p>
              </div>
              <Switch
                checked={settings.autoPayouts}
                onCheckedChange={(checked) => handleInputChange('autoPayouts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Dispute Resolution</span>
                <p className="text-sm text-gray-500">Enable payment dispute handling</p>
              </div>
              <Switch
                checked={settings.disputeResolution}
                onCheckedChange={(checked) => handleInputChange('disputeResolution', checked)}
              />
            </div>
          </div>

          {settings.autoPayouts && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payout Schedule</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.payoutSchedule}
                    onChange={(e) => handleInputChange('payoutSchedule', e.target.value as 'daily' | 'weekly' | 'monthly')}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Payout (N$)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.minimumPayout}
                    onChange={(e) => handleInputChange('minimumPayout', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payout Fee (N$)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.payoutFee}
                    onChange={(e) => handleInputChange('payoutFee', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Holding Period (Days)</label>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={settings.holdingPeriod}
                    onChange={(e) => handleInputChange('holdingPeriod', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Days to hold funds before payout</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}