"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addMenuItemAction } from "@/app/admin/(protected)/menu/actions";

export function AdminAddMenuItem({ categories }: { categories: string[] }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "Nos Attiéké");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      try {
        await addMenuItemAction({ name, price: Number(price), category });
        setName("");
        setPrice("");
        toast("Plat ajouté au menu");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Nom et prix requis");
      }
    });
  }

  return (
    <div className="bg-admin-surface border border-admin-text/10 rounded-[20px] p-4.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,165px),1fr))] gap-3 items-end">
      <label className="grid gap-1.75 text-[11px] font-extrabold tracking-[.1em] text-admin-text-3">
        NOUVEAU PLAT
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Attiéké + crevettes + alloco"
          className="border border-admin-text/20 bg-admin-bg text-admin-text rounded-xl px-3.5 py-3 text-sm"
        />
      </label>
      <label className="grid gap-1.75 text-[11px] font-extrabold tracking-[.1em] text-admin-text-3">
        PRIX (F)
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="3500"
          className="border border-admin-text/20 bg-admin-bg text-admin-text rounded-xl px-3.5 py-3 text-sm"
        />
      </label>
      <label className="grid gap-1.75 text-[11px] font-extrabold tracking-[.1em] text-admin-text-3">
        CATÉGORIE
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-admin-text/20 bg-admin-bg text-admin-text rounded-xl px-3.5 py-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={pending}
        onClick={submit}
        className="border-0 bg-orange text-white px-5.5 py-3.25 rounded-xl text-sm font-extrabold disabled:opacity-60"
      >
        Ajouter
      </button>
    </div>
  );
}
