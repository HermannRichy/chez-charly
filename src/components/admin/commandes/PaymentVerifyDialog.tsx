"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { verifyPaymentAction } from "@/app/admin/(protected)/commandes/actions";

export type PaymentVerifyTarget = {
  orderId: string;
  orderNumber: string;
  paymentLabel: string;
  transactionRef: string;
  proofImageUrl: string | null;
};

export function PaymentVerifyDialog({
  target,
  onOpenChange,
}: {
  target: PaymentVerifyTarget | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {target && (
          <>
            <DialogHeader>
              <DialogTitle>Vérifier le paiement - {target.orderNumber}</DialogTitle>
              <DialogDescription>
                {target.paymentLabel} · Référence {target.transactionRef || "non renseignée"}
              </DialogDescription>
            </DialogHeader>

            {target.proofImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={target.proofImageUrl}
                alt="Capture de la preuve de paiement"
                className="w-full rounded-lg border border-border"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Aucune capture envoyée par le client.</p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => {
                  onOpenChange(false);
                  toast("Paiement non confirmé");
                }}
              >
                Paiement non reçu
              </Button>
              <Button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await verifyPaymentAction(target.orderId);
                    toast("Paiement validé");
                    onOpenChange(false);
                  })
                }
              >
                Je confirme le paiement
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
