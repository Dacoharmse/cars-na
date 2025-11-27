'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: NotificationVariant;
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-success-600',
    bgColor: 'bg-success-50',
    borderColor: 'border-success-200',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-destructive-600',
    bgColor: 'bg-destructive-50',
    borderColor: 'border-destructive-200',
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-warning-600',
    bgColor: 'bg-warning-50',
    borderColor: 'border-warning-200',
  },
  info: {
    icon: Info,
    iconColor: 'text-info-600',
    bgColor: 'bg-info-50',
    borderColor: 'border-info-200',
  },
};

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  isOpen,
  onClose,
  variant = 'info',
  title,
  message,
  primaryAction,
  secondaryAction,
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border-2',
                config.bgColor,
                config.borderColor
              )}
            >
              <Icon className={cn('h-6 w-6', config.iconColor)} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left text-lg font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-left text-sm text-gray-600">
                {message}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={() => {
                secondaryAction.onClick();
                onClose();
              }}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction ? (
            <Button
              onClick={() => {
                primaryAction.onClick();
                onClose();
              }}
            >
              {primaryAction.label}
            </Button>
          ) : (
            <Button onClick={onClose}>OK</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
