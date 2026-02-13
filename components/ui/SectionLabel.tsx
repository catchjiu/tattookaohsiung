"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Uppercase subheading with refined tracking. Architectural magazine feel.
 */
export function SectionLabel({ children, className = "" }: Props) {
  return (
    <p
      className={`font-sans text-xs font-medium tracking-widest text-foreground-muted ${className}`}
    >
      {children}
    </p>
  );
}
