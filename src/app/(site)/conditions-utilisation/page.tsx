import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
};

export default function ConditionsUtilisationPage() {
  return (
    <div className="max-w-165 mx-auto px-4.5 py-[clamp(46px,8vw,74px)]">
      <h1 className="font-grifter text-[clamp(32px,5vw,48px)] leading-[.98] text-ink">
        Conditions générales d&apos;utilisation
      </h1>

      <div className="grid gap-7 mt-8 text-sm lg:text-lg leading-[1.65] text-[#4A2318]">
        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">1. Objet</h2>
          <p>
            Ces conditions encadrent l&apos;utilisation du site Chez Charly : consultation du
            menu, commande en ligne, livraison ou retrait au resto, programme de fidélité et
            suivi de commande. En passant commande, vous acceptez ces conditions.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">2. Compte client</h2>
          <p>
            La création d&apos;un compte (nom, téléphone, e-mail) est nécessaire pour commander,
            suivre vos commandes et cumuler des points de fidélité. Vous êtes responsable de la
            confidentialité de vos identifiants.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">3. Commandes et prix</h2>
          <p>
            Les prix affichés sont en francs CFA et peuvent évoluer sans préavis ; le prix
            appliqué est celui en vigueur au moment de la commande. Chez Charly se réserve le
            droit de refuser ou d&apos;annuler une commande en cas d&apos;indisponibilité d&apos;un
            plat ou d&apos;anomalie manifeste de prix.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">4. Paiement</h2>
          <p>
            Le paiement se fait par Mobile Money (MTN MoMo ou Moov Money) : vous effectuez le
            transfert puis renseignez la référence de transaction (et, si besoin, une capture
            d&apos;écran) au moment de la commande. La commande est confirmée après vérification
            manuelle du paiement par le restaurant.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">5. Livraison et retrait</h2>
          <p>
            La livraison est proposée sur les zones indiquées au moment de la commande, avec un
            délai estimatif communiqué à titre indicatif. Le retrait sur place au restaurant est
            également disponible. Chez Charly ne peut être tenu responsable d&apos;un retard dû à
            des circonstances hors de son contrôle (circulation, météo).
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">6. Programme de fidélité</h2>
          <p>
            Chaque commande payée rapporte des points de fidélité, selon la règle en vigueur
            affichée sur la page Fidélité. Le franchissement d&apos;un palier peut débloquer un
            tour de roue de la chance. Les points n&apos;ont pas de valeur monétaire et ne sont ni
            cessibles ni remboursables.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">7. Responsabilité</h2>
          <p>
            Chez Charly met tout en œuvre pour assurer l&apos;exactitude des informations du site
            mais ne saurait garantir une disponibilité continue ou une absence totale d&apos;erreur.
          </p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">8. Droit applicable</h2>
          <p>Les présentes conditions sont soumises au droit béninois.</p>
        </section>

        <section>
          <h2 className="font-grifter text-xl text-deep mb-2">9. Contact</h2>
          <p>
            Pour toute question,{" "}
            <a href="tel:+2290161555722" className="underline">
              +229 01 61 55 57 22
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
