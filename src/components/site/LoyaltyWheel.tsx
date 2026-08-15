"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { spinAction } from "@/app/(site)/fidelite/actions";

export function LoyaltyWheel({
  prizes,
  initialSpins,
}: {
  prizes: string[];
  initialSpins: number;
}) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const degRef = useRef(0);

  const [spins, setSpins] = useState(initialSpins);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const n = prizes.length;
  const conic = `conic-gradient(${prizes
    .map((_, i) => {
      const a = (100 / n) * i;
      const b = (100 / n) * (i + 1);
      return `${i % 2 ? "#B71D29" : "#FB6117"} ${a}% ${b}%`;
    })
    .join(",")})`;

  const { contextSafe } = useGSAP(() => {}, { scope: wheelRef });

  const spin = contextSafe(async () => {
    if (spinning || spins < 1) return;
    setSpinning(true);
    setError(null);
    setPrize(null);

    try {
      const { prizeIndex, prizeLabel } = await spinAction();
      const turns = 5 + Math.random();
      const target =
        degRef.current + turns * 360 + (360 - prizeIndex * (360 / n) - 180 / n);

      gsap.to(wheelRef.current, {
        rotate: target,
        duration: 4,
        ease: "cubic-bezier(.13,.86,.11,1)",
        onComplete: () => {
          degRef.current = target;
          setSpinning(false);
          setPrize(prizeLabel);
          setSpins((s) => s - 1);
        },
      });
    } catch (err) {
      setSpinning(false);
      setError(err instanceof Error ? err.message : "Impossible de tourner la roue.");
    }
  });

  return (
    <div className="bg-white border border-border-light rounded-[26px] p-[clamp(20px,4vw,30px)] text-center">
      <div className="font-grifter text-2xl text-deep">Roue de la chance</div>
      <p className="text-sm text-[#7A4736] mt-2 mb-5.5">
        Un tour offert à chaque palier atteint. Tours disponibles : <b>{spins}</b>
      </p>

      <div className="relative w-[min(260px,74vw)] aspect-square mx-auto">
        <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-r-[11px] border-t-[18px] border-l-transparent border-r-transparent border-t-ink z-[3]" />
        <div
          ref={wheelRef}
          className="absolute inset-0 rounded-full border-[9px] border-ink overflow-hidden"
          style={{ background: conic }}
        >
          {prizes.map((label, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 text-[11px] font-bold tracking-[.02em] w-21"
              style={{
                transformOrigin: "0 0",
                transform: `rotate(${i * (360 / n) + 180 / n}deg) translate(58px, -9px)`,
                color: i % 2 ? "#FFF4EC" : "#3A0D08",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 w-13.5 h-13.5 -ml-6.75 -mt-6.75 rounded-full bg-cream border-[5px] border-ink z-[2]" />
      </div>

      {error && <div className="text-[13px] font-semibold text-deep mt-4">{error}</div>}

      {!spinning && spins > 0 && (
        <button
          type="button"
          onClick={spin}
          className="mt-6.5 border-0 bg-orange text-white px-8 py-4 rounded-full text-base font-extrabold shadow-[0_14px_32px_rgba(251,97,23,.34)] hover:bg-deep"
        >
          Tourner la roue
        </button>
      )}
      {spinning && (
        <div className="mt-6.5 text-[15px] font-extrabold text-text-tertiary">La roue tourne…</div>
      )}
      {!spinning && spins === 0 && !prize && (
        <div className="mt-6.5 text-[15px] font-extrabold text-text-tertiary">Aucun tour disponible</div>
      )}

      {prize && (
        <div className="mt-5.5 bg-cream-2 rounded-[18px] p-4.5 text-left">
          <div className="text-xs font-extrabold tracking-[.12em] text-label">VOUS AVEZ GAGNÉ</div>
          <div className="font-grifter text-[30px] text-deep mt-1">{prize}</div>
          <div className="text-[12.5px] text-[#7A4736] mt-1.5">
            Le lot s&apos;applique automatiquement à votre prochaine commande.
          </div>
        </div>
      )}
    </div>
  );
}
