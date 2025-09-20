'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Send,
  Eye,
  Filter,
  RefreshCw,
  Calculator,
  FileText,
  Building2,
  Receipt,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  PiggyBank
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  dealershipId: string;
  dealershipName: string;
  type: 'COMMISSION' | 'SUBSCRIPTION' | 'LISTING_FEE' | 'PREMIUM_FEE' | 'PENALTY';
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidDate?: string;
  description: string;
  invoiceNumber?: string;
  transactionId?: string;
}

interface DealershipPayment {
  dealershipId: string;
  dealershipName: string;
  totalRevenue: number;
  monthlyRevenue: number;
  commissionRate: number;
  commissionOwed: number;
  subscriptionStatus: 'ACTIVE' | 'OVERDUE' | 'CANCELLED';
  subscriptionAmount: number;
  lastPayment: string;
  paymentMethod: string;
  outstandingBalance: number;
}

export function DealershipPayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  // Mock payment records
  const paymentRecords: PaymentRecord[] = [
    {
      id: '1',
      dealershipId: 'dealer1',
      dealershipName: 'Premium Motors Namibia',
      type: 'COMMISSION',
      amount: 12500,
      status: 'PAID',
      dueDate: '2024-09-01',
      paidDate: '2024-09-01',
      description: 'Monthly commission for August 2024',
      invoiceNumber: 'INV-2024-001',
      transactionId: 'TXN-123456'
    },
    {
      id: '2',
      dealershipId: 'dealer1',
      dealershipName: 'Premium Motors Namibia',
      type: 'SUBSCRIPTION',
      amount: 2500,
      status: 'PAID',
      dueDate: '2024-09-01',
      paidDate: '2024-09-01',
      description: 'Premium subscription fee for September 2024',
      invoiceNumber: 'INV-2024-002',
      transactionId: 'TXN-123457'
    },
    {
      id: '3',
      dealershipId: 'dealer2',
      dealershipName: 'City Cars Swakopmund',
      type: 'COMMISSION',
      amount: 8900,
      status: 'PENDING',
      dueDate: '2024-09-15',
      description: 'Monthly commission for September 2024',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: '4',
      dealershipId: 'dealer3',
      dealershipName: 'Elite Autos Oshakati',
      type: 'SUBSCRIPTION',
      amount: 1500,
      status: 'OVERDUE',
      dueDate: '2024-08-15',
      description: 'Basic subscription fee for August 2024',
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: '5',
      dealershipId: 'dealer4',
      dealershipName: 'Motor City Windhoek',
      type: 'LISTING_FEE',
      amount: 500,
      status: 'PAID',
      dueDate: '2024-09-10',
      paidDate: '2024-09-09',
      description: 'Premium listing fee for 2020 BMW X5',
      invoiceNumber: 'INV-2024-005',
      transactionId: 'TXN-123458'
    }
  ];

  // Mock dealership payment summaries
  const dealershipPayments: DealershipPayment[] = [
    {
      dealershipId: 'dealer1',
      dealershipName: 'Premium Motors Namibia',
      totalRevenue: 980000,
      monthlyRevenue: 125000,
      commissionRate: 5,
      commissionOwed: 0,
      subscriptionStatus: 'ACTIVE',
      subscriptionAmount: 2500,
      lastPayment: '2024-09-01',
      paymentMethod: 'Bank Transfer',
      outstandingBalance: 0
    },
    {
      dealershipId: 'dealer2',
      dealershipName: 'City Cars Swakopmund',
      totalRevenue: 670000,
      monthlyRevenue: 89000,
      commissionRate: 5,
      commissionOwed: 8900,
      subscriptionStatus: 'ACTIVE',
      subscriptionAmount: 2500,
      lastPayment: '2024-08-01',
      paymentMethod: 'Credit Card',
      outstandingBalance: 8900
    },
    {
      dealershipId: 'dealer3',
      dealershipName: 'Elite Autos Oshakati',
      totalRevenue: 340000,
      monthlyRevenue: 67000,
      commissionRate: 5,
      commissionOwed: 3350,
      subscriptionStatus: 'OVERDUE',
      subscriptionAmount: 1500,
      lastPayment: '2024-07-15',
      paymentMethod: 'Bank Transfer',
      outstandingBalance: 4850
    }
  ];

  // Calculate summary statistics
  const paymentStats = {
    totalRevenue: paymentRecords.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: paymentRecords.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: paymentRecords.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0),
    totalCommissions: paymentRecords.filter(p => p.type === 'COMMISSION' && p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
    totalSubscriptions: paymentRecords.filter(p => p.type === 'SUBSCRIPTION' && p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
    overdueCount: paymentRecords.filter(p => p.status === 'OVERDUE').length
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'PAID': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'OVERDUE': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle },
      'CANCELLED': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
    };
    const variant = variants[status as keyof typeof variants];
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.bg} ${variant.text} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      'COMMISSION': 'bg-blue-100 text-blue-800',
      'SUBSCRIPTION': 'bg-purple-100 text-purple-800',
      'LISTING_FEE': 'bg-orange-100 text-orange-800',
      'PREMIUM_FEE': 'bg-indigo-100 text-indigo-800',
      'PENALTY': 'bg-red-100 text-red-800'
    };
    return variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const filteredPayments = paymentRecords.filter(payment => {
    const matchesSearch = searchTerm === '' ||
      payment.dealershipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || payment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSendReminder = (payment: PaymentRecord) => {
    console.log('Sending payment reminder for:', payment.id);
    // In real app, this would trigger email/SMS reminder
  };

  const handleMarkAsPaid = (payment: PaymentRecord) => {
    console.log('Marking payment as paid:', payment.id);
    // In real app, this would update payment status
  };

  const handleGenerateInvoice = (payment: PaymentRecord) => {
    console.log('Generating invoice for:', payment.id);
    // In real app, this would generate and download invoice
  };

  const handleExportPayments = () => {
    console.log('Exporting payment data');
    // In real app, this would export filtered data to CSV/Excel
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="text-gray-600">Track revenue, commissions, and dealer payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPayments}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateInvoice(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">N${paymentStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +15% from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">N${paymentStats.pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Awaiting processing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-red-600">N${paymentStats.overdueAmount.toLocaleString()}</p>
                <p className="text-sm text-red-500">{paymentStats.overdueCount} overdue items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commissions</p>
                <p className="text-2xl font-bold text-gray-900">N${paymentStats.totalCommissions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="ALL">All Types</option>
              <option value="COMMISSION">Commission</option>
              <option value="SUBSCRIPTION">Subscription</option>
              <option value="LISTING_FEE">Listing Fee</option>
              <option value="PREMIUM_FEE">Premium Fee</option>
              <option value="PENALTY">Penalty</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last 12 months</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealership</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.invoiceNumber || 'Draft'}
                          </div>
                          {payment.transactionId && (
                            <div className="text-xs text-gray-500">TXN: {payment.transactionId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{payment.dealershipName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getTypeBadge(payment.type)}>
                        {payment.type.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        N${payment.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </div>
                      {payment.paidDate && (
                        <div className="text-xs text-green-600">
                          Paid: {new Date(payment.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleGenerateInvoice(payment)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payment.status === 'PENDING' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(payment)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {(payment.status === 'PENDING' || payment.status === 'OVERDUE') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendReminder(payment)}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dealership Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Dealership Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealership</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dealershipPayments.map((dealer) => (
                  <tr key={dealer.dealershipId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{dealer.dealershipName}</div>
                          <div className="text-xs text-gray-500">{dealer.paymentMethod}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        N${dealer.monthlyRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: N${dealer.totalRevenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {dealer.commissionRate}% rate
                      </div>
                      <div className="text-xs text-gray-500">
                        Owed: N${dealer.commissionOwed.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        N${dealer.subscriptionAmount.toLocaleString()}
                      </div>
                      <Badge className={
                        dealer.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        dealer.subscriptionStatus === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {dealer.subscriptionStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        dealer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        N${dealer.outstandingBalance.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(dealer.lastPayment).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Calculator className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Receipt className="w-4 h-4" />
                        </Button>
                        {dealer.outstandingBalance > 0 && (
                          <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Commission Revenue</span>
                </div>
                <span className="font-bold text-blue-600">N${paymentStats.totalCommissions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Subscription Revenue</span>
                </div>
                <span className="font-bold text-purple-600">N${paymentStats.totalSubscriptions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Listing Fees</span>
                </div>
                <span className="font-bold text-orange-600">N$500</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Payment Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {paymentStats.overdueCount} overdue payments
                  </p>
                  <p className="text-xs text-red-600">
                    Total: N${paymentStats.overdueAmount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    3 payments due this week
                  </p>
                  <p className="text-xs text-yellow-600">
                    Total: N$12,400
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Revenue up 15% this month
                  </p>
                  <p className="text-xs text-blue-600">
                    Compared to last month
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}