"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Commandes" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/livraison", label: "Livraison" },
  { href: "/admin/fidelite", label: "Fidélité" },
];

export function AdminNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 my-7.5 flex-wrap">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={
              active
                ? "border border-orange bg-orange/12 text-orange px-5 py-2.75 rounded-full text-[13.5px] font-extrabold"
                : "border border-admin-text/16 bg-transparent text-admin-text-2 px-5 py-2.75 rounded-full text-[13.5px] font-extrabold hover:border-orange hover:text-orange"
            }
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
