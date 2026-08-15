import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
