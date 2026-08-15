"use client";

import { useState, useTransition } from "react";
import { updateZoneFeeAction, updateZoneEtaAction } from "@/app/admin/(protected)/livraison/actions";

export function AdminZoneRow({
  zone,
}: {
  zone: { id: string; name: string; fee: number; etaLabel: string; isPickup: boolean };
}) {
  const [fee, setFee] = useState(zone.fee.toString());
  const [eta, setEta] = useState(zone.etaLabel);
  const [, startTransition] = useTransition();

  return (
    <div className="bg-admin-surface border border-admin-text/9 rounded-2xl p-3.75 flex flex-wrap gap-2.5 gap-x-3.5 items-center">
      <div className="text-[15px] font-extrabold text-admin-text flex-1 min-w-37.5 flex items-center gap-2">
        {zone.name}
        {zone.isPickup && (
          <span className="text-[10px] font-extrabold text-admin-bg bg-[#6FE39B] px-1.75 py-0.5 rounded-full">
            RETRAIT
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          onBlur={() => Number(fee) !== zone.fee && startTransition(() => updateZoneFeeAction(zone.id, Number(fee)))}
          className="border border-admin-text/18 bg-admin-bg text-orange rounded-[10px] px-2.5 py-2.25 text-[15px] font-extrabold w-20.5 font-grifter"
        />
        <span className="text-[12.5px] text-admin-text-4">F</span>
      </div>
      <input
        value={eta}
        onChange={(e) => setEta(e.target.value)}
        onBlur={() => eta !== zone.etaLabel && startTransition(() => updateZoneEtaAction(zone.id, eta))}
        className="border border-admin-text/18 bg-admin-bg text-admin-text-2 rounded-[10px] px-2.5 py-2.25 text-[13.5px] flex-1 min-w-37.5"
      />
    </div>
  );
}
