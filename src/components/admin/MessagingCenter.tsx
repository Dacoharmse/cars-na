'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
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
  Building2,
  Car,
  User,
  MoreVertical,
  Inbox,
  Send,
  Archive,
  Flag,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  AlertCircle,
  Circle,
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

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'NEW', label: 'New' },
  { key: 'READ', label: 'Read' },
  { key: 'RESPONDED', label: 'Responded' },
  { key: 'CLOSED', label: 'Closed' },
  { key: 'SPAM', label: 'Spam' },
] as const;

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; dot: string }> = {
  NEW: {
    color: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    icon: <Inbox className="h-3 w-3" />,
    dot: 'bg-blue-400',
  },
  READ: {
    color: 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',
    icon: <Eye className="h-3 w-3" />,
    dot: 'bg-slate-500',
  },
  RESPONDED: {
    color: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    icon: <CheckCircle className="h-3 w-3" />,
    dot: 'bg-emerald-400',
  },
  CLOSED: {
    color: 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20',
    icon: <Archive className="h-3 w-3" />,
    dot: 'bg-purple-400',
  },
  SPAM: {
    color: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    icon: <Flag className="h-3 w-3" />,
    dot: 'bg-red-400',
  },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString: string) {
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
}

function formatFullDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/dealership-inquiries?${params}`);
      const data = await response.json();

      if (response.ok) {
        setInquiries(data.inquiries);
        setPagination(data.pagination);
        setUnreadCount(data.unreadCount);

        // Build status counts
        const counts: Record<string, number> = {};
        (data.inquiries as Inquiry[]).forEach((i) => {
          counts[i.status] = (counts[i.status] || 0) + 1;
        });
        setStatusCounts(counts);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, statusFilter, searchQuery]);

  useEffect(() => {
    fetchInquiries();
  }, [pagination.page, statusFilter]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchInquiries();
  };

  const handleMarkAsRead = async (inquiry: Inquiry) => {
    if (inquiry.isRead) return;
    try {
      await fetch(`/api/dealership-inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAsRead' }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, isRead: true, status: i.status === 'NEW' ? 'READ' : i.status } : i))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleSelectInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsReplying(false);
    setReplyMessage('');
    await handleMarkAsRead(inquiry);
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dealership-inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'respond', response: replyMessage }),
      });
      if (response.ok) {
        const updated = { ...selectedInquiry, response: replyMessage, responded: true, status: 'RESPONDED' as const };
        setSelectedInquiry(updated);
        setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        setIsReplying(false);
        setReplyMessage('');
      }
    } catch {} finally {
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
        const updated = { ...inquiry, status: status as Inquiry['status'] };
        setInquiries((prev) => prev.map((i) => (i.id === inquiry.id ? updated : i)));
        if (selectedInquiry?.id === inquiry.id) setSelectedInquiry(updated);
      }
    } catch {}
  };

  const handleDelete = async (inquiry: Inquiry) => {
    if (!confirm('Delete this inquiry permanently?')) return;
    try {
      const response = await fetch(`/api/dealership-inquiries/${inquiry.id}`, { method: 'DELETE' });
      if (response.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== inquiry.id));
        if (selectedInquiry?.id === inquiry.id) setSelectedInquiry(null);
      }
    } catch {}
  };

  const totalsByStatus = {
    total: pagination.total,
    unread: unreadCount,
    responded: inquiries.filter((i) => i.status === 'RESPONDED').length,
    closed: inquiries.filter((i) => i.status === 'CLOSED').length,
  };

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: totalsByStatus.total, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/20' },
          { label: 'Unread', value: totalsByStatus.unread, icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20' },
          { label: 'Responded', value: totalsByStatus.responded, icon: Send, color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' },
          { label: 'Closed', value: totalsByStatus.closed, icon: Archive, color: 'text-purple-400', bg: 'bg-purple-500/10', ring: 'ring-purple-500/20' },
        ].map(({ label, value, icon: Icon, color, bg, ring }) => (
          <div key={label} className="bg-[#111827] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${bg} ring-1 ${ring}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col" style={{ minHeight: '680px' }}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search messages…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#CB2030]/50 focus:border-[#CB2030]/40 transition-colors"
              />
            </div>
          </form>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 flex-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setStatusFilter(tab.key); setPagination((p) => ({ ...p, page: 1 })); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-[#CB2030]/10 text-[#CB2030] ring-1 ring-[#CB2030]/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
                {tab.key === 'NEW' && unreadCount > 0 && (
                  <span className="ml-1.5 bg-[#CB2030] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchInquiries}
            aria-label="Refresh messages"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Split Pane */}
        <div className="flex flex-1 overflow-hidden">
          {/* Message List — left panel */}
          <div className={`flex flex-col border-r border-white/[0.06] overflow-y-auto ${selectedInquiry ? 'w-[340px] flex-shrink-0' : 'flex-1'}`}>
            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 py-20 gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-slate-600" />
                <p className="text-sm text-slate-500">Loading messages…</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-20 gap-3">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center">
                  <Inbox className="h-6 w-6 text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-400">No messages</p>
                <p className="text-xs text-slate-600">Customer inquiries will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {inquiries.map((inquiry) => {
                  const isSelected = selectedInquiry?.id === inquiry.id;
                  const cfg = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.NEW;
                  return (
                    <div
                      key={inquiry.id}
                      onClick={() => handleSelectInquiry(inquiry)}
                      className={`group relative flex gap-3 px-4 py-3.5 cursor-pointer transition-colors select-none ${
                        isSelected
                          ? 'bg-white/[0.06]'
                          : 'hover:bg-white/[0.03]'
                      } ${!inquiry.isRead ? 'border-l-2 border-l-[#CB2030]' : 'border-l-2 border-l-transparent'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        !inquiry.isRead ? 'bg-[#CB2030]/20 text-[#CB2030]' : 'bg-white/[0.06] text-slate-400'
                      }`}>
                        {getInitials(inquiry.senderName)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-sm truncate ${!inquiry.isRead ? 'font-semibold text-white' : 'font-medium text-slate-300'}`}>
                            {inquiry.senderName}
                          </span>
                          <span className="text-[11px] text-slate-500 flex-shrink-0">{formatDate(inquiry.createdAt)}</span>
                        </div>
                        <p className={`text-xs truncate mb-0.5 ${!inquiry.isRead ? 'text-slate-300' : 'text-slate-400'}`}>
                          {inquiry.subject || 'No subject'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate leading-relaxed">{inquiry.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.color}`}>
                            {cfg.icon}
                            {inquiry.status}
                          </span>
                          <span className="text-[10px] text-slate-600 flex items-center gap-0.5">
                            <Building2 className="h-2.5 w-2.5" />
                            {inquiry.dealership.name}
                          </span>
                        </div>
                      </div>

                      {/* Hover Quick Actions */}
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-[#111827] border border-white/[0.08] rounded-lg px-1 py-1 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { setSelectedInquiry(inquiry); setIsReplying(true); setReplyMessage(''); }}
                          title="Reply"
                          className="p-1 rounded text-slate-400 hover:text-[#CB2030] hover:bg-[#CB2030]/10 transition-colors"
                        >
                          <Reply className="h-3.5 w-3.5" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#111827] border-white/[0.08] text-slate-300">
                            <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry, 'CLOSED')} className="hover:bg-white/[0.04] cursor-pointer">
                              <Archive className="h-3.5 w-3.5 mr-2 text-purple-400" /> Mark Closed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(inquiry, 'SPAM')} className="hover:bg-white/[0.04] cursor-pointer">
                              <Flag className="h-3.5 w-3.5 mr-2 text-red-400" /> Mark Spam
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/[0.06]" />
                            <DropdownMenuItem onClick={() => handleDelete(inquiry)} className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] mt-auto">
                <span className="text-[11px] text-slate-500">
                  {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Detail Panel — right */}
          {selectedInquiry ? (
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-white/[0.06]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-base font-semibold text-white">
                      {selectedInquiry.subject || 'No subject'}
                    </h2>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[selectedInquiry.status]?.color}`}>
                      {STATUS_CONFIG[selectedInquiry.status]?.icon}
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{formatFullDate(selectedInquiry.createdAt)}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => { setIsReplying(true); setReplyMessage(''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CB2030] hover:bg-[#B01C2A] text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    Reply
                  </button>
                  <a
                    href={`mailto:${selectedInquiry.senderEmail}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Your inquiry')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in email client"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#111827] border-white/[0.08] text-slate-300">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(selectedInquiry, 'CLOSED')} className="hover:bg-white/[0.04] cursor-pointer">
                        <Archive className="h-3.5 w-3.5 mr-2 text-purple-400" /> Mark as Closed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(selectedInquiry, 'SPAM')} className="hover:bg-white/[0.04] cursor-pointer">
                        <Flag className="h-3.5 w-3.5 mr-2 text-red-400" /> Mark as Spam
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/[0.06]" />
                      <DropdownMenuItem onClick={() => handleDelete(selectedInquiry)} className="text-red-400 hover:bg-red-500/10 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Permanently
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    aria-label="Close detail"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Sender Info */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#CB2030]/15 text-[#CB2030] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {getInitials(selectedInquiry.senderName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{selectedInquiry.senderName}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <a href={`mailto:${selectedInquiry.senderEmail}`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        <Mail className="h-3 w-3" />
                        {selectedInquiry.senderEmail}
                      </a>
                      {selectedInquiry.senderPhone && (
                        <a href={`tel:${selectedInquiry.senderPhone}`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          <Phone className="h-3 w-3" />
                          {selectedInquiry.senderPhone}
                        </a>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Building2 className="h-3 w-3" />
                        {selectedInquiry.dealership.name}
                      </span>
                      {selectedInquiry.vehicleId && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Car className="h-3 w-3" />
                          Vehicle inquiry
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message bubble */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{selectedInquiry.message}</p>
                </div>

                {/* Response (if exists) */}
                {selectedInquiry.response && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-400">Your response</span>
                      {selectedInquiry.respondedAt && (
                        <span className="text-[11px] text-slate-600">· {formatDate(selectedInquiry.respondedAt)}</span>
                      )}
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{selectedInquiry.response}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Composer */}
              {isReplying && (
                <div className="border-t border-white/[0.06] bg-[#0D1117] px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-400">
                      Reply to <span className="text-white">{selectedInquiry.senderName}</span>
                    </p>
                    <button
                      onClick={() => setIsReplying(false)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your response…"
                    rows={4}
                    autoFocus
                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#CB2030]/50 focus:border-[#CB2030]/40 transition-colors resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-600">Response will be saved and emailed to {selectedInquiry.senderEmail}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsReplying(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim() || isSubmitting}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#CB2030] hover:bg-[#B01C2A] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty detail state */
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Select a message</p>
                <p className="text-xs text-slate-600">Choose an inquiry from the list to view details and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
