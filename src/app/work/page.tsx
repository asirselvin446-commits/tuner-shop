import type { Metadata } from "next";
import { WorkFramework } from "@/components/work/WorkFramework";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our work",
  description: "Verified case studies of diagnostic, repair and tuning work, with the findings, work performed and limitations.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="shell pt-[calc(var(--header-h)+3.5rem)] pb-24 md:pt-[calc(var(--header-h)+5.5rem)] md:pb-36">
        <WorkFramework headingLevel={1} />
      </section>
      <ClosingCta />
    </>
  );
}
