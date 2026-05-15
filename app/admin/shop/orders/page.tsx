import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusForm } from "./OrderStatusForm";

export const dynamic = "force-dynamic";

function formatTwd(n: number | null | undefined) {
  if (n == null) return "—";
  return `NT$ ${n}`;
}

export default async function AdminShopOrdersPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const orders = await prisma.shopOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      items: {
        select: {
          nameSnapshot: true,
          sizeSnapshot: true,
          quantity: true,
          lineTotalTwd: true,
        },
      },
    },
  });

  return (
    <div className="p-4 pb-8 sm:p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Shop orders
          </h1>
          <p className="mt-2 text-foreground-muted">
            Checkout requests from the public shop. Email notifications use
            Resend when configured.
          </p>
        </div>
        <Link
          href="/admin/shop"
          className="shrink-0 text-sm font-medium text-accent hover:underline"
        >
          ← Back to products
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-md border border-border">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-3 py-3 font-medium text-foreground-muted">
                Date
              </th>
              <th className="px-3 py-3 font-medium text-foreground-muted">
                Customer
              </th>
              <th className="px-3 py-3 font-medium text-foreground-muted">
                Items
              </th>
              <th className="px-3 py-3 font-medium text-foreground-muted">
                Total
              </th>
              <th className="px-3 py-3 font-medium text-foreground-muted">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-12 text-center text-foreground-muted"
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-border bg-card hover:bg-card-hover"
                >
                  <td className="align-top px-3 py-3 text-foreground-muted">
                    {o.createdAt.toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="align-top px-3 py-3">
                    <div className="font-medium text-foreground">
                      {o.customerName}
                    </div>
                    <div className="text-xs text-foreground-muted">
                      {o.customerEmail}
                    </div>
                    {o.customerPhone ? (
                      <div className="text-xs text-foreground-muted">
                        {o.customerPhone}
                      </div>
                    ) : null}
                    {o.transferSenderLastFive ? (
                      <div className="mt-1 font-mono text-xs text-foreground">
                        Transfer (last 5): {o.transferSenderLastFive}
                      </div>
                    ) : null}
                    <div className="mt-1 break-all font-mono text-[11px] text-foreground-subtle">
                      {o.id}
                    </div>
                  </td>
                  <td className="align-top px-3 py-3 text-foreground-muted">
                    <ul className="max-w-xs list-inside list-disc space-y-0.5 text-xs">
                      {o.items.map((i, idx) => (
                        <li key={idx}>
                          {i.nameSnapshot}
                          {i.sizeSnapshot ? ` (${i.sizeSnapshot})` : ""} ×{" "}
                          {i.quantity}{" "}
                          <span className="text-foreground-subtle">
                            ({formatTwd(i.lineTotalTwd)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="align-top px-3 py-3 text-foreground">
                    {formatTwd(o.totalTwd)}
                  </td>
                  <td className="align-top px-3 py-3">
                    <OrderStatusForm
                      orderId={o.id}
                      currentStatus={o.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
