"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { clearCartAction } from "@/app/(site)/actions";

export function ClearCartButton() {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="border-0 bg-transparent text-text-tertiary-3 text-[13.5px] font-bold justify-self-start py-1.5 hover:text-deep"
      >
        Vider le panier
      </button>

      {confirming &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-70 grid place-items-center px-5">
            <button
              type="button"
              aria-label="Annuler"
              onClick={() => setConfirming(false)}
              className="absolute inset-0 bg-ink/45"
            />
            <div className="relative bg-white rounded-[22px] p-6 w-full max-w-[360px] text-center">
              <div className="font-grifter text-xl text-deep">Vider le panier ?</div>
              <p className="text-sm text-text-secondary mt-2.5">
                Tous les articles seront retirés. Cette action ne peut pas être annulée.
              </p>
              <div className="grid gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      await clearCartAction();
                      setConfirming(false);
                    })
                  }
                  disabled={pending}
                  className="border-0 bg-deep text-white py-3.25 rounded-full text-sm font-extrabold disabled:opacity-60"
                >
                  {pending ? "Vidage…" : "Oui, vider le panier"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={pending}
                  className="border-0 bg-transparent text-text-tertiary-3 py-2 text-sm font-bold"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
