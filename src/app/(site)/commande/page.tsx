import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";
import { getSelectedZone } from "@/lib/zone";
import { getSettings, computeFee } from "@/lib/pricing";
import { requireClient } from "@/lib/session";
import { CheckoutFlow } from "@/components/site/CheckoutFlow";

export default async function CommandePage() {
  // proxy.ts protège déjà /commande, mais on revalide ici pour avoir le
  // profil (nom/téléphone/adresse) à préremplir dans le formulaire.
  const user = await requireClient("/commande");

  const [cart, zoneData, settings, paymentMethods] = await Promise.all([
    getCart(),
    getSelectedZone(),
    getSettings(),
    prisma.paymentMethod.findMany(),
  ]);

  if (cart.lines.length === 0) redirect("/panier");
  const zone = zoneData?.selected;
  if (!zone) redirect("/panier");

  const fee = computeFee(cart.subtotal, zone.fee, settings.freeFrom);
  const total = cart.subtotal + fee;

  return (
    <div className="max-w-225 mx-auto px-4 pt-[clamp(34px,6vw,56px)] pb-[clamp(56px,8vw,92px)]">
      <h1 className="font-grifter text-[clamp(36px,4.6vw,60px)] leading-[.94] text-ink">
        Paiement mobile money
      </h1>
      <p className="text-base text-[#6A392C] mt-3">
        Le transfert se fait depuis votre téléphone. Vous nous envoyez la référence, on valide, la
        cuisine démarre.
      </p>

      <CheckoutFlow
        total={total}
        zoneName={zone.name}
        paymentMethods={paymentMethods}
        initialCustomer={{
          name: user.name ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
        }}
      />
    </div>
  );
}
