import { cn } from "@/lib/utils";

/**
 * Système de déco repris de la bande multicolore de /evenements (segments
 * flex de largeurs inégales, palette de marque) - décliné en plusieurs
 * formes pour habiller les sections et cards de l'accueil sans répéter
 * platement la même barre partout.
 */

const BAR_RATIOS = [2, 1, 1.4, 0.8, 2.2];

export function ColorBar({
  colors,
  className,
}: {
  colors: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex h-2.5", className)} aria-hidden>
      {colors.map((color, i) => (
        <div key={i} style={{ flex: BAR_RATIOS[i % BAR_RATIOS.length], backgroundColor: color }} />
      ))}
    </div>
  );
}

/** Cercle qui déborde d'un coin de card - le parent doit être `relative overflow-hidden`. */
export function CornerArc({
  color,
  size = 96,
  className,
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute rounded-full opacity-[.16] pointer-events-none", className)}
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

/** Bande ondulée en transition entre deux sections. */
export function WaveDivider({
  color,
  flip = false,
  className,
}: {
  color: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={cn("w-full h-[clamp(22px,4.5vw,52px)]", flip && "rotate-180", className)}
    >
      <path
        d="M0,30 C150,58 300,2 450,30 C600,58 750,2 900,30 C1030,53 1130,18 1200,28 L1200,60 L0,60 Z"
        fill={color}
      />
    </svg>
  );
}

/** Trait courbe façon paraphe - accent "cursif", pas une vraie lettre. */
export function SwashAccent({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 60 60" className={cn("pointer-events-none", className)}>
      <path
        d="M8 44 C-2 30 6 12 22 12 C36 12 40 24 30 28 C20 32 14 22 22 18 C30 14 40 18 44 28"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
