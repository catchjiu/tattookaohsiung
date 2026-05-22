"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, PenLine } from "lucide-react";
import { submitPermanentMakeupBooking } from "@/app/contact/actions";
import { Input, Textarea, Select, FormField, Button } from "@/components/ui";
import { useLanguage } from "@/components/providers/LanguageProvider";

const SERVICES = ["Permanent Makeup", "SMP"] as const;

type Props = {
  artists: { id: string; name: string }[];
  onSuccess?: () => void;
};

export function PermanentMakeupBookingForm({ artists, onSuccess }: Props) {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<(typeof SERVICES)[number]>("Permanent Makeup");

  const formId = "pmu-booking-form";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();

    if (!name) {
      setError(t("booking.errors.nameRequired"));
      return;
    }
    if (!email) {
      setError(t("booking.errors.emailRequired"));
      return;
    }
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    if (!emailInput.checkValidity()) {
      setError(t("booking.errors.emailInvalid"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(form);
      formData.set("service", service);
      const result = await submitPermanentMakeupBooking(formData);
      if (!result || result.error) {
        setError(result?.error ?? t("booking.errors.submitFailed"));
        return;
      }
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      console.error("[PermanentMakeupBookingForm] Submit failed:", err);
      setError(
        err instanceof Error ? err.message : t("booking.errors.submitFailed")
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        className="rounded-sm border border-accent bg-accent-muted p-10 text-center"
      >
        <Check className="mx-auto mb-4 text-accent" size={40} strokeWidth={1.5} />
        <h2 className="font-serif text-xl font-medium text-foreground">
          {t("pmuBooking.thankYou")}
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">{t("pmuBooking.received")}</p>
      </motion.div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div className="rounded-sm border border-[var(--accent-crimson)] bg-[var(--accent-crimson-muted)] px-4 py-2 text-sm text-[var(--accent-crimson)]">
          {error}
        </div>
      )}

      <div>
        <h3 className="font-serif text-lg font-medium text-accent">
          {t("pmuBooking.title")}
        </h3>
        <p className="mt-1 text-sm text-foreground-muted">{t("pmuBooking.subtitle")}</p>
      </div>

      <FormField label={t("pmuBooking.service")} required>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setService(s)}
              className={`border-2 px-4 py-3 text-left text-sm transition-colors ${
                service === s
                  ? "border-accent bg-accent-muted text-accent"
                  : "border-border bg-card text-foreground-muted hover:border-foreground-muted"
              }`}
            >
              {t(`pmuBooking.services.${s}`)}
            </button>
          ))}
        </div>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={t("booking.name")} required>
          <Input name="name" autoComplete="name" />
        </FormField>
        <FormField label={t("booking.email")} required>
          <Input name="email" type="email" autoComplete="email" />
        </FormField>
      </div>

      <FormField label={t("booking.phone")}>
        <Input name="phone" type="tel" autoComplete="tel" />
      </FormField>

      <FormField label={t("pmuBooking.additionalInfo")}>
        <Textarea
          name="additional_info"
          rows={4}
          placeholder={t("pmuBooking.additionalInfoPlaceholder")}
        />
      </FormField>

      <FormField label={t("booking.preferredArtist")}>
        <Select name="preferred_artist_id">
          <option value="">{t("booking.noPreference")}</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={t("booking.whenBook")}>
        <Input name="preferred_date" placeholder={t("booking.whenPlaceholder")} />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={loading}
        className="w-full"
        rightIcon={<PenLine size={20} strokeWidth={1.5} />}
      >
        {t("pmuBooking.submit")}
      </Button>
    </form>
  );
}
