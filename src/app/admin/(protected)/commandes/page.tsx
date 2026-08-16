import { prisma } from "@/lib/prisma";
import { relativeTime } from "@/lib/relative-time";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TableCard } from "@/components/admin/ui/table-card";
import { CommandesTable } from "@/components/admin/commandes/CommandesTable";
import { AdminAutoRefresh } from "@/components/admin/AdminAutoRefresh";

export default async function AdminCommandesPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true, zone: true, paymentInfo: true },
  });

  return (
    <div className="grid gap-5 min-w-0">
      <AdminAutoRefresh />
      <PageHeader title="Commandes" description={`${orders.length} commande(s)`} />
      <TableCard>
        <CommandesTable
          orders={orders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            ageLabel: relativeTime(o.createdAt),
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            itemsLabel: o.items.map((i) => `${i.qty}× ${i.name}`).join(", "),
            zoneName: o.zone.name,
            total: o.total,
            paymentMethod: o.paymentMethod,
            paymentLabel: o.paymentInfo.label,
            transactionRef: o.transactionRef,
            proofImageUrl: o.proofImageUrl,
            verified: o.verified,
            status: o.status,
          }))}
        />
      </TableCard>
    </div>
  );
}
