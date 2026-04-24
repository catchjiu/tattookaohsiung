"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, MapPin, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";

const BASE_NAV = [
  { path: "/", labelKey: "nav.home", dropdown: false },
  { path: "/artists", labelKey: "nav.artists", dropdown: false },
  { path: "/gallery", labelKey: "nav.gallery", dropdown: false },
  { path: "/blog", labelKey: "nav.blog", dropdown: false },
  { path: "/contact", labelKey: "nav.contact", dropdown: true },
] as const;

const LINE_URL =
  process.env.NEXT_PUBLIC_LINE_ADD_URL ?? "https://line.me/ti/p/1b_FFfIqvY";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { t, locale } = useLanguage();

  const phone = locale === "zh-TW" ? t("footer.phoneZh") : t("footer.phoneEn");
  const phoneHref = `tel:+886${locale === "zh-TW" ? "980495145" : "967071750"}`;
  const address = locale === "zh-TW" ? t("footer.addressZh") : t("footer.addressEn");

  // Prefix all internal paths with /zh-TW when in Chinese mode
  const p = locale === "zh-TW" ? "/zh-TW" : "";
  const navLinks = BASE_NAV.map((l) => ({
    ...l,
    href: l.path === "/" ? (p || "/") : `${p}${l.path}`,
  }));

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
        <Link
          href={p || "/"}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Casper Tattoo Kaohsiung logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
            priority
          />
          <span className="font-display text-xl font-semibold tracking-wide text-foreground">
            Casper Tattoo Kaohsiung
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-12">
            {navLinks.map((link) =>
              link.dropdown ? (
                // Contact item — hover reveals info panel
                <li
                  key={link.labelKey}
                  className="relative"
                  onMouseEnter={() => setContactOpen(true)}
                  onMouseLeave={() => setContactOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </Link>

                  <AnimatePresence>
                    {contactOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-full mt-4 w-80 rounded-xl border border-border bg-card p-6 shadow-2xl shadow-black/40"
                      >
                        <p className="mb-5 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                          {t("footer.connect")}
                        </p>

                        <div className="space-y-4 text-[14px] text-foreground-muted">
                          <a
                            href="https://instagram.com/tattookaohsiung"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 transition-colors hover:text-foreground"
                          >
                            <Instagram size={16} strokeWidth={1.5} />
                            @tattookaohsiung
                          </a>

                          <a
                            href={LINE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 transition-colors hover:text-foreground"
                            aria-label="Message us on Line"
                          >
                            <MessageCircle size={16} strokeWidth={1.5} />
                            Line
                          </a>

                          <a
                            href={phoneHref}
                            className="flex items-center gap-3 transition-colors hover:text-foreground"
                          >
                            <Phone size={16} strokeWidth={1.5} />
                            {phone}
                          </a>

                          <address className="not-italic">
                            <a
                              href="https://www.google.com/maps/search/?api=1&query=18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-3 transition-colors hover:text-foreground"
                              aria-label="View on Google Maps"
                            >
                              <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                              {address}
                            </a>
                          </address>
                        </div>

                        <Link
                          href={`${p}/contact`}
                          className="mt-6 block border-t border-border pt-5 text-[13px] font-medium tracking-[0.1em] uppercase text-foreground transition-colors hover:text-accent"
                        >
                          {t("contact.title")} →
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                // Regular nav link
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              )
            )}
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
            <div className="px-8 py-6">
              <div className="mb-6 flex justify-end">
                <LanguageToggle />
              </div>

              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.labelKey}>
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

              {/* Contact info section */}
              <div className="mt-6 border-t border-border pt-6">
                <p className="mb-4 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                  {t("footer.connect")}
                </p>

                <div className="flex flex-col gap-4 text-[14px] text-foreground-muted">
                  <a
                    href="https://instagram.com/tattookaohsiung"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 transition-colors hover:text-foreground"
                  >
                    <Instagram size={16} strokeWidth={1.5} />
                    @tattookaohsiung
                  </a>

                  <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 transition-colors hover:text-foreground"
                    aria-label="Message us on Line"
                  >
                    <MessageCircle size={16} strokeWidth={1.5} />
                    Line
                  </a>

                  <a
                    href={phoneHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 transition-colors hover:text-foreground"
                  >
                    <Phone size={16} strokeWidth={1.5} />
                    {phone}
                  </a>

                  <address className="not-italic">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-start gap-3 transition-colors hover:text-foreground"
                      aria-label="View on Google Maps"
                    >
                      <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                      {address}
                    </a>
                  </address>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
