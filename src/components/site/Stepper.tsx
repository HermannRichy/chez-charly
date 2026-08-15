"use client";

import { useTransition } from "react";

/** Stepper − / qty / + réutilisé menu, panier — cibles tactiles 42px dans un conteneur padé (≥44px). */
export function Stepper({
  qty,
  onInc,
  onDec,
  dark = true,
}: {
  qty: number;
  onInc: () => Promise<void>;
  onDec: () => Promise<void>;
  dark?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={
        dark
          ? "flex items-center gap-2 bg-ink rounded-full p-1.25 shrink-0"
          : "flex items-center gap-2 bg-peach rounded-full p-1.25 shrink-0"
      }
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(onDec)}
        className={
          dark
            ? "border-0 w-10.5 h-10.5 rounded-full bg-white/16 text-cream text-xl leading-none disabled:opacity-50"
            : "border-0 w-10.5 h-10.5 rounded-full bg-white text-deep text-xl leading-none disabled:opacity-50"
        }
        aria-label="Retirer un"
      >
        −
      </button>
      <span
        className={
          dark
            ? "text-cream font-extrabold text-[15px] min-w-4 text-center"
            : "text-ink font-extrabold text-[15px] min-w-4 text-center"
        }
      >
        {qty}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(onInc)}
        className="border-0 w-10.5 h-10.5 rounded-full bg-orange text-white text-xl leading-none disabled:opacity-50"
        aria-label="Ajouter un"
      >
        +
      </button>
    </div>
  );
}
