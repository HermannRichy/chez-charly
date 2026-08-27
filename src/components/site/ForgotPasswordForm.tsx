"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const { error: authError } = await requestPasswordReset({ email, redirectTo: "/reset-password" });
    setPending(false);

    if (authError) {
      setError(authError.message ?? "Impossible d'envoyer l'email.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-white border border-border-light rounded-[26px] p-7 grid gap-4.5 text-center">
        <div className="font-grifter text-2xl text-deep">Email envoyé</div>
        <p className="text-[14.5px] text-text-tertiary">
          Si un compte existe avec l&apos;adresse <b>{email}</b>, un lien de réinitialisation vient de lui
          être envoyé.
        </p>
        <Link href="/login" className="font-bold text-deep text-[13.5px]">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-border-light rounded-[26px] p-7 grid gap-4.5"
    >
      <div className="font-grifter text-2xl text-deep text-center">Mot de passe oublié</div>
      <p className="text-[13.5px] text-text-tertiary text-center -mt-2">
        Indiquez votre email, on vous envoie un lien pour en choisir un nouveau.
      </p>

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

      <button
        type="submit"
        disabled={pending}
        className="border-0 bg-orange text-white py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep disabled:opacity-60"
      >
        {pending ? "Envoi…" : "Envoyer le lien"}
      </button>

      <div className="text-center text-[13.5px] text-text-tertiary">
        <Link href="/login" className="font-bold text-deep">
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
