import Link from "next/link";
import { requireStaffPage } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { fmt } from "@/lib/format";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaffPage();

  const [orderCount, revenue, unverified, clientCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { verified: false } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);

  const stats = [
    { k: "COMMANDES TOTALES", v: orderCount.toString(), d: "Depuis le lancement" },
    { k: "CHIFFRE TOTAL", v: fmt(revenue._sum.total ?? 0), d: "Toutes commandes confondues" },
    { k: "PAIEMENTS À VÉRIFIER", v: unverified.toString(), d: "MoMo & Moov" },
    { k: "MEMBRES FIDÉLITÉ", v: clientCount.toString(), d: "Comptes clients créés" },
  ];

  return (
    <div className="bg-admin-bg min-h-screen -mt-px">
      <div className="max-w-335 mx-auto px-4 pt-[clamp(26px,5vw,40px)] pb-18 text-admin-text">
        <div className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <div className="text-xs font-extrabold tracking-[.14em] text-orange">
              TABLEAU DE BORD · CHEZ CHARLY
            </div>
            <h1 className="font-grifter text-[clamp(34px,4vw,52px)] mt-2.5 leading-[.95]">
              Bienvenue
            </h1>
          </div>
          <Link
            href="/"
            className="border-[1.5px] border-admin-text/26 bg-transparent text-admin-text px-4.5 py-2.75 rounded-full text-[13px] font-bold hover:border-orange hover:text-orange"
          >
            ← Voir le site client
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-3.5 mt-7.5">
          {stats.map((s) => (
            <div key={s.k} className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-5">
              <div className="text-[11.5px] font-extrabold tracking-[.1em] text-admin-text-3">{s.k}</div>
              <div className="font-grifter text-[34px] text-orange mt-2 leading-none">{s.v}</div>
              <div className="text-xs text-admin-text-4 mt-1.5">{s.d}</div>
            </div>
          ))}
        </div>

        <AdminNavTabs />

        {children}
      </div>
    </div>
  );
}
