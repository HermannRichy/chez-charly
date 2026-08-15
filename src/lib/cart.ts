import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CART_COOKIE = "cc_cart";

const MAX_LINES = 50;
const MAX_QTY = 99;

/** Forme stockée en cookie : identifiant et quantité, rien de monétaire. */
interface StoredItem {
  id: string; // menuItemId
  q: number; // quantité
}

export interface CartLine {
  menuItemId: string;
  name: string;
  note: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
}

// ─── Cookie ───────────────────────────────────────────────────────────────────

async function readStoredItems(): Promise<StoredItem[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => typeof i?.id === "string" && Number.isInteger(i.q) && i.q > 0)
      .slice(0, MAX_LINES)
      .map((i) => ({ id: i.id, q: Math.min(i.q, MAX_QTY) }));
  } catch {
    // Cookie corrompu ou forgé : on repart d'un panier vide plutôt que de
    // faire échouer toutes les pages qui le lisent.
    return [];
  }
}

/** À n'appeler que depuis une Server Action : Next interdit l'écriture de cookies pendant le rendu. */
async function writeStoredItems(items: StoredItem[]) {
  const store = await cookies();
  if (items.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// ─── Hydratation ──────────────────────────────────────────────────────────────

/**
 * Reconstruit le panier depuis la base à chaque lecture : le prix vient
 * toujours de `MenuItem.price`, jamais du cookie. Un plat désactivé ou
 * supprimé entre-temps disparaît en silence de l'affichage (les quantités
 * du cookie restent, la ligne réapparaît si le plat est réactivé).
 */
export async function getCart(): Promise<Cart> {
  const stored = await readStoredItems();
  if (stored.length === 0) return { lines: [], itemCount: 0, subtotal: 0 };

  const items = await prisma.menuItem.findMany({
    where: { id: { in: stored.map((i) => i.id) }, active: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));

  const lines: CartLine[] = [];
  for (const s of stored) {
    const item = byId.get(s.id);
    if (!item) continue;
    lines.push({
      menuItemId: item.id,
      name: item.name,
      note: item.note,
      unitPrice: item.price,
      quantity: s.q,
      lineTotal: item.price * s.q,
    });
  }

  return {
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
  };
}

export async function getCartCount(): Promise<number> {
  const stored = await readStoredItems();
  return stored.reduce((sum, i) => sum + i.q, 0);
}

// ─── Mutations (server actions uniquement) ────────────────────────────────────

export async function addToCart(menuItemId: string) {
  const stored = await readStoredItems();
  const existing = stored.find((i) => i.id === menuItemId);
  if (existing) {
    existing.q = Math.min(existing.q + 1, MAX_QTY);
  } else {
    stored.push({ id: menuItemId, q: 1 });
  }
  await writeStoredItems(stored);
}

export async function decrementCart(menuItemId: string) {
  const stored = await readStoredItems();
  const existing = stored.find((i) => i.id === menuItemId);
  if (!existing) return;
  existing.q -= 1;
  await writeStoredItems(stored.filter((i) => i.q > 0));
}

export async function clearCart() {
  await writeStoredItems([]);
}
