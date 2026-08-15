import "dotenv/config";
import { PrismaClient, PaymentProvider } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { auth } from "../src/lib/auth";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Reprend exactement SEED_MENU du prototype de design (21 plats, prix confirmés
// par le menu papier réel dans charly-files/menu.jpeg).
const SEED_MENU: { category: string; items: [string, number, string][] }[] = [
  {
    category: "Nos Attiéké",
    items: [
      ["Attiéké + poisson + Alloco", 1200, "Le classique de la maison"],
      ["Attiéké + poisson + Alloco — grand", 1500, "Portion bien chargée"],
      ["Attiéké + aileron + Alloco", 2500, "Aussi en 3 000 F extra"],
      ["Attiéké + poisson + aileron + Alloco", 3000, "Le duo mer & poulet"],
      ["Attiéké + poulet mayo", 3500, "Poulet braisé, mayo maison"],
      ["Attiéké + tilapia + Alloco", 5000, "Tilapia entier grillé"],
    ],
  },
  {
    category: "Riz et Couscous",
    items: [
      ["Riz + aileron", 2500, "Riz gras, sauce généreuse"],
      ["Riz + frites/alloco + aileron", 3000, "Au choix frites ou alloco"],
      ["Couscous + sardine", 1200, "Le petit prix qui cale"],
      ["Couscous + aileron", 2000, ""],
      ["Couscous + alloco + aileron", 2500, ""],
    ],
  },
  {
    category: "Spaghetti et Coquillette",
    items: [
      ["Spaghetti + omelette/saucisse", 500, "Le plus commandé le matin"],
      ["Spaghetti + omelette + saucisse + alloco", 1200, ""],
      ["Spaghetti + omelette + saucisse + alloco + sardines", 2500, "Version bien chargée"],
      ["Coquillettes + saucisse + omelette", 1500, ""],
      ["Coquillettes + saucisse + aileron", 2500, ""],
    ],
  },
  {
    category: "Frites et Alloco",
    items: [
      ["Frites + aileron", 2500, ""],
      ["Frites + alloco + aileron", 3000, "Le combo du soir"],
      ["Alloco + aileron", 2500, ""],
    ],
  },
  {
    category: "Nos Pâtes",
    items: [
      ["Piron + aileron", 2000, "Spécialité locale"],
      ["Bomiwor", 3500, "Recette de Charly"],
    ],
  },
];

async function main() {
  console.log("Seed — réglages");
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", freeFrom: 10000, ptsPerUnit: 100 },
  });

  // Les 4 plats vedettes de l'accueil dans le prototype de design (ids
  // at5/at6/pa1/fa2) et leur photo — les seuls plats à démarrer avec une
  // vraie photo, les 17 autres restent en placeholder rayé jusqu'à l'upload
  // du client via le dashboard.
  const FEATURED: Record<string, string> = {
    "Attiéké + poulet mayo": "/photos/attieke.jpg",
    "Attiéké + tilapia + Alloco": "/photos/attieke-piron.jpg",
    "Piron + aileron": "/photos/pate-noire.jpg",
    "Frites + alloco + aileron": "/photos/igname.jpg",
  };

  console.log("Seed — menu (21 plats)");
  for (const group of SEED_MENU) {
    for (const [name, price, note] of group.items) {
      const existing = await prisma.menuItem.findFirst({
        where: { name, category: group.category },
      });
      if (existing) continue;
      await prisma.menuItem.create({
        data: {
          name,
          price,
          note,
          category: group.category,
          active: true,
          featured: name in FEATURED,
          images: FEATURED[name] ? [FEATURED[name]] : [],
        },
      });
    }
  }

  console.log("Seed — zones de livraison");
  // Le retrait au resto est ajouté séparément par prisma/seed-pickup-zone.ts
  // (garde ce fichier-ci centré sur les données de lancement d'origine).
  const zones: { name: string; fee: number; etaLabel: string }[] = [
    { name: "Abomey-Calavi centre", fee: 500, etaLabel: "20–30 min" },
    { name: "Womey", fee: 300, etaLabel: "10–20 min" },
    { name: "Godomey", fee: 700, etaLabel: "25–40 min" },
    { name: "Cotonou", fee: 1500, etaLabel: "40–60 min" },
  ];
  for (const [i, z] of zones.entries()) {
    const existing = await prisma.deliveryZone.findFirst({ where: { name: z.name } });
    if (existing) continue;
    await prisma.deliveryZone.create({ data: { ...z, sortOrder: i } });
  }

  console.log("Seed — moyens de paiement (numéros d'exemple — À REMPLACER avant lancement)");
  await prisma.paymentMethod.upsert({
    where: { provider: PaymentProvider.MOMO },
    update: {},
    create: {
      provider: PaymentProvider.MOMO,
      label: "MTN MoMo",
      number: "01 61 55 57 22",
      holder: "CHARLY BONOU",
    },
  });
  await prisma.paymentMethod.upsert({
    where: { provider: PaymentProvider.MOOV },
    update: {},
    create: {
      provider: PaymentProvider.MOOV,
      label: "Moov Money",
      number: "01 96 44 12 07",
      holder: "RESTAURANT CHEZ CHARLY",
    },
  });

  console.log("Seed — paliers de fidélité");
  const tiers: { name: string; threshold: number; reward: string }[] = [
    { name: "Palier Alloco", threshold: 500, reward: "Alloco offert + 1 tour de roue" },
    { name: "Palier Charly", threshold: 1500, reward: "Attiéké poisson offert + 1 tour de roue" },
    { name: "Palier Tilapia", threshold: 3000, reward: "Tilapia entier + livraison gratuite 1 mois" },
  ];
  for (const [i, t] of tiers.entries()) {
    const existing = await prisma.loyaltyTier.findFirst({ where: { name: t.name } });
    if (existing) continue;
    await prisma.loyaltyTier.create({ data: { ...t, sortOrder: i } });
  }

  console.log("Seed — 8 cases de la roue");
  const prizes = [
    "Alloco offert",
    "−500 F",
    "1 boisson",
    "Livraison gratuite",
    "Rejouez",
    "Piron offert",
    "−1 000 F",
    "Poisson braisé",
  ];
  for (const [i, label] of prizes.entries()) {
    await prisma.wheelPrize.upsert({
      where: { sortOrder: i },
      update: { label },
      create: { label, sortOrder: i },
    });
  }

  console.log("Seed — compte staff (dashboard admin)");
  const staffEmail = process.env.SEED_STAFF_EMAIL;
  const staffPassword = process.env.SEED_STAFF_PASSWORD;
  const staffName = process.env.SEED_STAFF_NAME || "Charly";
  if (!staffEmail || !staffPassword) {
    console.log(
      "  → SEED_STAFF_EMAIL / SEED_STAFF_PASSWORD absents du .env : aucun compte staff créé. " +
        "Ajoute-les puis relance `pnpm db:seed` pour créer le premier compte du dashboard.",
    );
  } else {
    const existing = await prisma.user.findUnique({ where: { email: staffEmail } });
    if (existing) {
      console.log(`  → Compte staff déjà existant pour ${staffEmail}, rien à faire.`);
    } else {
      await auth.api.signUpEmail({
        body: { email: staffEmail, password: staffPassword, name: staffName },
      });
      // Le plugin admin de better-auth crée toujours le compte avec le rôle
      // par défaut (CLIENT) — on le repasse en STAFF juste après, directement
      // en base (pas d'action "set-role" utilisable hors requête HTTP ici).
      await prisma.user.update({ where: { email: staffEmail }, data: { role: "STAFF" } });
      console.log(`  → Compte staff créé pour ${staffEmail} (rôle STAFF).`);
    }
  }

  console.log("Seed terminé.");
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
