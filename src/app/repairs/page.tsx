import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { ServiceRows } from "@/components/services/ServiceRows";
import { DiagnosticJourney } from "@/components/diagnostics/DiagnosticJourney";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { publishedServices } from "@/content/services";
import { enquiryHref } from "@/config/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Repairs, diagnostics, coding and software updates",
  description:
    "Fault diagnosis, ECU service and repair, ECU coding, DPF service and vehicle software updates — the cause found before parts are replaced.",
  path: "/repairs",
});

export default function RepairsPage() {
  const items = publishedServices().filter((s) => s.track === "repair");
  return (
    <>
      <PageIntro
        title="Repairs and diagnostics"
        lead="Warning lights, modules that won’t talk, filters that keep blocking, software that needs updating. The cause is found first, so the fix is the right one."
        media="ecuBoard"
      >
        <Link href={enquiryHref("diagnosis")} className="btn btn-primary mt-8">
          Book a diagnostic
        </Link>
      </PageIntro>

      <div className="mt-24 md:mt-36">
        <DiagnosticJourney />
      </div>

      <section aria-labelledby="repair-services" className="py-24 md:py-36">
        <div className="shell mb-16">
          <h2 id="repair-services" data-reveal="lines" className="t-h1">
            Repair services
          </h2>
        </div>
        <ServiceRows items={items} />
      </section>

      <ClosingCta />
    </>
  );
}
