'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Trash2, Eye, BarChart3, ExternalLink } from 'lucide-react';
import { BannerForm } from '@/components/admin/banners/BannerForm';
import { BannerDeleteModal } from '@/components/admin/banners/BannerDeleteModal';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  isActive: boolean;
  position: string;
  priority: number;
  startDate?: string;
  endDate?: string;
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: number;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBanner(null);
    fetchBanners();
  };

  const handleDeleteSuccess = () => {
    setDeletingBanner(null);
    fetchBanners();
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...banner,
          isActive: !banner.isActive,
        }),
      });

      if (response.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const getPositionColor = (position: string) => {
    const colors = {
      MAIN: 'bg-blue-100 text-blue-800',
      HERO: 'bg-purple-100 text-purple-800',
      SIDEBAR: 'bg-green-100 text-green-800',
      FOOTER: 'bg-gray-100 text-gray-800',
      BETWEEN: 'bg-yellow-100 text-yellow-800',
    };
    return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredBanners = banners.filter(banner => {
    if (filter === 'all') return true;
    if (filter === 'active') return banner.isActive;
    if (filter === 'inactive') return !banner.isActive;
    return banner.position === filter;
  });

  const calculateCTR = (banner: Banner) => {
    if (banner.impressions === 0) return 0;
    return ((banner.clicks / banner.impressions) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-2">Manage advertising banners displayed on the website</p>
        </div>
        <Button onClick={handleCreateBanner} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Banner
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All Banners' },
          { key: 'active', label: 'Active' },
          { key: 'inactive', label: 'Inactive' },
          { key: 'MAIN', label: 'Main' },
          { key: 'HERO', label: 'Hero' },
          { key: 'SIDEBAR', label: 'Sidebar' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBanners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 line-clamp-1">
                    {banner.title}
                  </CardTitle>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge className={getPositionColor(banner.position)}>
                    {banner.position}
                  </Badge>
                  <Badge
                    className={
                      banner.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Banner Preview */}
              {banner.imageUrl && (
                <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backgroundColor: banner.backgroundColor || 'rgba(0,0,0,0.5)',
                      opacity: banner.overlayOpacity || 0.5
                    }}
                  >
                    <div className="text-center">
                      <h3
                        className="font-bold text-lg"
                        style={{ color: banner.textColor || 'white' }}
                      >
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p
                          className="text-sm"
                          style={{ color: banner.textColor || 'white' }}
                        >
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Banner Stats */}
              <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {banner.impressions.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {banner.clicks.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {calculateCTR(banner)}%
                  </div>
                  <div className="text-xs text-gray-600">CTR</div>
                </div>
              </div>

              {/* Banner Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-medium">{banner.priority}</span>
                </div>
                {banner.linkUrl && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Link:</span>
                    <a
                      href={banner.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </a>
                  </div>
                )}
                {banner.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start:</span>
                    <span className="font-medium">
                      {new Date(banner.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {banner.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">End:</span>
                    <span className="font-medium">
                      {new Date(banner.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditBanner(banner)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleBannerStatus(banner)}
                  className={`flex-1 ${
                    banner.isActive
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {banner.isActive ? 'Hide' : 'Show'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingBanner(banner)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBanners.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? "Get started by creating your first banner"
              : `No banners match the current filter: ${filter}`}
          </p>
          {filter === 'all' && (
            <Button onClick={handleCreateBanner} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Banner
            </Button>
          )}
        </div>
      )}

      {/* Banner Form Modal */}
      {showForm && (
        <BannerForm
          banner={editingBanner}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingBanner && (
        <BannerDeleteModal
          banner={deletingBanner}
          onSuccess={handleDeleteSuccess}
          onCancel={() => setDeletingBanner(null)}
        />
      )}
    </div>
  );
}