'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog } from '@/components/ui/Dialog';
import { Switch } from '@/components/ui/Switch';
import { X, Save, Upload, Eye } from 'lucide-react';

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
}

interface BannerFormProps {
  banner?: Banner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BannerForm({ banner, onSuccess, onCancel }: BannerFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    buttonText: '',
    isActive: true,
    position: 'MAIN',
    priority: 0,
    startDate: '',
    endDate: '',
    backgroundColor: '#1F3469',
    textColor: '#FFFFFF',
    overlayOpacity: 0.5,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        imageUrl: banner.imageUrl || '',
        linkUrl: banner.linkUrl || '',
        buttonText: banner.buttonText || '',
        isActive: banner.isActive,
        position: banner.position,
        priority: banner.priority,
        startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
        endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
        backgroundColor: banner.backgroundColor || '#1F3469',
        textColor: banner.textColor || '#FFFFFF',
        overlayOpacity: banner.overlayOpacity || 0.5,
      });
    }
  }, [banner]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.linkUrl && !isValidUrl(formData.linkUrl)) {
      newErrors.linkUrl = 'Please enter a valid URL';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }

    if (formData.overlayOpacity < 0 || formData.overlayOpacity > 1) {
      newErrors.overlayOpacity = 'Overlay opacity must be between 0 and 1';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = banner ? `/api/admin/banners/${banner.id}` : '/api/admin/banners';
      const method = banner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to save banner' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {banner ? 'Edit Banner' : 'Create New Banner'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex">
            {/* Form Fields */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter banner title"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <Input
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="Enter banner subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter banner description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <Input
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className={errors.imageUrl ? 'border-red-500' : ''}
                    />
                    {errors.imageUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link URL
                    </label>
                    <Input
                      name="linkUrl"
                      value={formData.linkUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={errors.linkUrl ? 'border-red-500' : ''}
                    />
                    {errors.linkUrl && (
                      <p className="mt-1 text-sm text-red-600">{errors.linkUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <Input
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      placeholder="Learn More, Shop Now, etc."
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MAIN">Main Banner</option>
                      <option value="HERO">Hero Section</option>
                      <option value="SIDEBAR">Sidebar</option>
                      <option value="FOOTER">Footer</option>
                      <option value="BETWEEN">Between Sections</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (higher = more prominent)
                    </label>
                    <Input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={errors.endDate ? 'border-red-500' : ''}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Active
                    </label>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                    />
                  </div>
                </div>

                {/* Styling */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900">Styling</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          name="backgroundColor"
                          value={formData.backgroundColor}
                          onChange={handleInputChange}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          name="backgroundColor"
                          value={formData.backgroundColor}
                          onChange={handleInputChange}
                          placeholder="#1F3469"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          name="textColor"
                          value={formData.textColor}
                          onChange={handleInputChange}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          name="textColor"
                          value={formData.textColor}
                          onChange={handleInputChange}
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overlay Opacity (0-1)
                      </label>
                      <Input
                        type="number"
                        name="overlayOpacity"
                        value={formData.overlayOpacity}
                        onChange={handleInputChange}
                        min="0"
                        max="1"
                        step="0.1"
                        className={errors.overlayOpacity ? 'border-red-500' : ''}
                      />
                      {errors.overlayOpacity && (
                        <p className="mt-1 text-sm text-red-600">{errors.overlayOpacity}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="w-80 bg-gray-50 border-l">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Preview
                </h3>
              </div>
              <div className="p-4">
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backgroundColor: formData.backgroundColor,
                      opacity: formData.overlayOpacity,
                    }}
                  >
                    <div className="text-center p-4">
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: formData.textColor }}
                      >
                        {formData.title || 'Banner Title'}
                      </h3>
                      {formData.subtitle && (
                        <p
                          className="text-sm mb-3"
                          style={{ color: formData.textColor }}
                        >
                          {formData.subtitle}
                        </p>
                      )}
                      {formData.buttonText && (
                        <button
                          className="px-4 py-2 rounded text-sm font-medium"
                          style={{
                            backgroundColor: formData.textColor,
                            color: formData.backgroundColor,
                          }}
                        >
                          {formData.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{formData.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-medium">{formData.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {banner ? 'Update Banner' : 'Create Banner'}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}