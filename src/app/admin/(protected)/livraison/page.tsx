import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/pricing";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TableCard } from "@/components/admin/ui/table-card";
import { ZonesTable, AddZoneButton } from "@/components/admin/livraison/ZonesTable";
import { FreeFromCard } from "@/components/admin/livraison/FreeFromCard";

export default async function AdminLivraisonPage() {
  const [zones, settings] = await Promise.all([
    prisma.deliveryZone.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);

  return (
    <div className="grid gap-5 min-w-0">
      <PageHeader
        title="Livraison"
        description="Zones, tarifs, retrait au resto et livraison offerte"
        actions={<AddZoneButton />}
      />
      <div className="grid lg:grid-cols-[1fr_280px] gap-5 items-start">
        <TableCard>
          <ZonesTable zones={zones} />
        </TableCard>
        <FreeFromCard value={settings.freeFrom} />
      </div>
    </div>
  );
}
