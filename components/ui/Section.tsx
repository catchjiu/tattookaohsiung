"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
  as?: "section" | "div";
};

const sizeStyles = {
  default: "py-16 md:py-20 lg:py-24",
  narrow: "py-12 md:py-16 lg:py-20",
  wide: "py-20 md:py-24 lg:py-32",
};

/**
 * Consistent section spacing. Negative space breathes.
 */
export function Section({
  children,
  className = "",
  size = "default",
  as: Component = "section",
}: Props) {
  return (
    <Component className={`${sizeStyles[size]} ${className}`}>
      {children}
    </Component>
  );
}
