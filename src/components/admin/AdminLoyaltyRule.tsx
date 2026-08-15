"use client";

import { useState, useTransition } from "react";
import { updatePtsPerUnitAction } from "@/app/admin/(protected)/fidelite/actions";

export function AdminLoyaltyRule({ value }: { value: number }) {
  const [ptsPerUnit, setPtsPerUnit] = useState(value.toString());
  const [, startTransition] = useTransition();

  return (
    <div className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-5.5">
      <div className="font-grifter text-xl text-orange">Règle d&apos;attribution</div>
      <div className="flex items-center gap-3 mt-3.5 flex-wrap">
        <span className="text-[14.5px] text-admin-text-2">1 point pour chaque</span>
        <input
          value={ptsPerUnit}
          onChange={(e) => setPtsPerUnit(e.target.value)}
          onBlur={() =>
            Number(ptsPerUnit) !== value &&
            startTransition(() => updatePtsPerUnitAction(Number(ptsPerUnit)))
          }
          className="border border-admin-text/18 bg-admin-bg text-orange rounded-xl px-3 py-2.5 text-[19px] font-extrabold w-25 font-grifter"
        />
        <span className="text-[14.5px] text-admin-text-2">F dépensés</span>
      </div>
    </div>
  );
}
