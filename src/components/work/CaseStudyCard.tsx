import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/projects";
import { getService } from "@/content/services";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const cover = study.images?.after ?? study.images?.before;
  const vehicle = [study.vehicle.year, study.vehicle.make, study.vehicle.model].filter(Boolean).join(" ");
  return (
    <Link href={`/work/${study.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <p className="t-note mt-4">{study.services.map((s) => getService(s)?.name).filter(Boolean).join(", ")}</p>
      <h3 className="t-h3 mt-2">{study.title}</h3>
      <p className="mt-1 text-alloy">{vehicle}</p>
    </Link>
  );
}
