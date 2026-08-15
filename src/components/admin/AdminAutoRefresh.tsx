"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Pas de websocket sur un hébergement serverless (README : "temps réel
 * souhaitable" côté dashboard) : on rafraîchit la route serveur (RSC) à
 * intervalle régulier plutôt que de dupliquer le rendu de la liste de
 * commandes côté client via une API de polling séparée.
 */
export function AdminAutoRefresh({ intervalMs = 6000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);

  return null;
}
