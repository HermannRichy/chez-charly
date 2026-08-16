"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconMenu, IconX } from "@tabler/icons-react";
import { useSession } from "@/lib/auth-client";
import { Avatar } from "@/components/site/Avatar";
import { LogoutButton } from "@/components/site/LogoutButton";

const NAV = [
    { href: "/", label: "Accueil" },
    { href: "/menu", label: "Menu" },
    { href: "/evenements", label: "Événements" },
    { href: "/fidelite", label: "Fidélité" },
    { href: "/suivi", label: "Suivi" },
];

export function Header({ cartCount }: { cartCount: number }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    // Réinitialisation pendant le rendu (pattern recommandé par React pour
    // "reset state on prop change") plutôt qu'un setState dans un effet, qui
    // déclencherait un rendu en cascade évitable.
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setOpen(false);
    }

    // Le panneau plein écran bloque déjà le défilement visuellement, mais sans
    // ça le body derrière continue de scroller au toucher sous le panneau.
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <div className="sticky top-0 z-60 bg-cream/86 backdrop-blur-md border-b border-[#F0D6C4]">
                <div className="max-w-310 mx-auto px-4 py-2.5 flex items-center gap-x-4.5 gap-y-2.5">
                    <Link href="/" className="-my-1.5 shrink-0">
                        <Image
                            src="/logo-charly.png"
                            alt="Chez Charly"
                            height={85}
                            width={85}
                            className="h-[clamp(70px,11vw,85px)] w-auto"
                            priority
                        />
                    </Link>

                    <nav className="hidden md:flex gap-0.5 ml-auto overflow-x-auto max-w-full scrollbar-none">
                        {NAV.map((n) => {
                            const active = pathname === n.href;
                            return (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    className="border-0 bg-transparent px-3 pt-3 pb-2.5 text-sm whitespace-nowrap min-h-11 grid gap-1 justify-items-center font-bold tracking-[.01em] text-[#5A2A1E] hover:text-deep"
                                >
                                    {n.label}
                                    {active && (
                                        <span className="h-0.75 w-full rounded-full bg-orange" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {user ? (
                        <Link href="/compte" className="hidden md:block shrink-0">
                            <Avatar name={user.name} size="sm" />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden md:inline-flex items-center border-[1.5px] border-ink text-ink px-4 py-2 rounded-full text-[13.5px] font-extrabold hover:bg-ink hover:text-cream shrink-0"
                        >
                            Se connecter
                        </Link>
                    )}

                    <Link
                        href="/panier"
                        className="ml-auto md:ml-0 border-0 bg-ink text-cream px-4.5 py-2.5 rounded-full text-[13.5px] font-extrabold flex items-center gap-2.5 hover:bg-deep shrink-0"
                    >
                        Panier
                        <span className="bg-orange text-white min-w-5.5 h-5.5 rounded-full inline-flex items-center justify-center text-xs">
                            {cartCount}
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                        aria-expanded={open}
                        className="md:hidden shrink-0 w-10 h-10 grid place-items-center border border-border-mid-3 rounded-full text-[#5A2A1E]"
                    >
                        {open ? <IconX size={20} /> : <IconMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Portail vers document.body : le header a un backdrop-filter
            (backdrop-blur-md), qui redéfinit le "containing block" de tout
            descendant `position: fixed` — au lieu du viewport, le panneau se
            retrouvait confiné dans la barre d'en-tête (~80px) et rendu comme
            écrasé sous le reste de la page. En sortant du sous-arbre du
            header via un portail, le panneau retrouve le viewport comme
            référentiel, quel que soit le style de ses ancêtres React. */}
            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <nav className="md:hidden fixed inset-x-0 top-19 bottom-0 z-70 bg-cream px-6 pt-4 pb-8 flex flex-col overflow-y-auto">
                        {NAV.map((n) => {
                            const active = pathname === n.href;
                            return (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    onClick={() => setOpen(false)}
                                    className={
                                        active
                                            ? "min-h-14 flex items-center text-xl font-extrabold text-deep border-b border-border-light"
                                            : "min-h-14 flex items-center text-xl font-bold text-[#5A2A1E] border-b border-border-light"
                                    }
                                >
                                    {n.label}
                                </Link>
                            );
                        })}

                        <div className="mt-auto pt-5 grid gap-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/compte"
                                        onClick={() => setOpen(false)}
                                        className="min-h-16 flex items-center gap-3.5 px-4 rounded-2xl bg-white border border-border-light"
                                    >
                                        <Avatar name={user.name} />
                                        <div className="min-w-0">
                                            <div className="text-[15px] font-extrabold text-ink truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-[13px] text-text-tertiary">Voir mon compte</div>
                                        </div>
                                    </Link>
                                    <LogoutButton className="w-full min-h-13 border-[1.5px] border-deep bg-transparent text-deep rounded-2xl text-[15px] font-extrabold" />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="min-h-13 flex items-center justify-center rounded-2xl border-[1.5px] border-ink text-ink text-[15px] font-extrabold"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setOpen(false)}
                                        className="min-h-13 flex items-center justify-center rounded-2xl bg-orange text-white text-[15px] font-extrabold"
                                    >
                                        S&apos;inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>,
                    document.body,
                )}
        </>
    );
}
