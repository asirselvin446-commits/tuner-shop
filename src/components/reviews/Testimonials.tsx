import { testimonials, type Testimonial } from "@/content/testimonials";
import { Stars } from "./Stars";

function Byline({ t }: { t: Testimonial }) {
  return (
    <p className="t-note mt-4">
      <span className="text-titanium">{t.author}</span>, on Google Maps
    </p>
  );
}

/**
 * Selected customer reviews. One lead quote, two supporting quotes beside it, then the rest set in text
 * columns divided by hairlines — an editorial layout rather than a grid of identical cards.
 */
export function Testimonials() {
  const featured = testimonials.filter((t) => t.featured);
  const [lead, ...side] = featured;
  const rest = testimonials.filter((t) => !t.featured);

  return (
    <div>
      {lead && (
        <div className="grid-12 gap-y-12 border-t border-gunmetal pt-12">
          <figure className="col-span-4 md:col-span-12 lg:col-span-8">
            <Stars value={lead.rating} size={18} />
            <blockquote className="mt-6 text-[clamp(1.5rem,2.7vw,2.5rem)] leading-[1.18] font-[620] tracking-[-0.01em] whitespace-pre-line text-pretty [font-stretch:104%]">
              {lead.text}
            </blockquote>
            <figcaption>
              <Byline t={lead} />
            </figcaption>
          </figure>
          {side.length > 0 && (
            <div className="col-span-4 space-y-10 md:col-span-12 md:grid md:grid-cols-2 md:gap-x-10 md:space-y-0 lg:col-span-4 lg:col-start-9 lg:block lg:space-y-10">
              {side.map((t) => (
                <figure key={t.id} className="border-t border-gunmetal pt-6 lg:first:border-t-0 lg:first:pt-0">
                  <Stars value={t.rating} size={14} />
                  <blockquote className="t-lead mt-4 text-pretty">{t.text}</blockquote>
                  <figcaption>
                    <Byline t={t} />
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      )}

      {rest.length > 0 && (
        <ul className="mt-16 gap-x-10 border-t border-gunmetal md:columns-2 xl:columns-3">
          {rest.map((t) => (
            <li key={t.id} className="break-inside-avoid border-b border-gunmetal py-8">
              <figure>
                <Stars value={t.rating} size={14} />
                <blockquote className="mt-4 text-[1.0625rem] text-pretty">{t.text}</blockquote>
                <figcaption>
                  <Byline t={t} />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
