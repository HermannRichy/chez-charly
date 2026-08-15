"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function revalidate() {
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
}

export async function addMenuItemAction(input: { name: string; price: number; category: string }) {
  await requireStaff();
  if (!input.name.trim() || !input.price) throw new Error("Nom et prix requis");

  await prisma.menuItem.create({
    data: { name: input.name.trim(), price: Math.round(input.price), category: input.category },
  });
  revalidate();
}

export async function updateMenuItemNameAction(id: string, name: string) {
  await requireStaff();
  await prisma.menuItem.update({ where: { id }, data: { name } });
  revalidate();
}

export async function updateMenuItemPriceAction(id: string, price: number) {
  await requireStaff();
  await prisma.menuItem.update({ where: { id }, data: { price: Math.round(price) || 0 } });
  revalidate();
}

export async function toggleMenuItemAction(id: string) {
  await requireStaff();
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id }, select: { active: true } });
  await prisma.menuItem.update({ where: { id }, data: { active: !item.active } });
  revalidate();
}

export async function setMenuItemPhotoAction(id: string, imageUrl: string) {
  await requireStaff();
  await prisma.menuItem.update({ where: { id }, data: { imageUrl } });
  revalidate();
}

export async function deleteMenuItemAction(id: string) {
  await requireStaff();
  await prisma.menuItem.delete({ where: { id } });
  revalidate();
}
