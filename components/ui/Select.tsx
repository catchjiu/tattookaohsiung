"use client";

import { forwardRef } from "react";

const baseStyles =
  "w-full rounded-none border-2 border-border bg-card px-4 py-3 text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
