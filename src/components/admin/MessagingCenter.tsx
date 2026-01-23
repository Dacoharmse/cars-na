'use client';

import { useState, useEffect } from 'react';
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
  Filter,
  RefreshCw,
  Eye,
  Reply,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Car,
  User,
  Calendar,
  MoreVertical,
  Inbox,
  Send,
  Archive,
  Flag,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
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
  dealership: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  status: 'NEW' | 'READ' | 'RESPONDED' | 'CLOSED' | 'SPAM';
  isRead: boolean;
  readAt: string | null;
  responded: boolean;
  respondedAt: string | null;
  response: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function MessagingCenter() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
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

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/dealership-inquiries?${params}`);
      const data = await response.json();

      if (response.ok) {
        setInquiries(data.inquiries);
        setPagination(data.pagination);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [pagination.page, statusFilter]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchInquiries();
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
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

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
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      NEW: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Inbox className="h-3 w-3" /> },
      READ: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: <Eye className="h-3 w-3" /> },
      RESPONDED: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="h-3 w-3" /> },
      CLOSED: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <Archive className="h-3 w-3" /> },
      SPAM: { color: 'bg-red-100 text-red-700 border-red-200', icon: <Flag className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || statusConfig.NEW;

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        {config.icon}
        {status}
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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Messages</p>
                <p className="text-2xl font-bold text-blue-900">{pagination.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Unread</p>
                <p className="text-2xl font-bold text-orange-900">{unreadCount}</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <Inbox className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Responded</p>
                <p className="text-2xl font-bold text-green-900">
                  {inquiries.filter(i => i.status === 'RESPONDED').length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <Send className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Closed</p>
                <p className="text-2xl font-bold text-purple-900">
                  {inquiries.filter(i => i.status === 'CLOSED').length}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <Archive className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
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

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="READ">Read</option>
                <option value="RESPONDED">Responded</option>
                <option value="CLOSED">Closed</option>
                <option value="SPAM">Spam</option>
              </select>

              <Button variant="outline" onClick={fetchInquiries}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Inquiries
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white ml-2">{unreadCount} new</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500">Customer inquiries will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !inquiry.isRead ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleViewInquiry(inquiry)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !inquiry.isRead ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        <User className={`h-5 w-5 ${!inquiry.isRead ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium ${!inquiry.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {inquiry.senderName}
                          </span>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <p className={`text-sm mb-1 ${!inquiry.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {inquiry.subject || 'No subject'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{inquiry.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {inquiry.dealership.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(inquiry.createdAt)}
                          </span>
                          {inquiry.vehicleId && (
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              Vehicle inquiry
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReply(inquiry)}
                        title="Reply"
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
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
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry, 'CLOSED')}>
                            <Archive className="h-4 w-4 mr-2" />
                            Mark as Closed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry, 'SPAM')}>
                            <Flag className="h-4 w-4 mr-2" />
                            Mark as Spam
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(inquiry)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
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
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Inquiry Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedInquiry?.subject || 'Customer Inquiry'}
            </DialogTitle>
            <DialogDescription>
              Received {selectedInquiry && formatDate(selectedInquiry.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedInquiry.senderName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${selectedInquiry.senderEmail}`} className="text-sm text-blue-600 hover:underline">
                      {selectedInquiry.senderEmail}
                    </a>
                  </div>
                  {selectedInquiry.senderPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${selectedInquiry.senderPhone}`} className="text-sm text-blue-600 hover:underline">
                        {selectedInquiry.senderPhone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedInquiry.dealership.name}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Response (if any) */}
              {selectedInquiry.response && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Response Sent
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.response}</p>
                    {selectedInquiry.respondedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Responded on {new Date(selectedInquiry.respondedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <div className="flex gap-2">
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
                      Open in Email
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
            <DialogTitle>Reply to {selectedInquiry?.senderName}</DialogTitle>
            <DialogDescription>
              Send a response to this inquiry. The response will be saved for reference.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-500 mb-1">Original message:</p>
              <p className="text-gray-700 line-clamp-3">{selectedInquiry?.message}</p>
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={!replyMessage.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
