# DOPRES — marketing site

Dark, minimal, cinematic marketing site for DOPRES, a premium real-estate developer.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
npm test         # validation check (Node test runner, no extra deps)
```

## Layout

```
app/
  layout.tsx            fonts (Cormorant Garamond + Inter), nav, cursor, smooth scroll, footer
  page.tsx              hero + sections (everything below the hero is code-split)
  globals.css           brand tokens, base styles, small utilities
  api/contact/route.ts  POST handler for the contact form (logs to the server console)
components/
  ScrollVideoHero.tsx   scroll-scrubbed hero video
  Nav.tsx  About.tsx  Projects.tsx  Services.tsx  Stats.tsx  Contact.tsx  Footer.tsx
  Reveal.tsx            opacity + y reveal on scroll (optionally line-by-line via SplitText)
  Cursor.tsx            custom cursor (fine pointers only)
  SmoothScroll.tsx      Lenis wired to GSAP's ticker
data/
  site.ts               name, tagline, email, phone, address, nav links, socials
  projects.ts           the four gallery projects
lib/
  gsap.ts               plugin registration + defaults
  contact.ts            form validation shared by client and API route
app/projects/         /projects index and /projects/[slug] detail pages
app/robots.ts, app/sitemap.ts, app/icon.png, app/apple-icon.png
public/
  media/hero-scrub.<hash>.mp4 / .webm / hero-poster.<hash>.jpg   hero assets (immutable cache, see next.config.ts)
  hero.mp4              original source (gitignored; only needed to re-encode)
  projects/<slug>/N.jpg gallery images, cut from the client's renders by tools/prepare-images.py
tools/
  encode-hero.sh        re-encode + hash the hero media and update data/site.ts
  prepare-images.py     rebuild the project galleries from ~/Desktop/Clients/Dopres
```

## Replacing the hero video

The hero scrubs `currentTime` from scroll position, so the file must be encoded with **every frame a keyframe**
or seeking stutters. Put your new clip at `public/hero.mp4` (a 10–15 s drone shot works best) and run:

```bash
tools/encode-hero.sh                 # 1600px landscape at crf 28, 9:16 portrait crop for phones, poster
tools/encode-hero.sh 1920 30 520     # width, crf, and the left edge of the portrait crop (source pixels)
```

It writes all-keyframe H.264 files (landscape for tablets and desktops, a portrait crop for phones), a VP9
fallback and a frame-0 poster into `public/media/` with a content hash in each filename, and rewrites the four
`HERO_*` constants in `data/site.ts`. Pick the portrait crop offset by checking a few frames: the phone shows a
608×1080 window of the 1920×1080 source, so choose the x where the subject stays in frame across the shot, and
match the poster's mobile `object-position` in `ScrollVideoHero.tsx` (x + 304, as a percentage of 1920). The hash is what lets `next.config.ts`
serve `/media/*` with `Cache-Control: public, max-age=31536000, immutable`. Commit the new files and delete the old ones.

Install ffmpeg with `brew install ffmpeg` (macOS) or from https://ffmpeg.org/download.html.

Notes:
- `HALF_FRAME` in `ScrollVideoHero.tsx` assumes 24 fps. Change it to `1 / (fps * 2)` for other frame rates.
- The hero container is `200svh` tall, so the clip plays over one viewport-height of scrolling. Make it taller for
  a slower fly-through.
- Behaviour: the headline is visible from first paint over the poster; the video streams straight into the
  `<video>` element (no blob buffering) and fades up once `loadedmetadata` and a seek probe succeed. If seeking
  fails the video loops; under `prefers-reduced-motion` only the poster is shown. Phones get the portrait file.
- The video is deliberately not dimmed. Only a soft band at the top (for the nav) and one at the bottom (for the
  scroll cue and outro) sit over it, so the headline relies on its text shadow over bright frames.

## Editing projects

Edit `data/projects.ts`. Each project has a `slug` (its URL, `/projects/<slug>`), `name`, `type`, `location`,
`status`, `year`, `summary`, `scope`, `size`, `timeline`, `role`, an optional `featured` flag (shown in the
home-page rail) and an `images` array of `{ src, width, height, alt }`. The first image is the card image.

Images live under `public/projects/<slug>/`. They were cut from the client's renders by `tools/prepare-images.py`;
edit its `SPEC` and re-run it to add or regroup projects, then paste the printed dimensions into `projects.ts`.

Company details (email, phone, address, social links, nav labels) live in `data/site.ts`.
Services copy is at the top of `components/Services.tsx`; stats figures at the top of `components/Stats.tsx`.

## Changing colours and fonts

All brand tokens are in the `@theme` block at the top of `app/globals.css`:

```css
--color-ink: #0a0a0a;      /* background */
--color-bone: #f2f0eb;     /* text */
--color-bronze: #b08d57;   /* accent */
```

They are used as Tailwind classes (`bg-ink`, `text-bone`, `border-bronze`, `text-bone/60` …).
Fonts are loaded in `app/layout.tsx` with `next/font`; swap `Cormorant_Garamond` / `Inter` for any Google font
and keep the `--font-cormorant` / `--font-inter` variable names (or update them in `globals.css`).

## Contact form

`app/api/contact/route.ts` validates the payload with the same `validateContact()` the form uses, drops
submissions that fill the hidden honeypot field, and rate-limits each IP to 5 submissions per 10 minutes.

Delivery: with `RESEND_API_KEY` and `CONTACT_TO` set (Vercel → project → Settings → Environment Variables) it
emails each enquiry through https://resend.com (optionally `CONTACT_FROM` for a verified sender). Without them
it only logs the submission, visible under the project's Logs tab on Vercel.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The real domain, e.g. `https://dopres.com`. Sets canonical/OG URLs and, on the production deployment, turns indexing on. Until it is set every deployment is `noindex`. |
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | Contact-form delivery (see above). |

`VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_URL` are set by Vercel automatically and used as fallbacks for the
site URL, so social previews work on `dopres.vercel.app` before the real domain exists.

## Deploying to Vercel

1. Push the folder to a Git repository (GitHub, GitLab or Bitbucket).
2. On https://vercel.com click **Add New → Project**, import the repo and keep the defaults
   (framework: Next.js, build `next build`). No environment variables are needed.
3. Deploy. Every push to the main branch redeploys; pull requests get preview URLs.

Or from the terminal: `npm i -g vercel && vercel` (then `vercel --prod`).

The video assets are served from `public/` as static files. If you'd rather keep them out of Git, upload them to
Vercel Blob or any CDN and change the `MP4`, `WEBM` and `POSTER` constants in `components/ScrollVideoHero.tsx`.
