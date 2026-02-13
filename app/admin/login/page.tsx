import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const user = await getSession();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl font-medium text-[var(--foreground)]">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to manage your studio content.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
