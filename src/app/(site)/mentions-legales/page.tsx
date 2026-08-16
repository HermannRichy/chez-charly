import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-165 mx-auto px-4.5 py-[clamp(46px,8vw,74px)]">
      <h1 className="font-grifter text-[clamp(32px,5vw,48px)] leading-[.98] text-ink">
        Mentions légales
      </h1>

      <div className="grid gap-7 mt-8 text-sm lg:text-lg leading-[1.65] text-[#4A2318]">
        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">Éditeur du site</h2>
          <p>
            Chez Charly - maquis &amp; livraison.
            <br />
            Abomey-Calavi, Womey Adjikpegon, en face du bar Nid d&apos;oiseau, Bénin.
            <br />
            Téléphone :{" "}
            <a href="tel:+2290161555722" className="underline">
              +229 01 61 55 57 22
            </a>
            <br />
            Numéro d&apos;identification fiscale (IFU) / RCCM : à compléter par l&apos;exploitant.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">Directeur de publication</h2>
          <p>À compléter par l&apos;exploitant (nom du responsable légal de l&apos;établissement).</p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">Hébergement</h2>
          <p>
            Site hébergé par Vercel Inc. (vercel.com). Base de données hébergée par Neon
            (neon.tech).
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">Cookies</h2>
          <p>
            Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement :
            contenu du panier et session de connexion. Aucun cookie publicitaire ou traceur tiers
            n&apos;est déposé.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, photos, logo) est la
            propriété de Chez Charly, sauf mention contraire, et ne peut être reproduit sans
            autorisation préalable.
          </p>
        </section>
      </div>
    </div>
  );
}
