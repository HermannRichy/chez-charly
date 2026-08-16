"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { IconEdit, IconStarFilled, IconTrash, IconToolsKitchen2 } from "@tabler/icons-react";
import { fmt } from "@/lib/format";
import { RowActions } from "@/components/admin/ui/row-actions";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  toggleMenuItemAction,
  toggleFeaturedAction,
  deleteMenuItemAction,
} from "@/app/admin/(protected)/menu/actions";

export type MenuRow = {
  id: string;
  name: string;
  price: number;
  category: string;
  active: boolean;
  featured: boolean;
  images: string[];
};

export function MenuTable({ items }: { items: MenuRow[] }) {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<MenuRow | null>(null);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={IconToolsKitchen2}
        title="Aucun plat pour l'instant"
        description="Ajoute le premier plat du menu."
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Plat</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
                  {item.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  )}
                  {item.featured && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 grid place-items-center rounded-full bg-primary text-primary-foreground">
                      <IconStarFilled size={9} />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Link href={`/admin/menu/${item.id}`} className="font-bold text-foreground hover:text-primary">
                  {item.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.category}</TableCell>
              <TableCell className="font-bold text-primary">{fmt(item.price)}</TableCell>
              <TableCell>
                {item.active ? (
                  <StatusBadge tone="success">Disponible</StatusBadge>
                ) : (
                  <StatusBadge tone="neutral">Épuisé</StatusBadge>
                )}
              </TableCell>
              <TableCell>
                <RowActions label={item.name} disabled={pending}>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/menu/${item.id}`}>
                      <IconEdit size={15} />
                      Modifier
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={pending}
                    onSelect={() =>
                      startTransition(async () => {
                        await toggleFeaturedAction(item.id);
                        toast(item.featured ? "Retiré de la vedette" : "Mis en vedette");
                      })
                    }
                  >
                    <IconStarFilled size={15} />
                    {item.featured ? "Retirer de la vedette" : "Mettre en vedette"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={pending}
                    onSelect={() =>
                      startTransition(async () => {
                        await toggleMenuItemAction(item.id);
                        toast(item.active ? "Marqué épuisé" : "Marqué disponible");
                      })
                    }
                  >
                    {item.active ? "Marquer épuisé" : "Marquer disponible"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setDeleting(item)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <IconTrash size={15} />
                    Supprimer
                  </DropdownMenuItem>
                </RowActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {deleting?.name} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le plat disparaît du menu et de l&apos;accueil. Les commandes passées qui le contiennent
              gardent leur historique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleting) startTransition(() => deleteMenuItemAction(deleting.id));
                setDeleting(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
