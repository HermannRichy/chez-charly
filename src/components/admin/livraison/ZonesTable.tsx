"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconEdit, IconPlus, IconTruckDelivery } from "@tabler/icons-react";
import { fmt } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/status-badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { RowActions } from "@/components/admin/ui/row-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createZoneAction, updateZoneAction } from "@/app/admin/(protected)/livraison/actions";

export type ZoneRow = { id: string; name: string; fee: number; etaLabel: string; isPickup: boolean };

export function ZonesTable({ zones }: { zones: ZoneRow[] }) {
  const [editing, setEditing] = useState<ZoneRow | null>(null);

  if (zones.length === 0) {
    return <EmptyState icon={IconTruckDelivery} title="Aucune zone" />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Zone</TableHead>
            <TableHead>Tarif</TableHead>
            <TableHead>Délai</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{zone.name}</span>
                  {zone.isPickup && <StatusBadge tone="info">Retrait</StatusBadge>}
                </div>
              </TableCell>
              <TableCell className="font-bold text-primary">{fmt(zone.fee)}</TableCell>
              <TableCell className="text-muted-foreground">{zone.etaLabel}</TableCell>
              <TableCell>
                <RowActions label={zone.name}>
                  <DropdownMenuItem onSelect={() => setEditing(zone)}>
                    <IconEdit size={15} />
                    Modifier
                  </DropdownMenuItem>
                </RowActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          {editing && (
            <ZoneForm
              key={editing.id}
              title="Modifier la zone"
              initial={editing}
              onSubmit={(data) => updateZoneAction(editing.id, data)}
              onDone={() => setEditing(null)}
              successMessage="Zone mise à jour"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AddZoneButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus size={15} />
          Ajouter une zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {open && (
          <ZoneForm
            title="Nouvelle zone"
            initial={{ name: "", fee: 0, etaLabel: "" }}
            onSubmit={(data) => createZoneAction(data)}
            onDone={() => setOpen(false)}
            successMessage="Zone ajoutée"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ZoneForm({
  title,
  initial,
  onSubmit,
  onDone,
  successMessage,
}: {
  title: string;
  initial: { name: string; fee: number; etaLabel: string };
  onSubmit: (data: { name: string; fee: number; etaLabel: string }) => Promise<void>;
  onDone: () => void;
  successMessage: string;
}) {
  const [name, setName] = useState(initial.name);
  const [fee, setFee] = useState(initial.fee.toString());
  const [etaLabel, setEtaLabel] = useState(initial.etaLabel);
  const [pending, startTransition] = useTransition();

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await onSubmit({ name, fee: Number(fee), etaLabel });
      toast(successMessage);
      onDone();
    });
  }

  return (
    <form onSubmit={onFormSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-1.5">
        <Label htmlFor="zone-name">Nom</Label>
        <Input id="zone-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="zone-fee">Tarif (F CFA)</Label>
        <Input id="zone-fee" value={fee} onChange={(e) => setFee(e.target.value)} inputMode="numeric" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="zone-eta">Délai</Label>
        <Input id="zone-eta" value={etaLabel} onChange={(e) => setEtaLabel(e.target.value)} required />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}
