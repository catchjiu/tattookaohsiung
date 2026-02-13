"use client";

import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Page-level transition wrapper. Use with Layout or page wrappers.
 */
export function PageTransition({ children, className }: Props) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
