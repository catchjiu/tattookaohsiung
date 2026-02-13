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
        className={`pt-14 md:pt-0 ${user ? "md:pl-56" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
