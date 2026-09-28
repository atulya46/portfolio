import Image from "next/image";
import Link from "next/link";
import type { Entry } from "@/lib/content/schema";

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

export function EntryCard({ entry }: { entry: Entry }) {
  const href = `/${entry.section}/${entry.slug}`;
  const sub = subtitle(entry);

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-accent/25 p-5 transition hover:-translate-y-0.5 hover:border-accent/60"
    >
      {entry.type === "painting" && (
        <Image
          src={entry.image}
          alt={entry.alt}
          width={600}
          height={800}
          className="aspect-[3/4] w-full rounded-lg object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-widest text-muted">
          {entry.type === "learning" && entry.status === "now" ? "On my desk right now" : entry.type}
        </p>
        <h2 className="text-xl font-semibold group-hover:text-accent">{entry.title}</h2>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
      {entry.type === "book" && entry.quotes[0] && (
        <p className="text-sm italic text-muted">&ldquo;{entry.quotes[0]}&rdquo;</p>
      )}
    </Link>
  );
}
