/**
 * Live Google reviews via the Places API (New) — server-side only (the API key never reaches the browser).
 *
 * Reviews are fetched on every request with `cache: "no-store"`: Google Maps Platform terms restrict
 * caching or storing Places content, so review text is never written into the site or its build output.
 *
 * Configure with GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID (see .env.example). Until both are set the
 * reviews page shows a link to the business's reviews on Google Maps instead.
 */

export interface GoogleReview {
  id: string;
  rating: number;
  text: string;
  /** True when Google translated the review into the requested language. */
  translated: boolean;
  relativeTime: string;
  publishTime?: string;
  author: { name: string; uri?: string; photoUri?: string };
  /** Link to this review on Google Maps (required by the Places API policies). */
  mapsUri?: string;
  /** Link for reporting the review to Google. */
  flagUri?: string;
}

export interface PlaceReviews {
  name?: string;
  rating?: number;
  ratingCount?: number;
  mapsUri?: string;
  reviewsUri?: string;
  writeReviewUri?: string;
  reviews: GoogleReview[];
}

export type ReviewsResult =
  | { status: "ok"; data: PlaceReviews }
  | { status: "not_configured" }
  | { status: "error"; message: string };

interface ApiReview {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
  flagContentUri?: string;
}

interface ApiPlace {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string };
  reviews?: ApiReview[];
}

const FIELDS = ["displayName", "rating", "userRatingCount", "googleMapsUri", "googleMapsLinks", "reviews"].join(",");

export function reviewsConfigured(): boolean {
  return !!process.env.GOOGLE_PLACES_API_KEY && !!process.env.GOOGLE_PLACE_ID;
}

export async function getPlaceReviews(): Promise<ReviewsResult> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return { status: "not_configured" };

  const language = process.env.GOOGLE_PLACES_LANGUAGE || "en";
  // Override only for testing against a local mock; production always calls Google directly.
  const base = process.env.GOOGLE_PLACES_API_BASE || "https://places.googleapis.com";
  try {
    const res = await fetch(`${base}/v1/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(language)}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELDS },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: "error", message: `Places API responded ${res.status}` };
    const place = (await res.json()) as ApiPlace;

    return {
      status: "ok",
      data: {
        name: place.displayName?.text,
        rating: place.rating,
        ratingCount: place.userRatingCount,
        mapsUri: place.googleMapsUri,
        reviewsUri: place.googleMapsLinks?.reviewsUri ?? place.googleMapsUri,
        writeReviewUri: place.googleMapsLinks?.writeAReviewUri,
        reviews: (place.reviews ?? [])
          .filter((r) => r.text?.text || r.originalText?.text)
          .map((r, i) => ({
            id: r.name ?? `review-${i}`,
            rating: r.rating ?? 0,
            text: r.text?.text ?? r.originalText?.text ?? "",
            translated: !!r.originalText?.languageCode && !!r.text?.languageCode && r.originalText.languageCode !== r.text.languageCode,
            relativeTime: r.relativePublishTimeDescription ?? "",
            publishTime: r.publishTime,
            author: {
              name: r.authorAttribution?.displayName ?? "Google user",
              uri: r.authorAttribution?.uri,
              photoUri: r.authorAttribution?.photoUri,
            },
            mapsUri: r.googleMapsUri,
            flagUri: r.flagContentUri,
          })),
      },
    };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Request failed" };
  }
}
