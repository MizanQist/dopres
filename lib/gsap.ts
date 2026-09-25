import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "power3.out", duration: 1.2 });

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
/** Debounced ScrollTrigger.refresh(): several callers in one tick cost one reflow. */
export function refreshScroll() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
}

export { gsap, ScrollTrigger, SplitText };
