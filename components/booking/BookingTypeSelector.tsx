"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export type BookingType = "tattoo" | "permanent-makeup";

type Props = {
  value: BookingType;
  onChange: (type: BookingType) => void;
};

export function BookingTypeSelector({ value, onChange }: Props) {
  const { t } = useLanguage();

  const options: { id: BookingType; labelKey: string }[] = [
    { id: "tattoo", labelKey: "bookingType.tattoo" },
    { id: "permanent-makeup", labelKey: "bookingType.permanentMakeup" },
  ];

  return (
    <div className="mb-8">
      <p className="mb-3 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        {t("bookingType.label")}
      </p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`border-2 px-6 py-3 text-[13px] font-medium tracking-[0.1em] uppercase transition-colors ${
              value === option.id
                ? "border-accent bg-accent-muted text-accent"
                : "border-border bg-card text-foreground-muted hover:border-foreground-muted hover:text-foreground"
            }`}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
