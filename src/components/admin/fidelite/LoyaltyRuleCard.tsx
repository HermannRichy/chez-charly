"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePtsPerUnitAction } from "@/app/admin/(protected)/fidelite/actions";

export function LoyaltyRuleCard({ value }: { value: number }) {
  const [ptsPerUnit, setPtsPerUnit] = useState(value.toString());
  const [pending, startTransition] = useTransition();
  const dirty = Number(ptsPerUnit) !== value;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updatePtsPerUnitAction(Number(ptsPerUnit));
      toast("Règle mise à jour");
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-card border border-border rounded-xl p-5 grid gap-4">
      <div className="font-grifter text-lg text-foreground">Règle d&apos;attribution</div>
      <div className="flex items-center gap-2.5 flex-wrap text-sm">
        <span className="text-muted-foreground">1 point pour chaque</span>
        <Input
          value={ptsPerUnit}
          onChange={(e) => setPtsPerUnit(e.target.value)}
          inputMode="numeric"
          className="h-8 w-24"
        />
        <span className="text-muted-foreground">F dépensés</span>
      </div>
      <div className="pt-3 border-t border-border">
        <Button type="submit" disabled={pending || !dirty} className="w-full">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
