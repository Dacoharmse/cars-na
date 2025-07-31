import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700",
        outline: "border border-neutral-300 bg-transparent hover:bg-neutral-100 text-neutral-800",
        ghost: "bg-transparent hover:bg-neutral-100 text-neutral-800",
        link: "bg-transparent underline-offset-4 hover:underline text-primary-500 hover:text-primary-600",
        destructive: "bg-error hover:bg-error/90 text-white",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

/**
 * Example usage:
 * 
 * <Button>Default Button</Button>
 * <Button variant="secondary">Secondary Button</Button>
 * <Button variant="outline">Outline Button</Button>
 * <Button variant="ghost">Ghost Button</Button>
 * <Button variant="link">Link Button</Button>
 * <Button variant="destructive">Destructive Button</Button>
 * <Button size="sm">Small Button</Button>
 * <Button size="lg">Large Button</Button>
 * <Button fullWidth>Full Width Button</Button>
 * <Button disabled>Disabled Button</Button>
 * <Button size="icon"><SomeIcon /></Button>
 */
