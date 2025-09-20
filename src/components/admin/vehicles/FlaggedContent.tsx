'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Flag,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Ban,
  Archive,
  Send,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Zap,
  RefreshCw
} from 'lucide-react';

interface FlaggedReport {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  dealerName: string;
  reportType: 'inappropriate_content' | 'misleading_info' | 'fake_listing' | 'price_manipulation' | 'poor_quality' | 'spam' | 'duplicate' | 'other';
  category: 'content' | 'pricing' | 'images' | 'behavior' | 'quality';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed' | 'escalated';
  reportedBy: {
    type: 'user' | 'dealer' | 'system' | 'admin';
    id?: string;
    name?: string;
    email?: string;
  };
  description: string;
  evidence?: string[];
  adminNotes?: string;
  reportedAt: Date;
  assignedTo?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  autoDetected: boolean;
  confidence?: number;
  similarReports: number;
}

interface FlaggedContentProps {
  onReportSelect?: (report: FlaggedReport) => void;
  onAction?: (action: string, reportId: string, data?: any) => void;
}

// Mock flagged reports data
const MOCK_FLAGGED_REPORTS: FlaggedReport[] = [
  {
    id: '1',
    vehicleId: 'vehicle-123',
    vehicleTitle: '2018 Audi A4 - Luxury Sedan',
    dealerName: 'Elite Autos',
    reportType: 'misleading_info',
    category: 'content',
    priority: 'high',
    status: 'pending',
    reportedBy: {
      type: 'user',
      id: 'user-456',
      name: 'John Buyer',
      email: 'john@example.com'
    },
    description: 'The vehicle description claims it has never been in an accident, but Carfax shows accident history. Mileage also seems suspicious - too low for the year.',
    evidence: [
      'Carfax report showing accident history',
      'Photos showing possible damage repair',
      'Mileage inconsistency with service records'
    ],
    reportedAt: new Date('2024-01-20T10:30:00'),
    autoDetected: false,
    similarReports: 2
  },
  {
    id: '2',
    vehicleId: 'vehicle-456',
    vehicleTitle: '2020 BMW X5 - Premium SUV',
    dealerName: 'Premium Motors',
    reportType: 'inappropriate_content',
    category: 'content',
    priority: 'critical',
    status: 'investigating',
    reportedBy: {
      type: 'system',
      name: 'Content Filter AI'
    },
    description: 'Automated system detected inappropriate language and potentially discriminatory content in the vehicle description.',
    evidence: [
      'Flagged terms: [filtered content]',
      'Context analysis showing inappropriate tone',
      'Community guidelines violation'
    ],
    adminNotes: 'Investigating with content moderation team. Dealer has been contacted.',
    reportedAt: new Date('2024-01-19T14:15:00'),
    assignedTo: 'Content Moderator',
    autoDetected: true,
    confidence: 95,
    similarReports: 0
  },
  {
    id: '3',
    vehicleId: 'vehicle-789',
    vehicleTitle: '2019 Mercedes C-Class',
    dealerName: 'City Cars',
    reportType: 'fake_listing',
    category: 'behavior',
    priority: 'critical',
    status: 'pending',
    reportedBy: {
      type: 'user',
      id: 'user-789',
      name: 'Sarah Wilson',
      email: 'sarah@example.com'
    },
    description: 'This exact vehicle with the same photos is listed on multiple platforms with different VINs and prices. Appears to be a scam listing.',
    evidence: [
      'Screenshots from other platforms',
      'VIN number discrepancies',
      'Price variations across platforms',
      'Reverse image search results'
    ],
    reportedAt: new Date('2024-01-18T16:45:00'),
    autoDetected: false,
    similarReports: 3
  },
  {
    id: '4',
    vehicleId: 'vehicle-101',
    vehicleTitle: '2021 Toyota Hilux',
    dealerName: 'Auto Palace',
    reportType: 'price_manipulation',
    category: 'pricing',
    priority: 'medium',
    status: 'resolved',
    reportedBy: {
      type: 'system',
      name: 'Price Monitor AI'
    },
    description: 'Vehicle price has been artificially inflated and reduced multiple times to create false urgency and appear as a deal.',
    evidence: [
      'Price history showing manipulation pattern',
      'Market analysis comparison',
      'Similar vehicles pricing data'
    ],
    adminNotes: 'Dealer confirmed this was an error in their pricing system. Price has been corrected.',
    reportedAt: new Date('2024-01-17T08:20:00'),
    assignedTo: 'Pricing Specialist',
    resolvedAt: new Date('2024-01-18T10:15:00'),
    resolvedBy: 'Admin User',
    resolution: 'Pricing error corrected. Dealer educated on pricing policies.',
    autoDetected: true,
    confidence: 88,
    similarReports: 1
  },
  {
    id: '5',
    vehicleId: 'vehicle-202',
    vehicleTitle: '2017 Ford Ranger',
    dealerName: 'Budget Cars',
    reportType: 'poor_quality',
    category: 'images',
    priority: 'low',
    status: 'dismissed',
    reportedBy: {
      type: 'user',
      id: 'user-101',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    description: 'Images are extremely poor quality and don\'t show the actual condition of the vehicle. Some images appear to be stock photos.',
    evidence: [
      'Low resolution images',
      'Possible stock photo matches',
      'Missing angle coverage'
    ],
    adminNotes: 'Images were uploaded correctly by dealer. User may have viewing issues on their device.',
    reportedAt: new Date('2024-01-16T11:30:00'),
    resolvedAt: new Date('2024-01-17T09:45:00'),
    resolvedBy: 'Support Team',
    resolution: 'No violation found. Images meet quality standards.',
    autoDetected: false,
    similarReports: 0
  }
];

export default function FlaggedContent({ onReportSelect, onAction }: FlaggedContentProps) {
  const [reports, setReports] = useState<FlaggedReport[]>(MOCK_FLAGGED_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('reportedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionData, setResolutionData] = useState({ reportId: '', action: '', notes: '' });

  const filteredAndSortedReports = reports.filter(report => {
    const matchesSearch = !searchTerm ||
      report.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = reportTypeFilter === 'all' || report.reportType === reportTypeFilter;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesType;
  }).sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      case 'similarReports':
        aValue = a.similarReports;
        bValue = b.similarReports;
        break;
      case 'confidence':
        aValue = a.confidence || 0;
        bValue = b.confidence || 0;
        break;
      case 'reportedAt':
      default:
        aValue = a.reportedAt.getTime();
        bValue = b.reportedAt.getTime();
        break;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getStatusStats = () => {
    return {
      pending: reports.filter(r => r.status === 'pending').length,
      investigating: reports.filter(r => r.status === 'investigating').length,
      critical: reports.filter(r => r.priority === 'critical').length,
      autoDetected: reports.filter(r => r.autoDetected).length
    };
  };

  const stats = getStatusStats();

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      'content': 'bg-blue-100 text-blue-800',
      'pricing': 'bg-green-100 text-green-800',
      'images': 'bg-purple-100 text-purple-800',
      'behavior': 'bg-red-100 text-red-800',
      'quality': 'bg-yellow-100 text-yellow-800'
    };
    return variants[category as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'investigating': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'dismissed': 'bg-gray-100 text-gray-800',
      'escalated': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getReportTypeIcon = (type: string) => {
    const icons = {
      'inappropriate_content': AlertTriangle,
      'misleading_info': FileText,
      'fake_listing': Shield,
      'price_manipulation': DollarSign,
      'poor_quality': ImageIcon,
      'spam': Ban,
      'duplicate': Copy,
      'other': Flag
    };
    return icons[type as keyof typeof icons] || Flag;
  };

  const getReporterBadge = (reportedBy: FlaggedReport['reportedBy']) => {
    const variants = {
      'user': 'bg-blue-100 text-blue-800',
      'dealer': 'bg-green-100 text-green-800',
      'system': 'bg-purple-100 text-purple-800',
      'admin': 'bg-orange-100 text-orange-800'
    };
    return variants[reportedBy.type as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleReportAction = (action: string, reportId: string, data?: any) => {
    if (action === 'resolve' || action === 'dismiss' || action === 'escalate') {
      setResolutionData({ reportId, action, notes: '' });
      setShowResolutionModal(true);
      return;
    }

    // Execute immediate actions
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? {
              ...report,
              status: action === 'investigate' ? 'investigating' : report.status,
              assignedTo: action === 'investigate' ? 'Current Admin' : report.assignedTo,
              ...data
            }
          : report
      )
    );

    onAction?.(action, reportId, data);
  };

  const handleResolutionSubmit = () => {
    const { reportId, action, notes } = resolutionData;

    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? {
              ...report,
              status: action === 'resolve' ? 'resolved' : action === 'dismiss' ? 'dismissed' : 'escalated',
              resolvedAt: new Date(),
              resolvedBy: 'Current Admin',
              resolution: notes,
              adminNotes: notes
            }
          : report
      )
    );

    onAction?.(action, reportId, { notes });
    setShowResolutionModal(false);
    setResolutionData({ reportId: '', action: '', notes: '' });
  };

  const handleBulkAction = (action: string) => {
    selectedReports.forEach(reportId => {
      handleReportAction(action, reportId);
    });
    setSelectedReports([]);
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const selectAllVisible = () => {
    setSelectedReports(filteredAndSortedReports.map(report => report.id));
  };

  const clearSelection = () => {
    setSelectedReports([]);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Flag className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Investigating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.investigating}</p>
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
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auto-Detected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.autoDetected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flagged Content</h2>
          <p className="text-gray-600">
            {filteredAndSortedReports.length} reports found
            {selectedReports.length > 0 && ` • ${selectedReports.length} selected`}
          </p>
        </div>

        <div className="flex space-x-2">
          {selectedReports.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('investigate')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Investigate Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('dismiss')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Dismiss Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear Selection
              </Button>
            </>
          )}

          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="content">Content</option>
          <option value="pricing">Pricing</option>
          <option value="images">Images</option>
          <option value="behavior">Behavior</option>
          <option value="quality">Quality</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
          <option value="escalated">Escalated</option>
        </select>

        <select
          value={reportTypeFilter}
          onChange={(e) => setReportTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Types</option>
          <option value="inappropriate_content">Inappropriate Content</option>
          <option value="misleading_info">Misleading Info</option>
          <option value="fake_listing">Fake Listing</option>
          <option value="price_manipulation">Price Manipulation</option>
          <option value="poor_quality">Poor Quality</option>
          <option value="spam">Spam</option>
          <option value="duplicate">Duplicate</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => e.target.checked ? selectAllVisible() : clearSelection()}
                      checked={selectedReports.length === filteredAndSortedReports.length && filteredAndSortedReports.length > 0}
                    />
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Details
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortField === 'priority' && (
                        sortDirection === 'asc' ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('reportedAt')}
                  >
                    <div className="flex items-center">
                      Reported
                      {sortField === 'reportedAt' && (
                        sortDirection === 'asc' ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedReports.map((report) => {
                  const TypeIcon = getReportTypeIcon(report.reportType);
                  return (
                    <tr
                      key={report.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedReports.includes(report.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => onReportSelect?.(report)}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => toggleReportSelection(report.id)}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            report.priority === 'critical' ? 'bg-red-100' :
                            report.priority === 'high' ? 'bg-orange-100' :
                            report.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <TypeIcon className={`w-5 h-5 ${
                              report.priority === 'critical' ? 'text-red-600' :
                              report.priority === 'high' ? 'text-orange-600' :
                              report.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{report.vehicleTitle}</div>
                            <div className="text-sm text-gray-500">{report.dealerName}</div>
                            <div className="text-sm font-medium text-red-600 mt-1">
                              {report.reportType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getCategoryBadge(report.category)}>
                                {report.category}
                              </Badge>
                              {report.autoDetected && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Auto
                                </Badge>
                              )}
                              {report.confidence && (
                                <span className="text-xs text-gray-500">
                                  {report.confidence}% confidence
                                </span>
                              )}
                              {report.similarReports > 0 && (
                                <span className="text-xs text-gray-500">
                                  +{report.similarReports} similar
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getPriorityBadge(report.priority)}>
                          {report.priority.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusBadge(report.status)}>
                          {report.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <Badge className={getReporterBadge(report.reportedBy)}>
                            {report.reportedBy.type}
                          </Badge>
                          {report.reportedBy.name && (
                            <div className="text-sm text-gray-500 mt-1">{report.reportedBy.name}</div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {report.reportedAt.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.reportedAt.toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReportSelect?.(report)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {report.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReportAction('investigate', report.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReportAction('resolve', report.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReportAction('dismiss', report.id)}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReportAction('escalate', report.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-medium">
                {resolutionData.action === 'resolve' ? 'Resolve Report' :
                 resolutionData.action === 'dismiss' ? 'Dismiss Report' : 'Escalate Report'}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resolution Notes</label>
                <textarea
                  value={resolutionData.notes}
                  onChange={(e) => setResolutionData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={`Explain why you are ${resolutionData.action}ing this report...`}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowResolutionModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResolutionSubmit}
                  disabled={!resolutionData.notes.trim()}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {resolutionData.action === 'resolve' ? 'Resolve' :
                   resolutionData.action === 'dismiss' ? 'Dismiss' : 'Escalate'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredAndSortedReports.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No flagged reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            All clear! No reports match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}