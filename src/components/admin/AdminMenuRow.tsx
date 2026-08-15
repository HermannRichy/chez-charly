"use client";

import { useState, useTransition } from "react";
import { IconStarFilled } from "@tabler/icons-react";
import {
  updateMenuItemNameAction,
  updateMenuItemPriceAction,
  toggleMenuItemAction,
  deleteMenuItemAction,
} from "@/app/admin/(protected)/menu/actions";
import { AdminMenuItemEditor, type EditableMenuItem } from "@/components/admin/AdminMenuItemEditor";

export function AdminMenuRow({
  item,
}: {
  item: {
    id: string;
    name: string;
    note: string;
    price: number;
    category: string;
    active: boolean;
    featured: boolean;
    images: string[];
  };
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price.toString());
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  const editableItem: EditableMenuItem = {
    id: item.id,
    name: item.name,
    note: item.note,
    featured: item.featured,
    images: item.images,
  };

  return (
    <div className="bg-admin-surface border border-admin-text/9 rounded-2xl px-3.5 py-3 flex flex-wrap gap-2.5 gap-x-3 items-center">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden bg-admin-bg border border-admin-text/15"
        aria-label="Gérer les photos"
      >
        {item.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-admin-text-4 text-[9px] font-bold">
            Photo
          </span>
        )}
        {item.featured && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 grid place-items-center rounded-full bg-orange text-white">
            <IconStarFilled size={10} />
          </span>
        )}
      </button>

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

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="border border-admin-text/20 bg-transparent text-admin-text-2 px-3.5 py-2 rounded-full text-[11.5px] font-extrabold"
      >
        Gérer
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

      {editing && <AdminMenuItemEditor item={editableItem} onClose={() => setEditing(false)} />}
    </div>
  );
}
