"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { IconFilter, IconX } from "@tabler/icons-react";

export function MenuCategoryFilter({
  categories,
  activeCat,
}: {
  categories: string[];
  activeCat: string;
}) {
  const [open, setOpen] = useState(false);
  const options = ["Tout", ...categories];

  return (
    <div className="md:hidden sticky top-18.5 z-40 bg-cream py-2.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 border-[1.5px] border-border-mid-2 bg-white text-[#7A3A2A] px-4.5 py-3 rounded-full text-sm font-bold"
      >
        <IconFilter size={18} />
        Filtrer : <span className="text-deep">{activeCat}</span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-70">
            <button
              type="button"
              aria-label="Fermer le filtre"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/45"
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto bg-cream rounded-t-[26px] px-5 pt-3 pb-8">
              <div className="w-10 h-1.25 rounded-full bg-border-mid-2 mx-auto mb-4" />
              <div className="flex items-center justify-between mb-3.5">
                <div className="font-grifter text-xl text-deep">Filtrer par catégorie</div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="w-9 h-9 grid place-items-center rounded-full border border-border-mid-3 text-[#5A2A1E]"
                >
                  <IconX size={18} />
                </button>
              </div>

              <div className="grid gap-1.5">
                {options.map((c) => {
                  const active = activeCat === c;
                  const href = c === "Tout" ? "/menu" : `/menu?cat=${encodeURIComponent(c)}`;
                  return (
                    <Link
                      key={c}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={
                        active
                          ? "min-h-13 flex items-center justify-between px-4 rounded-2xl bg-orange text-white text-[15px] font-extrabold"
                          : "min-h-13 flex items-center justify-between px-4 rounded-2xl bg-white border border-border-light text-ink text-[15px] font-bold"
                      }
                    >
                      {c}
                      {active && <span className="w-2 h-2 rounded-full bg-white" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
