"use client";

import { useTransition } from "react";
import { clearCartAction } from "@/app/(site)/actions";

export function ClearCartButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(clearCartAction)}
      className="border-0 bg-transparent text-text-tertiary-3 text-[13.5px] font-bold justify-self-start py-1.5 hover:text-deep disabled:opacity-60"
    >
      Vider le panier
    </button>
  );
}
