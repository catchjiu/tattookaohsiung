"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  CalendarCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/artist", label: "Dashboard", icon: LayoutDashboard },
  { href: "/artist/bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/artist/gallery", label: "My Portfolio", icon: Image },
];

export function ArtistSidebar({ artistName }: { artistName: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="fixed left-0 right-0 top-16 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex p-2 -ml-2 text-foreground"
          aria-label="Open menu"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <span className="font-medium text-foreground truncate max-w-[50%]">
          {artistName}
        </span>
        <div className="w-10" />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <span className="font-medium text-foreground">Artist menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded p-2 text-foreground-muted transition-colors hover:bg-border hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/artist" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-accent-muted text-accent"
                          : "text-foreground-muted hover:bg-card-hover hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      {label}
                    </Link>
                  );
                })}
                <div className="mt-auto border-t border-[var(--border)] pt-4">
                  <form action="/api/auth/signout" method="post">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground-muted transition-colors hover:bg-card-hover hover:text-red-400"
                    >
                      <LogOut size={18} strokeWidth={1.5} />
                      Sign out
                    </button>
                  </form>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-56 border-r border-border bg-card md:block">
        <div className="border-b border-border px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Artist dashboard
          </p>
          <p className="mt-1 truncate font-medium text-foreground">{artistName}</p>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || (href !== "/artist" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-accent-muted text-accent"
                    : "text-foreground-muted hover:bg-card-hover hover:text-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
          <div className="mt-auto border-t border-[var(--border)] pt-4">
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-card-hover hover:text-red-400"
              >
                <LogOut size={18} strokeWidth={1.5} />
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </aside>
    </>
  );
}
