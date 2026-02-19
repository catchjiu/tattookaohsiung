"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, MapPin } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const footerLinks = [
  { href: "/artists", labelKey: "nav.artists" },
  { href: "/gallery", labelKey: "nav.gallery" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/contact", labelKey: "footer.bookSession" },
];

export function Footer() {
  const { t } = useLanguage();

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
              className="font-display text-2xl font-semibold tracking-wide text-foreground"
            >
              Tattoo Kaohsiung
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-foreground-muted">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              {t("footer.connect")}
            </h4>
            <div className="space-y-4">
              <a
                href="https://instagram.com/tattookaohsiung"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-[15px] text-foreground-muted transition-colors hover:text-foreground"
              >
                <Instagram size={18} strokeWidth={1.5} />
                @tattookaohsiung
              </a>
              <div className="flex items-start gap-3 text-[15px] text-foreground-muted">
                <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <span className="flex flex-col gap-0.5">
                  <span>{t("footer.addressEn")}</span>
                  <span>{t("footer.addressZh")}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8 text-center text-[12px] tracking-wide text-foreground-subtle">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </motion.footer>
  );
}
