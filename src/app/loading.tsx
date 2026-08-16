import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-cream">
      <Image
        src="/logo-charly.png"
        alt="Chez Charly"
        width={96}
        height={96}
        className="h-20 w-auto animate-pulse"
        priority
      />
    </div>
  );
}
