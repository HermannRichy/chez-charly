"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function setUserRoleAction(userId: string, role: Role) {
  const staff = await requireStaff();
  if (staff.id === userId) throw new Error("Impossible de modifier son propre rôle.");

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/utilisateurs");
}
