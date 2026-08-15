import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ZONE_COOKIE = "cc_zone";

export async function getSelectedZone() {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { sortOrder: "asc" } });
  if (zones.length === 0) return null;

  const zoneId = (await cookies()).get(ZONE_COOKIE)?.value;
  const found = zoneId ? zones.find((z) => z.id === zoneId) : undefined;
  // Calavi Centre par défaut plutôt que le retrait ou la première zone de la
  // liste admin — c'est la zone la plus représentative du client type.
  const fallback = zones.find((z) => z.name.startsWith("Abomey-Calavi")) ?? zones[0];
  return { zones, selected: found ?? fallback };
}

/** À n'appeler que depuis une Server Action. */
export async function setSelectedZone(zoneId: string) {
  const store = await cookies();
  store.set(ZONE_COOKIE, zoneId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
