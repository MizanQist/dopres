export type Project = {
  slug: string;
  name: string;
  location: string;
  status: "Completed" | "Under construction" | "In planning" | "Sold out";
  year: string;
  image: string; // path under /public
  alt: string;
};

/**
 * Placeholder projects. Replace names, locations, statuses and images here;
 * the gallery renders whatever is in this array, in order.
 * Images live in /public/projects and should be landscape (16:10 works best).
 */
export const projects: Project[] = [
  {
    slug: "aviary-terminal",
    name: "Aviary Private Terminal",
    location: "Abuja",
    status: "Under construction",
    year: "2026",
    image: "/projects/01.jpg",
    alt: "Private jets in front of a folded-facade hangar at dusk",
  },
  {
    slug: "aerodrome-campus",
    name: "Aerodrome Campus",
    location: "Lagos",
    status: "In planning",
    year: "2027",
    image: "/projects/02.jpg",
    alt: "Aerial view of a hangar campus in morning fog",
  },
  {
    slug: "meridian-pavilion",
    name: "Meridian Pavilion",
    location: "Abuja",
    status: "Completed",
    year: "2024",
    image: "/projects/03.jpg",
    alt: "Perforated white facade with palm trees and a glazed entrance",
  },
  {
    slug: "the-lattice",
    name: "The Lattice",
    location: "Kano",
    status: "Sold out",
    year: "2023",
    image: "/projects/04.jpg",
    alt: "Angular facade with a diamond lattice pattern",
  },
];
