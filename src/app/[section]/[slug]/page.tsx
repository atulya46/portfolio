import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, subtitle } from "@/components/EntryCard";
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

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <Link href={`/${section}`} className="text-sm text-muted hover:text-accent">
        &larr; {sectionTitle}
      </Link>

      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-muted">
          {entry.type === "learning" && entry.status === "now" ? "On my desk right now" : entry.type}
          {" · "}
          {formatDate(entry.date)}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{entry.title}</h1>
        {sub && entry.type !== "painting" && <p className="text-lg text-muted">{sub}</p>}
      </header>

      {entry.type === "painting" && (
        <figure className="flex flex-col gap-3">
          <Image
            src={entry.image}
            alt={entry.alt}
            width={1200}
            height={1600}
            priority
            className="h-auto w-full rounded-xl shadow-lg"
          />
          {entry.caption && <figcaption className="text-lg italic text-muted">{entry.caption}</figcaption>}
        </figure>
      )}

      {"take" in entry && entry.take && <p className="text-lg">{entry.take}</p>}

      {entry.type === "book" && entry.quotes.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm uppercase tracking-widest text-muted">Lines that stayed</h2>
          {entry.quotes.map((q) => (
            <blockquote key={q} className="border-l-4 border-accent pl-4 text-xl italic">
              &ldquo;{q}&rdquo;
            </blockquote>
          ))}
        </section>
      )}

      {entry.type === "learning" && entry.topics.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {entry.topics.map((t) => (
            <li key={t} className="rounded-full border border-accent/40 px-3 py-1 text-sm">
              {t}
            </li>
          ))}
        </ul>
      )}

      {entry.html && <div className="entry-body" dangerouslySetInnerHTML={{ __html: entry.html }} />}
    </main>
  );
}
