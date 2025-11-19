import * as React from "react";
import { cn } from "./utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

const getBadgeClasses = (variant: BadgeVariant = "default") => {
  const baseClasses = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden";
  
  const variantClasses: Record<BadgeVariant, string> = {
    default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
    secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
    destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
    outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  };
  
  return `${baseClasses} ${variantClasses[variant]}`;
};

function Badge({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  if (asChild && children) {
    const child = React.Children.only(children as React.ReactElement);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.cloneElement(child, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(child.props as any),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      className: cn(getBadgeClasses(variant), className, (child.props as any).className),
    });
  }

  return (
    <span
      data-slot="badge"
      className={cn(getBadgeClasses(variant), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
