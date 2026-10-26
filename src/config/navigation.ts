export interface NavItem {
  href: string;
  label: string;
}

export const primaryNav: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/performance", label: "Performance" },
  { href: "/repairs", label: "Repairs" },
  { href: "/work", label: "Our Work" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** The appointment CTA. Points at the on-site enquiry form, which is always available. */
export const appointmentCta = { href: "/contact#enquiry", label: "Book a diagnostic" } as const;

export function enquiryHref(service?: string): string {
  return service ? `/contact?service=${encodeURIComponent(service)}#enquiry` : appointmentCta.href;
}
