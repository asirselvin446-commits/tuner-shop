import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { VehicleStory } from "@/components/home/VehicleStory";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { PerformanceLab } from "@/components/lab/PerformanceLab";
import { DiagnosticJourney } from "@/components/diagnostics/DiagnosticJourney";
import { WorkFramework } from "@/components/work/WorkFramework";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { HomeReviews } from "@/components/reviews/HomeReviews";
import { pageMetadata } from "@/lib/seo";
import { displayName } from "@/config/business";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "ECU diagnostics, programming, keys and tuning",
    description:
      "Diagnostics, ECM and BCM programming, immo unlock, key programming, airbag resets, cluster programming, remapping and race tuning, and GPS and security systems — with diagnosis before any work begins.",
    path: "/",
  }),
  title: { absolute: `${displayName()} — ECU diagnostics, programming, keys and tuning` },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <VehicleStory />
      <ServiceIndex />
      <section aria-label="Performance lab" className="border-t border-gunmetal bg-asphalt py-24 md:py-36">
        <div className="shell">
          <PerformanceLab />
        </div>
      </section>
      <DiagnosticJourney />
      <HomeReviews />
      <section className="bg-asphalt py-24 md:py-36">
        <div className="shell">
          <WorkFramework limit={2} />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
