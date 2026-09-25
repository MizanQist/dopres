import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Twelve DOPRES developments across Abuja, Lagos, Kano and Port Harcourt.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Projects — DOPRES" },
};

export default function ProjectsPage() {
  return (
    <main id="top">
      <section className="px-6 pt-36 pb-24 md:px-10 md:pt-48 md:pb-32">
        <Reveal as="p" className="label mb-6">Portfolio</Reveal>
        <Reveal as="h1" className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] font-light leading-[1.02]">Projects</Reveal>
        <Reveal as="p" delay={0.1} className="mt-8 max-w-xl text-lg leading-relaxed text-bone/70">
          Residences, apartments, offices and a private terminal, each one seen through from land to landmark.
        </Reveal>
        <ul className="mt-20 grid gap-x-10 gap-y-20 md:grid-cols-2 md:mt-28">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 2) * 0.1}>
              <ProjectCard project={p} index={i} priority={i < 4} sizes="(min-width: 768px) 45vw, 90vw" />
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBand eyebrow="Work with us" title="Have a site, a brief or an idea? We would like to hear it." href="/#contact" label="Start a conversation" />
    </main>
  );
}
