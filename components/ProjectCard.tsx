import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type Props = { project: Project; index: number; className?: string; sizes: string; priority?: boolean };

/** Whole card is one link; the accessible name is the project name plus its status. */
export default function ProjectCard({ project: p, index, className = "", sizes, priority }: Props) {
  const cover = p.images[0];
  return (
    <Link
      href={`/projects/${p.slug}`}
      aria-label={`${p.name}, ${p.status}`}
      data-cursor="View"
      className={`group block ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone/5 md:aspect-[16/10]">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1600ms] ease-out-slow group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div>
          <p className="label text-bronze">{String(index + 1).padStart(2, "0")} — {p.year}</p>
          <h3 className="mt-3 font-serif text-3xl font-light leading-tight transition-colors duration-700 group-hover:text-bronze group-focus-visible:text-bronze md:text-4xl">
            {p.name}
          </h3>
          <p className="label mt-3">{p.location} · {p.type}</p>
        </div>
        <p className="label shrink-0 md:pt-1 md:text-right">{p.status}</p>
      </div>
    </Link>
  );
}
