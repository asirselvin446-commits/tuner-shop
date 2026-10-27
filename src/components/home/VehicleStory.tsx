"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { storyChapters } from "@/content/home";
import { publishedServices } from "@/content/services";
import { business } from "@/config/business";
import { gsap, useGSAP } from "@/lib/gsap";
import { createProgress } from "@/lib/progress";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { VehicleStage } from "@/components/vehicle/VehicleStage";
import { useLenis } from "@/components/motion/SmoothScroll";
import Image from "next/image";
import { media } from "@/content/media";
import { CanDiagram } from "./CanDiagram";

/** Camera punch-in and vertical pan at each chapter boundary (5 keys for 4 chapters). */
const ZOOM_KEYS = [1, 1.04, 1.2, 1.08, 1] as const;
const PAN_KEYS = [0, 0, -0.035, 0, 0.02] as const;

/**
 * Pinned story: the vehicle stays anchored (CSS sticky — no pin spacer) while scroll scrubs the orbit
 * footage, the chapter copy and the network diagram from one timeline. Without JS or with reduced
 * motion, it is a plain sequence of chapters with a still image.
 */
export function VehicleStory() {
  const root = useRef<HTMLElement>(null);
  const progress = useMemo(() => createProgress(0), []);
  const reduceMotion = usePrefersReducedMotion();
  const services = publishedServices();
  const n = storyChapters.length;
  const lenis = useLenis();

  /** Scroll to the point where chapter `i` is fully on screen. */
  const goToChapter = (i: number) => {
    const track = root.current?.querySelector<HTMLElement>("[data-story-track]");
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const target = top + ((i + 0.3) / n) * (track.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chapters = q("[data-chapter]");
        const links = q("[data-chapter-link]");
        gsap.set(chapters.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-story-track]")[0],
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              progress.set(self.progress);
              // Mark the current chapter in the navigation without a React re-render per frame.
              const active = Math.min(n - 1, Math.floor(self.progress * n));
              links.forEach((el, i) => (i === active ? el.setAttribute("aria-current", "step") : el.removeAttribute("aria-current")));
            },
          },
        });

        // Chapter copy: each holds for most of its span, crossfading at the boundaries.
        chapters.forEach((ch, i) => {
          if (i > 0) tl.fromTo(ch, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, i - 0.08);
          if (i < n - 1) tl.to(ch, { autoAlpha: 0, y: -48, duration: 0.22, ease: "power2.in" }, i + 0.78);
        });

        // Network diagram builds with the narrative.
        // The diagram panel arrives with the network instead of sitting empty.
        tl.fromTo(q("[data-diagram]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.02);
        tl.fromTo(q(".bus-line"), { strokeDashoffset: 1, strokeDasharray: "1 1" }, { strokeDashoffset: 0, duration: 0.35 }, 0.04)
          .fromTo(q("[data-node]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.04 }, 0.08)
          // Chapter 2: the engine control unit takes the light.
          .fromTo(q("[data-node-box='ecu']"), { fill: "#17191c", stroke: "#2e3237" }, { fill: "#3a0c14", stroke: "#c8102e", duration: 0.25 }, 1)
          .fromTo(q("[data-ecu-detail]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.05)
          // Chapter 3: the light hands over to the diagnostic path — tool, OBD port, gateway, bus.
          .to(q("[data-node-box='ecu']"), { fill: "#17191c", stroke: "#2e3237", duration: 0.2 }, 1.88)
          .to(q("[data-ecu-detail]"), { autoAlpha: 0, duration: 0.2 }, 1.88)
          .fromTo(q("[data-tool]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 2)
          .fromTo(q("[data-read-path]"), { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3 }, 2.15)
          .fromTo(q("[data-node-box='gw']"), { fill: "#17191c", stroke: "#2e3237" }, { fill: "#3a0c14", stroke: "#c8102e", duration: 0.2 }, 2.4)
          .fromTo(q("[data-read-stub]"), { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.15 }, 2.45)
          .to(q("[data-diagram]"), { autoAlpha: 0.25, duration: 0.3 }, 3)
          .fromTo(q("[data-stage-dim]"), { opacity: 0 }, { opacity: 0.55, duration: 0.4 }, 2.9)
          .fromTo(q("[data-progress-fill]"), { scaleX: 0 }, { scaleX: 1, duration: n }, 0)
          .set({}, {}, n);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="story relative bg-asphalt">
      <h2 id="story-title" className="sr-only">
        From the vehicle’s electronics to the right service
      </h2>

      <div data-story-track className="story-track" style={{ "--chapters": n } as React.CSSProperties}>
        <div className="story-frame">
          <div className="story-stage">
            {reduceMotion ? (
              <Image src={media.orbit.poster} alt={media.orbit.alt} fill sizes="100vw" className="object-cover" />
            ) : (
              <VehicleStage progress={progress} zoomKeys={ZOOM_KEYS} panKeys={PAN_KEYS} />
            )}
            <div data-stage-dim className="absolute inset-0 bg-asphalt opacity-0" />
            <div className="story-scrim absolute inset-0" />
            {business.media.illustrative && <span className="media-tag">Illustrative</span>}
          </div>

          <div className="story-ui shell">
            <div className="story-chapters">
              {storyChapters.map((c, i) => (
                <article key={c.title} data-chapter={i} className="story-chapter">
                  <p className="t-index mb-5 text-[0.875rem] text-alloy">
                    <span className="text-signal-text">{String(i + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
                  </p>
                  <h3 className="t-h2 max-w-[12ch] uppercase text-balance">{c.title}</h3>
                  <p className="mt-5 max-w-[42ch] text-alloy text-pretty md:text-[1.125rem]">{c.body}</p>
                  {i === n - 1 && (
                    <ul className="mt-7 grid max-w-[30rem] grid-cols-2 gap-x-6 border-t border-gunmetal">
                      {services.map((s) => (
                        <li key={s.slug} className="border-b border-gunmetal">
                          <Link href={`/services/${s.slug}`} className="block py-3 text-[0.9375rem] font-[560] transition-colors hover:text-signal-text">
                            {s.shortName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <div data-diagram className="story-diagram">
              <CanDiagram />
            </div>
          </div>

          {/* Chapter navigation: progress rail with a labelled, clickable marker per chapter. */}
          <nav aria-label="Story chapters" className="story-progress shell">
            <div className="relative h-px bg-gunmetal">
              <div data-progress-fill className="absolute inset-0 origin-left bg-signal" />
              <ol>
                {storyChapters.map((c, i) => (
                  <li key={c.title} className="absolute bottom-0" style={{ left: `${(i / n) * 100}%` }}>
                    <span aria-hidden="true" className="absolute bottom-0 left-0 h-2 w-px translate-y-1/2 bg-alloy" />
                    <button
                      type="button"
                      data-chapter-link={i}
                      onClick={() => goToChapter(i)}
                      className="story-chapter-link t-note flex min-h-[44px] items-end gap-2 pb-3 pl-2 whitespace-nowrap transition-colors hover:text-titanium"
                    >
                      <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="hidden sm:inline">{c.label}</span>
                      <span className="sr-only sm:hidden">{c.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
