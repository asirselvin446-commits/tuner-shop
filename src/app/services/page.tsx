import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ServiceRows } from "@/components/services/ServiceRows";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { publishedServices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: "Diagnostics, ECM and BCM programming, immo unlock, key programming, airbag resets, cluster programming, remapping and race tuning, and GPS and security systems.",
  path: "/services",
});

export default function ServicesPage() {
  const all = publishedServices();
  return (
    <>
      <PageIntro
        title="Services"
        lead="Eight services for three kinds of visit: getting more from a healthy car, putting right a fault or a module, or keys and security."
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
      <section aria-labelledby="repair-heading" className="pt-28 md:pt-40">
        <div className="shell mb-16">
          <h2 id="repair-heading" className="t-h3 text-alloy">
            Diagnostics and programming
          </h2>
        </div>
        <ServiceRows items={all.filter((s) => s.track === "repair")} />
      </section>
      <section id="security" aria-labelledby="security-heading" className="scroll-mt-[calc(var(--header-h)+1.5rem)] pt-28 pb-28 md:pt-40 md:pb-40">
        <div className="shell mb-16">
          <h2 id="security-heading" className="t-h3 text-alloy">
            Keys and security
          </h2>
        </div>
        <ServiceRows items={all.filter((s) => s.track === "security")} />
      </section>
      <ClosingCta />
    </>
  );
}
