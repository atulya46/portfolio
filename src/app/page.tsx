import Image from "next/image";
import Link from "next/link";
import { Scribble } from "@/components/Scribble";
import { countLabel, entryNumber, nowLines, padNumber } from "@/lib/content/digest";
import { loadEntries } from "@/lib/content/load";
import { sectionHref, sectionsOn, type Side } from "@/lib/site";

const sides: { side: Side; title: string; hours: string }[] = [
  { side: "day", title: "By day", hours: "09:00 – 18:00 · pays the rent" },
  { side: "evening", title: "By evening", hours: "18:00 – late · pays the soul" },
];

export default function Home() {
  const entries = loadEntries();
  const painting = entries.find((e) => e.type === "painting");
  const book = entries.find((e) => e.type === "book" && e.quotes.length > 0);
  const now = nowLines(entries);

  return (
    <main className="flex flex-col">
      {/* Hero: the painting is the first thing you see, the name layered against it. */}
      <section className="hero">
        <figure className="hero-art">
          {painting?.type === "painting" && (
            <>
              <Image
                src={painting.image}
                alt={painting.alt}
                fill
                priority
                sizes="(max-width: 860px) 100vw, 45vw"
                className="object-cover object-top"
              />
              <figcaption className="hero-caption label absolute bottom-5 left-5 text-paper">
                <Link href={`/${painting.section}/${painting.slug}`} className="hover:underline">
                  No. {padNumber(entryNumber(painting, entries))} · {painting.title}{painting.medium ? ` · ${painting.medium}` : ""}
                </Link>
              </figcaption>
            </>
          )}
        </figure>

        <div className="hero-copy">
          <p className="hero-kicker label text-ink-soft">Portfolio &amp; logbook · Vol. 01 · 2026</p>
          <h1 className="display hero-name">
            <span>Atulya</span>
            <span>Arya</span>
          </h1>
          <div className="h-[3px] w-full max-w-md bg-ink" />
          <p className="max-w-md font-mono text-[0.95rem] leading-relaxed">
            I&rsquo;m <strong className="text-red-deep">Atulya</strong>, a backend engineer in fintech, heading
            towards AI. I paint women and nature in acrylic, dance when nobody&rsquo;s timing it, and keep notes
            on everything I read and learn. This is where they live.
          </p>
          {now.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {now.map((line) => (
                <li key={line.href}>
                  <Link href={line.href} className="group flex items-baseline gap-3">
                    <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-red text-xs text-paper">
                      &#10022;
                    </span>
                    <span className="label w-28 shrink-0 text-ink-soft">{line.verb}</span>
                    <span className="font-medium underline-offset-4 group-hover:underline">{line.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* "Santulan": balance, the idea the site is organised around. */}
        <div className="hero-vertical" aria-hidden="true">
          {/* Stacked by hand: vertical writing-mode lays Devanagari on its side. */}
          <span className="deva">
            {["सं", "तु", "ल", "न"].map((cluster) => (
              <span key={cluster}>{cluster}</span>
            ))}
          </span>
          <span className="label">santulan · balance</span>
        </div>
      </section>

      {/* Ticker of what's on the desk, straight from the entries. */}
      {now.length > 0 && (
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex">
                {[...now, ...now, ...now].map((line, i) => (
                  <span key={i} className="label flex items-center gap-4 px-4 py-3">
                    {line.verb}: {line.title}
                    <span className="text-red">&#10022;</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The index, split into the two halves of the day. */}
      <section id="index" className="mx-auto grid w-full max-w-6xl gap-16 px-5 py-20 sm:px-8 md:grid-cols-2 md:gap-12">
        {sides.map(({ side, title, hours }) => (
          <div key={side} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 border-b-[3px] border-ink pb-4">
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
            {side === "day" && (
              <p className="label pt-2 text-ink-soft" aria-hidden="true">
                {"// more day-job things still compiling"}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* One line from the bookshelf, taped to the page. */}
      {book?.type === "book" && (
        <section className="mx-auto w-full max-w-4xl px-5 pb-24 sm:px-8">
          <figure className="taped -rotate-1 px-7 pb-8 pt-10 sm:px-14 sm:pb-12 sm:pt-14">
            <span aria-hidden className="display absolute -top-2 left-5 text-[7rem] leading-none text-red sm:left-8">
              &ldquo;
            </span>
            <blockquote className="display text-3xl leading-[1.15] sm:text-5xl">{book.quotes[0]}</blockquote>
            <figcaption className="label mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-soft">
              <span>Lines that stayed</span>
              <span aria-hidden>·</span>
              <Link href={`/${book.section}/${book.slug}`} className="text-ink underline underline-offset-4 hover:text-red-deep">
                {book.title}, {book.author}
              </Link>
            </figcaption>
          </figure>
        </section>
      )}
    </main>
  );
}
