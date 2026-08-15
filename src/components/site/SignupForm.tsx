"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const { error: authError } = await signUp.email({
      name,
      email,
      password,
      // Champ additionnel déclaré dans lib/auth.ts (user.additionalFields).
      phone,
    } as Parameters<typeof signUp.email>[0]);

    setPending(false);
    if (authError) {
      setError(authError.message ?? "Inscription impossible.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-border-light rounded-[26px] p-7 grid gap-4.5"
    >
      <div className="font-grifter text-2xl text-deep text-center">Créer un compte</div>

      {error && (
        <div className="text-[13px] font-semibold text-[#B71D29] bg-[#B71D29]/10 rounded-[12px] px-3.5 py-2.5">
          {error}
        </div>
      )}

      <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
        NOM
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>
      <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
        TÉLÉPHONE
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01 XX XX XX XX"
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>
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
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="border-0 bg-orange text-white py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>

      <div className="text-center text-[13.5px] text-text-tertiary">
        Déjà un compte ?{" "}
        <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-deep">
          Se connecter
        </Link>
      </div>
    </form>
  );
}
