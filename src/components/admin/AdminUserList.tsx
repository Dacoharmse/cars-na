'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  Download,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DEALER_PRINCIPAL' | 'SALES_EXECUTIVE' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  joinDate: string;
  lastLogin?: string;
  dealershipName?: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
    status: 'ACTIVE',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@premium.com',
    role: 'DEALER_PRINCIPAL',
    status: 'ACTIVE',
    joinDate: '2024-01-14',
    lastLogin: '2024-01-20',
    dealershipName: 'Premium Motors'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    role: 'USER',
    status: 'PENDING',
    joinDate: '2024-01-13'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah@citycars.com',
    role: 'SALES_EXECUTIVE',
    status: 'SUSPENDED',
    joinDate: '2024-01-12',
    dealershipName: 'City Cars'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@cars.na',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinDate: '2023-12-01',
    lastLogin: '2024-01-20'
  }
];

export function AdminUserList() {
  const [users] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SUSPENDED': 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'DEALER_PRINCIPAL': 'bg-blue-100 text-blue-800',
      'SALES_EXECUTIVE': 'bg-indigo-100 text-indigo-800',
      'USER': 'bg-gray-100 text-gray-800'
    };
    return variants[role as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage platform users and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="DEALER_PRINCIPAL">Dealer Principal</option>
              <option value="SALES_EXECUTIVE">Sales Executive</option>
              <option value="USER">User</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleBadge(user.role)}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadge(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.dealershipName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin || 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}