"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Check, PenLine } from "lucide-react";
import { submitBooking } from "@/app/contact/actions";
import { BookingReferenceUpload } from "./BookingReferenceUpload";
import { BodyMapSelector } from "./BodyMapSelector";
import { Input, Textarea, Select, FormField, Button } from "@/components/ui";

const STEPS = [
  { id: 1, title: "Your details", key: "details" },
  { id: 2, title: "Your vision", key: "vision" },
  { id: 3, title: "Preferences", key: "preferences" },
  { id: 4, title: "Confirm", key: "confirm" },
];

const STYLES = ["Traditional", "Fine-line", "Realism", "Blackwork", "Japanese", "Neo-traditional", "Other"];
const SIZES = ["Small (under 1 hour)", "Medium (1–3 hours)", "Large (half day)", "Full sleeve / day"];

type Props = {
  artists: { id: string; name: string }[];
};

export function BookingForm({ artists }: Props) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [placementRegions, setPlacementRegions] = useState<string[]>([]);

  const formId = "booking-form";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
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
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
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
        <h2 className="font-serif text-2xl font-medium text-foreground">Thank you</h2>
        <p className="mt-2 text-foreground-muted">
          Your booking request has been received. We&apos;ll be in touch within 24–48 hours.
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
              <span className="hidden sm:inline">{s.title}</span>
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

      <form id={formId} onSubmit={handleSubmit} className="space-y-6">
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
              Step 1 — Your details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" required>
                <Input name="name" required />
              </FormField>
              <FormField label="Email" required>
                <Input name="email" type="email" required />
              </FormField>
            </div>
            <FormField label="Phone">
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
              Step 2 — Your vision
            </h3>
            <FormField label="Style">
              <Select name="style">
                <option value="">Select a style</option>
                {STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Placement — select body area(s)">
              <BodyMapSelector
                value={placementRegions}
                onChange={setPlacementRegions}
                maxSelections={3}
              />
              <Input
                name="placement"
                placeholder="Additional notes (e.g. inner arm, upper back)"
                className="mt-3"
              />
            </FormField>
            <FormField label="Size">
              <Select name="size">
                <option value="">Select size</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Describe your idea">
              <Textarea
                name="description"
                rows={4}
                placeholder="Tell us about your tattoo vision, reference images, or inspiration..."
              />
            </FormField>
            <FormField label="Reference photo">
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
              Step 3 — Preferences
            </h3>
            <FormField label="Preferred artist">
              <Select name="preferred_artist_id">
                <option value="">No preference</option>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="When would you like to book?">
              <Input
                name="preferred_date"
                placeholder="e.g. Next month, flexible"
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
              Step 4 — Confirm & submit
            </h3>
            <p className="text-foreground-muted">
              Review your details and submit. We&apos;ll be in touch to confirm your session.
            </p>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
              rightIcon={<PenLine size={20} strokeWidth={1.5} />}
            >
              Submit booking request
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
            Back
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              rightIcon={<ChevronRight size={18} strokeWidth={1.5} />}
            >
              Next
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
