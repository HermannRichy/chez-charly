import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Ajout du "retrait au resto" comme option de livraison (fee=0, isPickup=true).
 * Fichier séparé de prisma/seed.ts : il ne touche que cette zone, sans
 * repasser sur tout le jeu de données de lancement.
 */
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const existing = await prisma.deliveryZone.findFirst({ where: { name: "Retrait au resto" } });
  if (existing) {
    console.log("Zone « Retrait au resto » déjà présente, rien à faire.");
    return;
  }

  const minSortOrder = await prisma.deliveryZone.aggregate({ _min: { sortOrder: true } });

  await prisma.deliveryZone.create({
    data: {
      name: "Retrait au resto",
      fee: 0,
      etaLabel: "Prêt en 20-30 min",
      isPickup: true,
      sortOrder: (minSortOrder._min.sortOrder ?? 0) - 1,
    },
  });

  console.log("Zone « Retrait au resto » créée.");
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
