'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Cookie,
  Shield,
  Settings,
  Eye,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Globe,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  const lastUpdated = "January 1, 2024";

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Cookie className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Cookie Policy</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your experience on Cars.na
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          
          {/* Quick Overview */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                Cookie Usage at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Essential Only</h3>
                  <p className="text-sm text-gray-600">We use cookies primarily for essential site functions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Your Control</h3>
                  <p className="text-sm text-gray-600">Manage cookie preferences in your browser settings</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Privacy First</h3>
                  <p className="text-sm text-gray-600">No tracking without your explicit consent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            
            {/* What are Cookies */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-orange-600" />
                  1. What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and improving site functionality.
                </p>
                <p className="text-gray-700">
                  Similar technologies include web beacons, pixels, and local storage, which serve similar purposes to cookies.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">2. Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Essential Cookies */}
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900">Essential Cookies (Always Active)</h3>
                        <p className="text-sm text-green-700 mt-1">Required for basic website functionality</p>
                      </div>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1 ml-11">
                      <li>• User authentication and login sessions</li>
                      <li>• Shopping cart and form data retention</li>
                      <li>• Security and fraud prevention</li>
                      <li>• Load balancing and site performance</li>
                    </ul>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Settings className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">Functional Cookies</h3>
                        <p className="text-sm text-blue-700 mt-1">Enhance your experience with personalized features</p>
                      </div>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1 ml-11">
                      <li>• Language and region preferences</li>
                      <li>• Search filters and sorting preferences</li>
                      <li>• Recently viewed vehicles</li>
                      <li>• Accessibility settings</li>
                    </ul>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900">Analytics Cookies (Optional)</h3>
                        <p className="text-sm text-purple-700 mt-1">Help us understand how you use our site</p>
                      </div>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1 ml-11">
                      <li>• Page views and user journey tracking</li>
                      <li>• Popular search terms and filters</li>
                      <li>• Site performance and error monitoring</li>
                      <li>• A/B testing for feature improvements</li>
                    </ul>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-900">Marketing Cookies (Optional)</h3>
                        <p className="text-sm text-orange-700 mt-1">Deliver relevant advertisements and content</p>
                      </div>
                    </div>
                    <ul className="text-sm text-orange-800 space-y-1 ml-11">
                      <li>• Personalized vehicle recommendations</li>
                      <li>• Retargeting for viewed vehicles</li>
                      <li>• Social media integration</li>
                      <li>• Email marketing preferences</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">3. Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may use third-party services that set their own cookies. These include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Analytics Services</h4>
                      <p className="text-sm text-gray-600">Google Analytics, Hotjar</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Social Media</h4>
                      <p className="text-sm text-gray-600">Facebook, Twitter, LinkedIn</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Payment Processing</h4>
                      <p className="text-sm text-gray-600">Stripe, PayPal</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Customer Support</h4>
                      <p className="text-sm text-gray-600">Intercom, Zendesk</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  4. Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Browser Settings</h3>
                    <p className="text-gray-700 mb-4">
                      You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Desktop Browsers:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Chrome: Settings → Privacy → Cookies</li>
                          <li>• Firefox: Options → Privacy → Cookies</li>
                          <li>• Safari: Preferences → Privacy</li>
                          <li>• Edge: Settings → Privacy → Cookies</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Mobile Browsers:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• iOS Safari: Settings → Safari → Privacy</li>
                          <li>• Android Chrome: Settings → Site settings</li>
                          <li>• Mobile Firefox: Settings → Privacy</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-800 mb-1">Important Note:</p>
                        <p className="text-sm text-yellow-800">
                          Disabling essential cookies may affect website functionality. Some features may not work properly if you block all cookies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookie Consent */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">5. Cookie Consent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  When you first visit Cars.na, you'll see a cookie banner asking for your consent to use non-essential cookies. You can:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Accept all cookies for the full website experience</li>
                  <li>Reject non-essential cookies (only essential cookies will be used)</li>
                  <li>Customize your preferences by cookie category</li>
                  <li>Change your preferences at any time through browser settings</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">6. Cookie Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                      <p className="text-sm text-gray-700">Deleted when you close your browser</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h4>
                      <p className="text-sm text-gray-700">Stored for specific periods (30 days to 2 years)</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Typical Retention Periods:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Authentication cookies: Until logout or 30 days</li>
                      <li>• Preference cookies: 1 year</li>
                      <li>• Analytics cookies: 2 years</li>
                      <li>• Marketing cookies: 30-90 days</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">7. Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy to reflect changes in our practices or for legal, operational, or regulatory reasons.
                </p>
                <p className="text-gray-700">
                  We'll notify you of significant changes by updating the "last modified" date and, where appropriate, provide additional notice through our website or email.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="shadow-lg border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  8. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Email: <a href="mailto:privacy@cars.na" className="text-blue-600 hover:underline">privacy@cars.na</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Phone: <a href="tel:+264610000000" className="text-blue-600 hover:underline">+264 61 000 000</a></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-gray-600 mt-1" />
                    <div className="text-gray-700">
                      <p>Address: 123 Independence Avenue, Windhoek, Namibia</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Link href="/contact" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
                    Use our contact form →
                  </Link>
                  <br />
                  <Link href="/privacy" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
                    View our Privacy Policy →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
