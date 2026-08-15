"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/evenements", label: "Événements" },
  { href: "/fidelite", label: "Fidélité" },
  { href: "/suivi", label: "Suivi" },
];

export function Header({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-[60] bg-cream/86 backdrop-blur-md border-b border-[#F0D6C4]">
      <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center gap-x-[18px] gap-y-2.5 flex-wrap">
        <Link href="/" className="-my-1.5 shrink-0">
          <Image
            src="/logo-charly.png"
            alt="Chez Charly"
            height={54}
            width={220}
            className="h-[clamp(40px,8vw,54px)] w-auto"
            priority
          />
        </Link>

        <nav className="flex gap-0.5 ml-auto overflow-x-auto max-w-full [scrollbar-width:none]">
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
          href="/admin"
          className="border-[1.5px] border-[#E0BFAC] bg-transparent text-[#7A3A2A] px-3.5 py-2.5 rounded-full text-[13px] font-bold hover:border-deep hover:text-deep"
        >
          Dashboard
        </Link>

        <Link
          href="/panier"
          className="border-0 bg-ink text-cream px-[18px] py-2.5 rounded-full text-[13.5px] font-extrabold flex items-center gap-2.5 hover:bg-deep"
        >
          Panier
          <span className="bg-orange text-white min-w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-xs">
            {cartCount}
          </span>
        </Link>
      </div>
    </div>
  );
}
