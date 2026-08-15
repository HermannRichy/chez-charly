"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function revalidate() {
  revalidatePath("/admin/livraison");
  revalidatePath("/panier");
  revalidatePath("/commande");
}

export async function updateZoneFeeAction(id: string, fee: number) {
  await requireStaff();
  await prisma.deliveryZone.update({ where: { id }, data: { fee: Math.round(fee) || 0 } });
  revalidate();
}

export async function updateZoneEtaAction(id: string, etaLabel: string) {
  await requireStaff();
  await prisma.deliveryZone.update({ where: { id }, data: { etaLabel } });
  revalidate();
}

export async function updateFreeFromAction(freeFrom: number) {
  await requireStaff();
  await prisma.settings.update({ where: { id: "singleton" }, data: { freeFrom: Math.round(freeFrom) || 0 } });
  revalidate();
}
