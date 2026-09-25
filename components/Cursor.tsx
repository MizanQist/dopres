"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HOVER = "a, button, [data-cursor]";

/** Dot + ring cursor. Grows over links; shows a label over elements with data-cursor="Label". */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const t = text.current!;
    document.documentElement.classList.add("has-cursor");
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    let state = "";
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      if (!shown) { shown = true; gsap.to([d, r], { autoAlpha: 1, duration: 0.6 }); }
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.(HOVER);
      const label = el?.getAttribute("data-cursor") ?? "";
      const next = el ? (label ? "label" : "hover") : "";
      if (next === state) return;
      state = next;
      t.textContent = label;
      gsap.to(r, {
        scale: next === "label" ? 2.6 : next === "hover" ? 1.8 : 1,
        backgroundColor: next === "label" ? "rgba(176,141,87,0.92)" : "rgba(176,141,87,0)",
        borderColor: next ? "rgba(176,141,87,0.9)" : "rgba(242,240,235,0.4)",
        duration: 0.7,
      });
      gsap.to(d, { scale: next ? 0 : 1, duration: 0.5 });
    };
    const leave = () => { shown = false; gsap.to([d, r], { autoAlpha: 0, duration: 0.4 }); };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-100 h-1.5 w-1.5 rounded-full bg-bone opacity-0 mix-blend-difference"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-100 flex h-10 w-10 items-center justify-center rounded-full border border-bone/40 opacity-0"
      >
        <span ref={text} className="text-[4px] font-sans uppercase tracking-[0.2em] text-ink" />
      </div>
    </>
  );
}
