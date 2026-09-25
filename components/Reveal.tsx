"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, SplitText, reducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: "div" | "p" | "h2" | "h3" | "li" | "span";
  className?: string;
  /** Split into lines and reveal each line through a mask. */
  lines?: boolean;
  delay?: number;
};

/** Opacity + slight y reveal on scroll. Runs once. */
export default function Reveal({ children, as = "div", className, lines = false, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div"; // all allowed tags share the HTMLElement API we use

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current!;
    const ctx = gsap.context(() => {
      const scrollTrigger = { trigger: el, start: "top 88%", once: true };
      if (lines) {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          aria: "none", // keeps real text in the DOM; aria-label is prohibited on <p>
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, autoAlpha: 0, duration: 1.3, stagger: 0.09, delay, scrollTrigger }),
        });
      } else {
        gsap.from(el, { y: 28, autoAlpha: 0, duration: 1.2, delay, scrollTrigger });
      }
    });
    return () => ctx.revert();
  }, [lines, delay]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
