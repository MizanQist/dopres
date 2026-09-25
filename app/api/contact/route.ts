import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";
import { site } from "@/data/site";

const MAX_BODY_BYTES = 20_000; // well above the field caps in lib/contact.ts
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// ponytail: in-memory per-instance limiter; move to Upstash/KV if abuse ever outruns it.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= MAX_PER_WINDOW;
}

/** Delivers by email when RESEND_API_KEY and CONTACT_TO are set; otherwise logs. */
async function deliver(values: { name: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.log("[contact]", new Date().toISOString(), values);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? `${site.name} website <onboarding@resend.dev>`,
      to: [to],
      reply_to: values.email,
      subject: `Website enquiry from ${values.name}`,
      text: `${values.message}\n\n— ${values.name} <${values.email}>`,
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot filled → a bot. Pretend it worked and drop it.
  if (typeof body === "object" && body && (body as { company?: unknown }).company) {
    return NextResponse.json({ ok: true });
  }

  const { values, errors } = validateContact(body); // same rules as the client
  if (errors) return NextResponse.json({ ok: false, errors }, { status: 400 });

  try {
    await deliver(values);
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
