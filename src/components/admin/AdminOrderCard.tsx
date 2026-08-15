"use client";

import { useTransition } from "react";
import type { OrderStatus, PaymentProvider } from "@prisma/client";
import { fmt } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-status";
import { verifyPaymentAction, advanceStatusAction } from "@/app/admin/(protected)/actions";

export function AdminOrderCard({
  order,
}: {
  order: {
    id: string;
    orderNumber: string;
    ageLabel: string;
    customerName: string;
    customerPhone: string;
    itemsLabel: string;
    zoneName: string;
    total: number;
    paymentMethod: PaymentProvider;
    transactionRef: string;
    note: string;
    verified: boolean;
    status: OrderStatus;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-4.5">
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4 items-center">
      <div>
        <div className="font-grifter text-xl text-admin-text">{order.orderNumber}</div>
        <div className="text-[11.5px] text-admin-text-4">{order.ageLabel}</div>
      </div>

      <div>
        <div className="text-[14.5px] font-extrabold text-admin-text">
          {order.customerName} · {order.customerPhone}
        </div>
        <div className="text-[13px] text-admin-text-3 mt-0.75">{order.itemsLabel}</div>
        <div className="text-[12.5px] text-admin-text-4 mt-0.75">{order.zoneName}</div>
      </div>

      <div>
        <div className="font-grifter text-[22px] text-orange">{fmt(order.total)}</div>
        <div className="text-[12.5px] text-admin-text-3">
          {order.paymentMethod === "MOMO" ? "MTN MoMo" : "Moov Money"} ·{" "}
          {order.transactionRef || "-"}
        </div>
        {order.verified ? (
          <span className="inline-block mt-1.5 text-[10.5px] font-extrabold text-admin-bg bg-[#6FE39B] px-2.25 py-1 rounded-full">
            PAIEMENT VÉRIFIÉ
          </span>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => verifyPaymentAction(order.id))}
            className="inline-block mt-1.5 border-0 text-admin-bg bg-amber px-2.5 py-1.25 rounded-full text-[10.5px] font-extrabold disabled:opacity-60"
          >
            VALIDER LE PAIEMENT
          </button>
        )}
      </div>

      <div className="grid gap-2 justify-items-end">
        <div className="text-xs font-extrabold text-[#FFD9C4] bg-orange/16 border border-orange/34 px-3.25 py-1.75 rounded-full">
          {STATUS_LABEL[order.status]}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={pending || order.status === "RECEIVED"}
            onClick={() => startTransition(() => advanceStatusAction(order.id, -1))}
            className="border border-admin-text/20 bg-transparent text-admin-text-2 w-8.5 h-8.5 rounded-[10px] text-[15px] disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            disabled={pending || order.status === "DELIVERED"}
            onClick={() => startTransition(() => advanceStatusAction(order.id, 1))}
            className="border-0 bg-orange text-white px-4 h-8.5 rounded-[10px] text-[13px] font-extrabold disabled:opacity-40"
          >
            Étape suivante
          </button>
        </div>
      </div>
    </div>

    {order.note && (
      <div className="mt-3.5 bg-amber/14 border border-amber/40 rounded-[14px] px-3.75 py-3">
        <div className="text-[10.5px] font-extrabold tracking-[.1em] text-amber">MESSAGE DU CLIENT</div>
        <div className="text-[13.5px] text-admin-text mt-1">{order.note}</div>
      </div>
    )}
    </div>
  );
}
