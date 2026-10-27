import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { business, displayName, siteUrl } from "@/config/business";
import { localBusinessJsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SetupNotice } from "@/components/layout/SetupNotice";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

const origin = siteUrl();

export const metadata: Metadata = {
  metadataBase: origin ? new URL(origin) : undefined,
  title: {
    default: `${displayName()} — ECU diagnostics, programming, keys and tuning`,
    template: `%s | ${displayName()}`,
  },
  description:
    "Diagnostics, ECM and BCM programming, immo unlock, key programming, airbag resets, cluster programming, remapping and race tuning, and GPS and security systems — diagnosed properly before any work begins.",
  applicationName: business.name ?? undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0d0f",
  colorScheme: "dark",
};

/** Runs before paint: flags JS + reduced motion so reveal styles never flash or trap content. */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduce-motion')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = localBusinessJsonLd();
  return (
    <html lang="en" className={archivo.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </SmoothScroll>
        <SetupNotice />
      </body>
    </html>
  );
}
