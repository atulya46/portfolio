import Link from "next/link";
import type { Entry } from "@/lib/content/schema";

type Thought = Extract<Entry, { type: "thought" }>;

// POV laid out like the contents page of a book: a title, a dotted leader, a number.
// Articles with a `category` are grouped under it; the rest sit in one list.
export function PovContents({ entries }: { entries: Thought[] }) {
  const groups = new Map<string, Thought[]>();
  for (const e of entries) {
    const key = e.category ?? "";
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  let n = 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
      {[...groups].map(([category, items]) => (
        <div key={category} className="flex flex-col">
          {category && <h3 className="mb-2 text-xs uppercase tracking-widest text-muted">{category}</h3>}
          <ol className="flex flex-col">
            {items.map((e) => {
              n += 1;
              return (
                <li key={e.slug}>
                  <Link
                    href={`/${e.section}/${e.slug}`}
                    className="group flex items-baseline gap-3 py-2 text-lg transition-colors duration-150 hover:text-accent md:text-xl"
                  >
                    <span>{e.title}</span>
                    <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-muted/60" />
                    <span className="text-sm tabular-nums text-muted transition-transform duration-300 group-hover:translate-x-1">
                      {String(n).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
