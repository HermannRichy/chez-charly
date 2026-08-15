"use client";

import { useTransition } from "react";
import { selectZoneAction } from "@/app/(site)/actions";
import { fmt } from "@/lib/format";

export function ZonePicker({
  zones,
  selectedId,
}: {
  zones: { id: string; name: string; fee: number; etaLabel: string }[];
  selectedId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-2">
      {zones.map((z) => {
        const active = z.id === selectedId;
        return (
          <button
            key={z.id}
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => selectZoneAction(z.id))}
            className="text-left border border-white/18 bg-white/6 text-cream rounded-[14px] px-3.5 py-2.75 flex items-center gap-2.5 hover:border-orange disabled:opacity-70"
          >
            <div className="flex-1">
              <div className="text-[13.5px] font-bold">{z.name}</div>
              <div className="text-[11.5px] text-[#C6A292]">{z.etaLabel}</div>
            </div>
            <span className="text-[13px] font-extrabold text-orange">{fmt(z.fee)}</span>
            {active && <span className="w-2.25 h-2.25 rounded-full bg-[#6FE39B]" />}
          </button>
        );
      })}
    </div>
  );
}
