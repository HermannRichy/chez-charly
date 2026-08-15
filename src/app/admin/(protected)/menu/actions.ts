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

export async function updateMenuItemNoteAction(id: string, note: string) {
  await requireStaff();
  await prisma.menuItem.update({ where: { id }, data: { note } });
  revalidate();
}

export async function toggleMenuItemAction(id: string) {
  await requireStaff();
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id }, select: { active: true } });
  await prisma.menuItem.update({ where: { id }, data: { active: !item.active } });
  revalidate();
}

export async function toggleFeaturedAction(id: string) {
  await requireStaff();
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id }, select: { featured: true } });
  await prisma.menuItem.update({ where: { id }, data: { featured: !item.featured } });
  revalidate();
}

/** Ajoute une photo à la fin de la galerie — la première reste la photo principale. */
export async function addMenuItemImageAction(id: string, url: string) {
  await requireStaff();
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id }, select: { images: true } });
  await prisma.menuItem.update({ where: { id }, data: { images: [...item.images, url] } });
  revalidate();
}

export async function removeMenuItemImageAction(id: string, url: string) {
  await requireStaff();
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id }, select: { images: true } });
  await prisma.menuItem.update({
    where: { id },
    data: { images: item.images.filter((i) => i !== url) },
  });
  revalidate();
}

/** Remonte une photo existante en première position (= photo principale). */
export async function setPrimaryImageAction(id: string, url: string) {
  await requireStaff();
  const item = await prisma.menuItem.findUniqueOrThrow({ where: { id }, select: { images: true } });
  await prisma.menuItem.update({
    where: { id },
    data: { images: [url, ...item.images.filter((i) => i !== url)] },
  });
  revalidate();
}

export async function deleteMenuItemAction(id: string) {
  await requireStaff();
  await prisma.menuItem.delete({ where: { id } });
  revalidate();
}
