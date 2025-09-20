'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import {
  Search,
  Filter,
  Users,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
  Ban,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { UserDetails } from './UserDetails';
import { CreateUser } from './CreateUser';
import { UserActions } from './UserActions';
import { debounce } from '@/lib/utils';

export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
export type UserRole = 'ADMIN' | 'DEALER_PRINCIPAL' | 'SALES_EXECUTIVE' | 'USER';

interface UserFilters {
  search: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy: 'name' | 'email' | 'createdAt' | 'lastLoginAt' | 'loginCount';
  sortOrder: 'asc' | 'desc';
}

export function UserList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: undefined,
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Debounced search function
  const debouncedSearchUpdate = useMemo(
    () => debounce((searchValue: string) => {
      setFilters(prev => ({ ...prev, search: searchValue }));
      setCurrentPage(1);
    }, 300),
    []
  );

  // Fetch users with pagination and filters
  const {
    data: usersData,
    isLoading,
    error,
    refetch
  } = trpc.user.getAll.useQuery({
    page: currentPage,
    limit: pageSize,
    search: filters.search || undefined,
    role: filters.role,
    status: filters.status,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  });

  // Get user statistics
  const { data: stats } = trpc.user.getStats.useQuery();

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  const handleSearchChange = (value: string) => {
    debouncedSearchUpdate(value);
  };

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowDetailsModal(true);
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowDetailsModal(true);
  };

  const handleUserActions = (userId: string) => {
    setSelectedUserId(userId);
    setShowActionsModal(true);
  };

  const handleBulkActions = () => {
    if (selectedUsers.length > 0) {
      setShowActionsModal(true);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SUSPENDED': 'bg-red-100 text-red-800',
      'INACTIVE': 'bg-gray-100 text-gray-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'DEALER_PRINCIPAL': 'bg-blue-100 text-blue-800',
      'SALES_EXECUTIVE': 'bg-indigo-100 text-indigo-800',
      'USER': 'bg-gray-100 text-gray-800'
    };
    return variants[role] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportUsers = () => {
    // This would typically trigger a CSV/Excel export
    console.log('Exporting users...', selectedUsers.length > 0 ? selectedUsers : 'all');
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Users</h3>
            <p className="text-sm text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold">{stats.suspendedUsers}</p>
                </div>
                <Ban className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recent Logins</p>
                  <p className="text-2xl font-bold">{stats.recentLogins}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select
                value={filters.role || ''}
                onValueChange={(value) => handleFilterChange('role', value || undefined)}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="DEALER_PRINCIPAL">Dealer Principal</option>
                <option value="SALES_EXECUTIVE">Sales Executive</option>
                <option value="USER">User</option>
              </Select>
            </div>
            <div>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value || undefined)}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </div>
            <div>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="lastLoginAt">Last Login</option>
                <option value="loginCount">Login Count</option>
              </Select>
            </div>
            <div>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => handleFilterChange('sortOrder', value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleBulkActions}>
                  Bulk Actions
                </Button>
                <Button variant="outline" size="sm" onClick={exportUsers}>
                  Export Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({pagination?.total || 0})</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-gray-600 mb-4">
                {filters.search || filters.role || filters.status
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by adding your first user.'}
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center justify-center w-4 h-4"
                      >
                        {selectedUsers.length === users.length ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : selectedUsers.length > 0 ? (
                          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-white"></div>
                          </div>
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dealership
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleSelectUser(user.id)}
                          className="flex items-center justify-center w-4 h-4"
                        >
                          {selectedUsers.includes(user.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.dealership?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserActions(user.id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} results
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateUser
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            refetch();
            setShowCreateModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedUserId && (
        <UserDetails
          isOpen={showDetailsModal}
          userId={selectedUserId}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUserId(null);
          }}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {showActionsModal && (
        <UserActions
          isOpen={showActionsModal}
          userIds={selectedUserId ? [selectedUserId] : selectedUsers}
          onClose={() => {
            setShowActionsModal(false);
            setSelectedUserId(null);
          }}
          onSuccess={() => {
            refetch();
            setSelectedUsers([]);
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
}