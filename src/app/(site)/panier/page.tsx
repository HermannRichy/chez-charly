import Link from "next/link";
import { getCart } from "@/lib/cart";
import { getSelectedZone } from "@/lib/zone";
import { getSettings, computeFee, computePoints } from "@/lib/pricing";
import { fmt } from "@/lib/format";
import { PlaceholderPhoto } from "@/components/site/PlaceholderPhoto";
import { MenuLineControls } from "@/components/site/MenuLineControls";
import { ClearCartButton } from "@/components/site/ClearCartButton";
import { ZonePicker } from "@/components/site/ZonePicker";

export default async function PanierPage() {
  const [cart, zoneData, settings] = await Promise.all([
    getCart(),
    getSelectedZone(),
    getSettings(),
  ]);

  const zone = zoneData?.selected;
  const fee = zone ? computeFee(cart.subtotal, zone.fee, settings.freeFrom) : 0;
  const total = cart.subtotal + fee;
  const gained = computePoints(total, settings.ptsPerUnit);

  return (
    <div className="max-w-265 mx-auto px-4 pt-[clamp(34px,6vw,56px)] pb-[clamp(56px,8vw,92px)]">
      <h1 className="font-grifter text-[clamp(38px,5vw,66px)] leading-[.92] text-ink">Mon panier</h1>

      {cart.lines.length === 0 ? (
        <div className="mt-8.5 bg-white border border-dashed border-border-mid-3 rounded-[26px] px-6.5 py-15.5 text-center">
          <div className="font-grifter text-2xl text-deep">Rien dedans pour l&apos;instant</div>
          <p className="text-[15.5px] text-[#7A4736] mt-2.5 mb-6.5">
            L&apos;attiéké poisson est prêt en cuisine.
          </p>
          <Link
            href="/menu"
            className="border-0 bg-orange text-white px-7 py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep"
          >
            Parcourir le menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5 mt-7.5 items-start">
          <div className="grid gap-3">
            {cart.lines.map((l) => (
              <div
                key={l.menuItemId}
                className="bg-white border border-border-light rounded-[20px] p-3.5 flex items-center flex-wrap gap-x-3.5 gap-y-3"
              >
                <PlaceholderPhoto
                  src={null}
                  alt={l.name}
                  className="w-15.5 h-15.5 rounded-[14px] shrink-0"
                />
                <div className="flex-1 min-w-35">
                  <div className="text-[15.5px] font-extrabold text-ink">{l.name}</div>
                  <div className="text-[13px] text-text-tertiary mt-0.75">{fmt(l.unitPrice)} l&apos;unité</div>
                </div>
                <MenuLineControls menuItemId={l.menuItemId} qty={l.quantity} dark={false} />
                <div className="font-grifter text-xl text-deep min-w-20 text-right ml-auto">
                  {fmt(l.lineTotal)}
                </div>
              </div>
            ))}
            <ClearCartButton />
          </div>

          <div className="bg-ink text-cream rounded-[26px] p-6.5 sticky top-25">
            <div className="text-xs font-extrabold tracking-[.14em] text-orange">RÉCAPITULATIF</div>
            <div className="grid gap-2.75 mt-4.5 text-[14.5px]">
              <div className="flex justify-between">
                <span className="text-[#D9B7A7]">Sous-total</span>
                <b>{fmt(cart.subtotal)}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-[#D9B7A7]">Livraison · {zone?.name ?? "—"}</span>
                <b>{fee === 0 ? "Offerte" : fmt(fee)}</b>
              </div>
              <div className="h-px bg-white/16" />
              <div className="flex justify-between items-baseline">
                <span className="text-[#D9B7A7]">Total</span>
                <span className="font-grifter text-[30px] text-orange">{fmt(total)}</span>
              </div>
            </div>

            <div className="mt-4 bg-orange/16 border border-orange/36 rounded-[14px] px-3.5 py-3 text-[13px] text-[#FFD9C4]">
              Cette commande vous rapporte <b className="text-white">+{gained} pts</b> · livraison
              offerte dès {fmt(settings.freeFrom)}
            </div>

            <div className="text-xs font-extrabold tracking-[.12em] text-label mt-5.5 mb-2.5">
              ZONE DE LIVRAISON
            </div>
            <ZonePicker zones={zoneData?.zones ?? []} selectedId={zone?.id ?? ""} />

            <Link
              href="/commande"
              className="w-full mt-5 border-0 bg-orange text-white py-4 rounded-full text-[15.5px] font-extrabold text-center block hover:bg-cream hover:text-deep"
            >
              Passer au paiement
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
