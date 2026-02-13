"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Image,
  FileText,
  CalendarCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/artists", label: "Artists", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile header bar with hamburger */}
      <div className="fixed left-0 right-0 top-16 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[#0d0d0d] px-4 py-3 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex p-2 -ml-2 text-[var(--foreground)]"
          aria-label="Open menu"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <span className="font-medium text-[var(--foreground)]">Admin</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Mobile overlay */}
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
              className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-[var(--border)] bg-[#121212] md:hidden"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <span className="font-medium text-[var(--foreground)]">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded p-2 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-[var(--accent-gold-muted)] text-[var(--accent-gold)]"
                          : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
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
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--accent-crimson)]"
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

      {/* Desktop sidebar - always visible */}
      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-56 border-r border-[var(--border)] bg-[#121212] md:block">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--accent-gold-muted)] text-[var(--accent-gold)]"
                    : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
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
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--accent-crimson)]"
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
