'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Activity,
  Shield,
  Key,
  History,
  Edit,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Ban,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserStatus, UserRole } from './UserList';

interface UserDetailsProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  dealershipId: string | null;
  address: string;
  city: string;
  region: string;
  postalCode: string;
}

export function UserDetails({ isOpen, userId, onClose, onSuccess }: UserDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'USER',
    status: 'ACTIVE',
    dealershipId: null,
    address: '',
    city: '',
    region: '',
    postalCode: ''
  });

  // Fetch user details
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = trpc.user.getById.useQuery(
    { id: userId },
    { enabled: isOpen && !!userId }
  );

  // Fetch dealerships for dropdown
  const { data: dealerships } = trpc.dealership.getAll.useQuery();

  // Fetch user audit logs
  const { data: auditLogs } = trpc.user.getAuditLogs.useQuery(
    { userId, limit: 20 },
    { enabled: isOpen && !!userId }
  );

  // Update user mutation
  const updateUserMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch();
      onSuccess();
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    }
  });

  // Reset password mutation
  const resetPasswordMutation = trpc.user.resetPassword.useMutation({
    onSuccess: () => {
      setNewPassword('');
      setConfirmPassword('');
      refetch();
    },
    onError: (error) => {
      console.error('Error resetting password:', error);
    }
  });

  // Suspend user mutation
  const suspendUserMutation = trpc.user.suspend.useMutation({
    onSuccess: () => {
      refetch();
      onSuccess();
    },
    onError: (error) => {
      console.error('Error suspending user:', error);
    }
  });

  // Activate user mutation
  const activateUserMutation = trpc.user.activate.useMutation({
    onSuccess: () => {
      refetch();
      onSuccess();
    },
    onError: (error) => {
      console.error('Error activating user:', error);
    }
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        dealershipId: user.dealershipId,
        address: user.address || '',
        city: user.city || '',
        region: user.region || '',
        postalCode: user.postalCode || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateUserMutation.mutate({
      id: userId,
      ...formData,
      dealershipId: formData.dealershipId || undefined
    });
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    resetPasswordMutation.mutate({
      id: userId,
      newPassword
    });
  };

  const handleSuspendUser = () => {
    const reason = prompt('Reason for suspension:');
    if (reason) {
      suspendUserMutation.mutate({
        id: userId,
        reason
      });
    }
  };

  const handleActivateUser = () => {
    activateUserMutation.mutate({ id: userId });
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants = {
      'ACTIVE': { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'PENDING': { className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'SUSPENDED': { className: 'bg-red-100 text-red-800', icon: Ban },
      'INACTIVE': { className: 'bg-gray-100 text-gray-800', icon: User }
    };
    const variant = variants[status] || variants.INACTIVE;
    const Icon = variant.icon;
    return (
      <Badge className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'DEALER_PRINCIPAL': 'bg-blue-100 text-blue-800',
      'SALES_EXECUTIVE': 'bg-indigo-100 text-indigo-800',
      'USER': 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={variants[role] || variants.USER}>
        <Shield className="w-3 h-3 mr-1" />
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    const colors = {
      'CREATED': 'text-blue-600',
      'UPDATED': 'text-green-600',
      'DELETED': 'text-red-600',
      'SUSPENDED': 'text-red-600',
      'ACTIVATED': 'text-green-600',
      'PASSWORD_RESET': 'text-orange-600',
      'EMAIL_VERIFIED': 'text-green-600',
      'LOGIN': 'text-blue-600',
      'LOGOUT': 'text-gray-600',
      'ROLE_CHANGED': 'text-purple-600'
    };
    return colors[action as keyof typeof colors] || 'text-gray-600';
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="large"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error Loading User</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-700">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name || 'No Name'}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user.status === 'SUSPENDED' ? (
                  <Button
                    variant="outline"
                    onClick={handleActivateUser}
                    disabled={activateUserMutation.isLoading}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                ) : user.status === 'ACTIVE' && user.role !== 'ADMIN' ? (
                  <Button
                    variant="outline"
                    onClick={handleSuspendUser}
                    disabled={suspendUserMutation.isLoading}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                ) : null}
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => {
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={updateUserMutation.isLoading}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data
                      setFormData({
                        name: user.name || '',
                        email: user.email,
                        phone: user.phone || '',
                        role: user.role,
                        status: user.status,
                        dealershipId: user.dealershipId,
                        address: user.address || '',
                        city: user.city || '',
                        region: user.region || '',
                        postalCode: user.postalCode || ''
                      });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'profile'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <User className="w-4 h-4 mr-2 inline" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'security'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-2 inline" />
                      Security
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'activity'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Activity className="w-4 h-4 mr-2 inline" />
                      Activity
                    </button>
                  </nav>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="py-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            {isEditing ? (
                              <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter full name"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.name || 'No name set'}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            {isEditing ? (
                              <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter email address"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.email}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            {isEditing ? (
                              <Input
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.phone || 'No phone set'}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Role & Status */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Role & Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            {isEditing ? (
                              <Select
                                value={formData.role}
                                onValueChange={(value) => handleInputChange('role', value)}
                              >
                                <option value="USER">User</option>
                                <option value="SALES_EXECUTIVE">Sales Executive</option>
                                <option value="DEALER_PRINCIPAL">Dealer Principal</option>
                                <option value="ADMIN">Admin</option>
                              </Select>
                            ) : (
                              <div>{getRoleBadge(user.role)}</div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            {isEditing ? (
                              <Select
                                value={formData.status}
                                onValueChange={(value) => handleInputChange('status', value)}
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING">Pending</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="INACTIVE">Inactive</option>
                              </Select>
                            ) : (
                              <div>{getStatusBadge(user.status)}</div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Dealership</label>
                            {isEditing ? (
                              <Select
                                value={formData.dealershipId || ''}
                                onValueChange={(value) => handleInputChange('dealershipId', value || null)}
                              >
                                <option value="">No Dealership</option>
                                {dealerships?.map((dealership) => (
                                  <option key={dealership.id} value={dealership.id}>
                                    {dealership.name}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <p className="text-sm text-gray-900">
                                {user.dealership?.name || 'No dealership assigned'}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Address Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Address Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            {isEditing ? (
                              <Input
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Street address"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.address || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            {isEditing ? (
                              <Input
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="City"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.city || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Region</label>
                            {isEditing ? (
                              <Input
                                value={formData.region}
                                onChange={(e) => handleInputChange('region', e.target.value)}
                                placeholder="Region/State"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.region || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Postal Code</label>
                            {isEditing ? (
                              <Input
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                placeholder="Postal code"
                              />
                            ) : (
                              <p className="text-sm text-gray-900">{user.postalCode || '-'}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Created</label>
                            <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Last Login</label>
                            <p className="text-sm text-gray-900">
                              {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Login Count</label>
                            <p className="text-sm text-gray-900">{user.loginCount || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="py-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">New Password</label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Confirm Password</label>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <Button
                          onClick={handleResetPassword}
                          disabled={!newPassword || !confirmPassword || resetPasswordMutation.isLoading}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Reset Password
                        </Button>
                      </CardContent>
                    </Card>

                    {user.isSuspended && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-red-600">Suspension Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm font-medium mb-1">Reason</label>
                              <p className="text-sm text-gray-900">{user.suspendReason || 'No reason provided'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Suspended At</label>
                              <p className="text-sm text-gray-900">
                                {user.suspendedAt ? formatDate(user.suspendedAt) : 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="py-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {auditLogs?.logs.length ? (
                          <div className="space-y-4">
                            {auditLogs.logs.map((log) => (
                              <div key={log.id} className="flex items-start space-x-3 py-3 border-b last:border-b-0">
                                <div className="flex-shrink-0">
                                  <History className={`w-5 h-5 ${getActionColor(log.action)}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900">
                                      {log.action.replace('_', ' ').toLowerCase()}
                                    </p>
                                    <time className="text-xs text-gray-500">
                                      {formatDate(log.createdAt)}
                                    </time>
                                  </div>
                                  {log.details && (
                                    <p className="text-sm text-gray-600">{log.details}</p>
                                  )}
                                  {log.ipAddress && (
                                    <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold mb-2">No Activity</h3>
                            <p className="text-gray-600">No recent activity found for this user.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Tabs>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}