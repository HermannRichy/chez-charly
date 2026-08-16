"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconEdit } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RowActions } from "@/components/admin/ui/row-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateWheelPrizeAction } from "@/app/admin/(protected)/fidelite/actions";

export type PrizeRow = { id: string; label: string; sortOrder: number };

export function WheelPrizesTable({ prizes }: { prizes: PrizeRow[] }) {
  const [editing, setEditing] = useState<PrizeRow | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14">Case</TableHead>
            <TableHead>Lot</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {prizes.map((prize) => (
            <TableRow key={prize.id}>
              <TableCell className="text-muted-foreground font-bold">{prize.sortOrder + 1}</TableCell>
              <TableCell className="font-medium text-foreground">{prize.label}</TableCell>
              <TableCell>
                <RowActions label={`case ${prize.sortOrder + 1}`}>
                  <DropdownMenuItem onSelect={() => setEditing(prize)}>
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
          {editing && <PrizeEditForm key={editing.id} prize={editing} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PrizeEditForm({ prize, onDone }: { prize: PrizeRow; onDone: () => void }) {
  const [label, setLabel] = useState(prize.label);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateWheelPrizeAction(prize.id, label);
      toast("Case mise à jour");
      onDone();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Modifier la case {prize.sortOrder + 1}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-1.5">
        <Label htmlFor="prize-label">Lot</Label>
        <Input id="prize-label" value={label} onChange={(e) => setLabel(e.target.value)} required />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}
