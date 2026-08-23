"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { PasswordInput } from "@/components/site/PasswordInput";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const { data, error: authError } = await signIn.email({ email, password });
    setPending(false);

    if (authError) {
      setError(authError.message ?? "Identifiants invalides.");
      return;
    }

    // callbackUrl vaut "/" par défaut (login direct, sans redirection) : dans
    // ce cas seulement, un STAFF part sur le dashboard. Sinon on respecte la
    // page que l'utilisateur voulait initialement visiter.
    const role = (data?.user as { role?: string } | undefined)?.role;
    router.push(callbackUrl !== "/" ? callbackUrl : role === "STAFF" ? "/admin" : "/");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-border-light rounded-[26px] p-7 grid gap-4.5"
    >
      <div className="font-grifter text-2xl text-deep text-center">Se connecter</div>

      {error && (
        <div className="text-[13px] font-semibold text-[#B71D29] bg-[#B71D29]/10 rounded-[12px] px-3.5 py-2.5">
          {error}
        </div>
      )}

      <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
        EMAIL
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>
      <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
        MOT DE PASSE
        <PasswordInput
          required
          value={password}
          onChange={setPassword}
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="border-0 bg-orange text-white py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      <div className="text-center text-[13.5px] text-text-tertiary">
        Pas encore de compte ?{" "}
        <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-deep">
          Créer un compte
        </Link>
      </div>
    </form>
  );
}
