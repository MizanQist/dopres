"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

// Placeholder figures. Edit freely; the count-up reads `value`.
const STATS = [
  { value: 12, suffix: "", label: "Landmark projects" },
  { value: 240, suffix: "K", label: "Square metres delivered" },
  { value: 6, suffix: "", label: "Cities" },
  { value: 18, suffix: "", label: "Years of practice" },
];

export default function Stats() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]");
      const items = gsap.utils.toArray<HTMLElement>("[data-stat]");
      const scrollTrigger = { trigger: root.current, start: "top 75%", once: true };
      gsap.from(items, { y: 28, autoAlpha: 0, stagger: 0.12, scrollTrigger });
      nums.forEach((el, i) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(el.dataset.count),
          duration: 2.4,
          delay: i * 0.12,
          scrollTrigger,
          onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("en"); },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="border-y border-bone/10 px-6 py-20 md:px-10 md:py-24">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} data-stat>
            <dd className="font-serif text-6xl font-light leading-none md:text-7xl">
              <span data-count={s.value}>{s.value.toLocaleString("en")}</span>
              <span className="text-bronze">{s.suffix}</span>
            </dd>
            <dt className="label mt-5">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
