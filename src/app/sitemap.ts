import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/business";
import { publishedServices } from "@/content/services";
import { publishedCaseStudies } from "@/content/projects";

/** Sitemaps need absolute URLs, so this stays empty until NEXT_PUBLIC_SITE_URL is set. */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  if (!origin) return [];
  const paths = [
    "/",
    "/services",
    ...publishedServices().map((s) => `/services/${s.slug}`),
    "/performance",
    "/repairs",
    "/work",
    ...publishedCaseStudies().map((c) => `/work/${c.slug}`),
    "/about",
    "/contact",
  ];
  return paths.map((p) => ({ url: `${origin}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
