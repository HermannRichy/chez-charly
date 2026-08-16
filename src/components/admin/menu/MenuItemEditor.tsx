"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { IconStarFilled, IconPlus, IconX, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminSwitch } from "@/components/admin/ui/admin-switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  createMenuItemAction,
  updateMenuItemAction,
  deleteMenuItemAction,
  addMenuItemImageAction,
  removeMenuItemImageAction,
  setPrimaryImageAction,
  type MenuItemFormInput,
} from "@/app/admin/(protected)/menu/actions";

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court"),
  price: z.coerce.number().int().positive("Prix invalide"),
  category: z.string().trim().min(2, "Catégorie requise"),
  note: z.string().trim().max(200, "200 caractères max").optional(),
});

type FormValues = z.infer<typeof schema>;

export type EditableMenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  note: string;
  active: boolean;
  featured: boolean;
  images: string[];
};

export function MenuItemEditor({
  item,
  categories,
}: {
  item?: EditableMenuItem;
  categories: string[];
}) {
  const isEdit = !!item;
  const [active, setActive] = useState(item?.active ?? true);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [saving, startSaving] = useTransition();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name ?? "",
      price: item?.price ?? 0,
      category: item?.category ?? categories[0] ?? "",
      note: item?.note ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    const payload: MenuItemFormInput = { ...values, active, featured };
    startSaving(async () => {
      try {
        if (isEdit) {
          await updateMenuItemAction(item.id, payload);
          toast("Plat enregistré");
        } else {
          await createMenuItemAction(payload);
        }
      } catch (err) {
        toast(err instanceof Error ? err.message : "Impossible d'enregistrer.");
      }
    });
  }

  async function handleUpload(file: File) {
    if (!item) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "dishes");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload échoué");
      await addMenuItemImageAction(item.id, json.url);
      setImages((prev) => [...prev, json.url]);
      toast("Photo ajoutée");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload échoué");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 min-w-0">
      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="bg-card border border-border rounded-xl p-5 grid gap-4 min-w-0">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nom du plat</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Prix (F CFA)</Label>
              <Input id="price" type="number" {...register("price")} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="category">Catégorie</Label>
              <Input id="category" list="categories" {...register("category")} />
              <datalist id="categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="note">Note (affichée sous le nom)</Label>
            <Textarea id="note" rows={2} {...register("note")} />
            {errors.note && <p className="text-xs text-destructive">{errors.note.message}</p>}
          </div>

          <div className="grid gap-4 pt-4 border-t border-border">
            <AdminSwitch
              label="Disponible à la vente"
              description="Épuisé le retire des boutons de commande, sans le supprimer du menu."
              checked={active}
              onCheckedChange={setActive}
            />
            <AdminSwitch
              label="Mettre en vedette sur l'accueil"
              description="Affiché dans « Les plats qu'on réclame le plus »."
              checked={featured}
              onCheckedChange={setFeatured}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[11px] font-bold tracking-[.1em] text-muted-foreground mb-3">
            PHOTOS ({images.length})
          </div>

          {!isEdit ? (
            <p className="text-sm text-muted-foreground">
              Enregistre d&apos;abord le plat pour pouvoir ajouter des photos.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {images.map((url, i) => (
                <div key={url} className="relative aspect-square rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 ? (
                    <span className="absolute top-1 left-1 flex items-center gap-1 bg-primary text-primary-foreground text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                      <IconStarFilled size={9} />
                      Principale
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await setPrimaryImageAction(item.id, url);
                          setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
                        })
                      }
                      className="absolute top-1 left-1 bg-background/85 text-foreground text-[9px] font-extrabold px-1.5 py-0.5 rounded-full disabled:opacity-60"
                    >
                      Principale
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setDeletingImage(url)}
                    aria-label="Supprimer la photo"
                    className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-destructive text-destructive-foreground disabled:opacity-60"
                  >
                    <IconX size={12} />
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
                className="aspect-square rounded-lg border-[1.5px] border-dashed border-border text-muted-foreground grid place-items-center gap-1 text-[10.5px] font-bold disabled:opacity-60"
              >
                <IconPlus size={18} />
                {uploading ? "Envoi…" : "Ajouter"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone d'actions distincte, en bas du formulaire : Enregistrer n'est
          jamais mélangé aux autres contrôles (statut, suppression de photo...). */}
      <div className="flex items-center justify-between gap-3 pt-5 border-t border-border flex-wrap">
        {isEdit ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" className="text-destructive hover:text-destructive">
                <IconTrash size={15} />
                Supprimer le plat
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer « {item.name} » ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Le plat disparaît du menu et de l&apos;accueil. Les commandes passées qui le
                  contiennent gardent leur historique.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => startTransition(() => deleteMenuItemAction(item.id))}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <span />
        )}

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>

      <AlertDialog open={!!deletingImage} onOpenChange={(open) => !open && setDeletingImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
            <AlertDialogDescription>
              Elle disparaît de la galerie du plat. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!item || !deletingImage) return;
                const url = deletingImage;
                startTransition(async () => {
                  await removeMenuItemImageAction(item.id, url);
                  setImages((prev) => prev.filter((u) => u !== url));
                });
                setDeletingImage(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
