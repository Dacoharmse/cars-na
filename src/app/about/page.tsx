'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Users, 
  Target, 
  Award, 
  Heart,
  MapPin,
  Phone,
  Mail,
  Shield,
  TrendingUp,
  Car
} from 'lucide-react';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Cars.na
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Namibia's leading automotive marketplace, connecting buyers and sellers 
                across the country with trust, transparency, and exceptional service.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To revolutionize the automotive marketplace in Namibia by providing a trusted, 
                      transparent, and user-friendly platform that connects car buyers and sellers, 
                      making vehicle transactions simple, secure, and accessible to everyone.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To become the most trusted automotive platform in Southern Africa, 
                      empowering every Namibian to make informed vehicle decisions with confidence, 
                      while supporting local dealers and the automotive industry's growth.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Story
                </h2>
                <p className="text-xl text-gray-600">
                  Born from a passion for automotive excellence and Namibian innovation
                </p>
              </div>

              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="mb-6">
                  Founded in 2020, Cars.na emerged from a simple observation: Namibians deserved 
                  a better way to buy and sell vehicles. Our founders, passionate about both 
                  technology and the automotive industry, recognized the need for a platform 
                  that would bring transparency, trust, and convenience to vehicle transactions.
                </p>
                
                <p className="mb-6">
                  Starting with just a handful of dealers in Windhoek, we've grown to become 
                  Namibia's largest automotive marketplace, serving customers from Katima Mulilo 
                  to Lüderitz. Our platform now hosts over 200 verified dealers and has 
                  facilitated thousands of successful vehicle transactions.
                </p>
                
                <p className="mb-6">
                  What sets us apart is our deep understanding of the Namibian market. We know 
                  the challenges of buying a car in a country with vast distances and diverse 
                  communities. That's why we've built features specifically for Namibian needs: 
                  comprehensive vehicle histories, verified dealer networks, and financing 
                  solutions tailored to local conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Transparency</h3>
                <p className="text-gray-600">
                  We believe in honest, transparent transactions. Every vehicle listing is verified, 
                  and we provide complete information to help you make informed decisions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. We continuously improve 
                  our platform based on feedback and changing needs.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Namibian Pride</h3>
                <p className="text-gray-600">
                  We're proudly Namibian, supporting local businesses and contributing to 
                  the growth of our automotive industry and economy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Impact
              </h2>
              <p className="text-xl text-blue-100">
                Numbers that reflect our commitment to excellence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Verified Dealers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-blue-100">Vehicles Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15,000+</div>
                <div className="text-blue-100">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="text-blue-100">Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-600">
                  We'd love to hear from you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-gray-600 text-sm">
                      123 Independence Avenue<br />
                      Windhoek, Namibia<br />
                      9000
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 text-sm">
                      +264 61 123 4567<br />
                      Mon - Fri: 8AM - 5PM<br />
                      Sat: 8AM - 1PM
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 text-sm">
                      info@cars.na<br />
                      support@cars.na<br />
                      dealers@cars.na
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Find Your Perfect Car?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their dream vehicles through Cars.na
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Browse Vehicles
              </Button>
              <Button variant="outline" size="lg">
                Sell Your Car
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
