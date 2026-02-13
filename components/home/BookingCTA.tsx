"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function BookingCTA() {
  return (
    <section className="border-t border-border py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden border border-border bg-card py-24 md:py-32 lg:py-40"
        >
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-bronze-subtle blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-bronze-subtle blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl px-8 text-center">
            <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground-muted">
              Concierge
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Book Your
              <br />
              <span className="text-accent">Consultation</span>
            </h2>
            <p className="mt-8 text-[17px] leading-relaxed text-foreground-muted">
              Our multi-step booking form helps us understand your vision. Share
              your ideas and we&apos;ll craft something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="mt-12 inline-flex items-center justify-center border border-accent bg-accent-muted px-12 py-4 text-[13px] font-medium tracking-[0.15em] uppercase text-accent transition-colors hover:bg-accent hover:text-ivory"
            >
              Start Your Journey
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
