'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import {
  UserCheck,
  Ban,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Users,
  MessageSquare,
  RefreshCw,
  X,
  Mail,
  Key,
  Download
} from 'lucide-react';

interface UserActionsProps {
  isOpen: boolean;
  userIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

type BulkAction = 'suspend' | 'activate' | 'delete' | 'export' | 'email' | 'reset_password';

export function UserActions({ isOpen, userIds, onClose, onSuccess }: UserActionsProps) {
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [reason, setReason] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Fetch user details for the selected users
  const { data: users, isLoading } = api.user.getAll.useQuery(
    {
      page: 1,
      limit: 100
    },
    {
      enabled: isOpen && userIds.length > 0,
      select: (data) => data.users.filter(user => userIds.includes(user.id))
    }
  );

  // Bulk action mutation
  const bulkActionMutation = api.user.bulkAction.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Bulk action error:', error);
    }
  });

  // Individual action mutations
  const suspendMutation = api.user.suspend.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
      resetForm();
    }
  });

  const activateMutation = api.user.activate.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
      resetForm();
    }
  });

  const resetPasswordMutation = api.user.resetPassword.useMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
      resetForm();
    }
  });

  const resetForm = () => {
    setSelectedAction(null);
    setReason('');
    setIsConfirming(false);
    setEmailSubject('');
    setEmailMessage('');
    setNewPassword('');
  };

  const isSingleUser = userIds.length === 1;
  const user = isSingleUser ? users?.[0] : null;

  const handleActionConfirm = () => {
    if (!selectedAction) return;

    switch (selectedAction) {
      case 'suspend':
        if (isSingleUser && user) {
          suspendMutation.mutate({
            id: user.id,
            reason: reason || 'Suspended by admin'
          });
        } else {
          bulkActionMutation.mutate({
            userIds,
            action: 'suspend',
            reason: reason || 'Bulk suspension by admin'
          });
        }
        break;

      case 'activate':
        if (isSingleUser && user) {
          activateMutation.mutate({ id: user.id });
        } else {
          bulkActionMutation.mutate({
            userIds,
            action: 'activate'
          });
        }
        break;

      case 'delete':
        bulkActionMutation.mutate({
          userIds,
          action: 'delete',
          reason: reason || 'Deleted by admin'
        });
        break;

      case 'reset_password':
        if (isSingleUser && user && newPassword) {
          resetPasswordMutation.mutate({
            id: user.id,
            newPassword
          });
        }
        break;

      case 'export':
        // Handle export logic here
        console.log('Exporting users:', userIds);
        onClose();
        break;

      case 'email':
        // Handle email logic here
        console.log('Sending email to users:', userIds, { subject: emailSubject, message: emailMessage });
        onClose();
        break;
    }
  };

  const getActionIcon = (action: BulkAction) => {
    const icons = {
      suspend: Ban,
      activate: UserCheck,
      delete: Trash2,
      export: Download,
      email: Mail,
      reset_password: Key
    };
    return icons[action];
  };

  const getActionColor = (action: BulkAction) => {
    const colors = {
      suspend: 'text-red-600',
      activate: 'text-green-600',
      delete: 'text-red-600',
      export: 'text-blue-600',
      email: 'text-blue-600',
      reset_password: 'text-orange-600'
    };
    return colors[action];
  };

  const getActionDescription = (action: BulkAction) => {
    const descriptions = {
      suspend: 'Suspend selected users from accessing the platform',
      activate: 'Activate selected users to allow platform access',
      delete: 'Permanently delete selected users and their data',
      export: 'Export selected user data to CSV format',
      email: 'Send a custom email to selected users',
      reset_password: 'Reset password for the selected user'
    };
    return descriptions[action];
  };

  const availableActions: BulkAction[] = isSingleUser
    ? ['suspend', 'activate', 'delete', 'export', 'email', 'reset_password']
    : ['suspend', 'activate', 'delete', 'export', 'email'];

  const isActionDisabled = (action: BulkAction) => {
    if (!users || users.length === 0) return true;

    // Don't allow suspending/deleting admin users
    const hasAdminUsers = users.some(user => user.role === 'ADMIN');
    if ((action === 'suspend' || action === 'delete') && hasAdminUsers) {
      return true;
    }

    // Don't show suspend for already suspended users
    if (action === 'suspend' && users.every(user => user.status === 'SUSPENDED')) {
      return true;
    }

    // Don't show activate for already active users
    if (action === 'activate' && users.every(user => user.status === 'ACTIVE')) {
      return true;
    }

    return false;
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSingleUser ? 'User Actions' : 'Bulk Actions'}
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Selected Users Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Selected Users ({userIds.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users && users.length > 0 ? (
                  <div className="space-y-2">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name || 'No Name'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'DEALER_PRINCIPAL' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'SALES_EXECUTIVE' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {user.role.replace('_', ' ')}
                          </Badge>
                          <Badge className={
                            user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            user.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {users.length > 5 && (
                      <p className="text-sm text-gray-500 pt-2">
                        ...and {users.length - 5} more users
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No users selected</p>
                )}
              </CardContent>
            </Card>

            {!isConfirming ? (
              /* Action Selection */
              <Card>
                <CardHeader>
                  <CardTitle>Choose Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {availableActions.map((action) => {
                      const Icon = getActionIcon(action);
                      const disabled = isActionDisabled(action);

                      return (
                        <button
                          key={action}
                          onClick={() => {
                            if (!disabled) {
                              setSelectedAction(action);
                              setIsConfirming(true);
                            }
                          }}
                          disabled={disabled}
                          className={`flex items-center p-4 border rounded-lg text-left transition-colors ${
                            disabled
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${disabled ? 'text-gray-400' : getActionColor(action)}`} />
                          <div>
                            <h3 className="font-medium capitalize">
                              {action.replace('_', ' ')}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getActionDescription(action)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Action Confirmation */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {(() => {
                      const Icon = getActionIcon(selectedAction!);
                      return <Icon className={`w-5 h-5 mr-2 ${getActionColor(selectedAction!)}`} />;
                    })()}
                    Confirm {selectedAction?.replace('_', ' ').toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAction === 'delete' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-red-800">Warning</h4>
                          <p className="text-sm text-red-700 mt-1">
                            This action cannot be undone. The selected user{userIds.length > 1 ? 's' : ''} and all associated data will be permanently deleted.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedAction === 'suspend' || selectedAction === 'delete') && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reason {selectedAction === 'delete' ? '(Required)' : '(Optional)'}
                      </label>
                      <Input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={`Enter reason for ${selectedAction}...`}
                        required={selectedAction === 'delete'}
                      />
                    </div>
                  )}

                  {selectedAction === 'email' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Email subject..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                          placeholder="Email message..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </>
                  )}

                  {selectedAction === 'reset_password' && isSingleUser && (
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 8 characters)..."
                        minLength={8}
                        required
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsConfirming(false);
                        setSelectedAction(null);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleActionConfirm}
                      disabled={
                        bulkActionMutation.isLoading ||
                        suspendMutation.isLoading ||
                        activateMutation.isLoading ||
                        resetPasswordMutation.isLoading ||
                        (selectedAction === 'delete' && !reason) ||
                        (selectedAction === 'email' && (!emailSubject || !emailMessage)) ||
                        (selectedAction === 'reset_password' && (!newPassword || newPassword.length < 8))
                      }
                      className={selectedAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      {(bulkActionMutation.isLoading || suspendMutation.isLoading || activateMutation.isLoading || resetPasswordMutation.isLoading) ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Confirm {selectedAction?.replace('_', ' ').toUpperCase()}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}