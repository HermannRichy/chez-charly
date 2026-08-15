import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/session";
import { fmt } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-status";

export default async function ComptesCommandesPage() {
  const user = await requireClient("/compte/commandes");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true, zone: true },
  });

  return (
    <div>
      <h1 className="font-grifter text-[clamp(38px,5vw,64px)] leading-[.92] text-ink">
        Historique des commandes
      </h1>

      {orders.length === 0 ? (
        <div className="mt-8.5 bg-white border border-dashed border-border-mid-3 rounded-[26px] px-6.5 py-15.5 text-center">
          <div className="font-grifter text-2xl text-deep">Aucune commande pour l&apos;instant</div>
          <p className="text-[15.5px] text-[#7A4736] mt-2.5 mb-6.5">
            Vos commandes passées apparaîtront ici, avec le détail des articles.
          </p>
          <Link
            href="/menu"
            className="border-0 bg-orange text-white px-7 py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep"
          >
            Parcourir le menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-3.5 mt-7.5">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-border-light rounded-[22px] p-5.5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="font-grifter text-xl text-deep">{o.orderNumber}</div>
                <span className="text-xs font-extrabold text-[#C25A1E] bg-orange/14 px-2.75 py-1.25 rounded-full">
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <div className="text-[12.5px] text-text-tertiary mt-1">
                {o.createdAt.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · Livraison {o.zone.name}
              </div>

              <div className="grid gap-1.5 mt-3.5">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-sm text-[#4A2318]">
                    <span>
                      {it.qty}× {it.name}
                    </span>
                    <span className="text-text-tertiary">{fmt(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>

              {o.note && (
                <div className="mt-3.5 bg-cream-2 rounded-[14px] px-3.75 py-3">
                  <div className="text-[10.5px] font-extrabold tracking-[.1em] text-label">
                    VOTRE MESSAGE
                  </div>
                  <div className="text-sm text-[#4A2318] mt-1">{o.note}</div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border-light flex-wrap">
                <div>
                  <div className="text-[11px] font-extrabold tracking-[.1em] text-label">TOTAL</div>
                  <div className="font-grifter text-xl text-deep">{fmt(o.total)}</div>
                </div>
                <Link
                  href={`/suivi/${o.orderNumber}`}
                  className="border-[1.5px] border-border-mid-3 text-[#7A3A2A] px-5 py-2.75 rounded-full text-[13.5px] font-extrabold hover:border-deep hover:text-deep"
                >
                  Voir le suivi
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
