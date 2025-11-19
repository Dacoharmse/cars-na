'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Users,
  Building2,
  Car,
  Flag,
  DollarSign,
  Settings,
  Clock,
  Eye,
  Trash2,
  ArrowLeft,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'user' | 'dealer' | 'vehicle' | 'payment' | 'moderation' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock notifications - in real app, this would come from an API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        category: 'dealer',
        title: 'New Dealer Registration',
        message: 'Elite Autos Namibia has submitted a new dealer registration',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        isRead: false,
        actionUrl: '/admin?tab=dealers'
      },
      {
        id: '2',
        type: 'warning',
        category: 'moderation',
        title: 'Content Flagged',
        message: 'A vehicle listing has been flagged for review by a user',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        isRead: false,
        actionUrl: '/admin?tab=moderation'
      },
      {
        id: '3',
        type: 'success',
        category: 'payment',
        title: 'Payment Received',
        message: 'Premium Motors Namibia paid N$12,500 commission',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        actionUrl: '/admin?tab=subscriptions'
      },
      {
        id: '4',
        type: 'info',
        category: 'user',
        title: 'New User Registration',
        message: '5 new users registered in the last hour',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: true,
        actionUrl: '/admin?tab=users'
      },
      {
        id: '5',
        type: 'error',
        category: 'system',
        title: 'Email Service Error',
        message: 'Email service is experiencing connectivity issues',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        isRead: true,
        actionUrl: '/admin?tab=settings'
      },
      {
        id: '6',
        type: 'warning',
        category: 'dealer',
        title: 'Dealer Approval Pending',
        message: 'Coastal Cars Swakopmund is waiting for approval',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        isRead: true,
        actionUrl: '/admin?tab=dealers'
      },
      {
        id: '7',
        type: 'success',
        category: 'vehicle',
        title: 'New Vehicle Listed',
        message: 'Premium Motors added a 2024 Toyota Land Cruiser',
        timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        isRead: true,
        actionUrl: '/admin?tab=listings'
      },
      {
        id: '8',
        type: 'info',
        category: 'dealer',
        title: 'Subscription Renewal',
        message: 'Auto Central Namibia renewed their premium subscription',
        timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
        isRead: true,
        actionUrl: '/admin?tab=subscriptions'
      },
      {
        id: '9',
        type: 'warning',
        category: 'payment',
        title: 'Payment Overdue',
        message: 'Budget Cars Namibia has a payment 3 days overdue',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        isRead: true,
        actionUrl: '/admin?tab=subscriptions'
      },
      {
        id: '10',
        type: 'info',
        category: 'user',
        title: 'User Activity Spike',
        message: '50+ users browsing listings simultaneously',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        isRead: true,
        actionUrl: '/admin?tab=analytics'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter =
      filter === 'all' ? true :
      filter === 'unread' ? !notification.isRead :
      notification.isRead;

    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;

    return matchesReadFilter && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'user':
        return <Users className="w-5 h-5" />;
      case 'dealer':
        return <Building2 className="w-5 h-5" />;
      case 'vehicle':
        return <Car className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'moderation':
        return <Flag className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate to action URL if provided
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notifications
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : "You're all caught up!"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            {/* Read Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="user">Users</option>
                <option value="dealer">Dealers</option>
                <option value="vehicle">Vehicles</option>
                <option value="payment">Payments</option>
                <option value="moderation">Moderation</option>
                <option value="system">System</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(categoryFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setTypeFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium text-lg">No notifications</p>
              <p className="text-sm text-gray-400 mt-2">
                {filter === 'unread'
                  ? "You're all caught up! No unread notifications."
                  : 'No notifications match your current filters.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 cursor-pointer transition-all hover:shadow-md hover:border-gray-300 ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)} border-2`}>
                    {getCategoryIcon(notification.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className={`text-base font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        {getTypeIcon(notification.type)}
                        <Badge className="capitalize text-xs">
                          {notification.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="flex-shrink-0 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                          className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatTimestamp(notification.timestamp)}
                      {!notification.isRead && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600 font-medium">New</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
