"use client";

import { motion } from "framer-motion";

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Child for StaggerContainer. Fades in and moves up.
 */
export function StaggerChild({ children, className }: Props) {
  return (
    <motion.div variants={childVariants} className={className}>
      {children}
    </motion.div>
  );
}
