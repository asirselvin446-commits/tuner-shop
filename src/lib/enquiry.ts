/**
 * Enquiry form schema and validation, shared by the browser and the API route.
 */
import { services } from "@/content/services";

export const contactMethods = [
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
] as const;

export type ContactMethod = (typeof contactMethods)[number]["value"];

export const serviceOptions: { value: string; label: string }[] = [
  { value: "diagnosis", label: "Diagnosis: fault or warning light" },
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "not-sure", label: "Not sure yet" },
];

export interface Enquiry {
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
  make: string;
  model: string;
  year: string;
  service: string;
  message: string;
}

export type EnquiryField = keyof Enquiry;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const fieldOrder: EnquiryField[] = ["name", "contactMethod", "contactValue", "make", "model", "year", "service", "message"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateField(field: EnquiryField, values: Partial<Record<EnquiryField, unknown>>): string | undefined {
  const v = str(values[field]);
  const maxYear = new Date().getFullYear() + 1;
  switch (field) {
    case "name":
      if (v.length < 2) return "Enter your name.";
      if (v.length > 80) return "Name must be 80 characters or fewer.";
      return;
    case "contactMethod":
      if (!contactMethods.some((m) => m.value === v)) return "Choose how you’d like to be contacted.";
      return;
    case "contactValue": {
      const method = str(values.contactMethod);
      if (method === "email") {
        if (!EMAIL.test(v)) return "Enter an email address, like name@example.com.";
        if (v.length > 120) return "Email must be 120 characters or fewer.";
        return;
      }
      const digits = v.replace(/\D/g, "");
      if (!/^[+\d\s().-]*$/.test(v) || digits.length < 7 || digits.length > 15) {
        return "Enter a phone number with 7 to 15 digits, including the country code if you’re outside the country.";
      }
      return;
    }
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
  const method = contactMethods.find((m) => m.value === e.contactMethod)?.label ?? e.contactMethod;
  return [
    `Name: ${e.name ?? ""}`,
    `Contact: ${method ?? ""} ${e.contactValue ?? ""}`.trim(),
    `Vehicle: ${[e.year, e.make, e.model].filter(Boolean).join(" ")}`,
    `Service: ${service ?? ""}`,
    "",
    e.message ?? "",
  ].join("\n");
}
