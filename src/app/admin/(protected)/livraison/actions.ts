"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function revalidate() {
  revalidatePath("/admin/livraison");
  revalidatePath("/panier");
  revalidatePath("/commande");
}

export async function createZoneAction(data: { name: string; fee: number; etaLabel: string }) {
  await requireStaff();
  const last = await prisma.deliveryZone.aggregate({ _max: { sortOrder: true } });
  await prisma.deliveryZone.create({
    data: {
      name: data.name,
      fee: Math.round(data.fee) || 0,
      etaLabel: data.etaLabel,
      sortOrder: (last._max.sortOrder ?? -1) + 1,
    },
  });
  revalidate();
}

export async function updateZoneAction(id: string, data: { name?: string; fee?: number; etaLabel?: string }) {
  await requireStaff();
  await prisma.deliveryZone.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.fee !== undefined && { fee: Math.round(data.fee) || 0 }),
      ...(data.etaLabel !== undefined && { etaLabel: data.etaLabel }),
    },
  });
  revalidate();
}

export async function updateFreeFromAction(freeFrom: number) {
  await requireStaff();
  await prisma.settings.update({ where: { id: "singleton" }, data: { freeFrom: Math.round(freeFrom) || 0 } });
  revalidate();
}
