"use client";

import { useState, useTransition } from "react";
import { updateFreeFromAction } from "@/app/admin/(protected)/livraison/actions";

export function AdminFreeFrom({ value }: { value: number }) {
  const [freeFrom, setFreeFrom] = useState(value.toString());
  const [, startTransition] = useTransition();

  return (
    <div className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-5.5">
      <div className="font-grifter text-xl text-orange">Livraison offerte</div>
      <p className="text-[13.5px] text-admin-text-3 leading-[1.55] mt-2 mb-4">
        Seuil au-delà duquel la livraison passe à zéro, toutes zones confondues.
      </p>
      <div className="flex items-center gap-2.5">
        <input
          value={freeFrom}
          onChange={(e) => setFreeFrom(e.target.value)}
          onBlur={() =>
            Number(freeFrom) !== value && startTransition(() => updateFreeFromAction(Number(freeFrom)))
          }
          className="border border-admin-text/18 bg-admin-bg text-orange rounded-xl px-3.5 py-3 text-xl font-extrabold w-32.5 font-grifter"
        />
        <span className="text-sm text-admin-text-3">F CFA</span>
      </div>
    </div>
  );
}
