import webpush, { WebPushError } from "web-push";
import { prisma } from "@/lib/prisma";

// Sujet requis par la spec VAPID (contact en cas d'abus signalé par un
// service de push) : on réutilise l'email du restaurant déjà présent en env.
webpush.setVapidDetails(
  `mailto:${process.env.SEED_STAFF_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string },
) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  if (subs.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body,
        );
      } catch (err) {
        // 404/410 : abonnement expiré ou révoqué côté navigateur, on le retire.
        if (err instanceof WebPushError && (err.statusCode === 404 || err.statusCode === 410)) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    }),
  );
}
