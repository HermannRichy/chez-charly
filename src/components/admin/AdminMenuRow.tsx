"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  updateMenuItemNameAction,
  updateMenuItemPriceAction,
  toggleMenuItemAction,
  setMenuItemPhotoAction,
  deleteMenuItemAction,
} from "@/app/admin/(protected)/menu/actions";

export function AdminMenuRow({
  item,
}: {
  item: { id: string; name: string; price: number; category: string; active: boolean; imageUrl: string | null };
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  async function handlePhoto(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "dishes");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload échoué");
      await setMenuItemPhotoAction(item.id, json.url);
      toast("Photo mise à jour");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload échoué");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-admin-surface border border-admin-text/9 rounded-2xl px-3.5 py-3 flex flex-wrap gap-2.5 gap-x-3 items-center">
      <div className="text-[11.5px] font-extrabold tracking-[.06em] text-admin-text-4 shrink-0">
        {item.category}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name !== item.name && startTransition(() => updateMenuItemNameAction(item.id, name))}
        className="border border-transparent bg-transparent text-admin-text rounded-[10px] px-2.5 py-2.25 text-[14.5px] font-bold flex-1 min-w-45 hover:border-admin-text/20 hover:bg-admin-bg"
      />

      <div className="flex items-center gap-2">
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() =>
            Number(price) !== item.price &&
            startTransition(() => updateMenuItemPriceAction(item.id, Number(price)))
          }
          className="border border-admin-text/18 bg-admin-bg text-orange rounded-[10px] px-2.5 py-2.25 text-[15px] font-extrabold w-21.5 font-grifter"
        />
        <span className="text-[12.5px] text-admin-text-4">F</span>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhoto(file);
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInput.current?.click()}
        className="border border-admin-text/20 bg-transparent text-admin-text-2 px-3 py-2 rounded-full text-[11.5px] font-extrabold disabled:opacity-60"
      >
        {uploading ? "…" : item.imageUrl ? "Changer photo" : "Ajouter photo"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleMenuItemAction(item.id))}
        className="border border-admin-text/20 bg-transparent text-admin-text-2 px-3.5 py-2 rounded-full text-[11.5px] font-extrabold min-w-27 disabled:opacity-60"
      >
        {item.active ? "Disponible" : "Épuisé"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteMenuItemAction(item.id))}
        className="border-0 bg-danger-bg text-danger-text w-8.5 h-8.5 rounded-[10px] text-[15px] hover:bg-deep hover:text-white disabled:opacity-60"
      >
        ×
      </button>
    </div>
  );
}
