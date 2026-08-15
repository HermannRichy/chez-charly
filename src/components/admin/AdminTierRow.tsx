"use client";

import { useState, useTransition } from "react";
import { updateTierAction } from "@/app/admin/(protected)/fidelite/actions";

export function AdminTierRow({ tier }: { tier: { id: string; name: string; threshold: number; reward: string } }) {
  const [name, setName] = useState(tier.name);
  const [threshold, setThreshold] = useState(tier.threshold.toString());
  const [reward, setReward] = useState(tier.reward);
  const [, startTransition] = useTransition();

  return (
    <div className="bg-admin-surface border border-admin-text/9 rounded-2xl p-3.75 flex flex-wrap gap-2.5 gap-x-3 items-center">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name !== tier.name && startTransition(() => updateTierAction(tier.id, { name }))}
        className="border border-admin-text/18 bg-admin-bg text-admin-text rounded-[10px] px-2.5 py-2.25 text-sm font-extrabold flex-1 min-w-32.5"
      />
      <div className="flex items-center gap-1.75">
        <input
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          onBlur={() =>
            Number(threshold) !== tier.threshold &&
            startTransition(() => updateTierAction(tier.id, { threshold: Number(threshold) }))
          }
          className="border border-admin-text/18 bg-admin-bg text-orange rounded-[10px] px-2.5 py-2.25 text-[15px] font-extrabold w-16.5 font-grifter"
        />
        <span className="text-xs text-admin-text-4">pts</span>
      </div>
      <input
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        onBlur={() => reward !== tier.reward && startTransition(() => updateTierAction(tier.id, { reward }))}
        placeholder="Lot à définir"
        className="border border-admin-text/18 bg-admin-bg text-admin-text-2 rounded-[10px] px-2.5 py-2.25 text-[13.5px] flex-1 min-w-37.5"
      />
    </div>
  );
}
