import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo } from "next/font/google";
import { Toaster } from "sonner";
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

export const metadata: Metadata = {
  title: "Chez Charly — Toujours bien chargé",
  description:
    "Attiéké poisson, riz aileron, alloco brûlant. Commandez en ligne, payez par MoMo, on livre à Calavi.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${grifter.variable} ${archivo.variable}`}>
      <body>
        {children}
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
