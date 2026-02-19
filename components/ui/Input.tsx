"use client";

import { forwardRef } from "react";

const baseStyles =
  "w-full rounded-none border-2 border-border bg-card px-4 py-3 text-foreground placeholder:text-foreground-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
