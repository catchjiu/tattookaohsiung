"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PenLine } from "lucide-react";

export function BookingCTA() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-sm border border-border bg-card p-12 md:p-16 lg:p-24"
        >
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-accent-muted blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent-muted blur-3xl" />

          <div className="relative z-10 text-center">
            <PenLine
              className="mx-auto mb-6 text-accent"
              size={48}
              strokeWidth={1}
            />
            <p className="mb-2 tracking-label-wide text-accent">
              Ready to Create?
            </p>
            <h2 className="font-serif text-3xl font-medium text-foreground sm:text-4xl md:text-5xl">
              Book Your Consultation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
              Our multi-step booking form helps us understand your vision. Share
              your ideas and we&apos;ll craft something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center justify-center rounded-sm border border-accent bg-accent-muted px-10 py-4 font-medium text-accent transition-colors hover:bg-accent hover:text-ink"
            >
              Start Your Journey
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
