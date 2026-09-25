"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, refreshScroll } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    scroll.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Late-arriving fonts, images and pin spacers shift layout: measure everything again once the
    // page has fully loaded, then land on the URL hash (the browser jumped to its pre-layout position).
    const settle = () => {
      refreshScroll();
      const target = location.hash && document.getElementById(location.hash.slice(1));
      if (target) setTimeout(() => { lenis.scrollTo(target, { immediate: true }); ScrollTrigger.refresh(); }, 250);
    };
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });
    return () => {
      window.removeEventListener("load", settle);
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll.lenis = null;
    };
  }, []);
  return null;
}
