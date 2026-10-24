import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/projects";
import { getService } from "@/content/services";
import { dynoRecords } from "@/content/dyno";
import { enquiryHref } from "@/config/navigation";

/** Reusable case-study layout. Sections without data are omitted rather than padded. */
export function CaseStudyArticle({ study, isTemplate = false }: { study: CaseStudy; isTemplate?: boolean }) {
  const vehicle = [study.vehicle.year, study.vehicle.make, study.vehicle.model].filter(Boolean).join(" ");
  const dyno = study.result?.dynoRecordId ? dynoRecords.find((r) => r.id === study.result?.dynoRecordId) : undefined;

  return (
    <article className="pt-[calc(var(--header-h)+3rem)] pb-24 md:pb-36">
      {isTemplate && (
        <div className="shell mb-10">
          <p className="border border-signal px-4 py-3 text-[0.9375rem]">
            Template preview — visible in development only. Every value below describes a field; none of it is a real project.
          </p>
        </div>
      )}

      <header className="shell">
        <p className="t-note">
          <Link href="/work" className="hover:text-titanium">
            Our work
          </Link>
        </p>
        <h1 data-reveal="lines" className="t-h1 mt-4 max-w-[18ch] text-balance">{study.title}</h1>
        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-gunmetal pt-6 md:grid-cols-4">
          <div>
            <dt className="t-note">Vehicle</dt>
            <dd className="mt-1">{vehicle}</dd>
          </div>
          {study.vehicle.engine && (
            <div>
              <dt className="t-note">Engine</dt>
              <dd className="mt-1">{study.vehicle.engine}</dd>
            </div>
          )}
          <div>
            <dt className="t-note">Services</dt>
            <dd className="mt-1">
              {study.services.map((s, i) => (
                <span key={s}>
                  {i > 0 && ", "}
                  <Link href={`/services/${s}`} className="link-underline">
                    {getService(s)?.name}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
          {study.completed && (
            <div>
              <dt className="t-note">Completed</dt>
              <dd className="mt-1">{new Date(study.completed).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</dd>
            </div>
          )}
        </dl>
      </header>

      {(study.images?.before || study.images?.after) && (
        <div className="shell mt-16 grid gap-4 md:grid-cols-2">
          {(["before", "after"] as const).map((k) => {
            const img = study.images?.[k];
            if (!img) return null;
            return (
              <figure key={k}>
                <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full" />
                <figcaption className="t-note mt-2 capitalize">{k}</figcaption>
              </figure>
            );
          })}
        </div>
      )}

      <div className="shell mt-16 grid-12 gap-y-14">
        <div className="col-span-4 space-y-14 md:col-span-7">
          <Block title="The concern">
            <p className="t-lead text-pretty">{study.concern}</p>
          </Block>
          <Block title="Findings">
            <List items={study.findings} />
          </Block>
          <Block title="Work performed">
            <List items={study.workPerformed} ordered />
          </Block>
          {study.changes && study.changes.length > 0 && (
            <Block title="Parts and software changes">
              <List items={study.changes} />
            </Block>
          )}
        </div>
        <aside className="col-span-4 space-y-10 md:col-span-4 md:col-start-9">
          {study.result && (
            <div className="border-l-2 border-signal pl-5">
              <h2 className="t-h3">Verified result</h2>
              <p className="mt-3 text-alloy">{study.result.summary}</p>
              {dyno && (
                <p className="mt-3 text-[0.9375rem]">
                  Measured on: {dyno.conditions.method}, {dyno.conditions.correction}, {dyno.conditions.date}.
                </p>
              )}
            </div>
          )}
          {study.limitations.length > 0 && (
            <div>
              <h2 className="t-h3">Limitations</h2>
              <List items={study.limitations} />
            </div>
          )}
          <Link href={enquiryHref(study.services[0])} className="btn btn-primary w-full">
            Ask about similar work
          </Link>
        </aside>
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="t-h3 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="mt-3 space-y-3 border-t border-gunmetal">
      {items.map((item, i) => (
        <li key={item} className="flex gap-4 border-b border-gunmetal py-3 text-alloy">
          {ordered && <span className="t-index text-titanium">{String(i + 1).padStart(2, "0")}</span>}
          <span>{item}</span>
        </li>
      ))}
    </Tag>
  );
}
