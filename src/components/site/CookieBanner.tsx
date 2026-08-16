"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "cc_cookie_consent";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  if (pathname?.startsWith("/admin") || !visible) return null;

  function accept() {
    localStorage.setItem(CONSENT_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-65 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="max-w-2xl mx-auto bg-ink text-cream rounded-[22px] shadow-[0_20px_44px_rgba(36,16,12,.34)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm leading-relaxed flex-1">
          On utilise uniquement des cookies nécessaires au fonctionnement du site (panier,
          connexion) - aucun traceur publicitaire. En continuant, vous acceptez nos{" "}
          <Link href="/conditions-utilisation" className="underline hover:text-orange">
            conditions d&apos;utilisation
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 bg-orange text-white px-6 py-3 rounded-full text-sm font-extrabold min-h-11 hover:bg-cream hover:text-deep"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
