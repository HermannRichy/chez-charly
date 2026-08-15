import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Polling léger pour /suivi/[id] : pas de websocket sur un hébergement
 * serverless, le client refait cette requête toutes les 4-5 s (voir
 * OrderTracking.tsx) pour refléter les changements faits depuis l'admin.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber: id },
    select: { status: true, verified: true, total: true },
  });

  if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  return NextResponse.json(order);
}
