import Image from "next/image";
import Reveal from "@/components/Reveal";
import { team } from "@/data/team";

export default function Team() {
  return (
    <section id="team" className="bg-paper px-6 py-32 text-navy md:px-10 md:py-48">
      <div className="grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <Reveal as="p" className="label mb-6">Meet the team</Reveal>
          <Reveal as="h2" className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.06]">
            The architects behind the work.
          </Reveal>
        </div>
        <ul className="grid gap-12 sm:grid-cols-3 sm:gap-8 md:col-span-8">
          {team.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 0.1}>
              <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} fill sizes="(min-width: 768px) 22vw, (min-width: 640px) 30vw, 90vw" className="object-cover" />
                ) : (
                  <div className="flex h-full items-end justify-between p-6 text-white" aria-hidden>
                    <span className="font-serif text-6xl font-light leading-none text-orange">{m.initials}</span>
                    <span className="mb-1 h-px w-10 bg-orange" />
                  </div>
                )}
              </div>
              <h3 className="mt-6 font-serif text-2xl font-light leading-tight md:text-3xl">{m.name}</h3>
              <p className="label mt-2 text-orange">{m.role}</p>
              <p className="mt-4 leading-relaxed text-navy/65">{m.bio}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
