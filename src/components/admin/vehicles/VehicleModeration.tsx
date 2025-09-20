'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  Image as ImageIcon,
  FileText,
  Shield,
  Zap,
  Clock,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';

interface ModerationItem {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  dealerName: string;
  type: 'content' | 'pricing' | 'images' | 'duplicate' | 'inappropriate' | 'fake';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'resolved' | 'escalated';
  reason: string;
  description: string;
  reportedBy?: string;
  reportedAt: Date;
  assignedTo?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  autoDetected: boolean;
  confidence: number;
  evidenceCount: number;
}

interface QualityCheck {
  category: string;
  score: number;
  maxScore: number;
  issues: string[];
  suggestions: string[];
}

interface VehicleModerationProps {
  onItemSelect?: (item: ModerationItem) => void;
  onAction?: (action: string, itemId: string, data?: any) => void;
}

// Mock moderation data
const MOCK_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: '1',
    vehicleId: 'vehicle-123',
    vehicleTitle: '2018 Audi A4 - Luxury Sedan',
    dealerName: 'Elite Autos',
    type: 'pricing',
    priority: 'high',
    status: 'pending',
    reason: 'Price significantly below market value',
    description: 'Listed at N$320,000, market average is N$420,000. Potential pricing error or suspicious activity.',
    autoDetected: true,
    confidence: 92,
    evidenceCount: 3,
    reportedAt: new Date('2024-01-20T10:30:00')
  },
  {
    id: '2',
    vehicleId: 'vehicle-456',
    vehicleTitle: '2020 BMW X5 - Premium SUV',
    dealerName: 'Premium Motors',
    type: 'images',
    priority: 'medium',
    status: 'pending',
    reason: 'Poor image quality detected',
    description: 'Multiple images have poor lighting and resolution. May affect listing quality.',
    autoDetected: true,
    confidence: 78,
    evidenceCount: 5,
    reportedAt: new Date('2024-01-19T14:15:00')
  },
  {
    id: '3',
    vehicleId: 'vehicle-789',
    vehicleTitle: '2019 Mercedes C-Class',
    dealerName: 'City Cars',
    type: 'content',
    priority: 'low',
    status: 'pending',
    reason: 'Incomplete vehicle information',
    description: 'Missing critical details: VIN, service history, and detailed specifications.',
    autoDetected: true,
    confidence: 85,
    evidenceCount: 4,
    reportedAt: new Date('2024-01-18T16:45:00')
  },
  {
    id: '4',
    vehicleId: 'vehicle-101',
    vehicleTitle: '2021 Toyota Hilux',
    dealerName: 'Auto Palace',
    type: 'inappropriate',
    priority: 'critical',
    status: 'pending',
    reason: 'Inappropriate content in description',
    description: 'Vehicle description contains inappropriate language and potentially misleading claims.',
    reportedBy: 'User Report',
    autoDetected: false,
    confidence: 100,
    evidenceCount: 2,
    reportedAt: new Date('2024-01-20T08:20:00')
  },
  {
    id: '5',
    vehicleId: 'vehicle-202',
    vehicleTitle: '2017 Ford Ranger',
    dealerName: 'Budget Cars',
    type: 'duplicate',
    priority: 'medium',
    status: 'pending',
    reason: 'Potential duplicate listing',
    description: 'Similar vehicle with matching VIN found in system. Possible duplicate or fraudulent listing.',
    autoDetected: true,
    confidence: 94,
    evidenceCount: 6,
    reportedAt: new Date('2024-01-17T11:30:00')
  }
];

const QUALITY_CHECKS: QualityCheck[] = [
  {
    category: 'Information Completeness',
    score: 85,
    maxScore: 100,
    issues: ['Missing VIN number', 'No service history'],
    suggestions: ['Request VIN from dealer', 'Add service records section']
  },
  {
    category: 'Image Quality',
    score: 72,
    maxScore: 100,
    issues: ['Poor lighting in 3 images', 'Missing interior shots'],
    suggestions: ['Retake images with better lighting', 'Add interior photos']
  },
  {
    category: 'Price Accuracy',
    score: 60,
    maxScore: 100,
    issues: ['Price below market average', 'No price justification'],
    suggestions: ['Verify pricing with dealer', 'Add condition notes']
  },
  {
    category: 'Content Quality',
    score: 90,
    maxScore: 100,
    issues: ['Minor spelling errors'],
    suggestions: ['Proofread description']
  }
];

export default function VehicleModeration({ onItemSelect, onAction }: VehicleModerationProps) {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(MOCK_MODERATION_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [sortField, setSortField] = useState<string>('reportedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showQualityCheck, setShowQualityCheck] = useState(false);

  const filteredAndSortedItems = moderationItems.filter(item => {
    const matchesSearch = !searchTerm ||
      item.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  }).sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortField) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      case 'confidence':
        aValue = a.confidence;
        bValue = b.confidence;
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

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      'content': 'bg-blue-100 text-blue-800',
      'pricing': 'bg-green-100 text-green-800',
      'images': 'bg-purple-100 text-purple-800',
      'duplicate': 'bg-orange-100 text-orange-800',
      'inappropriate': 'bg-red-100 text-red-800',
      'fake': 'bg-red-100 text-red-800'
    };
    return variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewed': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'escalated': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'content': FileText,
      'pricing': DollarSign,
      'images': ImageIcon,
      'duplicate': Copy,
      'inappropriate': AlertTriangle,
      'fake': Shield
    };
    return icons[type as keyof typeof icons] || AlertTriangle;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleItemAction = (action: string, itemId: string, data?: any) => {
    if (action === 'approve' || action === 'reject' || action === 'escalate') {
      setModerationItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                status: action === 'approve' ? 'resolved' : action === 'reject' ? 'reviewed' : 'escalated',
                reviewedAt: new Date(),
                reviewedBy: 'Current Admin'
              }
            : item
        )
      );
    }

    onAction?.(action, itemId, data);
  };

  const handleBulkAction = (action: string) => {
    selectedItems.forEach(itemId => {
      handleItemAction(action, itemId);
    });
    setSelectedItems([]);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllVisible = () => {
    setSelectedItems(filteredAndSortedItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const getQualityScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.status === 'pending').length}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.priority === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auto-Detected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {moderationItems.filter(item => item.autoDetected).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
          <p className="text-gray-600">
            {filteredAndSortedItems.length} items found
            {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
          </p>
        </div>

        <div className="flex space-x-2">
          {selectedItems.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('approve')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('reject')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject Selected
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

          <Button
            variant="outline"
            onClick={() => setShowQualityCheck(!showQualityCheck)}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Quality Analysis
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by vehicle, dealer, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Types</option>
          <option value="content">Content</option>
          <option value="pricing">Pricing</option>
          <option value="images">Images</option>
          <option value="duplicate">Duplicate</option>
          <option value="inappropriate">Inappropriate</option>
          <option value="fake">Fake</option>
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
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      {/* Quality Check Panel */}
      {showQualityCheck && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUALITY_CHECKS.map((check, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{check.category}</h4>
                    <span className={`font-bold ${getQualityScoreColor(check.score, check.maxScore)}`}>
                      {check.score}/{check.maxScore}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (check.score / check.maxScore) * 100 >= 80
                          ? 'bg-green-500'
                          : (check.score / check.maxScore) * 100 >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${(check.score / check.maxScore) * 100}%` }}
                    />
                  </div>

                  {check.issues.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-red-600 mb-1">Issues:</h5>
                      <ul className="text-sm text-red-600 space-y-1">
                        {check.issues.map((issue, issueIndex) => (
                          <li key={issueIndex} className="flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-2" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {check.suggestions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-blue-600 mb-1">Suggestions:</h5>
                      <ul className="text-sm text-blue-600 space-y-1">
                        {check.suggestions.map((suggestion, suggestionIndex) => (
                          <li key={suggestionIndex} className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-2" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderation Items Table */}
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
                      checked={selectedItems.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0}
                    />
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle & Issue
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
                    Type
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center">
                      Confidence
                      {sortField === 'confidence' && (
                        sortDirection === 'asc' ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                      )}
                    </div>
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
                {filteredAndSortedItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                      onClick={() => onItemSelect?.(item)}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            item.priority === 'critical' ? 'bg-red-100' :
                            item.priority === 'high' ? 'bg-orange-100' :
                            item.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            <TypeIcon className={`w-5 h-5 ${
                              item.priority === 'critical' ? 'text-red-600' :
                              item.priority === 'high' ? 'text-orange-600' :
                              item.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{item.vehicleTitle}</div>
                            <div className="text-sm text-gray-500">{item.dealerName}</div>
                            <div className="text-sm font-medium text-red-600 mt-1">{item.reason}</div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</div>
                            <div className="flex items-center space-x-2 mt-2">
                              {item.autoDetected && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Auto-detected
                                </Badge>
                              )}
                              {item.reportedBy && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  <User className="w-3 h-3 mr-1" />
                                  User Report
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {item.evidenceCount} evidence items
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getPriorityBadge(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getTypeBadge(item.type)}>
                          {item.type}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{item.confidence}%</div>
                          <div className="ml-2 flex-1 max-w-16">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  item.confidence >= 80 ? 'bg-green-500' :
                                  item.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${item.confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.reportedAt.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.reportedAt.toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onItemSelect?.(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {item.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleItemAction('approve', item.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleItemAction('reject', item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleItemAction('escalate', item.id)}
                            className="text-orange-600 hover:text-orange-700"
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

      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No moderation items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            All clear! No items match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}