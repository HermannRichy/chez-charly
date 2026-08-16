"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { OrderStatus, PaymentProvider } from "@prisma/client";
import {
  IconEye,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconReceipt2,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { fmt } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-status";
import { buildStatusWhatsAppLink } from "@/lib/whatsapp";
import { RowActions } from "@/components/admin/ui/row-actions";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { PaymentVerifyDialog, type PaymentVerifyTarget } from "@/components/admin/commandes/PaymentVerifyDialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { advanceStatusAction } from "@/app/admin/(protected)/commandes/actions";

export type CommandeRow = {
  id: string;
  orderNumber: string;
  ageLabel: string;
  customerName: string;
  customerPhone: string;
  itemsLabel: string;
  zoneName: string;
  total: number;
  paymentMethod: PaymentProvider;
  paymentLabel: string;
  transactionRef: string;
  proofImageUrl: string | null;
  verified: boolean;
  status: OrderStatus;
};

function isCompleted(o: CommandeRow) {
  return o.status === "DELIVERED" && o.verified;
}

export function CommandesTable({ orders }: { orders: CommandeRow[] }) {
  const [pending, startTransition] = useTransition();
  const [verifying, setVerifying] = useState<PaymentVerifyTarget | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={IconReceipt2}
        title="Aucune commande pour l'instant"
        description="Les commandes passées sur le site apparaîtront ici."
      />
    );
  }

  const completedCount = orders.filter(isCompleted).length;
  const visibleOrders = showCompleted ? orders : orders.filter((o) => !isCompleted(o));

  return (
    <>
      {completedCount > 0 && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border">
          <span className="text-xs text-muted-foreground">
            {completedCount} commande(s) livrée(s) et payée(s) masquée(s)
          </span>
          <button
            type="button"
            onClick={() => setShowCompleted((v) => !v)}
            className="text-xs font-bold text-primary hover:underline"
          >
            {showCompleted ? "Masquer les terminées" : "Afficher les terminées"}
          </button>
        </div>
      )}

      {visibleOrders.length === 0 ? (
        <EmptyState
          icon={IconReceipt2}
          title="Aucune commande en cours"
          description="Les commandes livrées et payées sont masquées."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Link href={`/admin/commandes/${o.id}`} className="font-bold text-foreground hover:text-primary">
                    {o.orderNumber}
                  </Link>
                  <div className="text-[11.5px] text-muted-foreground">{o.ageLabel}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-[12px] text-muted-foreground">{o.customerPhone}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{o.zoneName}</TableCell>
                <TableCell className="font-bold text-primary">{fmt(o.total)}</TableCell>
                <TableCell>
                  {o.verified ? (
                    <StatusBadge tone="success">Vérifié</StatusBadge>
                  ) : (
                    <StatusBadge tone="warning">À vérifier</StatusBadge>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge tone="info">{STATUS_LABEL[o.status]}</StatusBadge>
                </TableCell>
                <TableCell>
                  <RowActions label={o.orderNumber} disabled={pending}>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/commandes/${o.id}`}>
                        <IconEye size={15} />
                        Voir le détail
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={buildStatusWhatsAppLink({
                          phone: o.customerPhone,
                          name: o.customerName,
                          orderNumber: o.orderNumber,
                          status: o.status,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconBrandWhatsapp size={15} />
                        Prévenir sur WhatsApp
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!o.verified && (
                      <DropdownMenuItem
                        disabled={pending}
                        onSelect={() =>
                          setVerifying({
                            orderId: o.id,
                            orderNumber: o.orderNumber,
                            paymentLabel: o.paymentLabel,
                            transactionRef: o.transactionRef,
                            proofImageUrl: o.proofImageUrl,
                          })
                        }
                      >
                        <IconCheck size={15} />
                        Vérifier le paiement
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      disabled={pending || o.status === "RECEIVED"}
                      onSelect={() =>
                        startTransition(async () => {
                          await advanceStatusAction(o.id, -1);
                          toast("Statut mis à jour");
                        })
                      }
                    >
                      <IconArrowLeft size={15} />
                      Étape précédente
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={pending || o.status === "DELIVERED"}
                      onSelect={() =>
                        startTransition(async () => {
                          await advanceStatusAction(o.id, 1);
                          toast("Statut mis à jour");
                        })
                      }
                    >
                      <IconArrowRight size={15} />
                      Étape suivante
                    </DropdownMenuItem>
                  </RowActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PaymentVerifyDialog target={verifying} onOpenChange={(open) => !open && setVerifying(null)} />
    </>
  );
}
