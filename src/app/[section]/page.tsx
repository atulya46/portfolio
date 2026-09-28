import Link from "next/link";
import { notFound } from "next/navigation";
import { EntryCard } from "@/components/EntryCard";
import { entriesInSection } from "@/lib/content/load";
import { sections } from "@/lib/site";

// Only the sections in site.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  return { title: `${sections.find((s) => s.slug === section)?.title} · Atulya Arya` };
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section: slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  if (!section) notFound();

  const entries = entriesInSection(slug);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
      <Link href="/" className="text-sm text-muted hover:text-accent">
        &larr; home
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight">{section.title}</h1>
        <p className="text-lg text-muted">{section.blurb}</p>
      </header>
      {entries.length === 0 ? (
        <p className="text-muted">Nothing here yet. Something is brewing.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {entries.map((e) => (
            <li key={e.slug}>
              <EntryCard entry={e} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
