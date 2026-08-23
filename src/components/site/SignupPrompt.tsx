"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const SEEN_KEY = "cc_signup_prompt_seen";
const DELAY_MS = 15000;

export function SignupPrompt() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [visible, setVisible] = useState(false);

  const excluded = pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (excluded || isPending || session?.user) return;
    if (typeof window === "undefined" || localStorage.getItem(SEEN_KEY)) return;

    const timer = setTimeout(() => {
      localStorage.setItem(SEEN_KEY, "1");
      setVisible(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [excluded, isPending, session?.user]);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-70 grid place-items-center px-5">
      <button
        type="button"
        aria-label="Fermer"
        onClick={() => setVisible(false)}
        className="absolute inset-0 bg-ink/45"
      />
      <div className="relative bg-white rounded-[22px] p-6 w-full max-w-[380px] text-center">
        <div className="font-grifter text-xl text-deep">Un compte, plus simple pour commander</div>
        <p className="text-sm text-text-secondary mt-2.5">
          Créez votre compte pour suivre vos commandes en temps réel et gagner des points fidélité à
          chaque achat.
        </p>
        <div className="grid gap-2.5 mt-6">
          <Link
            href="/signup"
            onClick={() => setVisible(false)}
            className="border-0 bg-orange text-white py-3.25 rounded-full text-sm font-extrabold hover:bg-deep"
          >
            Créer un compte
          </Link>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="border-0 bg-transparent text-text-tertiary-3 py-2 text-sm font-bold"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
