'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Send, AlertCircle, CheckCircle, XCircle, Bell } from 'lucide-react';
import { DealershipData } from './DealershipList';

interface NotificationDialogProps {
  dealership: DealershipData;
  isOpen: boolean;
  onClose: () => void;
}

type NotificationType = 'approved' | 'rejected' | 'suspended' | 'custom';

export function NotificationDialog({ dealership, isOpen, onClose }: NotificationDialogProps) {
  const [notificationType, setNotificationType] = useState<NotificationType>('custom');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const notificationTemplates = {
    approved: {
      subject: 'Congratulations! Your dealership has been approved',
      message: `Dear ${dealership.contactPerson},\n\nWe are pleased to inform you that your dealership "${dealership.name}" has been approved and is now active on Cars.na.\n\nYou can now start listing your vehicles and reaching potential customers across Namibia.\n\nBest regards,\nCars.na Team`
    },
    rejected: {
      subject: 'Dealership Application Update',
      message: `Dear ${dealership.contactPerson},\n\nWe regret to inform you that your dealership application for "${dealership.name}" has not been approved at this time.\n\nIf you have questions or would like to reapply, please contact our support team.\n\nBest regards,\nCars.na Team`
    },
    suspended: {
      subject: 'Important: Your dealership account has been suspended',
      message: `Dear ${dealership.contactPerson},\n\nYour dealership "${dealership.name}" has been temporarily suspended due to policy violations.\n\nPlease contact our support team immediately to resolve this issue.\n\nBest regards,\nCars.na Team`
    },
    custom: {
      subject: '',
      message: ''
    }
  };

  const handleNotificationTypeChange = (type: NotificationType) => {
    setNotificationType(type);
    const template = notificationTemplates[type];
    setSubject(template.subject);
    setMessage(template.message);
    setError(null);
  };

  const handleSendNotification = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Please provide both subject and message');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: `dealership_${notificationType}`,
          dealershipData: {
            name: dealership.name,
            contactPerson: dealership.contactPerson,
            email: dealership.email || '',
            city: dealership.city,
            subject: subject,
            message: message,
          },
          adminName: 'Admin User', // This should come from the session
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          // Reset form
          setNotificationType('custom');
          setSubject('');
          setMessage('');
        }, 2000);
      } else {
        setError(data.error || 'Failed to send notification');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Notification error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'suspended':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Notification to {dealership.name}</DialogTitle>
          <DialogDescription>
            Send an email notification to {dealership.contactPerson} ({dealership.email || 'No email provided'})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Notification Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Notification Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['approved', 'rejected', 'suspended', 'custom'] as NotificationType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleNotificationTypeChange(type)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    notificationType === type
                      ? getTypeColor(type) + ' border-current'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getTypeIcon(type)}
                  <span className="font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter notification subject"
              disabled={isSending}
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              disabled={isSending}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Preview Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Preview:</span>
            <Badge className={getTypeColor(notificationType)}>
              {getTypeIcon(notificationType)}
              <span className="ml-1 capitalize">{notificationType} Notification</span>
            </Badge>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Notification sent successfully!</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSendNotification} disabled={isSending || !subject || !message}>
            {isSending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
