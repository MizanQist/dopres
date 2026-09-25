import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <section id="about" className="px-6 py-32 md:px-10 md:py-48">
      <div className="grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal as="p" className="label mb-8">About</Reveal>
          <Reveal as="h2" lines className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.06]">
            We develop places designed to outlast the moment.
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-20">
          <Reveal as="p" lines className="text-lg leading-relaxed text-bone/70">
            DOPRES is a premium real-estate development company working across residential, commercial and
            hospitality assets. We take on a small number of projects at a time and see each one through from land
            to landmark: acquisition, design, construction and long-term management. Our work is defined by
            restraint, precision and a belief that the best buildings are the ones that still feel right in fifty
            years.
          </Reveal>
          <Reveal delay={0.3} className="mt-12">
            <a href="#contact" className="link label text-bone">Start a conversation</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
