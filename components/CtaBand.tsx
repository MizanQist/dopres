import Link from "next/link";
import Reveal from "@/components/Reveal";

type Props = { eyebrow: string; title: string; href: string; label: string };

/** A short band with the site's one primary button. */
export default function CtaBand({ eyebrow, title, href, label }: Props) {
  return (
    <section className="border-t border-bone/10 px-6 py-20 md:px-10 md:py-28">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="label mb-5">{eyebrow}</p>
          <p className="max-w-2xl font-serif text-3xl font-light leading-[1.1] md:text-5xl">{title}</p>
        </Reveal>
        <Reveal delay={0.15}>
          {href.startsWith("#") ? <a href={href} className="btn">{label}</a> : <Link href={href} className="btn">{label}</Link>}
        </Reveal>
      </div>
    </section>
  );
}
