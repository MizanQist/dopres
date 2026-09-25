"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";
import { site } from "@/data/site";

export default function Nav() {
  const home = usePathname() === "/";
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  // On the home page anchors stay in-page so Lenis can glide to them.
  const href = (h: string) => (home ? h.replace(/^\//, "") : h);

  // Transparent over the hero, frosted once the pinned hero releases.
  useEffect(() => {
    if (!home) return; // other routes are always solid (see isSolid)
    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom bottom",
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    });
    return () => st.kill();
  }, [home]);

  useEffect(() => {
    if (open) scroll.lenis?.stop();
    else scroll.lenis?.start();
  }, [open]);

  const isSolid = solid || !home || open;

  const go = (e: React.MouseEvent<HTMLAnchorElement>, h: string) => {
    setOpen(false);
    if (!home) return; // full navigation to /#section
    e.preventDefault();
    scroll.lenis?.start();
    scroll.lenis?.scrollTo(h.replace(/^\//, ""));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-700 ease-out-slow ${
          isSolid
            ? "border-bone/10 bg-ink/70 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="flex h-20 items-center justify-between px-6 md:px-10">
          <Link href="/" className="tap font-serif text-2xl font-medium tracking-[0.22em]" aria-label={`${site.name} home`}>
            {site.name}
          </Link>
          <ul className="hidden items-center gap-6 md:flex">
            {site.nav.map((l) => (
              <li key={l.href}>
                <a href={href(l.href)} className="ui tap link px-2 text-bone/70 transition-colors duration-500 hover:text-bone">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className={`absolute h-px w-6 bg-bone transition-transform duration-500 ease-out-slow ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-6 bg-bone transition-transform duration-500 ease-out-slow ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-32 transition-opacity duration-700 ease-out-slow md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4">
          {site.nav.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              className={`transition-[opacity,transform] duration-700 ease-out-slow ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <a href={href(l.href)} onClick={(e) => go(e, l.href)} className="tap font-serif text-5xl font-light" tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            </li>
          ))}
          <li className={`mt-6 transition-[opacity,transform] duration-700 ease-out-slow ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: open ? "420ms" : "0ms" }}>
            <Link href="/projects" onClick={() => setOpen(false)} className="btn" tabIndex={open ? 0 : -1}>All projects</Link>
          </li>
        </ul>
        <div className="flex items-end justify-between">
          <a href={`mailto:${site.email}`} className="ui tap" tabIndex={open ? 0 : -1}>{site.email}</a>
          <span className="label text-bronze">{site.address[1]}</span>
        </div>
      </div>
    </>
  );
}
