"use client";

import { motion, useScroll, useTransform } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

/**
 * Parallax effect. Content moves slower than scroll for depth.
 */
export function ParallaxSection({
  children,
  className,
  speed = 0.5,
}: Props) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
