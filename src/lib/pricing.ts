import { prisma } from "@/lib/prisma";
import type { CartLine } from "@/lib/cart";

/**
 * Calculs métier du README (§ Gestion d'état). Ce module est la seule source
 * de vérité pour l'argent — le client ne fait jamais ce calcul, il ne fait
 * que l'afficher.
 *
 *   sousTotal    = Σ (prix_article × quantité)
 *   frais        = sousTotal >= freeFrom ? 0 : zone.fee
 *   total        = sousTotal + frais
 *   pointsGagnés = floor(total / ptsPerUnit)
 */

export function computeSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function computeFee(subtotal: number, zoneFee: number, freeFrom: number): number {
  return subtotal >= freeFrom ? 0 : zoneFee;
}

export function computePoints(total: number, ptsPerUnit: number): number {
  return Math.floor(total / Math.max(1, ptsPerUnit));
}

export async function getSettings() {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;
  // Filet de sécurité si le seed n'a pas encore tourné : mêmes valeurs par
  // défaut que prisma/seed.ts, jamais codées en dur ailleurs que là et ici.
  return prisma.settings.create({ data: { id: "singleton", freeFrom: 10000, ptsPerUnit: 100 } });
}

/** Prochain palier de fidélité non encore atteint (ou le dernier si tous atteints). */
export function nextTier<T extends { threshold: number }>(tiers: T[], points: number): T | undefined {
  return tiers.find((t) => t.threshold > points) ?? tiers[tiers.length - 1];
}
