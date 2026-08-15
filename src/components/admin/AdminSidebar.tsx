"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconReceipt2, IconToolsKitchen2, IconTruckDelivery, IconGift, IconArrowLeft } from "@tabler/icons-react";
import { NavSheet } from "@/components/site/NavSheet";

const LINKS = [
  { href: "/admin", label: "Commandes", icon: IconReceipt2 },
  { href: "/admin/menu", label: "Menu", icon: IconToolsKitchen2 },
  { href: "/admin/livraison", label: "Livraison", icon: IconTruckDelivery },
  { href: "/admin/fidelite", label: "Fidélité", icon: IconGift },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile : menu en bottom-sheet, pas de rangée qui défile ou se replie. */}
      <div className="md:hidden">
        <NavSheet items={LINKS} theme="admin" />
      </div>

      {/* Desktop : sidebar fixe, sticky. */}
      <aside className="hidden md:block w-60 shrink-0">
        <div className="sticky top-8 grid gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo-charly.png"
              alt="Chez Charly"
              height={40}
              width={40}
              className="h-10 w-auto brightness-0 invert opacity-90"
            />
            <div>
              <div className="text-[13px] font-extrabold text-admin-text leading-tight">Chez Charly</div>
              <div className="text-[10.5px] font-bold text-admin-text-4 tracking-[.1em]">DASHBOARD</div>
            </div>
          </Link>

          <nav className="grid gap-1">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    active
                      ? "flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange text-white text-sm font-extrabold"
                      : "flex items-center gap-3 px-4 py-3 rounded-2xl text-admin-text-2 text-sm font-bold hover:bg-admin-surface"
                  }
                >
                  <l.icon size={18} />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-admin-text-3 text-[13px] font-bold hover:bg-admin-surface hover:text-admin-text"
          >
            <IconArrowLeft size={16} />
            Voir le site client
          </Link>
        </div>
      </aside>
    </>
  );
}
