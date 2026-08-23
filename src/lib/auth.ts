import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { ac, STAFF, CLIENT } from "@/lib/auth-permissions";
import { sendPushToStaff } from "@/lib/push";

/**
 * Un seul système de compte pour tout le monde (staff ET clients), comme
 * dans nextpress : le `role` distingue l'accès dashboard (STAFF) du compte
 * client normal (CLIENT, rôle par défaut à l'inscription). Le profil client
 * du prototype de design (téléphone, adresse, points, tours de roue) vit
 * directement sur `User` via `additionalFields` plutôt que sur un modèle
 * séparé — voir prisma/schema.prisma.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      phone: { type: "string", required: false, input: true },
      address: { type: "string", required: false, input: true, defaultValue: "" },
      points: { type: "number", required: false, input: false, defaultValue: 0 },
      spinsAvailable: { type: "number", required: false, input: false, defaultValue: 0 },
    },
  },

  databaseHooks: {
    user: {
      create: {
        async after(user) {
          await sendPushToStaff({
            title: "Nouveau compte créé",
            body: `${user.name} (${user.email}) vient de s'inscrire.`,
            url: "/admin/utilisateurs",
          });
        },
      },
    },
  },

  plugins: [
    admin({
      ac,
      defaultRole: "CLIENT",
      adminRoles: ["STAFF"],
      roles: { STAFF, CLIENT },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
