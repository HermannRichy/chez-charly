"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { nextStatus, prevStatus } from "@/lib/order-status";

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/admin/commandes");
  revalidatePath("/suivi");
}

export async function verifyPaymentAction(orderId: string) {
  await requireStaff();
  await prisma.order.update({ where: { id: orderId }, data: { verified: true } });
  revalidate();
}

export async function advanceStatusAction(orderId: string, direction: 1 | -1) {
  await requireStaff();
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, select: { status: true } });
  const status = direction === 1 ? nextStatus(order.status) : prevStatus(order.status);
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidate();
}
