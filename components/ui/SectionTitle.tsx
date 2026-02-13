"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

const sizeStyles = {
  h1: "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight",
  h2: "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight",
  h3: "text-2xl md:text-3xl font-medium tracking-tight",
};

/**
 * Serif display heading. Flawless typography.
 */
export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
}: Props) {
  return (
    <Tag className={`font-serif text-foreground ${sizeStyles[Tag]} ${className}`}>
      {children}
    </Tag>
  );
}
