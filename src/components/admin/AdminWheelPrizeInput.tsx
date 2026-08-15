"use client";

import { useState, useTransition } from "react";
import { updateWheelPrizeAction } from "@/app/admin/(protected)/fidelite/actions";

export function AdminWheelPrizeInput({ prize }: { prize: { id: string; label: string } }) {
  const [label, setLabel] = useState(prize.label);
  const [, startTransition] = useTransition();

  return (
    <input
      value={label}
      onChange={(e) => setLabel(e.target.value)}
      onBlur={() => label !== prize.label && startTransition(() => updateWheelPrizeAction(prize.id, label))}
      className="border border-admin-text/18 bg-admin-bg text-admin-text rounded-[10px] px-3 py-2.5 text-[13.5px] w-full"
    />
  );
}
