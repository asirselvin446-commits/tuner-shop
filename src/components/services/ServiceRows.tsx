import Link from "next/link";
import type { Service } from "@/content/services";
import { Media } from "@/components/media/Media";
import { enquiryHref } from "@/config/navigation";

/**
 * Editorial service rows: media and copy alternate sides and proportions, so a list of services reads
 * as a sequence of compositions rather than a card grid.
 */
export function ServiceRows({ items }: { items: Service[] }) {
  return (
    <ul className="space-y-24 md:space-y-36">
      {items.map((s, i) => {
        const flip = i % 2 === 1;
        return (
          <li key={s.slug} className="shell">
            <article className="grid-12 items-center gap-y-8">
              <div className={`col-span-4 md:col-span-12 ${flip ? "lg:order-2 lg:col-span-6 lg:col-start-7" : "lg:col-span-7"}`}>
                <Media id={s.media} sizes="(min-width: 768px) 55vw, 100vw" className={flip ? "aspect-[4/5] md:aspect-[5/6]" : "aspect-[16/10]"} />
              </div>
              <div className={`col-span-4 md:col-span-8 ${flip ? "lg:order-1 lg:col-span-5" : "lg:col-span-4 lg:col-start-9"}`}>
                <p className="t-note">{s.annotation}</p>
                <h3 className="t-h2 mt-3 uppercase text-balance lg:text-[clamp(2rem,3.1vw,3.25rem)]">{s.name}</h3>
                <p className="mt-5 text-alloy text-pretty">{s.summary}</p>
                <ul className="mt-6 space-y-2 border-t border-gunmetal pt-5 text-[0.9375rem] text-alloy">
                  {s.involves.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/services/${s.slug}`} className="btn btn-ghost">
                    More on {s.name}
                  </Link>
                  <Link href={enquiryHref(s.slug)} className="btn btn-primary">
                    Enquire
                  </Link>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
