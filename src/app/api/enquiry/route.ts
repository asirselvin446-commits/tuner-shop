import { NextResponse, type NextRequest } from "next/server";
import { serviceOptions, validateEnquiry } from "@/lib/enquiry";

/**
 * Enquiry endpoint. Validates server-side, then forwards to ENQUIRY_WEBHOOK_URL as JSON.
 * Responses describe exactly what happened — nothing here confirms a booking.
 *
 *   200 { status: "received" }        delivered to the configured destination
 *   422 { status: "invalid", errors } validation failed
 *   503 { status: "not_configured" }  no destination configured; nothing was sent or stored
 *   502 { status: "delivery_failed" } destination rejected or didn't respond
 *   429 { status: "rate_limited" }
 */

const MAX_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort, per-instance limiter. Use a shared store (e.g. Redis) if deployed across many instances.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BYTES) return NextResponse.json({ status: "invalid", errors: {} }, { status: 413 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ status: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "invalid", errors: {} }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ status: "invalid", errors: {} }, { status: 400 });
  }

  const result = validateEnquiry(body);
  if (!result.ok) return NextResponse.json({ status: "invalid", errors: result.errors }, { status: 422 });

  const destination = process.env.ENQUIRY_WEBHOOK_URL;
  if (!destination) return NextResponse.json({ status: "not_configured" }, { status: 503 });

  try {
    const res = await fetch(destination, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(process.env.ENQUIRY_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        type: "enquiry",
        submittedAt: new Date().toISOString(),
        ...result.data,
        serviceLabel: serviceOptions.find((o) => o.value === result.data.service)?.label,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return NextResponse.json({ status: "delivery_failed" }, { status: 502 });
  } catch {
    return NextResponse.json({ status: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ status: "received" });
}
