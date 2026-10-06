import { notFound } from "next/navigation";
import { CurrentlyBoard } from "@/components/redesign/CurrentlyBoard";
import { StudioPaper } from "@/components/redesign/StudioPaper";
import { toPaperItems, toScraps } from "@/lib/content/board";
import { samplePaperItems, sampleScraps } from "@/lib/content/samples";
import { flags } from "@/lib/flags";
import { EntryCard } from "@/components/EntryCard";
import { countLabel, entryNumber } from "@/lib/content/digest";
import { loadEntries } from "@/lib/content/load";
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

// "October 2026" from the newest entry, so the masthead dates itself.
function issueLabel(entries: { date: Date }[]): string {
  const newest = entries[0]?.date ?? new Date();
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(newest);
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section: slug } = await params;
  const section = sections.find((s) => s.slug === slug);
  if (!section) notFound();

  const all = loadEntries();
  const entries = all.filter((e) => e.section === slug);
  const isGallery = entries.length > 0 && entries.every((e) => e.type === "painting");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 pb-20 pt-6 sm:px-8">
      {!(flags.sectionRedesign && slug === "studio") && (
              <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink/30 pb-5">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h1 className="display text-[clamp(2.4rem,5vw,3.6rem)] text-red">{section.title}</h1>
            <p className="text-ink-soft">{section.blurb}</p>
          </div>
          <span className="label text-ink-soft">
            {section.side === "day" ? "By day" : "By evening"} · {countLabel(entries.length)}
          </span>
        </header>
      )}

      {flags.sectionRedesign && slug === "currently" ? (
        // Real entries first; samples fill the board until real ones and images are in.
        <CurrentlyBoard items={[...toScraps(entries), ...sampleScraps]} />
      ) : flags.sectionRedesign && slug === "studio" ? (
        <StudioPaper items={[...toPaperItems(entries), ...samplePaperItems]} issue={issueLabel(all)} />
      ) : entries.length === 0 ? (
        <div className="taped mx-auto mt-6 w-full max-w-md px-8 py-10 text-center">
          <p className="display text-3xl">{section.emptyNote}</p>
          <p className="label mt-4 text-ink-soft">Nothing here yet</p>
        </div>
      ) : isGallery ? (
        <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <li key={e.slug}>
              <EntryCard entry={e} number={entryNumber(e, all)} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="-mt-6 flex flex-col">
          {entries.map((e) => (
            <li key={e.slug}>
              <EntryCard entry={e} number={entryNumber(e, all)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
