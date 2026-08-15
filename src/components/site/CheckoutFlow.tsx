"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fmt } from "@/lib/format";
import { confirmOrderAction } from "@/app/(site)/commande/actions";

type PaymentMethod = { provider: "MOMO" | "MOOV"; label: string; number: string; holder: string };

export function CheckoutFlow({
  total,
  zoneName,
  paymentMethods,
  initialCustomer,
}: {
  total: number;
  zoneName: string;
  paymentMethods: PaymentMethod[];
  initialCustomer: { name: string; phone: string; address: string } | null;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(initialCustomer?.name ?? "");
  const [phone, setPhone] = useState(initialCustomer?.phone ?? "");
  const [address, setAddress] = useState(initialCustomer?.address ?? "");
  const [payId, setPayId] = useState<"MOMO" | "MOOV">("MOMO");
  const [ref, setRef] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirming, startConfirm] = useTransition();

  const canConfirm = ref.trim().length > 3 || !!proofUrl;

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "payment-proofs");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload échoué");
      setProofUrl(json.url);
      toast("Capture jointe");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload échoué — indiquez la référence à la place.");
    } finally {
      setUploading(false);
    }
  }

  function confirm() {
    startConfirm(async () => {
      try {
        const { orderNumber } = await confirmOrderAction({
          customerName: name,
          customerPhone: phone,
          address,
          paymentMethod: payId,
          transactionRef: ref,
          proofImageUrl: proofUrl ?? undefined,
        });
        toast(`Commande confirmée — ${orderNumber}`);
        router.push(`/suivi/${orderNumber}`);
      } catch (err) {
        toast(err instanceof Error ? err.message : "Impossible de confirmer la commande.");
      }
    });
  }

  return (
    <div>
      <div className="flex gap-2.5 my-7 mb-6.5">
        <div className="flex-1 h-1.25 rounded-full bg-orange" />
        <div className={`flex-1 h-1.25 rounded-full ${step === 2 ? "bg-orange" : "bg-border-mid"}`} />
      </div>

      {step === 1 ? (
        <div className="bg-white border border-border-light rounded-[26px] p-[clamp(20px,4vw,28px)]">
          <div className="font-grifter text-2xl text-deep">1 · Vos coordonnées</div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-3.5 mt-5">
            <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
              NOM
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
              />
            </label>
            <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
              TÉLÉPHONE
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
              />
            </label>
            <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label col-span-full">
              ADRESSE — {zoneName}
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
              />
            </label>
          </div>

          <div className="text-xs font-extrabold tracking-[.1em] text-label mt-6 mb-2.5">
            MOYEN DE PAIEMENT
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
            {paymentMethods.map((p) => (
              <button
                key={p.provider}
                type="button"
                onClick={() => setPayId(p.provider)}
                className="text-left border-[1.5px] border-border-mid bg-[#FFFBF7] rounded-[18px] p-4 hover:border-orange"
              >
                <div className="flex items-center gap-2.5">
                  <div className="text-[15px] font-extrabold text-ink">{p.label}</div>
                  {payId === p.provider && (
                    <span className="ml-auto text-[10.5px] font-extrabold bg-orange text-white px-2.25 py-1 rounded-full">
                      CHOISI
                    </span>
                  )}
                </div>
                <div className="font-grifter text-xl text-deep mt-2">{p.number}</div>
                <div className="text-xs text-text-tertiary">{p.holder}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4.5 mt-6.5 flex-wrap">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!name || !phone || !address}
              className="border-0 bg-ink text-cream px-7 py-4 rounded-full text-[15.5px] font-extrabold hover:bg-deep disabled:opacity-50"
            >
              Continuer · {fmt(total)}
            </button>
            <a href="/panier" className="border-0 bg-transparent text-text-tertiary-3 text-sm font-bold">
              ← Retour au panier
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border-light rounded-[26px] p-[clamp(20px,4vw,28px)]">
          <div className="font-grifter text-2xl text-deep">2 · Preuve du transfert</div>

          <div className="mt-5 bg-cream-2 rounded-[20px] p-5.5">
            <div className="text-[13px] text-[#7A4736] font-bold">Envoyez exactement</div>
            <div className="font-grifter text-[42px] text-deep leading-tight">{fmt(total)}</div>
            <div className="grid gap-2 mt-3.5">
              {paymentMethods
                .filter((p) => p.provider === payId)
                .map((p) => (
                  <div key={p.provider} className="flex items-center gap-3 bg-white rounded-[14px] px-3.75 py-3">
                    <span className="text-[13.5px] font-extrabold text-ink min-w-30">{p.label}</span>
                    <span className="font-grifter text-[19px] text-deep">{p.number}</span>
                    <span className="text-xs text-text-tertiary ml-auto">{p.holder}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid gap-4 mt-5.5">
            <label className="grid gap-1.75 text-xs font-extrabold tracking-[.1em] text-label">
              RÉFÉRENCE DE LA TRANSACTION
              <input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="ex. MP260814.1120.A7741"
                className="border-[1.5px] border-border-mid rounded-[13px] px-3.5 py-3.25 text-[15px] text-ink bg-[#FFFBF7]"
              />
            </label>

            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="text-left border-[1.5px] border-dashed border-border-mid-3 bg-[#FFFBF7] rounded-[18px] p-5 flex items-center gap-3.5 hover:border-orange disabled:opacity-70"
            >
              <div className="w-11 h-11 rounded-xl bg-peach grid place-items-center text-xl text-deep">↑</div>
              <div>
                <div className="text-[14.5px] font-extrabold text-ink">
                  {uploading ? "Envoi en cours…" : "Joindre la capture du reçu"}
                </div>
                <div className="text-[12.5px] text-text-tertiary">
                  PNG ou JPG — facultatif si la référence est saisie
                </div>
              </div>
              {proofUrl && (
                <span className="ml-auto text-[11px] font-extrabold bg-[#6FE39B] text-ink px-2.5 py-1.25 rounded-full">
                  CAPTURE JOINTE
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4.5 mt-6.5 flex-wrap">
            {canConfirm && (
              <button
                type="button"
                onClick={confirm}
                disabled={confirming}
                className="border-0 bg-orange text-white px-7.5 py-4.25 rounded-full text-base font-extrabold shadow-[0_14px_32px_rgba(251,97,23,.34)] hover:bg-deep disabled:opacity-60"
              >
                {confirming ? "Confirmation…" : "Confirmer ma commande"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border-0 bg-transparent text-text-tertiary-3 text-sm font-bold"
            >
              ← Étape précédente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
