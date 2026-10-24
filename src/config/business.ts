/**
 * Central business configuration — the ONLY place business facts live.
 *
 * Rules for editing:
 *  - Enter a value only after it has been verified with the business owner or an authoritative source.
 *  - Leave anything unconfirmed as `null` (or an empty array). Components hide what is unset instead of
 *    showing a guess, and `missingBusinessFields()` lists every gap for the build-time setup notice.
 *  - Phone and WhatsApp numbers use E.164 format, e.g. "+441234567890".
 *
 * Status (2026-10-24): the Google Maps reference supplied by the client could not be resolved from the
 * build environment, so the business identity, address and contact details are still unverified.
 */
import type { ServiceSlug } from "@/content/services";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface OpeningHoursEntry {
  days: DayOfWeek[];
  /** 24h "HH:MM" */
  opens: string;
  closes: string;
}

export interface PostalAddress {
  streetAddress: string;
  locality: string;
  region?: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2, e.g. "GB" */
  country: string;
}

export interface VehicleModelAsset {
  /** Path under /public to a .glb/.gltf file, e.g. "/models/vehicle.glb". `null` = no model available. */
  src: string | null;
  /** Ownership / licence note for the model file. Required before publishing a model. */
  licence: string | null;
  /** Uniform scale and Y offset to sit the model on the studio floor. */
  scale: number;
  yOffset: number;
  /** Rotation around Y (radians) so the car faces the camera's front-left three-quarter. */
  yaw: number;
}

export interface BusinessConfig {
  /** Official trading name. */
  name: string | null;
  legalName: string | null;
  /**
   * Shown in the wordmark while `name` is unset. It is a category description, not a business name.
   */
  descriptor: string;
  logo: { src: string; width: number; height: number; alt: string } | null;
  address: PostalAddress | null;
  geo: { latitude: number; longitude: number } | null;
  /** Verified Google Maps place URL used for "Get directions". */
  mapUrl: string | null;
  /** Reference link supplied by the client. Kept for verification only — never rendered. */
  mapReference: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  openingHours: OpeningHoursEntry[] | null;
  /** Services the client has confirmed they provide. Drives navigation, pages and the enquiry form. */
  services: ServiceSlug[];
  socials: { label: string; url: string }[];
  /** Confirmed makes / vehicle groups. `null` = not confirmed, so no coverage claims are shown. */
  vehicleCoverage: string[] | null;
  vehicleModel: VehicleModelAsset;
  media: {
    /** True while the site uses illustrative footage rather than footage of this workshop. */
    illustrative: boolean;
  };
}

export const business: BusinessConfig = {
  name: null,
  legalName: null,
  descriptor: "ECU tuning & vehicle electronics",
  logo: null,
  address: null,
  geo: null,
  mapUrl: null,
  mapReference: "https://maps.app.goo.gl/FLwH4xRYVwbxjQoaA",
  phone: null,
  whatsapp: null,
  email: null,
  openingHours: null,
  services: ["ecu-coding", "dpf-service", "ecu-remapping", "performance-tuning", "ecu-repair", "software-updates"],
  socials: [],
  vehicleCoverage: null,
  vehicleModel: {
    src: null,
    licence: null,
    scale: 1,
    yOffset: 0,
    yaw: -0.6,
  },
  media: { illustrative: true },
};

/* ------------------------------------------------------------------ helpers */

/** Public site origin from NEXT_PUBLIC_SITE_URL, without trailing slash. `null` until the domain is known. */
export function siteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

/** Name for titles and the wordmark: the verified name, or the neutral descriptor. */
export function displayName(): string {
  return business.name ?? business.descriptor;
}

export type ContactChannel =
  | { kind: "phone"; label: string; href: string; display: string }
  | { kind: "whatsapp"; label: string; href: string; display: string }
  | { kind: "email"; label: string; href: string; display: string }
  | { kind: "directions"; label: string; href: string; display: string };

/** Only channels with verified values. Empty array means "use the enquiry form". */
export function contactChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [];
  if (business.phone) {
    channels.push({ kind: "phone", label: "Call", href: `tel:${business.phone}`, display: business.phone });
  }
  if (business.whatsapp) {
    const digits = business.whatsapp.replace(/[^\d]/g, "");
    channels.push({ kind: "whatsapp", label: "WhatsApp", href: `https://wa.me/${digits}`, display: business.whatsapp });
  }
  if (business.email) {
    channels.push({ kind: "email", label: "Email", href: `mailto:${business.email}`, display: business.email });
  }
  if (business.mapUrl) {
    channels.push({ kind: "directions", label: "Get directions", href: business.mapUrl, display: "Open in Google Maps" });
  }
  return channels;
}

export function formatAddress(address: PostalAddress): string[] {
  return [address.streetAddress, [address.locality, address.region].filter(Boolean).join(", "), address.postalCode];
}

/** Every unset field, for the development setup notice and the README checklist. */
export function missingBusinessFields(): string[] {
  const missing: string[] = [];
  const check = (label: string, value: unknown) => {
    if (value === null || (Array.isArray(value) && value.length === 0)) missing.push(label);
  };
  check("Official business name", business.name);
  check("Logo", business.logo);
  check("Address", business.address);
  check("Map coordinates", business.geo);
  check("Verified map URL", business.mapUrl);
  check("Phone", business.phone);
  check("WhatsApp", business.whatsapp);
  check("Email", business.email);
  check("Opening hours", business.openingHours);
  check("Social links", business.socials);
  check("Vehicle coverage", business.vehicleCoverage);
  check("3D vehicle model", business.vehicleModel.src);
  if (!siteUrl()) missing.push("Site domain (NEXT_PUBLIC_SITE_URL)");
  if (!process.env.ENQUIRY_WEBHOOK_URL) missing.push("Enquiry destination (ENQUIRY_WEBHOOK_URL)");
  return missing;
}
