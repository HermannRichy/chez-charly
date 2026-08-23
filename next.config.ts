import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Le service worker de notifications push ne doit jamais être servi
        // depuis le cache : sinon un navigateur garde une version obsolète
        // après un déploiement.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
  images: {
    // Les photos de plats et l'avatar de preuve de paiement sont hébergés sur
    // Cloudinary. Sans cette déclaration, next/image refuse l'URL au rendu.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
