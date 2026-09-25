import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

const MAX_BODY_BYTES = 20_000; // well above the field caps in lib/contact.ts

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { values, errors } = validateContact(body);
  if (errors) return NextResponse.json({ ok: false, errors }, { status: 400 });

  // ponytail: logs only. Send to email / CRM here when the client is ready.
  console.log("[contact]", new Date().toISOString(), values);
  return NextResponse.json({ ok: true });
}
