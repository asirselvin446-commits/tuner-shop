import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Stars } from "@/components/reviews/Stars";
import { business } from "@/config/business";
import { getPlaceReviews } from "@/lib/googleReviews";
import { pageMetadata } from "@/lib/seo";

// Reviews are fetched live on each request (Places API content may not be cached or stored), and the
// page must pick up the API key as soon as it is configured, without a rebuild.
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Reviews",
  description: "Customer reviews from Google Maps, shown as Google publishes them.",
  path: "/reviews",
});

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function ReviewsPage() {
  const result = await getPlaceReviews();
  if (result.status === "error") console.error("Google reviews unavailable:", result.message);
  const data = result.status === "ok" ? result.data : null;
  const reviewsLink = data?.reviewsUri ?? business.mapUrl;

  return (
    <>
      <PageIntro title="Reviews" lead="What customers have said about the work, published on Google Maps and shown here as Google provides it." />

      <section aria-labelledby="google-reviews" className="shell py-20 md:py-28">
        <h2 id="google-reviews" className="sr-only">
          Reviews on Google Maps
        </h2>

        {data && data.rating !== undefined ? (
          <div className="grid-12 items-end gap-y-8 border-b border-gunmetal pb-12">
            <div className="col-span-4 md:col-span-6">
              <p className="t-display !normal-case tabular-nums" aria-hidden="true">
                {data.rating.toFixed(1)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Stars value={data.rating} size={22} />
                {data.ratingCount !== undefined && (
                  <p className="text-alloy">
                    {data.ratingCount.toLocaleString("en-GB")} {data.ratingCount === 1 ? "review" : "reviews"} on <span className="text-titanium">Google Maps</span>
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-span-6 md:justify-end">
              {reviewsLink && (
                <a href={reviewsLink} className="btn btn-ghost" {...external}>
                  Read all reviews on Google Maps
                </a>
              )}
              {data.writeReviewUri && (
                <a href={data.writeReviewUri} className="btn btn-primary" {...external}>
                  Write a review
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="grid-12 gap-y-8">
            <p className="t-lead col-span-4 max-w-[44ch] text-alloy md:col-span-7">
              Customer reviews are published on Google Maps, where you can read every review and leave your own.
            </p>
            {reviewsLink && (
              <div className="col-span-4 md:col-span-4 md:col-start-9 md:justify-self-end">
                <a href={reviewsLink} className="btn btn-primary" {...external}>
                  Read reviews on Google Maps
                </a>
              </div>
            )}
          </div>
        )}

        {data && data.reviews.length > 0 && (
          <>
            <ol className="mt-4">
              {data.reviews.map((r) => (
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
            <p className="mt-8 max-w-[70ch] text-[0.875rem] text-alloy">
              Reviews from <span className="text-titanium">Google Maps</span>, ordered by relevance. Google provides up to five reviews here;{" "}
              {reviewsLink ? (
                <a href={reviewsLink} className="link-underline text-titanium" {...external}>
                  read every review on Google Maps
                </a>
              ) : (
                "every review is on Google Maps"
              )}
              .
            </p>
          </>
        )}
      </section>

      <ClosingCta />
    </>
  );
}
