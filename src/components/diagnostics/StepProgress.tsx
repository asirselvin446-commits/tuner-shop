"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Vertical progress rail for an ordered list of steps. The red fill tracks how far the reader has
 * scrolled through the list, and each step is marked as reached when it crosses the reading line.
 * Static grey rail with reduced motion or without JS.
 */
export function StepProgress() {
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const list = rail.current?.parentElement?.querySelector("ol");
      if (!list) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          rail.current!.firstElementChild,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(list.children).forEach((li) =>
          ScrollTrigger.create({ trigger: li, start: "top 60%", toggleClass: { targets: li, className: "is-reached" } }),
        );
      });
      return () => mm.revert();
    },
    { scope: rail },
  );

  return (
    <div ref={rail} aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-lab-rule">
      <div className="h-full w-full origin-top scale-y-0 bg-signal" />
    </div>
  );
}
