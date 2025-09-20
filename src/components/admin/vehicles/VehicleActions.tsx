'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle,
  XCircle,
  Star,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Edit,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Send,
  RotateCcw,
  Archive,
  Bookmark,
  Share2,
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface VehicleActionsProps {
  vehicleId: string;
  currentStatus: 'AVAILABLE' | 'SOLD' | 'PENDING' | 'RESERVED';
  moderationStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'FLAGGED';
  featured: boolean;
  dealerPick: boolean;
  onAction: (action: string, data?: any) => void;
  onClose?: () => void;
}

interface ActionHistory {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  notes?: string;
}

// Mock action history
const MOCK_ACTION_HISTORY: ActionHistory[] = [
  {
    id: '1',
    action: 'Approved',
    user: 'Admin User',
    timestamp: new Date('2024-01-15T10:30:00'),
    notes: 'Vehicle meets all quality standards'
  },
  {
    id: '2',
    action: 'Featured',
    user: 'Content Manager',
    timestamp: new Date('2024-01-16T14:15:00'),
    notes: 'High-quality listing promoted to featured'
  },
  {
    id: '3',
    action: 'Price Updated',
    user: 'Dealer',
    timestamp: new Date('2024-01-18T09:45:00'),
    notes: 'Price reduced by N$20,000'
  }
];

export default function VehicleActions({
  vehicleId,
  currentStatus,
  moderationStatus,
  featured,
  dealerPick,
  onAction,
  onClose
}: VehicleActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionNotes, setActionNotes] = useState('');
  const [priceAdjustment, setPriceAdjustment] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionHistory] = useState<ActionHistory[]>(MOCK_ACTION_HISTORY);

  const quickActions = [
    {
      id: 'approve',
      label: 'Approve',
      icon: CheckCircle,
      color: 'text-green-600',
      disabled: moderationStatus === 'APPROVED',
      description: 'Approve this listing for public viewing'
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: XCircle,
      color: 'text-red-600',
      disabled: moderationStatus === 'REJECTED',
      description: 'Reject this listing and notify dealer'
    },
    {
      id: 'feature',
      label: featured ? 'Unfeature' : 'Feature',
      icon: Star,
      color: 'text-yellow-600',
      description: featured ? 'Remove from featured listings' : 'Add to featured listings'
    },
    {
      id: 'dealer-pick',
      label: dealerPick ? 'Remove Pick' : 'Dealer Pick',
      icon: Bookmark,
      color: 'text-blue-600',
      description: dealerPick ? 'Remove dealer pick status' : 'Mark as dealer pick'
    },
    {
      id: 'flag',
      label: 'Flag',
      icon: Flag,
      color: 'text-orange-600',
      disabled: moderationStatus === 'FLAGGED',
      description: 'Flag for content review'
    },
    {
      id: 'hide',
      label: 'Hide',
      icon: EyeOff,
      color: 'text-gray-600',
      description: 'Hide from public view temporarily'
    }
  ];

  const statusActions = [
    {
      id: 'mark-sold',
      label: 'Mark as Sold',
      status: 'SOLD',
      disabled: currentStatus === 'SOLD'
    },
    {
      id: 'mark-pending',
      label: 'Mark as Pending',
      status: 'PENDING',
      disabled: currentStatus === 'PENDING'
    },
    {
      id: 'mark-reserved',
      label: 'Mark as Reserved',
      status: 'RESERVED',
      disabled: currentStatus === 'RESERVED'
    },
    {
      id: 'mark-available',
      label: 'Mark as Available',
      status: 'AVAILABLE',
      disabled: currentStatus === 'AVAILABLE'
    }
  ];

  const bulkActions = [
    { id: 'duplicate', label: 'Duplicate Listing', icon: Copy },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'delete', label: 'Delete', icon: Trash2, color: 'text-red-600' },
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'share', label: 'Share', icon: Share2 }
  ];

  const handleQuickAction = (actionId: string) => {
    setSelectedAction(actionId);

    // Actions that require confirmation
    const confirmationActions = ['reject', 'delete', 'archive'];
    if (confirmationActions.includes(actionId)) {
      setShowConfirmation(true);
      return;
    }

    // Execute action immediately for simple actions
    executeAction(actionId);
  };

  const handleStatusChange = (status: string) => {
    setSelectedAction(`change-status-${status}`);
    executeAction(`change-status`, { status });
  };

  const executeAction = (actionId: string, data?: any) => {
    const actionData = {
      notes: actionNotes,
      sendNotification,
      priceAdjustment: priceAdjustment ? parseFloat(priceAdjustment) : undefined,
      ...data
    };

    onAction(actionId, actionData);

    // Reset form
    setActionNotes('');
    setPriceAdjustment('');
    setSelectedAction('');
    setShowConfirmation(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'AVAILABLE': 'bg-green-100 text-green-800',
      'SOLD': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'RESERVED': 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getModerationBadge = (status: string) => {
    const variants = {
      'APPROVED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'FLAGGED': 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Listing Status:</span>
                <Badge className={getStatusBadge(currentStatus)}>
                  {currentStatus}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Moderation:</span>
                <Badge className={getModerationBadge(moderationStatus)}>
                  {moderationStatus}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {featured && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {dealerPick && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Bookmark className="w-3 h-3 mr-1" />
                    Dealer Pick
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color} ${
                    action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => !action.disabled && handleQuickAction(action.id)}
                  disabled={action.disabled}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                  <span className="text-xs text-gray-500 text-center">{action.description}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>Status Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Change Status</label>
              <div className="grid grid-cols-2 gap-2">
                {statusActions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.disabled ? "outline" : "outline"}
                    size="sm"
                    onClick={() => !action.disabled && handleStatusChange(action.status)}
                    disabled={action.disabled}
                    className={action.disabled ? 'opacity-50' : ''}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Adjustment */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Adjustment</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="New price"
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => executeAction('update-price', { price: parseFloat(priceAdjustment) })}
                  disabled={!priceAdjustment}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.id)}
                  className={action.color}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Action Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Add Notes</label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Add notes about this action..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendNotification"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="sendNotification" className="text-sm">
                Send notification to dealer
              </label>
            </div>

            <Button
              onClick={() => executeAction('add-note')}
              disabled={!actionNotes.trim()}
              className="w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action History */}
      <Card>
        <CardHeader>
          <CardTitle>Action History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionHistory.map((action) => (
              <div key={action.id} className="border-l-2 border-gray-200 pl-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{action.action}</span>
                  <span className="text-xs text-gray-500">
                    {action.timestamp.toLocaleDateString()} {action.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600">by {action.user}</div>
                {action.notes && (
                  <div className="text-sm text-gray-500 mt-1">{action.notes}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-medium">Confirm Action</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to {selectedAction.replace('-', ' ')} this vehicle listing?
              This action may not be reversible.
            </p>

            {selectedAction === 'delete' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> Deleting this listing will permanently remove it from the platform.
                  All associated data, including analytics and lead history, will be lost.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => executeAction(selectedAction)}
                className={`flex-1 ${
                  selectedAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}