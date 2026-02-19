"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

function LineIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0"
      aria-hidden
    >
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

const footerLinks = [
  { href: "/artists", labelKey: "nav.artists" },
  { href: "/gallery", labelKey: "nav.gallery" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/contact", labelKey: "footer.bookSession" },
];

export function Footer() {
  const { t, locale } = useLanguage();

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
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-foreground-muted">
              {t("footer.specialty")}
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
              <a
                href="https://line.me/R/ti/p/yvonnetrzen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-[15px] text-foreground-muted transition-colors hover:text-foreground"
                aria-label="Message us on Line"
              >
                <LineIcon size={18} />
                yvonnetrzen
              </a>
              <a
                href={`tel:${locale === "zh-TW" ? "+886980495145" : "+886967071750"}`}
                className="inline-flex items-center gap-3 text-[15px] text-foreground-muted transition-colors hover:text-foreground"
              >
                <Phone size={18} strokeWidth={1.5} />
                {locale === "zh-TW" ? t("footer.phoneZh") : t("footer.phoneEn")}
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-3 text-[15px] text-foreground-muted transition-colors hover:text-foreground"
                aria-label="View on Google Maps"
              >
                <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <span>
                  {locale === "zh-TW" ? t("footer.addressZh") : t("footer.addressEn")}
                </span>
              </a>
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
