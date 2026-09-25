import type Lenis from "lenis";

/** The live Lenis instance, set by <SmoothScroll>. Lets the nav lock/unlock scroll. */
export const scroll: { lenis: Lenis | null } = { lenis: null };
