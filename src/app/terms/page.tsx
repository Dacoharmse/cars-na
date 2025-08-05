'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  FileText,
  Scale,
  Shield,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const lastUpdated = "January 1, 2024";

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Please read these terms carefully before using Cars.na services.
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
                <CheckCircle className="h-6 w-6 text-green-600" />
                Terms Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Fair Usage</h3>
                  <p className="text-sm text-gray-600">Use our platform responsibly and legally</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Your Rights</h3>
                  <p className="text-sm text-gray-600">Clear guidelines on what you can expect</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Responsibilities</h3>
                  <p className="text-sm text-gray-600">Your obligations when using Cars.na</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            
            {/* Acceptance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  By accessing and using Cars.na, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
                <p className="text-gray-700">
                  These terms apply to all users, including browsers, dealers, and advertisers.
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">2. Our Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">Cars.na provides:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Online marketplace for buying and selling vehicles</li>
                  <li>Dealer directory and verification services</li>
                  <li>Vehicle financing calculator tools</li>
                  <li>Lead generation and communication tools</li>
                  <li>Vehicle listing and search functionality</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Account Creation</h3>
                    <p className="text-gray-700">You must provide accurate information when creating an account. You are responsible for maintaining account security.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Dealer Accounts</h3>
                    <p className="text-gray-700">Dealer accounts require business verification. False information may result in account suspension.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  4. Prohibited Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">You may not use Cars.na to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Post false, misleading, or fraudulent listings</li>
                  <li>Engage in illegal activities or transactions</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate intellectual property rights</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Attempt to hack or disrupt our services</li>
                </ul>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">5. Content and Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Your Content</h3>
                    <p className="text-gray-700">You retain ownership of content you post but grant us license to use it on our platform.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Content Standards</h3>
                    <p className="text-gray-700">All content must be accurate, legal, and appropriate. We reserve the right to remove content that violates our standards.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">6. Payments and Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Basic services are free. Premium services may require payment. All fees are non-refundable unless required by law.
                </p>
                <p className="text-gray-700">
                  Cars.na does not process vehicle transactions - we only facilitate connections between buyers and sellers.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">7. Disclaimers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-800 mb-2">Important Disclaimers:</p>
                        <ul className="text-sm text-yellow-800 space-y-1">
                          <li>• We don't guarantee the accuracy of listings</li>
                          <li>• We're not responsible for transactions between users</li>
                          <li>• Vehicle condition and history should be independently verified</li>
                          <li>• Services are provided "as is" without warranties</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">8. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Cars.na's liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages.
                </p>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount paid by you for our services in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">9. Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may suspend or terminate your account for violations of these terms. You may terminate your account at any time by contacting us.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use our services ceases immediately.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">10. Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  These terms are governed by the laws of Namibia. Any disputes will be resolved in the courts of Windhoek, Namibia.
                </p>
              </CardContent>
            </Card>

            {/* Changes */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">11. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may update these terms at any time. Material changes will be communicated via email or website notice.
                </p>
                <p className="text-gray-700">
                  Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="shadow-lg border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  12. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Questions about these terms? Contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Email: <a href="mailto:legal@cars.na" className="text-blue-600 hover:underline">legal@cars.na</a></span>
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
                <div className="mt-6">
                  <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                    Use our contact form →
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
