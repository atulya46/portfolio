import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ColumnScroller } from "./ColumnScroller";
import { Reveal } from "./Reveal";
import { TileImage } from "./TileImage";
import type { Entry } from "@/lib/content/schema";

type Tile = {
  key: string;
  title: string;
  caption?: string;
  href?: string;
  image?: string;
  alt?: string;
};

// Studio is three columns side by side (Books, Art, Activities), each slowly scrolling on its own.
// Tiles take turns being tall, square and wide-ish so a column doesn't read as a rigid list.
const ASPECTS = ["3/4", "4/5", "1/1", "4/5"];

function TileView({ tile, index }: { tile: Tile; index: number }) {
  const body = (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl bg-surface ${tile.href ? "" : "border border-dashed border-accent/40"}`}
        style={{ aspectRatio: ASPECTS[index % ASPECTS.length] }}
      >
        {tile.image ? (
          <TileImage src={tile.image} alt={tile.alt ?? tile.title} fallback={tile.title} />
        ) : (
          <div className="grid size-full place-items-center p-4 text-center text-sm text-muted">
            {tile.href ? tile.title : "Photo coming soon"}
          </div>
        )}
      </div>
      {tile.title && <p className="mt-2 text-sm font-medium">{tile.title}</p>}
      {tile.caption && <p className="text-xs text-muted">{tile.caption}</p>}
    </>
  );
  return (
    <li>
      {tile.href ? (
        <Link href={tile.href} draggable={false} className="group block">
          {body}
        </Link>
      ) : (
        <div>{body}</div>
      )}
    </li>
  );
}

function TileColumn({ title, count, tiles, reverse }: { title: string; count?: string; tiles: Tile[]; reverse?: boolean }) {
  return (
    <Reveal>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h3>
          {count && <span className="text-xs text-muted">{count}</span>}
        </div>
        <ColumnScroller label={title} reverse={reverse}>
          {tiles.map((t, i) => (
            <TileView key={t.key} tile={t} index={i} />
          ))}
        </ColumnScroller>
      </div>
    </Reveal>
  );
}

const plural = (n: number, one: string, many: string) => (n ? `${n} ${n === 1 ? one : many}` : undefined);

function placeholders(labels: string[]): Tile[] {
  return labels.map((label) => ({ key: label, title: label }));
}

// Empty photo slots with no label underneath, for groups that are just photos and captions.
function emptySlots(count: number): Tile[] {
  return Array.from({ length: count }, (_, i) => ({ key: `slot-${i}`, title: "" }));
}

// An image path from an entry, kept only if the file is really in /public, so a missing photo
// shows the placeholder instead of a broken image. Outside URLs pass through; TileImage handles those failing.
function inPublic(src?: string) {
  if (src?.startsWith("https://")) return src;
  return src && fs.existsSync(path.join(process.cwd(), "public", src)) ? src : undefined;
}

export function StudioSection({ entries }: { entries: Entry[] }) {
  const href = (e: Entry) => `/${e.section}/${e.slug}`;

  const books: Tile[] = entries.flatMap((e) =>
    e.type === "book"
      ? [{ key: e.slug, title: e.title, caption: e.author, href: href(e), image: inPublic(e.cover), alt: e.coverAlt }]
      : [],
  );
  const art: Tile[] = entries.flatMap((e) =>
    e.type === "painting" ? [{ key: e.slug, title: e.title, caption: e.caption, href: href(e), image: inPublic(e.image), alt: e.alt }] : [],
  );
  const activities: Tile[] = entries.flatMap((e) =>
    e.type === "movement"
      ? [{ key: e.slug, title: e.caption ?? e.title, href: href(e), image: inPublic(e.image), alt: e.alt ?? e.caption ?? e.title }]
      : [],
  );

  return (
    <div className="grid gap-12 md:grid-cols-3 md:gap-8">
      <TileColumn title="Books" count={plural(books.length, "book", "books")} tiles={books.length ? books : placeholders(["Book"])} />
      <TileColumn title="Art" count={plural(art.length, "painting", "paintings")} tiles={art.length ? art : placeholders(["Painting"])} reverse />
      <TileColumn title="Activities" count={plural(activities.length, "photo", "photos")} tiles={activities.length ? activities : emptySlots(3)} />
    </div>
  );
}
