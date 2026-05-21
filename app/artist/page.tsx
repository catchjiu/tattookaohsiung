import Link from "next/link";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarCheck, Image, ArrowRight } from "lucide-react";

export default async function ArtistDashboardPage() {
  const user = await requireArtist();

  const [pendingCount, totalBookings, portfolioCount, artist] = await Promise.all([
    prisma.bookingRequest.count({
      where: { artistId: user.artistId, status: "PENDING" },
    }),
    prisma.bookingRequest.count({
      where: { artistId: user.artistId },
    }),
    prisma.portfolioImage.count({
      where: { artistId: user.artistId },
    }),
    prisma.artist.findUnique({
      where: { id: user.artistId },
      select: { name: true },
    }),
  ]);

  const cards = [
    {
      href: "/artist/bookings",
      label: "My bookings",
      icon: CalendarCheck,
      detail: `${pendingCount} pending · ${totalBookings} total`,
      highlight: pendingCount > 0,
    },
    {
      href: "/artist/gallery",
      label: "My portfolio",
      icon: Image,
      detail: `${portfolioCount} piece${portfolioCount !== 1 ? "s" : ""}`,
      highlight: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
        Welcome{artist?.name ? `, ${artist.name}` : ""}
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        View booking requests sent to you and update your portfolio artwork.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {cards.map(({ href, label, icon: Icon, detail, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`group flex items-center justify-between rounded-md border p-6 transition-colors ${
              highlight
                ? "border-[var(--accent-gold)] bg-[var(--accent-gold-muted)]"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-gold)]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`rounded-md p-3 ${highlight ? "bg-[var(--accent-gold)]/20" : "bg-[var(--accent-gold-muted)]"}`}
              >
                <Icon className="text-[var(--accent-gold)]" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <span className="font-medium text-[var(--foreground)]">{label}</span>
                <p className="mt-1 text-sm text-[var(--muted)]">{detail}</p>
              </div>
            </div>
            <ArrowRight
              size={20}
              strokeWidth={1.5}
              className="text-[var(--muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-gold)]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
