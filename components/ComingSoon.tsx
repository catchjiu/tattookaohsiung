"use client";

import { motion } from "framer-motion";

export function ComingSoon() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,162,39,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,rgba(185,28,28,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_80%,rgba(201,162,39,0.06),transparent)]" />
      </div>

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating ink brush strokes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.svg
          className="absolute -left-20 top-1/4 h-96 w-96 opacity-20"
          viewBox="0 0 200 400"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <motion.path
            d="M50 50 Q100 100 80 200 T100 350"
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.8 }}
          />
        </motion.svg>
        <motion.svg
          className="absolute -right-20 top-1/3 h-80 w-80 opacity-15"
          viewBox="0 0 200 300"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.15 }}
          transition={{ duration: 2.2, delay: 1 }}
        >
          <motion.path
            d="M150 50 Q50 150 120 250"
            fill="none"
            stroke="var(--accent-crimson)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.8, delay: 1.2 }}
          />
        </motion.svg>
      </div>

      {/* Animated wave lines - Japanese inspired */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.06]">
        <svg className="h-full w-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <motion.path
            d="M0,100 Q150,60 300,100 T600,100 T900,100 T1200,100"
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M0,130 Q150,90 300,130 T600,130 T900,130 T1200,130"
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
          />
          <motion.path
            d="M0,160 Q150,120 300,160 T600,160 T900,160 T1200,160"
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.4, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
          />
        </svg>
      </div>

      {/* Pulsing orb */}
      <motion.div
        className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-gold)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ filter: "blur(80px)" }}
      />

      {/* Floating ink particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[var(--accent-gold)]"
          style={{
            left: `${15 + i * 7}%`,
            top: `${20 + (i % 5) * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Abstract ink splatter */}
      <div className="absolute right-[10%] top-[20%] opacity-10">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <motion.path
            d="M60 20 C80 20 100 40 95 60 C90 80 70 95 60 100 C50 95 30 80 25 60 C20 40 40 20 60 20 Z"
            fill="var(--accent-gold)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </svg>
      </div>
      <div className="absolute left-[15%] top-[25%] opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <motion.circle
            cx="40"
            cy="40"
            r="25"
            fill="var(--accent-crimson)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.12 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Japanese-inspired decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-4 font-serif text-sm uppercase tracking-[0.4em] text-[var(--accent-gold)]"
        >
          本格 — Authentic
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl font-medium leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block">Honkaku</span>
          <span className="mt-2 block text-[var(--accent-gold)]">Tattoo Studio</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12"
        >
          <span className="relative inline-block">
            <span className="font-serif text-2xl tracking-widest text-[var(--foreground)] sm:text-3xl">
              COMING SOON
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 h-0.5 bg-[var(--accent-gold)]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, delay: 1.2 }}
            />
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mx-auto mt-8 max-w-md text-base text-[var(--muted)] sm:text-lg"
        >
          Traditional Japanese artistry meets contemporary ink. Something extraordinary is in the making.
        </motion.p>

        {/* Decorative ink dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex gap-4"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-[var(--accent-gold)]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-16 left-1/2 h-px w-32 -translate-x-1/2 origin-center bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent"
        />
      </div>
    </section>
  );
}
