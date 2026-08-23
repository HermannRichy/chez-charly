"use server";

import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function subscribePushAction(sub: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const user = await getSessionUser();
  if (!user) throw new Error("Non connecté.");

  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: { userId: user.id, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    create: {
      userId: user.id,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  });
}

export async function unsubscribePushAction(endpoint: string) {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
}
