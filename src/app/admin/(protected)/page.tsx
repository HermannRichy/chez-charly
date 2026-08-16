import Link from "next/link";
import { IconReceipt2, IconCurrencyDollar, IconAlertCircle, IconUsers } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { fmt, fmtNumber } from "@/lib/format";
import { relativeTime } from "@/lib/relative-time";
import { STATUS_LABEL } from "@/lib/order-status";
import { PageHeader } from "@/components/admin/ui/page-header";
import { TableCard } from "@/components/admin/ui/table-card";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/ui/status-badge";

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function pctDelta(today: number, yesterday: number): number | null {
  if (yesterday === 0) return null;
  return Math.round(((today - yesterday) / yesterday) * 100);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000);

  const [
    ordersToday,
    ordersYesterday,
    revenueToday,
    revenueYesterday,
    unverified,
    clientCount,
    weekOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: todayStart } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: yesterdayStart, lt: todayStart } } }),
    prisma.order.count({ where: { verified: false } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.order.findMany({
      where: { createdAt: { gte: weekStart } },
      select: { createdAt: true, total: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
    }),
  ]);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart.getTime() + i * 86400000);
    const dayEnd = new Date(day.getTime() + 86400000);
    const revenue = weekOrders
      .filter((o) => o.createdAt >= day && o.createdAt < dayEnd)
      .reduce((sum, o) => sum + o.total, 0);
    return { label: DAY_LABELS[day.getDay()], revenue };
  });

  return (
    <div className="grid gap-5 min-w-0">
      <PageHeader title="Tableau de bord" description="Vue d'ensemble du service" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="COMMANDES AUJOURD'HUI"
          value={fmtNumber(ordersToday)}
          delta={pctDelta(ordersToday, ordersYesterday)}
          icon={IconReceipt2}
        />
        <KpiCard
          label="CHIFFRE DU JOUR"
          value={fmt(revenueToday._sum.total ?? 0)}
          delta={pctDelta(revenueToday._sum.total ?? 0, revenueYesterday._sum.total ?? 0)}
          icon={IconCurrencyDollar}
        />
        <KpiCard label="PAIEMENTS À VÉRIFIER" value={fmtNumber(unverified)} icon={IconAlertCircle} />
        <KpiCard label="MEMBRES FIDÉLITÉ" value={fmtNumber(clientCount)} icon={IconUsers} />
      </div>

      <RevenueChart data={chartData} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-grifter text-lg text-foreground">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-sm font-bold text-primary hover:underline">
            Voir tout →
          </Link>
        </div>
        <TableCard>
          {recentOrders.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Aucune commande pour l&apos;instant.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Link href={`/admin/commandes/${o.id}`} className="font-bold hover:text-primary">
                        {o.orderNumber}
                      </Link>
                      <div className="text-[12px] text-muted-foreground">{o.customerName}</div>
                      <div className="text-[11px] text-muted-foreground">{relativeTime(o.createdAt)}</div>
                    </TableCell>
                    <TableCell className="font-bold text-primary">{fmt(o.total)}</TableCell>
                    <TableCell>
                      <StatusBadge tone="info">{STATUS_LABEL[o.status]}</StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableCard>
      </div>
    </div>
  );
}
