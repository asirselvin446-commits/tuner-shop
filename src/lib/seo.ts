import type { Metadata } from "next";
import { business, displayName, siteUrl } from "@/config/business";

interface PageMeta {
  title: string;
  description: string;
  /** Route path beginning with "/". */
  path: string;
  /** Path to a social image under /public, defaults to the hero still. */
  image?: string;
}

const DEFAULT_OG = "/media/stills/hero.jpg";

/** Page metadata with Open Graph. Canonical URLs are emitted only once the domain is configured. */
export function pageMetadata({ title, description, path, image = DEFAULT_OG }: PageMeta): Metadata {
  const origin = siteUrl();
  return {
    title,
    description,
    alternates: origin ? { canonical: `${origin}${path}` } : undefined,
    openGraph: {
      type: "website",
      title: `${title} | ${displayName()}`,
      description,
      siteName: business.name ?? undefined,
      url: origin ? `${origin}${path}` : undefined,
      images: [{ url: image, width: 1376, height: 768, alt: "Black sports coupé in a dark studio with red side lighting" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * LocalBusiness structured data. Returns null until the name and address are verified — publishing
 * partial or guessed LocalBusiness data is worse than publishing none. No ratings are ever emitted.
 */
export function localBusinessJsonLd(): Record<string, unknown> | null {
  if (!business.name || !business.address) return null;
  const origin = siteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
  };
  if (origin) data.url = origin;
  if (business.phone) data.telephone = business.phone;
  if (business.email) data.email = business.email;
  if (business.mapUrl) data.hasMap = business.mapUrl;
  if (business.geo) data.geo = { "@type": "GeoCoordinates", ...business.geo };
  if (business.logo && origin) data.logo = `${origin}${business.logo.src}`;
  if (business.socials.length) data.sameAs = business.socials.map((s) => s.url);
  if (business.openingHours) {
    data.openingHoursSpecification = business.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }
  return data;
}

/** Service structured data, emitted only when the provider (business name) is verified. */
export function serviceJsonLd(service: { name: string; summary: string; slug: string }): Record<string, unknown> | null {
  if (!business.name) return null;
  const origin = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    provider: { "@type": "AutoRepair", name: business.name, ...(origin ? { url: origin } : {}) },
    ...(business.address ? { areaServed: business.address.locality } : {}),
    ...(origin ? { url: `${origin}/services/${service.slug}` } : {}),
  };
}
