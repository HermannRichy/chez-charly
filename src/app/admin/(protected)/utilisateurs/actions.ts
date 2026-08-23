"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type Role } from "@prisma/client";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function setUserRoleAction(userId: string, role: Role) {
  const staff = await requireStaff();
  if (staff.id === userId) throw new Error("Impossible de modifier son propre rôle.");

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/utilisateurs");
}

export async function deleteUserAction(userId: string) {
  const staff = await requireStaff();
  if (staff.id === userId) throw new Error("Impossible de supprimer son propre compte.");

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (err) {
    // P2003 : le compte a des commandes liées (historique conservé côté DB,
    // jamais supprimé silencieusement).
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      throw new Error("Impossible de supprimer : ce compte a des commandes associées.");
    }
    throw err;
  }

  revalidatePath("/admin/utilisateurs");
}
