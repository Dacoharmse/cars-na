'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Shield,
  Eye,
  Lock,
  Users,
  Globe,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2024";

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
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
                Privacy at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">We Don't Sell Your Data</h3>
                    <p className="text-sm text-gray-600">Your personal information is never sold to third parties.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Secure by Design</h3>
                    <p className="text-sm text-gray-600">Industry-standard encryption protects your data.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">You're in Control</h3>
                    <p className="text-sm text-gray-600">Manage your privacy settings and data at any time.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Introduction */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  Cars.na ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p className="text-gray-700">
                  By using Cars.na, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  2. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
                    <p className="text-gray-700 mb-3">We may collect personal information that you voluntarily provide, including:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>Name and contact information (email, phone number, address)</li>
                      <li>Account credentials (username, password)</li>
                      <li>Vehicle information when listing or inquiring about cars</li>
                      <li>Payment information for premium services</li>
                      <li>Communication preferences and marketing consents</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
                    <p className="text-gray-700 mb-3">When you use our website, we automatically collect:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring website information</li>
                      <li>Location data (with your permission)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">2.3 Cookies and Tracking Technologies</h3>
                    <p className="text-gray-700">
                      We use cookies and similar tracking technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookie settings through your browser preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  3. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Provide and maintain our services</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Process transactions and payments</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Communicate with you about our services</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Send marketing communications (with consent)</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Improve our website and services</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Analyze usage patterns and trends</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Prevent fraud and ensure security</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Comply with legal obligations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  4. Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4.1 With Your Consent</h3>
                    <p className="text-gray-700">When you provide explicit consent for us to share your information with third parties.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4.2 Service Providers</h3>
                    <p className="text-gray-700">With trusted third-party service providers who assist us in operating our website and providing services, under strict confidentiality agreements.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4.3 Legal Requirements</h3>
                    <p className="text-gray-700">When required by law, court order, or to protect our rights, property, or safety, or that of others.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">4.4 Business Transfers</h3>
                    <p className="text-gray-700">In connection with any merger, sale of company assets, or acquisition of all or a portion of our business.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  5. Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Technical Measures:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Encrypted data storage</li>
                      <li>• Regular security audits and updates</li>
                      <li>• Access controls and authentication</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Organizational Measures:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Employee training on data protection</li>
                      <li>• Limited access on a need-to-know basis</li>
                      <li>• Regular privacy impact assessments</li>
                      <li>• Incident response procedures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  6. Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Access</h4>
                      <p className="text-sm text-gray-700">Request access to your personal data we hold</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Correction</h4>
                      <p className="text-sm text-gray-700">Request correction of inaccurate personal data</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Deletion</h4>
                      <p className="text-sm text-gray-700">Request deletion of your personal data</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Portability</h4>
                      <p className="text-sm text-gray-700">Request transfer of your data to another service</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Objection</h4>
                      <p className="text-sm text-gray-700">Object to processing of your personal data</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Restriction</h4>
                      <p className="text-sm text-gray-700">Request restriction of processing</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>To exercise your rights:</strong> Contact us at <a href="mailto:privacy@cars.na" className="underline">privacy@cars.na</a> or use our <Link href="/contact" className="underline">contact form</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  7. Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900">Account Information:</span>
                      <span className="text-gray-700"> Retained while your account is active and for 2 years after account closure</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900">Transaction Records:</span>
                      <span className="text-gray-700"> Retained for 7 years for tax and legal compliance</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900">Marketing Data:</span>
                      <span className="text-gray-700"> Retained until you withdraw consent or for 3 years of inactivity</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">8. Third-Party Links and Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This Privacy Policy applies only to Cars.na. Third-party websites and services have their own privacy policies and terms of service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
                <p className="text-gray-700">
                  If we discover that we have collected personal information from a child under 18, we will delete such information from our systems promptly.
                </p>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">10. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than Namibia. We ensure that such transfers are conducted in accordance with applicable data protection laws and with appropriate safeguards in place.
                </p>
                <p className="text-gray-700">
                  When we transfer your personal information internationally, we use approved transfer mechanisms such as standard contractual clauses or adequacy decisions.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">11. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending an email notification to registered users</li>
                  <li>Displaying a prominent notice on our website</li>
                </ul>
                <p className="text-gray-700">
                  Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  12. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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
                      <p>Address:</p>
                      <p>Cars.na<br />
                      123 Independence Avenue<br />
                      Windhoek Central<br />
                      Windhoek, Namibia</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/contact" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <MessageCircle className="h-4 w-4" />
                    Use our contact form
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
