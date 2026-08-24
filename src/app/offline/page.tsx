import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen grid place-items-center px-4.5 text-center bg-[radial-gradient(1100px_640px_at_78%_8%,#FFE2CE_0%,rgba(255,226,206,0)_62%),#FFF4EC]">
      <div>
        {/* next/image passe par une route d'optimisation qui n'existe pas hors-ligne :
            l'asset brut est précaché tel quel par le service worker (public/sw.js). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-charly.png" alt="Chez Charly" className="h-16 w-auto mx-auto" />
        <h1 className="font-grifter text-2xl sm:text-3xl text-ink mt-5">Vous êtes hors-ligne</h1>
        <p className="text-sm lg:text-lg text-[#6A392C] max-w-sm mx-auto mt-3">
          Impossible de charger cette page sans connexion. Vérifiez votre réseau et réessayez.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Link
            href="/"
            className="bg-orange text-white px-7 py-4 rounded-full text-xs lg:text-base font-extrabold shadow-[0_14px_34px_rgba(251,97,23,.36)] hover:bg-deep"
          >
            Réessayer
          </Link>
        </div>
      </div>
    </div>
  );
}
