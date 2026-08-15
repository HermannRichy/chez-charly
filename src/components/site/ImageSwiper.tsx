"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

/**
 * Slider automatique pour les plats avec plusieurs photos (galerie gérée
 * depuis le dashboard admin). Une seule photo → rendu direct, pas de Swiper
 * inutile.
 */
export function ImageSwiper({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  if (images.length <= 1) {
    return (
      <div className={className}>
        {images[0] && <Image src={images[0]} alt={alt} fill className="object-cover" />}
      </div>
    );
  }

  return (
    <div className={className}>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2800, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src} className="relative">
            <Image src={src} alt={`${alt} - photo ${i + 1}`} fill className="object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
