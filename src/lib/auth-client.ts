import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  // Sans ce plugin, `useSession().data.user` n'est typé qu'avec les champs
  // Better Auth de base : `role`/`phone`/`address`/`points`/`spinsAvailable`
  // (déclarés côté serveur via `user.additionalFields` dans lib/auth.ts)
  // seraient bien présents à l'exécution mais invisibles pour TypeScript.
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
