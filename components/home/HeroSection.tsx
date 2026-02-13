"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1568515041317-4c1a7c936ee0?w=1920&q=80";
const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAD8A0p//2Q==";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* Full-bleed monochromatic background — slow-moving parallax feel */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-hero-pan">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-30 grayscale"
            priority
            placeholder="blur"
            blurDataURL={HERO_BLUR}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/90 to-ink" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-4 tracking-label-wide text-accent"
        >
          Kaohsiung&apos;s Finest
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          className="font-serif text-5xl font-medium leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Art on
          <br />
          <span className="text-accent">Skin</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto mt-8 max-w-xl text-base text-foreground-muted sm:text-lg"
        >
          Where tradition meets contemporary design. Premium tattoo artistry by
          master artists in the heart of Kaohsiung.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-sm border border-accent bg-accent-muted px-8 py-4 font-medium tracking-wide text-accent transition-colors hover:bg-accent hover:text-ink"
          >
            Book a Session
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-4 font-medium tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            View Gallery
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown
            className="h-8 w-8 animate-bounce text-foreground-muted"
            strokeWidth={1.5}
          />
        </motion.div>
      </div>
    </section>
  );
}
