import { requireStaffPage } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { fmt, fmtNumber } from "@/lib/format";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaffPage();

  const [orderCount, revenue, unverified, clientCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { verified: false } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);

  const stats = [
    { k: "COMMANDES TOTALES", v: fmtNumber(orderCount), d: "Depuis le lancement" },
    { k: "CHIFFRE TOTAL", v: fmt(revenue._sum.total ?? 0), d: "Toutes commandes confondues" },
    { k: "PAIEMENTS À VÉRIFIER", v: fmtNumber(unverified), d: "MoMo & Moov" },
    { k: "MEMBRES FIDÉLITÉ", v: fmtNumber(clientCount), d: "Comptes clients créés" },
  ];

  return (
    <div className="bg-admin-bg min-h-screen -mt-px">
      <div className="max-w-335 mx-auto px-4 pt-[clamp(20px,4vw,32px)] pb-18 flex flex-col md:flex-row gap-5 md:gap-8">
        <AdminSidebar />

        <div className="flex-1 min-w-0 text-admin-text">
          <div className="text-xs font-extrabold tracking-[.14em] text-orange">
            TABLEAU DE BORD · CHEZ CHARLY
          </div>
          <h1 className="font-grifter text-[clamp(30px,3.6vw,46px)] mt-2.5 leading-[.95]">Bienvenue</h1>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-3.5 mt-7">
            {stats.map((s) => (
              <div key={s.k} className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-5">
                <div className="text-[11.5px] font-extrabold tracking-[.1em] text-admin-text-3">{s.k}</div>
                <div className="font-grifter text-[34px] text-orange mt-2 leading-none">{s.v}</div>
                <div className="text-xs text-admin-text-4 mt-1.5">{s.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
