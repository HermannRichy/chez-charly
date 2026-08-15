import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** Pages/layouts client (fidélité, checkout, suivi) : redirige vers /login si non connecté. */
export async function requireClient(callbackUrl: string) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

/** Server actions du dashboard admin : lève une erreur plutôt que de rediriger. */
export async function requireStaff() {
  const user = await getSessionUser();
  if (!user || user.role !== "STAFF") throw new Error("Non autorisé.");
  return user;
}

/** Layout /admin : redirige plutôt que de lever — un CLIENT connecté repart vers "/". */
export async function requireStaffPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?callbackUrl=/admin");
  if (user.role !== "STAFF") redirect("/");
  return user;
}
