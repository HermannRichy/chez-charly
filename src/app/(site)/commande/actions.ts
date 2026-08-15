"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { PaymentProvider } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCart, clearCart } from "@/lib/cart";
import { getSelectedZone } from "@/lib/zone";
import { getSettings, computeFee, computePoints } from "@/lib/pricing";
import { getSessionUser } from "@/lib/session";

const schema = z
  .object({
    customerName: z.string().trim().min(2, { message: "Votre nom est requis" }),
    customerPhone: z.string().trim().min(6, { message: "Numéro de téléphone invalide" }),
    address: z.string().trim().min(3, { message: "Adresse requise" }),
    paymentMethod: z.enum(["MOMO", "MOOV"]),
    transactionRef: z.string().trim().optional(),
    proofImageUrl: z.string().trim().optional(),
    note: z.string().trim().max(500, { message: "Message trop long (500 caractères max)" }).optional(),
  })
  .refine((d) => (d.transactionRef?.length ?? 0) > 3 || !!d.proofImageUrl, {
    message: "Renseignez la référence de la transaction ou joignez une capture.",
    path: ["transactionRef"],
  });

export type ConfirmOrderInput = z.infer<typeof schema>;

/**
 * Aucun paiement n'est traité sur la plateforme (README) : cette action ne
 * fait qu'enregistrer la commande et la preuve fournie par le client, puis
 * crédite les points sur le compte connecté. Le montant est entièrement
 * recalculé ici depuis le panier serveur (cookie IDs+quantités → prix relus
 * en base) et la zone sélectionnée — jamais lu depuis le formulaire.
 * La page /commande redirige déjà vers /login si personne n'est connecté ;
 * on revérifie ici car une Server Action reste appelable directement.
 */
export async function confirmOrderAction(
  input: ConfirmOrderInput,
): Promise<{ orderNumber: string }> {
  const user = await getSessionUser();
  if (!user) throw new Error("Connectez-vous pour passer commande.");

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
  }
  const data = parsed.data;

  const [cart, zoneData, settings] = await Promise.all([
    getCart(),
    getSelectedZone(),
    getSettings(),
  ]);

  if (cart.lines.length === 0) throw new Error("Votre panier est vide.");
  const zone = zoneData?.selected;
  if (!zone) throw new Error("Choisissez une zone de livraison.");

  const fee = computeFee(cart.subtotal, zone.fee, settings.freeFrom);
  const total = cart.subtotal + fee;
  const pointsAwarded = computePoints(total, settings.ptsPerUnit);

  const order = await prisma.$transaction(async (tx) => {
    const count = await tx.order.count();
    const orderNumber = `CC-${2419 + count}`;

    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        address: data.address,
        zoneId: zone.id,
        subtotal: cart.subtotal,
        deliveryFee: fee,
        total,
        paymentMethod: data.paymentMethod as PaymentProvider,
        transactionRef: data.transactionRef || "",
        proofImageUrl: data.proofImageUrl || null,
        note: data.note || "",
        verified: false,
        pointsAwarded,
        items: {
          create: cart.lines.map((l) => ({
            menuItemId: l.menuItemId,
            name: l.name,
            price: l.unitPrice,
            qty: l.quantity,
          })),
        },
      },
    });

    const before = user.points ?? 0;
    const after = before + pointsAwarded;

    const tiersCrossed = await tx.loyaltyTier.count({
      where: { threshold: { gt: before, lte: after } },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        points: after,
        spinsAvailable: { increment: tiersCrossed },
        // Garde le profil à jour pour préremplir le prochain checkout, sans
        // écraser le nom (celui du compte reste la source pour l'admin).
        phone: data.customerPhone,
        address: data.address,
      },
    });

    await tx.loyaltyTx.create({
      data: {
        userId: user.id,
        orderId: created.id,
        delta: pointsAwarded,
        reason: `Commande ${orderNumber}`,
      },
    });

    return created;
  });

  await clearCart();

  revalidatePath("/", "layout");
  revalidatePath("/panier");
  revalidatePath("/fidelite");
  revalidatePath("/admin");

  return { orderNumber: order.orderNumber };
}
