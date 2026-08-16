import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Pages publiques indexables uniquement - pas le panier/checkout/compte (état perso, sans intérêt SEO) ni l'admin (privé). */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/menu", priority: 0.9, changeFrequency: "daily" },
  { path: "/evenements", priority: 0.7, changeFrequency: "weekly" },
  { path: "/fidelite", priority: 0.6, changeFrequency: "weekly" },
  { path: "/suivi", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
