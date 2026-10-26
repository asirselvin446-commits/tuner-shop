import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Stars } from "@/components/reviews/Stars";
import { RatingSummary } from "@/components/reviews/RatingSummary";
import { Testimonials } from "@/components/reviews/Testimonials";
import { business, displayName } from "@/config/business";
import { testimonials } from "@/content/testimonials";
import { getPlaceReviews } from "@/lib/googleReviews";
import { pageMetadata } from "@/lib/seo";

// Live reviews are fetched on each request (Places API content may not be cached or stored), and the
// page must pick up the API key as soon as it is configured, without a rebuild.
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Reviews",
  description: `What customers say about ${displayName()} on Google Maps.`,
  path: "/reviews",
});

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function ReviewsPage() {
  const result = await getPlaceReviews();
  if (result.status === "error") console.error("Google reviews unavailable:", result.message);
  const live = result.status === "ok" ? result.data : null;
  const reviewsLink = live?.reviewsUri ?? business.mapUrl;

  // Prefer the live rating; otherwise show the dated snapshot.
  const rating =
    live?.rating !== undefined
      ? { value: live.rating, count: live.ratingCount, asOf: undefined }
      : business.googleRating
        ? { value: business.googleRating.value, count: business.googleRating.count, asOf: business.googleRating.asOf }
        : null;

  return (
    <>
      <PageIntro title="Reviews" lead={`What customers say about ${displayName()}, from our listing on Google Maps.`} />

      <section aria-labelledby="rating" className="shell pt-16 md:pt-24">
        <h2 id="rating" className="sr-only">
          Overall rating
        </h2>
        <div className="grid-12 items-end gap-y-8 border-b border-gunmetal pb-12">
          <div className="col-span-4 md:col-span-6">
            {rating ? (
              <RatingSummary value={rating.value} count={rating.count} asOf={rating.asOf} />
            ) : (
              <p className="t-lead max-w-[44ch] text-alloy">Customer reviews are published on Google Maps.</p>
            )}
          </div>
          <div className="col-span-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-span-6 md:justify-end">
            {reviewsLink && (
              <a href={reviewsLink} className="btn btn-ghost" {...external}>
                Read every review on Google Maps
              </a>
            )}
            {live?.writeReviewUri && (
              <a href={live.writeReviewUri} className="btn btn-primary" {...external}>
                Write a review
              </a>
            )}
          </div>
        </div>
      </section>

      {live && live.reviews.length > 0 && (
        <section aria-labelledby="latest" className="shell pt-20 md:pt-28">
          <h2 id="latest" data-reveal="lines" className="t-h2">
            Latest on Google Maps
          </h2>
          <ol className="mt-8 border-t border-gunmetal">
            {live.reviews.map((r) => (
              <li key={r.id} className="grid-12 gap-y-5 border-b border-gunmetal py-10 md:py-14">
                <div className="col-span-4 flex items-start gap-4 md:col-span-4">
                  {r.author.photoUri && (
                    // A plain <img>: Google review content may not be cached or re-hosted by an image optimiser.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.author.photoUri} alt="" width={44} height={44} referrerPolicy="no-referrer" className="h-11 w-11 shrink-0 rounded-full bg-graphite" />
                  )}
                  <div>
                    {r.author.uri ? (
                      <a href={r.author.uri} className="font-[620] hover:text-signal-text" {...external}>
                        {r.author.name}
                      </a>
                    ) : (
                      <p className="font-[620]">{r.author.name}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <Stars value={r.rating} size={14} />
                      {r.relativeTime && <span className="t-note">{r.relativeTime}</span>}
                    </div>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-7 md:col-start-6">
                  <blockquote className="t-lead whitespace-pre-line text-pretty">{r.text}</blockquote>
                  <div className="t-note mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {r.translated && <span>Translated by Google</span>}
                    {r.mapsUri && (
                      <a href={r.mapsUri} className="link-underline hover:text-titanium" {...external}>
                        View on Google Maps
                      </a>
                    )}
                    {r.flagUri && (
                      <a href={r.flagUri} className="link-underline hover:text-titanium" {...external}>
                        Report this review
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[70ch] text-[0.875rem] text-alloy">
            Live from <span className="text-titanium">Google Maps</span>, ordered by relevance. Google provides up to five reviews here.
          </p>
        </section>
      )}

      {testimonials.length > 0 && (
        <section aria-labelledby="selected" className="shell pt-20 pb-24 md:pt-28 md:pb-36">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="selected" data-reveal="lines" className="t-h2">
              Selected reviews
            </h2>
            <p className="max-w-[52ch] text-[0.9375rem] text-alloy md:text-right">
              A selection of 5-star reviews from our Google Maps listing, shown word for word with reviewers’ first names.{" "}
              {reviewsLink ? (
                <a href={reviewsLink} className="link-underline text-titanium" {...external}>
                  Read every review, including critical ones
                </a>
              ) : (
                "Every review, including critical ones, is on Google Maps"
              )}
              .
            </p>
          </div>
          <Testimonials />
        </section>
      )}

      <ClosingCta />
    </>
  );
}
