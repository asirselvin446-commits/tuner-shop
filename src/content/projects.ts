/**
 * Case studies ("Our Work").
 *
 * Add a project only with the business's approval and the customer's consent. A project is published
 * only when `status` is "published" AND `verified` is true. Every field must describe work that actually
 * happened; leave optional fields out rather than estimating them.
 */
import type { ServiceSlug } from "./services";

export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CaseStudy {
  slug: string;
  status: "published" | "draft";
  /** Confirmed by the business as an accurate record of real work. */
  verified: boolean;
  title: string;
  vehicle: { make: string; model: string; year?: number; engine?: string };
  services: ServiceSlug[];
  /** The customer’s concern or performance goal. */
  concern: string;
  findings: string[];
  workPerformed: string[];
  /** Parts or software changes, where the business is happy to disclose them. */
  changes?: string[];
  images?: { before?: CaseStudyImage; after?: CaseStudyImage; gallery?: CaseStudyImage[] };
  /** Verified outcome. Link `dynoRecordId` to a record in `dyno.ts` for measured results. */
  result?: { summary: string; dynoRecordId?: string };
  limitations: string[];
  /** ISO date the work was completed. */
  completed?: string;
}

export const caseStudies: CaseStudy[] = [];

export function publishedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => c.status === "published" && c.verified);
}

/**
 * Field guide rendered at /work/template-preview in development only, so the layout can be reviewed
 * before real projects exist. Every value describes the field — none of it is a real project.
 */
export const templatePreview: CaseStudy = {
  slug: "template-preview",
  status: "draft",
  verified: false,
  title: "Case study template",
  vehicle: { make: "Make", model: "Model", year: undefined, engine: "Engine code and fuel type" },
  services: ["ecu-repair"],
  concern: "The customer’s concern or goal, in plain language — what they noticed and what they wanted.",
  findings: [
    "What the diagnosis showed, including anything ruled out.",
    "Fault codes or measurements, only where they were actually recorded.",
  ],
  workPerformed: ["Each step of the work that was carried out, in order.", "How the result was verified."],
  changes: ["Parts replaced or software changes, if the business chooses to disclose them."],
  result: { summary: "The verified outcome. Link a dyno record for measured figures." },
  limitations: ["Anything the reader should know: what wasn’t possible, what varies between vehicles."],
};
