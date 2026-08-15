import { SignupForm } from "@/components/site/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <SignupForm callbackUrl={callbackUrl || "/"} />;
}
