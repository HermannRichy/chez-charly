import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadFolder = "dishes" | "payment-proofs";

/**
 * Upload direct depuis le serveur (Buffer) — utilisé par /api/upload pour
 * les captures de preuve de paiement (checkout) et les photos de plats
 * (dashboard admin, onglet Menu). Cloudinary gère le redimensionnement CDN à
 * la volée via des transformations d'URL, pas besoin de le faire ici.
 */
export async function uploadImage(buffer: Buffer, folder: UploadFolder) {
  const base64 = buffer.toString("base64");
  const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`, {
    folder: `chez-charly/${folder}`,
  });
  return result.secure_url;
}

export { cloudinary };
