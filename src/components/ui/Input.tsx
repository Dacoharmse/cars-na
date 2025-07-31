import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-error focus:ring-error",
        success: "border-success focus:ring-success",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: true,
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, fullWidth, label, helperText, error, ...props }, ref) => {
    // If there's an error, force the variant to error
    const inputVariant = error ? "error" : variant;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          className={cn(inputVariants({ variant: inputVariant, size, fullWidth, className }))}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error 
              ? `${props.id}-error` 
              : helperText 
                ? `${props.id}-description` 
                : undefined
          }
          {...props}
        />
        {helperText && !error && (
          <p 
            id={`${props.id}-description`} 
            className="text-xs text-neutral-500"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p 
            id={`${props.id}-error`} 
            className="text-xs text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Select component that shares styling with Input
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    Omit<VariantProps<typeof inputVariants>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: "default" | "sm" | "lg";
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, fullWidth, label, helperText, error, options, size, ...props }, ref) => {
    // If there's an error, force the variant to error
    const selectVariant = error ? "error" : variant;
    
    // Map size to height
    const heightClass = size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10";
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <select
          className={cn(
            inputVariants({ variant: selectVariant, fullWidth, className }),
            heightClass,
            "appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error 
              ? `${props.id}-error` 
              : helperText 
                ? `${props.id}-description` 
                : undefined
          }
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <p 
            id={`${props.id}-description`} 
            className="text-xs text-neutral-500"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p 
            id={`${props.id}-error`} 
            className="text-xs text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// Textarea component that shares styling with Input
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    Omit<VariantProps<typeof inputVariants>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, fullWidth, label, helperText, error, ...props }, ref) => {
    // If there's an error, force the variant to error
    const textareaVariant = error ? "error" : variant;
    
    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <textarea
          className={cn(
            inputVariants({ variant: textareaVariant, fullWidth, className }),
            "min-h-[80px] resize-vertical"
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            error 
              ? `${props.id}-error` 
              : helperText 
                ? `${props.id}-description` 
                : undefined
          }
          {...props}
        />
        {helperText && !error && (
          <p 
            id={`${props.id}-description`} 
            className="text-xs text-neutral-500"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p 
            id={`${props.id}-error`} 
            className="text-xs text-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Select, Textarea, inputVariants };

/**
 * Example usage:
 * 
 * <Input id="email" label="Email" placeholder="Enter your email" />
 * <Input id="email" label="Email" helperText="We'll never share your email" />
 * <Input id="email" label="Email" error="Email is required" />
 * <Input size="sm" placeholder="Small input" />
 * <Input size="lg" placeholder="Large input" />
 * 
 * <Select 
 *   id="country" 
 *   label="Country" 
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "ca", label: "Canada" },
 *     { value: "mx", label: "Mexico" }
 *   ]} 
 * />
 * 
 * <Textarea id="message" label="Message" placeholder="Enter your message" />
 */
