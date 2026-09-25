import Link from "next/link";
import { site } from "@/data/site";

const ICONS: Record<string, string> = {
  Instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 1.8A3.2 3.2 0 0 0 3.8 7v10A3.2 3.2 0 0 0 7 20.2h10a3.2 3.2 0 0 0 3.2-3.2V7A3.2 3.2 0 0 0 17 3.8H7Zm5 4.2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.4-2.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z",
  LinkedIn:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z",
  X: "M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L4.9 21H1.8l7.3-8.3L1.4 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.2h1.7L7 4.7H5.2l11.2 14.5Z",
};

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 px-6 pb-10 pt-20 md:px-10">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-5xl font-light tracking-[0.2em] md:text-6xl">{site.name}</p>
          <p className="mt-6 max-w-sm text-bone/60">{site.tagline}</p>
        </div>
        <div className="md:col-span-3">
          <p className="label mb-4">Navigate</p>
          <ul className="flex flex-col">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="tap link text-bone/80 transition-colors duration-500 hover:text-bone">{l.label}</a>
              </li>
            ))}
            <li>
              <Link href="/projects" className="tap link text-bone/80 transition-colors duration-500 hover:text-bone">All projects</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="label mb-6">Office</p>
          <address className="not-italic leading-relaxed text-bone/60">
            {site.address.map((line) => <p key={line}>{line}</p>)}
            <a href={`mailto:${site.email}`} className="tap link mt-2 text-bone/80">{site.email}</a>
          </address>
          <ul className="mt-6 -ml-3 flex">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center text-bone/50 transition-colors duration-500 hover:text-bronze"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={ICONS[s.label]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-6">
        <p className="label">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <a href="#top" className="ui tap link px-2 text-bone/70 hover:text-bone">Back to top</a>
      </div>
    </footer>
  );
}
