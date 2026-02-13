"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1568515041317-4c1a7c936ee0?w=1920&q=80";
const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAD8A0p//2Q==";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-hero-pan">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
            placeholder="blur"
            blurDataURL={HERO_BLUR}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/60 to-charcoal" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-8 pb-24 pt-32 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[11px] font-medium tracking-[0.25em] uppercase text-ivory/70"
          >
            Kaohsiung
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl font-medium leading-[1.08] tracking-tight text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Art on
            <br />
            <span className="text-bronze">Skin</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-md text-[17px] leading-relaxed text-ivory/80"
          >
            Where tradition meets contemporary design. Premium tattoo artistry by
            master artists.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 flex flex-col gap-4 sm:flex-row sm:gap-6"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-bronze bg-bronze/10 px-10 py-4 text-[13px] font-medium tracking-[0.15em] uppercase text-bronze transition-colors hover:bg-bronze hover:text-ivory"
            >
              Book a Session
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center border border-ivory/40 px-10 py-4 text-[13px] font-medium tracking-[0.15em] uppercase text-ivory/90 transition-colors hover:border-ivory hover:text-ivory"
            >
              View Gallery
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 h-px w-8 -translate-x-1/2 bg-ivory/30"
      />
    </section>
  );
}
