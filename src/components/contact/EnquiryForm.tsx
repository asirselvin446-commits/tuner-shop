"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  enquirySummary,
  fieldOrder,
  serviceOptions,
  validateEnquiry,
  validateField,
  type Enquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";
import { contactChannels } from "@/config/business";

type Status = "idle" | "submitting" | "received" | "not_configured" | "failed" | "rate_limited";

const empty: Enquiry = { name: "", mobile: "", make: "", model: "", year: "", service: "", message: "" };

export function EnquiryForm() {
  const [values, setValues] = useState<Enquiry>(empty);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = `f${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const id = (f: string) => `${uid}-${f}`;
  const channels = contactChannels();

  // Prefill the service from ?service= (links from service pages).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (requested && serviceOptions.some((o) => o.value === requested)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
      setValues((v) => ({ ...v, service: requested }));
    }
  }, []);

  const update = (field: EnquiryField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
  };

  const blur = (field: EnquiryField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values) }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const result = validateEnquiry(values);
    if (!result.ok) {
      setErrors(result.errors);
      setTouched(Object.fromEntries(fieldOrder.map((f) => [f, true])));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, company: honeypot }),
      });
      const json = (await res.json().catch(() => ({}))) as { status?: string; errors?: EnquiryErrors };
      if (res.status === 422 && json.errors) {
        setErrors(json.errors);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setStatus(
        json.status === "received" ? "received" : json.status === "not_configured" ? "not_configured" : json.status === "rate_limited" ? "rate_limited" : "failed",
      );
    } catch {
      setStatus("failed");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(enquirySummary(values));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const errorList = fieldOrder.filter((f) => errors[f]);

  const describedBy = (f: EnquiryField, hint?: boolean) => [hint ? id(`${f}-hint`) : null, errors[f] ? id(`${f}-error`) : null].filter(Boolean).join(" ") || undefined;

  if (status === "received") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-l-2 border-signal py-2 pl-6 outline-none">
        <h3 className="t-h3">Request sent</h3>
        <p className="mt-3 max-w-[52ch] text-alloy">
          Your request has reached the workshop. This is not a confirmed booking — an appointment is only booked once the workshop confirms a
          time with you on your mobile number.
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-8"
          onClick={() => {
            setValues(empty);
            setTouched({});
            setStatus("idle");
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={id("intro")} className="relative">
      <p id={id("intro")} className="mb-10 max-w-[56ch] text-alloy">
        All fields are required except the model year. Sending this form doesn’t book an appointment; the workshop confirms bookings
        directly with you.
      </p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby={id("summary")} className="mb-10 border border-signal-text p-5 outline-none">
          <h3 id={id("summary")} className="font-[650]">
            {errorList.length === 1 ? "There is 1 problem with the form" : `There are ${errorList.length} problems with the form`}
          </h3>
          <ul className="mt-3 space-y-1.5">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="link-underline text-signal-text">
                  {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="grid gap-8 md:grid-cols-2">
        <legend className="t-h3 mb-6">You</legend>
        <div>
          <label htmlFor={id("name")} className="field-label">
            Name
          </label>
          <input
            id={id("name")}
            name="name"
            className="field-input"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
          />
          {errors.name && (
            <p id={id("name-error")} className="field-error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={id("mobile")} className="field-label">
            Mobile number
          </label>
          <input
            id={id("mobile")}
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            className="field-input"
            value={values.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            onBlur={() => blur("mobile")}
            aria-invalid={!!errors.mobile}
            aria-describedby={describedBy("mobile", true)}
          />
          <p id={id("mobile-hint")} className="mt-2 text-[0.8125rem] text-alloy">
            Used to call or message you about this request.
          </p>
          {errors.mobile && (
            <p id={id("mobile-error")} className="field-error">
              {errors.mobile}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="mt-14 grid gap-8 md:grid-cols-[1fr_1fr_10rem]">
        <legend className="t-h3 mb-6">The vehicle</legend>
        {(
          [
            { f: "make", label: "Make", auto: "off" },
            { f: "model", label: "Model", auto: "off" },
            { f: "year", label: "Model year (optional)", auto: "off" },
          ] as const
        ).map(({ f, label }) => (
          <div key={f}>
            <label htmlFor={id(f)} className="field-label">
              {label}
            </label>
            <input
              id={id(f)}
              name={f}
              className="field-input"
              inputMode={f === "year" ? "numeric" : undefined}
              maxLength={f === "year" ? 4 : undefined}
              value={values[f]}
              onChange={(e) => update(f, e.target.value)}
              onBlur={() => blur(f)}
              aria-invalid={!!errors[f]}
              aria-describedby={describedBy(f)}
            />
            {errors[f] && (
              <p id={id(`${f}-error`)} className="field-error">
                {errors[f]}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      <fieldset className="mt-14 grid gap-8">
        <legend className="t-h3 mb-6">What you need</legend>
        <div>
          <label htmlFor={id("service")} className="field-label">
            Service
          </label>
          <select
            id={id("service")}
            name="service"
            className="field-input"
            value={values.service}
            onChange={(e) => update("service", e.target.value)}
            onBlur={() => blur("service")}
            aria-invalid={!!errors.service}
            aria-describedby={describedBy("service")}
          >
            <option value="" disabled>
              Choose a service
            </option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id={id("service-error")} className="field-error">
              {errors.service}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={id("message")} className="field-label">
            The issue or goal
          </label>
          <textarea
            id={id("message")}
            name="message"
            className="field-input"
            placeholder="Warning lights, symptoms and when they happen, fault codes if you have them, or what you want from the car."
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={[describedBy("message"), id("message-count")].filter(Boolean).join(" ")}
          />
          <p id={id("message-count")} className="mt-2 text-right text-[0.8125rem] text-alloy tabular-nums">
            {values.message.trim().length} / 2,000
          </p>
          {errors.message && (
            <p id={id("message-error")} className="field-error">
              {errors.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Honeypot for bots. Hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary min-w-[14rem]" disabled={status === "submitting"} aria-disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send request"}
        </button>
        <p className="max-w-[44ch] text-[0.8125rem] text-alloy">Details are used only to respond to this request.</p>
      </div>

      {(status === "not_configured" || status === "failed" || status === "rate_limited") && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="mt-10 border border-signal-text p-5 outline-none">
          {status === "not_configured" && (
            <>
              <h3 className="font-[650]">Your request was not sent</h3>
              <p className="mt-2 text-alloy">
                Online requests aren’t connected yet, so nothing was delivered or stored.
                {channels.length > 0 ? " Please use one of the contact options on this page instead." : " You can copy your request below to send it another way."}
              </p>
            </>
          )}
          {status === "failed" && (
            <>
              <h3 className="font-[650]">Your request couldn’t be delivered</h3>
              <p className="mt-2 text-alloy">The connection failed or the inbox didn’t respond. Nothing has been booked. Try sending it again in a few minutes.</p>
            </>
          )}
          {status === "rate_limited" && (
            <>
              <h3 className="font-[650]">Too many requests from this connection</h3>
              <p className="mt-2 text-alloy">Wait ten minutes, then send it again.</p>
            </>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {status !== "not_configured" && (
              <button type="submit" className="btn btn-ghost min-h-[44px]">
                Send again
              </button>
            )}
            <button type="button" onClick={copySummary} className="btn btn-ghost min-h-[44px]">
              {copied ? "Request copied" : "Copy request text"}
            </button>
            {channels.map((c) => (
              <a key={c.kind} href={c.href} className="btn btn-ghost min-h-[44px]">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
