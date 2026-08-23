import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/site/CookieBanner";
import { SignupPrompt } from "@/components/site/SignupPrompt";
import "./globals.css";

// Police des titres/prix/chiffres fournie par le client (README : vérifier la
// licence web avant mise en production). Remplaçable par Neulis (acquise par
// le client, cf. CHEZ_CHARLY_SPEC.md) en changeant uniquement ce fichier.
const grifter = localFont({
  src: "./fonts/grifter-bold.otf",
  weight: "700",
  variable: "--font-grifter-local",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo-local",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const title = "Chez Charly - Toujours bien chargé";
const description =
  "Attiéké poisson, riz aileron, alloco brûlant. Commandez en ligne, payez par MoMo, on livre à Calavi.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Chez Charly",
  },
  description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Chez Charly",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/photos/commande-emballee.jpg",
        alt: "Commandes Chez Charly emballées, prêtes à partir",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/photos/commande-emballee.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${grifter.variable} ${archivo.variable}`}
    >
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <CookieBanner />
        <SignupPrompt />
        <Toaster
          position="bottom-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-ink text-cream px-6 py-3.5 rounded-full text-[14.5px] font-bold shadow-[0_20px_44px_rgba(36,16,12,.34)]",
            },
          }}
        />
      </body>
    </html>
  );
}
