# Chez Charly — Spécification Complète

> Plateforme unique pour le restaurant/maquis Chez Charly (Abomey-Calavi, Bénin) : site vitrine, commande en ligne avec paiement mobile money manuel, programme de fidélité à points + roue de la chance, page événements, dashboard admin.
>
> Design de référence (hifi, haute fidélité) : `extracted/design_handoff_chez_charly/`. Voir son `README.md` pour les tokens de design et les règles métier — ce document-ci porte l'implémentation Next.js.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16.3 (App Router) |
| Auth (staff uniquement) | Better Auth |
| Base de données | PostgreSQL (Neon) + Prisma 7 (`@prisma/adapter-pg`) |
| Stockage médias | Cloudinary (photos de plats, captures de preuve de paiement) |
| Paiement | Mobile money manuel (MTN MoMo / Moov Money) — aucun paiement traité sur la plateforme |
| UI vitrine | Composants bespoke, Tailwind CSS 4 mobile-first, fidèles au design |
| UI dashboard | shadcn/ui |
| Icônes | Tabler Icons |
| Animations | GSAP / @gsap/react |
| Typographie | Grifter (titres, `.otf` fourni — remplaçable par Neulis si acquise) + Archivo (corps, Google Fonts) |
| Package manager | pnpm (installation manuelle, jamais automatique) |

---

## 1. Identification & auth

Un seul système de compte pour tout le monde (staff **et** clients), comme dans nextpress : Better Auth (`emailAndPassword`) + plugin `admin` avec un rôle `Role { STAFF, CLIENT }` sur `User` (`STAFF` = accès dashboard, `CLIENT` = défaut à l'inscription). Le profil client du prototype (téléphone, adresse, points, tours de roue) vit directement sur `User` via `additionalFields` (`lib/auth.ts`) plutôt que sur un modèle `Customer` séparé.

- **Staff** : comptes créés via `pnpm db:seed` (`SEED_STAFF_EMAIL`/`SEED_STAFF_PASSWORD`), rôle repassé à `STAFF` juste après l'inscription (le plugin admin crée toujours en `CLIENT` par défaut).
- **Clients** : inscription libre sur `/signup` (nom, téléphone, email, mot de passe), connexion sur `/login`. Après connexion, redirection vers `/admin` si `STAFF`, sinon vers la page demandée (`callbackUrl`).
- Routes protégées (`src/proxy.ts`, vérification optimiste par cookie de session) : `/admin/**`, `/commande`, `/fidelite`, `/suivi` (index). `/suivi/[id]` reste public — lien de suivi partageable (README). Le rôle `STAFF` est revalidé côté serveur dans `src/app/admin/(protected)/layout.tsx` ; un `CLIENT` connecté y est renvoyé vers `/`.

---

## 2. Réglages (`Settings`, ligne singleton)

- `freeFrom` — seuil de commande (F CFA) au-delà duquel la livraison est offerte.
- `ptsPerUnit` — 1 point de fidélité gagné pour chaque `ptsPerUnit` F CFA dépensés.

---

## 3. Site public

### 3.1 Accueil (`/`)
Hero (statut ouvert, H1 dégradé animé, 2 CTA, 3 statistiques), bandeau défilant, 4 plats vedettes, teaser fidélité (3 paliers), 3 étapes, section "La maison", contact, footer. Toutes les sections après le hero apparaissent au scroll (GSAP ScrollTrigger).

### 3.2 Menu (`/menu`)
Lecture DB (`MenuItem`), filtre par catégorie (barre sticky), une carte par plat avec bouton `+` / stepper si au panier / badge "ÉPUISÉ" si `active=false`.

### 3.3 Panier (`/panier`)
Panier serveur (cookie httpOnly `cc_cart`, IDs + quantités seulement — voir `lib/cart.ts`), rehydraté depuis `MenuItem` à chaque lecture. Récapitulatif sticky : sous-total, frais de livraison selon zone, total, points à gagner, sélecteur de zone.

### 3.4 Checkout (`/commande`)
Accès exige une session client (`requireClient`, sinon redirection `/login?callbackUrl=/commande`). 2 étapes. Étape 1 : coordonnées préremplies depuis le profil `User`, choix MoMo/Moov. Étape 2 : montant exact, référence de transaction et/ou capture (upload Cloudinary), bouton actif si `ref.length > 3 || proof`. `confirmOrderAction` (server action, transaction Prisma) : recalcul serveur du total, création `Order` + `OrderItem` sur `userId`, crédit de points, +1 tour de roue si palier franchi, cookie panier vidé, redirection `/suivi/[id]`.

### 3.5 Suivi (`/suivi`, `/suivi/[id]`)
`/suivi` (protégé) redirige vers la dernière commande du compte connecté. `/suivi/[id]` reste public (lien partageable). Timeline 4 étapes (`OrderStatus` : RECEIVED → PREPARING → ON_THE_WAY → DELIVERED). Polling léger (4–5 s) vers `/api/orders/[id]` pour refléter les changements faits depuis l'admin sans rechargement.

### 3.6 Fidélité (`/fidelite`)
Compteur de points, barre de progression vers le prochain palier, liste des paliers (DÉBLOQUÉ/VERROUILLÉ), roue de la chance (tirage `crypto.randomInt` **côté serveur**, animation GSAP côté client jusqu'à l'angle imposé — jamais l'inverse), historique des points (`LoyaltyTx`).

### 3.7 Événements (`/evenements`)
Contenu statique (pas de modèle DB, pas d'onglet admin dédié). Affiche de l'édition précédente en entier (`object-fit: contain`, jamais recadrée).

---

## 4. Dashboard admin (`/admin`)

Fond sombre, largeur max 1340px, 4 cartes de statistiques, 4 onglets :

- **Commandes** (`/admin`) — une carte par commande, bouton "VALIDER LE PAIEMENT" (`verified: false → true`) ou badge "PAIEMENT VÉRIFIÉ", boutons ← / "Étape suivante" sur `OrderStatus`.
- **Menu** (`/admin/menu`) — CRUD `MenuItem` : ajout (nom, prix, catégorie), édition en place (nom, prix), bascule Disponible/Épuisé, suppression, upload photo (Cloudinary).
- **Livraison** (`/admin/livraison`) — CRUD `DeliveryZone` (tarif, délai éditables), seuil `freeFrom` éditable.
- **Fidélité** (`/admin/fidelite`) — `ptsPerUnit` éditable, 3 `LoyaltyTier` éditables (nom, seuil, lot), 8 `WheelPrize` éditables — appliqués immédiatement côté client.

Toutes les mutations : server actions avec garde `requireStaffSession()`, validation zod, `revalidatePath` ciblé.

---

## 5. Règles métier (source de vérité serveur, `lib/pricing.ts`)

```
sousTotal    = Σ (MenuItem.price × quantité)
frais        = sousTotal >= Settings.freeFrom ? 0 : zone.fee
total        = sousTotal + frais
pointsGagnés = floor(total / Settings.ptsPerUnit)
```

- Un palier de fidélité franchi (`points >= LoyaltyTier.threshold`) accorde +1 tour de roue.
- Les prix ne sont **jamais** lus depuis le client — toujours recalculés depuis `MenuItem.price` en base au moment de la commande.

---

## 6. Modèle de données

Voir `prisma/schema.prisma`. Résumé : `User` (Better Auth + rôle + profil client — téléphone/adresse/points/tours de roue) / `Session` / `Account` / `Verification`, `Settings` (singleton), `MenuItem`, `DeliveryZone`, `PaymentMethod`, `LoyaltyTier`, `WheelPrize`, `LoyaltyTx`, `Order`, `OrderItem`.

---

## 7. Temps réel

Pas de websockets (mauvais fit sur hébergement serverless) : `/suivi/[id]` fait un polling `fetch` vers `/api/orders/[id]` toutes les 5 s ; l'onglet Commandes du dashboard admin se contente d'un `router.refresh()` périodique (`AdminAutoRefresh`) qui re-render le Server Component, sans dupliquer le rendu de la liste côté client.

---

## 8. Mobile-first

- Tailwind : classes de base = mobile, `sm:`/`md:`/`lg:` seulement pour élargir.
- `clamp()` pour les tailles de texte/padding, `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` pour les grilles — pas de media query, comme le prototype de design.
- Cibles tactiles ≥44px partout (steppers, nav, liens de pied de page).

---

## 9. Structure projet (App Router)

```
src/
  proxy.ts                          garde /admin/**, /commande, /fidelite, /suivi (Next 16 : remplace middleware.ts)
  app/
    layout.tsx                      fonts, <Toaster/> (sonner)
    globals.css                     tokens Tailwind v4, placeholders rayés, conic-gradient roue
    (auth)/
      layout.tsx                    shell centré minimal
      login/page.tsx
      signup/page.tsx
    (site)/
      layout.tsx                    Header + Footer
      page.tsx                      Accueil
      menu/page.tsx
      panier/page.tsx
      commande/{page.tsx, actions.ts}
      suivi/{page.tsx, [id]/page.tsx}
      fidelite/{page.tsx, actions.ts}
      evenements/page.tsx
      actions.ts                    panier (add/dec/clear), zone
    admin/
      (protected)/
        layout.tsx                  garde de rôle STAFF + shell sombre + stats + nav onglets
        page.tsx                    Commandes
        menu/{page.tsx, actions.ts}
        livraison/{page.tsx, actions.ts}
        fidelite/{page.tsx, actions.ts}
    api/
      auth/[...all]/route.ts        Better Auth (toNextJsHandler)
      orders/[id]/route.ts          GET — polling suivi client
      admin/orders/route.ts         GET — polling dashboard (protégé)
      upload/route.ts               POST — upload Cloudinary
  components/
    site/                           Header, Footer, Marquee, Wheel, Stepper, PlaceholderPhoto, Reveal, LoginForm, SignupForm
    admin/                          composants shadcn du dashboard
    ui/                             primitives shadcn (`pnpm dlx shadcn add ...`)
  lib/
    prisma.ts, auth.ts, auth-client.ts, auth-permissions.ts, session.ts, cart.ts, zone.ts, pricing.ts, format.ts, cloudinary.ts, order-status.ts, utils.ts
prisma/
  schema.prisma, seed.ts
```
