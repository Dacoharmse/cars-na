import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-md",
        bordered: "border-2",
        flat: "shadow-none",
      },
      padding: {
        default: "",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6", {
  variants: {
    padding: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
      none: "p-0",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardHeaderVariants({ padding, className }))}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

const cardTitleVariants = cva("text-2xl font-semibold leading-none tracking-tight", {
  variants: {
    variant: {
      default: "text-neutral-900",
      muted: "text-neutral-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(cardTitleVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const cardContentVariants = cva("", {
  variants: {
    padding: {
      default: "p-6 pt-0",
      sm: "p-4 pt-0",
      lg: "p-8 pt-0",
      none: "p-0",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardContentVariants({ padding, className }))}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

const cardFooterVariants = cva("flex items-center", {
  variants: {
    padding: {
      default: "p-6 pt-0",
      sm: "p-4 pt-0",
      lg: "p-8 pt-0",
      none: "p-0",
    },
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
  },
  defaultVariants: {
    padding: "default",
    align: "start",
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, align, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardFooterVariants({ padding, align, className }))}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

/**
 * Example usage:
 * 
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card Content</p>
 *   </CardContent>
 *   <CardFooter align="end">
 *     <Button variant="outline">Cancel</Button>
 *     <Button>Submit</Button>
 *   </CardFooter>
 * </Card>
 * 
 * <Card variant="elevated">
 *   <CardHeader>
 *     <CardTitle variant="muted">Elevated Card</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>This card has elevated shadow</p>
 *   </CardContent>
 * </Card>
 * 
 * <Card variant="bordered">
 *   <CardHeader padding="sm">
 *     <CardTitle>Bordered Card with Small Padding</CardTitle>
 *   </CardHeader>
 *   <CardContent padding="sm">
 *     <p>This card has a thicker border and smaller padding</p>
 *   </CardContent>
 * </Card>
 * 
 * <Card variant="flat" padding="none">
 *   <img src="/some-image.jpg" alt="Card image" className="w-full h-48 object-cover" />
 *   <CardHeader>
 *     <CardTitle>Image Card</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>This card has no padding at the top level to allow for full-width images</p>
 *   </CardContent>
 * </Card>
 */
