"use client";

/**
 * Single registration point for GSAP plugins. Import gsap/ScrollTrigger/useGSAP from here so plugins
 * are registered exactly once, no matter which component loads first.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  // Mobile browser toolbars resize the viewport while scrolling; ignore those to avoid refresh jank.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared motion vocabulary. */
export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  /** Mechanical, decisive — used for the light-slit reveals. */
  shutter: "power4.inOut",
} as const;

export { gsap, ScrollTrigger, useGSAP };
