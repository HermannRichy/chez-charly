import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderTracking } from "@/components/site/OrderTracking";

export default async function SuiviDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber: id },
    include: { items: true, zone: true },
  });

  if (!order) notFound();

  const itemsLabel = order.items.map((i) => `${i.qty}× ${i.name}`).join(", ");

  return (
    <OrderTracking
      orderNumber={order.orderNumber}
      itemsLabel={itemsLabel}
      zoneName={order.zone.name}
      zoneEta={order.zone.etaLabel}
      initialStatus={order.status}
      initialTotal={order.total}
    />
  );
}
