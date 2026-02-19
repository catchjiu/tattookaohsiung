"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/artists", labelKey: "nav.artists" },
  { href: "/gallery", labelKey: "nav.gallery" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/contact", labelKey: "nav.book" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-wide text-foreground transition-colors hover:text-accent"
        >
          Tattoo Kaohsiung
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-12">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageToggle />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <ul className="flex flex-col gap-1 px-8 py-6">
              <li className="mb-4 flex justify-end">
                <LanguageToggle />
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-sm font-medium tracking-wide text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
