"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { addToCartAction } from "@/app/(site)/actions";

export function AddToCartButton({
  menuItemId,
  name,
  size = "sm",
}: {
  menuItemId: string;
  name?: string;
  size?: "sm" | "md";
}) {
  const [pending, startTransition] = useTransition();

  const dims = size === "md" ? "w-11 h-11 text-2xl" : "w-10 h-10 text-[22px]";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await addToCartAction(menuItemId);
          if (name) toast(`Ajouté · ${name}`);
        })
      }
      className={`border-0 bg-orange text-white ${dims} rounded-full font-bold leading-none disabled:opacity-60 hover:bg-deep shrink-0`}
      aria-label="Ajouter au panier"
    >
      +
    </button>
  );
}
