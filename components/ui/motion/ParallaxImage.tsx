"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  speed?: number;
  containerClassName?: string;
};

/**
 * Parallax image — background moves slower than scroll for cinematic depth.
 */
export function ParallaxImage({
  src,
  alt,
  fill = true,
  className,
  speed = 0.3,
  containerClassName,
}: Props) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", `${speed * 100}%`, `${speed * 100}%`]);

  return (
    <div className={`relative overflow-hidden ${containerClassName ?? ""}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes="100vw"
          className={`object-cover ${className ?? ""}`}
          priority
        />
      </motion.div>
    </div>
  );
}
