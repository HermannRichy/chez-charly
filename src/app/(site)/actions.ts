"use server";

import { revalidatePath } from "next/cache";
import * as cart from "@/lib/cart";
import { setSelectedZone } from "@/lib/zone";

function revalidateCartViews() {
  revalidatePath("/", "layout");
  revalidatePath("/menu");
  revalidatePath("/panier");
}

export async function addToCartAction(menuItemId: string) {
  await cart.addToCart(menuItemId);
  revalidateCartViews();
}

export async function decrementCartAction(menuItemId: string) {
  await cart.decrementCart(menuItemId);
  revalidateCartViews();
}

export async function clearCartAction() {
  await cart.clearCart();
  revalidateCartViews();
}

export async function selectZoneAction(zoneId: string) {
  await setSelectedZone(zoneId);
  revalidatePath("/panier");
  revalidatePath("/commande");
}
