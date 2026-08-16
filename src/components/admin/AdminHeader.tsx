"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/commandes": "Commandes",
  "/admin/menu": "Menu",
  "/admin/menu/new": "Nouveau plat",
  "/admin/livraison": "Livraison",
  "/admin/fidelite": "Fidélité",
};

function resolveTitle(pathname: string): string {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;

  // Repli pour les pages [id] (ex. /admin/menu/abc123 -> "Menu").
  const prefixes = Object.keys(PAGE_TITLES)
    .filter((p) => p !== "/admin" && pathname.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length);
  if (prefixes[0]) return `Modifier - ${PAGE_TITLES[prefixes[0]]}`;

  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
