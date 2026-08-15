import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/session";
import { getSettings, nextTier } from "@/lib/pricing";
import { fmt } from "@/lib/format";
import { LoyaltyWheel } from "@/components/site/LoyaltyWheel";

export default async function FidelitePage() {
  const sessionUser = await requireClient("/fidelite");

  const [user, tiers, prizes, settings, history] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: sessionUser.id },
      select: { points: true, spinsAvailable: true },
    }),
    prisma.loyaltyTier.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.wheelPrize.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
    prisma.loyaltyTx.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const tier = nextTier(tiers, user.points);
  const progress = tier ? Math.min(100, Math.round((user.points / tier.threshold) * 100)) : 100;
  const remaining = tier ? Math.max(0, tier.threshold - user.points) : 0;

  return (
    <div className="max-w-295 mx-auto px-4 pt-[clamp(34px,6vw,56px)] pb-[clamp(56px,8vw,92px)]">
      <div className="rounded-[28px] bg-ink text-cream p-[clamp(22px,4vw,40px)] relative overflow-hidden">
        <div className="absolute w-95 h-95 rounded-full bg-orange opacity-30 blur-[70px] -right-15 -top-30" />
        <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(26px,4vw,40px)] items-center">
          <div>
            <div className="text-xs font-extrabold tracking-[.14em] text-orange">
              CARTE FIDÉLITÉ CHEZ CHARLY
            </div>
            <div className="flex items-baseline gap-3 mt-3.5">
              <div className="font-grifter text-[clamp(62px,14vw,88px)] leading-[.9] text-cream">
                {user.points}
              </div>
              <div className="font-grifter text-[26px] text-orange">pts</div>
            </div>
            <div className="text-[14.5px] text-[#D9B7A7] mt-2">
              1 point par {fmt(settings.ptsPerUnit)} dépensés
              {tier && ` · encore ${remaining} pts avant le ${tier.name}`}
            </div>
            <div className="h-3 rounded-full bg-white/14 mt-5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#FB6117,#FFB37A)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            {tier && (
              <div className="text-[13px] text-[#C6A292] mt-2.5">Prochain lot : {tier.reward}</div>
            )}
          </div>
          <div className="grid gap-2.5">
            {tiers.map((t) => (
              <div
                key={t.id}
                className="flex items-center flex-wrap gap-2 gap-x-3.5 bg-white/7 border border-white/14 rounded-[18px] px-4.25 py-3.75"
              >
                <div className="font-grifter text-xl text-orange min-w-19.5">{t.threshold} pts</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold">{t.name}</div>
                  <div className="text-[12.5px] text-[#D9B7A7]">{t.reward}</div>
                </div>
                {user.points >= t.threshold ? (
                  <span className="text-[10.5px] font-extrabold text-ink bg-[#6FE39B] px-2.5 py-1.25 rounded-full">
                    DÉBLOQUÉ
                  </span>
                ) : (
                  <span className="text-[10.5px] font-extrabold text-[#C6A292] border border-white/20 px-2.5 py-1.25 rounded-full">
                    VERROUILLÉ
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5 mt-5 items-start">
        <LoyaltyWheel prizes={prizes.map((p) => p.label)} initialSpins={user.spinsAvailable} />

        <div className="grid gap-4">
          <div className="bg-peach rounded-[24px] p-6.5">
            <div className="font-grifter text-2xl text-deep">Comment gagner plus vite</div>
            <div className="grid gap-3 mt-4">
              {[
                "Commandez en ligne plutôt qu'au comptoir — les points ne tombent que sur l'app.",
                "Groupez la commande du bureau : le total compte, pas le nombre de plats.",
                "Les mardis chargés : points doublés sur l'attiéké, annoncé depuis le dashboard.",
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="font-grifter text-orange text-lg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="text-[14.5px] text-[#4A2318] leading-[1.5]">{tip}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border-light rounded-[24px] p-6.5">
            <div className="text-xs font-extrabold tracking-[.12em] text-label">
              HISTORIQUE DES POINTS
            </div>
            <div className="grid gap-2.5 mt-3.5 text-sm">
              {history.length === 0 ? (
                <div className="text-text-secondary">Rien pour l&apos;instant.</div>
              ) : (
                history.map((tx) => (
                  <div key={tx.id} className="flex justify-between">
                    <span className="text-text-secondary">{tx.reason}</span>
                    <b className={tx.delta >= 0 ? "text-[#21A85B]" : "text-deep"}>
                      {tx.delta >= 0 ? "+" : ""}
                      {tx.delta} pts
                    </b>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
