import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center px-4 py-10 bg-[radial-gradient(1100px_640px_at_78%_8%,#FFE2CE_0%,rgba(255,226,206,0)_62%),#FFF4EC]">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="flex justify-center mb-7.5">
          <Image src="/logo-charly.png" alt="Chez Charly" height={56} width={220} className="h-14 w-auto" />
        </Link>
        {children}
      </div>
    </div>
  );
}
