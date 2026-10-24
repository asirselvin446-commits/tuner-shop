"use client";

import Link from "next/link";
import { useState } from "react";
import { publishedServices, type Service, type ServiceTrack } from "@/content/services";
import { Media } from "@/components/media/Media";

const tracks: { id: ServiceTrack; title: string; intro: string; href: string }[] = [
  {
    id: "performance",
    title: "For more from the car",
    intro: "Calibration and tuning for a healthy vehicle, matched to its hardware and how you drive it.",
    href: "/performance",
  },
  {
    id: "repair",
    title: "For a fault, a part or an update",
    intro: "Diagnosis first, then coding, repair, DPF work or software — whichever the fault actually needs.",
    href: "/repairs",
  },
];

export function ServiceIndex() {
  const services = publishedServices();
  const [active, setActive] = useState<Service["slug"]>(services[0]?.slug ?? "ecu-remapping");
  const activeService = services.find((s) => s.slug === active);

  return (
    <section aria-labelledby="services-title" className="relative bg-asphalt py-24 md:py-36">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <h2 id="services-title" data-reveal="lines" className="t-h1 col-span-4 md:col-span-8">
            Services
          </h2>
          <p className="t-lead col-span-4 max-w-[40ch] self-end text-alloy md:col-span-4">
            Six services, two reasons to visit. Each page explains what the work involves and where its limits are.
          </p>
        </div>

        <div className="grid-12 mt-16 md:mt-24">
          <div className="col-span-4 md:col-span-7">
            {tracks.map((track) => {
              const items = services.filter((s) => s.track === track.id);
              if (!items.length) return null;
              return (
                <div key={track.id} className="mb-16 last:mb-0">
                  <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="t-h3">{track.title}</h3>
                    <Link href={track.href} className="link-underline self-start text-[0.9375rem] text-alloy hover:text-titanium md:self-auto">
                      {track.id === "performance" ? "Performance overview" : "Repairs overview"}
                    </Link>
                  </div>
                  <p className="mb-6 max-w-[52ch] text-alloy">{track.intro}</p>
                  <ul className="border-t border-gunmetal">
                    {items.map((s) => {
                      const isActive = s.slug === active;
                      return (
                        <li key={s.slug} className="border-b border-gunmetal">
                          <Link
                            href={`/services/${s.slug}`}
                            onMouseEnter={() => setActive(s.slug)}
                            onFocus={() => setActive(s.slug)}
                            className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 py-6 md:py-7"
                          >
                            <span
                              className={`text-[clamp(1.75rem,3.4vw,3.125rem)] leading-[1] tracking-[-0.02em] font-[700] transition-colors duration-300 [font-stretch:104%] md:[font-stretch:118%] ${isActive ? "md:text-titanium" : "md:text-[#7a8088]"} group-hover:text-titanium`}
                            >
                              {s.name}
                            </span>
                            <span aria-hidden="true" className={`h-px w-10 self-center transition-all duration-500 md:w-16 ${isActive ? "bg-signal md:w-24" : "bg-gunmetal"}`} />
                            <span className="t-note col-span-2">{s.annotation}</span>
                            <span className="col-span-2 max-w-[56ch] text-[0.9375rem] text-alloy">{s.summary}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Sticky media column follows the hovered/focused service (desktop). */}
          <div className="hidden md:col-span-4 md:col-start-9 md:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                {services.map((s) => (
                  <div key={s.slug} className={`absolute inset-0 transition-opacity duration-700 ${s.slug === active ? "opacity-100" : "opacity-0"}`} aria-hidden={s.slug !== active}>
                    <Media id={s.media} sizes="(min-width: 768px) 34vw, 100vw" motion={s.slug === active} className="h-full w-full" />
                  </div>
                ))}
              </div>
              {activeService && (
                <p className="t-note mt-4">
                  {activeService.name}: {activeService.annotation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
