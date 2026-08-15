import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";
import { getSettings } from "@/lib/pricing";
import { fmt } from "@/lib/format";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import { MenuLineControls } from "@/components/site/MenuLineControls";
import { MenuCategoryFilter } from "@/components/site/MenuCategoryFilter";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const activeCat = cat || "Tout";

  const [items, cart, settings] = await Promise.all([
    prisma.menuItem.findMany({ orderBy: { createdAt: "asc" } }),
    getCart(),
    getSettings(),
  ]);

  const qtyByItem = new Map(cart.lines.map((l) => [l.menuItemId, l.quantity]));

  const categories: string[] = [];
  for (const it of items) if (!categories.includes(it.category)) categories.push(it.category);

  const groups = categories
    .map((title) => ({ title, items: items.filter((it) => it.category === title) }))
    .filter((g) => activeCat === "Tout" || g.title === activeCat);

  return (
    <div className="max-w-310 mx-auto px-4 pt-[clamp(34px,6vw,56px)] pb-[clamp(56px,8vw,92px)]">
      <h1 className="font-grifter text-[clamp(44px,6vw,84px)] leading-[.9] text-deep">Liste de menu</h1>
      <p className="text-[17px] text-[#6A392C] mt-3.5">
        Prix en francs CFA. Chaque plat vous rapporte des points - 1 point par {fmt(settings.ptsPerUnit)}{" "}
        dépensés.
      </p>

      <div className="my-7.5">
        <MenuCategoryFilter categories={categories} activeCat={activeCat} />
      </div>

      <div className="hidden md:flex gap-2.25 flex-wrap mb-7.5 sticky top-18.5 z-40 bg-cream py-2.5 overflow-x-auto scrollbar-none">
        {["Tout", ...categories].map((c) => {
          const active = activeCat === c;
          const href = c === "Tout" ? "/menu" : `/menu?cat=${encodeURIComponent(c)}`;
          return (
            <Link
              key={c}
              href={href}
              className="border-[1.5px] border-border-mid-2 bg-white text-[#7A3A2A] px-4.25 py-2.5 rounded-full text-[13.5px] font-bold hover:border-orange hover:text-deep"
            >
              {c}
              {active && <span className="inline-block w-1.75 h-1.75 rounded-full bg-orange ml-2 align-middle" />}
            </Link>
          );
        })}
      </div>

      {groups.map((g) => (
        <div key={g.title} className="mb-13">
          <div className="inline-block bg-deep text-[#FFE7D8] font-grifter text-[22px] px-6.5 py-2.25 rounded-full">
            {g.title}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3.5 mt-5">
            {g.items.map((it) => {
              const qty = qtyByItem.get(it.id) ?? 0;
              return (
                <div
                  key={it.id}
                  className="bg-peach rounded-[20px] px-5 py-4.5 flex items-center gap-4 transition hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[15.5px] font-extrabold text-ink leading-snug">{it.name}</div>
                    {it.note && <div className="text-[12.5px] text-text-tertiary-2 mt-0.75">{it.note}</div>}
                    <div className="flex items-center gap-2.5 mt-2.25">
                      <span className="font-grifter text-[22px] text-deep">{fmt(it.price)}</span>
                      <span className="text-[11px] font-extrabold text-[#C25A1E] bg-orange/14 px-2.25 py-1 rounded-full">
                        +{Math.floor(it.price / settings.ptsPerUnit)} pts
                      </span>
                    </div>
                  </div>

                  {!it.active ? (
                    <div className="text-[11px] font-extrabold text-text-tertiary-3 border border-[#D8B4A0] px-2.75 py-1.5 rounded-full shrink-0">
                      ÉPUISÉ
                    </div>
                  ) : qty > 0 ? (
                    <MenuLineControls menuItemId={it.id} qty={qty} />
                  ) : (
                    <AddToCartButton menuItemId={it.id} name={it.name} size="md" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <Link
          href="/panier"
          className="border-0 bg-ink text-cream px-8.5 py-4.5 rounded-full text-base font-extrabold hover:bg-deep"
        >
          Voir mon panier ({cart.itemCount})
        </Link>
      </div>
    </div>
  );
}
