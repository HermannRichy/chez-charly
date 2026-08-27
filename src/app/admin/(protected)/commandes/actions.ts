"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { nextStatus, prevStatus, STATUS_PUSH_BODY } from "@/lib/order-status";
import { sendPushToUser } from "@/lib/push";
import { sendPaymentVerifiedEmail } from "@/lib/email";

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/admin/commandes");
  revalidatePath("/suivi");
}

export async function verifyPaymentAction(orderId: string) {
  await requireStaff();
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { verified: true },
    select: { userId: true, orderNumber: true, customerName: true, user: { select: { email: true } } },
  });
  revalidate();

  await sendPushToUser(order.userId, {
    title: `Commande ${order.orderNumber}`,
    body: "Paiement vérifié - votre commande est confirmée.",
    url: `/suivi/${order.orderNumber}`,
  });

  await sendPaymentVerifiedEmail({
    to: order.user.email,
    name: order.customerName,
    orderNumber: order.orderNumber,
  });
}

export async function advanceStatusAction(orderId: string, direction: 1 | -1) {
  await requireStaff();
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    select: { status: true, userId: true, orderNumber: true },
  });
  const status = direction === 1 ? nextStatus(order.status) : prevStatus(order.status);
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidate();

  await sendPushToUser(order.userId, {
    title: `Commande ${order.orderNumber}`,
    body: STATUS_PUSH_BODY[status],
    url: `/suivi/${order.orderNumber}`,
  });
}
