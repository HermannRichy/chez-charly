import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { SignupForm } from "@/components/site/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  const user = await getSessionUser();
  if (user) redirect(user.role === "STAFF" ? "/admin" : callbackUrl || "/");

  return <SignupForm callbackUrl={callbackUrl || "/"} />;
}
