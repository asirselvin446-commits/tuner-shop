import type { Metadata } from "next";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { OpeningHours } from "@/components/contact/OpeningHours";
import { business, contactChannels, formatAddress } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact and appointments",
  description: "Send an enquiry about diagnostics, ECU coding, remapping, tuning, ECU repair, DPF service or software updates.",
  path: "/contact",
});

const helpful = [
  "Warning lights or messages, and when they appear",
  "Fault codes, if you’ve had the car scanned",
  "Recent repairs or parts fitted",
  "Any modifications already on the car",
];

export default function ContactPage() {
  const channels = contactChannels();
  return (
    <div className="pt-[calc(var(--header-h)+3.5rem)] pb-24 md:pt-[calc(var(--header-h)+5.5rem)] md:pb-36">
      <div className="shell grid-12 gap-y-16">
        <header className="col-span-4 md:col-span-12">
          <h1 className="t-display max-w-[12ch]">Book a diagnostic</h1>
        </header>

        <section id="enquiry" aria-labelledby="enquiry-title" className="col-span-4 scroll-mt-[calc(var(--header-h)+1.5rem)] md:col-span-7">
          <h2 id="enquiry-title" className="sr-only">
            Enquiry form
          </h2>
          <EnquiryForm />
        </section>

        <aside className="col-span-4 space-y-12 md:col-span-4 md:col-start-9">
          {channels.length > 0 && (
            <section aria-labelledby="direct">
              <h2 id="direct" className="t-h3">
                Contact directly
              </h2>
              <ul className="mt-5 border-t border-gunmetal">
                {channels.map((c) => (
                  <li key={c.kind} className="border-b border-gunmetal">
                    <a
                      href={c.href}
                      className="flex items-baseline justify-between gap-4 py-4 hover:text-signal-text"
                      {...(c.kind === "directions" || c.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <span className="font-[600]">{c.label}</span>
                      <span className="text-alloy">{c.display}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {business.address && (
            <section aria-labelledby="address">
              <h2 id="address" className="t-h3">
                Workshop
              </h2>
              <address className="mt-4 not-italic text-alloy">
                {formatAddress(business.address).map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </section>
          )}

          {business.openingHours && (
            <section aria-labelledby="hours">
              <h2 id="hours" className="t-h3">
                Opening hours
              </h2>
              <div className="mt-4">
                <OpeningHours hours={business.openingHours} />
              </div>
            </section>
          )}

          <section aria-labelledby="helpful">
            <h2 id="helpful" className="t-h3">
              Useful to include
            </h2>
            <ul className="mt-5 space-y-3 text-alloy">
              {helpful.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-signal" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
