import { notFound } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { fmt } from "@/lib/format";
import { relativeTime } from "@/lib/relative-time";
import { CommandeActions } from "@/components/admin/commandes/CommandeActions";

export default async function AdminCommandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, zone: true, paymentInfo: true, user: true },
  });

  if (!order) notFound();

  return (
    <div className="grid gap-5 min-w-0">
      <div>
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={15} />
          Commandes
        </Link>
        <h1 className="font-grifter text-2xl text-foreground mt-2">{order.orderNumber}</h1>
        <p className="text-sm text-muted-foreground mt-1">{relativeTime(order.createdAt)}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="grid gap-5 min-w-0">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[11px] font-bold tracking-[.1em] text-muted-foreground mb-3">CLIENT</div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Nom</div>
                <div className="font-medium">{order.customerName}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Téléphone</div>
                <div className="font-medium">{order.customerPhone}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Compte</div>
                <div className="font-medium">{order.user.email}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Adresse / retrait</div>
                <div className="font-medium">{order.address}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[11px] font-bold tracking-[.1em] text-muted-foreground mb-3">ARTICLES</div>
            <div className="grid gap-2">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-sm">
                  <span>
                    {it.qty}× {it.name}
                  </span>
                  <span className="text-muted-foreground">{fmt(it.price * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-1.5 mt-4 pt-4 border-t border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{fmt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison · {order.zone.name}</span>
                <span>{order.deliveryFee === 0 ? "Gratuit" : fmt(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-base pt-1">
                <span>Total</span>
                <span className="text-primary">{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-[11px] font-bold tracking-[.1em] text-muted-foreground mb-3">PAIEMENT</div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Moyen</div>
                <div className="font-medium">{order.paymentInfo.label}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Référence</div>
                <div className="font-medium">{order.transactionRef || "-"}</div>
              </div>
              {order.proofImageUrl && (
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground text-xs mb-1.5">Capture</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={order.proofImageUrl}
                    alt="Capture de la preuve de paiement"
                    className="max-w-xs rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
          </div>

          {order.note && (
            <div className="bg-amber/10 border border-amber/30 rounded-xl p-5">
              <div className="text-[11px] font-bold tracking-[.1em] text-amber mb-2">MESSAGE DU CLIENT</div>
              <p className="text-sm text-foreground">{order.note}</p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-20">
          <CommandeActions
            orderId={order.id}
            orderNumber={order.orderNumber}
            customerName={order.customerName}
            customerPhone={order.customerPhone}
            paymentLabel={order.paymentInfo.label}
            transactionRef={order.transactionRef}
            proofImageUrl={order.proofImageUrl}
            status={order.status}
            verified={order.verified}
          />
        </div>
      </div>
    </div>
  );
}
