import { prisma } from "@/lib/prisma";
import { relativeTime } from "@/lib/relative-time";
import { AdminOrderCard } from "@/components/admin/AdminOrderCard";
import { AdminAutoRefresh } from "@/components/admin/AdminAutoRefresh";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: true, zone: true },
  });

  return (
    <div className="grid gap-3">
      <AdminAutoRefresh />
      {orders.length === 0 ? (
        <div className="text-admin-text-3 text-sm">Aucune commande pour l&apos;instant.</div>
      ) : (
        orders.map((o) => (
          <AdminOrderCard
            key={o.id}
            order={{
              id: o.id,
              orderNumber: o.orderNumber,
              ageLabel: relativeTime(o.createdAt),
              customerName: o.customerName,
              customerPhone: o.customerPhone,
              itemsLabel: o.items.map((i) => `${i.qty}× ${i.name}`).join(", "),
              zoneName: o.zone.name,
              total: o.total,
              paymentMethod: o.paymentMethod,
              transactionRef: o.transactionRef,
              verified: o.verified,
              status: o.status,
            }}
          />
        ))
      )}
    </div>
  );
}
