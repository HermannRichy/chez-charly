import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/pricing";
import { AdminLoyaltyRule } from "@/components/admin/AdminLoyaltyRule";
import { AdminTierRow } from "@/components/admin/AdminTierRow";
import { AdminWheelPrizeInput } from "@/components/admin/AdminWheelPrizeInput";

export default async function AdminFidelitePage() {
  const [settings, tiers, prizes] = await Promise.all([
    getSettings(),
    prisma.loyaltyTier.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.wheelPrize.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4 items-start">
      <div className="grid gap-3.5">
        <AdminLoyaltyRule value={settings.ptsPerUnit} />
        <div className="grid gap-2">
          {tiers.map((t) => (
            <AdminTierRow key={t.id} tier={t} />
          ))}
        </div>
      </div>

      <div className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-5.5">
        <div className="font-grifter text-xl text-orange">Cases de la roue</div>
        <p className="text-[13.5px] text-admin-text-3 leading-[1.55] mt-2 mb-4">
          Huit cases, modifiables à tout moment. Elles s&apos;appliquent immédiatement côté client.
        </p>
        <div className="grid gap-2">
          {prizes.map((p) => (
            <AdminWheelPrizeInput key={p.id} prize={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
