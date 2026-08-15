"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { fmt } from "@/lib/format";
import { STATUS_TRACK_LABEL, statusIndex } from "@/lib/order-status";

const TRACK: OrderStatus[] = ["RECEIVED", "PREPARING", "ON_THE_WAY", "DELIVERED"];

export function OrderTracking({
  orderNumber,
  itemsLabel,
  zoneName,
  zoneEta,
  initialStatus,
  initialTotal,
}: {
  orderNumber: string;
  itemsLabel: string;
  zoneName: string;
  zoneEta: string;
  initialStatus: OrderStatus;
  initialTotal: number;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [total, setTotal] = useState(initialTotal);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setStatus(data.status);
        setTotal(data.total);
      } catch {
        // Le prochain intervalle réessaiera — pas d'écran d'erreur pour un
        // simple raté de polling.
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [orderNumber]);

  const current = statusIndex(status);

  return (
    <div className="max-w-225 mx-auto px-4 pt-[clamp(34px,6vw,56px)] pb-[clamp(56px,8vw,92px)]">
      <div className="text-xs font-extrabold tracking-[.14em] text-deep">SUIVI DE COMMANDE</div>
      <h1 className="font-grifter text-[clamp(38px,5vw,64px)] leading-[.92] text-ink mt-3">
        {orderNumber} · {STATUS_TRACK_LABEL[status]}
      </h1>
      <p className="text-base text-[#6A392C] mt-3">
        {itemsLabel} — livraison {zoneName}, {zoneEta}.
      </p>

      <div className="bg-white border border-border-light rounded-[26px] p-[clamp(20px,4vw,30px)] mt-6.5">
        <div className="grid gap-0">
          {TRACK.map((step, i) => {
            const done = i <= current;
            const isCurrent = i === current;
            return (
              <div key={step} className="flex gap-4.5 items-start">
                <div className="grid justify-items-center gap-1">
                  <div
                    className={
                      isCurrent
                        ? "w-8.5 h-8.5 rounded-full bg-deep text-white grid place-items-center font-extrabold text-sm animate-pulse-ring"
                        : done
                          ? "w-8.5 h-8.5 rounded-full bg-orange text-white grid place-items-center font-extrabold text-sm"
                          : "w-8.5 h-8.5 rounded-full bg-border-light text-text-tertiary grid place-items-center font-extrabold text-sm"
                    }
                  >
                    {i + 1}
                  </div>
                  {i < TRACK.length - 1 && <div className="w-0.5 h-8.5 bg-border-mid" />}
                </div>
                <div className="pt-1.5">
                  <div className="text-base font-extrabold text-ink">{STATUS_TRACK_LABEL[step]}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mt-5.5 pt-5.5 border-t border-border-light flex-wrap">
          <div>
            <div className="text-xs font-extrabold tracking-[.1em] text-label">TOTAL PAYÉ</div>
            <div className="font-grifter text-[28px] text-deep">{fmt(total)}</div>
          </div>
          <a href="tel:+2290161555722" className="text-sm font-extrabold">
            Appeler le restaurant →
          </a>
        </div>
      </div>

      <div className="flex gap-3 mt-5.5 flex-wrap">
        <Link
          href="/fidelite"
          className="border-0 bg-ink text-cream px-6.5 py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep"
        >
          Voir mes points
        </Link>
        <Link
          href="/menu"
          className="border-[1.5px] border-border-mid-3 bg-transparent text-[#7A3A2A] px-6.5 py-3.75 rounded-full text-[15px] font-extrabold hover:border-deep hover:text-deep"
        >
          Commander autre chose
        </Link>
      </div>
    </div>
  );
}
