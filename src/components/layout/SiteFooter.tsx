import Link from "next/link";
import { business, contactChannels, displayName, formatAddress } from "@/config/business";
import { appointmentCta, primaryNav } from "@/config/navigation";
import { publishedServices } from "@/content/services";
import { OpeningHours } from "@/components/contact/OpeningHours";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  const channels = contactChannels();
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="relative border-t border-gunmetal bg-asphalt pt-20 pb-10 md:pt-28">
      <div className="shell">
        <div className="grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-5">
            <Wordmark />
            <p className="mt-6 max-w-[38ch] text-alloy">
              Engine calibration, control-module coding and repair, DPF service and vehicle software updates.
            </p>
            <Link href={appointmentCta.href} className="link-underline mt-6 inline-block text-[0.9375rem] font-[600]">
              {appointmentCta.label}
            </Link>
          </div>

          <nav id="footer-nav" aria-label="Footer" className="col-span-2 md:col-span-2 md:col-start-8">
            <p className="t-note mb-4">Site</p>
            <ul className="space-y-2.5">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-alloy transition-colors hover:text-titanium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <p className="t-note mb-4">Services</p>
            <ul className="space-y-2.5">
              {publishedServices().map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-alloy transition-colors hover:text-titanium">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid-12 mt-20 gap-y-8 border-t border-gunmetal pt-8">
          <div className="col-span-4 md:col-span-4">
            <p className="t-note mb-2">Workshop</p>
            {business.address ? (
              <address className="not-italic text-alloy">
                {formatAddress(business.address).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : (
              <p className="text-alloy">
                <Link href="/contact#enquiry" className="link-underline text-titanium">
                  Send an enquiry
                </Link>{" "}
                for location and availability.
              </p>
            )}
          </div>

          {channels.length > 0 && (
            <div className="col-span-4 md:col-span-4">
              <p className="t-note mb-2">Contact</p>
              <ul className="space-y-1.5">
                {channels.map((c) => (
                  <li key={c.kind}>
                    <a href={c.href} className="text-alloy hover:text-titanium" {...(c.kind === "directions" || c.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {c.label}: {c.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {business.openingHours && (
            <div className="col-span-4 md:col-span-4">
              <p className="t-note mb-2">Opening hours</p>
              <OpeningHours hours={business.openingHours} />
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-4 text-[0.8125rem] text-alloy md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-6">
            <p>
              © {year} {displayName()}
            </p>
            <a href="#main" className="link-underline text-titanium">
              Back to top
            </a>
          </div>
          <div className="max-w-[70ch] space-y-1.5 md:text-right">
            {business.media.illustrative && <p>Photography and video on this site are illustrative and do not show customer vehicles.</p>}
            <p>Tuning results vary with vehicle, hardware, fuel, condition, calibration and measurement method.</p>
          </div>
        </div>

        {business.socials.length > 0 && (
          <ul className="mt-6 flex gap-5 text-[0.875rem]">
            {business.socials.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-alloy hover:text-titanium">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
