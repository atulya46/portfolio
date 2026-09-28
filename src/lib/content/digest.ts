import type { Entry } from "./schema";

// Small, pure summaries of the entries that the homepage and section pages show.
// They take the entry list as input so tests don't need the filesystem.

export type NowLine = {
  verb: string;
  title: string;
  href: string;
};

const bookVerb: Record<string, string> = {
  reading: "Reading",
  finished: "Finished",
  abandoned: "Put down",
};

// "What am I up to" lines for the homepage: the newest book, the course on my
// desk, and the last painting. Entries arrive newest first, so find() picks the latest.
export function nowLines(entries: Entry[]): NowLine[] {
  const lines: NowLine[] = [];
  const href = (e: Entry) => `/${e.section}/${e.slug}`;

  const book = entries.find((e) => e.type === "book");
  if (book?.type === "book") {
    lines.push({ verb: bookVerb[book.status ?? "reading"], title: book.title, href: href(book) });
  }

  const course = entries.find((e) => e.type === "learning" && e.status === "now");
  if (course) lines.push({ verb: "Learning", title: course.title, href: href(course) });

  const painting = entries.find((e) => e.type === "painting");
  if (painting) lines.push({ verb: "Last painted", title: painting.title, href: href(painting) });

  return lines;
}

// An entry's number within its section, counting from the oldest. Shown as
// "No. 01" so each section reads like a numbered series that grows each week.
export function entryNumber(entry: Entry, entries: Entry[]): number {
  const inSection = entries
    .filter((e) => e.section === entry.section)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.slug.localeCompare(b.slug));
  return inSection.findIndex((e) => e.slug === entry.slug) + 1;
}

export function padNumber(n: number): string {
  return String(n).padStart(2, "0");
}

export function countLabel(count: number): string {
  if (count === 0) return "soon";
  return count === 1 ? "1 entry" : `${count} entries`;
}
