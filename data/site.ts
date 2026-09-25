export const site = {
  name: "DOPRES",
  url: "https://dopres.com", // used for absolute Open Graph image URLs
  tagline: "Developing landmarks. Defining skylines.",
  description:
    "DOPRES is a premium real-estate development company delivering residential, commercial and hospitality landmarks with restraint and precision.",
  email: "hello@dopres.com",
  phone: "+234 000 000 0000",
  address: ["12 Landmark Avenue", "Maitama, Abuja", "Nigeria"],
  nav: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
  ],
} as const;
