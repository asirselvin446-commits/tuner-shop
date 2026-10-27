import Link from "next/link";
import { diagnosticSteps } from "@/content/diagnostics";
import { Media } from "@/components/media/Media";
import { enquiryHref } from "@/config/navigation";
import { StepProgress } from "./StepProgress";

/**
 * Diagnostics and repair path. A light "lab" ground and plain typographic steps set it apart from the
 * performance sections. No decorative scan animations — nothing here should look like a real reading.
 */
export function DiagnosticJourney({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section aria-labelledby="diag-title" className="lab bg-lab py-24 text-lab-ink md:py-36">
      <div className="shell">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-5">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <Heading id="diag-title" data-reveal="lines" className="t-h1 uppercase md:text-[clamp(2.25rem,4vw,4.5rem)]">
                Diagnosis before parts.
              </Heading>
              <p className="t-lead mt-6 max-w-[38ch] text-lab-ink">
                For a warning light, a fault that keeps coming back, a module that needs programming or an airbag light after repairs.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-3">
                <Media id="diagnostics" reveal sizes="(min-width: 768px) 20vw, 50vw" className="aspect-[4/5]" />
                <Media id="ecuBoard" reveal sizes="(min-width: 768px) 20vw, 50vw" className="aspect-[4/5] translate-y-10" />
              </div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <div className="relative pl-6 md:pl-8">
              <StepProgress />
              <ol className="border-t border-lab-rule">
              {diagnosticSteps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-lab-rule py-8 md:grid-cols-[5rem_1fr] md:py-10">
                  <span className="step-index t-index pt-1 text-[1rem] text-lab-muted transition-colors duration-500" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="t-h3">{step.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-lab-muted">{step.body}</p>
                  </div>
                </li>
              ))}
              </ol>
            </div>
            <p className="mt-6 text-[0.875rem] text-lab-muted">
              A typical sequence. The exact procedure depends on the vehicle and the fault, and is confirmed when you book.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={enquiryHref("diagnostics-scanning")} className="btn btn-primary">
                Book a diagnostic
              </Link>
              <Link href="/repairs" className="btn btn-ghost">
                Repair services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
