"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { projects } from "@/data/projects";

/** Horizontal gallery pinned for as long as it takes to scroll its width. */
export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      // Pin spacing shifts everything below; recompute triggers created earlier.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={section} className="relative h-svh overflow-hidden bg-ink motion-reduce:h-auto motion-reduce:overflow-x-auto">
      <div className="absolute inset-x-0 top-0 z-10 flex items-end justify-between px-6 pt-28 md:px-10">
        <div>
          <p className="label mb-4">Selected work</p>
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-none">Projects</h2>
        </div>
        <p className="label hidden md:block">Scroll to move through</p>
      </div>

      <div ref={track} className="flex h-full items-center gap-[6vw] pl-6 pr-[8vw] pt-48 md:pl-10">
        {projects.map((p, i) => (
          <article key={p.slug} data-cursor="View" className="group w-[78vw] shrink-0 md:w-[58vw] lg:w-[min(44vw,72vh)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-bone/5 md:aspect-[16/10]">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 44vw, (min-width: 768px) 58vw, 78vw"
                className="object-cover transition-transform duration-[1600ms] ease-out-slow group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
              <div>
                <p className="label text-bronze">{String(i + 1).padStart(2, "0")} — {p.year}</p>
                <h3 className="mt-3 font-serif text-3xl font-light leading-tight md:text-4xl">{p.name}</h3>
                <p className="label mt-3">{p.location}</p>
              </div>
              <p className="label shrink-0 md:pt-1 md:text-right">{p.status}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
