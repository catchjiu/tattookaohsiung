"use client";

import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variantStyles: Record<Variant, string> = {
  primary:
    "border border-accent bg-accent-muted text-accent transition-colors hover:bg-accent hover:text-ivory active:scale-[0.99]",
  secondary:
    "border border-border bg-transparent text-foreground transition-colors hover:border-accent hover:text-accent active:scale-[0.99]",
  ghost:
    "border border-transparent text-foreground-muted transition-colors hover:text-foreground active:scale-[0.99]",
  outline:
    "border border-border bg-card text-foreground transition-colors hover:border-accent hover:bg-card-hover active:scale-[0.99]",
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = "secondary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      children,
      disabled,
      type,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none rounded-sm hover:scale-[1.01]";
    const combined = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={combined}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
