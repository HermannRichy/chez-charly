import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Tone = "success" | "warning" | "info" | "neutral" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-[#6FE39B]/15 text-[#6FE39B] border-[#6FE39B]/30",
  warning: "bg-amber/15 text-amber border-amber/30",
  info: "bg-primary/15 text-primary border-primary/30",
  neutral: "bg-muted text-muted-foreground border-transparent",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn("font-bold", TONE_CLASSES[tone])}>
      {children}
    </Badge>
  );
}
