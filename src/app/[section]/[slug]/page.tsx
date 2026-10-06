import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, subtitle, typeLabel } from "@/components/EntryCard";
import { entryNumber, padNumber } from "@/lib/content/digest";
import { findEntry, loadEntries } from "@/lib/content/load";
import { sections } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadEntries().map((e) => ({ section: e.section, slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[section]/[slug]">) {
  const { section, slug } = await params;
  const entry = findEntry(section, slug);
  return { title: entry ? `${entry.title} · Atulya Arya` : "Atulya Arya", description: entry?.summary };
}

export default async function EntryPage({ params }: PageProps<"/[section]/[slug]">) {
  const { section, slug } = await params;
  const entry = findEntry(section, slug);
  if (!entry) notFound();

  const sectionTitle = sections.find((s) => s.slug === section)?.title ?? section;
  const sub = subtitle(entry);
  const number = padNumber(entryNumber(entry, loadEntries()));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-5 pb-24 pt-8 sm:px-8">
      <Link href={`/${section}`} className="label self-start text-ink-soft hover:text-red-deep">
        &larr; {sectionTitle}
      </Link>

      {/* Title block with the entry's number set large, like a project sheet. */}
      <header className="grid items-end gap-6 border-b border-ink/30 pb-8 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <span className="label text-ink-soft">
            {typeLabel(entry)} · {formatDate(entry.date)}
          </span>
          <h1 className="display text-[clamp(3.2rem,8vw,6.5rem)] text-red">{entry.title}</h1>
          {sub && entry.type !== "painting" && <p className="text-ink-soft">{sub}</p>}
          {entry.type === "learning" && entry.topics.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {entry.topics.map((t) => (
                <li key={t} className="pill">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span aria-hidden="true" className="display hidden text-[9rem] leading-none text-taupe md:block">
          {number}.
        </span>
      </header>

      {entry.type === "painting" && (
        <figure className="flex flex-col items-center gap-5">
          <div className="bg-paper-deep p-3  sm:p-5">
            <Image
              src={entry.image}
              alt={entry.alt}
              width={1200}
              height={1600}
              priority
              sizes="(max-width: 768px) 100vw, 720px"
              className="h-auto max-h-[85vh] w-auto"
            />
          </div>
          {entry.caption && <figcaption className="display text-3xl">{entry.caption}</figcaption>}
          {entry.medium && <p className="label text-ink-soft">{entry.medium}</p>}
        </figure>
      )}

      {"take" in entry && entry.take && <p className="max-w-[60ch] text-2xl leading-snug">{entry.take}</p>}

      {entry.type === "book" && entry.quotes.length > 0 && (
        <section className="flex flex-col gap-14 pt-4">
          <h2 className="label text-ink-soft">Lines that stayed</h2>
          {entry.quotes.map((q, i) => (
            <figure
              key={q}
              className={`taped max-w-3xl px-7 pb-8 pt-12 sm:px-12 ${i % 2 === 0 ? "" : "self-end"}`}
            >
              <span aria-hidden className="display absolute -top-3 left-5 text-[6rem] leading-none text-red">
                &ldquo;
              </span>
              <blockquote className="display text-3xl leading-[1.15] sm:text-4xl">{q}</blockquote>
            </figure>
          ))}
        </section>
      )}

      {entry.html && <div className="entry-body" dangerouslySetInnerHTML={{ __html: entry.html }} />}
    </main>
  );
}
