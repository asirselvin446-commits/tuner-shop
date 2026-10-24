"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { ease, gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Per-route motion, mounted by app/template.tsx so it is torn down and rebuilt on every navigation.
 *
 *  - `[data-reveal="lines"]`  headings rise line by line out of a mask (the hero's motion language).
 *  - `[data-reveal="media"]`  media opens with the horizontal shutter used in the hero intro.
 *  - Route shutter: a short light-slit transition, only after a real navigation (link click or
 *    back/forward) — never on first load, same-page anchors, or the homepage (it has its own intro).
 *
 * Nothing is hidden by CSS: without JS, or with reduced motion, content is simply visible.
 */

let lastNavigationIntent = Number.NEGATIVE_INFINITY;

if (typeof window !== "undefined") {
  document.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.origin !== location.origin) return;
      if (link.pathname === location.pathname) return;
      lastNavigationIntent = performance.now();
    },
    true,
  );
  window.addEventListener("popstate", () => {
    lastNavigationIntent = performance.now();
  });
}

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const shutter = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const scope = root.current!;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Route shutter.
        const navigated = performance.now() - lastNavigationIntent < 2000;
        // The intent expires by time rather than being cleared here, so a Strict Mode effect re-run
        // (mount → revert → mount) still plays the transition once.
        if (navigated && pathname !== "/" && shutter.current) {
          const q = gsap.utils.selector(shutter.current);
          gsap
            .timeline()
            .set(shutter.current, { display: "block" })
            .fromTo(q("[data-rs-slit]"), { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.32, ease: ease.shutter })
            .to(q("[data-rs-top]"), { yPercent: -100, duration: 0.7, ease: ease.shutter }, ">-0.04")
            .to(q("[data-rs-bottom]"), { yPercent: 100, duration: 0.7, ease: ease.shutter }, "<")
            .to(q("[data-rs-slit]"), { opacity: 0, duration: 0.25 }, "<0.15")
            .set(shutter.current, { display: "none" });
        }

        // Heading line reveals. SplitText re-splits on resize/font load; a revealed heading stays revealed.
        const revealed = new WeakSet<Element>();
        const splits = gsap.utils.toArray<HTMLElement>("[data-reveal='lines']", scope).map((el) =>
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              if (revealed.has(el)) return;
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.15,
                ease: ease.expo,
                stagger: 0.085,
                delay: navigated ? 0.45 : 0,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
                onComplete: () => {
                  revealed.add(el);
                },
              });
            },
          }),
        );

        // Media shutter reveals, with a slight settle of the image inside.
        gsap.utils.toArray<HTMLElement>("[data-reveal='media']", scope).forEach((el) => {
          const inner = el.querySelector("img, video, canvas");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true }, delay: navigated ? 0.35 : 0 });
          tl.fromTo(el, { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: ease.shutter, clearProps: "clipPath" });
          if (inner) tl.fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: ease.expo, clearProps: "transform" }, 0);
        });

        return () => splits.forEach((s) => s.revert());
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root}>
      {children}
      <div ref={shutter} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] hidden">
        <div data-rs-top className="absolute inset-x-0 top-0 h-1/2 bg-asphalt" />
        <div data-rs-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-asphalt" />
        <div data-rs-slit className="absolute inset-x-0 top-1/2 h-px origin-center bg-signal" />
      </div>
    </div>
  );
}
