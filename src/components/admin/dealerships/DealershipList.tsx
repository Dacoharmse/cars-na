'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  Users,
  Car,
  DollarSign,
  ChevronDown,
  SortAsc,
  SortDesc,
  Download,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { DealershipActions } from './DealershipActions';
import { DealershipDetails } from './DealershipDetails';
import { CreateDealership } from './CreateDealership';

export type DealershipStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface DealershipData {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  city: string;
  region: string;
  status: DealershipStatus;
  isVerified: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  vehiclesCount: number;
  leadsCount: number;
  monthlyRevenue: number;
  totalRevenue: number;
  commissionRate: number;
  website?: string;
  businessType?: string;
  registrationNumber?: string;
}

interface DealershipListProps {
  onSelectDealership?: (dealership: DealershipData) => void;
}

type SortField = 'name' | 'status' | 'createdAt' | 'vehiclesCount' | 'monthlyRevenue' | 'city';
type SortDirection = 'asc' | 'desc';

export function DealershipList({ onSelectDealership }: DealershipListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DealershipStatus | 'ALL'>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedDealership, setSelectedDealership] = useState<DealershipData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [dealerships, setDealerships] = useState<DealershipData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDealerships = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dealerships');
      if (!res.ok) {
        throw new Error(`Failed to fetch dealerships (${res.status})`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dealerships');
      }
      // Map API response fields to DealershipData interface
      const mapped: DealershipData[] = (data.dealerships || []).map((d: any) => ({
        id: d.id,
        name: d.name || '',
        contactPerson: d.contactPerson || '',
        phone: d.phone || '',
        email: d.email || undefined,
        city: d.city || '',
        region: d.region || '',
        status: (d.status || 'PENDING') as DealershipStatus,
        isVerified: d.verificationStatus === 'VERIFIED',
        isFeatured: false,
        createdAt: d.joinedAt || new Date().toISOString(),
        updatedAt: d.joinedAt || new Date().toISOString(),
        vehiclesCount: d.activeListings ?? d.totalListings ?? 0,
        leadsCount: 0,
        monthlyRevenue: d.monthlyRevenue ?? 0,
        totalRevenue: d.totalSales ?? 0,
        commissionRate: 5,
        website: d.website || undefined,
        businessType: d.businessType || undefined,
        registrationNumber: d.businessLicense || d.taxNumber || undefined,
      }));
      setDealerships(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDealerships();
  }, [fetchDealerships]);

  const regions = ['ALL', 'Khomas', 'Erongo', 'Oshana', 'Hardap', 'Kavango East', 'Kavango West', 'Kunene', 'Ohangwena', 'Omaheke', 'Omusati', 'Oshikoto', 'Otjozondjupa', 'Zambezi'];

  const filteredAndSortedDealerships = useMemo(() => {
    let filtered = dealerships.filter(dealership => {
      const matchesSearch = searchTerm === '' ||
        dealership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealership.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealership.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealership.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || dealership.status === statusFilter;
      const matchesRegion = regionFilter === 'ALL' || dealership.region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [dealerships, searchTerm, statusFilter, regionFilter, sortField, sortDirection]);

  const getStatusBadge = (status: DealershipStatus) => {
    const variants = {
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'SUSPENDED': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      'REJECTED': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
    };
    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.bg} ${variant.text} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  const handleViewDetails = (dealership: DealershipData) => {
    setSelectedDealership(dealership);
    setShowDetailsModal(true);
    if (onSelectDealership) {
      onSelectDealership(dealership);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Contact Person', 'Email', 'Phone', 'City', 'Region', 'Status', 'Vehicles', 'Monthly Revenue', 'Created At'].join(','),
      ...filteredAndSortedDealerships.map(d => [
        d.name,
        d.contactPerson,
        d.email || '',
        d.phone,
        d.city,
        d.region,
        d.status,
        d.vehiclesCount,
        d.monthlyRevenue,
        new Date(d.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dealerships.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredAndSortedDealerships.length,
    approved: filteredAndSortedDealerships.filter(d => d.status === 'APPROVED').length,
    pending: filteredAndSortedDealerships.filter(d => d.status === 'PENDING').length,
    suspended: filteredAndSortedDealerships.filter(d => d.status === 'SUSPENDED').length,
    totalRevenue: filteredAndSortedDealerships.reduce((sum, d) => sum + d.monthlyRevenue, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dealership Management</h2>
          <p className="text-gray-600">Manage dealer partnerships and onboarding</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Dealership
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-purple-600">N${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search dealerships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DealershipStatus | 'ALL')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'ALL' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-600">Loading dealerships...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load dealerships</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchDealerships}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dealerships Table */}
      {!isLoading && !error && <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Dealership
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('city')}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      {getSortIcon('city')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('vehiclesCount')}
                  >
                    <div className="flex items-center gap-2">
                      Performance
                      {getSortIcon('vehiclesCount')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('monthlyRevenue')}
                  >
                    <div className="flex items-center gap-2">
                      Revenue
                      {getSortIcon('monthlyRevenue')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedDealerships.map((dealership) => (
                  <tr key={dealership.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{dealership.name}</div>
                          <div className="text-sm text-gray-500">{dealership.businessType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3" />
                          {dealership.contactPerson}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Phone className="w-3 h-3" />
                          {dealership.phone}
                        </div>
                        {dealership.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {dealership.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dealership.city}, {dealership.region}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(dealership.status)}
                      {dealership.isVerified && (
                        <div className="mt-1">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Verified</Badge>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {dealership.vehiclesCount} vehicles
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {dealership.leadsCount} leads
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        N${dealership.monthlyRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dealership.commissionRate}% commission
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(dealership)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowActionsMenu(showActionsMenu === dealership.id ? null : dealership.id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          {showActionsMenu === dealership.id && (
                            <DealershipActions
                              dealership={dealership}
                              onClose={() => setShowActionsMenu(null)}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedDealerships.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No dealerships found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>}

      {/* Modals */}
      {showDetailsModal && selectedDealership && (
        <DealershipDetails
          dealership={selectedDealership}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedDealership(null);
          }}
        />
      )}

      {showCreateModal && (
        <CreateDealership
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}