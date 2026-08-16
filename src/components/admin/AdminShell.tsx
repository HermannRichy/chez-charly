import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-background text-foreground">
      <AdminSidebar user={user} />
      {/* min-w-0 : sans ça, un enfant flex large (ex. un tableau) peut forcer
          toute la colonne de contenu à s'élargir au lieu de scroller dans
          son propre conteneur (TableCard) - la page entière se met alors à
          défiler sur le côté sur mobile. */}
      <SidebarInset className="min-w-0">
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-5 p-5 md:p-6 min-w-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
