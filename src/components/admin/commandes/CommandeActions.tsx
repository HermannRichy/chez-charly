"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { OrderStatus } from "@prisma/client";
import { IconCheck, IconBrandWhatsapp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { STATUS_FLOW, STATUS_TRACK_LABEL, statusIndex } from "@/lib/order-status";
import { buildStatusWhatsAppLink } from "@/lib/whatsapp";
import { PaymentVerifyDialog, type PaymentVerifyTarget } from "@/components/admin/commandes/PaymentVerifyDialog";
import { advanceStatusAction } from "@/app/admin/(protected)/commandes/actions";

export function CommandeActions({
  orderId,
  orderNumber,
  customerName,
  customerPhone,
  paymentLabel,
  transactionRef,
  proofImageUrl,
  status,
  verified,
}: {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  paymentLabel: string;
  transactionRef: string;
  proofImageUrl: string | null;
  status: OrderStatus;
  verified: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [verifying, setVerifying] = useState<PaymentVerifyTarget | null>(null);
  const current = statusIndex(status);
  const whatsappLink = buildStatusWhatsAppLink({
    phone: customerPhone,
    name: customerName,
    orderNumber,
    status,
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 grid gap-5">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2.5 rounded-md text-sm font-bold hover:bg-[#25D366]/90"
      >
        <IconBrandWhatsapp size={18} />
        Prévenir sur WhatsApp
      </a>

      <div>
        <div className="text-[11px] font-bold tracking-[.1em] text-muted-foreground mb-2">PAIEMENT</div>
        {verified ? (
          <div className="flex items-center gap-2 text-[#6FE39B] font-bold text-sm">
            <IconCheck size={16} />
            Paiement vérifié
          </div>
        ) : (
          <Button
            className="w-full bg-amber text-ink hover:bg-amber/85"
            disabled={pending}
            onClick={() =>
              setVerifying({ orderId, orderNumber, paymentLabel, transactionRef, proofImageUrl })
            }
          >
            Vérifier le paiement
          </Button>
        )}
      </div>

      <div>
        <div className="text-[11px] font-bold tracking-[.1em] text-muted-foreground mb-2.5">STATUT</div>
        <div className="grid gap-2">
          {STATUS_FLOW.map((step, i) => (
            <div
              key={step}
              className={
                i <= current
                  ? "flex items-center gap-2.5 text-sm font-bold text-foreground"
                  : "flex items-center gap-2.5 text-sm text-muted-foreground"
              }
            >
              <span
                className={
                  i <= current
                    ? "w-5.5 h-5.5 rounded-full bg-primary text-primary-foreground grid place-items-center text-[11px] font-bold"
                    : "w-5.5 h-5.5 rounded-full bg-muted grid place-items-center text-[11px] font-bold"
                }
              >
                {i + 1}
              </span>
              {STATUS_TRACK_LABEL[step]}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            disabled={pending || status === "RECEIVED"}
            onClick={() =>
              startTransition(async () => {
                await advanceStatusAction(orderId, -1);
                toast("Statut mis à jour");
              })
            }
          >
            Précédent
          </Button>
          <Button
            className="flex-1"
            disabled={pending || status === "DELIVERED"}
            onClick={() =>
              startTransition(async () => {
                await advanceStatusAction(orderId, 1);
                toast("Statut mis à jour");
              })
            }
          >
            Étape suivante
          </Button>
        </div>
      </div>

      <PaymentVerifyDialog target={verifying} onOpenChange={(open) => !open && setVerifying(null)} />
    </div>
  );
}
