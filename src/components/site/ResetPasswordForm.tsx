"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { PasswordInput } from "@/components/site/PasswordInput";

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setPending(true);
    const { error: authError } = await resetPassword({ newPassword: password, token });
    setPending(false);

    if (authError) {
      setError(authError.message ?? "Lien invalide ou expiré.");
      return;
    }

    router.push("/login");
  }

  if (!token) {
    return (
      <div className="bg-white border border-border-light rounded-[26px] p-7 grid gap-4.5 text-center">
        <div className="font-grifter text-2xl text-deep">Lien invalide</div>
        <p className="text-[14.5px] text-text-tertiary">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link href="/forgot-password" className="font-bold text-deep text-[13.5px]">
          Redemander un lien
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-border-light rounded-[26px] p-7 grid gap-4.5"
    >
      <div className="font-grifter text-2xl text-deep text-center">Nouveau mot de passe</div>

      {error && (
        <div className="text-[13px] font-semibold text-[#B71D29] bg-[#B71D29]/10 rounded-[12px] px-3.5 py-2.5">
          {error}
        </div>
      )}

      <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
        NOUVEAU MOT DE PASSE
        <PasswordInput
          required
          minLength={8}
          value={password}
          onChange={setPassword}
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>
      <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
        CONFIRMER
        <PasswordInput
          required
          minLength={8}
          value={confirm}
          onChange={setConfirm}
          className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="border-0 bg-orange text-white py-3.75 rounded-full text-[15px] font-extrabold hover:bg-deep disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : "Changer mon mot de passe"}
      </button>
    </form>
  );
}
