import Link from "next/link";
import { publishedServices } from "@/content/services";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-end pt-[calc(var(--header-h)+3rem)] pb-24">
      <p className="t-index text-[1rem] text-signal-text">404</p>
      <h1 className="t-display mt-4 max-w-[14ch]">No signal on this page.</h1>
      <p className="t-lead mt-8 max-w-[44ch] text-alloy">The address may have changed. Try the homepage or one of the services below.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the homepage
        </Link>
      </div>
      <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-2 text-alloy">
        {publishedServices().map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`} className="hover:text-titanium">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
