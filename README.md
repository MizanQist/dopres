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
public/
  hero-scrub.mp4 / .webm / hero-poster.jpg   hero assets used by the site
  hero.mp4              original source (not used at runtime — safe to delete or gitignore)
  projects/01–04.jpg    gallery images
source/                 original renders the gallery images were cut from
```

## Replacing the hero video

The hero scrubs `currentTime` from scroll position, so the file must be encoded with **every frame a keyframe**
or seeking stutters. Put your new clip at `public/hero.mp4` (a 10–15 s drone shot works best) and run:

```bash
# all-keyframe H.264 (primary)
ffmpeg -i public/hero.mp4 -an -c:v libx264 -g 1 -keyint_min 1 -pix_fmt yuv420p -profile:v high -crf 20 -movflags +faststart public/hero-scrub.mp4

# all-keyframe VP9 fallback (used only where H.264 can't play)
ffmpeg -i public/hero.mp4 -an -c:v libvpx-vp9 -g 1 -keyint_min 1 -crf 38 -b:v 0 -pix_fmt yuv420p -row-mt 1 -deadline good -cpu-used 2 public/hero-scrub.webm

# poster from frame 0
ffmpeg -i public/hero.mp4 -frames:v 1 -update 1 -q:v 2 public/hero-poster.jpg
```

Install ffmpeg with `brew install ffmpeg` (macOS) or from https://ffmpeg.org/download.html.

Notes:
- All-keyframe files are large. Raise `-crf` (22–26) or scale to 1280×720 (`-vf scale=1280:-2`) to trade quality for size.
  The current 1080p files are ~16 MB (MP4) and ~18 MB (WebM); the site downloads only one of them.
- `HALF_FRAME` in `ScrollVideoHero.tsx` assumes 24 fps. Change it to `1 / (fps * 2)` for other frame rates.
- The hero container is `400svh` tall, so the whole clip plays over three viewport-heights of scrolling.
  Make it taller for a slower fly-through.
- Behaviour: the file is fetched once as a blob, scrubbing starts after `loadedmetadata` and a seek probe;
  if seeking fails (some mobile browsers) the video simply loops; with `prefers-reduced-motion` only the poster shows.

## Editing projects

Edit `data/projects.ts`. Each entry has `name`, `location`, `status`, `year`, `image` (a path under `public/`)
and `alt`. Landscape images around 16:10 look best; the gallery renders the array in order and grows to fit.

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

`app/api/contact/route.ts` validates the payload with the same `validateContact()` the form uses, then
`console.log`s it. Replace the log with your email provider or CRM call. There is no rate limiting or spam
protection yet; add a honeypot field or a Turnstile/hCaptcha check before launch.

## Deploying to Vercel

1. Push the folder to a Git repository (GitHub, GitLab or Bitbucket).
2. On https://vercel.com click **Add New → Project**, import the repo and keep the defaults
   (framework: Next.js, build `next build`). No environment variables are needed.
3. Deploy. Every push to the main branch redeploys; pull requests get preview URLs.

Or from the terminal: `npm i -g vercel && vercel` (then `vercel --prod`).

The video assets are served from `public/` as static files. If you'd rather keep them out of Git, upload them to
Vercel Blob or any CDN and change the `MP4`, `WEBM` and `POSTER` constants in `components/ScrollVideoHero.tsx`.
