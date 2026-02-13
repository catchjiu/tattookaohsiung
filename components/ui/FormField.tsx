"use client";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Form field with label and optional error. Consistent spacing.
 */
export function FormField({
  label,
  required = false,
  error,
  children,
  className = "",
}: Props) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-sm font-medium text-foreground-muted">
        {label}
        {required && <span className="text-foreground-subtle"> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
