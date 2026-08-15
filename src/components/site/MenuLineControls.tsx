"use client";

import { Stepper } from "@/components/site/Stepper";
import { addToCartAction, decrementCartAction } from "@/app/(site)/actions";

export function MenuLineControls({
  menuItemId,
  qty,
  dark = true,
}: {
  menuItemId: string;
  qty: number;
  dark?: boolean;
}) {
  return (
    <Stepper
      qty={qty}
      dark={dark}
      onInc={() => addToCartAction(menuItemId)}
      onDec={() => decrementCartAction(menuItemId)}
    />
  );
}
