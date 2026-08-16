import { cn } from "@/lib/utils";

/**
 * Interrupteur avec libellé fixe (jamais "Disponible" -> "Épuisé" au clic) :
 * un bouton dont le texte décrit l'état courant donne l'impression que
 * cliquer "Disponible" produit "Épuisé", ce qui se lit comme un
 * comportement inversé. Ici seul le rail/curseur change, le texte reste
 * stable et décrit ce que le réglage contrôle, pas son état.
 */
export function AdminSwitch({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
      <div className="min-w-0">
        <div className="text-sm font-bold text-foreground">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative w-10 h-5.5 rounded-full shrink-0 transition-colors disabled:opacity-50",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform",
            checked && "translate-x-4.5",
          )}
        />
      </button>
    </label>
  );
}
