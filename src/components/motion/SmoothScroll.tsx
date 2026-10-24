"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null when native scrolling is in use (reduced motion, touch, no JS). */
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling driven by the GSAP ticker, so Lenis and ScrollTrigger share one clock.
 * Touch devices keep native scrolling (Lenis `syncTouch` stays off). With reduced motion requested,
 * Lenis is not created at all.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    const tick = (time: number) => instance?.raf(time * 1000);

    const start = () => {
      if (instance) return;
      instance = new Lenis({
        autoRaf: false,
        lerp: 0.11,
        anchors: { offset: -72 },
        stopInertiaOnNavigate: true,
        allowNestedScroll: true,
      });
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("has-lenis");
      setLenis(instance);
    };

    const stop = () => {
      if (!instance) return;
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      instance = null;
      document.documentElement.classList.remove("has-lenis");
      setLenis(null);
    };

    const sync = () => {
      if (reduce.matches) stop();
      else start();
      ScrollTrigger.refresh();
    };

    sync();
    reduce.addEventListener("change", sync);
    // Late-loading web fonts change line breaks and therefore every trigger position.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      reduce.removeEventListener("change", sync);
      stop();
    };
  }, []);

  // On client-side navigation: start at the top (or the hash target) and re-measure triggers.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
