"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

/**
 * Elevated card with subtle border. Hover state optional.
 */
export function Card({
  children,
  className = "",
  hover = false,
}: Props) {
  const base =
    "overflow-hidden rounded-sm border border-border bg-card transition-colors";
  const hoverClass = hover ? "hover:border-accent/50 hover:bg-card-hover" : "";
  const combined = `${base} ${hoverClass} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={combined}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={combined}>{children}</div>;
}
