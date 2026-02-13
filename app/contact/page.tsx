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
    <div className="mx-auto max-w-6xl px-8">
      <Section size="narrow">
        <ContactPageClient>
          <SectionLabel>Concierge</SectionLabel>
          <SectionTitle as="h1" className="mt-3">
            Book a Session
          </SectionTitle>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            Share your vision and we&apos;ll craft something extraordinary
            together. Our multi-step form helps us understand your ideas.
          </p>
        </ContactPageClient>
      </Section>

      <Section>
        <div className="grid gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border border-border bg-card p-10 md:p-12">
              <BookingForm artists={artists} />
            </div>
          </div>
          <div className="space-y-8">
            <div className="border-t border-border pt-8">
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                What to expect
              </h3>
              <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-foreground-muted">
                <li>We&apos;ll respond within 24–48 hours</li>
                <li>Consultation can be in-person or via video</li>
                <li>A deposit secures your spot</li>
                <li>Bring reference images to your session</li>
              </ul>
            </div>
            <div className="border-t border-border pt-8">
              <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                Contact
              </h3>
              <p className="mt-6 text-[15px] text-foreground-muted">
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
