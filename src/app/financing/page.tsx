'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Calculator, 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

// Namibian banks and their typical rates
const NAMIBIAN_BANKS = [
  {
    name: 'Bank Windhoek',
    logo: '/banks/bank-windhoek.png',
    interestRate: 11.5,
    maxTerm: 72,
    minDeposit: 10,
    features: ['Quick approval', 'Flexible terms', 'Online application']
  },
  {
    name: 'First National Bank',
    logo: '/banks/fnb.png',
    interestRate: 12.0,
    maxTerm: 84,
    minDeposit: 15,
    features: ['Competitive rates', 'Extended terms', 'Pre-approval']
  },
  {
    name: 'Standard Bank',
    logo: '/banks/standard-bank.png',
    interestRate: 11.8,
    maxTerm: 72,
    minDeposit: 12,
    features: ['Fast processing', 'Digital banking', 'Insurance options']
  },
  {
    name: 'Nedbank',
    logo: '/banks/nedbank.png',
    interestRate: 12.2,
    maxTerm: 60,
    minDeposit: 20,
    features: ['Personal service', 'Balloon payments', 'Trade-in assistance']
  }
];

export default function FinancingPage() {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [term, setTerm] = useState('60');
  const [selectedBank, setSelectedBank] = useState(NAMIBIAN_BANKS[0]);

  const calculateMonthlyPayment = () => {
    const price = parseFloat(vehiclePrice) || 0;
    const depositAmount = parseFloat(deposit) || 0;
    const loanAmount = price - depositAmount;
    const monthlyRate = selectedBank.interestRate / 100 / 12;
    const months = parseInt(term);

    if (loanAmount <= 0 || months <= 0) return 0;

    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * parseInt(term);
  const totalInterest = totalPayment - (parseFloat(vehiclePrice) - parseFloat(deposit));

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Car Financing Made Simple
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Get pre-approved for your dream car with competitive rates from Namibia's leading banks. 
                Calculate your payments and apply online today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[#1F3469] hover:bg-gray-100">
                  Get Pre-Approved
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#1F3469]">
                  Calculate Payments
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Finance Calculator */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Vehicle Finance Calculator
                </h2>
                <p className="text-xl text-gray-600">
                  Calculate your monthly payments with real rates from Namibian banks
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Loan Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Price (NAD)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 250000"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deposit (NAD)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 50000"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Term (months)
                      </label>
                      <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                        <option value="36">36 months</option>
                        <option value="48">48 months</option>
                        <option value="60">60 months</option>
                        <option value="72">72 months</option>
                        <option value="84">84 months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Bank
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {NAMIBIAN_BANKS.map((bank) => (
                          <button
                            key={bank.name}
                            onClick={() => setSelectedBank(bank)}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              selectedBank.name === bank.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{bank.name}</span>
                              <span className="text-sm text-gray-600">{bank.interestRate}% p.a.</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Payment Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Monthly Payment</p>
                        <p className="text-3xl font-bold text-blue-600">
                          N${monthlyPayment.toLocaleString('en-NA', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle Price:</span>
                        <span className="font-medium">N${parseFloat(vehiclePrice || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-medium">N${parseFloat(deposit || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Amount:</span>
                        <span className="font-medium">N${(parseFloat(vehiclePrice || '0') - parseFloat(deposit || '0')).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">{selectedBank.interestRate}% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Term:</span>
                        <span className="font-medium">{term} months</span>
                      </div>
                      <hr />
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Payment:</span>
                        <span className="font-medium">N${totalPayment.toLocaleString('en-NA', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest:</span>
                        <span className="font-medium">N${totalInterest.toLocaleString('en-NA', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Apply for Pre-Approval
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vehicle Finance Calculator
              </h2>
              <p className="text-xl text-gray-600">
                Use our calculator to estimate your monthly payments, then apply with your preferred dealership or bank
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Easy Calculator</h3>
                  <p className="text-gray-600">
                    Use our simple calculator to estimate monthly payments based on Namibian bank rates.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Accurate Estimates</h3>
                  <p className="text-gray-600">
                    Get realistic payment estimates using current interest rates from major Namibian banks.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Free to Use</h3>
                  <p className="text-gray-600">
                    Our calculator is completely free with no registration required. Plan your budget easily.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Apply with Dealers</h3>
                  <p className="text-gray-600">
                    Use your estimates to negotiate with dealerships or apply directly with your bank.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg mb-4 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Save Time</h3>
                  <p className="text-gray-600">
                    Know your budget before visiting dealers. Compare different loan terms quickly.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-teal-500">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                    <Star className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Trusted Tool</h3>
                  <p className="text-gray-600">
                    Thousands of car buyers use our calculator to plan their vehicle purchases.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Buy Your Dream Car?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Use our calculator to estimate your payments, then apply for financing with your preferred dealership or bank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1F3469] hover:bg-gray-100">
                Browse Cars
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#1F3469]">
                Contact Dealers
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
