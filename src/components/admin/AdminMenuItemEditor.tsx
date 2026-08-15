"use client";

import { useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { IconX, IconStar, IconStarFilled, IconPlus } from "@tabler/icons-react";
import {
  updateMenuItemNoteAction,
  toggleFeaturedAction,
  addMenuItemImageAction,
  removeMenuItemImageAction,
  setPrimaryImageAction,
} from "@/app/admin/(protected)/menu/actions";

export type EditableMenuItem = {
  id: string;
  name: string;
  note: string;
  featured: boolean;
  images: string[];
};

export function AdminMenuItemEditor({ item, onClose }: { item: EditableMenuItem; onClose: () => void }) {
  const [note, setNote] = useState(item.note);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "dishes");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload échoué");
      await addMenuItemImageAction(item.id, json.url);
      toast("Photo ajoutée");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload échoué");
    } finally {
      setUploading(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-70 grid place-items-center px-4 py-8">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 bg-ink/55" />
      <div className="relative bg-admin-bg border border-admin-text/12 rounded-[26px] p-6 w-full max-w-[520px] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="font-grifter text-xl text-admin-text truncate pr-4">{item.name}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 shrink-0 grid place-items-center rounded-full border border-admin-text/20 text-admin-text"
          >
            <IconX size={18} />
          </button>
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => toggleFeaturedAction(item.id))}
          className={
            item.featured
              ? "flex items-center gap-2 border border-orange bg-orange/14 text-orange px-4 py-2.5 rounded-full text-[13px] font-extrabold disabled:opacity-60"
              : "flex items-center gap-2 border border-admin-text/20 bg-transparent text-admin-text-2 px-4 py-2.5 rounded-full text-[13px] font-extrabold disabled:opacity-60"
          }
        >
          {item.featured ? <IconStarFilled size={15} /> : <IconStar size={15} />}
          {item.featured ? "Mis en vedette sur l'accueil" : "Mettre en vedette sur l'accueil"}
        </button>

        <div className="text-[11px] font-extrabold tracking-[.1em] text-admin-text-3 mt-6 mb-2.5">
          PHOTOS ({item.images.length})
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {item.images.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-2xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 ? (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-orange text-white text-[9.5px] font-extrabold px-2 py-0.75 rounded-full">
                  <IconStarFilled size={10} />
                  Principale
                </span>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => setPrimaryImageAction(item.id, url))}
                  className="absolute top-1.5 left-1.5 bg-admin-bg/85 text-admin-text text-[9.5px] font-extrabold px-2 py-0.75 rounded-full disabled:opacity-60"
                >
                  Définir principale
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => removeMenuItemImageAction(item.id, url))}
                aria-label="Supprimer la photo"
                className="absolute top-1.5 right-1.5 w-6 h-6 grid place-items-center rounded-full bg-deep text-white text-xs disabled:opacity-60"
              >
                <IconX size={13} />
              </button>
            </div>
          ))}

          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="aspect-square rounded-2xl border-[1.5px] border-dashed border-admin-text/25 text-admin-text-3 grid place-items-center gap-1 text-[11px] font-bold disabled:opacity-60"
          >
            <IconPlus size={20} />
            {uploading ? "Envoi…" : "Ajouter"}
          </button>
        </div>

        <label className="grid gap-1.75 text-[11px] font-extrabold tracking-[.1em] text-admin-text-3 mt-6">
          NOTE (affichée sous le nom du plat)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => note !== item.note && startTransition(() => updateMenuItemNoteAction(item.id, note))}
            rows={2}
            className="border border-admin-text/20 bg-admin-surface text-admin-text rounded-xl px-3.5 py-3 text-sm resize-none"
          />
        </label>
      </div>
    </div>,
    document.body,
  );
}
