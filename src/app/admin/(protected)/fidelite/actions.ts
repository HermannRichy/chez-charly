"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function revalidate() {
  revalidatePath("/admin/fidelite");
  revalidatePath("/fidelite");
  revalidatePath("/");
  revalidatePath("/menu");
}

export async function updatePtsPerUnitAction(ptsPerUnit: number) {
  await requireStaff();
  await prisma.settings.update({
    where: { id: "singleton" },
    data: { ptsPerUnit: Math.max(1, Math.round(ptsPerUnit) || 1) },
  });
  revalidate();
}

export async function createTierAction(data: { name: string; threshold: number; reward: string }) {
  await requireStaff();
  const last = await prisma.loyaltyTier.aggregate({ _max: { sortOrder: true } });
  await prisma.loyaltyTier.create({
    data: {
      name: data.name,
      threshold: Math.round(data.threshold) || 0,
      reward: data.reward,
      sortOrder: (last._max.sortOrder ?? -1) + 1,
    },
  });
  revalidate();
}

export async function updateTierAction(id: string, data: { name?: string; threshold?: number; reward?: string }) {
  await requireStaff();
  await prisma.loyaltyTier.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.threshold !== undefined && { threshold: Math.round(data.threshold) || 0 }),
      ...(data.reward !== undefined && { reward: data.reward }),
    },
  });
  revalidate();
}

export async function updateWheelPrizeAction(id: string, label: string) {
  await requireStaff();
  await prisma.wheelPrize.update({ where: { id }, data: { label } });
  revalidate();
}
