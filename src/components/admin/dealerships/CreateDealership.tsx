'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  X,
  Building2,
  Users,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Upload,
  Plus,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

interface CreateDealershipProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (dealership: any) => void;
}

interface FormData {
  // Basic Information
  name: string;
  businessType: string;
  registrationNumber: string;
  taxNumber: string;

  // Contact Information
  contactPerson: string;
  phone: string;
  alternatePhone: string;
  email: string;
  website: string;

  // Location Information
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;

  // Business Details
  description: string;
  commissionRate: number;

  // Documents
  documents: {
    businessRegistration: File | null;
    taxClearance: File | null;
    bankStatement: File | null;
    otherDocuments: File[];
  };
}

export function CreateDealership({ isOpen, onClose, onSuccess }: CreateDealershipProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    businessType: 'Car Dealership',
    registrationNumber: '',
    taxNumber: '',
    contactPerson: '',
    phone: '',
    alternatePhone: '',
    email: '',
    website: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    description: '',
    commissionRate: 5,
    documents: {
      businessRegistration: null,
      taxClearance: null,
      bankStatement: null,
      otherDocuments: []
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Business details and registration'
    },
    {
      id: 2,
      title: 'Contact Information',
      description: 'Contact details and location'
    },
    {
      id: 3,
      title: 'Business Setup',
      description: 'Commission and preferences'
    },
    {
      id: 4,
      title: 'Documents',
      description: 'Upload required documents'
    },
    {
      id: 5,
      title: 'Review',
      description: 'Review and submit'
    }
  ];

  const regions = [
    'Khomas', 'Erongo', 'Oshana', 'Hardap', 'Kavango East', 'Kavango West',
    'Kunene', 'Ohangwena', 'Omaheke', 'Omusati', 'Oshikoto', 'Otjozondjupa', 'Zambezi'
  ];

  const businessTypes = [
    'Car Dealership',
    'Used Car Dealer',
    'New Car Dealer',
    'Commercial Vehicle Dealer',
    'Motorcycle Dealer',
    'Auto Trading'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Business name is required';
        if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
        if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
        break;

      case 2:
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.region.trim()) newErrors.region = 'Region is required';
        break;

      case 3:
        if (formData.commissionRate < 0 || formData.commissionRate > 20) {
          newErrors.commissionRate = 'Commission rate must be between 0% and 20%';
        }
        break;

      case 4:
        if (!formData.documents.businessRegistration) {
          newErrors.businessRegistration = 'Business registration certificate is required';
        }
        if (!formData.documents.taxClearance) {
          newErrors.taxClearance = 'Tax clearance certificate is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (field: keyof FormData['documents'], file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));

    // Clear error when file is uploaded
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      // In real app, this would upload files and create the dealership
      const dealershipData = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'PENDING',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        vehiclesCount: 0,
        leadsCount: 0,
        monthlyRevenue: 0,
        totalRevenue: 0
      };

      console.log('Creating dealership:', dealershipData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onSuccess) {
        onSuccess(dealershipData);
      }

      onClose();
    } catch (error) {
      console.error('Error creating dealership:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter business name"
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Type *</label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${errors.businessType ? 'border-red-300' : ''}`}
              >
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.businessType && <p className="text-red-600 text-sm mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Registration Number *</label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="e.g., CC/2024/12345"
                className={errors.registrationNumber ? 'border-red-300' : ''}
              />
              {errors.registrationNumber && <p className="text-red-600 text-sm mt-1">{errors.registrationNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tax Number</label>
              <Input
                value={formData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                placeholder="Enter tax registration number"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Business Verification</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                All business information will be verified against official records. Please ensure accuracy to avoid delays.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Contact Person *</label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                placeholder="Full name of primary contact"
                className={errors.contactPerson ? 'border-red-300' : ''}
              />
              {errors.contactPerson && <p className="text-red-600 text-sm mt-1">{errors.contactPerson}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Primary Phone *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+264 61 123456"
                  className={errors.phone ? 'border-red-300' : ''}
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alternate Phone</label>
                <Input
                  value={formData.alternatePhone}
                  onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                  placeholder="+264 61 654321"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@business.na"
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.business.na"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street Address</label>
              <Input
                value={formData.streetAddress}
                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  className={errors.city ? 'border-red-300' : ''}
                />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Region *</label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md ${errors.region ? 'border-red-300' : ''}`}
                >
                  <option value="">Select Region</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your business, specialties, and services..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Commission Rate (%)</label>
              <Input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={formData.commissionRate}
                onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value) || 0)}
                className={errors.commissionRate ? 'border-red-300' : ''}
              />
              {errors.commissionRate && <p className="text-red-600 text-sm mt-1">{errors.commissionRate}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Commission charged on successful vehicle sales (default: 5%)
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Included Features</span>
              </div>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Unlimited vehicle listings</li>
                <li>• Lead management system</li>
                <li>• Performance analytics</li>
                <li>• Customer communication tools</li>
                <li>• Mobile app access</li>
                <li>• 24/7 support</li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Document Requirements</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Please upload clear, legible copies of all required documents. Supported formats: PDF, JPG, PNG
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Registration Certificate *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('businessRegistration', e.target.files?.[0] || null)}
                    className="hidden"
                    id="business-registration"
                  />
                  <label
                    htmlFor="business-registration"
                    className="cursor-pointer text-blue-600 hover:text-blue-500"
                  >
                    Click to upload
                  </label>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
                {formData.documents.businessRegistration && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.documents.businessRegistration.name}
                  </p>
                )}
              </div>
              {errors.businessRegistration && <p className="text-red-600 text-sm mt-1">{errors.businessRegistration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tax Clearance Certificate *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('taxClearance', e.target.files?.[0] || null)}
                    className="hidden"
                    id="tax-clearance"
                  />
                  <label
                    htmlFor="tax-clearance"
                    className="cursor-pointer text-blue-600 hover:text-blue-500"
                  >
                    Click to upload
                  </label>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
                {formData.documents.taxClearance && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.documents.taxClearance.name}
                  </p>
                )}
              </div>
              {errors.taxClearance && <p className="text-red-600 text-sm mt-1">{errors.taxClearance}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bank Statement (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('bankStatement', e.target.files?.[0] || null)}
                    className="hidden"
                    id="bank-statement"
                  />
                  <label
                    htmlFor="bank-statement"
                    className="cursor-pointer text-blue-600 hover:text-blue-500"
                  >
                    Click to upload
                  </label>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
                {formData.documents.bankStatement && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.documents.bankStatement.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Review Your Information</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Please review all information before submitting. You can go back to make changes if needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-sm">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <p className="text-sm">{formData.businessType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Registration:</span>
                    <p className="text-sm">{formData.registrationNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Commission Rate:</span>
                    <p className="text-sm">{formData.commissionRate}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Contact Person:</span>
                    <p className="text-sm">{formData.contactPerson}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-sm">{formData.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-sm">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <p className="text-sm">{formData.city}, {formData.region}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Business Registration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Tax Clearance</span>
                    </div>
                    {formData.documents.bankStatement && (
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Bank Statement</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">What happens next?</span>
              </div>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Your application will be reviewed within 2-3 business days</li>
                <li>• We'll verify your documents and business information</li>
                <li>• You'll receive an email notification once approved</li>
                <li>• Upon approval, you can start listing vehicles immediately</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Dealership</h2>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-px ml-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Creating...' : 'Create Dealership'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}