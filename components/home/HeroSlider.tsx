"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAD8A0p//2Q==";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1568515041317-4c1a7c936ee0?w=1920&q=80";

type Props = {
  imageUrls: string[];
  /** Interval in ms between slides */
  intervalMs?: number;
};

export function HeroSlider({ imageUrls, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);
  const images = imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
            placeholder="blur"
            blurDataURL={HERO_BLUR}
          />
        </motion.div>
      </AnimatePresence>
      {/* Dark gradient overlay ~60% opacity for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.75), rgba(10,10,10,0.6), rgba(10,10,10,1))",
        }}
      />
    </div>
  );
}
