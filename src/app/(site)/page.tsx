import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/pricing";
import { fmt, fmtNumber } from "@/lib/format";
import { Marquee } from "@/components/site/Marquee";
import { PlaceholderPhoto } from "@/components/site/PlaceholderPhoto";
import { ImageSwiper } from "@/components/site/ImageSwiper";
import { Reveal } from "@/components/site/Reveal";
import { AddToCartButton } from "@/components/site/AddToCartButton";

export default async function AccueilPage() {
    const [featured, tiers, settings] = await Promise.all([
        prisma.menuItem.findMany({
            where: { featured: true, active: true },
            take: 4,
        }),
        prisma.loyaltyTier.findMany({ orderBy: { sortOrder: "asc" } }),
        getSettings(),
    ]);

    return (
        <div>
            {/* ─── Hero ─────────────────────────────────────────────────────────── */}
            <section className="relative px-4.5 pt-[clamp(38px,7vw,74px)] pb-[clamp(54px,8vw,96px)] overflow-hidden bg-[radial-gradient(1100px_640px_at_78%_8%,#FFE2CE_0%,rgba(255,226,206,0)_62%),#FFF4EC]">
                <div className="animate-float-1 absolute w-[460px] h-[460px] rounded-full bg-orange opacity-16 blur-[10px] -top-32.5 -right-20" />
                <div className="animate-float-2 absolute w-[300px] h-[300px] rounded-full bg-deep opacity-12 blur-[8px] -bottom-27.5 -left-17.5" />

                <div className="max-w-310 mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))] gap-[clamp(30px,5vw,54px)] items-center relative">
                    <div>
                        <div className="inline-flex items-center gap-2.25 pl-2.25 pr-3.75 py-1.75 rounded-full bg-white border border-[#F2D3C0] text-xs font-bold text-[#8A4230]">
                            <span className="animate-pulse-ring w-2.25 h-2.25 rounded-full bg-[#21A85B]" />
                            Ouvert · Abomey-Calavi, Womey
                        </div>

                        <h1 className="font-grifter text-[clamp(46px,12vw,116px)] leading-[.86] tracking-[-.02em] mt-5.5 text-deep text-balance">
                            Toujours
                            <br />
                            bien{" "}
                            <span className="animate-shine bg-[linear-gradient(96deg,#FB6117,#B71D29,#FB6117)] bg-[length:200%_100%] bg-clip-text text-transparent">
                                chargé
                            </span>
                        </h1>

                        <p className="max-w-[480px] text-sm leading-[1.55] text-[#6A392C] mt-6 text-pretty">
                            Attiéké poisson, riz aileron, alloco brûlant.
                            Commandez en ligne, payez par MoMo, on livre à
                            Calavi et chaque commande vous rapporte des points.
                        </p>

                        <div className="flex gap-3 mt-8.5 flex-wrap">
                            <Link
                                href="/menu"
                                className="border-0 bg-orange text-white px-7.5 py-4.25 rounded-full text-base font-extrabold shadow-[0_14px_34px_rgba(251,97,23,.36)] transition hover:-translate-y-0.75 hover:shadow-[0_20px_44px_rgba(251,97,23,.46)]"
                            >
                                Commander maintenant
                            </Link>
                            <Link
                                href="/fidelite"
                                className="border-[1.5px] border-ink bg-transparent text-ink px-7 py-4.25 rounded-full text-base font-extrabold transition hover:bg-ink hover:text-cream"
                            >
                                Mes points fidélité
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-x-7.5 gap-y-5.5 mt-10">
                            <div>
                                <div className="font-grifter text-[32px] text-deep">
                                    {fmt(500)}
                                </div>
                                <div className="text-[12.5px] text-[#8A6154] font-semibold">
                                    Le plat le plus doux
                                </div>
                            </div>
                            <div className="w-px bg-[#EBD0BF]" />
                            <div>
                                <div className="font-grifter text-[32px] text-deep">
                                    20 min
                                </div>
                                <div className="text-[12.5px] text-[#8A6154] font-semibold">
                                    Livraison Womey
                                </div>
                            </div>
                            <div className="w-px bg-[#EBD0BF]" />
                            <div>
                                <div className="font-grifter text-[32px] text-deep">
                                    312
                                </div>
                                <div className="text-[12.5px] text-[#8A6154] font-semibold">
                                    Membres fidélité
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-[8%_6%] rounded-full bg-orange opacity-22 blur-[30px]" />
                        <div className="animate-float-1 relative aspect-square rounded-full overflow-hidden border-[14px] border-deep placeholder-photo grid place-items-center shadow-[0_40px_80px_rgba(122,45,25,.24)]">
                            <Image
                                src="/photos/attieke.jpg"
                                alt="Attiéké, alloco et poulet mayo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="animate-float-2 absolute bottom-[6%] -left-[6%] bg-white rounded-[20px] px-4.5 py-3.5 shadow-[0_22px_48px_rgba(122,45,25,.2)]">
                            <div className="text-[11px] font-extrabold text-[#8A6154] tracking-[.08em]">
                                POINTS GAGNÉS
                            </div>
                            <div className="font-grifter text-[28px] text-orange">
                                +50 pts
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Marquee />

            {/* ─── Bandeau événement ────────────────────────────────────────────── */}
            <section className="max-w-310 mx-auto px-4.5 pt-[clamp(46px,7vw,74px)]">
                <Reveal className="rounded-[28px] overflow-hidden bg-ink text-cream grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-stretch">
                    <div className="p-[clamp(24px,3.6vw,40px)] grid content-center gap-3.5">
                        <div className="flex gap-1.5 items-center">
                            <span className="w-7.5 h-2 rounded-sm bg-orange" />
                            <span className="w-4 h-2 rounded-sm bg-[#8CC63F]" />
                            <span className="w-5.5 h-2 rounded-sm bg-[#1B6FD6]" />
                            <span className="text-[11.5px] font-extrabold tracking-[.14em] text-orange ml-1.5">
                                30 AOÛT · HÊVIÉ
                            </span>
                        </div>
                        <div className="font-grifter text-[clamp(28px,3.4vw,44px)] leading-[.98]">
                            After Party du
                            <br />
                            RDV de l&apos;Attiéké
                        </div>
                        <p className="text-[15.5px] text-[#D9B7A7] leading-[1.55] max-w-[420px]">
                            Plat d&apos;attiéké, chill, shooting, jeux et
                            réseautage à Moriland CITY. Pass {fmt(3500)}.
                        </p>
                        <div>
                            <Link
                                href="/evenements"
                                className="inline-block border-0 bg-orange text-white px-6.5 py-3.75 rounded-full text-[15px] font-extrabold min-h-11 hover:bg-cream hover:text-deep"
                            >
                                Voir l&apos;événement
                            </Link>
                        </div>
                    </div>
                    <div className="min-h-65 bg-[#101820] relative">
                        <Image
                            src="/photos/event-after-party.jpg"
                            alt="Affiche After Party du RDV de l'Attiéké"
                            fill
                            className="object-cover"
                        />
                    </div>
                </Reveal>
            </section>

            {/* ─── Plats vedettes ───────────────────────────────────────────────── */}
            <section className="max-w-310 mx-auto px-4.5 pt-[clamp(56px,9vw,92px)] pb-5">
                <Reveal className="flex items-end justify-between gap-5.5 flex-wrap">
                    <h2 className="font-grifter text-[clamp(36px,4.4vw,60px)] text-ink leading-[.95]">
                        Les plats qu&apos;on
                        <br />
                        réclame le plus
                    </h2>
                    <Link
                        href="/menu"
                        className="border-0 bg-transparent text-deep text-[15px] font-extrabold hover:text-orange"
                    >
                        Voir tout le menu →
                    </Link>
                </Reveal>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-5 mt-9.5">
                    {featured.map((item) => (
                        <Reveal
                            key={item.id}
                            className="bg-white rounded-[26px] overflow-hidden border border-border-light transition hover:-translate-y-1.75 hover:shadow-[0_26px_50px_rgba(122,45,25,.16)]"
                        >
                            {item.images.length > 0 ? (
                                <ImageSwiper
                                    images={item.images}
                                    alt={item.name}
                                    className="relative aspect-[4/3] bg-[#F1DACB]"
                                />
                            ) : (
                                <PlaceholderPhoto
                                    src={null}
                                    alt={item.name}
                                    className="aspect-[4/3] bg-[#F1DACB]"
                                />
                            )}
                            <div className="p-4.5 pb-5">
                                <div className="text-base font-extrabold text-ink leading-tight min-h-10.5">
                                    {item.name}
                                </div>
                                <div className="text-[12.5px] text-[#8A6154] mt-1.25">
                                    {item.note || item.category}
                                </div>
                                <div className="flex items-center justify-between mt-4 gap-2.5">
                                    <span className="font-grifter text-2xl text-deep">
                                        {fmt(item.price)}
                                    </span>
                                    <AddToCartButton
                                        menuItemId={item.id}
                                        name={item.name}
                                    />
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ─── Teaser fidélité ──────────────────────────────────────────────── */}
            <section className="max-w-310 mx-auto px-4.5 py-[clamp(52px,9vw,86px)]">
                <Reveal className="rounded-[34px] bg-ink text-cream p-[clamp(24px,4.4vw,54px)] relative overflow-hidden">
                    <div className="animate-float-2 absolute w-[420px] h-[420px] rounded-full bg-orange opacity-28 blur-[60px] -right-20 -top-30" />
                    <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(28px,4vw,46px)] items-center">
                        <div>
                            <div className="text-xs font-extrabold tracking-[.16em] text-orange">
                                L&apos;INNOVATION CHEZ CHARLY
                            </div>
                            <h2 className="font-grifter text-[clamp(34px,4vw,54px)] mt-3.5 leading-[.98]">
                                Chaque plat
                                <br />
                                vous rapporte
                            </h2>
                            <p className="text-[17px] leading-[1.6] text-[#E4C6B7] max-w-[420px] mt-4.5">
                                1 point par {fmt(settings.ptsPerUnit)} dépensés.
                                À{" "}
                                {tiers
                                    .map((t) => fmtNumber(t.threshold))
                                    .join(", ")}{" "}
                                points, un palier se débloque : un lot garanti,
                                plus un tour de la roue de la chance.
                            </p>
                            <Link
                                href="/fidelite"
                                className="inline-block mt-7.5 border-0 bg-orange text-white px-7 py-4 rounded-full text-[15.5px] font-extrabold hover:bg-cream hover:text-deep"
                            >
                                Ouvrir mon espace fidélité
                            </Link>
                        </div>
                        <div className="grid gap-3">
                            {tiers.map((t) => (
                                <div
                                    key={t.id}
                                    className="flex items-center flex-wrap gap-2 gap-x-3.5 bg-white/7 border border-white/14 rounded-[18px] px-4.25 py-3.75"
                                >
                                    <div className="font-grifter text-[22px] text-orange min-w-18.5">
                                        {fmtNumber(t.threshold)} pts
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14.5px] font-extrabold">
                                            {t.name}
                                        </div>
                                        <div className="text-[12.5px] text-[#D9B7A7]">
                                            {t.reward}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ─── 3 étapes ─────────────────────────────────────────────────────── */}
            <section className="max-w-310 mx-auto px-4.5 py-5 pb-[clamp(56px,9vw,92px)]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5.5">
                    {[
                        {
                            n: "01",
                            title: "Vous choisissez",
                            body: "Tout le menu, prix à jour, mis à jour par la maison depuis le dashboard.",
                        },
                        {
                            n: "02",
                            title: "Vous payez MoMo",
                            body: "Transfert MTN MoMo ou Moov Money, puis collez la référence ou la capture.",
                        },
                        {
                            n: "03",
                            title: "On livre, vous gagnez",
                            body: "Suivi en direct jusqu'à votre porte, et les points tombent automatiquement.",
                        },
                    ].map((s) => (
                        <Reveal key={s.n}>
                            <div className="font-grifter text-[46px] text-orange">
                                {s.n}
                            </div>
                            <div className="text-[19px] font-extrabold mt-1.5">
                                {s.title}
                            </div>
                            <p className="text-[15px] text-[#6A392C] leading-[1.6] mt-2">
                                {s.body}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ─── Bande photo ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-2.5 max-w-310 mx-auto mb-[clamp(56px,9vw,86px)] px-4.5">
                {[
                    {
                        src: "/photos/commande-emballee.jpg",
                        alt: "Commandes emballées Chez Charly",
                    },
                    {
                        src: "/photos/charly.jpg",
                        alt: "Livraison sur un événement",
                    },
                    {
                        src: "/photos/bouffe.jpg",
                        alt: "Pâtes Chez Charly à emporter",
                    },
                ].map((p) => (
                    <Reveal
                        key={p.src}
                        className="aspect-[4/3] rounded-[20px] overflow-hidden relative"
                    >
                        <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            className="object-cover"
                        />
                    </Reveal>
                ))}
            </div>

            {/* ─── La maison ────────────────────────────────────────────────────── */}
            <section className="bg-cream-2 px-4.5 py-[clamp(52px,9vw,86px)]">
                <div className="max-w-310 mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(30px,5vw,52px)] items-center">
                    <Reveal
                        variant="in"
                        className="rounded-[28px] aspect-[4/5] overflow-hidden bg-[#EACFBD] relative"
                    >
                        <Image
                            src="/photos/stand.jpg"
                            alt="La salle Chez Charly, mur peint Attiéké"
                            fill
                            className="object-cover"
                        />
                    </Reveal>
                    <Reveal>
                        <div className="text-xs font-extrabold tracking-[.16em] text-deep">
                            LA MAISON
                        </div>
                        <h2 className="font-grifter text-[clamp(34px,4.2vw,56px)] mt-3.5 leading-[.96] text-ink">
                            Le goût de Calavi,
                            <br />
                            servi sans compter
                        </h2>
                        <p className="text-[17.5px] leading-[1.65] text-[#6A392C] max-w-[520px] mt-5 text-pretty">
                            Chez Charly, on cuisine comme à la maison : poisson
                            braisé du jour, alloco doré à la minute, attiéké
                            frais. Notre promesse tient en trois mots, et ils
                            sont sur l&apos;enseigne - toujours bien chargé.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-7.5 max-w-[520px]">
                            <div className="bg-white rounded-[18px] p-4.5">
                                <div className="text-[13px] font-extrabold text-deep">
                                    Ouvert tous les jours
                                </div>
                                <div className="text-sm text-[#6A392C] mt-1">
                                    10 h - 23 h
                                </div>
                            </div>
                            <div className="bg-white rounded-[18px] p-4.5">
                                <div className="text-[13px] font-extrabold text-deep">
                                    Sur place & à emporter
                                </div>
                                <div className="text-sm text-[#6A392C] mt-1">
                                    32 couverts
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ─── Contact ──────────────────────────────────────────────────────── */}
            <section className="max-w-310 mx-auto px-4.5 py-[clamp(56px,9vw,92px)]">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(30px,4vw,44px)] items-center">
                    <Reveal>
                        <h2 className="font-grifter text-[clamp(34px,4.2vw,56px)] leading-[.96] text-ink">
                            Nous trouver,
                            <br />
                            nous appeler
                        </h2>
                        <div className="grid gap-4.5 mt-7 max-w-[460px]">
                            <div>
                                <div className="text-xs font-extrabold tracking-[.12em] text-label-2">
                                    TÉLÉPHONE
                                </div>
                                <a
                                    href="tel:+2290161555722"
                                    className="font-grifter text-[30px] text-deep"
                                >
                                    +229 01 61 55 57 22
                                </a>
                            </div>
                            <div>
                                <div className="text-xs font-extrabold tracking-[.12em] text-label-2">
                                    ADRESSE
                                </div>
                                <div className="text-[17px] text-[#4A2318] leading-[1.5]">
                                    Abomey-Calavi, Womey Adjikpegon
                                    <br />
                                    en face du bar Nid d&apos;oiseau
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-extrabold tracking-[.12em] text-label-2">
                                    LIVRAISON
                                </div>
                                <div className="text-[17px] text-[#4A2318]">
                                    Calavi, Womey, Godomey et Cotonou
                                </div>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal
                        variant="in"
                        className="rounded-[26px] aspect-[4/3] bg-[repeating-linear-gradient(52deg,#F1DACB_0_16px,#E8CDBA_16px_32px)] grid place-items-center font-mono text-xs text-[#96674F] text-center leading-[1.8]"
                    >
                        CARTE / PLAN D&apos;ACCÈS
                        <br />
                        Womey Adjikpegon
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
