import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "bg-white border-neutral-200",
        success: "bg-success-light border-success text-success",
        error: "bg-error-light border-error text-error",
        warning: "bg-warning-light border-warning text-warning",
        info: "bg-info-light border-info text-info",
      },
      position: {
        topRight: "fixed top-4 right-4 md:max-w-[420px]",
        topCenter: "fixed top-4 left-1/2 -translate-x-1/2 md:max-w-[420px]",
        topLeft: "fixed top-4 left-4 md:max-w-[420px]",
        bottomRight: "fixed bottom-4 right-4 md:max-w-[420px]",
        bottomCenter: "fixed bottom-4 left-1/2 -translate-x-1/2 md:max-w-[420px]",
        bottomLeft: "fixed bottom-4 left-4 md:max-w-[420px]",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "topRight",
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
  open?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, position, title, description, action, onClose, duration = 5000, open = true, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(open);
    
    React.useEffect(() => {
      setIsVisible(open);
    }, [open]);
    
    React.useEffect(() => {
      if (!isVisible) return;
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }, [isVisible, duration, onClose]);
    
    if (!isVisible) return null;
    
    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={cn(toastVariants({ variant, position, className }))}
        data-state={isVisible ? "open" : "closed"}
        {...props}
      >
        <div className="grid gap-1 flex-1 min-w-0 pr-2">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90 break-words">{description}</div>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          {onClose && (
            <button
              type="button"
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400"
              aria-label="Close"
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
            </button>
          )}
        </div>
      </div>
    );
  }
);

Toast.displayName = "Toast";

// Toast Provider Component for managing multiple toasts
interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextType {
  showToast: (props: Omit<ToastProps, "open" | "position">) => string;
  hideToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = React.useState<
    Array<ToastProps & { id: string }>
  >([]);
  
  const showToast = React.useCallback(
    (props: Omit<ToastProps, "open" | "position">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...props, id, open: true }]);
      return id;
    },
    []
  );
  
  const hideToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-0 right-0 z-[9999] flex flex-col gap-2 w-full max-w-[420px] p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export { Toast };

/**
 * Example usage:
 * 
 * // Individual Toast
 * <Toast 
 *   title="Success!" 
 *   description="Your action was completed successfully."
 *   variant="success"
 *   position="topRight"
 *   onClose={() => console.log("Toast closed")}
 * />
 * 
 * // With Toast Provider (recommended)
 * // In your _app.tsx or layout.tsx:
 * <ToastProvider>
 *   <Component {...pageProps} />
 * </ToastProvider>
 * 
 * // Then in any component:
 * const { showToast, hideToast } = useToast();
 * 
 * // Show a toast
 * const handleClick = () => {
 *   const id = showToast({
 *     title: "Success!",
 *     description: "Your action was completed successfully.",
 *     variant: "success",
 *     duration: 5000, // 5 seconds
 *   });
 *   
 *   // You can manually hide it later
 *   // setTimeout(() => hideToast(id), 2000);
 * };
 * 
 * // Different variants
 * showToast({ title: "Error!", description: "Something went wrong.", variant: "error" });
 * showToast({ title: "Warning", description: "This action cannot be undone.", variant: "warning" });
 * showToast({ title: "Info", description: "Your session expires in 5 minutes.", variant: "info" });
 * 
 * // With action button
 * showToast({
 *   title: "New message",
 *   description: "You have a new message from John.",
 *   action: (
 *     <button 
 *       className="rounded bg-primary-500 px-2 py-1 text-xs text-white hover:bg-primary-600"
 *       onClick={() => console.log("Action clicked")}
 *     >
 *       View
 *     </button>
 *   )
 * });
 */
