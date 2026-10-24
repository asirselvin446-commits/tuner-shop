import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { getService, publishedServices } from "@/content/services";
import { enquiryHref } from "@/config/navigation";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.name, description: service.summary, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = publishedServices().find((s) => s.slug === slug);
  if (!service) notFound();

  const related = publishedServices().filter((s) => s.slug !== service.slug && s.track === service.track);
  const jsonLd = serviceJsonLd(service);

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <PageIntro title={service.name} lead={service.summary} media={service.media} parent={{ href: "/services", label: "Services" }}>
        <Link href={enquiryHref(service.slug)} className="btn btn-primary mt-8">
          Enquire about this service
        </Link>
      </PageIntro>

      <div className="shell grid-12 gap-y-16 py-24 md:py-36">
        <div className="col-span-4 md:col-span-7">
          <div className="space-y-5">
            {service.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lead text-pretty" : "measure text-alloy text-pretty"}>
                {p}
              </p>
            ))}
          </div>

          <section aria-labelledby="involves" className="mt-20">
            <h2 id="involves" className="t-h2 uppercase md:text-[clamp(2rem,3vw,2.875rem)]">
              What it involves
            </h2>
            <ol className="mt-8 border-t border-gunmetal">
              {service.involves.map((item, i) => (
                <li key={item} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-gunmetal py-5">
                  <span className="t-index text-alloy">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="signs" className="mt-20">
            <h2 id="signs" className="t-h2 uppercase md:text-[clamp(2rem,3vw,2.875rem)]">
              When people ask for it
            </h2>
            <ul className="mt-8 space-y-3">
              {service.signs.map((item) => (
                <li key={item} className="flex gap-4 text-alloy">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="col-span-4 md:col-span-4 md:col-start-9">
          <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
            <section aria-labelledby="next-step" className="border border-gunmetal p-6 md:p-8">
              <h2 id="next-step" className="t-h3">
                Next step
              </h2>
              <p className="mt-3 text-alloy">{service.nextStep}</p>
              <Link href={enquiryHref(service.slug)} className="btn btn-primary mt-6 w-full">
                Start an enquiry
              </Link>
            </section>

            <section aria-labelledby="limits" className="mt-10">
              <h2 id="limits" className="t-h3">
                Good to know
              </h2>
              <ul className="mt-4 space-y-3 text-[0.9375rem] text-alloy">
                {service.limits.map((l) => (
                  <li key={l} className="border-l border-gunmetal pl-4">
                    {l}
                  </li>
                ))}
              </ul>
            </section>

            {related.length > 0 && (
              <nav aria-labelledby="related" className="mt-10">
                <h2 id="related" className="t-note mb-3">
                  Related services
                </h2>
                <ul className="border-t border-gunmetal">
                  {related.map((r) => (
                    <li key={r.slug} className="border-b border-gunmetal">
                      <Link href={`/services/${r.slug}`} className="block py-3 font-[560] hover:text-signal-text">
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>
      </div>

      <ClosingCta />
    </>
  );
}
