/** Hero media: content-hashed filenames under /public/media so they can be cached immutably (see next.config.ts). */
export const HERO_POSTER = "/media/hero-poster.5716dd58.jpg";
export const HERO_MP4 = "/media/hero-scrub.1e85caf1.mp4";
export const HERO_MP4_PORTRAIT = "/media/hero-scrub-portrait.72263651.mp4"; // phones: 9:16 crop of the same shot
export const HERO_WEBM = "/media/hero-scrub.61155c04.webm";

export const site = {
  name: "DOPRES",
  tagline: "Developing landmarks. Defining skylines.",
  description:
    "DOPRES is a premium real-estate development company delivering residential, commercial and hospitality landmarks with restraint and precision.",
  email: "hello@dopres.ng", // placeholder until the client confirms
  phone: "+234 810 753 7909",
  instagram: { handle: "@dopres", href: "https://instagram.com/dopres" },
  address: ["12 Landmark Avenue", "Maitama, Abuja", "Nigeria"],
  nav: [
    { label: "About", href: "/#about" },
    { label: "Projects", href: "/#projects" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/#contact" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/dopres" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
} as const;
