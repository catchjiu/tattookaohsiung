"use client";

import { Section, SectionLabel, SectionTitle } from "@/components/ui";
import { BookingForm } from "@/components/booking/BookingForm";
import { ContactPageClient } from "./ContactPageClient";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Props = {
  artists: { id: string; name: string }[];
};

export function ContactContent({ artists }: Props) {
  const { t, locale } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-8">
      <Section size="narrow">
        <ContactPageClient>
          <SectionLabel>{t("contact.label")}</SectionLabel>
          <SectionTitle as="h1" className="mt-3">
            {t("contact.title")}
          </SectionTitle>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            {t("contact.description")}
          </p>
        </ContactPageClient>
      </Section>

      <Section>
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border-2 border-border bg-card p-10 md:p-12 rounded-none">
              <BookingForm artists={artists} />
            </div>
          </div>
          <div className="space-y-8">
            <div className="border-t border-border pt-8">
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                {t("contact.whatToExpect")}
              </h3>
              <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-foreground-muted">
                <li>{t("contact.expect1")}</li>
                <li>{t("contact.expect2")}</li>
                <li>{t("contact.expect3")}</li>
                <li>{t("contact.expect4")}</li>
              </ul>
            </div>
            <div className="border-t border-border pt-8">
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                {t("contact.contactTitle")}
              </h3>
              <p className="mt-6 text-[15px] text-foreground-muted">
                {t("contact.contactDm")}{" "}
                <a
                  href="https://instagram.com/tattookaohsiung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  @tattookaohsiung
                </a>
              </p>
            </div>
            <div className="border-t border-border pt-8">
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                {locale === "zh-TW" ? "地點" : "Location"}
              </h3>
              <div className="mt-6 overflow-hidden rounded-none border-2 border-border bg-card">
                <div className="relative aspect-[4/3] w-full">
                  <iframe
                    title="Casper Tattoo Kaohsiung map"
                    src="https://www.google.com/maps?q=18%20Shijian%20Rd,%20Zuoying%20District,%20Kaohsiung%20City,%20813,%20Taiwan&output=embed"
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-4 text-sm text-foreground-muted">
                  <span>No. 18, Shijian Rd, Zuoying District</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
