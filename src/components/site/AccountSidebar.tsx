"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconUser,
  IconReceipt2,
  IconGift,
  IconTruckDelivery,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Avatar } from "@/components/site/Avatar";
import { NavSheet } from "@/components/site/NavSheet";

const LINKS = [
  { href: "/compte", label: "Mon compte", icon: IconUser },
  { href: "/compte/commandes", label: "Historique commandes", icon: IconReceipt2 },
  { href: "/fidelite", label: "Fidélité", icon: IconGift },
  { href: "/suivi", label: "Suivi", icon: IconTruckDelivery },
];

export function AccountSidebar({
  name,
  email,
  isStaff,
}: {
  name: string;
  email: string;
  isStaff: boolean;
}) {
  const pathname = usePathname();
  const links = isStaff ? [...LINKS, { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard }] : LINKS;

  return (
    <>
      {/* Mobile : bouton qui ouvre un menu en bottom-sheet (même mécanique
          que le filtre du menu), pas une rangée qui défile horizontalement. */}
      <div className="md:hidden sticky top-18.5 z-40 bg-cream -mx-4 px-4 py-2.5 border-b border-border-light">
        <NavSheet items={links} />
      </div>

      {/* Desktop : sidebar fixe, sticky sous le header. */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-25 grid gap-4">
          <div className="bg-white border border-border-light rounded-[22px] p-4.5 flex items-center gap-3">
            <Avatar name={name} />
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-ink truncate">{name}</div>
              <div className="text-xs text-text-tertiary truncate">{email}</div>
            </div>
          </div>

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
                      : "flex items-center gap-3 px-4 py-3 rounded-2xl text-[#5A2A1E] text-sm font-bold hover:bg-white"
                  }
                >
                  <l.icon size={18} />
                  {l.label}
                </Link>
              );
            })}
            {isStaff && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-deep text-sm font-extrabold hover:bg-white"
              >
                <IconLayoutDashboard size={18} />
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
