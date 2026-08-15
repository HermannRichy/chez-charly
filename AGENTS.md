<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. En particulier : `middleware.ts` n'existe plus, remplacé par `src/proxy.ts` exportant `proxy()`.

<!-- END:nextjs-agent-rules -->

# Specifications

The project specifications are in CHEZ_CHARLY_SPEC.md. The visual reference (hifi, à recréer au pixel près côté vitrine) est dans `extracted/design_handoff_chez_charly/` — inspiration uniquement pour le dashboard admin (là, cohérence shadcn > fidélité au HTML).

# Package manager & installation

Package manager in this project: pnpm
Dont execute package installation automatically
Do not install packages automatically; I will do it myself.
Do not stop when a package is missing; continue and tell me which package needs to be installed.

# Workflow

Before generating any files, tell me what you plan to do and ask for approval before proceeding.

# Design & UI

Design files : `/extracted/design_handoff_chez_charly` (fidélité haute — couleurs, typos, animations, copies définitives côté site public).
Tailwind CSS 4 pour le style, **mobile-first strict** (classes de base = mobile, `sm:`/`md:`/`lg:` seulement pour élargir — jamais l'inverse).
Site public (accueil, menu, panier, checkout, suivi, fidélité, événements) : composants bespoke fidèles au design, pas shadcn.
Dashboard admin (`/admin/**`) : shadcn/ui pour les composants, `@tabler/icons-react` pour toutes les icônes.
Animations : GSAP (`gsap`, `@gsap/react`, ScrollTrigger) plutôt que des `@keyframes` CSS bruts.
Cibles tactiles ≥44px partout, sans exception.

# Année du projet

Le projet est développé en août 2026.
