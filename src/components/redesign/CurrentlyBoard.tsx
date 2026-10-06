"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { pageOf, type Scrap, type ScrapKind } from "@/lib/content/board";

// Currently as a scrapbook spread, after the Canva collage video: torn paper and graph
// paper go down first, then photos, tickets and stickers drop onto the page one by one.
// One spread holds SLOTS.length pieces; "turn the page" shows the next spread, so any
// number of items stays tidy.

type Slot = { l: number; t: number; w: number; a: string; r: number; z: number; s: number };

// Position (% of the board), width (% of board width), aspect ratio, tilt and stacking.
const SLOTS: Slot[] = [
  { l: 27, t: 9, w: 46, a: "5 / 4", r: -2, z: 5, s: 1.9 },
  { l: 2, t: 3, w: 25, a: "1 / 1", r: -3, z: 3, s: 1 },
  { l: 3, t: 47, w: 25, a: "4 / 5", r: 3, z: 3, s: 1 },
  { l: 72, t: 3, w: 25, a: "4 / 5", r: 3, z: 3, s: 1 },
  { l: 73, t: 51, w: 24, a: "1 / 1", r: -4, z: 3, s: 1 },
  { l: 33, t: 63, w: 26, a: "4 / 3", r: 2, z: 6, s: 1 },
  { l: 60, t: 71, w: 13, a: "1 / 1", r: -6, z: 7, s: 0.75 },
];

const filters: { id: "all" | ScrapKind; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "book", label: "Reading" },
  { id: "movie", label: "Watching" },
  { id: "trip", label: "Travel" },
  { id: "movement", label: "Moving" },
];

const kindLabel: Record<ScrapKind, string> = { book: "Reading", movie: "Watching", trip: "Travelling", movement: "Moving" };

// What a piece looks like depends on whether it has a picture and what it is.
function pieceStyle(item: Scrap): "polaroid" | "sticker" | "note" | "ticket" | "badge" {
  if (item.image) return item.kind === "trip" ? "polaroid" : "sticker";
  if (item.kind === "movie") return "ticket";
  if (item.kind === "movement") return "badge";
  return "note";
}

function Piece({ item, slot, index }: { item: Scrap; slot: Slot; index: number }) {
  const style = pieceStyle(item);
  const css = {
    left: `${slot.l}%`,
    top: `${slot.t}%`,
    width: `${slot.w}%`,
    aspectRatio: slot.a,
    zIndex: slot.z,
    "--r": `${slot.r}deg`,
    "--i": index,
    "--s": slot.s,
  } as CSSProperties;

  const inner = (
    <>
      {item.image && (
        <span className="cz-photo">
          <Image
            src={item.image}
            alt={item.alt ?? item.title}
            fill
            sizes="(max-width: 720px) 50vw, 30vw"
            className="object-cover"
          />
        </span>
      )}
      <span className="cz-text">
        <span className="label cz-kind">
          {kindLabel[item.kind]}
          {item.sample ? " · sample" : ""}
        </span>
        <span className="display cz-title">{item.title}</span>
        {item.meta && <span className="cz-meta">{item.meta}</span>}
        {item.note && !item.image && <span className="cz-note-text">&ldquo;{item.note}&rdquo;</span>}
      </span>
    </>
  );

  const className = `cz-piece cz-${style}`;
  return item.href ? (
    <Link href={item.href} className={className} style={css}>
      {inner}
    </Link>
  ) : (
    <div className={className} style={css}>
      {inner}
    </div>
  );
}

export function CurrentlyBoard({ items }: { items: Scrap[] }) {
  const [filter, setFilter] = useState<"all" | ScrapKind>("all");
  const [page, setPage] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => (filter === "all" ? items : items.filter((i) => i.kind === filter)), [items, filter]);
  const pages = Math.max(1, Math.ceil(filtered.length / SLOTS.length));
  const { shown } = pageOf(filtered.slice(page * SLOTS.length), SLOTS.length);

  // The board waits (hidden) until it scrolls into view, then every piece drops in on its
  // own delay. Nothing stays hidden if the observer is unavailable or never reports.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      board.dataset.in = "true";
      return;
    }
    board.dataset.armed = "true";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          board.dataset.in = "true";
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(board);
    const fallback = window.setTimeout(() => (board.dataset.in = "true"), 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [filter, page]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the scrapbook">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className="pill"
              aria-pressed={filter === f.id}
              onClick={() => {
                setFilter(f.id);
                setPage(0);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        {pages > 1 && (
          <div className="label flex items-center gap-3 text-ink-soft">
            <button type="button" className="cz-turn" disabled={page === 0} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              &larr;
            </button>
            Page {page + 1} of {pages}
            <button type="button" className="cz-turn" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              &rarr;
            </button>
          </div>
        )}
      </div>

      <div ref={boardRef} className="collage" key={`${filter}-${page}`}>
        {/* Backing paper that goes down first. */}
        <span className="cz-sheet cz-sheet-torn" aria-hidden="true" />
        <span className="cz-sheet cz-sheet-grid" aria-hidden="true" />
        {shown.map((item, i) => (
          <Piece key={item.id} item={item} slot={SLOTS[i]} index={i} />
        ))}
      </div>
    </section>
  );
}
