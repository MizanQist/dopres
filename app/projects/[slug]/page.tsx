import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { findProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findProject((await params).slug);
  if (!p) return {};
  const cover = p.images[0];
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      url: `/projects/${p.slug}`,
      title: `${p.name} — DOPRES`,
      description: p.summary,
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const facts = [
    ["Status", `${p.status}, ${p.year}`],
    ["Scope", p.scope],
    ["Size", p.size],
    ["Timeline", p.timeline],
    ["DOPRES's role", p.role],
  ];

  return (
    <main id="top">
      <article className="px-6 pt-32 pb-24 md:px-10 md:pt-44 md:pb-32">
        <Link href="/projects" className="ui tap link px-2 -ml-2 text-bone/70 hover:text-bone">All projects</Link>

        <header className="mt-10 grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal as="p" className="label mb-6">{p.type} · {p.location}</Reveal>
            <Reveal as="h1" className="font-serif text-[clamp(2.75rem,6.5vw,6rem)] font-light leading-[1.02]">{p.name}</Reveal>
            <Reveal as="p" delay={0.1} className="mt-8 max-w-2xl text-lg leading-relaxed text-bone/70">{p.summary}</Reveal>
          </div>
          <Reveal delay={0.2} className="md:col-span-4 md:col-start-9 md:pt-6">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
              {facts.map(([k, v]) => (
                <div key={k} className="border-t border-bone/10 pt-4">
                  <dt className="label">{k}</dt>
                  <dd className="mt-2 leading-relaxed text-bone/80">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </header>

        <div className="mt-16 grid gap-6 md:mt-24 md:gap-10">
          {p.images.map((img, n) => (
            <Reveal key={img.src} className={img.height > img.width ? "mx-auto w-full max-w-3xl" : ""}>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                priority={n === 0}
                sizes={img.height > img.width ? "(min-width: 768px) 768px, 100vw" : "100vw"}
                className="h-auto w-full bg-bone/5"
              />
            </Reveal>
          ))}
        </div>

        <nav aria-label="More projects" className="mt-20 flex flex-wrap justify-between gap-6 border-t border-bone/10 pt-8">
          <Link href={`/projects/${prev.slug}`} className="tap link text-bone/70 hover:text-bone">
            <span className="label mr-3">Previous</span>{prev.name}
          </Link>
          <Link href={`/projects/${next.slug}`} className="tap link text-right text-bone/70 hover:text-bone">
            {next.name}<span className="label ml-3">Next</span>
          </Link>
        </nav>
      </article>
      <CtaBand eyebrow="Work with us" title={`Interested in ${p.name}, or in something like it?`} href="/#contact" label="Start a conversation" />
    </main>
  );
}
