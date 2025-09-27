'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  impressions: number;
  clicks: number;
}

interface BannerDeleteModalProps {
  banner: Banner;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BannerDeleteModal({ banner, onSuccess, onCancel }: BannerDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete banner');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              Delete Banner
            </h2>
            <button
              onClick={onCancel}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this banner? This action cannot be undone.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-gray-900 mb-2">{banner.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Impressions:</span>
                    <span className="font-medium ml-2">{banner.impressions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Clicks:</span>
                    <span className="font-medium ml-2">{banner.clicks.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {banner.impressions > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This banner has received {banner.impressions.toLocaleString()} impressions
                    and {banner.clicks.toLocaleString()} clicks. Deleting it will remove all associated analytics data.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Banner
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}