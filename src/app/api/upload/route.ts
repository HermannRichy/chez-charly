import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { uploadImage, type UploadFolder } from "@/lib/cloudinary";

const FOLDERS: UploadFolder[] = ["dishes", "payment-proofs"];

/**
 * Upload direct (preuve de paiement au checkout, photo de plat côté admin).
 * Pas de garde staff ici pour "payment-proofs" : n'importe quel client
 * anonyme doit pouvoir joindre sa capture au checkout. "dishes" est appelé
 * uniquement depuis le dashboard admin, déjà derrière /admin (proxy.ts).
 */
export async function POST(req: NextRequest) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json(
      { error: "Cloudinary n'est pas configuré (CLOUDINARY_* absents du .env)." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const folder = form.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (typeof folder !== "string" || !FOLDERS.includes(folder as UploadFolder)) {
    return NextResponse.json({ error: "Dossier d'upload invalide." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImage(buffer, folder as UploadFolder);

  return NextResponse.json({ url });
}
