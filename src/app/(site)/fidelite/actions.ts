"use server";

import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { sendPushToUser, sendPushToStaff } from "@/lib/push";
import { sendWheelPrizeEmail, sendWheelPrizeStaffEmail } from "@/lib/email";

/**
 * Le tirage doit être décidé côté serveur (README) : le client ne fait
 * qu'animer la roue jusqu'à l'angle correspondant à l'index renvoyé ici —
 * sinon le résultat serait manipulable dans le navigateur.
 */
export async function spinAction(): Promise<{ prizeIndex: number; prizeLabel: string }> {
  const user = await getSessionUser();
  if (!user) throw new Error("Connectez-vous pour tourner la roue.");

  const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { spinsAvailable: true } });
  if (!fresh || fresh.spinsAvailable < 1) throw new Error("Aucun tour disponible.");

  const prizes = await prisma.wheelPrize.findMany({ orderBy: { sortOrder: "asc" } });
  if (prizes.length === 0) throw new Error("La roue n'est pas configurée.");

  const index = randomInt(prizes.length);

  await prisma.user.update({
    where: { id: user.id },
    data: { spinsAvailable: { decrement: 1 } },
  });

  revalidatePath("/fidelite");

  const prizeLabel = prizes[index].label;

  await sendPushToUser(user.id, {
    title: "Vous avez gagné à la roue !",
    body: prizeLabel,
    url: "/fidelite",
  });

  await sendWheelPrizeEmail({ to: user.email, name: user.name, prizeLabel });

  await sendPushToStaff({
    title: "Lot de roue à préparer",
    body: `${user.name} a gagné « ${prizeLabel} »`,
    url: "/admin/utilisateurs",
  });

  await sendWheelPrizeStaffEmail({ customerName: user.name, prizeLabel });

  return { prizeIndex: index, prizeLabel };
}
