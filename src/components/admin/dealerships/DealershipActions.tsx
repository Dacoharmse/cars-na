'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Edit,
  Trash2,
  Ban,
  Shield,
  FileText,
  DollarSign,
  Mail,
  Phone,
  Download,
  Eye,
  Settings,
  History,
  Flag,
  Users,
  Star
} from 'lucide-react';
import { DealershipData, DealershipStatus } from './DealershipList';

interface DealershipActionsProps {
  dealership: DealershipData;
  onClose: () => void;
}

export function DealershipActions({ dealership, onClose }: DealershipActionsProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<DealershipStatus | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (newStatus: DealershipStatus, action: string) => {
    setActionType(action);
    setTargetStatus(newStatus);
    setError(null);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (actionType === 'delete') {
        // DELETE request for deleting dealership
        const response = await fetch(`/api/admin/dealerships/${dealership.id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to delete dealership');
        }

        alert('Dealership deleted successfully!');
      } else {
        // PATCH request for status updates
        const response = await fetch(`/api/admin/dealerships/${dealership.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: actionType,
            status: targetStatus,
            reason: reason || undefined,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to update dealership status');
        }

        alert(`Dealership ${actionType}d successfully!`);
      }

      // Close modals
      setShowConfirmModal(false);
      setReason('');
      onClose();

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error performing action:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const canApprove = dealership.status === 'PENDING';
  const canSuspend = dealership.status === 'APPROVED';
  const canReactivate = dealership.status === 'SUSPENDED';
  const canReject = dealership.status === 'PENDING';

  const quickActions = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      color: 'text-blue-600 hover:text-blue-700',
      action: () => {
        console.log('View dealership details');
        onClose();
      }
    },
    {
      id: 'edit',
      label: 'Edit Info',
      icon: Edit,
      color: 'text-gray-600 hover:text-gray-700',
      action: () => {
        console.log('Edit dealership');
        onClose();
      }
    },
    {
      id: 'contact',
      label: 'Send Message',
      icon: MessageSquare,
      color: 'text-green-600 hover:text-green-700',
      action: () => {
        console.log('Send message to dealership');
        onClose();
      }
    },
    {
      id: 'call',
      label: 'Call Dealer',
      icon: Phone,
      color: 'text-purple-600 hover:text-purple-700',
      action: () => {
        window.open(`tel:${dealership.phone}`);
        onClose();
      }
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: Mail,
      color: 'text-orange-600 hover:text-orange-700',
      action: () => {
        if (dealership.email) {
          window.open(`mailto:${dealership.email}`);
        }
        onClose();
      }
    },
    {
      id: 'documents',
      label: 'View Documents',
      icon: FileText,
      color: 'text-indigo-600 hover:text-indigo-700',
      action: () => {
        console.log('View dealership documents');
        onClose();
      }
    }
  ];

  const statusActions = [
    {
      id: 'approve',
      label: 'Approve',
      icon: CheckCircle,
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'hover:bg-green-50',
      visible: canApprove,
      action: () => handleStatusChange('APPROVED', 'approve')
    },
    {
      id: 'suspend',
      label: 'Suspend',
      icon: XCircle,
      color: 'text-red-600 hover:text-red-700',
      bgColor: 'hover:bg-red-50',
      visible: canSuspend,
      action: () => handleStatusChange('SUSPENDED', 'suspend')
    },
    {
      id: 'reactivate',
      label: 'Reactivate',
      icon: Shield,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50',
      visible: canReactivate,
      action: () => handleStatusChange('APPROVED', 'reactivate')
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: Ban,
      color: 'text-gray-600 hover:text-gray-700',
      bgColor: 'hover:bg-gray-50',
      visible: canReject,
      action: () => handleStatusChange('REJECTED', 'reject')
    }
  ];

  const advancedActions = [
    {
      id: 'payments',
      label: 'View Payments',
      icon: DollarSign,
      color: 'text-green-600 hover:text-green-700',
      action: () => {
        console.log('View dealership payments');
        onClose();
      }
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: Star,
      color: 'text-yellow-600 hover:text-yellow-700',
      action: () => {
        console.log('View dealership analytics');
        onClose();
      }
    },
    {
      id: 'staff',
      label: 'Manage Staff',
      icon: Users,
      color: 'text-blue-600 hover:text-blue-700',
      action: () => {
        console.log('Manage dealership staff');
        onClose();
      }
    },
    {
      id: 'history',
      label: 'View History',
      icon: History,
      color: 'text-purple-600 hover:text-purple-700',
      action: () => {
        console.log('View dealership history');
        onClose();
      }
    },
    {
      id: 'flag',
      label: 'Flag for Review',
      icon: Flag,
      color: 'text-orange-600 hover:text-orange-700',
      action: () => {
        console.log('Flag dealership for review');
        onClose();
      }
    },
    {
      id: 'export',
      label: 'Export Data',
      icon: Download,
      color: 'text-gray-600 hover:text-gray-700',
      action: () => {
        console.log('Export dealership data');
        onClose();
      }
    }
  ];

  const dangerousActions = [
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      color: 'text-red-600 hover:text-red-700',
      action: () => handleStatusChange('REJECTED', 'delete')
    }
  ];

  return (
    <>
      <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Actions</h4>
              <p className="text-sm text-gray-500">{dealership.name}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1 mb-4">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Quick Actions</h5>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${action.color} hover:bg-gray-50`}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Status Actions */}
          {statusActions.some(action => action.visible) && (
            <div className="space-y-1 mb-4">
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status Actions</h5>
              {statusActions.filter(action => action.visible).map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${action.color} ${action.bgColor}`}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Advanced Actions */}
          <div className="space-y-1 mb-4">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Advanced</h5>
            {advancedActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${action.color} hover:bg-gray-50`}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Dangerous Actions */}
          <div className="pt-3 border-t">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Danger Zone</h5>
            {dangerousActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${action.color} hover:bg-red-50`}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  actionType === 'approve' ? 'bg-green-100' :
                  actionType === 'suspend' || actionType === 'delete' ? 'bg-red-100' :
                  actionType === 'reject' ? 'bg-gray-100' :
                  'bg-blue-100'
                }`}>
                  {actionType === 'approve' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {actionType === 'suspend' && <XCircle className="w-5 h-5 text-red-600" />}
                  {actionType === 'reject' && <Ban className="w-5 h-5 text-gray-600" />}
                  {actionType === 'reactivate' && <Shield className="w-5 h-5 text-blue-600" />}
                  {actionType === 'delete' && <Trash2 className="w-5 h-5 text-red-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {actionType} Dealership
                  </h3>
                  <p className="text-sm text-gray-500">{dealership.name}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  {actionType === 'approve' && 'This will approve the dealership and allow them to start listing vehicles.'}
                  {actionType === 'suspend' && 'This will suspend the dealership and hide their listings from public view.'}
                  {actionType === 'reject' && 'This will reject the dealership application.'}
                  {actionType === 'reactivate' && 'This will reactivate the dealership and restore their listings.'}
                  {actionType === 'delete' && 'This will permanently delete the dealership and all associated data. This action cannot be undone.'}
                </p>

                {(actionType === 'suspend' || actionType === 'reject' || actionType === 'delete') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason {actionType === 'delete' ? '(Required)' : '(Optional)'}
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={`Enter reason for ${actionType}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                      required={actionType === 'delete'}
                    />
                  </div>
                )}
              </div>

              {actionType === 'delete' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Warning</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This action is permanent and cannot be undone. All dealership data, vehicles, and leads will be permanently deleted.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Error</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setReason('');
                    setError(null);
                  }}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAction}
                  disabled={(actionType === 'delete' && !reason.trim()) || isLoading}
                  className={`flex-1 ${
                    actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    actionType === 'suspend' || actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'reject' ? 'bg-gray-600 hover:bg-gray-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' && 'Approve'}
                      {actionType === 'suspend' && 'Suspend'}
                      {actionType === 'reject' && 'Reject'}
                      {actionType === 'reactivate' && 'Reactivate'}
                      {actionType === 'delete' && 'Delete'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
    </>
  );
}