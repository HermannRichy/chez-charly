import type { ComponentType } from "react";
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  /** Variation en % vs période précédente ; null = pas de comparaison disponible. */
  delta?: number | null;
  icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11.5px] font-bold tracking-[.1em] text-muted-foreground">{label}</div>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div className="font-grifter text-3xl text-foreground mt-2 leading-none">{value}</div>
      <footer className="mt-2.5 flex items-center gap-1.5 text-xs">
        {delta == null ? (
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMinus size={13} />
            Pas de comparaison
          </span>
        ) : delta === 0 ? (
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMinus size={13} />
            Stable
          </span>
        ) : (
          <span className={cn("flex items-center gap-1 font-bold", delta > 0 ? "text-[#6FE39B]" : "text-destructive")}>
            {delta > 0 ? <IconTrendingUp size={13} /> : <IconTrendingDown size={13} />}
            {delta > 0 ? "+" : ""}
            {delta}% vs hier
          </span>
        )}
      </footer>
    </div>
  );
}
