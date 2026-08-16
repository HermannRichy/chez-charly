import { cn } from "@/lib/utils";

export function TableCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
