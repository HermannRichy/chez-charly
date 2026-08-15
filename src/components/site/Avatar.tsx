function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dims =
    size === "lg"
      ? "w-16 h-16 text-xl"
      : size === "sm"
        ? "w-9 h-9 text-[12px]"
        : "w-11 h-11 text-sm";

  return (
    <div
      className={`${dims} rounded-full bg-orange text-white font-extrabold grid place-items-center shrink-0`}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
