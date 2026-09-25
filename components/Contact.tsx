"use client";

import { useRef, useState, type FormEvent } from "react";
import Reveal from "@/components/Reveal";
import { validateContact, type ContactErrors } from "@/lib/contact";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";
const FIELDS: (keyof ContactErrors)[] = ["name", "email", "message"];

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const { values, errors } = validateContact(data);
    setErrors(errors ?? {});
    if (errors) {
      const first = FIELDS.find((f) => errors[f]);
      form.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, company: data.company ?? "" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field = (name: keyof ContactErrors) => ({
    name,
    id: name,
    className: "field",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onChange: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
  });
  const errorCount = FIELDS.filter((f) => errors[f]).length;

  return (
    <section id="contact" className="px-6 py-32 md:px-10 md:py-48">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal as="p" className="label mb-6">Contact</Reveal>
          <Reveal as="h2" lines className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.06]">
            Tell us about the site, the brief, or the idea.
          </Reveal>
          <Reveal delay={0.2} className="mt-14 grid gap-10 text-bone/70 sm:grid-cols-2">
            <address className="not-italic leading-relaxed">
              <p className="label mb-3">Office</p>
              {site.address.map((line) => <p key={line}>{line}</p>)}
            </address>
            <div>
              <p className="label mb-3">Email</p>
              <a href={`mailto:${site.email}`} className="tap link">{site.email}</a>
              <p className="label mt-6 mb-3">Phone</p>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="tap link">{site.phone}</a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-10">
            {/* Honeypot: real people never see or fill this. */}
            <div className="hp" aria-hidden>
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            {errorCount > 0 && (
              <p role="alert" className="ui text-bronze">
                Please check the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`}.
              </p>
            )}
            <div>
              <label htmlFor="name" className="label">Name</label>
              <input {...field("name")} type="text" autoComplete="name" placeholder="Your name" />
              {errors.name && <p id="name-error" className="mt-2 text-sm text-bronze">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input {...field("email")} type="email" autoComplete="email" placeholder="you@company.com" />
              {errors.email && <p id="email-error" className="mt-2 text-sm text-bronze">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="label">Message</label>
              <textarea {...field("message")} rows={5} placeholder="A few lines about what you have in mind" />
              {errors.message && <p id="message-error" className="mt-2 text-sm text-bronze">{errors.message}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <button type="submit" disabled={status === "sending"} className="btn">
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p className="ui text-bronze" role="status" aria-live="polite">
                {status === "sent" && "Thank you. We will be in touch shortly."}
                {status === "error" && "Something went wrong. Please email us directly."}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
