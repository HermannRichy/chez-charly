import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/pricing";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TableCard } from "@/components/admin/ui/table-card";
import { LoyaltyRuleCard } from "@/components/admin/fidelite/LoyaltyRuleCard";
import { TiersTable, AddTierButton } from "@/components/admin/fidelite/TiersTable";
import { WheelPrizesTable } from "@/components/admin/fidelite/WheelPrizesTable";

export default async function AdminFidelitePage() {
  const [settings, tiers, prizes] = await Promise.all([
    getSettings(),
    prisma.loyaltyTier.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.wheelPrize.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="grid gap-5 min-w-0">
      <PageHeader title="Fidélité" description="Règle de points, paliers et roue de la chance" />

      <LoyaltyRuleCard value={settings.ptsPerUnit} />

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-grifter text-lg text-foreground">Paliers</h2>
          <AddTierButton />
        </div>
        <TableCard>
          <TiersTable tiers={tiers} />
        </TableCard>
      </div>

      <div>
        <h2 className="font-grifter text-lg text-foreground mb-3">Cases de la roue</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Huit cases, appliquées immédiatement côté client.
        </p>
        <TableCard>
          <WheelPrizesTable prizes={prizes} />
        </TableCard>
      </div>
    </div>
  );
}
