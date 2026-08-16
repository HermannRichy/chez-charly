import { cn } from "@/lib/utils";

/**
 * Déco vectorielle dans l'esprit des anneaux flottants du hero (bordure
 * épaisse, faible opacité, `animate-float-*`) mais en traits ouverts -
 * un cercle CSS ne peut tracer ni un arc partiel ni une courbe cursive.
 */

const PATHS = {
  /** Arc ouvert, ~270°. */
  arc: "M20 80 A40 40 0 1 1 80 80",
  /** Geste à main levée façon "e" cursif : entrée basse, boucle, sortie qui continue le trait. */
  e: "M12 62 C4 46 12 26 30 25 C48 24 54 38 40 42 C28 45 24 32 36 27 C52 21 70 27 80 42",
  /** Paraphe façon "l" cursif. */
  l: "M35 15 C25 15 25 30 35 35 C50 42 50 60 35 75 C28 82 30 88 40 85",
  /** Vaguelette. */
  wave: "M6 55 C22 25 35 85 50 55 C65 25 78 85 94 55",
  /** Trait qui s'élance avec un petit crochet final. */
  swoosh: "M6 84 C32 76 50 54 62 38 C68 30 72 20 66 12",
  /** Griffonnage en spirale lâche. */
  spiral: "M50 50 C50 33 68 33 68 50 C68 67 38 68 36 48 C34 26 66 22 76 44",
} as const;

export function CurveAccent({
  variant,
  color,
  rotate = 0,
  strokeWidth = 11,
  className,
}: {
  variant: keyof typeof PATHS;
  color: string;
  /** Degrés - à varier d'une instance à l'autre pour casser la répétition. */
  rotate?: number;
  strokeWidth?: number;
  /** Doit inclure la taille (`w-*`/`h-*`, mobile-first) - pas de taille fixe par défaut. */
  className: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={cn("pointer-events-none", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d={PATHS[variant]}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
