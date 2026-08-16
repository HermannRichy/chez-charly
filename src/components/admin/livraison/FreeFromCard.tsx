"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateFreeFromAction } from "@/app/admin/(protected)/livraison/actions";

export function FreeFromCard({ value }: { value: number }) {
  const [freeFrom, setFreeFrom] = useState(value.toString());
  const [pending, startTransition] = useTransition();
  const dirty = Number(freeFrom) !== value;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateFreeFromAction(Number(freeFrom));
      toast("Seuil mis à jour");
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-card border border-border rounded-xl p-5 grid gap-4">
      <div>
        <div className="font-grifter text-lg text-foreground">Livraison offerte</div>
        <p className="text-sm text-muted-foreground mt-1.5">
          Seuil au-delà duquel la livraison passe à zéro, toutes zones confondues.
        </p>
      </div>
      <div className="grid gap-1.5 max-w-50">
        <Label htmlFor="freeFrom">Seuil (F CFA)</Label>
        <Input
          id="freeFrom"
          value={freeFrom}
          onChange={(e) => setFreeFrom(e.target.value)}
          inputMode="numeric"
        />
      </div>
      <div className="pt-3 border-t border-border">
        <Button type="submit" disabled={pending || !dirty} className="w-full">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
