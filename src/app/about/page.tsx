import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { OpeningHours } from "@/components/contact/OpeningHours";
import { business, formatAddress } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "How diagnostic, programming, key and tuning work is approached: diagnosis first, originals kept, honest limits and honest records.",
  path: "/about",
});

// Working principles drawn from the service descriptions. The owner should review this copy.
const principles = [
  { title: "Diagnose before replacing", body: "Fault codes point the way; measurement confirms it. Parts are replaced when the evidence says so." },
  { title: "Keep the original", body: "Original software and coding are saved before changes, so the car can be returned to how it was." },
  { title: "Work to the car in front of us", body: "Calibration, coding and updates are matched to the exact vehicle, hardware and software level." },
  { title: "Say what isn’t possible", body: "Some modules can’t be coded, some units can’t be repaired, and some results can’t be promised. You hear that up front." },
  { title: "Keep safety and records honest", body: "Airbag systems are restored, never silenced. Odometers only ever show a car’s genuine mileage, and key or immobiliser work needs proof of ownership." },
];

export default function AboutPage() {
  const hasFacts = business.name || business.address || business.openingHours || (business.vehicleCoverage?.length ?? 0) > 0;
  return (
    <>
      <PageIntro
        title="About"
        lead="A workshop for vehicle electronics: diagnostics, module and key programming, airbag and cluster work, remapping and race tuning, and security systems."
        media="workshop"
      />

      <section aria-labelledby="approach" className="shell py-24 md:py-36">
        <div className="grid-12 gap-y-12">
          <h2 id="approach" data-reveal="lines" className="t-h1 col-span-4 md:col-span-5">
            How the work is approached
          </h2>
          <ul className="col-span-4 border-t border-gunmetal md:col-span-6 md:col-start-7">
            {principles.map((p) => (
              <li key={p.title} className="border-b border-gunmetal py-8">
                <h3 className="t-h3">{p.title}</h3>
                <p className="mt-3 max-w-[50ch] text-alloy">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {hasFacts && (
        <section aria-labelledby="workshop" className="shell pb-24 md:pb-36">
          <div className="grid-12 gap-y-8 border-t border-gunmetal pt-10">
            <h2 id="workshop" className="t-h3 col-span-4 md:col-span-4">
              The workshop
            </h2>
            <dl className="col-span-4 grid gap-6 sm:grid-cols-2 md:col-span-7 md:col-start-6">
              {business.name && (
                <div>
                  <dt className="t-note">Name</dt>
                  <dd className="mt-1">{business.name}</dd>
                </div>
              )}
              {business.address && (
                <div>
                  <dt className="t-note">Address</dt>
                  <dd className="mt-1">
                    {formatAddress(business.address).map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {business.openingHours && (
                <div>
                  <dt className="t-note">Opening hours</dt>
                  <dd className="mt-1">
                    <OpeningHours hours={business.openingHours} />
                  </dd>
                </div>
              )}
              {business.vehicleCoverage && business.vehicleCoverage.length > 0 && (
                <div>
                  <dt className="t-note">Vehicles</dt>
                  <dd className="mt-1">{business.vehicleCoverage.join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      {business.media.illustrative && (
        <section aria-labelledby="imagery" className="shell pb-24 md:pb-36">
          <div className="grid-12 gap-y-4 border-t border-gunmetal pt-10">
            <h2 id="imagery" className="t-h3 col-span-4 md:col-span-4">
              About the imagery
            </h2>
            <p className="col-span-4 max-w-[60ch] text-alloy md:col-span-7 md:col-start-6">
              Photographs and video on this site are illustrative. They don’t show this workshop’s customers, their vehicles or results.
            </p>
          </div>
        </section>
      )}

      <ClosingCta />
    </>
  );
}
