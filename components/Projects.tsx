"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, reducedMotion, refreshScroll } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";
import { featuredProjects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const HOLD = 0.5; // extra viewport-heights of dwell after the rail finishes travelling

/** Horizontal gallery pinned while it travels, then held so the last card gets its dwell. */
export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const n = featuredProjects.length;

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const el = track.current!;
      // Travel until the last card's right edge (plus the rail's end padding) meets the viewport edge.
      const distance = () => {
        const last = el.lastElementChild as HTMLElement;
        return last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(el).paddingRight) - window.innerWidth;
      };
      const d = distance();
      const hold = window.innerHeight * HOLD;
      const ratio = d / (d + hold); // share of the pin spent travelling
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * HOLD}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const travel = Math.min(1, self.progress / ratio);
            if (counter.current) counter.current.textContent = String(Math.round(travel * (n - 1)) + 1).padStart(2, "0");
            if (bar.current) bar.current.style.transform = `scaleX(${travel})`;
          },
        },
      });
      tl.to(el, { x: () => -distance(), ease: "none", duration: d }).to({}, { duration: hold });

      // Keyboard focus on an off-screen card: scroll the page to that card's pin position
      // instead of letting the browser scroll the overflow-hidden section sideways.
      const onFocus = (e: FocusEvent) => {
        const card = (e.target as Element).closest<HTMLElement>("[data-card]");
        if (!card) return;
        section.current!.scrollLeft = 0;
        const i = Number(card.dataset.card);
        const st = tl.scrollTrigger!;
        scroll.lenis?.scrollTo(st.start + (i / (n - 1)) * (st.end - st.start) * ratio, { immediate: true });
      };
      el.addEventListener("focusin", onFocus);
      refreshScroll(); // pin spacing shifts everything below
      return () => el.removeEventListener("focusin", onFocus);
    }, section);
    return () => ctx.revert();
  }, [n]);

  return (
    <section
      id="projects"
      ref={section}
      className="relative h-svh overflow-hidden bg-ink motion-reduce:h-auto motion-reduce:overflow-x-auto"
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-end justify-between gap-6 px-6 pt-28 md:px-10">
        <div>
          <p className="label mb-4">Selected work</p>
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-none">Projects</h2>
        </div>
        <div className="flex flex-col items-end gap-3">
          <p className="label whitespace-nowrap" aria-live="polite">
            <span ref={counter}>01</span> / {String(n).padStart(2, "0")}
          </p>
          <span className="block h-px w-20 overflow-hidden bg-bone/15 md:w-32" aria-hidden>
            <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-bronze" />
          </span>
          <p className="label whitespace-nowrap">Scroll to move through</p>
        </div>
      </div>

      <div ref={track} className="flex h-full items-center gap-[6vw] pl-6 pr-[8vw] pt-52 md:pl-10">
        {featuredProjects.map((p, i) => (
          <div key={p.slug} data-card={i} className="w-[78vw] shrink-0 md:w-[58vw] lg:w-[min(44vw,72vh)]">
            <ProjectCard project={p} index={i} sizes="(min-width: 1024px) 44vw, (min-width: 768px) 58vw, 78vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
