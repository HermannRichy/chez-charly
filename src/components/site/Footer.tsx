import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-ink text-[#C6A292] px-[18px] pt-9 sm:pt-[52px] pb-[30px]">
      <div className="max-w-310 mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-7 items-start">
        <div>
          <Image
            src="/logo-charly-nb.png"
            alt="Chez Charly"
            height={116}
            width={116}
            className="h-29 w-auto brightness-0 invert opacity-[.92]"
          />
          <p className="text-sm leading-relaxed max-w-[320px] mt-3.5">
            Maquis & livraison à Abomey-Calavi. Toujours bien chargé, depuis le premier plat.
          </p>
        </div>

        <div>
          <div className="text-[11.5px] font-extrabold tracking-[.12em] text-orange">NAVIGUER</div>
          <div className="grid mt-2 text-sm">
            <Link href="/menu" className="text-[#C6A292] py-3 min-h-11 flex items-center hover:text-orange">
              Menu complet
            </Link>
            <Link href="/evenements" className="text-[#C6A292] py-3 min-h-11 flex items-center hover:text-orange">
              Événements & after party
            </Link>
            <Link href="/fidelite" className="text-[#C6A292] py-3 min-h-11 flex items-center hover:text-orange">
              Programme fidélité
            </Link>
            <Link href="/suivi" className="text-[#C6A292] py-3 min-h-11 flex items-center hover:text-orange">
              Suivre ma commande
            </Link>
            <Link href="/admin" className="text-[#C6A292] py-3 min-h-11 flex items-center hover:text-orange">
              Espace restaurant
            </Link>
          </div>
        </div>

        <div>
          <div className="text-[11.5px] font-extrabold tracking-[.12em] text-orange">NOUS JOINDRE</div>
          <div className="grid gap-2.5 mt-3 text-sm">
            <a href="tel:+2290161555722" className="text-[#C6A292] min-h-11 inline-flex items-center">
              +229 01 61 55 57 22
            </a>
            <span>Womey Adjikpegon, Abomey-Calavi</span>
            <span>Tous les jours · 10 h - 23 h</span>
            <span>MTN MoMo · Moov Money</span>
          </div>
        </div>
      </div>
      <div className="max-w-310 mx-auto mt-8.5 pt-5 border-t border-[#C6A292]/20 text-[12.5px] text-[#8E7061]">
        © 2026 Chez Charly. Tous droits réservés.
      </div>
    </footer>
  );
}
