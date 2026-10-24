import Link from "next/link";
import type { ReactNode } from "react";
import type { MediaKey } from "@/content/media";
import { Media } from "@/components/media/Media";

interface Props {
  title: string;
  lead: ReactNode;
  media?: MediaKey;
  /** Parent page link shown above the title. */
  parent?: { href: string; label: string };
  children?: ReactNode;
}

/** Inner-page opening: oversized title left, lead offset right, wide media strip beneath. */
export function PageIntro({ title, lead, media, parent, children }: Props) {
  return (
    <header className="pt-[calc(var(--header-h)+3.5rem)] md:pt-[calc(var(--header-h)+5.5rem)]">
      <div className="shell">
        {parent && (
          <p className="t-note mb-6">
            <Link href={parent.href} className="hover:text-titanium">
              {parent.label}
            </Link>
          </p>
        )}
        <div className="grid-12 gap-y-8">
          <h1 data-reveal="lines" className="t-h1 col-span-4 text-balance md:col-span-12 lg:col-span-8">{title}</h1>
          <div className="col-span-4 self-end md:col-span-8 lg:col-span-4">
            <div className="t-lead max-w-[40ch] text-alloy text-pretty">{lead}</div>
            {children}
          </div>
        </div>
      </div>
      {media && (
        <div className="mt-14 md:mt-20 md:pl-[var(--gutter)]">
          <Media id={media} reveal priority sizes="100vw" className="aspect-[4/3] w-full sm:aspect-[16/9] md:aspect-[21/9]" />
        </div>
      )}
    </header>
  );
}
