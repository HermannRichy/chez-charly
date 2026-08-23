"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconDots, IconShare2, IconSquarePlus, IconDownload } from "@tabler/icons-react";

const SEEN_KEY = "cc_install_prompt_seen";
// Même clé que CookieBanner : on laisse le bandeau cookies passer en premier
// pour éviter d'empiler deux barres en bas d'écran à l'arrivée.
const COOKIE_CONSENT_KEY = "cc_cookie_consent";

/** Non standard (Chrome/Edge/Android uniquement) - absent du DOM lib TS. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export function InstallPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  // Chrome/Edge/Android : capturé tôt (l'événement ne se redéclenche pas),
  // rejoué au clic sur "Installer" plutôt que de laisser le navigateur
  // afficher sa propre mini-barre, peu visible.
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isStandalone()) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isStandalone()) return;
    if (!isIOS() && !deferredPrompt) return; // rien à proposer sans l'un ou l'autre
    if (localStorage.getItem(SEEN_KEY)) return;

    // Léger différé : laisse le temps au bandeau cookies (affiché
    // immédiatement) d'être traité avant de vérifier son statut, plutôt que
    // de dépendre d'un événement inter-composants.
    const timer = setTimeout(() => {
      if (localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [deferredPrompt]);

  if (pathname?.startsWith("/admin") || !visible) return null;

  function dismiss() {
    localStorage.setItem(SEEN_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-65 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="max-w-2xl mx-auto bg-ink text-cream rounded-[22px] shadow-[0_20px_44px_rgba(36,16,12,.34)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        {deferredPrompt ? (
          <>
            <p className="text-sm leading-relaxed flex-1">
              Installez Chez Charly sur votre appareil : accès plus rapide et notifications de commande.
            </p>
            <div className="flex gap-2.5 shrink-0">
              <button
                type="button"
                onClick={dismiss}
                className="text-cream/70 text-sm font-bold px-2 hover:text-cream"
              >
                Plus tard
              </button>
              <button
                type="button"
                onClick={install}
                className="bg-orange text-white px-6 py-3 rounded-full text-sm font-extrabold min-h-11 hover:bg-cream hover:text-deep"
              >
                <IconDownload size={15} className="inline -mt-0.5 mr-1.5" />
                Installer
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1">
              <p className="text-sm font-extrabold mb-1.5">Installez Chez Charly sur votre écran d&apos;accueil</p>
              <ol className="text-sm leading-relaxed text-cream/85 grid gap-0.5 list-decimal list-inside">
                <li>
                  Appuyez sur <IconDots size={15} className="inline -mt-0.5" /> en bas à droite
                </li>
                <li>
                  Appuyez sur <IconShare2 size={15} className="inline -mt-0.5" /> Partager
                </li>
                <li>
                  Faites défiler et choisissez <IconSquarePlus size={15} className="inline -mt-0.5" /> Sur
                  l&apos;écran d&apos;accueil
                </li>
                <li>Confirmez avec Ajouter</li>
              </ol>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 bg-orange text-white px-6 py-3 rounded-full text-sm font-extrabold min-h-11 hover:bg-cream hover:text-deep"
            >
              Compris
            </button>
          </>
        )}
      </div>
    </div>
  );
}
