/**
 * Booking form schema and validation, shared by the browser and the API route.
 */
import { services } from "@/content/services";

export const serviceOptions: { value: string; label: string }[] = [
  { value: "diagnosis", label: "Diagnosis: fault or warning light" },
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "not-sure", label: "Not sure yet" },
];

export interface Enquiry {
  name: string;
  mobile: string;
  make: string;
  model: string;
  year: string;
  service: string;
  message: string;
}

export type EnquiryField = keyof Enquiry;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const fieldOrder: EnquiryField[] = ["name", "mobile", "make", "model", "year", "service", "message"];

/**
 * Accepts Indian mobile numbers as people type them — 10 digits starting 6–9, with or without a
 * +91 / 91 / 0 prefix, spaces or dashes — and international numbers written with a leading "+".
 */
function mobileError(v: string): string | undefined {
  if (!v) return "Enter your mobile number.";
  if (!/^[+\d\s().-]+$/.test(v)) return "Use digits only, for example 98765 43210.";
  const digits = v.replace(/\D/g, "");
  const local = digits.replace(/^(91|0)(?=\d{10}$)/, "");
  if (/^[6-9]\d{9}$/.test(local)) return;
  if (v.startsWith("+") && digits.length >= 8 && digits.length <= 15) return;
  return "Enter a 10-digit mobile number, for example 98765 43210.";
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateField(field: EnquiryField, values: Partial<Record<EnquiryField, unknown>>): string | undefined {
  const v = str(values[field]);
  const maxYear = new Date().getFullYear() + 1;
  switch (field) {
    case "name":
      if (v.length < 2) return "Enter your name.";
      if (v.length > 80) return "Name must be 80 characters or fewer.";
      return;
    case "mobile":
      return mobileError(v);
    case "make":
      if (!v) return "Enter the vehicle make, for example Volkswagen.";
      if (v.length > 40) return "Make must be 40 characters or fewer.";
      return;
    case "model":
      if (!v) return "Enter the vehicle model, for example Golf.";
      if (v.length > 60) return "Model must be 60 characters or fewer.";
      return;
    case "year":
      if (!v) return;
      if (!/^\d{4}$/.test(v) || Number(v) < 1950 || Number(v) > maxYear) {
        return `Enter a four-digit year between 1950 and ${maxYear}, or leave it blank.`;
      }
      return;
    case "service":
      if (!serviceOptions.some((o) => o.value === v)) return "Choose a service, or “Not sure yet”.";
      return;
    case "message":
      if (v.length < 20) return "Describe the issue or goal in at least 20 characters.";
      if (v.length > 2000) return "Keep the description to 2,000 characters or fewer.";
      return;
  }
}

export function validateEnquiry(values: Partial<Record<EnquiryField, unknown>>): { ok: true; data: Enquiry } | { ok: false; errors: EnquiryErrors } {
  const errors: EnquiryErrors = {};
  for (const f of fieldOrder) {
    const e = validateField(f, values);
    if (e) errors[f] = e;
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: Object.fromEntries(fieldOrder.map((f) => [f, str(values[f])])) as unknown as Enquiry,
  };
}

/** Plain-text summary a visitor can copy if online delivery isn't available. */
export function enquirySummary(e: Partial<Enquiry>): string {
  const service = serviceOptions.find((o) => o.value === e.service)?.label ?? e.service;
  return [
    `Name: ${e.name ?? ""}`,
    `Mobile: ${e.mobile ?? ""}`,
    `Vehicle: ${[e.year, e.make, e.model].filter(Boolean).join(" ")}`,
    `Service: ${service ?? ""}`,
    "",
    e.message ?? "",
  ].join("\n");
}
