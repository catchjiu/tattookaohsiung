import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Image, FileText, CalendarCheck, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const [bookingCount, recentBookings] = await Promise.all([
    prisma.bookingRequest.count({ where: { status: "PENDING" } }),
    prisma.bookingRequest.findMany({
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        conceptDescription: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const cards = [
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, count: bookingCount, highlight: bookingCount > 0 },
    { href: "/admin/artists", label: "Artists", icon: Users },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
    { href: "/admin/blog", label: "Blog", icon: FileText },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="font-serif text-2xl font-medium text-[var(--foreground)] sm:text-3xl">
        Dashboard
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Welcome back. Manage your studio content below.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, icon: Icon, count = 0, highlight = false }) => (
          <Link
            key={href}
            href={href}
            className={`group flex items-center justify-between rounded-md border p-6 transition-colors ${
              highlight
                ? "border-[var(--accent-gold)] bg-[var(--accent-gold-muted)] hover:bg-[var(--accent-gold-muted)]"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-gold)] hover:bg-[var(--card-hover)]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-md p-3 ${highlight ? "bg-[var(--accent-gold)]/20" : "bg-[var(--accent-gold-muted)]"}`}>
                <Icon
                  className="text-[var(--accent-gold)]"
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <span className="font-medium text-[var(--foreground)]">
                  {label}
                </span>
                {count !== undefined && (
                  <span className={`ml-2 text-sm ${count > 0 ? "text-[var(--accent-gold)] font-medium" : "text-[var(--muted)]"}`}>
                    ({count} pending)
                  </span>
                )}
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

      {/* Recent bookings - very visible */}
      <div className="mt-12 rounded-md border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-medium text-[var(--foreground)]">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-[var(--accent-gold)] hover:underline"
          >
            View all →
          </Link>
        </div>
        {recentBookings.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Style</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)]">
                    <td className="px-4 py-3 font-medium">{b.clientName}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)]">{b.clientEmail}</td>
                    <td className="px-4 py-3 text-sm">{b.conceptDescription?.slice(0, 50) || "—"}</td>
                    <td className="px-4 py-3 text-sm text-[var(--muted)]">
                      {b.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">
            No bookings yet. New requests will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
