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
const AUTH_ROUTES = ["/login", "/signup"];

function isProtectedRoute(path: string) {
  if (path === "/admin" || path.startsWith("/admin/")) return true;
  if (path === "/commande" || path === "/fidelite" || path === "/suivi") return true;
  return false;
}

function isAuthRoute(path: string) {
  return AUTH_ROUTES.some((r) => path === r);
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthenticated = !!getSessionCookie(req);

  if (isProtectedRoute(path) && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(path) && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
