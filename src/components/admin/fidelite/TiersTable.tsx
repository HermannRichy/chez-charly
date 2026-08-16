"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { fmtNumber } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { createTierAction, updateTierAction } from "@/app/admin/(protected)/fidelite/actions";

export type TierRow = { id: string; name: string; threshold: number; reward: string };

export function TiersTable({ tiers }: { tiers: TierRow[] }) {
  const [editing, setEditing] = useState<TierRow | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Palier</TableHead>
            <TableHead>Seuil (pts)</TableHead>
            <TableHead>Lot</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-bold text-foreground">{tier.name}</TableCell>
              <TableCell className="text-muted-foreground">{fmtNumber(tier.threshold)}</TableCell>
              <TableCell className="text-muted-foreground">{tier.reward || "Lot à définir"}</TableCell>
              <TableCell>
                <RowActions label={tier.name}>
                  <DropdownMenuItem onSelect={() => setEditing(tier)}>
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
            <TierForm
              key={editing.id}
              title="Modifier le palier"
              initial={editing}
              onSubmit={(data) => updateTierAction(editing.id, data)}
              onDone={() => setEditing(null)}
              successMessage="Palier mis à jour"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AddTierButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus size={15} />
          Ajouter un palier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {open && (
          <TierForm
            title="Nouveau palier"
            initial={{ name: "", threshold: 0, reward: "" }}
            onSubmit={(data) => createTierAction(data)}
            onDone={() => setOpen(false)}
            successMessage="Palier ajouté"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TierForm({
  title,
  initial,
  onSubmit,
  onDone,
  successMessage,
}: {
  title: string;
  initial: { name: string; threshold: number; reward: string };
  onSubmit: (data: { name: string; threshold: number; reward: string }) => Promise<void>;
  onDone: () => void;
  successMessage: string;
}) {
  const [name, setName] = useState(initial.name);
  const [threshold, setThreshold] = useState(initial.threshold.toString());
  const [reward, setReward] = useState(initial.reward);
  const [pending, startTransition] = useTransition();

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await onSubmit({ name, threshold: Number(threshold), reward });
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
        <Label htmlFor="tier-name">Nom</Label>
        <Input id="tier-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="tier-threshold">Seuil (points)</Label>
        <Input
          id="tier-threshold"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          inputMode="numeric"
          required
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="tier-reward">Lot</Label>
        <Input
          id="tier-reward"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="Lot à définir"
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}
