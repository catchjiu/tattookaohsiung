"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  y?: number;
};

/**
 * Scroll-triggered fade-in with upward motion. Feels like magic.
 */
export function FadeInUp({
  children,
  className,
  delay = 0,
  duration = 0.8,
  once = true,
  amount = 0.15,
  y = 24,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
