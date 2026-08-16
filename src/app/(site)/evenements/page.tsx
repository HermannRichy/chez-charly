import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { fmt, fmtNumber } from "@/lib/format";

/** Photos réelles de l'édition précédente (28 juin), fournies dans public/rdv-attieke-event. */
const PAST_EVENT_PHOTOS = [
  { src: "/rdv-attieke-event/lieu.jpeg", alt: "Vue aérienne du lieu du RDV de l'Attiéké" },
  { src: "/rdv-attieke-event/jeux.jpeg", alt: "Partie de Puissance 4 pendant la soirée" },
  { src: "/rdv-attieke-event/plats.jpeg", alt: "Poissons braisés servis aux invités" },
  { src: "/rdv-attieke-event/vibes.jpeg", alt: "Ambiance de la soirée, décorée aux couleurs de l'événement" },
  { src: "/rdv-attieke-event/miam.jpeg", alt: "Un invité savourant son assiette" },
  { src: "/rdv-attieke-event/aaa.jpeg", alt: "Invitées en pleine soirée" },
  { src: "/rdv-attieke-event/babshv.jpeg", alt: "Partie de baby-foot entre invités" },
  { src: "/rdv-attieke-event/bczjhcjs.jpeg", alt: "Groupe d'amies souriantes à la soirée" },
  { src: "/rdv-attieke-event/bjhcjhdcb.jpeg", alt: "Invités du RDV de l'Attiéké" },
  { src: "/rdv-attieke-event/bvdjhv.jpeg", alt: "Un invité savourant du poulet grillé" },
  { src: "/rdv-attieke-event/crocsvsjh.jpeg", alt: "Préparation des grillades sur place" },
  { src: "/rdv-attieke-event/fghiiu.jpeg", alt: "Invitée à la soirée" },
  { src: "/rdv-attieke-event/hdkdj.jpeg", alt: "Invitée devant le stand" },
  { src: "/rdv-attieke-event/hjehfgej.jpeg", alt: "Jeune invitée du RDV de l'Attiéké" },
  { src: "/rdv-attieke-event/jvjsxcvsjh.jpeg", alt: "Invité dansant pendant la soirée" },
  { src: "/rdv-attieke-event/mshdj.jpeg", alt: "Table conviviale autour des grillades" },
  { src: "/rdv-attieke-event/phhnchdn.jpeg", alt: "Stand Chez Charly pendant l'événement" },
  { src: "/rdv-attieke-event/pjddbbx.jpeg", alt: "Deux invités dégustant leur plat" },
  { src: "/rdv-attieke-event/sobjscdh.jpeg", alt: "Invitée posant avec son assiette" },
  { src: "/rdv-attieke-event/whatsapp-25.jpeg", alt: "Photo souvenir du RDV de l'Attiéké" },
  { src: "/rdv-attieke-event/whatsapp-26.jpeg", alt: "Photo souvenir du RDV de l'Attiéké" },
  { src: "/rdv-attieke-event/whatsapp-27.jpeg", alt: "Photo souvenir du RDV de l'Attiéké" },
];

export default function EvenementsPage() {
  return (
    <div>
      <div className="flex h-2.5">
        <div className="flex-[2] bg-orange" />
        <div className="flex-1 bg-[#1B6FD6]" />
        <div className="flex-[1.4] bg-[#8CC63F]" />
        <div className="flex-[.8] bg-deep" />
        <div className="flex-[2.2] bg-ink" />
      </div>

      <section className="relative overflow-hidden px-4.5 pt-[clamp(38px,7vw,74px)] pb-[clamp(46px,7vw,78px)] bg-ink text-cream">
        <div className="animate-float-1 absolute w-155 h-155 rounded-full border-[44px] border-[#1B6FD6] opacity-22 -right-55 -top-60" />
        <div className="animate-float-2 absolute w-65 h-65 rounded-full border-[26px] border-orange opacity-30 -left-27.5 -bottom-30" />

        <div className="max-w-310 mx-auto relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(28px,4vw,48px)] items-center">
          <div>
            <div className="inline-flex items-center gap-2.25 px-3.75 py-1.75 rounded-full bg-[#8CC63F] text-[#12250A] text-xs font-extrabold tracking-[.06em]">
              PROCHAIN RENDEZ-VOUS · 30 AOÛT
            </div>
            <h1 className="font-grifter text-[clamp(46px,10vw,96px)] leading-[.88] mt-5 tracking-[-.02em]">
              After Party
              <br />
              <span className="text-orange">du RDV de l&apos;Attiéké</span>
            </h1>
            <p className="text-lg leading-[1.55] text-[#E4C6B7] max-w-120 mt-5 text-pretty">
              Chez Charly & Moriland CITY remettent le couvert. Chill, plat d&apos;attiéké bien
              chargé, shooting photo, jeux et réseautage - au bord de l&apos;eau à Hêvié.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-6.5">
              <div className="bg-[#8CC63F] text-[#12250A] px-4.5 py-3 rounded-[14px]">
                <div className="text-[10.5px] font-extrabold tracking-[.1em] opacity-70">PRIX</div>
                <div className="font-grifter text-2xl leading-tight">{fmt(3500)}</div>
              </div>
              <div className="bg-orange text-white px-4.5 py-3 rounded-[14px]">
                <div className="text-[10.5px] font-extrabold tracking-[.1em] opacity-80">DATE</div>
                <div className="font-grifter text-2xl leading-tight">30 août</div>
              </div>
              <div className="bg-[#1B6FD6] text-white px-4.5 py-3 rounded-[14px]">
                <div className="text-[10.5px] font-extrabold tracking-[.1em] opacity-80">LIEU</div>
                <div className="font-grifter text-xl leading-snug">Moriland CITY, Hêvié</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="tel:+2290161555722"
                className="bg-orange text-white px-7 py-4.25 rounded-full text-base font-extrabold shadow-[0_14px_34px_rgba(251,97,23,.36)] min-h-11 inline-flex items-center hover:bg-cream hover:text-deep"
              >
                Réserver ma place
              </a>
              <a
                href="tel:+2290161555722"
                className="border-[1.5px] border-white/40 text-cream px-6.5 py-4.25 rounded-full text-[15.5px] font-extrabold min-h-11 inline-flex items-center hover:border-orange hover:text-orange"
              >
                Infos & résa · 01 61 55 57 22
              </a>
            </div>
            <div className="text-[13.5px] text-[#B9917F] mt-4">
              Moriland CITY, Hêvié - von de la pharmacie Hêvié. Un pass acheté = 35 points de
              fidélité.
            </div>
          </div>

          <Reveal variant="in" className="relative">
            <div className="rounded-[26px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,.4)] border-8 border-cream relative aspect-[4/5]">
              <Image
                src="/photos/event-after-party.jpg"
                alt="Affiche After Party du RDV de l'Attiéké, 30 août"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="flex h-2.5">
        <div className="flex-[1.6] bg-[#8CC63F]" />
        <div className="flex-[2.4] bg-orange" />
        <div className="flex-1 bg-deep" />
        <div className="flex-[1.8] bg-[#1B6FD6]" />
      </div>

      <section className="max-w-310 mx-auto px-4.5 py-[clamp(52px,8vw,86px)]">
        <h2 className="font-grifter text-[clamp(32px,4.2vw,54px)] leading-[.96] text-ink">
          Au programme
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3.5 mt-7.5">
          {[
            { title: "Plat d'attiéké", body: "Bien chargé - poisson, poulet ou viande, servi sur place." },
            { title: "Chill & musique", body: "Ambiance détendue, bonne playlist, cadre ouvert." },
            { title: "Shooting photo", body: "Un coin décor pour repartir avec vos photos." },
            { title: "Jeux & réseautage", body: "Défis, rencontres - on repart avec des contacts." },
          ].map((item) => (
            <Reveal key={item.title} className="bg-peach rounded-[22px] p-6">
              <div className="font-grifter text-2xl text-deep">{item.title}</div>
              <p className="text-[14.5px] text-[#6A392C] leading-[1.55] mt-2">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream-2 px-4.5 py-[clamp(52px,8vw,86px)]">
        <div className="max-w-310 mx-auto">
          <div className="flex items-end justify-between gap-5 flex-wrap">
            <div>
              <div className="text-xs font-extrabold tracking-[.14em] text-deep">ÉDITION PRÉCÉDENTE</div>
              <h2 className="font-grifter text-[clamp(30px,4vw,48px)] mt-3 leading-[.98] text-ink">
                Le RDV de l&apos;Attiéké - 28 juin
              </h2>
              <p className="text-base text-[#6A392C] mt-2.5">
                L&apos;Olympe, sur les pavés menant à Godomey. Pass {fmtNumber(3500)} /{" "}
                {fmtNumber(5000)} / {fmt(10000)}, complet.
              </p>
            </div>
            <Link
              href="/menu"
              className="border-0 bg-ink text-cream px-6.5 py-3.75 rounded-full text-[15px] font-extrabold min-h-11 inline-flex items-center hover:bg-deep"
            >
              Commander le même attiéké
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-7">
            <div className="aspect-square rounded-[18px] overflow-hidden bg-ink relative">
              <Image
                src="/photos/event-rdv-attieke.jpg"
                alt="Affiche Le RDV de l'Attiéké du 28 juin"
                fill
                className="object-contain"
              />
            </div>
            {PAST_EVENT_PHOTOS.map((p) => (
              <div key={p.src} className="aspect-square rounded-[18px] overflow-hidden relative">
                <Image src={p.src} alt={p.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
