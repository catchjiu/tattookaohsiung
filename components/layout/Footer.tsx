"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const footerLinks = [
  { href: "/artists", label: "Artists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Book a Session" },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border bg-card"
    >
      <div className="mx-auto max-w-6xl px-8 py-24">
        <div className="grid gap-16 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-medium tracking-[0.02em] text-foreground"
            >
              Honkaku
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-foreground-muted">
              Authentic traditional Japanese artistry meets contemporary ink.
              Kaohsiung.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              Explore
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              Connect
            </h4>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[15px] text-foreground-muted transition-colors hover:text-foreground"
            >
              <Instagram size={18} strokeWidth={1.5} />
              @honkakutattoo
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8 text-center text-[12px] tracking-wide text-foreground-subtle">
          © {new Date().getFullYear()} Honkaku Tattoo Studio
        </div>
      </div>
    </motion.footer>
  );
}
