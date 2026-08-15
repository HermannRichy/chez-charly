"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { nextStatus, prevStatus } from "@/lib/order-status";

export async function verifyPaymentAction(orderId: string) {
  await requireStaff();
  await prisma.order.update({ where: { id: orderId }, data: { verified: true } });
  revalidatePath("/admin");
}

export async function advanceStatusAction(orderId: string, direction: 1 | -1) {
  await requireStaff();
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, select: { status: true } });
  const status = direction === 1 ? nextStatus(order.status) : prevStatus(order.status);
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/suivi");
}
