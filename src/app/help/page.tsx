'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Search,
  ChevronDown,
  ChevronRight,
  Car,
  CreditCard,
  Users,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Settings,
  FileText,
  Star,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  faqs: FAQItem[];
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toggleResource = (id: string) => {
    setExpandedResource(expandedResource === id ? null : id);
  };

  const helpCategories: HelpCategory[] = [
    {
      id: 'buying',
      title: 'Buying a Car',
      icon: Car,
      description: 'Everything you need to know about finding and purchasing your next vehicle',
      faqs: [
        {
          question: 'How do I search for cars on Cars.na?',
          answer: 'Use our search bar at the top of any page or browse by category. You can filter by make, model, year, price range, location, and more to find exactly what you\'re looking for.'
        },
        {
          question: 'How do I contact a seller or dealer?',
          answer: 'On each vehicle listing, you\'ll find contact options including phone, WhatsApp, and a contact form. Click "Contact Dealer" or use the provided phone numbers to get in touch directly.'
        },
        {
          question: 'Can I schedule a test drive?',
          answer: 'Yes! Contact the dealer directly through the listing to arrange a test drive. Most dealers are happy to accommodate viewing appointments.'
        },
        {
          question: 'Are the prices negotiable?',
          answer: 'Pricing is set by individual dealers and sellers. Contact them directly to discuss pricing and any potential negotiations.'
        },
        {
          question: 'How do I know if a listing is legitimate?',
          answer: 'All dealer listings are verified. Look for the verified dealer badge, check dealer reviews, and always inspect the vehicle in person before making any payments.'
        }
      ]
    },
    {
      id: 'selling',
      title: 'Selling Your Car',
      icon: FileText,
      description: 'Step-by-step guidance for listing and selling your vehicle',
      faqs: [
        {
          question: 'How do I list my car for sale?',
          answer: 'Click "Sell Your Car" in the main navigation and follow our step-by-step wizard. You\'ll need photos, vehicle details, and contact information. Listing is free!'
        },
        {
          question: 'What information do I need to provide?',
          answer: 'You\'ll need vehicle details (make, model, year, mileage), condition information, photos, asking price, and your contact details.'
        },
        {
          question: 'How much does it cost to list my car?',
          answer: 'Basic listings are completely free. We may offer premium listing options in the future for enhanced visibility.'
        },
        {
          question: 'How long will my listing stay active?',
          answer: 'Listings remain active for 90 days. You can renew, edit, or remove your listing at any time by contacting us.'
        },
        {
          question: 'Can I edit my listing after it\'s published?',
          answer: 'Yes! Contact our support team with your listing details and the changes you\'d like to make.'
        }
      ]
    },
    {
      id: 'dealers',
      title: 'For Dealers',
      icon: Users,
      description: 'Information for automotive dealers and businesses',
      faqs: [
        {
          question: 'How do I become a verified dealer?',
          answer: 'Visit our dealer registration page and complete the application. We\'ll verify your business credentials and set up your dealer account.'
        },
        {
          question: 'What are the benefits of being a verified dealer?',
          answer: 'Verified dealers get a badge, access to the dealer dashboard, inventory management tools, lead tracking, and enhanced listing visibility.'
        },
        {
          question: 'How much does dealer membership cost?',
          answer: 'We offer various dealer packages. Contact our dealer support team for current pricing and package details.'
        },
        {
          question: 'Can I manage multiple locations?',
          answer: 'Yes! Our dealer dashboard supports multiple locations and staff accounts under one dealership profile.'
        },
        {
          question: 'How do I track leads and inquiries?',
          answer: 'Your dealer dashboard includes a comprehensive lead management system where you can track all customer inquiries and follow up efficiently.'
        }
      ]
    },
    {
      id: 'financing',
      title: 'Financing & Payments',
      icon: CreditCard,
      description: 'Understanding vehicle financing options and our calculator tool',
      faqs: [
        {
          question: 'Does Cars.na provide vehicle financing?',
          answer: 'No, Cars.na does not provide financing. We offer a financing calculator tool to help estimate payments. Apply for financing with your preferred bank or dealership.'
        },
        {
          question: 'How accurate is the financing calculator?',
          answer: 'Our calculator provides estimates based on current market rates from major Namibian banks. Actual rates may vary based on your credit profile and chosen lender.'
        },
        {
          question: 'Which banks offer vehicle financing in Namibia?',
          answer: 'Major banks including Bank Windhoek, FNB Namibia, Standard Bank, and Nedbank offer vehicle financing. Contact them directly for applications.'
        },
        {
          question: 'What documents do I need for vehicle financing?',
          answer: 'Typically you\'ll need ID, proof of income, bank statements, and vehicle details. Each bank has specific requirements - contact them for their complete list.'
        },
        {
          question: 'Can I get pre-approved for financing?',
          answer: 'Yes! Contact banks directly for pre-approval. This can help you understand your budget before shopping for vehicles.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: Shield,
      description: 'Staying safe while buying and selling vehicles online',
      faqs: [
        {
          question: 'How can I avoid scams when buying a car?',
          answer: 'Always inspect vehicles in person, verify dealer credentials, never send money before seeing the car, and be cautious of deals that seem too good to be true.'
        },
        {
          question: 'What should I do if I encounter a suspicious listing?',
          answer: 'Report suspicious listings to our safety team immediately. Use the "Report" button on listings or contact us directly.'
        },
        {
          question: 'Is it safe to meet sellers in person?',
          answer: 'Yes, but take precautions: meet in public places, bring a friend, inspect during daylight hours, and trust your instincts.'
        },
        {
          question: 'How do I verify a dealer is legitimate?',
          answer: 'Look for the verified dealer badge, check their business registration, read reviews, and visit their physical location if possible.'
        },
        {
          question: 'What payment methods are safest?',
          answer: 'Bank transfers and verified payment methods are safest. Avoid cash for large amounts and never pay before inspecting the vehicle.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Settings,
      description: 'Help with using the Cars.na website and features',
      faqs: [
        {
          question: 'Why can\'t I see vehicle images?',
          answer: 'This might be due to slow internet or browser issues. Try refreshing the page, clearing your browser cache, or using a different browser.'
        },
        {
          question: 'The search isn\'t working properly. What should I do?',
          answer: 'Try clearing your search filters and starting fresh. If problems persist, contact our technical support team.'
        },
        {
          question: 'How do I reset my dealer account password?',
          answer: 'Use the "Forgot Password" link on the login page, or contact our support team for assistance with account recovery.'
        },
        {
          question: 'Can I use Cars.na on my mobile phone?',
          answer: 'Yes! Our website is fully responsive and works great on mobile devices. We may also launch a mobile app in the future.'
        },
        {
          question: 'Why is the website running slowly?',
          answer: 'This could be due to internet connectivity or high traffic. Try refreshing the page or accessing the site at a different time.'
        }
      ]
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.faqs.some(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Help Center</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Find answers to common questions and get the help you need to make the most of Cars.na
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help topics, questions, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white border-0 shadow-lg focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          
          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Immediate Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/contact">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-sm text-gray-600">Get personalized help from our support team</p>
                  </CardContent>
                </Card>
              </Link>
              
              <a href="tel:+264814494433">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-sm text-gray-600">+264 81 449 4433</p>
                  </CardContent>
                </Card>
              </a>

              <a href="https://wa.me/264814494433" target="_blank" rel="noopener noreferrer">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-sm text-gray-600">+264 81 449 4433</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>

          {/* Help Categories */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Browse Help Topics</h2>
            
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any help topics matching "{searchQuery}"
                  </p>
                  <Button 
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredCategories.map((category) => {
                const IconComponent = category.icon;
                const isExpanded = expandedCategory === category.id;
                
                return (
                  <Card key={category.id} className="shadow-lg">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{category.title}</CardTitle>
                            <p className="text-gray-600 mt-1">{category.description}</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="border-t border-gray-100">
                        <div className="space-y-4 pt-4">
                          {category.faqs.map((faq, faqIndex) => {
                            const faqId = `${category.id}-${faqIndex}`;
                            const isFAQExpanded = expandedFAQ === faqId;
                            
                            return (
                              <div key={faqIndex} className="border border-gray-200 rounded-lg">
                                <button
                                  onClick={() => toggleFAQ(faqId)}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                                >
                                  <span className="font-medium text-gray-900">{faq.question}</span>
                                  {isFAQExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                                  )}
                                </button>
                                {isFAQExpanded && (
                                  <div className="px-4 pb-4 border-t border-gray-100">
                                    <p className="text-gray-600 pt-3">{faq.answer}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>

          {/* Additional Resources */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">User Guide</h3>
                  <p className="text-sm text-gray-600 mb-4">Complete guide to using Cars.na</p>
                  <Button variant="outline" size="sm" onClick={() => toggleResource('user-guide')}>
                    {expandedResource === 'user-guide' ? 'Close' : 'Read Guide'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <p className="text-sm text-gray-600 mb-4">Tips for buying and selling cars</p>
                  <Button variant="outline" size="sm" onClick={() => toggleResource('best-practices')}>
                    {expandedResource === 'best-practices' ? 'Close' : 'View Tips'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Safety Tips</h3>
                  <p className="text-sm text-gray-600 mb-4">Stay safe while using our platform</p>
                  <Button variant="outline" size="sm" onClick={() => toggleResource('safety-tips')}>
                    {expandedResource === 'safety-tips' ? 'Close' : 'Stay Safe'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Newsletter</h3>
                  <p className="text-sm text-gray-600 mb-4">Get updates and tips via email</p>
                  <Button variant="outline" size="sm" onClick={() => toggleResource('newsletter')}>
                    {expandedResource === 'newsletter' ? 'Close' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Expanded Resource Content */}
            {expandedResource === 'user-guide' && (
              <Card className="mt-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Cars.na User Guide</h3>
                  </div>
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Getting Started</h4>
                      <p className="mb-2">Cars.na is Namibia&apos;s trusted platform for buying and selling vehicles. Whether you&apos;re looking for your first car or selling a fleet, here&apos;s how to get the most out of our platform.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Searching for Vehicles</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Use the <strong>search bar</strong> on the homepage or navigate to <strong>Buy Cars</strong> to browse all listings.</li>
                        <li>Filter by make, model, year, price range, mileage, transmission, fuel type, and location.</li>
                        <li>Use the <strong>sort</strong> options to order results by price, date listed, or mileage.</li>
                        <li>Click any listing to see full details, photos, and dealer contact information.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contacting Dealers</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Each listing shows the dealer&apos;s phone number, WhatsApp, and email.</li>
                        <li>Use the <strong>Contact Dealer</strong> button to send an inquiry directly.</li>
                        <li>Visit the <strong>Dealers</strong> page to browse all verified dealerships.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Selling Your Car</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Click <strong>Sell Your Car</strong> in the navigation menu.</li>
                        <li>Fill in your vehicle details: make, model, year, mileage, condition, and asking price.</li>
                        <li>Upload clear photos — listings with good photos get significantly more inquiries.</li>
                        <li>Provide your contact details so interested buyers can reach you.</li>
                        <li>Your listing will be reviewed and published within 24 hours.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Using the Financing Calculator</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Go to <strong>Financing</strong> in the main menu.</li>
                        <li>Enter the vehicle price, your deposit amount, and preferred loan term.</li>
                        <li>Compare estimated monthly payments from major Namibian banks.</li>
                        <li>Note: The calculator provides estimates only. Contact banks directly for actual rates.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">For Dealers</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Register as a dealer to access inventory management and lead tracking tools.</li>
                        <li>Manage your listings, respond to inquiries, and track your dealership performance from the dashboard.</li>
                        <li>Verified dealers receive a trust badge that increases buyer confidence.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {expandedResource === 'best-practices' && (
              <Card className="mt-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Star className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-xl font-bold text-gray-900">Best Practices for Buying &amp; Selling</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 text-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">For Buyers</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900">1. Do Your Research</h5>
                          <p className="text-sm">Before contacting a seller, research the fair market value of the vehicle. Compare similar listings on Cars.na to understand pricing in your area.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">2. Inspect Thoroughly</h5>
                          <p className="text-sm">Always view the vehicle in person. Check the body, interior, engine, tyres, and take it for a test drive. Consider hiring a mechanic for a pre-purchase inspection.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">3. Verify Documents</h5>
                          <p className="text-sm">Check the registration papers, roadworthy certificate, and service history. Ensure the VIN matches the documents and there are no outstanding finance obligations.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">4. Negotiate Fairly</h5>
                          <p className="text-sm">Use your research to make a fair offer. Point out any issues found during inspection. Be prepared to walk away if the deal doesn&apos;t feel right.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">5. Secure Payment</h5>
                          <p className="text-sm">Use bank transfers for large amounts. Get a signed sale agreement before transferring money. Keep all receipts and documentation.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">For Sellers</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900">1. Take Great Photos</h5>
                          <p className="text-sm">Clean your car and photograph it in good lighting. Include exterior (all angles), interior, dashboard, engine bay, and tyres. Listings with 10+ photos get 3x more inquiries.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">2. Price Competitively</h5>
                          <p className="text-sm">Research similar vehicles on Cars.na. Price your car fairly based on its condition, mileage, and market demand. Overpricing leads to fewer inquiries.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">3. Be Honest &amp; Detailed</h5>
                          <p className="text-sm">Disclose known issues upfront. Include service history, accident history, and any modifications. Honest listings build trust and attract serious buyers.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">4. Respond Quickly</h5>
                          <p className="text-sm">Reply to inquiries within a few hours. Buyers often contact multiple sellers — the first to respond has the best chance of closing the deal.</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">5. Prepare Paperwork</h5>
                          <p className="text-sm">Have all documents ready: registration, roadworthy certificate, service records, and a sale agreement template. This speeds up the process for serious buyers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {expandedResource === 'safety-tips' && (
              <Card className="mt-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-bold text-gray-900">Safety Tips for Online Vehicle Transactions</h3>
                  </div>
                  <div className="space-y-6 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Red Flags — Walk Away If You See These</h4>
                      <ul className="list-disc pl-5 space-y-1 text-red-700 text-sm">
                        <li>Seller asks for payment before you&apos;ve seen the vehicle in person.</li>
                        <li>Price is significantly below market value with no reasonable explanation.</li>
                        <li>Seller refuses to meet in person or only communicates via text.</li>
                        <li>Pressure to act immediately (&quot;another buyer is coming today&quot;).</li>
                        <li>Seller cannot provide registration papers or proof of ownership.</li>
                        <li>Vehicle VIN doesn&apos;t match the registration documents.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Meeting Safely</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Meet in public places</strong> — shopping centre parking lots, police stations, or the dealer&apos;s showroom.</li>
                        <li><strong>Bring someone with you</strong> — never go alone to view a vehicle, especially for private sales.</li>
                        <li><strong>Meet during daylight hours</strong> — avoid evening or nighttime viewings.</li>
                        <li><strong>Share your plans</strong> — tell a friend or family member where you&apos;re going and who you&apos;re meeting.</li>
                        <li><strong>Trust your instincts</strong> — if something feels wrong, leave immediately.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Safe Payment Practices</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Use <strong>bank transfers</strong> (EFT) — they create a paper trail and can be traced.</li>
                        <li>Never carry large amounts of <strong>cash</strong> to a vehicle viewing.</li>
                        <li>Get a <strong>signed sale agreement</strong> before making any payment.</li>
                        <li>Verify the seller&apos;s <strong>bank account details</strong> match their ID and the registration documents.</li>
                        <li>Keep <strong>all receipts</strong> and proof of payment.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vehicle Verification Checklist</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Check the <strong>VIN</strong> (Vehicle Identification Number) matches the registration papers.</li>
                        <li>Verify the <strong>registration</strong> is current and in the seller&apos;s name.</li>
                        <li>Confirm there are no <strong>outstanding finance</strong> obligations on the vehicle.</li>
                        <li>Request a <strong>police clearance</strong> to ensure the vehicle is not stolen.</li>
                        <li>Check for a valid <strong>roadworthy certificate</strong>.</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Report Suspicious Activity</h4>
                      <p className="text-blue-700 text-sm">
                        If you encounter a suspicious listing or believe you&apos;ve been targeted by a scam, report it immediately.
                        Contact our support team at <a href="mailto:support@cars.na" className="underline font-medium">support@cars.na</a> or
                        call <a href="tel:+264814494433" className="underline font-medium">+264 81 449 4433</a>.
                        You can also report to the Namibian Police at their nearest station.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {expandedResource === 'newsletter' && (
              <Card className="mt-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Subscribe to Our Newsletter</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Get the latest car deals, market insights, buying tips, and platform updates delivered straight to your inbox. No spam — just useful content for Namibian car buyers and sellers.
                  </p>
                  {newsletterStatus === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                      <p className="font-medium">You&apos;re subscribed! Check your inbox for a confirmation email.</p>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newsletterEmail) return;
                        setNewsletterStatus('loading');
                        try {
                          const res = await fetch('/api/newsletter/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: newsletterEmail }),
                          });
                          if (res.ok) {
                            setNewsletterStatus('success');
                            setNewsletterEmail('');
                          } else {
                            setNewsletterStatus('error');
                          }
                        } catch {
                          setNewsletterStatus('error');
                        }
                      }}
                      className="flex flex-col sm:flex-row gap-3 max-w-md"
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button type="submit" disabled={newsletterStatus === 'loading'}>
                        {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                      </Button>
                    </form>
                  )}
                  {newsletterStatus === 'error' && (
                    <p className="text-red-600 text-sm mt-2">Something went wrong. Please try again or email us at support@cars.na.</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Still Need Help */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Can't find what you're looking for? Our support team is here to help you with any questions or issues.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">
                      Contact Support
                    </Button>
                  </Link>
                  <a href="mailto:support@cars.na">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Email Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
