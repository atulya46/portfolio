import Image from "next/image";
import Link from "next/link";
import { padNumber } from "@/lib/content/digest";
import type { Entry } from "@/lib/content/schema";
import { Scribble } from "./Scribble";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

// One line under the title that says what kind of thing this is.
export function subtitle(entry: Entry): string | undefined {
  switch (entry.type) {
    case "book":
      return `by ${entry.author}`;
    case "movie":
      return entry.director ? `dir. ${entry.director}` : undefined;
    case "trip":
      return entry.place;
    case "learning":
      return entry.via;
    case "painting":
      return entry.caption;
    case "project":
      return entry.role;
    default:
      return undefined;
  }
}

export function typeLabel(entry: Entry): string {
  if (entry.type === "learning" && entry.status === "now") return "On my desk right now";
  return entry.type;
}

// Paintings hang like framed canvases; everything else is a row in an index.
export function EntryCard({ entry, number }: { entry: Entry; number: number }) {
  const href = `/${entry.section}/${entry.slug}`;
  const sub = subtitle(entry);

  if (entry.type === "painting") {
    return (
      <Link href={href} className="group flex flex-col gap-4">
        <div className="bg-paper-deep p-3  transition-transform duration-500sm:p-4">
          <Image
            src={entry.image}
            alt={entry.alt}
            width={700}
            height={930}
            sizes="(max-width: 640px) 100vw, 33vw"
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="display text-3xl">
            <Scribble>{entry.title}</Scribble>
          </span>
          <span className="label text-ink-soft">No. {padNumber(number)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group grid gap-x-8 gap-y-2 border-b border-ink/25 py-7 sm:grid-cols-[7rem_1fr_auto]">
      <span className="label pt-2 text-red-deep">No. {padNumber(number)}</span>
      <span className="flex flex-col gap-2">
        <span className="label text-ink-soft">{typeLabel(entry)}</span>
        <span className="display text-4xl sm:text-5xl">
          <Scribble>{entry.title}</Scribble>
        </span>
        {sub && <span className="text-sm text-ink-soft">{sub}</span>}
        {entry.type === "book" && entry.quotes[0] && (
          <span className="mt-2 max-w-xl text-lg italic text-ink-soft">&ldquo;{entry.quotes[0]}&rdquo;</span>
        )}
      </span>
      <span className="label flex items-start gap-2 pt-2 text-ink-soft">
        {formatDate(entry.date)}
        <span className="text-red transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
      </span>
    </Link>
  );
}
