import dynamic from "next/dynamic";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import About from "@/components/About";

// Everything below the hero is split into its own chunk.
const Projects = dynamic(() => import("@/components/Projects"));
const Services = dynamic(() => import("@/components/Services"));
const Stats = dynamic(() => import("@/components/Stats"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  return (
    <main id="top">
      <ScrollVideoHero />
      <About />
      <Projects />
      <Services />
      <Stats />
      <Contact />
    </main>
  );
}
