import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {user && <AdminSidebar />}
      <div
        className={`min-h-screen pt-14 md:pt-0 pb-[env(safe-area-inset-bottom,1rem)] ${user ? "md:pl-56" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
