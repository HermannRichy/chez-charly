import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { LoginForm } from "@/components/site/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  // Vérification réelle (DB), pas juste la présence du cookie (voir
  // proxy.ts) : évite la boucle si un cookie existe pour une session qui
  // n'est plus valide en base.
  const user = await getSessionUser();
  if (user) redirect(user.role === "STAFF" ? "/admin" : callbackUrl || "/");

  return <LoginForm callbackUrl={callbackUrl || "/"} />;
}
