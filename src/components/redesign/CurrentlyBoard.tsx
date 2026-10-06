"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { pageOf, type Scrap, type ScrapKind } from "@/lib/content/board";

// The Currently page as a scrapbook: every book, film, trip and workout is a paper scrap
// that sticks onto the board as it scrolls into view (the Canva template's collage motion).
// A dense board is easy to scan because of the filter chips and the "show more" button.

const PAGE = 9;

const filters: { id: "all" | ScrapKind; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "book", label: "Reading" },
  { id: "movie", label: "Watching" },
  { id: "trip", label: "Travel" },
  { id: "movement", label: "Moving" },
];

// Same item always tilts the same way, so the board doesn't reshuffle on every render.
function tilt(index: number): number {
  const angles = [-2.2, 1.6, -0.8, 2.4, -1.5, 0.9];
  return angles[index % angles.length];
}

function ScrapPiece({ item, index }: { item: Scrap; index: number }) {
  const style = { "--r": `${tilt(index)}deg`, "--d": `${(index % 6) * 90}ms` } as CSSProperties;
  const body = (
    <>
      {item.kind === "trip" && item.image && (
        <Image
          src={item.image}
          alt={item.alt ?? item.title}
          width={480}
          height={600}
          sizes="(max-width: 640px) 90vw, 30vw"
          className="scrap-photo"
        />
      )}
      <span className="label scrap-kind">{{ book: "Reading", movie: "Watching", trip: "Travelling", movement: "Moving" }[item.kind]}</span>
      <span className="display scrap-title">{item.title}</span>
      {item.meta && <span className="scrap-meta">{item.meta}</span>}
      {item.note && <span className="scrap-note">&ldquo;{item.note}&rdquo;</span>}
      {item.sample && <span className="scrap-sample label">sample</span>}
    </>
  );

  const cls = `scrap scrap-${item.kind}`;
  return item.href ? (
    <Link href={item.href} className={cls} style={style} data-scrap>
      {body}
    </Link>
  ) : (
    <div className={cls} style={style} data-scrap>
      {body}
    </div>
  );
}

export function CurrentlyBoard({ items }: { items: Scrap[] }) {
  const [filter, setFilter] = useState<"all" | ScrapKind>("all");
  const [visible, setVisible] = useState(PAGE);
  const boardRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => (filter === "all" ? items : items.filter((i) => i.kind === filter)), [items, filter]);
  const { shown, remaining } = pageOf(filtered, visible);

  // Scraps stay visible until JS is ready; then each one waits off the board and sticks
  // on as it enters the viewport. Re-runs when the filter or page changes the scraps.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.dataset.armed = "true";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = board.querySelectorAll<HTMLElement>("[data-scrap]:not([data-in])");
    if (reduce) {
      nodes.forEach((n) => n.setAttribute("data-in", "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "true");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    nodes.forEach((n) => io.observe(n));
    // Safety net: if the observer never reports (some embedded browsers throttle it),
    // show everything rather than leave scraps invisible.
    const fallback = window.setTimeout(() => nodes.forEach((n) => n.setAttribute("data-in", "true")), 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [shown.length, filter]);

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the board">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className="pill"
            aria-pressed={filter === f.id}
            data-active={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setVisible(PAGE);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={boardRef} className="scrap-board" key={filter}>
        {shown.map((item, i) => (
          <ScrapPiece key={item.id} item={item} index={i} />
        ))}
      </div>

      {remaining > 0 && (
        <button type="button" className="btn label self-center" onClick={() => setVisible((v) => v + PAGE)}>
          Show {Math.min(PAGE, remaining)} more ({remaining} left)
        </button>
      )}
    </section>
  );
}
