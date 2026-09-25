import Reveal from "@/components/Reveal";

const SERVICES = [
  {
    title: "Development",
    text: "End-to-end delivery of residential, commercial and mixed-use assets, from land acquisition and approvals to handover.",
  },
  {
    title: "Design & Build",
    text: "Architecture, engineering and construction under one roof, with a single point of accountability for quality and programme.",
  },
  {
    title: "Investment",
    text: "Structured opportunities for partners seeking exposure to prime real estate, with disciplined underwriting and clear reporting.",
  },
  {
    title: "Asset Management",
    text: "Long-term stewardship of completed developments to protect value, manage occupiers and keep every building at its best.",
  },
];

export default function Services() {
  return (
    <section id="services" className="px-6 py-32 md:px-10 md:py-48">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal as="p" className="label mb-6">What we do</Reveal>
          <Reveal as="h2" className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-none">Services</Reveal>
        </div>
        <ul className="lg:col-span-8">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="group border-t border-bone/10 last:border-b">
              <div className="grid gap-4 py-10 transition-transform duration-700 ease-out-slow group-hover:translate-x-3 md:grid-cols-12 md:gap-8 md:py-12">
                <span className="label text-bronze md:col-span-2">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-3xl font-light leading-tight transition-colors duration-700 group-hover:text-bronze md:col-span-4 md:text-3xl lg:text-4xl">
                  {s.title}
                </h3>
                <p className="leading-relaxed text-bone/60 md:col-span-6">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
