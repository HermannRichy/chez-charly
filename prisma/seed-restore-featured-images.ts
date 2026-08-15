import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Restaure les photos des 4 plats vedettes perdues lors de la migration
 * imageUrl (String?) → images (String[]) : les deux colonnes n'ayant pas la
 * même forme, `prisma migrate dev` a dû supprimer imageUrl sans copier son
 * contenu. Mêmes valeurs que le FEATURED de prisma/seed.ts.
 */
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const FEATURED: Record<string, string> = {
  "Attiéké + poulet mayo": "/photos/attieke.jpg",
  "Attiéké + tilapia + Alloco": "/photos/attieke-piron.jpg",
  "Piron + aileron": "/photos/pate-noire.jpg",
  "Frites + alloco + aileron": "/photos/igname.jpg",
};

async function main() {
  for (const [name, url] of Object.entries(FEATURED)) {
    const item = await prisma.menuItem.findFirst({ where: { name } });
    if (!item) {
      console.log(`  → « ${name} » introuvable, ignoré.`);
      continue;
    }
    if (item.images.includes(url)) {
      console.log(`  → « ${name} » a déjà sa photo, rien à faire.`);
      continue;
    }
    await prisma.menuItem.update({
      where: { id: item.id },
      data: { images: [url, ...item.images] },
    });
    console.log(`  → Photo restaurée pour « ${name} ».`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
