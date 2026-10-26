import Link from "next/link";
import { business } from "@/config/business";
import { featuredTestimonials } from "@/content/testimonials";
import { RatingSummary } from "./RatingSummary";
import { Stars } from "./Stars";

/** Homepage proof point: dated Google rating, one customer quote, and a route to every review. */
export function HomeReviews() {
  const lead = featuredTestimonials()[0];
  const rating = business.googleRating;
  if (!lead && !rating) return null;

  return (
    <section aria-labelledby="home-reviews" className="border-t border-gunmetal bg-asphalt py-24 md:py-36">
      <div className="shell grid-12 gap-y-14">
        <div className="col-span-4 md:col-span-12 lg:col-span-5">
          <h2 id="home-reviews" data-reveal="lines" className="t-h1 lg:text-[clamp(2.25rem,4vw,4.5rem)]">
            What customers say
          </h2>
          {rating && (
            <div className="mt-10">
              <RatingSummary value={rating.value} count={rating.count} asOf={rating.asOf} size="md" />
            </div>
          )}
          <Link href="/reviews" className="btn btn-ghost mt-10">
            Read reviews
          </Link>
        </div>
        {lead && (
          <figure className="col-span-4 self-end md:col-span-12 lg:col-span-6 lg:col-start-7">
            <Stars value={lead.rating} size={18} />
            <blockquote className="mt-6 text-[clamp(1.375rem,2.3vw,2.125rem)] leading-[1.22] font-[600] tracking-[-0.01em] whitespace-pre-line text-pretty [font-stretch:104%]">
              {lead.text}
            </blockquote>
            <figcaption className="t-note mt-5">
              <span className="text-titanium">{lead.author}</span>, on Google Maps
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
