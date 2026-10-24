import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    ...(origin ? { sitemap: `${origin}/sitemap.xml`, host: origin } : {}),
  };
}
