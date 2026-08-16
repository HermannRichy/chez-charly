import type { ComponentType } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-muted grid place-items-center text-muted-foreground">
        <Icon size={22} />
      </div>
      <div>
        <div className="font-bold text-foreground">{title}</div>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
