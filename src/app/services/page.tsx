import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ServiceRows } from "@/components/services/ServiceRows";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { publishedServices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: "ECU coding, ECU remapping, performance tuning, ECU service and repair, DPF service and vehicle software updates.",
  path: "/services",
});

export default function ServicesPage() {
  const all = publishedServices();
  return (
    <>
      <PageIntro
        title="Services"
        lead="Six services for two kinds of visit: getting more from a healthy car, or putting right a fault, a part or out-of-date software."
        media="workshop"
      />
      <section aria-labelledby="perf-heading" className="pt-28 md:pt-40">
        <div className="shell mb-16">
          <h2 id="perf-heading" className="t-h3 text-alloy">
            Performance
          </h2>
        </div>
        <ServiceRows items={all.filter((s) => s.track === "performance")} />
      </section>
      <section aria-labelledby="repair-heading" className="pt-28 pb-28 md:pt-40 md:pb-40">
        <div className="shell mb-16">
          <h2 id="repair-heading" className="t-h3 text-alloy">
            Repair, coding and updates
          </h2>
        </div>
        <ServiceRows items={all.filter((s) => s.track === "repair")} />
      </section>
      <ClosingCta />
    </>
  );
}
