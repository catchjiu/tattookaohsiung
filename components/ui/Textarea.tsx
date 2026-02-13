"use client";

import { forwardRef } from "react";

const baseStyles =
  "w-full rounded-sm border border-border bg-card px-4 py-3 text-foreground placeholder:text-foreground-subtle transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20 resize-y min-h-[120px]";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
