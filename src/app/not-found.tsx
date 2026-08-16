import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4.5 text-center bg-[radial-gradient(1100px_640px_at_78%_8%,#FFE2CE_0%,rgba(255,226,206,0)_62%),#FFF4EC]">
      <div>
        <Image
          src="/logo-charly.png"
          alt="Chez Charly"
          width={90}
          height={90}
          className="h-16 w-auto mx-auto"
        />
        <div className="font-grifter text-[clamp(64px,16vw,140px)] leading-none text-deep mt-4">
          404
        </div>
        <h1 className="font-grifter text-xl sm:text-2xl text-ink mt-2">
          Cette page n&apos;est pas au menu
        </h1>
        <p className="text-sm lg:text-lg text-[#6A392C] max-w-sm mx-auto mt-3">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Link
            href="/"
            className="bg-orange text-white px-7 py-4 rounded-full text-xs lg:text-base font-extrabold shadow-[0_14px_34px_rgba(251,97,23,.36)] hover:bg-deep"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/menu"
            className="border-[1.5px] border-ink text-ink px-7 py-4 rounded-full text-xs lg:text-base font-extrabold hover:bg-ink hover:text-cream"
          >
            Voir le menu
          </Link>
        </div>
      </div>
    </div>
  );
}
