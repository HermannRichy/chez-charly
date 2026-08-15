import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Next.js 16 : le fichier "middleware.ts" n'existe plus, remplacé par
// "proxy.ts" exportant une fonction `proxy`.
//
// Vérification optimiste uniquement (cookie de session, pas d'appel DB) :
// - /admin/** exige une session ; le rôle STAFF est revalidé côté serveur
//   dans src/app/admin/(protected)/layout.tsx (un CLIENT connecté est
//   renvoyé vers "/" à ce niveau-là, pas ici).
// - /commande, /fidelite, /suivi (index) exigent une session client.
// - /suivi/[id] reste public : c'est un lien de suivi partageable (README).
//
// Le cas inverse ("déjà connecté → dégager de /login") n'est PAS traité ici :
// un cookie présent mais dont la session correspondante n'existe plus en base
// (DB réinitialisée, session expirée) ferait sinon boucler indéfiniment entre
// ce contrôle optimiste et la vraie vérification côté page (getSessionUser),
// qui elle constate que la session est invalide et renvoie vers /login.
// Cette redirection "déjà connecté" est donc gérée dans /login et /signup
// eux-mêmes, avec la même vérification réelle que le reste de l'app.

function isProtectedRoute(path: string) {
  if (path === "/admin" || path.startsWith("/admin/")) return true;
  if (path === "/commande" || path === "/fidelite" || path === "/suivi") return true;
  if (path === "/compte" || path.startsWith("/compte/")) return true;
  return false;
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isProtectedRoute(path) && !getSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
