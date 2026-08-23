"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Role } from "@prisma/client";
import { IconUsers, IconBrandWhatsapp, IconShieldCheck, IconShieldOff } from "@tabler/icons-react";
import { fmtNumber } from "@/lib/format";
import { buildWelcomeWhatsAppLink } from "@/lib/whatsapp";
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
import { setUserRoleAction } from "@/app/admin/(protected)/utilisateurs/actions";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  points: number;
  joinedLabel: string;
};

export function UsersTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [pending, startTransition] = useTransition();
  const [switchingRole, setSwitchingRole] = useState<UserRow | null>(null);

  if (users.length === 0) {
    return (
      <EmptyState
        icon={IconUsers}
        title="Aucun utilisateur pour l'instant"
        description="Les comptes créés sur le site apparaîtront ici."
      />
    );
  }

  const nextRole: Role = switchingRole?.role === "STAFF" ? "CLIENT" : "STAFF";

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Inscrit</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <TableRow key={u.id}>
                <TableCell className="font-bold text-foreground">{u.name}</TableCell>
                <TableCell>
                  <div>{u.email}</div>
                  {u.phone && <div className="text-[12px] text-muted-foreground">{u.phone}</div>}
                </TableCell>
                <TableCell>
                  {u.role === "STAFF" ? (
                    <StatusBadge tone="info">Staff</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Client</StatusBadge>
                  )}
                </TableCell>
                <TableCell className="font-bold text-primary">{fmtNumber(u.points)}</TableCell>
                <TableCell className="text-muted-foreground">{u.joinedLabel}</TableCell>
                <TableCell>
                  <RowActions label={u.name} disabled={pending}>
                    {u.phone && (
                      <DropdownMenuItem asChild>
                        <a
                          href={buildWelcomeWhatsAppLink({ phone: u.phone, name: u.name })}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconBrandWhatsapp size={15} />
                          Message de bienvenue
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={isSelf} onSelect={() => setSwitchingRole(u)}>
                      {u.role === "STAFF" ? <IconShieldOff size={15} /> : <IconShieldCheck size={15} />}
                      {u.role === "STAFF" ? "Repasser client" : "Passer staff"}
                    </DropdownMenuItem>
                  </RowActions>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={!!switchingRole} onOpenChange={(open) => !open && setSwitchingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {nextRole === "STAFF" ? "Donner l'accès admin" : "Retirer l'accès admin"} à «{" "}
              {switchingRole?.name} » ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {nextRole === "STAFF"
                ? "Ce compte pourra se connecter au dashboard admin et gérer commandes, menu et fidélité."
                : "Ce compte perdra l'accès au dashboard admin et redeviendra un compte client classique."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (switchingRole) {
                  const target = switchingRole;
                  startTransition(async () => {
                    await setUserRoleAction(target.id, nextRole);
                    toast(nextRole === "STAFF" ? "Passé staff" : "Repassé client");
                  });
                }
                setSwitchingRole(null);
              }}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
