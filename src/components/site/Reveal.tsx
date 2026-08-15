"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Remplace `animation: revealUp linear both; animation-timeline: view();`
 * (design d'origine) par un ScrollTrigger.batch : mêmes deux formes
 * (montée + fondu, ou zoom + fondu), déclenchées à l'entrée dans le
 * viewport plutôt que scrubbées sur toute la traversée — plus robuste
 * cross-browser qu'`animation-timeline: view()`.
 */
export function Reveal({
  children,
  as: As = "div",
  variant = "up",
  className,
}: {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: "up" | "in";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const from =
        variant === "up" ? { opacity: 0, y: 38 } : { opacity: 0, scale: 0.93 };

      gsap.set(ref.current, from);
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
          }),
      });
    },
    { scope: ref },
  );

  const Component = As as "div";
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
