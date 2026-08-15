"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function doLogout() {
    startTransition(async () => {
      await signOut();
      setConfirming(false);
      router.push("/");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={
          className ??
          "w-full border-[1.5px] border-deep bg-transparent text-deep px-5 py-3.25 rounded-full text-sm font-extrabold hover:bg-deep hover:text-white"
        }
      >
        Se déconnecter
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
              <div className="font-grifter text-xl text-deep">Se déconnecter ?</div>
              <p className="text-sm text-text-secondary mt-2.5">
                Vous devrez vous reconnecter pour commander ou voir vos points.
              </p>
              <div className="grid gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={doLogout}
                  disabled={pending}
                  className="border-0 bg-deep text-white py-3.25 rounded-full text-sm font-extrabold disabled:opacity-60"
                >
                  {pending ? "Déconnexion…" : "Oui, me déconnecter"}
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
