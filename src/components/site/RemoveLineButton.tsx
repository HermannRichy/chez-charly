"use client";

import { useTransition } from "react";
import { IconTrash } from "@tabler/icons-react";
import { removeFromCartAction } from "@/app/(site)/actions";

export function RemoveLineButton({ menuItemId }: { menuItemId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => removeFromCartAction(menuItemId))}
      aria-label="Retirer cet article du panier"
      className="border-0 bg-transparent w-11 h-11 grid place-items-center rounded-full text-[#B71D29] hover:bg-[#B71D29]/10 disabled:opacity-50 shrink-0"
    >
      <IconTrash size={19} stroke={2} />
    </button>
  );
}
