import Image from "next/image";
import Link from "next/link";
import { Scribble } from "@/components/Scribble";
import { countLabel } from "@/lib/content/digest";
import { loadEntries } from "@/lib/content/load";
import { sectionHref, sectionsOn, type Side } from "@/lib/site";

const sides: { side: Side; title: string; hours: string }[] = [
  { side: "day", title: "By day", hours: "09:00 – 18:00 · pays the rent" },
  { side: "evening", title: "By evening", hours: "18:00 – late · pays the soul" },
];

export default function Home() {
  const entries = loadEntries();

  return (
    <main className="flex flex-col">
      {/* Hero: the laptop photo fills the first screen and "develops" like a generated image;
          the name and tagline fade in over it once the picture has mostly formed. */}
      <div className="hero-shell">
        <div className="hero-bg" aria-hidden="true">
          <Image src="/hero/laptop.jpg" alt="" fill priority sizes="100vw" />
        </div>
        <section className="hero">
          <h1 className="display hero-name">Atulya Arya</h1>
          <p className="label hero-tagline">
            I build things, get curious about unrelated things, and occasionally make something beautiful.
          </p>
          <a href="#index" className="btn btn-ghost btn-circle label mt-2">
            Explore
            <span aria-hidden>&darr;</span>
          </a>
        </section>
      </div>

      {/* The index, split into the two halves of the day. */}
      <section id="index" className="mx-auto grid w-full max-w-6xl gap-16 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-12">
        {sides.map(({ side, title, hours }) => (
          <div key={side} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 border-b border-ink/30 pb-4">
              <span className="label text-ink-soft">{hours}</span>
              <h2 className="display text-6xl text-red">{title}</h2>
            </div>
            <ul className="flex flex-col">
              {sectionsOn(side).map((s) => {
                const count = entries.filter((e) => e.section === s.slug).length;
                return (
                  <li key={s.slug} className="border-b border-ink/25">
                    <Link href={sectionHref(s.slug)} className="group flex items-center justify-between gap-4 py-5">
                      <span className="flex flex-col gap-1">
                        <span className="display text-4xl sm:text-5xl">
                          <Scribble>{s.title}</Scribble>
                        </span>
                        <span className="text-ink-soft">{s.blurb}</span>
                      </span>
                      <span className="label flex shrink-0 items-center gap-2 text-ink-soft">
                        {countLabel(count)}
                        <span className="text-red transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

    </main>
  );
}
