'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { X, Phone, Mail, MapPin, Send } from 'lucide-react';

interface DealerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealership: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
}

export const DealerContactModal: React.FC<DealerContactModalProps> = ({
  isOpen,
  onClose,
  dealership
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interestedIn: 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after delay
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        interestedIn: 'General Inquiry'
      });
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Contact {dealership.name}</h2>
              <p className="text-blue-100 mt-1">Get in touch with our premium dealership</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for your inquiry. {dealership.name} will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+264 XX XXX XXXX"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="interestedIn" className="block text-sm font-medium text-gray-700 mb-1">
                      I'm interested in
                    </label>
                    <select
                      id="interestedIn"
                      name="interestedIn"
                      value={formData.interestedIn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3469] focus:border-transparent"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Vehicle Purchase">Vehicle Purchase</option>
                      <option value="Trade-In">Trade-In</option>
                      <option value="Financing">Financing Options</option>
                      <option value="Service">Service & Maintenance</option>
                      <option value="Parts">Parts & Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3469] focus:border-transparent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#1F3469] to-[#3B4F86] hover:from-[#3B4F86] hover:to-[#1F3469] text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </div>

              {/* Dealership Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Visit our showroom</h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">{dealership.name}</h4>
                    <p className="text-gray-600 mb-4">Premium automotive dealer serving Windhoek and surrounding areas since 1995</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-[#1F3469] mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Address</p>
                        <p className="text-gray-600">{dealership.address}</p>
                        <p className="text-gray-600">{dealership.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-[#1F3469] mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Phone</p>
                        <p className="text-gray-600">{dealership.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-[#1F3469] mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Email</p>
                        <p className="text-gray-600">{dealership.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h5 className="font-semibold text-gray-900 mb-2">Business Hours</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 8:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${dealership.phone}`, '_self')}
                    className="flex-1 border-[#1F3469] text-[#1F3469] hover:bg-[#1F3469] hover:text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${dealership.email}`, '_self')}
                    className="flex-1 border-[#1F3469] text-[#1F3469] hover:bg-[#1F3469] hover:text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};