"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";

const MP4 = "/hero-scrub.mp4";
const WEBM = "/hero-scrub.webm";
const POSTER = "/hero-poster.jpg";
const LERP = 0.1; // ponytail: per-tick lerp, frame-rate dependent but fine at 60–120Hz
const HALF_FRAME = 1 / 48; // source is 24fps; ignore seeks smaller than half a frame

type Mode = "loading" | "scrub" | "loop" | "still";

// Fetched once per page load, even across strict-mode remounts.
let blobPromise: Promise<Blob> | null = null;
let report: (p: number) => void = () => {};

function loadBlob(url: string) {
  blobPromise ??= (async () => {
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error(`video ${res.status}`);
    const total = Number(res.headers.get("content-length")) || 0;
    const reader = res.body.getReader();
    const chunks: BlobPart[] = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value as BlobPart);
      got += value.byteLength;
      if (total) report(got / total);
    }
    return new Blob(chunks, { type: res.headers.get("content-type") ?? "video/mp4" });
  })().catch((e) => {
    blobPromise = null; // let a later mount retry instead of caching the failure
    throw e;
  });
  return blobPromise;
}

/** Resolves after the page's load event so the 15 MB fetch never competes with the poster and fonts. */
const afterLoad = () =>
  new Promise<void>((resolve) =>
    document.readyState === "complete" ? resolve() : window.addEventListener("load", () => resolve(), { once: true }),
  );

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
    await once(v, "seeked", 1500);
    v.currentTime = 0;
    return true;
  } catch {
    return false;
  }
}

export default function ScrollVideoHero() {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const tagline = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<Mode>("loading");

  // Pin the stage for the 400vh wrapper and scrub the overlay text.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: wrap.current, start: "top top", end: "bottom bottom" };
      ScrollTrigger.create({ ...trigger, pin: stage.current, pinSpacing: false });
      gsap
        .timeline({ scrollTrigger: { ...trigger, scrub: true } })
        .to(title.current, { autoAlpha: 0, y: -24, ease: "none", duration: 0.15 }, 0.1)
        .fromTo(tagline.current, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.2 }, 0.62)
        .to({}, { duration: 0.18 }); // pad timeline to 1 so times above are scroll fractions
    }, wrap);
    return () => ctx.revert();
  }, []);

  // Load the whole file, then decide: scrub, loop fallback, or poster only.
  useEffect(() => {
    const v = video.current!;
    const url = v.canPlayType('video/mp4; codecs="avc1.640028"') ? MP4 : WEBM;
    let cancelled = false;
    let objectUrl: string | undefined;
    report = (p) => { if (bar.current) bar.current.style.transform = `scaleX(${p})`; };

    (async () => {
      if (reducedMotion()) { setMode("still"); return; }
      await afterLoad();
      if (cancelled) return;
      try {
        const blob = await loadBlob(url);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        v.src = objectUrl;
        await once(v, "loadedmetadata", 10000);
        // Safari (iOS especially) won't paint seeked frames until it has played once.
        await v.play().then(() => v.pause()).catch(() => {});
        const ok = await canSeek(v);
        if (!cancelled) setMode(ok ? "scrub" : "loop");
      } catch {
        if (cancelled) return;
        v.src = url; // blob failed: stream normally
        setMode("loop");
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

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

  // Fallback: plain muted loop.
  useEffect(() => {
    if (mode !== "loop") return;
    const v = video.current!;
    v.loop = true;
    v.play().then(() => gsap.to(v, { autoAlpha: 1, duration: 1.4 })).catch(() => {});
  }, [mode]);

  return (
    <section id="hero" ref={wrap} className="relative h-[400svh]">
      <div ref={stage} className="relative h-svh w-full overflow-hidden">
        <Image src={POSTER} alt="" fill priority sizes="100vw" className="object-cover object-center" />
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[28svh] bg-linear-to-b from-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45svh] bg-linear-to-t from-ink via-ink/55 to-transparent" />

        <div ref={title} className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="label mb-8">Premium real-estate development</p>
          <h1 className="font-serif text-[clamp(4rem,15vw,13rem)] font-light leading-none tracking-[0.18em] pl-[0.18em]">
            {site.name}
          </h1>
          <div className="absolute bottom-10 flex flex-col items-center gap-5">
            <span className="label">Scroll to explore</span>
            <span className="block h-14 w-px overflow-hidden bg-bone/15">
              <span className="cue-line block h-full w-full bg-bronze" />
            </span>
          </div>
        </div>

        <div ref={tagline} className="absolute bottom-12 left-6 max-w-2xl opacity-0 md:bottom-16 md:left-10">
          <p className="label mb-5 text-bronze">{site.name}</p>
          <p className="font-serif text-4xl font-light leading-[1.05] md:text-6xl lg:text-7xl">
            Developing landmarks.
            <br />
            Defining skylines.
          </p>
        </div>

        {mode === "loading" && (
          <div className="absolute bottom-10 right-6 flex items-center gap-4 md:right-10" role="status" aria-live="polite">
            <span className="label">Loading</span>
            <span className="block h-px w-20 overflow-hidden bg-bone/15">
              <span ref={bar} className="block h-full w-full origin-left scale-x-0 bg-bronze transition-transform duration-300" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
