"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { requireStaff } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function revalidate() {
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
}

const menuItemSchema = z.object({
  name: z.string().trim().min(2, { message: "Nom trop court" }),
  price: z.coerce.number().int().positive({ message: "Prix invalide" }),
  category: z.string().trim().min(2, { message: "Catégorie requise" }),
  note: z.string().trim().max(200, { message: "Note trop longue" }).optional(),
  active: z.boolean(),
  featured: z.boolean(),
});

export type MenuItemFormInput = z.infer<typeof menuItemSchema>;

export async function getMenuItem(id: string) {
  await requireStaff();
  return prisma.menuItem.findUnique({ where: { id } });
}

export async function createMenuItemAction(input: MenuItemFormInput) {
  await requireStaff();
  const data = menuItemSchema.parse(input);
  const created = await prisma.menuItem.create({ data: { ...data, note: data.note ?? "" } });
  revalidate();
  redirect(`/admin/menu/${created.id}`);
}

export async function updateMenuItemAction(id: string, input: MenuItemFormInput) {
  await requireStaff();
  const data = menuItemSchema.parse(input);
  await prisma.menuItem.update({ where: { id }, data: { ...data, note: data.note ?? "" } });
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
  redirect("/admin/menu");
}
