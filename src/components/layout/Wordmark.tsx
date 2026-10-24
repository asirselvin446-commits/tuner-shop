import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";

/**
 * Brand mark. Uses the verified logo when configured; otherwise a typographic mark built from the
 * business name — or, while the name is unverified, the neutral service descriptor.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  const label = business.name ?? business.descriptor;

  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label={`${label} — home`}>
      {business.logo ? (
        <Image src={business.logo.src} width={business.logo.width} height={business.logo.height} alt={business.logo.alt} className="h-8 w-auto" priority />
      ) : (
        <>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
            <path d="M6 1h15l-5 20H1z" fill="var(--color-signal)" />
            <path d="M9.5 6h7.5l-.9 3.6H8.6z" fill="var(--color-asphalt)" />
          </svg>
          <span
            className="max-w-[16ch] text-[0.8125rem] leading-[1.05] font-[650] text-titanium sm:max-w-none sm:text-[0.875rem]"
            style={{ fontStretch: business.name ? "118%" : "84%" }}
          >
            {label}
          </span>
        </>
      )}
    </Link>
  );
}
