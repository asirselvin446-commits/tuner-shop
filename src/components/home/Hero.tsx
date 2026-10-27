"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { business } from "@/config/business";
import { hero } from "@/content/home";
import { media } from "@/content/media";
import { publishedServices } from "@/content/services";
import { gsap, ScrollTrigger, useGSAP, ease } from "@/lib/gsap";

/**
 * Full-viewport hero. Sequence: light slit → shutter opens on the vehicle → headline → support copy →
 * CTAs → service entry points and scroll cue. About 1.8s; every link is usable from the first frame.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const services = publishedServices();

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", small: "(max-width: 767px)" },
        (ctx) => {
          const { motion, small } = ctx.conditions as { motion: boolean; small: boolean };
          if (!motion) {
            gsap.set(q("[data-hero-item], [data-hero-still]"), { opacity: 1, clearProps: "transform" });
            return;
          }

          // Footage: play the light-reveal clip once; fall back to the lit still if it stalls.
          const video = videoRef.current;
          const still = q("[data-hero-still]");
          let fallback: ReturnType<typeof setTimeout> | undefined;
          if (video) {
            video.src = small ? media.heroReveal.video.sm : media.heroReveal.video.lg;
            const showVideo = () => {
              clearTimeout(fallback);
              gsap.to(video, { opacity: 1, duration: 0.4 });
            };
            video.addEventListener("playing", showVideo, { once: true });
            video.play().catch(() => {});
            fallback = setTimeout(() => gsap.to(still, { opacity: 1, duration: 1.4, ease: "power2.out" }), 1600);
          }

          const tl = gsap.timeline({ defaults: { ease: ease.expo } });
          tl.fromTo(q("[data-slit]"), { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.5, ease: ease.shutter })
            .to(q("[data-shutter-top]"), { yPercent: -100, duration: 0.9, ease: ease.shutter }, ">-0.05")
            .to(q("[data-shutter-bottom]"), { yPercent: 100, duration: 0.9, ease: ease.shutter }, "<")
            .to(q("[data-slit]"), { opacity: 0, duration: 0.3 }, "<0.2")
            .fromTo(q("[data-line]"), { yPercent: 108 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, "<0.25")
            .fromTo(q("[data-hero-item='headline']"), { opacity: 0 }, { opacity: 1, duration: 0.01 }, "<")
            .fromTo(q("[data-rim]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: ease.shutter }, "<0.1")
            .fromTo(q("[data-hero-item='support']"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 }, "<0.35")
            .fromTo(q("[data-hero-item='cta']"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 }, "<0.12")
            .fromTo(q("[data-hero-item='meta']"), { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.7 }, "<0.1")
            .fromTo(q("[data-hero-item='cue']"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, "<0.15");

          // Exit: the plate drifts and dims as the story section takes over.
          const exit = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
          exit.to(q("[data-plate]"), { scale: small ? 1.04 : 1.08, yPercent: 6, ease: "none" }, 0)
            .to(q("[data-dim]"), { opacity: 0.75, ease: "none" }, 0)
            .to(q("[data-copy]"), { yPercent: -18, opacity: 0.2, ease: "none" }, 0);

          return () => {
            clearTimeout(fallback);
            video?.pause();
          };
        },
      );

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-asphalt">
      {/* Plate: still (no-JS / reduced motion / fallback) under the reveal clip. */}
      <div data-plate className="absolute inset-0 -z-10 will-change-transform">
        <Image
          data-hero-still
          src={media.heroStill.poster}
          alt={media.heroStill.alt}
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="hero-still object-cover object-[50%_45%]"
        />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-[50%_45%] opacity-0"
        />
        <div data-dim className="absolute inset-0 bg-asphalt opacity-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-asphalt)_4%,color-mix(in_srgb,var(--color-asphalt)_70%,transparent)_30%,transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-asphalt)_55%,transparent),transparent_45%)]" />
      </div>

      {/* Intro shutter + light slit (only painted when JS and motion are available). */}
      <div aria-hidden="true" className="hero-shutter pointer-events-none absolute inset-0 z-20">
        <div data-shutter-top className="absolute inset-x-0 top-0 h-1/2 bg-asphalt" />
        <div data-shutter-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-asphalt" />
        <div data-slit className="absolute inset-x-0 top-1/2 h-px origin-center bg-titanium/80" />
      </div>

      <div data-copy className="shell relative z-10 mt-auto pb-10 md:pb-14">
        <h1 id="hero-title" data-hero-item="headline" className="t-hero">
          {hero.headline.map((line, i) => (
            <span key={line} className={`block overflow-hidden pb-[0.04em] ${i === 1 ? "md:pl-[8.33%]" : ""}`}>
              <span data-line className="block will-change-transform">
                {line}
                {i < hero.headline.length - 1 && " "}
              </span>
            </span>
          ))}
        </h1>

        <div className="grid-12 mt-8 items-end gap-y-7 md:mt-10">
          <p data-hero-item="support" className="t-lead col-span-4 max-w-[38ch] text-pretty md:col-span-12 lg:col-span-4">
            {hero.support}
          </p>
          <div data-hero-item="cta" className="col-span-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-span-10 lg:col-span-5 lg:col-start-5">
            <Link href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </Link>
          </div>
          {/* Service entry points, kept off the vehicle and aligned with the CTAs. */}
          <nav aria-label="Services" data-hero-item="meta" className="hidden lg:col-span-3 lg:col-start-10 lg:block">
            <ul className="grid grid-cols-2 gap-x-5 border-t border-gunmetal pt-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="t-note block py-1 transition-colors hover:text-titanium">
                    {s.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <a
        href="#story"
        data-hero-item="cue"
        aria-label="Scroll to the vehicle story"
        className="absolute right-[var(--gutter)] bottom-4 z-10 hidden items-center gap-3 lg:flex"
      >
        <span className="t-note">Scroll</span>
        <span aria-hidden="true" className="relative block h-px w-10 overflow-hidden bg-gunmetal">
          <span className="scroll-cue-x absolute inset-y-0 left-0 w-1/2 bg-signal" />
        </span>
      </a>

      {/* Restrained red rim light along the studio floor line. */}
      <div aria-hidden="true" data-rim className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-px origin-left bg-[linear-gradient(90deg,transparent,var(--color-signal)_30%,var(--color-signal)_70%,transparent)] opacity-80" />

      {business.media.illustrative && <span className="media-tag !bottom-auto !left-auto right-[var(--gutter)] top-[calc(var(--header-h)+0.75rem)] z-10">Illustrative</span>}
    </section>
  );
}
