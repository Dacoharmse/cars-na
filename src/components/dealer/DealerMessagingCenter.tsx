'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import {
  MessageSquare,
  Mail,
  Phone,
  Search,
  RefreshCw,
  Eye,
  Reply,
  Trash2,
  CheckCircle,
  Clock,
  Car,
  User,
  Inbox,
  Send,
  Archive,
  Flag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  MoreVertical,
  Calendar,
  Globe,
  Star,
  Bell,
  BellRing,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface Inquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  subject: string | null;
  message: string;
  vehicleId: string | null;
  dealershipId: string;
  status: 'NEW' | 'READ' | 'RESPONDED' | 'CLOSED' | 'SPAM';
  isRead: boolean;
  readAt: string | null;
  responded: boolean;
  respondedAt: string | null;
  response: string | null;
  source: string | null;
  emailSentToDealership: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DealerMessagingCenterProps {
  dealershipId: string;
}

export function DealerMessagingCenter({ dealershipId }: DealerMessagingCenterProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    if (!dealershipId) {
      setError('No dealership ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        dealershipId: dealershipId,
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      console.log('Fetching inquiries with params:', params.toString());
      const response = await fetch(`/api/dealership-inquiries?${params}`);
      const data = await response.json();

      console.log('Inquiries response:', data);

      if (response.ok) {
        setInquiries(data.inquiries || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }));
        setUnreadCount(data.unreadCount || 0);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dealershipId, pagination.page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchInquiries();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchInquiries]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleMarkAsRead = async (inquiry: Inquiry) => {
    try {
      const response = await fetch(`/api/dealership-inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAsRead' }),
      });

      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleViewInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsViewDialogOpen(true);

    if (!inquiry.isRead) {
      await handleMarkAsRead(inquiry);
    }
  };

  const handleReply = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage('');
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dealership-inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          response: replyMessage,
        }),
      });

      if (response.ok) {
        setIsReplyDialogOpen(false);
        setReplyMessage('');
        fetchInquiries();
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (inquiry: Inquiry, status: string) => {
    try {
      const response = await fetch(`/api/dealership-inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', status }),
      });

      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/dealership-inquiries/${inquiry.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?.id === inquiry.id) {
          setIsViewDialogOpen(false);
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      NEW: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <BellRing className="h-3 w-3" />, label: 'New' },
      READ: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Eye className="h-3 w-3" />, label: 'Read' },
      RESPONDED: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="h-3 w-3" />, label: 'Replied' },
      CLOSED: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <Archive className="h-3 w-3" />, label: 'Closed' },
      SPAM: { color: 'bg-red-100 text-red-700 border-red-200', icon: <Flag className="h-3 w-3" />, label: 'Spam' },
    };

    const config = statusConfig[status] || statusConfig.NEW;

    return (
      <Badge className={`${config.color} border flex items-center gap-1 text-xs`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceLabel = (source: string | null) => {
    const sources: Record<string, { label: string; icon: React.ReactNode }> = {
      dealership_page: { label: 'Dealership Page', icon: <Globe className="h-3 w-3" /> },
      vehicle_listing: { label: 'Vehicle Listing', icon: <Car className="h-3 w-3" /> },
      search_results: { label: 'Search Results', icon: <Search className="h-3 w-3" /> },
    };
    return sources[source || ''] || { label: 'Website', icon: <Globe className="h-3 w-3" /> };
  };

  // Show loading state
  if (!dealershipId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading dealership information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Messages</p>
                <p className="text-3xl font-bold text-blue-900">{pagination.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br border hover:shadow-md transition-shadow ${
          unreadCount > 0
            ? 'from-orange-50 to-orange-100 border-orange-200 ring-2 ring-orange-300 ring-opacity-50'
            : 'from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${unreadCount > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                  Unread
                </p>
                <p className={`text-3xl font-bold ${unreadCount > 0 ? 'text-orange-900' : 'text-gray-900'}`}>
                  {unreadCount}
                </p>
              </div>
              <div className={`p-3 rounded-xl shadow-lg ${unreadCount > 0 ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'}`}>
                {unreadCount > 0 ? <BellRing className="h-6 w-6 text-white" /> : <Bell className="h-6 w-6 text-white" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Replied</p>
                <p className="text-3xl font-bold text-green-900">
                  {inquiries.filter(i => i.status === 'RESPONDED').length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                <Send className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">This Week</p>
                <p className="text-3xl font-bold text-purple-900">
                  {inquiries.filter(i => {
                    const date = new Date(i.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-1 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="flex-1 md:flex-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Messages</option>
                <option value="NEW">New</option>
                <option value="READ">Read</option>
                <option value="RESPONDED">Replied</option>
                <option value="CLOSED">Closed</option>
              </select>

              <Button variant="outline" onClick={fetchInquiries} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={fetchInquiries} className="ml-auto">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Customer Messages
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white ml-2 animate-pulse">{unreadCount} new</Badge>
              )}
            </CardTitle>
            <div className="text-xs text-gray-500">
              Auto-refreshes every 30 seconds
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && inquiries.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Customer inquiries from your dealership page will appear here. Share your profile to start receiving messages!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => {
                const sourceInfo = getSourceLabel(inquiry.source);
                return (
                  <div
                    key={inquiry.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !inquiry.isRead ? 'bg-blue-50/70 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleViewInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                          !inquiry.isRead ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                          <User className={`h-6 w-6 ${!inquiry.isRead ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`font-semibold ${!inquiry.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {inquiry.senderName}
                            </span>
                            {getStatusBadge(inquiry.status)}
                            {inquiry.vehicleId && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                <Car className="h-3 w-3 mr-1" />
                                Vehicle Inquiry
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm mb-1.5 ${!inquiry.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {inquiry.subject || 'General Inquiry'}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">{inquiry.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(inquiry.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {inquiry.senderEmail}
                            </span>
                            {inquiry.senderPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {inquiry.senderPhone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              {sourceInfo.icon}
                              {sourceInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReply(inquiry)}
                          title="Reply"
                          className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewInquiry(inquiry)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReply(inquiry)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {inquiry.status !== 'CLOSED' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry, 'CLOSED')}>
                                <Archive className="h-4 w-4 mr-2" />
                                Mark as Closed
                              </DropdownMenuItem>
                            )}
                            {inquiry.status !== 'SPAM' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry, 'SPAM')}>
                                <Flag className="h-4 w-4 mr-2" />
                                Mark as Spam
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(inquiry)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} messages
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-md">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Inquiry Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              {selectedInquiry?.subject || 'Customer Inquiry'}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {selectedInquiry && formatFullDate(selectedInquiry.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-5">
              {/* Customer Info Card */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{selectedInquiry.senderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${selectedInquiry.senderEmail}`} className="font-medium text-blue-600 hover:underline">
                        {selectedInquiry.senderEmail}
                      </a>
                    </div>
                  </div>
                  {selectedInquiry.senderPhone && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a href={`tel:${selectedInquiry.senderPhone}`} className="font-medium text-blue-600 hover:underline">
                          {selectedInquiry.senderPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      {getSourceLabel(selectedInquiry.source).icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Source</p>
                      <p className="font-medium">{getSourceLabel(selectedInquiry.source).label}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Response (if any) */}
              {selectedInquiry.response && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Your Response
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedInquiry.response}</p>
                    {selectedInquiry.respondedAt && (
                      <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-green-200">
                        Sent on {formatFullDate(selectedInquiry.respondedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <div className="flex gap-2">
                  {selectedInquiry.senderPhone && (
                    <a href={`https://wa.me/${selectedInquiry.senderPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" onClick={() => {
                    setIsViewDialogOpen(false);
                    handleReply(selectedInquiry);
                  }}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <a
                    href={`mailto:${selectedInquiry.senderEmail}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Your inquiry')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Email Client
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="h-5 w-5 text-blue-600" />
              Reply to {selectedInquiry?.senderName}
            </DialogTitle>
            <DialogDescription>
              Your response will be saved and you can also send it via email or WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm border">
              <p className="text-gray-500 mb-2 font-medium">Original message:</p>
              <p className="text-gray-700 line-clamp-4">{selectedInquiry?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <Textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={!replyMessage.trim() || isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Save Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
