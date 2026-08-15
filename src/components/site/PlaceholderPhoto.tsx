import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photo de plat : motif rayé tant que `imageUrl` (Cloudinary) est absent —
 * le client gère ses photos lui-même via le dashboard (README).
 */
export function PlaceholderPhoto({
  src,
  alt,
  className,
  label,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  label?: string;
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "placeholder-photo relative grid place-items-center overflow-hidden",
        className,
      )}
    >
      {label && (
        <span className="font-mono text-[11px] text-[#9A6A55] text-center px-2">{label}</span>
      )}
    </div>
  );
}
