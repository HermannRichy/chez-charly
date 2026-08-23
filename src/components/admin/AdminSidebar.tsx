"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconReceipt2,
  IconToolsKitchen2,
  IconTruckDelivery,
  IconGift,
  IconUsers,
  IconArrowLeft,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/site/Avatar";
import { LogoutButton } from "@/components/site/LogoutButton";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: IconLayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: IconReceipt2 },
  { href: "/admin/menu", label: "Menu", icon: IconToolsKitchen2 },
  { href: "/admin/livraison", label: "Livraison", icon: IconTruckDelivery },
  { href: "/admin/fidelite", label: "Fidélité", icon: IconGift },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: IconUsers },
];

// SidebarMenuButton pose `data-active={isActive}`, et React ne retire jamais
// un attribut data-* booléen : l'attribut vaut littéralement "true" OU
// "false", mais existe toujours dans le DOM. Or la classe interne du
// composant (`data-active:bg-sidebar-accent`, dans src/components/ui/sidebar.tsx)
// matche par simple présence de l'attribut — elle s'appliquait donc à TOUS
// les items, actifs ou non. `data-[active=false]:!bg-transparent` neutralise
// ce fond par défaut du vendor ; `data-[active=true]:!bg-primary` pose le
// fond orange marque uniquement sur l'item réellement actif.
const ACTIVE_CLASSES =
  "data-[active=false]:bg-transparent! data-[active=true]:bg-primary! data-[active=true]:text-primary-foreground! data-[active=true]:hover:bg-primary/90!";

export function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-1.5">
          <Image
            src="/logo-charly.png"
            alt="Chez Charly"
            height={32}
            width={32}
            className="h-8 w-auto shrink-0 brightness-0 invert opacity-90"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-[13px] font-extrabold leading-tight">Chez Charly</div>
            <div className="text-[10px] font-bold text-sidebar-foreground/60 tracking-[.1em]">DASHBOARD</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label} className={ACTIVE_CLASSES}>
                      <Link href={item.href}>
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="text-[13px] font-bold text-sidebar-foreground truncate">{user.name}</div>
            <div className="text-[11px] text-sidebar-foreground/60 truncate">{user.email}</div>
          </div>
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Voir le site client" className="data-[active=false]:bg-transparent!">
              <Link href="/">
                <IconArrowLeft size={16} />
                <span>Voir le site client</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 group-data-[collapsible=icon]:hidden">
          <LogoutButton className="w-full h-8 rounded-md border border-sidebar-border bg-transparent text-sidebar-foreground/80 text-xs font-bold hover:bg-sidebar-accent" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
