"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion, refreshScroll } from "@/lib/gsap";
import { HERO_MP4, HERO_MP4_PORTRAIT, HERO_POSTER, HERO_WEBM, site } from "@/data/site";

const LERP = 0.1; // ponytail: per-tick lerp, frame-rate dependent but fine at 60–120Hz
const HALF_FRAME = 1 / 48; // source is 24fps; ignore seeks smaller than half a frame

type Mode = "loading" | "scrub" | "loop" | "still";

function once(el: HTMLMediaElement, event: string, ms: number) {
  return new Promise<void>((resolve, reject) => {
    const ac = new AbortController();
    const done = (fn: () => void) => () => { clearTimeout(timer); ac.abort(); fn(); };
    const timer = setTimeout(done(() => reject(new Error(`${event} timeout`))), ms);
    el.addEventListener(event, done(resolve), { once: true, signal: ac.signal });
    el.addEventListener("error", done(() => reject(new Error("video error"))), { once: true, signal: ac.signal });
  });
}

async function canSeek(v: HTMLVideoElement) {
  try {
    v.currentTime = 0.2;
    await once(v, "seeked", 4000);
    v.currentTime = 0;
    return true;
  } catch {
    return false;
  }
}

/**
 * Pinned hero. Copy is visible from first paint over the poster; the video streams in
 * behind it (browser range requests, no blob buffering) and fades up once it can seek.
 * Phones get a portrait crop of the same shot; reduced motion gets the poster alone.
 */
export default function ScrollVideoHero() {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const lockup = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<Mode>("loading");

  // Pin the stage for the 200svh wrapper; scrub the lockup out and the outro in.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: wrap.current, start: "top top", end: "bottom bottom" };
      ScrollTrigger.create({ ...trigger, pin: stage.current, pinSpacing: false });
      gsap
        .timeline({ scrollTrigger: { ...trigger, scrub: true } })
        .to(lockup.current, { autoAlpha: 0, y: -24, ease: "none", duration: 0.2 }, 0.25)
        .fromTo(outro.current, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.2 }, 0.62)
        .to({}, { duration: 0.18 }); // pad to 1 so the times above are scroll fractions
      // Entrance on mount: position only, so the copy is legible from first paint.
      if (!reducedMotion()) {
        gsap.from(copy.current!.children, { y: 24, duration: 1.4, stagger: 0.08, clearProps: "transform" });
      }
    }, wrap);
    return () => ctx.revert();
  }, []);

  // Decide the mode, then stream the video straight into the element.
  useEffect(() => {
    const v = video.current!;
    let cancelled = false;
    const onProgress = () => {
      const b = v.buffered;
      if (bar.current && b.length && v.duration) bar.current.style.transform = `scaleX(${b.end(b.length - 1) / v.duration})`;
    };
    (async () => {
      if (reducedMotion()) { setMode("still"); return; }
      v.addEventListener("progress", onProgress);
      try {
        const portrait = window.matchMedia("(max-width: 767px)").matches;
        v.src = !v.canPlayType('video/mp4; codecs="avc1.640028"') ? HERO_WEBM : portrait ? HERO_MP4_PORTRAIT : HERO_MP4;
        v.load();
        await once(v, "loadedmetadata", 15000);
        // Safari (iOS especially) won't paint seeked frames until it has played once.
        await v.play().then(() => v.pause()).catch(() => {});
        const ok = await canSeek(v);
        if (!cancelled) setMode(ok ? "scrub" : "loop");
      } catch {
        if (!cancelled) setMode("loop");
      }
    })();
    return () => { cancelled = true; v.removeEventListener("progress", onProgress); };
  }, []);

  // The layout settles when the mode resolves: recompute every ScrollTrigger.
  useEffect(() => { if (mode !== "loading") refreshScroll(); }, [mode]);

  // Scrub: scroll progress → lerped target → currentTime, once per animation frame.
  useEffect(() => {
    if (mode !== "scrub") return;
    const v = video.current!;
    gsap.to(v, { autoAlpha: 1, duration: 1.4 });
    let target = 0;
    let current = 0;
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => { target = self.progress; },
    });
    target = current = st.progress;
    const end = v.duration - 0.05;
    const tick = () => {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.0005) current = target;
      const t = Math.min(current * v.duration, end);
      if (!v.seeking && Math.abs(v.currentTime - t) > HALF_FRAME) v.currentTime = t;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, [mode]);

  // Fallback: plain muted loop (only fades up once it is really playing).
  useEffect(() => {
    if (mode !== "loop") return;
    const v = video.current!;
    v.loop = true;
    v.play().then(() => gsap.to(v, { autoAlpha: 1, duration: 1.4 })).catch(() => {});
  }, [mode]);

  return (
    <section id="hero" ref={wrap} className="relative h-[200svh]">
      <div ref={stage} className="relative h-svh w-full overflow-hidden">
        <Image src={HERO_POSTER} alt="" fill priority sizes="100vw" className="object-cover object-[43%_50%] md:object-center" />
        {mode !== "still" && (
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0"
          />
        )}

        {/* Soft bands only: one behind the nav, one so the outro and cue stay legible. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28svh] bg-linear-to-b from-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45svh] bg-linear-to-t from-ink via-ink/55 to-transparent" />

        {/* Centred lockup, faded out at 25–45% of the scroll. */}
        <div ref={lockup} className="absolute inset-0">
          <div ref={copy} data-hero="copy" className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 flex-col items-center text-center md:inset-x-10">
            <p className="label mb-8 text-bone/90">{site.name} · Premium real-estate development</p>
            <h1 className="font-serif text-[clamp(2.9rem,8vw,7.5rem)] font-light leading-[1.02] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
              Developing landmarks.
              <br />
              Defining skylines.
            </h1>
            <div className="mt-10">
              <a href="#projects" className="btn">View projects</a>
            </div>
          </div>
          <div data-hero="cue" className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-5">
            <span className="label text-bone/90">Scroll to explore</span>
            <span className="block h-14 w-px overflow-hidden bg-bone/15">
              <span className="cue-line block h-full w-full bg-bronze" />
            </span>
          </div>
        </div>

        {/* Outro, scrubbed in over the last 40%. */}
        <div ref={outro} data-hero="outro" className="absolute bottom-12 left-6 max-w-xl opacity-0 md:bottom-16 md:left-10">
          <p className="label mb-5 text-bone/90">Selected work</p>
          <p className="font-serif text-3xl font-light leading-[1.1] md:text-5xl">
            Twelve landmarks across Abuja, Lagos, Kano and Port Harcourt.
          </p>
        </div>

        {mode === "loading" && (
          <div className="absolute right-6 top-24 hidden items-center gap-4 md:flex md:right-10" role="status" aria-live="polite">
            <span className="label">Loading film</span>
            <span className="block h-px w-20 overflow-hidden bg-bone/15">
              <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-bronze transition-transform duration-300" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
