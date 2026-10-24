import Link from "next/link";
import { contactChannels } from "@/config/business";
import { appointmentCta } from "@/config/navigation";
import { Media } from "@/components/media/Media";

export function ClosingCta({ title = "Tell us what the car is doing." }: { title?: string }) {
  const channels = contactChannels();
  return (
    <section aria-labelledby="closing-title" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Media id="studio" sizes="100vw" className="h-full w-full" objectPosition="50% 60%" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-asphalt)_10%,color-mix(in_srgb,var(--color-asphalt)_55%,transparent)_60%,transparent)]" />
      <div className="shell py-28 md:py-44">
        <h2 id="closing-title" data-reveal="lines" className="t-h1 max-w-[13ch] uppercase text-balance">
          {title}
        </h2>
        <p className="t-lead mt-6 max-w-[42ch] text-alloy">
          Describe the symptoms or the goal, with the make and model. That’s enough to start.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={appointmentCta.href} className="btn btn-primary">
            {appointmentCta.label}
          </Link>
          {channels.map((c) => (
            <a key={c.kind} href={c.href} className="btn btn-ghost" {...(c.kind === "directions" || c.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
