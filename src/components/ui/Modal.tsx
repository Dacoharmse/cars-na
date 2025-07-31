import React, { Fragment } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from './Button';

const modalOverlayVariants = cva(
  'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity',
  {
    variants: {
      state: {
        open: 'opacity-100',
        closed: 'opacity-0',
      },
    },
    defaultVariants: {
      state: 'closed',
    },
  }
);

const modalVariants = cva(
  'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all',
  {
    variants: {
      state: {
        open: 'opacity-100 scale-100',
        closed: 'opacity-0 scale-95',
      },
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)]',
      },
    },
    defaultVariants: {
      state: 'closed',
      size: 'default',
    },
  }
);

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, description, children, closeOnOverlayClick = true, closeOnEsc = true, size, ...props }, ref) => {
    // Handle ESC key press
    React.useEffect(() => {
      if (!isOpen || !closeOnEsc) return;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, closeOnEsc]);
    
    // Prevent body scroll when modal is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
      <Fragment>
        <div
          className={cn(modalOverlayVariants({ state: isOpen ? 'open' : 'closed' }))}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />
        
        <div
          ref={ref}
          className={cn(modalVariants({ state: isOpen ? 'open' : 'closed', size, className }))}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          {...props}
        >
          {children}
        </div>
      </Fragment>
    );
  }
);

Modal.displayName = 'Modal';

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
ModalHeader.displayName = 'ModalHeader';

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    id="modal-title"
    className={cn('text-lg font-semibold text-neutral-900', className)}
    {...props}
  />
));
ModalTitle.displayName = 'ModalTitle';

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    id="modal-description"
    className={cn('text-sm text-neutral-500', className)}
    {...props}
  />
));
ModalDescription.displayName = 'ModalDescription';

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
));
ModalContent.displayName = 'ModalContent';

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0', className)}
    {...props}
  />
));
ModalFooter.displayName = 'ModalFooter';

interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
}

const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn('absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100', className)}
      onClick={onClose}
      aria-label="Close"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </Button>
  )
);
ModalClose.displayName = 'ModalClose';

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter, ModalClose };
