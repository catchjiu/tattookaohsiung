import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { BookingForm } from "@/components/booking/BookingForm";
import { ContactPageClient } from "@/components/contact/ContactPageClient";
import { Section, SectionLabel, SectionTitle } from "@/components/ui";

export default async function ContactPage() {
  const artists = await prisma.artist.findMany({
    where: { status: { not: "INACTIVE" } },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-6">
      <Section size="narrow">
        <ContactPageClient>
          <SectionLabel>Concierge</SectionLabel>
          <SectionTitle as="h1" className="mt-2">
            Book a Session
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground-muted">
            Share your vision and we&apos;ll craft something extraordinary
            together. Our multi-step form helps us understand your ideas.
          </p>
        </ContactPageClient>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-sm border border-border bg-card p-8">
              <BookingForm artists={artists} />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-sm border border-border bg-card p-6">
              <h3 className="font-serif text-lg font-medium text-accent">
                What to expect
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
                <li>• We&apos;ll respond within 24–48 hours</li>
                <li>• Consultation can be in-person or via video</li>
                <li>• A deposit secures your spot</li>
                <li>• Bring reference images to your session</li>
              </ul>
            </div>
            <div className="rounded-sm border border-border bg-card p-6">
              <h3 className="font-serif text-lg font-medium text-accent">
                Contact
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">
                Prefer to reach out directly? DM us on Instagram{" "}
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
          </div>
        </div>
      </Section>
    </div>
  );
}
