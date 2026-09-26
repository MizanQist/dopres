import dynamic from "next/dynamic";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import About from "@/components/About";
import CtaBand from "@/components/CtaBand";
import Team from "@/components/Team";

// Everything below the hero is split into its own chunk.
const Stats = dynamic(() => import("@/components/Stats"));
const Projects = dynamic(() => import("@/components/Projects"));
const Services = dynamic(() => import("@/components/Services"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  return (
    <main id="top">
      <ScrollVideoHero />
      <About />
      <Stats />
      <Projects />
      <CtaBand eyebrow="Portfolio" title="Twelve projects, from private homes to a private terminal." href="/projects" label="View all projects" />
      <Services />
      <Team />
      <CtaBand tone="orange" eyebrow="Work with us" title="Have a site, a brief or an idea? We would like to hear it." href="#contact" label="Start a conversation" />
      <Contact />
    </main>
  );
}
