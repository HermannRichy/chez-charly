"use client";

import { useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChevronDown, IconX } from "@tabler/icons-react";

type NavItem = { href: string; label: string; icon?: ComponentType<{ size?: number }> };

/**
 * Menu mobile en bottom-sheet (même mécanique que MenuCategoryFilter :
 * portail vers document.body, plein écran depuis le bas) plutôt qu'une
 * rangée qui défile horizontalement. Utilisé par le compte client
 * (AccountSidebar) — le dashboard admin a sa propre sidebar shadcn, qui gère
 * son mode mobile nativement (Sheet intégré).
 */
export function NavSheet({ items, triggerLabel }: { items: NavItem[]; triggerLabel?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = items.find((i) => i.href === pathname);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between gap-2.5 border-[1.5px] border-border-mid-2 bg-white text-[#7A3A2A] px-4.5 py-3 rounded-full text-sm font-bold"
      >
        <span className="flex items-center gap-2">
          {active?.icon && <active.icon size={17} />}
          {triggerLabel ?? active?.label ?? "Menu"}
        </span>
        <IconChevronDown size={17} />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-70">
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/45"
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto bg-cream rounded-t-[26px] px-5 pt-3 pb-8">
              <div className="w-10 h-1.25 rounded-full bg-border-mid-2 mx-auto mb-4" />
              <div className="flex items-center justify-between mb-3.5">
                <div className="font-grifter text-xl text-deep">Navigation</div>
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
                {items.map((it) => {
                  const isActive = pathname === it.href;
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className={
                        isActive
                          ? "min-h-13 flex items-center gap-3 px-4 rounded-2xl bg-orange text-white text-[15px] font-extrabold"
                          : "min-h-13 flex items-center gap-3 px-4 rounded-2xl bg-white border border-border-light text-ink text-[15px] font-bold"
                      }
                    >
                      {it.icon && <it.icon size={18} />}
                      {it.label}
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
