import Link from "next/link";
import { publishedCaseStudies } from "@/content/projects";
import { enquiryHref } from "@/config/navigation";
import { CaseStudyCard } from "./CaseStudyCard";

const anatomy = [
  { field: "Vehicle", note: "Make, model and year, where confirmed" },
  { field: "Concern or goal", note: "What the owner noticed or wanted" },
  { field: "Findings", note: "What diagnosis showed, and what it ruled out" },
  { field: "Work performed", note: "Each step that was actually carried out" },
  { field: "Changes", note: "Parts or software, where disclosed" },
  { field: "Verified result", note: "Measured or confirmed outcome only" },
  { field: "Limitations", note: "What varies, and what wasn’t possible" },
];

/**
 * "Our Work": lists verified case studies, or — until there are any — an honest empty state that shows
 * exactly what each published record will contain. Never filled with sample projects.
 */
export function WorkFramework({ headingLevel = 2, limit }: { headingLevel?: 2 | 1; limit?: number }) {
  const studies = publishedCaseStudies().slice(0, limit);
  const Heading = `h${headingLevel}` as const;

  return (
    <div className="grid-12 gap-y-12">
      <div className="col-span-4 md:col-span-5">
        <Heading data-reveal="lines" className="t-h1">Our work</Heading>
        {studies.length === 0 ? (
          <>
            <p className="t-lead mt-6 max-w-[36ch] text-alloy">
              No projects are published yet. Each one will appear here only once the work and its results are verified, with the owner’s
              consent.
            </p>
            <Link href={enquiryHref()} className="btn btn-ghost mt-10">
              Start an enquiry
            </Link>
          </>
        ) : (
          <p className="t-lead mt-6 max-w-[36ch] text-alloy">Real vehicles, the work carried out, and verified results.</p>
        )}
      </div>

      <div className="col-span-4 md:col-span-7">
        {studies.length > 0 ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {studies.map((s) => (
              <li key={s.slug}>
                <CaseStudyCard study={s} />
              </li>
            ))}
          </ul>
        ) : (
          <figure aria-labelledby="anatomy-caption" className="border border-gunmetal">
            <figcaption id="anatomy-caption" className="flex items-center justify-between border-b border-gunmetal px-5 py-4">
              <span className="font-[620]" style={{ fontStretch: "110%" }}>
                What every case study records
              </span>
            </figcaption>
            <dl>
              {anatomy.map((row) => (
                <div key={row.field} className="grid grid-cols-1 gap-1 border-b border-gunmetal px-5 py-4 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-[600]">{row.field}</dt>
                  <dd className="flex items-center gap-4 text-alloy">
                    <span className="text-[0.9375rem]">{row.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </figure>
        )}
      </div>
    </div>
  );
}
