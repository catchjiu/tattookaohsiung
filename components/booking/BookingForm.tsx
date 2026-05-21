"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Check, PenLine } from "lucide-react";
import { submitBooking } from "@/app/contact/actions";
import { BookingReferenceUpload } from "./BookingReferenceUpload";
import { BodyMapSelector } from "./BodyMapSelector";
import { Input, Textarea, Select, FormField, Button } from "@/components/ui";
import { useLanguage } from "@/components/providers/LanguageProvider";

const STEPS = [
  { id: 1, titleKey: "booking.step1", key: "details" },
  { id: 2, titleKey: "booking.step2", key: "vision" },
  { id: 3, titleKey: "booking.step3", key: "preferences" },
  { id: 4, titleKey: "booking.step4", key: "confirm" },
];

const STYLES = ["Traditional", "Fine-line", "Realism", "Blackwork", "Japanese", "Neo-traditional", "Other"];
const SIZES = ["Small (under 1 hour)", "Medium (1–3 hours)", "Large (half day)", "Full sleeve / day"];

type Props = {
  artists: { id: string; name: string }[];
};

export function BookingForm({ artists }: Props) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [placementRegions, setPlacementRegions] = useState<string[]>([]);

  const formId = "booking-form";

  function validateStep(targetStep: number): boolean {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return false;

    if (targetStep >= 1) {
      const name = form.elements.namedItem("name") as HTMLInputElement | null;
      const email = form.elements.namedItem("email") as HTMLInputElement | null;
      if (!name?.value.trim()) {
        setError(t("booking.errors.nameRequired"));
        setStep(1);
        name?.focus();
        return false;
      }
      if (!email?.value.trim()) {
        setError(t("booking.errors.emailRequired"));
        setStep(1);
        email?.focus();
        return false;
      }
      if (email && !email.checkValidity()) {
        setError(t("booking.errors.emailInvalid"));
        setStep(1);
        email.focus();
        return false;
      }
    }

    return true;
  }

  function goToNextStep() {
    setError(null);
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      if (referenceUrl) formData.set("reference_url", referenceUrl);
      if (placementRegions.length > 0) {
        const placement = formData.get("placement");
        const combined = placement
          ? `${placement} — ${placementRegions.join(", ")}`
          : placementRegions.join(", ");
        formData.set("placement", combined);
      }
      const result = await submitBooking(formData);
      if (!result || result.error) {
        setError(result?.error ?? t("booking.errors.submitFailed"));
        return;
      }
      setSubmitted(true);
    } catch (err) {
      console.error("[BookingForm] Submit failed:", err);
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
        className="rounded-sm border border-accent bg-accent-muted p-12 text-center"
      >
        <Check className="mx-auto mb-4 text-accent" size={48} strokeWidth={1.5} />
        <h2 className="font-serif text-2xl font-medium text-foreground">{t("booking.thankYou")}</h2>
        <p className="mt-2 text-foreground-muted">
          {t("booking.received")}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                step >= s.id ? "text-accent" : "text-foreground-muted"
              }`}
            >
              {step > s.id ? (
                <Check size={16} strokeWidth={2} />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current">
                  {s.id}
                </span>
              )}
              <span className="hidden sm:inline">{t(s.titleKey)}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px w-6 sm:w-12 ${
                  step > s.id ? "bg-accent" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-6">
        {error && (
          <div className="rounded-sm border border-[var(--accent-crimson)] bg-[var(--accent-crimson-muted)] px-4 py-2 text-sm text-[var(--accent-crimson)]">
            {error}
          </div>
        )}

        {/* All steps rendered to keep form data in DOM on submit */}
        <div className={step !== 1 ? "hidden" : ""}>
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="space-y-4"
          >
            <h3 className="font-serif text-lg font-medium text-accent">
              {t("booking.step1Title")}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("booking.name")} required>
                <Input name="name" autoComplete="name" />
              </FormField>
              <FormField label={t("booking.email")} required>
                <Input name="email" type="email" autoComplete="email" />
              </FormField>
            </div>
            <FormField label={t("booking.phone")}>
              <Input name="phone" type="tel" />
            </FormField>
          </motion.div>
        </div>

        <div className={step !== 2 ? "hidden" : ""}>
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="space-y-6"
          >
            <h3 className="font-serif text-lg font-medium text-accent">
              {t("booking.step2Title")}
            </h3>
            <FormField label={t("booking.style")}>
              <Select name="style">
                <option value="">{t("booking.selectStyle")}</option>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{t(`styles.${s}`)}</option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("booking.placement")}>
              <BodyMapSelector
                value={placementRegions}
                onChange={setPlacementRegions}
                maxSelections={3}
              />
              <Input
                name="placement"
                placeholder={t("booking.placementPlaceholder")}
                className="mt-3"
              />
            </FormField>
            <FormField label={t("booking.size")}>
              <Select name="size">
                <option value="">{t("booking.selectSize")}</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>{t(`sizes.${s}`)}</option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("booking.describeIdea")}>
              <Textarea
                name="description"
                rows={4}
                placeholder={t("booking.describePlaceholder")}
              />
            </FormField>
            <FormField label={t("booking.referencePhoto")}>
              <BookingReferenceUpload value={referenceUrl} onChange={setReferenceUrl} />
            </FormField>
          </motion.div>
        </div>

        <div className={step !== 3 ? "hidden" : ""}>
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="space-y-4"
          >
            <h3 className="font-serif text-lg font-medium text-accent">
              {t("booking.step3Title")}
            </h3>
            <FormField label={t("booking.preferredArtist")}>
              <Select name="preferred_artist_id">
                <option value="">{t("booking.noPreference")}</option>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </FormField>
            <FormField label={t("booking.whenBook")}>
              <Input
                name="preferred_date"
                placeholder={t("booking.whenPlaceholder")}
              />
            </FormField>
          </motion.div>
        </div>

        <div className={step !== 4 ? "hidden" : ""}>
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="space-y-6"
          >
            <h3 className="font-serif text-lg font-medium text-accent">
              {t("booking.step4Title")}
            </h3>
            <p className="text-foreground-muted">
              {t("booking.reviewSubmit")}
            </p>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
              rightIcon={<PenLine size={20} strokeWidth={1.5} />}
            >
              {t("booking.submit")}
            </Button>
          </motion.div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            {t("booking.back")}
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={goToNextStep}
              rightIcon={<ChevronRight size={18} strokeWidth={1.5} />}
            >
              {t("booking.next")}
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
