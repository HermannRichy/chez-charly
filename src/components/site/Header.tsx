"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconMenu2, IconX } from "@tabler/icons-react";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/evenements", label: "Événements" },
  { href: "/fidelite", label: "Fidélité" },
  { href: "/suivi", label: "Suivi" },
];

export function Header({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[60] bg-cream/86 backdrop-blur-md border-b border-[#F0D6C4]">
      <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center gap-x-[18px] gap-y-2.5">
        <Link href="/" className="-my-1.5 shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo-charly.png"
            alt="Chez Charly"
            height={54}
            width={220}
            className="h-[clamp(40px,8vw,54px)] w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-0.5 ml-auto overflow-x-auto max-w-full scrollbar-none">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="border-0 bg-transparent px-3 pt-3 pb-2.5 text-sm whitespace-nowrap min-h-11 grid gap-1 justify-items-center font-bold tracking-[.01em] text-[#5A2A1E] hover:text-deep"
              >
                {n.label}
                {active && <span className="h-[3px] w-full rounded-full bg-orange" />}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/panier"
          className="ml-auto md:ml-0 border-0 bg-ink text-cream px-4.5 py-2.5 rounded-full text-[13.5px] font-extrabold flex items-center gap-2.5 hover:bg-deep shrink-0"
        >
          Panier
          <span className="bg-orange text-white min-w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-xs">
            {cartCount}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="md:hidden shrink-0 w-11 h-11 grid place-items-center border border-border-mid-3 rounded-full text-[#5A2A1E]"
        >
          {open ? <IconX size={22} /> : <IconMenu2 size={22} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[#F0D6C4] px-4 py-2 flex flex-col">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={
                  active
                    ? "min-h-11 flex items-center text-[15px] font-extrabold text-deep"
                    : "min-h-11 flex items-center text-[15px] font-bold text-[#5A2A1E]"
                }
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
