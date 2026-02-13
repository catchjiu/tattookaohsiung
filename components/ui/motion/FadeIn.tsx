"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

/**
 * Scroll-triggered fade-in. Cinematic, buttery entrance.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
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
