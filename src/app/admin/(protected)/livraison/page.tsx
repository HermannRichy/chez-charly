import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/pricing";
import { AdminZoneRow } from "@/components/admin/AdminZoneRow";
import { AdminFreeFrom } from "@/components/admin/AdminFreeFrom";

export default async function AdminLivraisonPage() {
  const [zones, settings] = await Promise.all([
    prisma.deliveryZone.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 items-start">
      <div className="grid gap-2">
        {zones.map((z) => (
          <AdminZoneRow key={z.id} zone={z} />
        ))}
      </div>
      <AdminFreeFrom value={settings.freeFrom} />
    </div>
  );
}
