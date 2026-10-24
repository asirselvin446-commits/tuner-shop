import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { ServiceRows } from "@/components/services/ServiceRows";
import { PerformanceLab } from "@/components/lab/PerformanceLab";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { publishedServices } from "@/content/services";
import { enquiryHref } from "@/config/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Performance: ECU remapping and tuning",
  description:
    "Vehicle-specific ECU remapping and performance tuning, starting with a health check and finishing with verification. Results vary by vehicle.",
  path: "/performance",
});

const principles = [
  {
    title: "Health first",
    body: "Fault memory, live data and the condition of the engine are checked before any calibration. Faults are fixed first, not tuned around.",
  },
  {
    title: "Original software kept",
    body: "The factory software is read and archived before anything is written, so it can be restored.",
  },
  {
    title: "Calibrated to the hardware",
    body: "Changes match the engine, fitted parts, fuel and the way the car is used — not a generic file.",
  },
  {
    title: "Verified afterwards",
    body: "Fault memory and live data are checked again, with a measured assessment where it’s appropriate.",
  },
];

export default function PerformancePage() {
  const items = publishedServices().filter((s) => s.track === "performance");
  return (
    <>
      <PageIntro
        title="Performance"
        lead="Calibration for a healthy car with hardware that can support it. The goal is performance that’s consistent and drivable, every time."
        media="dyno"
      >
        <Link href={enquiryHref("performance-tuning")} className="btn btn-primary mt-8">
          Discuss your car
        </Link>
      </PageIntro>

      <section aria-labelledby="principles" className="shell py-24 md:py-36">
        <div className="grid-12 gap-y-12">
          <h2 id="principles" className="t-h2 col-span-4 uppercase md:col-span-4">
            Before any calibration
          </h2>
          <ol className="col-span-4 grid gap-x-10 gap-y-12 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {principles.map((p, i) => (
              <li key={p.title} className="border-t border-gunmetal pt-5">
                <span className="t-index text-signal-text">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-3">{p.title}</h3>
                <p className="mt-3 text-alloy">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Performance services" className="pb-24 md:pb-36">
        <ServiceRows items={items} />
      </section>

      <section aria-label="Performance lab" className="border-t border-gunmetal py-24 md:py-36">
        <div className="shell">
          <PerformanceLab />
        </div>
      </section>

      <section aria-labelledby="responsible" className="shell pb-24 md:pb-36">
        <div className="grid-12 gap-y-6 border-t border-gunmetal pt-10">
          <h2 id="responsible" className="t-h3 col-span-4 md:col-span-4">
            Responsible tuning
          </h2>
          <div className="col-span-4 space-y-4 text-alloy md:col-span-7 md:col-start-6">
            <p>
              Modifying a vehicle can affect its warranty, insurance and roadworthiness. Tell your insurer about changes, and check the
              regulations where you drive.
            </p>
            <p>Emissions-control equipment stays fitted and working. Work that removes or disables it, or hides emissions faults, isn’t offered.</p>
          </div>
        </div>
      </section>

      <ClosingCta title="What do you want from the car?" />
    </>
  );
}
